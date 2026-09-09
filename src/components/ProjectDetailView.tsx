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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#002244] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded border border-slate-300 shadow-xs w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#0B3D91]" />
          <span>{isHi ? '← ऑडिट सूची पर वापस जाएं' : '← Back to Audit Directory'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenReport(project)}
            className="px-4 py-2 bg-[#0B3D91] hover:bg-[#002244] text-white font-bold rounded flex items-center gap-2 shadow-xs text-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>{isHi ? 'आधिकारिक रिपोर्ट / पीडीएफ उत्पन्न करें' : 'Generate Official Audit Report (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Official Case File Header (Government Dossier Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Project Dossier Details (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-300 rounded-md p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#0B3D91] border border-blue-200">
              FILE: {project.work_code}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {project.category}
            </span>
            <span className="text-xs text-slate-600 font-mono">
              Constituency: <strong className="text-slate-900">{project.constituency_name} ({project.state})</strong>
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#002244] font-serif tracking-tight leading-snug">
              {project.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Sanction Date: <span className="text-slate-800 font-bold">{project.sanction_date}</span> • Target Completion: <span className="text-slate-800 font-bold">{project.target_completion_date}</span>
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Sanctioned</span>
              <span className="text-base font-bold text-[#002244]">₹{project.sanctioned_cost_lakhs}L</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Disbursed</span>
              <span className="text-base font-bold text-[#FF9933]">₹{project.expenditure_lakhs}L</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">MP (Lok Sabha)</span>
              <span className="text-xs font-bold text-slate-800 truncate block">{project.mp_name}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded font-mono">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">District</span>
              <span className="text-xs font-bold text-slate-800 truncate block">{project.district}</span>
            </div>
          </div>

          {/* Awarded Contractor Profile */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-2 text-xs">
            <div className="text-[10px] font-bold uppercase text-[#002244] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>Contractor Entity & Entity Graph Data</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">{project.contractor_name}</span>
              <span className="text-xs text-slate-600 font-mono">Phone: {project.contractor_phone}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-600 border-t border-slate-200 pt-2">
              <div>PAN: <strong className="text-slate-900">{project.contractor_pan}</strong></div>
              <div>GSTIN: <strong className="text-slate-900">{project.contractor_gstin}</strong></div>
              <div className="sm:col-span-2">Registered Address: <span className="text-slate-800">{project.contractor_address}</span></div>
            </div>
          </div>

          {/* Bureaucratic Workflow Stepper */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded space-y-3">
            <div className="text-[10px] font-bold uppercase text-[#002244] flex items-center justify-between">
              <span>Auditor Bureaucratic Action Stepper</span>
              {isUpdatingStatus && <span className="text-[#FF9933] animate-pulse">Syncing...</span>}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['UNDER_REVIEW', 'FLAGGED', 'ESCALATED', 'CLEARED'] as WorkflowStatus[]).map((st) => {
                const isActive = currentStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(st)}
                    className={`py-2 px-1 rounded text-center font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                      isActive
                        ? st === 'CLEARED'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : st === 'ESCALATED'
                          ? 'bg-red-700 text-white border-red-800 shadow-xs'
                          : 'bg-[#FF9933] text-[#002244] border-amber-500 shadow-xs'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Risk Gauge & Geotag Verification (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Gauge Card */}
          <div className="bg-white border border-slate-300 rounded-md p-6 shadow-xs text-center space-y-4">
            <div className="text-xs font-bold uppercase text-[#002244] tracking-wider border-b border-slate-200 pb-2">
              {isHi ? 'स्वायत्त एआई जोखिम रेटिंग' : 'Autonomous AI Risk Rating'}
            </div>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    isCritical ? 'text-red-600' : isHigh ? 'text-orange-500' : score >= 20 ? 'text-amber-500' : 'text-emerald-600'
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
                <span className="text-3xl font-black font-mono text-[#002244]">{score}</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">out of 100</span>
              </div>
            </div>

            <div className={`py-1 px-3 rounded text-xs font-mono font-bold inline-block border ${
              isCritical
                ? 'bg-red-100 text-red-800 border-red-300'
                : isHigh
                ? 'bg-orange-100 text-orange-800 border-orange-300'
                : score >= 20
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              {project.risk_band} RISK LEVEL
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {flags.length > 0 
                ? `Engine flagged ${flags.length} statutory anomalies correlating multi-modal signals.`
                : 'All spatial, cost, graph, and EXIF parameters match GFR guidelines.'}
            </p>
          </div>

          {/* Photographic Evidence Card */}
          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold uppercase text-[#002244] flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Site Photo Geotag Audit</span>
              {project.photo_exif_lat ? (
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> EXIF Verified
                </span>
              ) : (
                <span className="text-[10px] text-red-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Stripped EXIF
                </span>
              )}
            </div>

            <div className="relative h-36 bg-slate-100 rounded overflow-hidden border border-slate-300">
              <img
                src={project.site_photo_url}
                alt="Site Evidence"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/75 p-2 text-[9px] font-mono text-emerald-300">
                <div>EXIF GPS: {project.photo_exif_lat ? `${project.photo_exif_lat}°N, ${project.photo_exif_lng}°E` : 'NONE'}</div>
                <div className="text-slate-300">Timestamp: {project.photo_exif_timestamp || 'No Timestamp'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Statutory Anomaly Citations Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#002244] font-serif flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0B3D91]" />
          <span>Statutory GFR 2017 & Forensic Findings ({flags.length} Flags Triggered)</span>
        </h2>

        {flags.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-md p-6 text-center text-emerald-900 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <h3 className="font-bold text-base">Clean Compliance Record</h3>
            <p className="text-xs text-slate-700 max-w-xl mx-auto">
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
                  className={`bg-white border rounded-md p-4 shadow-xs space-y-2.5 ${
                    isCrit ? 'border-red-300 border-l-4 border-l-red-600' : 'border-amber-300 border-l-4 border-l-[#FF9933]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${isCrit ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{flag.title}</h4>
                        <span className="text-[10px] font-mono text-slate-500">{flag.module}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isCrit ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {flag.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {flag.description}
                  </p>

                  {/* Exact Metric Trigger */}
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded font-mono text-[10px] text-slate-800 space-y-0.5">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Statistic / Metric Cited:</div>
                    <div className="text-[#0B3D91] font-bold">{flag.metric_cited}</div>
                  </div>

                  {/* Statutory GFR Reference */}
                  {flag.gfr_citation && (
                    <div className="text-[10px] font-mono text-[#002244] border-t border-slate-200 pt-2 font-semibold">
                      Statutory Authority: <span className="text-[#0B3D91] underline">{flag.gfr_citation}</span>
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
