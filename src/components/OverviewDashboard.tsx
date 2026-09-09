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
    { name: 'Critical Risk', value: criticalCount, color: '#DC2626' },
    { name: 'High Risk', value: highCount, color: '#EA580C' },
    { name: 'Moderate', value: mediumCount, color: '#D97706' },
    { name: 'Low / Compliant', value: lowCount, color: '#16A34A' },
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
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Constituency Hero Header (Official Government Style) */}
      <div className="bg-white border border-slate-300 rounded-md p-6 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-[#002244] border border-amber-300">
                {constituency.mpHouse} • {constituency.termYears}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {constituency.state} State Jurisdiction
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#002244] tracking-tight font-serif flex items-center gap-3">
              <span>{constituency.name} Parliamentary Constituency</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Hon'ble Member of Parliament: <strong className="text-[#0B3D91]">{constituency.mpName}</strong> ({constituency.party})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-300 px-4 py-2 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Total Entitlement</span>
              <span className="text-lg font-bold text-[#002244] font-mono">₹{constituency.totalEntitlementCr} Cr</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 px-4 py-2 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Expenditure</span>
              <span className="text-lg font-bold text-emerald-700 font-mono">₹{constituency.totalExpenditureCr} Cr</span>
            </div>
            <div className="bg-red-50 border border-red-300 px-4 py-2 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-red-800 block">At-Risk Funds</span>
              <span className="text-lg font-bold text-red-700 font-mono">₹{(totalFlaggedFunds / 100).toFixed(2)} Cr</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official ROI Banner (Taxpayer Money Saved) */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 border-l-4 border-[#FF9933] border-y border-r border-amber-300 rounded-md p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-amber-100 text-[#002244] border border-amber-300 flex-shrink-0">
            <DollarSign className="w-5 h-5 text-[#FF9933]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#002244] text-xs uppercase tracking-wide">
                Public Exchequer Savings & Vigilance ROI Sentinel
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono px-2 py-0.5 rounded border border-emerald-300">
                48.2x Return on Vigilance
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              Through algorithmic detection of <strong>5 contractor cartels</strong>, <strong>spatial duplicate works</strong>, and <strong>reused ghost photographs</strong>, SATYALADS has safeguarded an estimated <strong className="text-[#002244] font-mono">₹14.82 Crore</strong> of public funds from illegitimate disbursal under GFR 2017.
            </p>
          </div>
        </div>
        {onTriggerScan && (
          <button
            onClick={onTriggerScan}
            className="px-4 py-2 bg-[#0B3D91] hover:bg-[#002244] text-white font-bold rounded text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Run Live AI Re-Scan</span>
          </button>
        )}
      </div>

      {/* 3. KPI 4-Card Grid (Official Government Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Critical Anomalies */}
        <div className="bg-white border-t-4 border-t-red-600 border border-slate-300 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Critical Anomalies</span>
            <div className="p-1.5 rounded bg-red-100 text-red-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#002244] font-mono">{criticalCount + highCount}</span>
            <span className="text-xs text-red-600 ml-2 font-semibold">({criticalCount} Ghost/Double-Dip)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Immediate inquiry recommended for District Collector sanction.
          </p>
        </div>

        {/* Card 2: Space & Ground Verified */}
        <div className="bg-white border-t-4 border-t-[#0B3D91] border border-slate-300 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0B3D91] uppercase tracking-wide">Space Satellite CV</span>
            <div className="p-1.5 rounded bg-blue-100 text-[#0B3D91]">
              <Satellite className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#002244] font-mono">
              {works.filter(w => w.satelliteScanId).length} / {works.length}
            </span>
            <span className="text-xs text-[#0B3D91] ml-2 font-semibold">Scanned</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Sentinel-2 Optical & Sentinel-1 SAR radar cross-verified.
          </p>
        </div>

        {/* Card 3: Cartel & Collusion Links */}
        <div className="bg-white border-t-4 border-t-[#FF9933] border border-slate-300 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#002244] uppercase tracking-wide">Cartel Rings Detected</span>
            <div className="p-1.5 rounded bg-amber-100 text-amber-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#002244] font-mono">1 Major Ring</span>
            <span className="text-xs text-slate-600 ml-2 font-semibold">(3 Co-bidders)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Shared PAN & registered address across 14 tenders.
          </p>
        </div>

        {/* Card 4: Statutory SC/ST Quota */}
        <div className="bg-white border-t-4 border-t-[#138808] border border-slate-300 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">SC / ST Statutory Quota</span>
            <div className="p-1.5 rounded bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#002244] font-mono">
              {constituency.scAllocationPercent}%
            </span>
            <span className="text-xs text-emerald-700 ml-2 font-semibold">SC (Target 15%)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ST Quota at {constituency.stAllocationPercent}% (Statutory Target: 7.5%).
          </p>
        </div>
      </div>

      {/* 4. Analytics Charts Row (Official White Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="font-bold text-xs text-[#002244] uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#0B3D91]" />
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
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '4px', color: '#1A1A1A', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200">
            {riskPieData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 text-[11px]">{item.name}:</span>
                <span className="font-bold text-[#002244] font-mono text-[11px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Detection Capabilities Radar */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="font-bold text-xs text-[#002244] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0B3D91]" />
                Multi-Modal AI Engine Accuracy
              </h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#CBD5E1" />
                  <PolarAngleAxis dataKey="subject" stroke="#475569" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis stroke="#CBD5E1" />
                  <Radar name="Confidence Score" dataKey="score" stroke="#0B3D91" fill="#0B3D91" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '4px', color: '#1A1A1A', fontSize: '11px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center pt-3 border-t border-slate-200 font-mono">
            Ensemble AI combining ESA Sentinel SAR, LayoutLM OCR, GNN & Spatial Buffering
          </div>
        </div>

        {/* Category Budget vs Flagged */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="font-bold text-xs text-[#002244] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Budget vs Flagged by Sector (₹ Lakhs)
              </h3>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#475569" tick={{ fontSize: 9 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '4px', color: '#1A1A1A', fontSize: '11px' }}
                  />
                  <Bar dataKey="total" fill="#0B3D91" name="Sanctioned" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="flagged" fill="#DC2626" name="Risk Flagged" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex justify-around text-xs pt-3 border-t border-slate-200 text-slate-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#0B3D91] rounded"></span> Sanctioned</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#DC2626] rounded"></span> Flagged at Risk</span>
          </div>
        </div>
      </div>

      {/* 5. High-Risk Works Priority Triage Table (Government Gazette Style) */}
      <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#002244] font-serif flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Priority Vigilance Triage & Audit Roster</span>
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by composite Work Integrity Risk Index (WIRI Score)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search works, contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B3D91] w-48"
              />
            </div>

            {/* Risk Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-300 text-xs">
              {['ALL', 'CRITICAL', 'HIGH', 'LOW'].map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    riskFilter === risk
                      ? 'bg-[#002244] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Works Table */}
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#002244] text-white uppercase font-sans text-[10px] tracking-wide">
              <tr>
                <th className="py-2.5 px-3">WIRI Risk</th>
                <th className="py-2.5 px-3">Work Code & Title</th>
                <th className="py-2.5 px-3">Category & Location</th>
                <th className="py-2.5 px-3">Sanctioned</th>
                <th className="py-2.5 px-3">Contractor / Agency</th>
                <th className="py-2.5 px-3">Detected Anomalies</th>
                <th className="py-2.5 px-3 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredWorks.map((work) => {
                const isCritical = work.riskLevel === 'CRITICAL';
                const isHigh = work.riskLevel === 'HIGH';

                return (
                  <tr 
                    key={work.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => onSelectWork(work)}
                  >
                    {/* WIRI Risk Badge */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span 
                          className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs font-mono ${
                            isCritical
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : isHigh
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {work.wiriScore}
                        </span>
                        <div>
                          <span className={`text-[10px] font-bold block ${
                            isCritical ? 'text-red-700' : isHigh ? 'text-amber-800' : 'text-emerald-700'
                          }`}>
                            {work.riskLevel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Title & Code */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <span className="font-mono text-[10px] text-[#0B3D91] font-semibold block">{work.code}</span>
                      <span className="font-bold text-slate-900 text-xs line-clamp-1">
                        {work.title}
                      </span>
                    </td>

                    {/* Category & Location */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 block w-fit mb-0.5">
                        {work.category}
                      </span>
                      <span className="text-[10px] text-slate-500">{work.locationName}</span>
                    </td>

                    {/* Sanctioned */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-slate-800">
                      ₹{work.sanctionedAmountLakhs} L
                    </td>

                    {/* IA & Contractor */}
                    <td className="py-2.5 px-3 max-w-[180px]">
                      <span className="text-xs text-slate-800 block font-semibold truncate">{work.contractorName}</span>
                      <span className="text-[10px] text-slate-500 truncate block">{work.implementingAgency}</span>
                    </td>

                    {/* Flags */}
                    <td className="py-2.5 px-3">
                      {work.flags.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Fully Compliant
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {work.flags.slice(0, 2).map((flag) => (
                            <span 
                              key={flag.id} 
                              className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                                flag.severity === 'CRITICAL'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {flag.title.split(':')[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectWork(work);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0B3D91] hover:bg-[#002244] text-white text-[11px] font-bold transition-all shadow-xs"
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
