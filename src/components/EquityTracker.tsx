import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  Scale,
  Users2,
  Hourglass
} from 'lucide-react';
import { Constituency, WorkItem } from '../types';

interface EquityTrackerProps {
  constituency: Constituency;
  works: WorkItem[];
}

export const EquityTracker: React.FC<EquityTrackerProps> = ({
  constituency,
  works
}) => {
  const scTarget = 15.0;
  const stTarget = 7.5;

  const isScCompliant = constituency.scAllocationPercent >= scTarget;
  const isStCompliant = constituency.stAllocationPercent >= stTarget;

  const scWorks = works.filter(w => w.demographicZone === 'SC_MANDATED');
  const stWorks = works.filter(w => w.demographicZone === 'ST_MANDATED');
  const languishingWorks = works.filter(w => w.status === 'LANGUISHING' || w.flags.some(f => f.type === 'FUND_PARKING_STALL'));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              Statutory Social Justice & Fund Velocity Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">MPLADS Rule 2.4 Demographic Audit</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-400" />
            <span>SC / ST Mandatory Quota Compliance & Fund Languishing Velocity</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Audits mandatory 15% (SC) and 7.5% (ST) financial allocation rules and predicts project stalling / fund parking risks.
          </p>
        </div>

        <div className="bg-[#020C1B] border border-[#1E3A5F] px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Constituency</span>
            <span className="text-sm font-bold text-white">{constituency.name} ({constituency.state})</span>
          </div>
        </div>
      </div>

      {/* Statutory Quota Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SC Quota Card (15% Target) */}
        <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-sm">
                SC
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Scheduled Caste (SC) Quota Target</h3>
                <span className="text-xs text-slate-400">Statutory Minimum: 15.0% of Annual Entitlement</span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
              isScCompliant 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}>
              {isScCompliant ? 'COMPLIANT (>= 15%)' : 'DEFICIT ALERT'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Current Allocation:</span>
              <span className="font-bold font-mono text-white text-base">{constituency.scAllocationPercent}%</span>
            </div>
            <div className="w-full bg-[#020C1B] h-3 rounded-full overflow-hidden border border-[#1E3A5F]">
              <div 
                className={`h-full transition-all rounded-full ${isScCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, (constituency.scAllocationPercent / 20) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-amber-400 font-bold">15% Threshold</span>
              <span>20%</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-[#020C1B] p-3 rounded-xl border border-[#1E3A5F]">
            Total Allocated: <strong className="text-purple-300 font-mono">₹{((constituency.totalSanctionedCr * constituency.scAllocationPercent) / 100).toFixed(2)} Cr</strong> across {scWorks.length} sanctioned projects.
          </div>
        </div>

        {/* ST Quota Card (7.5% Target) */}
        <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm">
                ST
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Scheduled Tribe (ST) Quota Target</h3>
                <span className="text-xs text-slate-400">Statutory Minimum: 7.5% of Annual Entitlement</span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
              isStCompliant 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}>
              {isStCompliant ? 'COMPLIANT (>= 7.5%)' : 'DEFICIT ALERT'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Current Allocation:</span>
              <span className="font-bold font-mono text-white text-base">{constituency.stAllocationPercent}%</span>
            </div>
            <div className="w-full bg-[#020C1B] h-3 rounded-full overflow-hidden border border-[#1E3A5F]">
              <div 
                className={`h-full transition-all rounded-full ${isStCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, (constituency.stAllocationPercent / 15) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>0%</span>
              <span className="text-amber-400 font-bold">7.5% Threshold</span>
              <span>15%</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 bg-[#020C1B] p-3 rounded-xl border border-[#1E3A5F]">
            Total Allocated: <strong className="text-amber-300 font-mono">₹{((constituency.totalSanctionedCr * constituency.stAllocationPercent) / 100).toFixed(2)} Cr</strong> across {stWorks.length} sanctioned projects.
          </div>
        </div>
      </div>

      {/* Languishing Projects & Fund Parking Velocity Radar */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Hourglass className="w-5 h-5 text-amber-400" />
              <span>Predictive ML Fund Parking & Languishing Milestone Radar</span>
            </h2>
            <p className="text-xs text-slate-400">
              Projects stalled for &gt;12 months with funds locked in IA non-interest accounts
            </p>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg border border-amber-500/30">
            {languishingWorks.length} Stalled Works Detected
          </span>
        </div>

        <div className="space-y-3">
          {languishingWorks.map((work) => (
            <div 
              key={work.id}
              className="bg-[#020C1B] border border-amber-500/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-sky-400 font-bold">{work.code}</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                    14 MONTHS STALLED
                  </span>
                </div>
                <h3 className="font-bold text-white text-xs">{work.title}</h3>
                <p className="text-[11px] text-slate-400">
                  Agency: {work.implementingAgency} • Contractor: {work.contractorName}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Locked / Parked Funds</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">₹{work.sanctionedAmountLakhs - work.utilizedAmountLakhs} L</span>
                  <span className="text-[10px] text-slate-500 block">of ₹{work.sanctionedAmountLakhs} L Sanctioned</span>
                </div>

                <button className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 whitespace-nowrap">
                  Recall Idle Advance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
