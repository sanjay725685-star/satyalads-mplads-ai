import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';
import { Language, ProjectRecord } from '../types';
import { api } from '../services/api';

interface PublicTransparencyViewProps {
  lang: Language;
}

export const PublicTransparencyView: React.FC<PublicTransparencyViewProps> = ({ lang }) => {
  const isHi = lang === 'hi';
  const [summary, setSummary] = useState<any>(null);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getPublicSummary().then(setSummary);
    api.getProjects({ limit: 20 }).then(res => setProjects(res.projects));
  }, []);

  const filteredProjects = projects.filter(p => 
    !search || 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.constituency_name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-[#0F233D] border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono uppercase">
              Open Governance • Public Audit Loop
            </span>
            <span className="text-xs text-slate-400 font-mono">e-SAKSHI Public Ledger</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-serif">
            {isHi ? "नागरिक पारदर्शिता एवं सार्वजनिक ऑडिट पोर्टल" : "Citizen Public Transparency & Accountability Portal"}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isHi 
              ? "सार्वजनिक धन के उपयोग की खुली निगरानी। यह सार्वजनिक पृष्ठ बिना किसी संविदाकार व्यक्तिगत पहचान (PII) के केवल कुल राशि और कार्य की स्थिति प्रदर्शित करता है।"
              : "Open citizen surveillance of MPLADS fund utilization. This view displays aggregated integrity statistics sanitized of contractor PII."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#020C1B] border border-[#1E3A5F] p-4 rounded-xl">
          <Globe className="w-8 h-8 text-emerald-400" />
          <div className="font-mono text-xs">
            <div className="text-slate-400 text-[10px] uppercase">Public Access</div>
            <div className="text-emerald-400 font-bold">Unauthenticated Open Ledger</div>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Funds Monitored</span>
          <span className="text-2xl font-extrabold text-white font-mono">₹{summary?.total_funds_tracked_cr || '138.4'} Cr</span>
          <span className="text-[10px] text-slate-500 block">Across 25 Lok Sabha Seats</span>
        </div>
        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Public Works Tracked</span>
          <span className="text-2xl font-extrabold text-white font-mono">{summary?.total_projects_monitored || 320} Works</span>
          <span className="text-[10px] text-slate-500 block">100% Geotag Inspected</span>
        </div>
        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Flagged for Re-Inspection</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">{summary?.flagged_irregularities_percentage || '26.5'}%</span>
          <span className="text-[10px] text-slate-500 block">Automatic Discrepancies</span>
        </div>
        <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Active States / UTs</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">{summary?.active_states_monitored || 13} States</span>
          <span className="text-[10px] text-slate-500 block">Pan-India Geographic Reach</span>
        </div>
      </div>

      {/* Sanitized Public Project Directory */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-sm text-white font-serif">
              {isHi ? "सार्वजनिक कार्य निर्देशिका (संविदाकार पहचान रहित)" : "Sanitized Public Project Directory (PII Redacted)"}
            </h2>
            <p className="text-[11px] text-slate-400">
              Contractor PAN, GSTIN, and registration credentials are protected under Government Data Privacy Standards.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filter public records..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white outline-none focus:border-emerald-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020C1B] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1E3A5F]">
              <tr>
                <th className="p-3">Work Code</th>
                <th className="p-3">Project Scope</th>
                <th className="p-3">Constituency</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Cost (Lakhs)</th>
                <th className="p-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/60">
              {filteredProjects.map(p => (
                <tr key={p.id} className="hover:bg-[#1E3A5F]/20">
                  <td className="p-3 font-mono font-bold text-sky-400">{p.work_code}</td>
                  <td className="p-3 font-semibold text-white max-w-sm truncate">{p.title}</td>
                  <td className="p-3">{p.constituency_name} ({p.state})</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">₹{p.sanctioned_cost_lakhs}L</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      p.risk_score >= 45 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {p.risk_score >= 45 ? 'UNDER VIGILANCE AUDIT' : 'VERIFIED COMPLIANT'}
                    </span>
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
