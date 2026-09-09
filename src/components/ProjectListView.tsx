import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, ArrowUpDown, ChevronRight, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { ProjectRecord, Language } from '../types';
import { api } from '../services/api';

interface ProjectListViewProps {
  onSelectProject: (project: ProjectRecord) => void;
  lang: Language;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({ onSelectProject, lang }) => {
  const isHi = lang !== 'en';
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedRiskBand, setSelectedRiskBand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.getProjects({
        search: search || undefined,
        category: selectedCategory || undefined,
        state: selectedState || undefined,
        risk_band: selectedRiskBand || undefined,
        page,
        limit: 25
      });
      let projs = res.projects;
      if (selectedStatus) {
        projs = projs.filter(p => p.workflow_status === selectedStatus);
      }
      setProjects(projs);
      setTotalCount(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, selectedCategory, selectedState, selectedRiskBand, selectedStatus, page]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F233D] border border-[#1E3A5F] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
              {isHi ? "राष्ट्रीय रिपोजिटरी" : "National Repository"}
            </span>
            <span className="text-xs text-slate-400 font-mono">320+ MPLADS Projects Monitored</span>
          </div>
          <h1 className="text-xl font-extrabold text-white font-serif">
            {isHi ? "एमपीलैड्स प्रोजेक्ट ऑडिट इंडेक्स" : "MPLADS Project Audit Directory"}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi ? "जोखिम स्कोर, कार्टेल फ्लैग और जियो-टैग सत्यापन स्थिति के आधार पर खोजें और फ़िल्टर करें।" : "Multi-factor filterable database sorted by autonomous AI risk score."}
          </p>
        </div>

        <div className="bg-[#020C1B] border border-[#1E3A5F] px-4 py-2 rounded-xl text-right font-mono">
          <div className="text-[10px] text-slate-400 uppercase">Filtered Records</div>
          <div className="text-lg font-extrabold text-amber-400">{totalCount} Works</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] p-4 rounded-xl shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              placeholder={isHi ? "शीर्षक, वर्क कोड या निर्वाचन क्षेत्र खोजें..." : "Search title, work code, constituency..."}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-lg pl-9 pr-3 py-2 text-white outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
            className="bg-[#020C1B] border border-[#1E3A5F] rounded-lg px-2.5 py-2 text-white outline-none focus:border-amber-400"
          >
            <option value="">{isHi ? "सभी श्रेणियां" : "All Categories"}</option>
            <option value="Road Construction">Road Construction</option>
            <option value="Community Building">Community Building</option>
            <option value="Water Supply & Drainage">Water Supply & Drainage</option>
            <option value="Solar & Electrical">Solar & Electrical</option>
            <option value="Sanitation & Waste">Sanitation & Waste</option>
            <option value="Education Infrastructure">Education Infrastructure</option>
          </select>

          {/* Risk Band Dropdown */}
          <select
            value={selectedRiskBand}
            onChange={e => { setSelectedRiskBand(e.target.value); setPage(1); }}
            className="bg-[#020C1B] border border-[#1E3A5F] rounded-lg px-2.5 py-2 text-white outline-none focus:border-amber-400 font-mono"
          >
            <option value="">{isHi ? "सभी जोखिम स्तर" : "All Risk Bands"}</option>
            <option value="CRITICAL">CRITICAL (70-100)</option>
            <option value="HIGH">HIGH (45-69)</option>
            <option value="MEDIUM">MEDIUM (20-44)</option>
            <option value="LOW">LOW (0-19)</option>
          </select>

          {/* Workflow Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="bg-[#020C1B] border border-[#1E3A5F] rounded-lg px-2.5 py-2 text-white outline-none focus:border-amber-400 font-mono"
          >
            <option value="">{isHi ? "सभी स्थितियां" : "All Workflow Statuses"}</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="FLAGGED">FLAGGED</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="CLEARED">CLEARED</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#020C1B] text-slate-400 uppercase font-mono text-[10px] border-b border-[#1E3A5F]">
              <tr>
                <th className="p-3.5">Work Code</th>
                <th className="p-3.5">Title / Scope</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Constituency</th>
                <th className="p-3.5 text-right">Cost (Lakhs)</th>
                <th className="p-3.5 text-center">AI Risk Score</th>
                <th className="p-3.5 text-center">Workflow</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E3A5F]/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-mono">
                    <div className="inline-block animate-spin mr-2">⟳</div>
                    Loading audit dataset records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-mono">
                    No flagged or compliant projects match the active filters.
                  </td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-[#1E3A5F]/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-sky-400">
                      {p.work_code}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-white truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{p.contractor_name}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div>{p.constituency_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.state}</div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-white whitespace-nowrap">
                      ₹{p.sanctioned_cost_lakhs}L
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] border ${
                        p.risk_band === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : p.risk_band === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : p.risk_band === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {p.risk_score} / 100 • {p.risk_band}
                      </span>
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        p.workflow_status === 'CLEARED'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : p.workflow_status === 'ESCALATED'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {p.workflow_status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectProject(p)}
                        className="px-2.5 py-1 rounded bg-[#020C1B] hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-[#1E3A5F] hover:border-amber-400 transition-all font-medium text-[11px] cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-[#020C1B] p-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Showing Page {page} of {totalPages || 1} ({totalCount} total)
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-[#1E3A5F] disabled:opacity-30 hover:bg-[#1E3A5F] cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded border border-[#1E3A5F] disabled:opacity-30 hover:bg-[#1E3A5F] cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
