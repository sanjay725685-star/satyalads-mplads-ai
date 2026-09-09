import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, AlertTriangle, Globe } from 'lucide-react';
import { Language, ProjectRecord } from '../types';
import { api } from '../services/api';

interface PublicTransparencyViewProps {
  lang: Language;
}

export const PublicTransparencyView: React.FC<PublicTransparencyViewProps> = ({ lang }) => {
  const isHi = lang !== 'en';
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
      {/* Official Banner Card */}
      <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm border-t-4 border-[#003366] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#138808]/15 text-[#0F6806] border border-[#138808]/30 font-mono uppercase tracking-wider">
              Open Governance • Public Audit Ledger
            </span>
            <span className="text-xs text-slate-500 font-mono">e-SAKSHI Public Citizen Portal • Section 4 RTI Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#002244] font-serif">
            {isHi ? "नागरिक पारदर्शिता एवं सार्वजनिक ऑडिट पोर्टल" : "Citizen Public Transparency & Accountability Portal"}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {isHi 
              ? "सार्वजनिक धन के उपयोग की खुली निगरानी। यह सार्वजनिक पृष्ठ बिना किसी संविदाकार व्यक्तिगत पहचान (PII) के केवल कुल राशि और कार्य की स्थिति प्रदर्शित करता है।"
              : "Open citizen surveillance of MPLADS fund utilization. This official public view displays aggregated integrity statistics sanitized of contractor PII in accordance with the Digital Personal Data Protection (DPDP) Act, 2023."}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#F8FAFC] border border-slate-300 p-4 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366]">
            <Globe className="w-6 h-6" />
          </div>
          <div className="font-mono text-xs">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Public Clearance</div>
            <div className="text-[#003366] font-bold">Unauthenticated Open Ledger</div>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm border-t-2 border-[#003366] space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Total Funds Monitored</span>
          <span className="text-2xl font-bold text-[#002244] font-mono">₹{summary?.total_funds_tracked_cr || '138.4'} Cr</span>
          <span className="text-[10px] text-slate-500 block">Across 25 Lok Sabha Seats</span>
        </div>
        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm border-t-2 border-[#FF9933] space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Public Works Tracked</span>
          <span className="text-2xl font-bold text-[#002244] font-mono">{summary?.total_projects_monitored || 320} Works</span>
          <span className="text-[10px] text-slate-500 block">100% Geotag Inspected</span>
        </div>
        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm border-t-2 border-amber-500 space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Flagged for Re-Inspection</span>
          <span className="text-2xl font-bold text-[#B85D00] font-mono">{summary?.flagged_irregularities_percentage || '26.5'}%</span>
          <span className="text-[10px] text-slate-500 block">Automatic Discrepancies</span>
        </div>
        <div className="bg-white border border-slate-300 p-4 rounded-lg shadow-sm border-t-2 border-[#138808] space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Active States / UTs</span>
          <span className="text-2xl font-bold text-[#0F6806] font-mono">{summary?.active_states_monitored || 13} States</span>
          <span className="text-[10px] text-slate-500 block">Pan-India Geographic Reach</span>
        </div>
      </div>

      {/* Sanitized Public Project Directory */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm space-y-4 border-t-2 border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-[#002244] font-serif">
              {isHi ? "सार्वजनिक कार्य निर्देशिका (संविदाकार पहचान रहित)" : "Sanitized Public Project Directory (PII Redacted)"}
            </h2>
            <p className="text-[11px] text-slate-500">
              Contractor PAN, GSTIN, and registration credentials are protected under Government Data Privacy Standards.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search public records..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-[#003366]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#003366] text-white uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Work Code</th>
                <th className="p-3">Project Scope</th>
                <th className="p-3">Constituency</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Cost (Lakhs)</th>
                <th className="p-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProjects.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50/40' : 'bg-[#F8FAFC] hover:bg-blue-50/40'}>
                  <td className="p-3 font-mono font-bold text-[#003366]">{p.work_code}</td>
                  <td className="p-3 font-semibold text-slate-900 max-w-sm truncate">{p.title}</td>
                  <td className="p-3">{p.constituency_name} ({p.state})</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">₹{p.sanctioned_cost_lakhs}L</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      p.risk_score >= 45 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
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
