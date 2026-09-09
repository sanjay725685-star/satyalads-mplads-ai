import { Constituency, WorkItem, WorkCategory, WorkStatus, RiskLevel, AnomalyFlag } from '../types';
import { CONSTITUENCIES, WORK_ITEMS } from '../data/mockData';
import generatedProjects from '../data/generatedProjects.json';

// Category mapping helper
function mapCategory(cat: string): WorkCategory {
  if (cat.includes('Road') || cat.includes('Bridge')) return 'Roads & Bridges';
  if (cat.includes('Water') || cat.includes('Drainage') || cat.includes('Drinking')) return 'Drinking Water';
  if (cat.includes('Community') || cat.includes('Hall') || cat.includes('Building')) return 'Community Infrastructure';
  if (cat.includes('Sanitation') || cat.includes('Waste') || cat.includes('Toilet')) return 'Sanitation';
  if (cat.includes('Education') || cat.includes('School') || cat.includes('Library')) return 'Education & Schools';
  if (cat.includes('Health') || cat.includes('Hospital') || cat.includes('Clinic')) return 'Healthcare';
  if (cat.includes('Solar') || cat.includes('Electrical') || cat.includes('Irrigation')) return 'Irrigation & Flood Control';
  return 'Community Infrastructure';
}

// Convert generated project record to full WorkItem
export function convertProjectToWorkItem(p: any): WorkItem {
  // Check if there is an existing rich WORK_ITEM match
  const existing = WORK_ITEMS.find(w => w.code === p.work_code || w.id === p.id);
  if (existing) {
    return existing;
  }

  const flags: AnomalyFlag[] = (p.flags || []).map((f: any, idx: number) => ({
    id: `FLAG-${p.work_code}-${idx}`,
    type: (f.type || 'SATELLITE_GHOST_WORK') as any,
    severity: f.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
    title: f.title || 'Audit Discrepancy Flag',
    description: f.description || 'Discrepancy detected by multi-modal AI sentinel.',
    confidence: f.confidence || 0.88,
    detectedAt: p.sanction_date || '2024-10-15'
  }));

  const riskLevel: RiskLevel = 
    p.risk_band === 'CRITICAL' ? 'CRITICAL' :
    p.risk_band === 'HIGH' ? 'HIGH' :
    p.risk_band === 'LOW' ? 'LOW' : 'MEDIUM';

  const wiriScore = Math.round(p.risk_score || (riskLevel === 'CRITICAL' ? 88 : riskLevel === 'HIGH' ? 65 : 25));

  const status: WorkStatus = 
    p.workflow_status === 'CLEARED' ? 'COMPLETED' :
    p.workflow_status === 'ESCALATED' ? 'LANGUISHING' : 'IN_PROGRESS';

  return {
    id: p.id || p.work_code,
    code: p.work_code || p.id,
    title: p.title,
    description: `${p.title} in ${p.district || p.constituency_name}, ${p.state} sanctioned under MPLADS.`,
    category: mapCategory(p.category || ''),
    constituencyId: p.constituency_id,
    locationName: `${p.district || p.constituency_name}, ${p.state}`,
    lat: p.latitude || 25.3176,
    lng: p.longitude || 82.9739,
    demographicZone: 'GENERAL',
    sanctionedAmountLakhs: p.sanctioned_cost_lakhs || 50.0,
    utilizedAmountLakhs: p.expenditure_lakhs || 35.0,
    sanctionDate: p.sanction_date || '2024-04-01',
    targetCompletionDate: p.target_completion_date || '2025-03-31',
    actualCompletionDate: status === 'COMPLETED' ? p.target_completion_date : undefined,
    status,
    implementingAgency: 'District Rural Development Agency (DRDA)',
    contractorName: p.contractor_name || 'Government Empanelled Contractor',
    contractorGstin: p.contractor_gstin || '09AAACG1234F1Z1',
    wiriScore,
    riskLevel,
    anomaliesCount: flags.length,
    flags,
    satelliteScanId: p.photo_verification ? `SAT-${p.work_code}` : undefined,
    dprId: `DPR-${p.work_code}`
  };
}

// All 320 projects converted to WorkItem
export const ALL_320_WORK_ITEMS: WorkItem[] = (generatedProjects as any[]).map(convertProjectToWorkItem);

// Helper: Get all unique states
export const ALL_STATES: string[] = Array.from(new Set(CONSTITUENCIES.map(c => c.state))).sort();

// Helper: Get constituencies by state
export function getConstituenciesByState(state: string): Constituency[] {
  if (!state || state === 'ALL') return CONSTITUENCIES;
  return CONSTITUENCIES.filter(c => c.state.toLowerCase() === state.toLowerCase());
}

// Helper: Get works by constituency ID or Name
export function getWorksForConstituency(constituencyIdOrName: string): WorkItem[] {
  const norm = constituencyIdOrName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return ALL_320_WORK_ITEMS.filter(w => {
    const cIdNorm = (w.constituencyId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const locNorm = (w.locationName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return cIdNorm.includes(norm) || norm.includes(cIdNorm) || locNorm.includes(norm);
  });
}

// Helper: Get works by state
export function getWorksForState(state: string): WorkItem[] {
  if (!state || state === 'ALL') return ALL_320_WORK_ITEMS;
  const consts = getConstituenciesByState(state);
  const cIds = new Set(consts.map(c => c.id));
  return ALL_320_WORK_ITEMS.filter(w => cIds.has(w.constituencyId) || w.locationName.toLowerCase().includes(state.toLowerCase()));
}
