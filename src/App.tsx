import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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

      {/* Official Government of India GIGW Footer */}
      <Footer lang={lang} />
    </div>
  );
};

export default App;
