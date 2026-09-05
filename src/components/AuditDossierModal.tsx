import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  Layers, 
  Share2,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { WorkItem, WIRIBreakdown } from '../types';
import { calculateWIRIBreakdown } from '../services/aiEngine';

interface AuditDossierModalProps {
  work: WorkItem | null;
  onClose: () => void;
}

export const AuditDossierModal: React.FC<AuditDossierModalProps> = ({
  work,
  onClose
}) => {
  if (!work) return null;

  const breakdown: WIRIBreakdown = calculateWIRIBreakdown(work);
  const isCritical = work.riskLevel === 'CRITICAL';
  const isHigh = work.riskLevel === 'HIGH';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="bg-[#0A192F] border-b border-[#1E3A5F] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                  CONFIDENTIAL VIGILANCE AUDIT
                </span>
                <span className="text-xs font-mono text-slate-400">Ref: {work.code}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Work Integrity & Forensic Dossier
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-[#020C1B] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E3A5F] transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#020C1B] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1E3A5F] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Work Summary Card */}
          <div className="bg-[#020C1B] border border-[#1E3A5F] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">{work.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{work.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2 font-mono">
                <span>Sanctioned: <strong>₹{work.sanctionedAmountLakhs} L</strong></span>
                <span>•</span>
                <span>Agency: <strong>{work.implementingAgency}</strong></span>
                <span>•</span>
                <span>Contractor: <strong className="text-amber-300">{work.contractorName}</strong></span>
              </div>
            </div>

            {/* Composite WIRI Score */}
            <div className={`p-4 rounded-xl text-center border min-w-[140px] ${
              isCritical
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                : isHigh
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            }`}>
              <span className="text-[10px] uppercase font-mono font-bold block">WIRI Score</span>
              <span className="text-3xl font-extrabold font-mono">{breakdown.finalScore}/100</span>
              <span className="text-[10px] font-bold block mt-0.5">{breakdown.riskCategory} RISK</span>
            </div>
          </div>

          {/* Explainable AI (XAI) SHAP Feature Attribution Breakdown */}
          <div className="bg-[#0A192F] border border-[#1E3A5F] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Explainable AI (XAI) Risk Factor Attribution (SHAP Decomposition)</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Total Weight: 100%</span>
            </div>

            <div className="space-y-3">
              {Object.entries(breakdown.contributions).map(([key, factor]) => {
                const isHighFactor = factor.rawValue > 50;
                return (
                  <div key={key} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-200 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')} (Weight {Math.round(factor.weight * 100)}%)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[11px]">{factor.explanation}</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          isHighFactor ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          +{factor.contribution} pts
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#020C1B] h-2 rounded-full overflow-hidden border border-[#1E3A5F]/70">
                      <div 
                        className={`h-full transition-all rounded-full ${
                          isHighFactor ? 'bg-rose-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${factor.rawValue}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actionable Audit Recommendations */}
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 space-y-3">
            <h4 className="font-bold text-xs text-rose-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Automated Vigilance & Collector Audit Directives</span>
            </h4>
            <div className="space-y-2 text-xs">
              {breakdown.auditRecommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#020C1B]/80 p-3 rounded-lg border border-rose-500/20 text-slate-200">
                  <span className="text-rose-400 font-bold font-mono">0{i + 1}.</span>
                  <span className="font-medium leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#0A192F] border-t border-[#1E3A5F] px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            System Stamp: <span className="text-sky-300 font-mono">MoSPI-AI-CERT-2024-VAR-0912</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Stay Order Issued on Fund Disbursement for Work ID ${work.code}. Central Vigilance Notified.`);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all shadow-md shadow-rose-500/20 flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Issue Stay Order on 2nd Tranche</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
