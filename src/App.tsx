import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileCaptureApp } from './components/MobileCaptureApp';
import { QRCodeHandoffModal } from './components/QRCodeHandoffModal';
import { AIDetectionExplainerModal } from './components/AIDetectionExplainerModal';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ProjectListView } from './components/ProjectListView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { AuditReportView } from './components/AuditReportView';
import { GISMap } from './components/GISMap';
import { CitizenPortal } from './components/CitizenPortal';
import { BeforeAfterSliderView } from './components/BeforeAfterSliderView';
import { PublicTransparencyView } from './components/PublicTransparencyView';
import { CartelGraph } from './components/CartelGraph';
import { SatelliteInspector } from './components/SatelliteInspector';
import { CONSTITUENCIES, WORK_ITEMS } from './data/mockData';
import { ALL_320_WORK_ITEMS, getWorksForConstituency } from './utils/projectAdapter';
import { Constituency, WorkItem, ProjectRecord, UserSession, UserRole, Language, NotificationItem } from './types';
import { api } from './services/api';
import { Sparkles, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'landing' | 'login'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userSession, setUserSession] = useState<UserSession>({
    username: 'auditor_varanasi',
    role: 'auditor',
    title: 'District Vigilance Auditor (DM Cell)',
    state_jurisdiction: 'Uttar Pradesh',
    token: ''
  });

  // Check if direct mobile capture route requested (/capture/:workCode, #/capture/:workCode, or ?capture=...)
  const parseDirectCaptureCode = (): string | null => {
    if (typeof window === 'undefined') return null;
    const path = window.location.pathname;
    if (path.startsWith('/capture/')) {
      return decodeURIComponent(path.replace('/capture/', ''));
    }
    const hash = window.location.hash;
    if (hash.startsWith('#/capture/')) {
      return decodeURIComponent(hash.replace('#/capture/', ''));
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('capture') || params.get('mode') === 'capture') {
      return params.get('workCode') || params.get('capture') || 'MPLADS/2024-25/UP-VAR-0104';
    }
    return null;
  };

  const [directCaptureCode, setDirectCaptureCode] = useState<string | null>(parseDirectCaptureCode());

  // Modals
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [qrWorkCode, setQrWorkCode] = useState<string>('MPLADS/2024-25/UP-VAR-0104');
  const [isAIExplainerOpen, setIsAIExplainerOpen] = useState<boolean>(false);
  const [aiExplainerWorkCode, setAiExplainerWorkCode] = useState<string>('MPLADS/2024-25/UP-VAR-0104');

  // Handle URL hash and feature routes changes
  useEffect(() => {
    const handleUrlChange = () => {
      setDirectCaptureCode(parseDirectCaptureCode());
      
      // Check feature deep routes
      const p = window.location.pathname;
      if (p.includes('/features/detection-engine')) {
        window.location.hash = '#detection-engine';
      } else if (p.includes('/features/geotag-verification')) {
        window.location.hash = '#geotag-verification';
      } else if (p.includes('/compliance/gfr-2017')) {
        window.location.hash = '#gfr-citations';
      }
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Localization & Accessibility
  const [lang, setLang] = useState<Language>('en');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Active Project Selection
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
  const [viewingReportProject, setViewingReportProject] = useState<ProjectRecord | null>(null);

  // Scan & Notifications
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);

  // Legacy state for compatibility with existing GISMap & SatelliteInspector
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency>(CONSTITUENCIES[0]);
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(WORK_ITEMS[0]);
  const [isAllIndiaView, setIsAllIndiaView] = useState<boolean>(false);

  const activeWorks = React.useMemo(() => {
    if (isAllIndiaView) return ALL_320_WORK_ITEMS;
    const cWorks = getWorksForConstituency(selectedConstituency.id);
    if (cWorks.length > 0) return cWorks;
    const filtered = ALL_320_WORK_ITEMS.filter(w => w.constituencyId === selectedConstituency.id);
    return filtered.length > 0 ? filtered : WORK_ITEMS;
  }, [selectedConstituency.id, isAllIndiaView]);

  useEffect(() => {
    api.getNotifications().then(res => setNotifications(res.notifications));
    // Load first project
    api.getProjects({ limit: 1 }).then(res => {
      if (res.projects.length > 0) {
        setSelectedProject(res.projects[0]);
      }
    });
  }, []);

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('landing');
    setUserSession({
      username: '',
      role: 'auditor',
      title: '',
      state_jurisdiction: '',
      token: ''
    });
  };

  const handleTriggerScan = async () => {
    setIsScanning(true);
    setScanNotice('AI Sentinel batch scan initiated across all 320 projects in 25 constituencies...');
    try {
      const res = await api.triggerBatchAnalysis();
      setScanNotice(`Detection scan completed. Scanned: ${res.scanned_projects} projects | Critical anomalies: ${res.critical_anomalies_detected}`);
      // Refresh notifications
      const notifs = await api.getNotifications();
      setNotifications(notifs.notifications);
    } catch (err) {
      console.error(err);
      setScanNotice('AI Sentinel re-scan completed in offline cache mode.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanNotice(null), 6000);
    }
  };

  const handleSelectProjectToInspect = (project: ProjectRecord) => {
    setSelectedProject(project);
    setActiveTab('project_detail');
  };

  const handleOpenReport = (project: ProjectRecord) => {
    setViewingReportProject(project);
    setActiveTab('report');
  };

  // Direct Mobile Capture View (Unauthenticated Standalone for On-Site Field Work)
  if (directCaptureCode) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <MobileCaptureApp
          workCode={directCaptureCode}
          onBackToPortal={() => {
            try {
              window.history.pushState({}, '', '/');
            } catch {}
            setDirectCaptureCode(null);
          }}
          lang={lang}
        />
      </div>
    );
  }

  // If not authenticated, show Landing or Login
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
          <LandingPage
            onEnterApp={() => setAuthView('login')}
            lang={lang}
          />
          <Footer lang={lang} />
        </div>
      );
    }
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          lang={lang}
        />
        <Footer lang={lang} />
      </div>
    );
  }

  // Report Full-Page View
  if (activeTab === 'report' && viewingReportProject) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F7FA]">
        <AuditReportView
          project={viewingReportProject}
          onBack={() => setActiveTab('project_detail')}
          lang={lang}
        />
        <Footer lang={lang} />
      </div>
    );
  }

  const fontScaleClass = fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm';

  return (
    <div className={`min-h-screen bg-[#F5F7FA] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#0B3D91] selection:text-white ${fontScaleClass}`}>
      {/* Top GIGW Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userSession.role}
        userTitle={userSession.title}
        lang={lang}
        setLang={setLang}
        onLogout={handleLogout}
        notificationCount={notifications.length}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onOpenAIDetectionExplainer={() => setIsAIExplainerOpen(true)}
        onOpenQRHandoff={() => {
          setQrWorkCode(selectedProject ? selectedProject.work_code : 'MPLADS/2024-25/UP-VAR-0104');
          setIsQRModalOpen(true);
        }}
        selectedConstituency={selectedConstituency}
        onSelectConstituency={(c) => {
          setSelectedConstituency(c);
          setIsAllIndiaView(false);
        }}
      />

      {/* Live AI Scan Notification Banner */}
      {scanNotice && (
        <div className="bg-amber-50 border-b border-amber-300 text-[#002244] px-4 py-2 text-xs flex items-center justify-center gap-2 font-mono shadow-sm">
          <Sparkles className="w-4 h-4 animate-spin text-[#FF9933]" />
          <span className="font-semibold">{scanNotice}</span>
        </div>
      )}

      {/* Notifications Drawer */}
      {isNotifDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-slate-300 h-full p-6 space-y-4 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-[#002244] text-base font-serif">Critical Audit Alerts</h3>
              </div>
              <button
                onClick={() => setIsNotifDrawerOpen(false)}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center text-slate-500 text-xs py-8">
                  No unacknowledged critical alerts.
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="bg-red-50/50 border border-red-200 rounded p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#0B3D91] font-bold">{n.work_code}</span>
                      <span className="text-[10px] font-mono text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded">
                        {n.severity}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900">{n.title}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{n.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-red-100">
                      Logged: {n.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Views Router with Accessibility Anchor */}
      <main id="main-content" className="flex-1 pb-10">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            constituency={selectedConstituency}
            works={activeWorks}
            onSelectWork={(w) => {
              setSelectedWork(w);
              setActiveTab('gis_map');
            }}
            onNavigateTab={setActiveTab}
            onTriggerScan={handleTriggerScan}
            allConstituencies={CONSTITUENCIES}
            onSelectConstituency={(c) => {
              setSelectedConstituency(c);
              setIsAllIndiaView(false);
              const works = getWorksForConstituency(c.id);
              if (works.length > 0) setSelectedWork(works[0]);
            }}
            isAllIndiaView={isAllIndiaView}
            onToggleAllIndia={(val) => setIsAllIndiaView(val)}
            lang={lang}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectListView
            onSelectProject={handleSelectProjectToInspect}
            lang={lang}
          />
        )}

        {activeTab === 'project_detail' && selectedProject && (
          <ProjectDetailView
            project={selectedProject}
            onBack={() => setActiveTab('projects')}
            onOpenReport={handleOpenReport}
            lang={lang}
          />
        )}

        {activeTab === 'gis_map' && (
          <GISMap
            constituency={selectedConstituency}
            works={activeWorks.length > 0 ? activeWorks : WORK_ITEMS}
            selectedWork={selectedWork}
            onSelectWork={(w) => setSelectedWork(w)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'capture_photo' && (
          <CitizenPortal 
            onOpenQRHandoff={(code) => {
              setQrWorkCode(code || 'MPLADS/2024-25/UP-VAR-0104');
              setIsQRModalOpen(true);
            }}
            onOpenAIDetectionExplainer={() => setIsAIExplainerOpen(true)}
          />
        )}

        {activeTab === 'mobile_capture' && (
          <div className="py-6 px-4 max-w-md mx-auto">
            <MobileCaptureApp
              workCode={qrWorkCode}
              onBackToPortal={() => setActiveTab('capture_photo')}
              lang={lang}
            />
          </div>
        )}

        {activeTab === 'before_after' && (
          <BeforeAfterSliderView
            lang={lang}
          />
        )}

        {activeTab === 'transparency' && (
          <PublicTransparencyView
            lang={lang}
          />
        )}

        {activeTab === 'cartels' && (
          <CartelGraph />
        )}

        {activeTab === 'satellite' && (
          <SatelliteInspector
            works={WORK_ITEMS}
            selectedWork={selectedWork || WORK_ITEMS[0]}
            onSelectWork={(w) => setSelectedWork(w)}
          />
        )}
      </main>

      {/* Desktop-to-Phone QR Handoff Modal */}
      <QRCodeHandoffModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        initialWorkCode={qrWorkCode}
        onOpenSimulator={(code) => {
          setQrWorkCode(code);
          setActiveTab('mobile_capture');
        }}
      />

      {/* How AI Detection Works Explainer & Playground Modal */}
      <AIDetectionExplainerModal
        isOpen={isAIExplainerOpen}
        onClose={() => setIsAIExplainerOpen(false)}
        initialWorkCode={aiExplainerWorkCode}
      />

      {/* Official Government of India GIGW Footer */}
      <Footer lang={lang} />
    </div>
  );
};

export default App;
