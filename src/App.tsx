import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { GISMap } from './components/GISMap';
import { SatelliteInspector } from './components/SatelliteInspector';
import { DoubleDippingDetector } from './components/DoubleDippingDetector';
import { CartelGraph } from './components/CartelGraph';
import { DPRScanner } from './components/DPRScanner';
import { EquityTracker } from './components/EquityTracker';
import { CitizenPortal } from './components/CitizenPortal';
import { AuditDossierModal } from './components/AuditDossierModal';
import { CONSTITUENCIES, WORK_ITEMS } from './data/mockData';
import { Constituency, WorkItem } from './types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [constituencies] = useState<Constituency[]>(CONSTITUENCIES);
  const [selectedConstituency, setSelectedConstituency] = useState<Constituency>(CONSTITUENCIES[0]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<string>('District Magistrate (DM)');
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(WORK_ITEMS[0]);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanNotification, setScanNotification] = useState<string | null>(null);

  // Filter works for current constituency
  const constituencyWorks = WORK_ITEMS.filter(
    (w) => w.constituencyId === selectedConstituency.id
  );

  const totalHighRiskCount = WORK_ITEMS.filter(
    (w) => w.riskLevel === 'CRITICAL' || w.riskLevel === 'HIGH'
  ).length;

  const handleSelectWork = (work: WorkItem) => {
    setSelectedWork(work);
    setIsDossierOpen(true);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanNotification('In progress: Fetching ESA Sentinel-1/2 SAR rasters & running GNN cartel model...');

    setTimeout(() => {
      setScanNotification('Complete: 34 Works audited. 6 Critical Anomalies flagged.');
      setIsScanning(false);
      setTimeout(() => setScanNotification(null), 4000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#020C1B] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        constituencies={constituencies}
        selectedConstituency={selectedConstituency}
        onSelectConstituency={(c) => {
          setSelectedConstituency(c);
          const firstWork = WORK_ITEMS.find((w) => w.constituencyId === c.id) || WORK_ITEMS[0];
          setSelectedWork(firstWork);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        totalHighRiskCount={totalHighRiskCount}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
      />

      {/* Live AI Scan Notification Banner */}
      {scanNotification && (
        <div className="bg-sky-500/20 border-b border-sky-500/40 text-sky-300 px-4 py-2 text-xs flex items-center justify-center gap-2 font-mono animate-in fade-in">
          <Sparkles className="w-4 h-4 animate-spin text-sky-400" />
          <span>{scanNotification}</span>
        </div>
      )}

      {/* Main Tab Views */}
      <main className="flex-1 pb-12">
        {activeTab === 'overview' && (
          <OverviewDashboard
            constituency={selectedConstituency}
            works={constituencyWorks}
            onSelectWork={handleSelectWork}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'gis' && (
          <GISMap
            constituency={selectedConstituency}
            works={constituencyWorks}
            selectedWork={selectedWork}
            onSelectWork={(w) => setSelectedWork(w)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'satellite' && (
          <SatelliteInspector
            works={constituencyWorks}
            selectedWork={selectedWork || constituencyWorks[0]}
            onSelectWork={(w) => setSelectedWork(w)}
          />
        )}

        {activeTab === 'double_dipping' && (
          <DoubleDippingDetector />
        )}

        {activeTab === 'cartels' && (
          <CartelGraph />
        )}

        {activeTab === 'dpr_audit' && (
          <DPRScanner />
        )}

        {activeTab === 'equity' && (
          <EquityTracker
            constituency={selectedConstituency}
            works={constituencyWorks}
          />
        )}

        {activeTab === 'citizen' && (
          <CitizenPortal />
        )}
      </main>

      {/* Explainable AI (XAI) Audit Dossier Modal */}
      {isDossierOpen && selectedWork && (
        <AuditDossierModal
          work={selectedWork}
          onClose={() => setIsDossierOpen(false)}
        />
      )}

      {/* Gov Footer */}
      <footer className="border-t border-[#1E3A5F] bg-[#0A192F] py-4 px-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">SatyaLADS AI Sentinel</span>
          <span>•</span>
          <span>MoSPI MPLADS Modernization & Anti-Fraud Architecture</span>
        </div>
        <div className="font-mono text-[11px] text-slate-500">
          Smart India Hackathon (SIH) Prototype • Central Vigilance Division
        </div>
      </footer>
    </div>
  );
};
export default App;
