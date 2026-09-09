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
  Filter,
  MapPin,
  Globe,
  Building,
  Landmark,
  ChevronRight,
  BarChart3
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
import { Constituency, WorkItem, RiskLevel, Language } from '../types';
import { CONSTITUENCIES } from '../data/mockData';
import { ALL_STATES, getConstituenciesByState } from '../utils/projectAdapter';

interface OverviewDashboardProps {
  constituency: Constituency;
  works: WorkItem[];
  onSelectWork: (work: WorkItem) => void;
  onNavigateTab: (tab: string) => void;
  onTriggerScan?: () => void;
  allConstituencies?: Constituency[];
  onSelectConstituency?: (constituency: Constituency) => void;
  isAllIndiaView?: boolean;
  onToggleAllIndia?: (allIndia: boolean) => void;
  lang?: Language;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  constituency,
  works,
  onSelectWork,
  onNavigateTab,
  onTriggerScan,
  allConstituencies = CONSTITUENCIES,
  onSelectConstituency,
  isAllIndiaView = false,
  onToggleAllIndia,
  lang = 'en'
}) => {
  const isHi = lang !== 'en';
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>(isAllIndiaView ? '' : constituency.state);

  // Filter works by search and risk
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

  // Compute dynamic category breakdown for chart
  const categoriesList = [
    'Roads & Bridges',
    'Drinking Water',
    'Community Infrastructure',
    'Sanitation',
    'Education & Schools',
    'Healthcare'
  ];
  const categoryData = categoriesList.map(cat => {
    const inCat = works.filter(w => w.category === cat);
    const total = inCat.reduce((sum, w) => sum + w.sanctionedAmountLakhs, 0);
    const flagged = inCat.filter(w => w.riskLevel === 'CRITICAL' || w.riskLevel === 'HIGH')
      .reduce((sum, w) => sum + w.sanctionedAmountLakhs, 0);
    return {
      name: cat.replace('& Bridges', '').replace('& Schools', '').replace('Infrastructure', ''),
      total: Math.round(total) || 20,
      flagged: Math.round(flagged)
    };
  });

  const radarData = [
    { subject: isHi ? 'उपग्रह सीवी' : 'Space Satellite CV', score: 88, fullMark: 100 },
    { subject: isHi ? 'कार्टेल सिंडिकेट' : 'Cartel Detection', score: 92, fullMark: 100 },
    { subject: isHi ? 'डीपीआर दर' : 'DPR Rate Match', score: 76, fullMark: 100 },
    { subject: isHi ? 'स्थानिक टकराव' : 'Spatial Collision', score: 95, fullMark: 100 },
    { subject: isHi ? 'फोटो फोरेंसिक' : 'Photo Forensics', score: 84, fullMark: 100 },
    { subject: isHi ? 'कोटा अनुपालन' : 'Statutory Quota', score: 70, fullMark: 100 },
  ];

  // Quick select key constituencies
  const quickPills = [
    { label: 'All India (320)', isAll: true, id: '' },
    { label: 'Varanasi (UP)', id: 'VARANASI', state: 'Uttar Pradesh' },
    { label: 'Baramati (MH)', id: 'BARAMATI', state: 'Maharashtra' },
    { label: 'Bangalore South (KA)', id: 'BLR_SOUTH', state: 'Karnataka' },
    { label: 'Wayanad (KL)', id: 'WAYANAD', state: 'Kerala' },
    { label: 'Patna Sahib (BR)', id: 'PATNA_SAHIB', state: 'Bihar' },
    { label: 'Gandhinagar (GJ)', id: 'GANDHINAGAR', state: 'Gujarat' },
    { label: 'Jaipur (RJ)', id: 'JAIPUR', state: 'Rajasthan' },
    { label: 'Kolkata North (WB)', id: 'KOLKATA_NORTH', state: 'West Bengal' },
    { label: 'Guwahati (AS)', id: 'GUWAHATI', state: 'Assam' },
    { label: 'Srinagar (J&K)', id: 'SRINAGAR', state: 'Jammu & Kashmir' },
    { label: 'New Delhi (DL)', id: 'NEW_DELHI', state: 'Delhi (NCT)' },
    { label: 'Hyderabad (TG)', id: 'HYDERABAD', state: 'Telangana' },
    { label: 'Bhopal (MP)', id: 'BHOPAL', state: 'Madhya Pradesh' },
  ];

  const handleStateChange = (newState: string) => {
    setSelectedStateFilter(newState);
    if (!newState || newState === 'ALL') {
      if (onToggleAllIndia) onToggleAllIndia(true);
    } else {
      if (onToggleAllIndia) onToggleAllIndia(false);
      const stateConsts = getConstituenciesByState(newState);
      if (stateConsts.length > 0 && onSelectConstituency) {
        onSelectConstituency(stateConsts[0]);
      }
    }
  };

  const handleConstituencyChange = (cId: string) => {
    const target = allConstituencies.find(c => c.id === cId);
    if (target && onSelectConstituency) {
      if (onToggleAllIndia) onToggleAllIndia(false);
      setSelectedStateFilter(target.state);
      onSelectConstituency(target);
    }
  };

  // Filter constituencies options based on selectedStateFilter
  const availableConstituencies = selectedStateFilter 
    ? getConstituenciesByState(selectedStateFilter) 
    : allConstituencies;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* 0. Official Parliamentary & State Jurisdiction Selector Banner */}
      <div className="bg-[#002244] border-2 border-[#FF9933] rounded-md p-4 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-900/30 to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933] animate-pulse" />
              <span className="text-[11px] font-bold text-[#FF9933] uppercase tracking-wider font-mono">
                {isHi ? 'भारत सरकार • राष्ट्रीय एमपीलैड्स सतर्कता ग्रिड' : 'GOVERNMENT OF INDIA • NATIONAL MPLADS AUDIT GRID'}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                {isHi ? '13 राज्य • 25 निर्वाचन क्षेत्र • 320 परियोजनाएं' : '13 States & UTs • 25 LS Constituencies • 320 Projects'}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black font-serif tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-300" />
              <span>
                {isHi ? 'संसदीय निर्वाचन क्षेत्र एवं राज्य चयनकर्ता' : 'State & Parliamentary Constituency Selector'}
              </span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              {isHi 
                ? 'भारत के किसी भी राज्य या लोकसभा क्षेत्र का चयन करें और स्थानीय परियोजनाओं का एआई फ्रॉड डिटेक्शन, उपग्रह सत्यापन और कार्टेल विश्लेषण देखें।'
                : 'Switch between any of the 13 Indian States / UTs and 25 Lok Sabha seats to inspect regional project delivery, satellite CV scans, and contractor rings.'}
            </p>
          </div>

          {/* Dropdown Controls Toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-[#001A33] p-3 rounded border border-slate-700">
            {/* State / UT Dropdown */}
            <div className="flex flex-col">
              <label className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {isHi ? 'राज्य / संघ राज्य क्षेत्र' : '1. Select State / UT'}
              </label>
              <select
                value={isAllIndiaView ? '' : (selectedStateFilter || constituency.state)}
                onChange={(e) => handleStateChange(e.target.value)}
                className="bg-[#002244] border border-amber-400/60 rounded px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer min-w-[170px]"
              >
                <option value="">{isHi ? '🇮🇳 अखिल भारतीय (समस्त 13 राज्य)' : '🇮🇳 All India (All 13 States)'}</option>
                {ALL_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st} ({getConstituenciesByState(st).length} Seats)
                  </option>
                ))}
              </select>
            </div>

            {/* Parliamentary Constituency Dropdown */}
            <div className="flex flex-col">
              <label className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {isHi ? 'संसदीय निर्वाचन क्षेत्र' : '2. Select Lok Sabha Seat'}
              </label>
              <select
                disabled={isAllIndiaView}
                value={isAllIndiaView ? '' : constituency.id}
                onChange={(e) => handleConstituencyChange(e.target.value)}
                className={`bg-[#002244] border border-amber-400/60 rounded px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-amber-400 cursor-pointer min-w-[220px] ${
                  isAllIndiaView ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAllIndiaView && (
                  <option value="">{isHi ? 'राष्ट्रीय परिप्रेक्ष्य सक्रिय' : 'National All-India Mode Active'}</option>
                )}
                {availableConstituencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.state}) — {c.mpName} ({c.party})
                  </option>
                ))}
              </select>
            </div>

            {/* All-India Toggle Button */}
            <div className="flex flex-col justify-end">
              <span className="text-[10px] text-slate-400 mb-1 opacity-0">Action</span>
              <button
                type="button"
                onClick={() => {
                  if (onToggleAllIndia) {
                    onToggleAllIndia(!isAllIndiaView);
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isAllIndiaView 
                    ? 'bg-[#FF9933] text-[#002244] border-white shadow-sm' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isAllIndiaView ? (isHi ? 'क्षेत्रीय दृश्य में जाएं' : 'Switch to Seat View') : (isHi ? 'अखिल भारतीय दृश्य' : 'All-India Mode')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Constituency Badges */}
        <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-amber-300/80 font-bold uppercase whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {isHi ? 'त्वरित चयन:' : 'Quick Select:'}
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {quickPills.map((pill) => {
              const isActive = pill.isAll ? isAllIndiaView : (!isAllIndiaView && constituency.id === pill.id);
              return (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => {
                    if (pill.isAll) {
                      if (onToggleAllIndia) onToggleAllIndia(true);
                    } else {
                      handleConstituencyChange(pill.id);
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#FF9933] text-[#002244] border-white font-bold shadow-xs'
                      : 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/20'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 1. Hero Header (Official Government Style) */}
      <div className="bg-white border border-slate-300 rounded-md p-6 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-[#002244] border border-amber-300">
                {isAllIndiaView ? 'Parliament of India • 18th Lok Sabha' : `${constituency.mpHouse} • ${constituency.termYears}`}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {isAllIndiaView ? 'Central Vigilance Grid • All 13 States & UTs' : `${constituency.state} State Jurisdiction`}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#002244] tracking-tight font-serif flex items-center gap-3">
              <span>
                {isAllIndiaView 
                  ? 'All-India National MPLADS Integrity Overview' 
                  : `${constituency.name} Parliamentary Constituency`}
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {isAllIndiaView ? (
                <span>
                  National Aggregate Monitor: <strong className="text-[#0B3D91]">25 Lok Sabha Constituencies</strong> across 13 States | 320 Active Filings
                </span>
              ) : (
                <span>
                  Hon'ble Member of Parliament: <strong className="text-[#0B3D91]">{constituency.mpName}</strong> ({constituency.party})
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-300 px-4 py-2 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Total Entitlement</span>
              <span className="text-lg font-bold text-[#002244] font-mono">
                ₹{isAllIndiaView ? '625.00' : constituency.totalEntitlementCr} Cr
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 px-4 py-2 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Expenditure</span>
              <span className="text-lg font-bold text-emerald-700 font-mono">
                ₹{isAllIndiaView ? '458.20' : constituency.totalExpenditureCr} Cr
              </span>
            </div>
            <div className="bg-red-50 border border-red-300 px-4 py-2 rounded text-center">
              <span className="text-[10px] uppercase font-bold text-red-800 block">At-Risk Funds</span>
              <span className="text-lg font-bold text-red-700 font-mono">
                ₹{(totalFlaggedFunds / 100).toFixed(2)} Cr
              </span>
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

      {/* 2.5 All-India State Matrix Grid (Only Shown in All-India Mode) */}
      {isAllIndiaView && (
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-[#002244] font-serif flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0B3D91]" />
                <span>All-India State Vigilance Matrix (13 States & UTs)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Click any State card to drill down into its local Parliamentary Constituencies and projects
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0B3D91] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              25 Constituencies • 320 Projects Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_STATES.map((stateName) => {
              const stateConsts = getConstituenciesByState(stateName);
              const isSelected = selectedStateFilter === stateName;
              return (
                <div
                  key={stateName}
                  onClick={() => handleStateChange(stateName)}
                  className={`p-3 rounded border transition-all cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'bg-blue-50 border-[#0B3D91] ring-1 ring-[#0B3D91]'
                      : 'bg-slate-50 hover:bg-white border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#002244]">{stateName}</span>
                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                      {stateConsts.length} {stateConsts.length === 1 ? 'Seat' : 'Seats'}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {stateConsts.map(sc => (
                      <div key={sc.id} className="text-[11px] text-slate-600 flex items-center justify-between">
                        <span className="truncate">{sc.name}</span>
                        <span className="font-mono text-[10px] text-[#0B3D91] font-semibold">{sc.party}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-[#0B3D91] font-bold">
                    <span>Audit Jurisdiction</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            <span className="text-xs text-emerald-600 ml-2 font-semibold">Dual-Sensor Pass</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Verified via Sentinel-1 SAR backscatter & Sentinel-2 optical imagery.
          </p>
        </div>

        {/* Card 3: Cartel Rings */}
        <div className="bg-white border-t-4 border-t-amber-500 border border-slate-300 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Contractor Cartels</span>
            <div className="p-1.5 rounded bg-amber-100 text-amber-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-[#002244] font-mono">
              {isAllIndiaView ? '5 Rings' : '2 Rings'}
            </span>
            <span className="text-xs text-amber-700 ml-2 font-semibold">(Shared GSTIN / PAN)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Bid-rigging detected across tenders under GFR Rule 144.
          </p>
        </div>

        {/* Card 4: Statutory Quota Compliance */}
        <div className="bg-white border-t-4 border-t-emerald-600 border border-slate-300 rounded-md p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">SC / ST Quota Mandate</span>
            <div className="p-1.5 rounded bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#002244] font-mono">
              SC: {constituency.scAllocationPercent}%
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-lg font-bold text-[#002244] font-mono">
              ST: {constituency.stAllocationPercent}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Statutory Target: ≥15% SC (Para 2.5) & ≥7.5% ST (Para 2.6).
          </p>
        </div>
      </div>

      {/* 4. Visual Analytics: Radar Score & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="font-bold text-xs text-[#002244] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0B3D91]" />
                Multi-Modal AI Vigilance Diagnostic Vectors
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                6-Vector Ensemble
              </span>
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
              {isAllIndiaView 
                ? 'Showing top works across all 13 states ranked by Work Integrity Risk Index'
                : `Showing works for ${constituency.name} (${constituency.state}) ranked by composite WIRI Score`}
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
              {filteredWorks.slice(0, 30).map((work) => {
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
