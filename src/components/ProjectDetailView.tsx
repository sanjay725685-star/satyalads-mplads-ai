import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, ArrowLeft, FileText, MapPin, Building, User, Phone, Hash, Calendar, Layers, ExternalLink } from 'lucide-react';
import { ProjectRecord, WorkflowStatus, Language } from '../types';
import { api } from '../services/api';

interface ProjectDetailViewProps {
  project: ProjectRecord;
  onBack: () => void;
  onOpenReport: (project: ProjectRecord) => void;
  lang: Language;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ project, onBack, onOpenReport, lang }) => {
  const isHi = lang !== 'en';
  const [currentStatus, setCurrentStatus] = useState<WorkflowStatus>(project.workflow_status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus: WorkflowStatus) => {
    setIsUpdatingStatus(true);
    try {
      await api.updateProjectStatus(project.id, newStatus);
      setCurrentStatus(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const flags = project.flags || [];
  const score = project.risk_score || 0;
  const isCritical = score >= 70;
  const isHigh = score >= 45;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer bg-[#0F233D] px-3 py-1.5 rounded-lg border border-[#1E3A5F]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHi ? "← ऑडिट सूची पर वापस जाएं" : "← Back to Audit Directory"}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenReport(project)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 text-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{isHi ? "आधिकारिक रिपोर्ट / पीडीएफ उत्पन्न करें" : "Generate Official Audit Report"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Overview Header & Risk Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Summary (8 cols) */}
        <div className="lg:col-span-8 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {project.work_code}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {project.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Constituency: <strong className="text-white">{project.constituency_name} ({project.state})</strong>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white font-serif tracking-tight leading-snug">
              {project.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sanction Date: <span className="text-slate-300 font-mono">{project.sanction_date}</span> • Target: <span className="text-slate-300 font-mono">{project.target_completion_date}</span>
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">Sanctioned</span>
              <span className="text-base font-extrabold text-white">₹{project.sanctioned_cost_lakhs}L</span>
            </div>
            <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">Expenditure</span>
              <span className="text-base font-extrabold text-amber-400">₹{project.expenditure_lakhs}L</span>
            </div>
            <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">MP (Lok Sabha)</span>
              <span className="text-xs font-bold text-white truncate block">{project.mp_name}</span>
            </div>
            <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl font-mono">
              <span className="text-[10px] text-slate-500 block uppercase">District</span>
              <span className="text-xs font-bold text-white truncate block">{project.district}</span>
            </div>
          </div>

          {/* Contractor Profile */}
          <div className="bg-[#020C1B] border border-[#1E3A5F] p-4 rounded-xl space-y-2 text-xs">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Awarded Contractor Entity</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-bold text-white">{project.contractor_name}</span>
              <span className="text-xs text-slate-400 font-mono">Phone: {project.contractor_phone}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-[#1E3A5F]/60 pt-2">
              <div>PAN: <strong className="text-slate-200">{project.contractor_pan}</strong></div>
              <div>GSTIN: <strong className="text-slate-200">{project.contractor_gstin}</strong></div>
              <div className="sm:col-span-2">Registered Address: <span className="text-slate-300">{project.contractor_address}</span></div>
            </div>
          </div>

          {/* Interactive Workflow Stepper */}
          <div className="bg-[#020C1B] border border-[#1E3A5F] p-4 rounded-xl space-y-3">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
              <span>Auditor Bureaucratic Workflow Status</span>
              {isUpdatingStatus && <span className="text-amber-400 animate-pulse">Updating...</span>}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(['UNDER_REVIEW', 'FLAGGED', 'ESCALATED', 'CLEARED'] as WorkflowStatus[]).map((st) => {
                const isActive = currentStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-1 rounded-lg text-center font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      isActive
                        ? st === 'CLEARED'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                          : st === 'ESCALATED'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/20'
                          : 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-900 border-[#1E3A5F] text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Animated Risk Gauge & Geotag Verification (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Gauge Card */}
          <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
              {isHi ? "स्वायत्त एआई जोखिम रेटिंग" : "Autonomous AI Risk Rating"}
            </div>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    isCritical ? 'text-rose-500' : isHigh ? 'text-orange-500' : score >= 20 ? 'text-amber-400' : 'text-emerald-400'
                  } transition-all duration-1000 ease-out`}
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold font-mono text-white">{score}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">out of 100</span>
              </div>
            </div>

            <div className={`py-1.5 px-3 rounded-full text-xs font-mono font-bold inline-block ${
              isCritical
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : isHigh
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                : score >= 20
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {project.risk_band} RISK LEVEL
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {flags.length > 0 
                ? `Engine flagged ${flags.length} statutory anomalies correlating multi-modal signals.`
                : "All spatial, cost, graph, and EXIF parameters match GFR guidelines."}
            </p>
          </div>

          {/* Photographic Evidence Card */}
          <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
              <span>Site Photo Geotag Audit</span>
              {project.photo_exif_lat ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> EXIF Found
                </span>
              ) : (
                <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Stripped EXIF
                </span>
              )}
            </div>

            <div className="relative h-36 bg-[#020C1B] rounded-xl overflow-hidden border border-[#1E3A5F]">
              <img
                src={project.site_photo_url}
                alt="Site Evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/80 p-2 text-[9px] font-mono text-emerald-300">
                <div>EXIF GPS: {project.photo_exif_lat ? `${project.photo_exif_lat}°N, ${project.photo_exif_lng}°E` : 'NONE'}</div>
                <div className="text-slate-400">Timestamp: {project.photo_exif_timestamp || 'No Timestamp'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flag Cards Section: Explainable AI with GFR Citations */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>Explainable Fraud & Anomaly Findings ({flags.length} Triggered)</span>
        </h2>

        {flags.length === 0 ? (
          <div className="bg-[#0F233D] border border-emerald-500/40 rounded-2xl p-6 text-center text-emerald-300 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
            <h3 className="font-bold text-base">Clean Compliance Record</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              No anomalies detected. Project location matches photo geotag within 40m, cost matches PWD schedule of rates, and contractor has zero cartel links.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flags.map((flag, idx) => {
              const isCrit = flag.severity === 'CRITICAL';
              return (
                <div
                  key={idx}
                  className={`bg-[#0F233D] border rounded-2xl p-5 shadow-xl space-y-3 ${
                    isCrit ? 'border-rose-500/60 bg-rose-950/10' : 'border-amber-500/60 bg-amber-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${isCrit ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-xs">{flag.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{flag.module}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCrit ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {flag.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {flag.description}
                  </p>

                  {/* Exact Metric Trigger */}
                  <div className="bg-[#020C1B] border border-[#1E3A5F] p-2.5 rounded-lg font-mono text-[11px] text-sky-300 space-y-1">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Statistic / Metric Cited:</div>
                    <div>{flag.metric_cited}</div>
                  </div>

                  {/* Statutory GFR Reference */}
                  {flag.gfr_citation && (
                    <div className="text-[10px] font-mono text-amber-400/90 border-t border-[#1E3A5F]/60 pt-2">
                      Statutory Reference: <strong>{flag.gfr_citation}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
