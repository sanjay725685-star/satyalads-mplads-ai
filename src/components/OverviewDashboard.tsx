import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users, 
  Activity, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  Satellite, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { Constituency, WorkItem, RiskLevel } from '../types';

interface OverviewDashboardProps {
  constituency: Constituency;
  works: WorkItem[];
  onSelectWork: (work: WorkItem) => void;
  onNavigateTab: (tab: string) => void;
  onTriggerScan?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  constituency,
  works,
  onSelectWork,
  onNavigateTab,
  onTriggerScan
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  const filteredWorks = works.filter((w) => {
    const matchesSearch = 
      w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'ALL' || w.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const criticalCount = works.filter(w => w.riskLevel === 'CRITICAL').length;
  const highCount = works.filter(w => w.riskLevel === 'HIGH').length;
  const mediumCount = works.filter(w => w.riskLevel === 'MEDIUM').length;
  const lowCount = works.filter(w => w.riskLevel === 'LOW').length;

  const totalFlaggedFunds = works
    .filter(w => w.riskLevel === 'CRITICAL' || w.riskLevel === 'HIGH')
    .reduce((sum, w) => sum + w.sanctionedAmountLakhs, 0);

  // Category breakdown for chart
  const categoryData = [
    { name: 'Roads', total: 85, flagged: 85 },
    { name: 'Water', total: 152, flagged: 152 },
    { name: 'Community', total: 68, flagged: 0 },
    { name: 'Private/Trust', total: 55, flagged: 55 },
    { name: 'Education', total: 95, flagged: 95 },
    { name: 'Sanitation', total: 145, flagged: 145 },
  ];

  const riskPieData = [
    { name: 'Critical Risk', value: criticalCount, color: '#EF4444' },
    { name: 'High Risk', value: highCount, color: '#F97316' },
    { name: 'Moderate', value: mediumCount, color: '#FBBF24' },
    { name: 'Low / Compliant', value: lowCount, color: '#10B981' },
  ];

  const radarData = [
    { subject: 'Space Satellite CV', score: 88, fullMark: 100 },
    { subject: 'Cartel Detection', score: 92, fullMark: 100 },
    { subject: 'DPR Rate Match', score: 76, fullMark: 100 },
    { subject: 'Spatial Collision', score: 95, fullMark: 100 },
    { subject: 'Photo Forensics', score: 84, fullMark: 100 },
    { subject: 'Statutory Quota', score: 70, fullMark: 100 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Constituency Hero Header */}
      <div className="bg-gradient-to-r from-[#0F233D] via-[#0A192F] to-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {constituency.mpHouse} • {constituency.termYears}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {constituency.state} State Jurisdiction
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>{constituency.name} Parliamentary Constituency</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Hon'ble MP: <span className="text-sky-300 font-semibold">{constituency.mpName}</span> ({constituency.party})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#020C1B]/90 border border-[#1E3A5F] px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Entitlement</span>
              <span className="text-lg font-bold text-white font-mono">₹{constituency.totalEntitlementCr} Cr</span>
            </div>
            <div className="bg-[#020C1B]/90 border border-[#1E3A5F] px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Expenditure</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">₹{constituency.totalExpenditureCr} Cr</span>
            </div>
            <div className="bg-[#020C1B]/90 border border-rose-500/30 bg-rose-500/10 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-mono text-rose-300 block">At-Risk Funds</span>
              <span className="text-lg font-bold text-rose-400 font-mono">₹{(totalFlaggedFunds / 100).toFixed(2)} Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical Anomalies */}
        <div className="bg-[#0F233D]/90 border border-rose-500/40 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-rose-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Critical Anomalies</span>
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white font-mono">{criticalCount + highCount}</span>
            <span className="text-xs text-rose-400 ml-2 font-medium">({criticalCount} Ghost/Double-Dip)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Urgent review recommended for District Collector sanction.
          </p>
        </div>

        {/* Card 2: Space & Ground Verified */}
        <div className="bg-[#0F233D]/90 border border-[#1E3A5F] rounded-xl p-5 shadow-lg relative group hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-300 uppercase tracking-wider">Space Satellite CV</span>
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Satellite className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {works.filter(w => w.satelliteScanId).length} / {works.length}
            </span>
            <span className="text-xs text-sky-400 ml-2 font-medium">Scanned</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Sentinel-2 Optical & Sentinel-1 SAR radar cross-verified.
          </p>
        </div>

        {/* Card 3: Cartel & Collusion Links */}
        <div className="bg-[#0F233D]/90 border border-[#1E3A5F] rounded-xl p-5 shadow-lg relative group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Cartel Rings Detected</span>
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">1 Major Ring</span>
            <span className="text-xs text-slate-300 ml-2">(3 Co-bidders)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Shared PAN & registered address across 14 tenders.
          </p>
        </div>

        {/* Card 4: Statutory SC/ST Quota */}
        <div className="bg-[#0F233D]/90 border border-[#1E3A5F] rounded-xl p-5 shadow-lg relative group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">SC / ST Statutory Quota</span>
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {constituency.scAllocationPercent}%
            </span>
            <span className="text-xs text-emerald-400 ml-2 font-semibold">SC (Target 15%)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            ST Quota at {constituency.stAllocationPercent}% (Statutory Target: 7.5%).
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-[#0F233D]/80 border border-[#1E3A5F] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-sky-400" />
                Work Integrity Risk Profile (WIRI)
              </h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A192F', borderColor: '#1E3A5F', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#1E3A5F]/60">
            {riskPieData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300">{item.name}:</span>
                <span className="font-bold text-white font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Detection Capabilities Radar */}
        <div className="bg-[#0F233D]/80 border border-[#1E3A5F] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Multi-Modal AI Engine Accuracy
              </h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1E3A5F" />
                  <PolarAngleAxis dataKey="subject" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis stroke="#1E3A5F" />
                  <Radar name="Confidence Score" dataKey="score" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.4} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A192F', borderColor: '#1E3A5F', borderRadius: '8px', color: '#fff' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center pt-3 border-t border-[#1E3A5F]/60">
            Ensemble AI combining ESA Sentinel SAR, LayoutLM OCR, GNN & Spatial Buffering
          </div>
        </div>

        {/* Category Budget vs Flagged */}
        <div className="bg-[#0F233D]/80 border border-[#1E3A5F] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Budget vs Flagged by Sector (₹ Lakhs)
              </h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A192F', borderColor: '#1E3A5F', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="total" fill="#0284C7" name="Sanctioned" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="flagged" fill="#EF4444" name="Risk Flagged" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-around text-xs pt-3 border-t border-[#1E3A5F]/60 text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-sky-600 rounded"></span> Sanctioned Funds</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded"></span> Flagged at Risk</span>
          </div>
        </div>
      </div>

      {/* High-Risk Works Priority Triage Table */}
      <div className="bg-[#0F233D]/90 border border-[#1E3A5F] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Priority Vigilance Triage & Audit Roster</span>
            </h2>
            <p className="text-xs text-slate-400">
              Ranked by composite Work Integrity Risk Index (WIRI Score)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search works, contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#020C1B] border border-[#1E3A5F] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-52"
              />
            </div>

            {/* Risk Filter Buttons */}
            <div className="flex items-center bg-[#020C1B] p-1 rounded-lg border border-[#1E3A5F] text-xs">
              {['ALL', 'CRITICAL', 'HIGH', 'LOW'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    riskFilter === risk
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Works Table */}
        <div className="overflow-x-auto rounded-xl border border-[#1E3A5F]/70">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A192F] text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-[#1E3A5F]">
              <tr>
                <th className="py-3 px-4">WIRI Risk</th>
                <th className="py-3 px-4">Work Code & Title</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Sanctioned</th>
                <th className="py-3 px-4">Implementing Agency & Contractor</th>
                <th className="py-3 px-4">Detected Anomalies</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/40 bg-[#0F233D]/60">
              {filteredWorks.map((work) => {
                const isCritical = work.riskLevel === 'CRITICAL';
                const isHigh = work.riskLevel === 'HIGH';
                const isLow = work.riskLevel === 'LOW';

                return (
                  <tr 
                    key={work.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectWork(work)}
                  >
                    {/* WIRI Risk Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm font-mono shadow-sm ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : isHigh
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {work.wiriScore}
                        </span>
                        <div>
                          <span className={`text-[10px] font-bold block ${
                            isCritical ? 'text-rose-400' : isHigh ? 'text-orange-400' : 'text-emerald-400'
                          }`}>
                            {work.riskLevel}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">WIRI Index</span>
                        </div>
                      </div>
                    </td>

                    {/* Title & Code */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-mono text-[10px] text-sky-400 block">{work.code}</span>
                      <span className="font-semibold text-white text-xs group-hover:text-sky-300 transition-colors line-clamp-2">
                        {work.title}
                      </span>
                    </td>

                    {/* Category & Location */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700 block w-fit mb-1">
                        {work.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{work.locationName}</span>
                    </td>

                    {/* Sanctioned */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-200">
                      ₹{work.sanctionedAmountLakhs} L
                    </td>

                    {/* IA & Contractor */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="text-[11px] text-slate-300 block font-medium truncate">{work.contractorName}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{work.implementingAgency}</span>
                    </td>

                    {/* Flags */}
                    <td className="py-3.5 px-4">
                      {work.flags.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Fully Compliant
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {work.flags.slice(0, 2).map((flag) => (
                            <span 
                              key={flag.id} 
                              className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                                flag.severity === 'CRITICAL'
                                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {flag.title.split(':')[0]}
                            </span>
                          ))}
                          {work.flags.length > 2 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              +{work.flags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWork(work);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-semibold transition-all shadow-sm"
                      >
                        <span>Audit Dossier</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
