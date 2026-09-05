import React from 'react';
import { 
  ShieldAlert, 
  Satellite, 
  Landmark, 
  UserCheck, 
  Bell, 
  MapPin, 
  ChevronDown,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Users,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { Constituency } from '../types';

interface NavbarProps {
  constituencies: Constituency[];
  selectedConstituency: Constituency;
  onSelectConstituency: (c: Constituency) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  totalHighRiskCount: number;
  onTriggerScan: () => void;
  isScanning: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  constituencies,
  selectedConstituency,
  onSelectConstituency,
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  totalHighRiskCount,
  onTriggerScan,
  isScanning
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-[#1E3A5F] shadow-lg">
      {/* Top Gov Banner */}
      <div className="bg-gradient-to-r from-[#FF9933]/15 via-transparent to-[#138808]/15 border-b border-[#1E3A5F]/40 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-amber-400 tracking-wider flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            GOVERNMENT OF INDIA
          </span>
          <span className="text-slate-500">|</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span className="text-slate-500">|</span>
          <span className="text-sky-400 font-mono">e-SAKSHI v2.4 + SatyaLADS AI Sentinel</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{totalHighRiskCount} Flagged High-Risk Works Active</span>
          </div>
          <div className="text-slate-400 text-xs font-mono">
            Cycle: FY 2024-25
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 shadow-md shadow-sky-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#0A192F]"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent">
                SatyaLADS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                AI Sentinel
              </span>
            </div>
            <p className="text-[11px] text-slate-400">MPLADS Anomaly, Cartel & Fraud Detection Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-[#020C1B]/80 p-1 rounded-xl border border-[#1E3A5F]">
          {[
            { id: 'overview', label: 'Command Hub', icon: Landmark },
            { id: 'gis', label: '3D GIS Map', icon: Layers },
            { id: 'satellite', label: 'Satellite Sentinel', icon: Satellite },
            { id: 'double_dipping', label: 'Double-Dipping Radar', icon: ShieldAlert },
            { id: 'cartels', label: 'Cartel Graph AI', icon: Users },
            { id: 'dpr_audit', label: 'DPR & Rate Auditor', icon: FileSpreadsheet },
            { id: 'equity', label: 'SC/ST Quota & Velocity', icon: Sparkles },
            { id: 'citizen', label: 'Citizen Portal', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Constituency Switcher, Role & Scan Action */}
        <div className="flex items-center space-x-3">
          {/* Constituency Picker */}
          <div className="relative">
            <div className="flex items-center space-x-2 bg-[#0F233D] px-3 py-1.5 rounded-lg border border-[#1E3A5F] text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left">
                <span className="text-[10px] block text-slate-400 font-mono">CONSTITUENCY</span>
                <select
                  value={selectedConstituency.id}
                  onChange={(e) => {
                    const found = constituencies.find(c => c.id === e.target.value);
                    if (found) onSelectConstituency(found);
                  }}
                  className="bg-transparent text-white font-semibold outline-none cursor-pointer pr-2 text-xs"
                >
                  {constituencies.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0A192F] text-white">
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center space-x-2 bg-[#0F233D] px-2.5 py-1.5 rounded-lg border border-[#1E3A5F] text-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="bg-transparent text-slate-200 font-medium outline-none cursor-pointer text-xs"
            >
              <option value="District Magistrate (DM)" className="bg-[#0A192F] text-white">District Magistrate (DM)</option>
              <option value="MoSPI Central Vigilance" className="bg-[#0A192F] text-white">MoSPI Central Vigilance</option>
              <option value="CAG State Auditor" className="bg-[#0A192F] text-white">CAG State Auditor</option>
              <option value="Public Citizen / Whistleblower" className="bg-[#0A192F] text-white">Citizen / Whistleblower</option>
            </select>
          </div>

          {/* Trigger Full Multi-Modal AI Scan */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isScanning 
                ? 'bg-sky-600/50 text-sky-200 cursor-not-allowed animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Multi-Modal Scan...' : 'Trigger AI Audit'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
