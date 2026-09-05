import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  ArrowRightLeft, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  TrendingDown,
  Layers,
  Search
} from 'lucide-react';
import { DoubleDippingAlert } from '../types';
import { DOUBLE_DIPPING_ALERTS } from '../data/mockData';

export const DoubleDippingDetector: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<DoubleDippingAlert>(DOUBLE_DIPPING_ALERTS[0]);

  const totalDuplicateLoss = DOUBLE_DIPPING_ALERTS.reduce(
    (sum, a) => sum + a.estimatedDuplicateLossLakhs, 0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
              Cross-Scheme Collision Radar
            </span>
            <span className="text-xs text-slate-400 font-mono">Multi-Departmental Spatial Buffer Engine</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>"Double-Dipping" & Duplicate Asset Billing Detector</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Detects identical or adjacent public works claimed concurrently across MPLADS, PMGSY, MLALADS, Smart Cities & Urban Local Body Grants.
          </p>
        </div>

        {/* Total Recoverable Savings Card */}
        <div className="bg-[#020C1B] border border-rose-500/40 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Duplicate Risk</span>
            <span className="text-xl font-extrabold text-rose-400 font-mono">
              ₹{(totalDuplicateLoss / 100).toFixed(2)} Cr
            </span>
            <span className="text-[10px] text-slate-400 block">Across {DOUBLE_DIPPING_ALERTS.length} Collisions</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Collision List & Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Collisions (4 Cols) */}
        <div className="lg:col-span-5 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Active Spatial Collisions ({DOUBLE_DIPPING_ALERTS.length})</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Radius &lt; 25m</span>
          </div>

          <div className="space-y-3">
            {DOUBLE_DIPPING_ALERTS.map((alert) => {
              const isSelected = selectedAlert.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500/15 border-rose-500/60 shadow-lg shadow-rose-500/10'
                      : 'bg-[#020C1B] border-[#1E3A5F] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      VS {alert.collidingScheme}
                    </span>
                    <span className="font-mono text-xs font-bold text-rose-400">
                      {alert.distanceMeters}m Distance
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs mt-2 line-clamp-1">
                    {alert.mpladsWorkTitle}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-[#1E3A5F]/60">
                    <span>Duplicate Risk: <strong className="text-rose-300 font-mono">₹{alert.estimatedDuplicateLossLakhs} L</strong></span>
                    <span className="text-sky-400 font-mono font-semibold">{alert.overlapProbabilityPercent}% Match</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Comparison Matrix (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Collision Dossier #{selectedAlert.id}</span>
              <h2 className="font-bold text-base text-white flex items-center gap-2 mt-0.5">
                <span>Spatial & Semantic Overlap Breakdown</span>
              </h2>
            </div>
            <div className="bg-rose-500/20 border border-rose-500/40 px-3 py-1 rounded-lg text-rose-300 font-mono text-xs font-bold">
              {selectedAlert.distanceMeters} Meters Apart
            </div>
          </div>

          {/* Side-by-Side Scheme Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scheme 1: MPLADS Claim */}
            <div className="bg-[#020C1B] border border-sky-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  SCHEME 1: MPLADS (Centre)
                </span>
                <span className="font-mono text-xs font-bold text-sky-400">₹{selectedAlert.mpladsAmountLakhs} L</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">{selectedAlert.mpladsWorkTitle}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{selectedAlert.locationName}</p>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-[#1E3A5F] pt-2">
                Sanction Body: District Collectorate
              </div>
            </div>

            {/* Scheme 2: Parallel Scheme Claim */}
            <div className="bg-[#020C1B] border border-rose-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  SCHEME 2: {selectedAlert.collidingScheme}
                </span>
                <span className="font-mono text-xs font-bold text-rose-400">₹{selectedAlert.collidingAmountLakhs} L</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-slate-400 block">{selectedAlert.collidingProjectCode}</span>
                <h4 className="font-bold text-white text-xs">{selectedAlert.collidingProjectTitle}</h4>
                <p className="text-[11px] text-slate-400 mt-1">Agency: {selectedAlert.collidingAgency}</p>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-[#1E3A5F] pt-2">
                Parallel Sanction: State / Urban Ministry
              </div>
            </div>
          </div>

          {/* AI Cross-Match Evidence Radar */}
          <div className="bg-[#0A192F] p-4 rounded-xl border border-[#1E3A5F] space-y-3">
            <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Source AI Evidence Metrics</span>
            </h4>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-[#020C1B] p-3 rounded-lg border border-[#1E3A5F] text-center">
                <span className="text-[10px] text-slate-400 block">Spatial Proximity</span>
                <span className="text-base font-bold font-mono text-rose-400">{selectedAlert.distanceMeters}m</span>
                <span className="text-[9px] text-slate-500 block">Critical Threshold &lt; 50m</span>
              </div>
              <div className="bg-[#020C1B] p-3 rounded-lg border border-[#1E3A5F] text-center">
                <span className="text-[10px] text-slate-400 block">NLP Title Similarity</span>
                <span className="text-base font-bold font-mono text-amber-400">{selectedAlert.semanticSimilarityPercent}%</span>
                <span className="text-[9px] text-slate-500 block">BERT Vector Match</span>
              </div>
              <div className="bg-[#020C1B] p-3 rounded-lg border border-[#1E3A5F] text-center">
                <span className="text-[10px] text-slate-400 block">Duplicate Probability</span>
                <span className="text-base font-bold font-mono text-rose-400">{selectedAlert.overlapProbabilityPercent}%</span>
                <span className="text-[9px] text-slate-500 block">High Confidence Flag</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
              <strong>Audit Recommendation:</strong> The physical location and functional purpose of both assets overlap completely within an 8-15 meter radius. Two separate funds were disbursed for the same asset. Recommend issuing an immediate <strong>Stay Order on MPLADS 2nd Tranche Release</strong> and initiating inter-departmental physical verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
