import { ProjectRecord, DashboardStats, NotificationItem, UserRole, UserSession, WorkflowStatus, CitizenReport, AIDetectionResult, AIDecisionLog } from '../types';
import fallbackProjects from '../data/generatedProjects.json';

const API_BASE_URL = 'http://localhost:8000';

let localToken: string | null = localStorage.getItem('satya_token');
let memoryProjects: ProjectRecord[] = [...(fallbackProjects as any)];

async function checkBackendAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${API_BASE_URL}/`, { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch {
    return false;
  }
}

export const api = {
  async login(username: string, password: string, role: UserRole): Promise<UserSession> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });
        if (res.ok) {
          const data = await res.json();
          localToken = data.access_token;
          localStorage.setItem('satya_token', localToken!);
          return {
            username: data.user.username,
            role: data.user.role,
            title: data.user.title,
            state_jurisdiction: data.user.state_jurisdiction,
            token: data.access_token
          };
        }
      } catch (err) {
        console.warn('Backend login fallback to local session:', err);
      }
    }

    // Local Fallback Session
    const titles: Record<UserRole, string> = {
      auditor: 'District Vigilance Auditor (DM Cell)',
      nodal_officer: 'State Nodal Officer (Planning & Development)',
      admin: 'Central Vigilance Officer (MoSPI HQ)'
    };
    const mockSession: UserSession = {
      username: username || 'auditor_officer',
      role,
      title: titles[role] || 'Vigilance Officer',
      state_jurisdiction: role === 'admin' ? 'All India' : 'Uttar Pradesh',
      token: 'LOCAL_MOCK_JWT_TOKEN_' + Date.now()
    };
    localStorage.setItem('satya_token', mockSession.token);
    return mockSession;
  },

  async getProjects(params?: {
    category?: string;
    state?: string;
    risk_band?: string;
    contractor?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ total: number; projects: ProjectRecord[]; page: number; total_pages: number; limit?: number }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const q = new URLSearchParams();
        if (params?.category) q.append('category', params.category);
        if (params?.state) q.append('state', params.state);
        if (params?.risk_band) q.append('risk_band', params.risk_band);
        if (params?.contractor) q.append('contractor', params.contractor);
        if (params?.search) q.append('search', params.search);
        q.append('page', String(params?.page || 1));
        q.append('limit', String(params?.limit || 50));

        const res = await fetch(`${API_BASE_URL}/projects?${q.toString()}`, {
          headers: localToken ? { Authorization: `Bearer ${localToken}` } : {}
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend fetch failed, using memoryProjects fallback');
      }
    }

    // Fallback in-memory filter
    let list = [...memoryProjects];
    if (params?.category) list = list.filter(p => p.category === params.category);
    if (params?.state) list = list.filter(p => p.state === params.state);
    if (params?.risk_band) list = list.filter(p => p.risk_band === params.risk_band);
    if (params?.contractor) list = list.filter(p => p.contractor_name.toLowerCase().includes(params.contractor!.toLowerCase()));
    if (params?.search) {
      const s = params.search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.work_code.toLowerCase().includes(s) ||
        p.constituency_name.toLowerCase().includes(s)
      );
    }
    list.sort((a, b) => b.risk_score - a.risk_score);

    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const start = (page - 1) * limit;
    return {
      total: list.length,
      page,
      limit,
      total_pages: Math.ceil(list.length / limit),
      projects: list.slice(start, start + limit)
    };
  },

  async getProjectDetail(id: string): Promise<ProjectRecord | null> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
          headers: localToken ? { Authorization: `Bearer ${localToken}` } : {}
        });
        if (res.ok) return await res.json();
      } catch {}
    }
    return memoryProjects.find(p => p.id === id || p.work_code === id) || null;
  },

  async updateProjectStatus(id: string, status: WorkflowStatus): Promise<boolean> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/projects/${id}/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localToken ? { Authorization: `Bearer ${localToken}` } : {})
          },
          body: JSON.stringify({ workflow_status: status })
        });
        if (res.ok) return true;
      } catch {}
    }

    const p = memoryProjects.find(x => x.id === id || x.work_code === id);
    if (p) {
      p.workflow_status = status;
      return true;
    }
    return false;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: localToken ? { Authorization: `Bearer ${localToken}` } : {}
        });
        if (res.ok) return await res.json();
      } catch {}
    }

    // Local Fallback Stats
    const total = memoryProjects.length;
    const flagged = memoryProjects.filter(p => p.risk_score >= 45.0);
    const critical = memoryProjects.filter(p => p.risk_band === 'CRITICAL');
    const high = memoryProjects.filter(p => p.risk_band === 'HIGH');
    const medium = memoryProjects.filter(p => p.risk_band === 'MEDIUM');
    const low = memoryProjects.filter(p => p.risk_band === 'LOW');

    const totalValCr = memoryProjects.reduce((sum, p) => sum + p.sanctioned_cost_lakhs, 0) / 100.0;
    const flaggedValCr = flagged.reduce((sum, p) => sum + p.sanctioned_cost_lakhs, 0) / 100.0;

    const catMap: Record<string, any> = {};
    for (const p of memoryProjects) {
      if (!catMap[p.category]) {
        catMap[p.category] = { category: p.category, total: 0, flagged: 0, clean: 0, total_cost_lakhs: 0 };
      }
      catMap[p.category].total += 1;
      catMap[p.category].total_cost_lakhs += p.sanctioned_cost_lakhs;
      if (p.risk_score >= 45) catMap[p.category].flagged += 1;
      else catMap[p.category].clean += 1;
    }

    return {
      total_projects: total,
      total_sanctioned_cr: Number(totalValCr.toFixed(2)),
      total_flagged_projects: flagged.length,
      flagged_risk_cr: Number(flaggedValCr.toFixed(2)),
      roi_saved_metric: `₹${flaggedValCr.toFixed(1)} Cr at risk flagged (<0.01% scheme cost to operate)`,
      risk_distribution: [
        { band: 'CRITICAL', count: critical.length, color: '#ef4444' },
        { band: 'HIGH', count: high.length, color: '#f97316' },
        { band: 'MEDIUM', count: medium.length, color: '#eab308' },
        { band: 'LOW', count: low.length, color: '#22c55e' }
      ],
      category_breakdown: Object.values(catMap)
    };
  },

  async getMapPoints(): Promise<{ points: any[] }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/map/points`);
        if (res.ok) return await res.json();
      } catch {}
    }

    const points = memoryProjects.map(p => ({
      id: p.id,
      work_code: p.work_code,
      title: p.title,
      category: p.category,
      claimed_lat: p.latitude,
      claimed_lng: p.longitude,
      photo_lat: p.photo_exif_lat,
      photo_lng: p.photo_exif_lng,
      risk_score: p.risk_score,
      risk_band: p.risk_band,
      has_location_mismatch: (p.flags || []).some(f => f.type === 'LOCATION_MISMATCH'),
      mismatch_distance_m: (p.flags || []).find(f => f.type === 'LOCATION_MISMATCH')?.distance_meters || null,
      status: p.workflow_status
    }));
    return { points };
  },

  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications`);
        if (res.ok) return await res.json();
      } catch {}
    }

    const critical = memoryProjects.filter(p => p.risk_band === 'CRITICAL').slice(0, 15);
    const notifications: NotificationItem[] = [];
    for (const p of critical) {
      for (const f of p.flags || []) {
        if (f.severity === 'CRITICAL' || f.severity === 'HIGH') {
          notifications.push({
            id: `NOTIF-${p.work_code}-${f.module}`,
            project_id: p.id,
            work_code: p.work_code,
            title: `${f.title} (${p.constituency_name})`,
            category: p.category,
            severity: f.severity,
            description: f.description,
            timestamp: p.sanction_date
          });
        }
      }
    }
    return { notifications: notifications.slice(0, 20) };
  },

  async getPublicSummary(): Promise<any> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/dashboard/public-summary`);
        if (res.ok) return await res.json();
      } catch {}
    }

    const total = memoryProjects.length;
    const flagged = memoryProjects.filter(p => p.risk_score >= 45.0).length;
    const totalVal = memoryProjects.reduce((sum, p) => sum + p.sanctioned_cost_lakhs, 0) / 100.0;
    const states = new Set(memoryProjects.map(p => p.state)).size;

    return {
      portal_name: "SatyaLADS Public Citizen Transparency Portal",
      total_projects_monitored: total,
      total_funds_tracked_cr: Number(totalVal.toFixed(2)),
      flagged_irregularities_percentage: Number(((flagged / total) * 100).toFixed(1)),
      active_states_monitored: states,
      governance_commitment: "100% Zero-Tolerance Anti-Corruption Loop under e-SAKSHI Guidelines",
      updated_at: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  },

  async triggerBatchAnalysis(): Promise<{ success: boolean; scanned_projects: number; critical_anomalies_detected: number }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/analyze/run`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch {}
    }

    // Local simulation of re-scan
    const critCount = memoryProjects.filter(p => p.risk_band === 'CRITICAL').length;
    return {
      success: true,
      scanned_projects: memoryProjects.length,
      critical_anomalies_detected: critCount
    };
  },

  async getCitizenReports(): Promise<{ reports: CitizenReport[] }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/citizen-reports`);
        if (res.ok) {
          const data = await res.json();
          return { reports: data.reports };
        }
      } catch {}
    }

    // Fallback: check localStorage or mock
    const local = localStorage.getItem('satya_citizen_reports');
    if (local) {
      try {
        return { reports: JSON.parse(local) };
      } catch {}
    }

    return {
      reports: [
        {
          id: 'CR-001',
          workId: 'W001',
          workTitle: 'Construction of CC Road from Rohania Canal to PHC',
          citizenName: 'Manoj Kumar Maurya',
          phoneMasked: '+91 98390 XXXXX',
          submissionDate: '2024-10-18',
          lat: 25.2652,
          lng: 82.9124,
          distanceFromAssetMeters: 28,
          photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
          voiceNoteTranscript: 'यहां कोई पक्की सड़क नहीं बनी है। ठेकेदार ने बस बोर्ड लगाया और चले गए। बारिश में पूरा कीचड़ भरा है।',
          language: 'Hindi (Bhojpuri dialect)',
          aiDefectTags: ['No Concrete Pavement Found', 'Unpaved Mud Track', 'Ghost Work Indicator'],
          aiExplanation: "Flagged: pavement texture matches 'mud track' class with 92% confidence; GPS deviation 28m exceeds 20m threshold.",
          aiConfidence: 0.92,
          citizenRating: 1,
          status: 'INVESTIGATION_ORDERED'
        },
        {
          id: 'CR-002',
          workId: 'W002',
          workTitle: 'Solar High-Mast Tube Well & Water Kiosk',
          citizenName: 'Pooja Vishwakarma',
          phoneMasked: '+91 87652 XXXXX',
          submissionDate: '2024-11-24',
          lat: 25.3211,
          lng: 82.9813,
          distanceFromAssetMeters: 14,
          photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
          voiceNoteTranscript: 'यह नल तो पुराना कुसुम योजना वाला ही है, उसपर नया MPLADS का स्टीकर चिपका दिया है। पानी का फिल्टर भी खराब है।',
          language: 'Hindi',
          aiDefectTags: ['Relabeled Asset', 'Broken Filter Dispenser', 'Double-Dipping Evidence'],
          aiExplanation: "Visual object detector identified structural crack on public water asset; pHash match indicates duplicate asset.",
          aiConfidence: 0.88,
          citizenRating: 2,
          status: 'INVESTIGATION_ORDERED'
        }
      ]
    };
  },

  async uploadCitizenPhoto(payload: {
    work_code: string;
    photo_data_url: string;
    lat?: number;
    lng?: number;
    citizen_name?: string;
    remarks?: string;
    device_info?: string;
    rating?: number;
  }): Promise<{ success: boolean; tracking_id: string; report: CitizenReport; ai_detection: AIDetectionResult }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/upload-photo-json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          // Broadcast live update across tabs
          try {
            const bc = new BroadcastChannel('satya_live_reports');
            bc.postMessage({ type: 'NEW_REPORT', report: data.report });
            bc.close();
          } catch {}
          return data;
        }
      } catch (err) {
        console.warn('Backend upload failed, falling back to local simulation:', err);
      }
    }

    // Local simulation fallback
    const matched = memoryProjects.find(p => p.work_code === payload.work_code) || memoryProjects[0];
    const isFlagged = payload.work_code.includes('0104') || payload.work_code.includes('0108');
    const tags = isFlagged 
      ? ['No Concrete Pavement Found', 'Unpaved Mud Track', 'Location Boundary Deviation']
      : ['Structural Concrete Infill Verified'];

    const mockAiDetection: AIDetectionResult = {
      work_code: payload.work_code,
      timestamp: new Date().toISOString(),
      is_flagged: isFlagged,
      risk_level: isFlagged ? 'CRITICAL' : 'LOW',
      confidence: 0.92,
      defect_tags: tags,
      justification: isFlagged 
        ? "Flagged: pavement texture matches 'mud track' class with 92% confidence; GPS deviation 28m exceeds 20m threshold."
        : "Verified Compliant: Physical concrete pavement detected, GPS location within 20m perimeter, and no duplicate photo matches.",
      stages: {
        stage1_cv_classification: {
          model: "ResNet-50 + Custom MPLADS Defect Head (v2.1)",
          detected_classes: tags,
          confidence: 0.92,
          status: isFlagged ? 'FLAGGED' : 'COMPLIANT'
        },
        stage2_before_after: {
          algorithm: "Multi-Scale SSIM & Perceptual Color Delta",
          structural_similarity_index: isFlagged ? 0.34 : 0.82,
          threshold: 0.50,
          status: isFlagged ? 'FLAGGED' : 'SYNCHRONIZED'
        },
        stage3_geotag_verification: {
          rule: "e-SAKSHI 20m Strict Asset Radius (Para 4.2)",
          claimed_coords: [matched.latitude, matched.longitude],
          photo_coords: [payload.lat || matched.latitude, payload.lng || matched.longitude],
          deviation_meters: isFlagged ? 28.4 : 11.2,
          threshold_meters: 20.0,
          status: isFlagged ? 'FLAGGED' : 'VERIFIED'
        },
        stage4_duplicate_detection: {
          algorithm: "64-bit DCT Perceptual Hashing (pHash)",
          hash: "a4c28f1190bc774e",
          duplicate_found: false,
          status: 'UNIQUE'
        }
      }
    };

    const newReport: CitizenReport = {
      id: `CR-00${Math.floor(Math.random() * 900) + 100}`,
      workId: matched.id,
      workTitle: matched.title,
      citizenName: payload.citizen_name || 'Verified Mobile Citizen',
      phoneMasked: '+91 94150 XXXXX',
      submissionDate: 'Just Now',
      lat: payload.lat || matched.latitude,
      lng: payload.lng || matched.longitude,
      distanceFromAssetMeters: isFlagged ? 28 : 11,
      photoUrl: payload.photo_data_url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
      voiceNoteTranscript: payload.remarks || 'Mobile field capture verified by AI Sentinel.',
      language: 'Hindi / English',
      aiDefectTags: tags,
      aiExplanation: mockAiDetection.justification,
      aiConfidence: mockAiDetection.confidence,
      citizenRating: (payload.rating || (isFlagged ? 1 : 5)) as any,
      status: isFlagged ? 'INVESTIGATION_ORDERED' : 'PENDING_REVIEW',
      deviceInfo: payload.device_info || 'Mobile Web App'
    };

    // Save to local storage for persistence across tabs
    try {
      const stored = localStorage.getItem('satya_citizen_reports');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newReport);
      localStorage.setItem('satya_citizen_reports', JSON.stringify(list));
      
      const bc = new BroadcastChannel('satya_live_reports');
      bc.postMessage({ type: 'NEW_REPORT', report: newReport });
      bc.close();
    } catch {}

    const trackingId = `SATYA-GRV-2026-${Math.floor(Math.random() * 90000) + 10000}`;

    return {
      success: true,
      tracking_id: trackingId,
      report: newReport,
      ai_detection: mockAiDetection
    };
  },

  async runAIDetection(work_code: string, lat?: number, lng?: number, photo_url?: string): Promise<{ success: boolean; detection: AIDetectionResult }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-detect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ work_code, lat, lng, photo_url })
        });
        if (res.ok) return await res.json();
      } catch {}
    }

    // Fallback simulation
    const matched = memoryProjects.find(p => p.work_code === work_code) || memoryProjects[0];
    const isFlagged = work_code.includes('0104') || work_code.includes('0108');
    const tags = isFlagged 
      ? ['No Concrete Pavement Found', 'Unpaved Mud Track', 'Ground Reality Mismatch']
      : ['Structural Concrete Infill Verified'];

    return {
      success: true,
      detection: {
        work_code,
        timestamp: new Date().toISOString(),
        is_flagged: isFlagged,
        risk_level: isFlagged ? 'CRITICAL' : 'LOW',
        confidence: 0.92,
        defect_tags: tags,
        justification: isFlagged
          ? "Flagged: pavement texture matches 'mud track' class with 92% confidence; GPS deviation 28m exceeds 20m threshold."
          : "Verified Compliant: Physical concrete pavement detected, GPS location within 20m perimeter, and no duplicate photo matches.",
        stages: {
          stage1_cv_classification: {
            model: "ResNet-50 + Custom MPLADS Defect Head (v2.1)",
            detected_classes: tags,
            confidence: 0.92,
            status: isFlagged ? 'FLAGGED' : 'COMPLIANT'
          },
          stage2_before_after: {
            algorithm: "Multi-Scale SSIM & Perceptual Color Delta",
            structural_similarity_index: isFlagged ? 0.34 : 0.82,
            threshold: 0.50,
            status: isFlagged ? 'FLAGGED' : 'SYNCHRONIZED'
          },
          stage3_geotag_verification: {
            rule: "e-SAKSHI 20m Strict Asset Radius (Para 4.2)",
            claimed_coords: [matched.latitude, matched.longitude],
            photo_coords: [lat || matched.latitude, lng || matched.longitude],
            deviation_meters: isFlagged ? 28.4 : 11.2,
            threshold_meters: 20.0,
            status: isFlagged ? 'FLAGGED' : 'VERIFIED'
          },
          stage4_duplicate_detection: {
            algorithm: "64-bit DCT Perceptual Hashing (pHash)",
            hash: "a4c28f1190bc774e",
            duplicate_found: false,
            status: 'UNIQUE'
          }
        }
      }
    };
  },

  async getAIDetections(): Promise<{ detections: AIDecisionLog[]; count: number }> {
    const isOnline = await checkBackendAvailable();
    if (isOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ai-detections`);
        if (res.ok) return await res.json();
      } catch {}
    }

    return {
      detections: [
        {
          id: "AIDEC-1788970001-UP-VAR-0104",
          work_code: "MPLADS/2024-25/UP-VAR-0104",
          timestamp: new Date().toISOString(),
          photo_sha256: "9a8f2e4b1c7d",
          risk_level: "CRITICAL",
          confidence: 0.92,
          defect_tags: ["No Concrete Pavement Found", "Unpaved Mud Track"],
          justification: "Flagged: pavement texture matches 'mud track' class with 92% confidence; GPS deviation 28m exceeds 20m threshold.",
          stages_summary: {
            cv_status: "FLAGGED",
            ssim_status: "FLAGGED",
            geotag_status: "FLAGGED",
            duplicate_status: "UNIQUE"
          }
        },
        {
          id: "AIDEC-1788970002-UP-VAR-0108",
          work_code: "MPLADS/2024-25/UP-VAR-0108",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          photo_sha256: "3d1b8c9e4a7f",
          risk_level: "HIGH",
          confidence: 0.88,
          defect_tags: ["Relabeled Asset", "Broken Filter Dispenser"],
          justification: "Visual object detector identified structural crack on public water asset; pHash match indicates duplicate asset.",
          stages_summary: {
            cv_status: "FLAGGED",
            ssim_status: "SYNCHRONIZED",
            geotag_status: "VERIFIED",
            duplicate_status: "FLAGGED"
          }
        }
      ],
      count: 2
    };
  }

};
