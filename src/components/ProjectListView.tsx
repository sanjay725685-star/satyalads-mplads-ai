import React, { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, ArrowUpDown, ChevronRight, ShieldAlert, FileText, CheckCircle2, Building, MapPin } from 'lucide-react';
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header (Government Gazette Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-300 p-5 rounded-md shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0B3D91] border border-blue-200 uppercase font-mono">
              {isHi ? 'राष्ट्रीय रिपोजिटरी' : 'National Repository'}
            </span>
            <span className="text-xs text-slate-500 font-mono">320+ MPLADS Projects Monitored</span>
          </div>
          <h1 className="text-xl font-bold text-[#002244] font-serif">
            {isHi ? 'एमपीलैड्स प्रोजेक्ट ऑडिट इंडेक्स' : 'MPLADS Project Audit Directory'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {isHi ? 'जोखिम स्कोर, कार्टेल फ्लैग और जियो-टैग सत्यापन स्थिति के आधार पर खोजें और फ़िल्टर करें।' : 'Official repository of project filings sorted by autonomous multi-modal vigilance score.'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-300 px-4 py-2 rounded text-right font-mono">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Filtered Records</div>
          <div className="text-lg font-bold text-[#002244]">{totalCount} Works</div>
        </div>
      </div>

      {/* 2. Official Filter Bar */}
      <div className="bg-white border border-slate-300 p-4 rounded-md shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              placeholder={isHi ? 'शीर्षक, वर्क कोड या निर्वाचन क्षेत्र खोजें...' : 'Search title, work code, constituency...'}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-slate-900 text-xs outline-none focus:bg-white focus:border-[#0B3D91]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs outline-none focus:bg-white focus:border-[#0B3D91]"
          >
            <option value="">{isHi ? 'सभी श्रेणियां' : 'All Categories'}</option>
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
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs outline-none focus:bg-white focus:border-[#0B3D91] font-mono"
          >
            <option value="">{isHi ? 'सभी जोखिम स्तर' : 'All Risk Bands'}</option>
            <option value="CRITICAL">CRITICAL (70-100)</option>
            <option value="HIGH">HIGH (45-69)</option>
            <option value="MEDIUM">MEDIUM (20-44)</option>
            <option value="LOW">LOW (0-19)</option>
          </select>

          {/* Workflow Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs outline-none focus:bg-white focus:border-[#0B3D91] font-mono"
          >
            <option value="">{isHi ? 'सभी स्थितियां' : 'All Workflow Statuses'}</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="FLAGGED">FLAGGED</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="CLEARED">CLEARED</option>
          </select>
        </div>
      </div>

      {/* 3. Projects Table (Government Gazette Registry Style) */}
      <div className="bg-white border border-slate-300 rounded-md shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#002244] text-white uppercase font-sans text-[10px] tracking-wide">
              <tr>
                <th className="p-3">Work Code</th>
                <th className="p-3">Title / Scope</th>
                <th className="p-3">Category</th>
                <th className="p-3">Constituency</th>
                <th className="p-3 text-right">Cost (Lakhs)</th>
                <th className="p-3 text-center">AI Risk Score</th>
                <th className="p-3 text-center">Workflow</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                    <div className="inline-block animate-spin mr-2">⟳</div>
                    Loading audit dataset records...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-mono">
                    No flagged or compliant projects match the active filters.
                  </td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#0B3D91]">
                      {p.work_code}
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{p.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">{p.contractor_name}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{p.constituency_name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.state}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                      ₹{p.sanctioned_cost_lakhs}L
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] border ${
                        p.risk_band === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : p.risk_band === 'HIGH'
                          ? 'bg-orange-100 text-orange-800 border-orange-300'
                          : p.risk_band === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        {p.risk_score} / 100 • {p.risk_band}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap font-mono text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        p.workflow_status === 'CLEARED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.workflow_status === 'ESCALATED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.workflow_status}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectProject(p)}
                        className="px-2.5 py-1 rounded bg-[#0B3D91] hover:bg-[#002244] text-white font-bold text-[11px] cursor-pointer flex items-center gap-1 mx-auto transition-all shadow-xs"
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
        <div className="bg-slate-50 p-3 border-t border-slate-300 flex items-center justify-between text-xs font-mono text-slate-600">
          <div>
            Showing Page {page} of {totalPages || 1} ({totalCount} total)
          </div>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-200 cursor-pointer text-slate-800 font-semibold"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-200 cursor-pointer text-slate-800 font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
