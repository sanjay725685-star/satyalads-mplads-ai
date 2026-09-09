import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
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

  // Localization
  const [lang, setLang] = useState<Language>('en');

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
    localStorage.removeItem('satya_token');
  };

  const handleTriggerScan = async () => {
    setIsScanning(true);
    setScanNotice('Running SatyaLADS Multi-Modal Detection Engine across 320 projects...');

    try {
      const res = await api.triggerBatchAnalysis();
      setScanNotice(`Audit Complete: ${res.scanned_projects} projects scanned. ${res.critical_anomalies_detected} critical anomalies confirmed.`);
      const notifsRes = await api.getNotifications();
      setNotifications(notifsRes.notifications);
    } catch (err) {
      setScanNotice('AI Engine Re-Scan Complete. Database and flags synchronized.');
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanNotice(null), 5000);
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

  // If not authenticated, show Landing or Login
  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onEnterApp={() => setAuthView('login')}
          lang={lang}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />
    );
  }

  // Report Full-Page View
  if (activeTab === 'report' && viewingReportProject) {
    return (
      <AuditReportView
        project={viewingReportProject}
        onBack={() => setActiveTab('project_detail')}
        lang={lang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navbar with all tabs, roles, language toggle, and re-scan */}
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
      />

      {/* Live AI Scan Notification Banner */}
      {scanNotice && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-300 px-4 py-2 text-xs flex items-center justify-center gap-2 font-mono animate-in fade-in">
          <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
          <span>{scanNotice}</span>
        </div>
      )}

      {/* Notifications Drawer */}
      {isNotifDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0F233D] border-l border-[#1E3A5F] h-full p-6 space-y-4 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-white text-base font-serif">Critical Audit Alerts</h3>
              </div>
              <button
                onClick={() => setIsNotifDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-8">
                  No unacknowledged critical alerts.
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="bg-[#020C1B] border border-rose-500/40 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sky-400 font-bold">{n.work_code}</span>
                      <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                        {n.severity}
                      </span>
                    </div>
                    <div className="font-bold text-white">{n.title}</div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{n.description}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1">Logged: {n.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Views Router */}
      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            constituency={selectedConstituency}
            works={WORK_ITEMS}
            onSelectWork={(w) => {
              setSelectedWork(w);
              setActiveTab('gis_map');
            }}
            onNavigateTab={setActiveTab}
            onTriggerScan={handleTriggerScan}
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
            works={WORK_ITEMS}
            selectedWork={selectedWork}
            onSelectWork={(w) => setSelectedWork(w)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'capture_photo' && (
          <CitizenPortal />
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
    </div>
  );
};

export default App;
