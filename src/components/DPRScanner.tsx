import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Upload, 
  FileText, 
  Sparkles, 
  DollarSign, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { SAMPLE_DPRS } from '../data/mockData';
import { DPRDocument } from '../types';

export const DPRScanner: React.FC = () => {
  const [selectedDprKey, setSelectedDprKey] = useState<string>('DPR-001');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const currentDpr: DPRDocument = SAMPLE_DPRS[selectedDprKey] || SAMPLE_DPRS['DPR-001'];

  const handleSwitchDpr = (key: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSelectedDprKey(key);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Agentic LLM & LayoutLM OCR Auditor
            </span>
            <span className="text-xs text-slate-400 font-mono">CPWD Schedule of Rates (DSR 2023) Cross-Audit</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-400" />
            <span>Detailed Project Report (DPR) & Cost Inflation Scanner</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Parses scanned engineering estimates, bills of quantities (BOQ), and sanction documents to detect price inflation and guideline violations.
          </p>
        </div>

        {/* DPR Selector / Upload action */}
        <div className="flex items-center space-x-2 bg-[#020C1B] px-3 py-2 rounded-xl border border-[#1E3A5F] text-xs">
          <span className="text-slate-400 font-mono">Sample DPR:</span>
          <select
            value={selectedDprKey}
            onChange={(e) => handleSwitchDpr(e.target.value)}
            className="bg-transparent text-white font-semibold outline-none cursor-pointer"
          >
            <option value="DPR-001" className="bg-[#0A192F]">DPR 1: Rohania CC Road (+45% Price Inflation)</option>
            <option value="DPR-004" className="bg-[#0A192F]">DPR 2: Assi Trust Bhavan (Prohibited Religious Asset)</option>
          </select>
        </div>
      </div>

      {/* Summary Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Claimed Budget</span>
          <span className="text-2xl font-extrabold text-white font-mono">₹{currentDpr.totalClaimedCostLakhs} L</span>
          <span className="text-[11px] text-slate-400 block mt-1">Submitted in DPR</span>
        </div>

        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">CPWD DSR Permissible</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">₹{currentDpr.permissibleCostLakhs} L</span>
          <span className="text-[11px] text-slate-400 block mt-1">Authorized Ceiling</span>
        </div>

        <div className="bg-[#0F233D] border border-rose-500/40 bg-rose-500/10 p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-rose-300 block">Detected Inflation / Excess</span>
          <span className="text-2xl font-extrabold text-rose-400 font-mono">₹{currentDpr.totalInflationLakhs} L</span>
          <span className="text-[11px] text-rose-300 block mt-1">+{currentDpr.overallMarkupPercent}% Overcharge</span>
        </div>

        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Guideline Compliance</span>
          <span className={`text-base font-extrabold block mt-1 ${
            currentDpr.guidelineCompliance.isPermissibleAsset ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {currentDpr.guidelineCompliance.isPermissibleAsset ? 'RATES INFLATED' : 'PROHIBITED ASSET'}
          </span>
          <span className="text-[11px] text-slate-400 block">Rule 5.2 Status</span>
        </div>
      </div>

      {/* Guideline Violations Alert Box */}
      {currentDpr.guidelineCompliance.violationsFound.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2">
          <h3 className="font-bold text-xs text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>MPLADS Guideline (2023 Revision) Non-Compliance Flags</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {currentDpr.guidelineCompliance.violationsFound.map((v, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Itemized Bill of Quantities (BOQ) Audit Table */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-sky-400" />
              <span>Itemized Material & Labor Schedule Comparison</span>
            </h2>
            <p className="text-xs text-slate-400">
              Scanned line items matched against official Central Public Works Department (CPWD) Delhi Schedule of Rates
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-[#020C1B] px-3 py-1 rounded-lg border border-[#1E3A5F]">
            File: {currentDpr.fileName}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1E3A5F]/70">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A192F] text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-[#1E3A5F]">
              <tr>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4">Quantity / Unit</th>
                <th className="py-3 px-4">Claimed Rate</th>
                <th className="py-3 px-4">CPWD DSR Rate</th>
                <th className="py-3 px-4">Inflation %</th>
                <th className="py-3 px-4">Claimed Total</th>
                <th className="py-3 px-4">Permissible</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/40 bg-[#0F233D]/60">
              {currentDpr.lineItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 max-w-sm">
                    <span className="font-semibold text-white block">{item.itemDescription}</span>
                    {item.reason && (
                      <span className="text-[10px] text-rose-400 block mt-0.5">{item.reason}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-300">
                    ₹{item.claimedRateInr.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    ₹{item.cpwdDsrRateInr.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      item.rateInflationPercent > 30 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      +{item.rateInflationPercent}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    ₹{(item.claimedTotalInr / 100000).toFixed(2)} L
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                    ₹{(item.permissibleTotalInr / 100000).toFixed(2)} L
                  </td>
                  <td className="py-3.5 px-4">
                    {item.isFlagged ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                        <AlertTriangle className="w-3 h-3" /> OVERPRICED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
