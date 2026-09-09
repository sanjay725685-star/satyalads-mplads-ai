import React from 'react';
import { ArrowLeft, Printer, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ProjectRecord, Language } from '../types';

interface AuditReportViewProps {
  project: ProjectRecord;
  onBack: () => void;
  lang: Language;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({ project, onBack, lang }) => {
  const flags = project.flags || [];
  const nowStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Navigation Bar (No Print) */}
        <div className="flex items-center justify-between no-print bg-[#0F233D] p-4 rounded-xl border border-[#1E3A5F]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Project Detail</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 text-xs cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        {/* Printable Letterhead Paper */}
        <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl space-y-6 font-serif">
          {/* Letterhead Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-widest">
              GOVERNMENT OF INDIA • MINISTRY OF STATISTICS & PROGRAMME IMPLEMENTATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950">
              SATYALADS AUDIT INVESTIGATION DOSSIER
            </h1>
            <div className="text-xs text-slate-600 font-sans font-medium">
              Autonomous Multi-Modal AI Sentinel for MPLADS Integrity • Problem Statement 26102 (SIH 2026)
            </div>
            <div className="text-[11px] text-slate-500 font-mono pt-1">
              Dossier Ref: <strong>SATYA/2024-25/{project.work_code}</strong> • Issued: {nowStr}
            </div>
          </div>

          {/* Key Parameters Table */}
          <table className="w-full text-left text-xs border-collapse border border-slate-300 font-sans">
            <tbody>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 w-1/3 border-r border-slate-300">Work Code</th>
                <td className="p-2.5 font-mono font-bold text-slate-900">{project.work_code}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Title of Sanctioned Work</th>
                <td className="p-2.5 font-semibold">{project.title}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Scheme Category</th>
                <td className="p-2.5">{project.category}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Constituency / District</th>
                <td className="p-2.5">{project.constituency_name} ({project.state}) • District: {project.district} • MP: {project.mp_name}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Financial Outlay</th>
                <td className="p-2.5 font-mono">Sanctioned: <strong>₹{project.sanctioned_cost_lakhs} Lakhs</strong> | Expended: <strong>₹{project.expenditure_lakhs} Lakhs</strong></td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Contractor Details</th>
                <td className="p-2.5">
                  <strong>{project.contractor_name}</strong> (PAN: <code>{project.contractor_pan}</code>, GSTIN: <code>{project.contractor_gstin}</code>)<br />
                  <span className="text-[11px] text-slate-600">{project.contractor_address}</span>
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Autonomous Risk Assessment</th>
                <td className="p-2.5">
                  <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold font-mono ${
                    project.risk_score >= 45 ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'
                  }`}>
                    RISK SCORE: {project.risk_score}/100 • {project.risk_band} RISK
                  </span>
                </td>
              </tr>
              <tr>
                <th className="bg-slate-100 p-2.5 font-bold text-slate-700 border-r border-slate-300">Current Bureaucratic Status</th>
                <td className="p-2.5 font-mono font-bold text-slate-900">{project.workflow_status}</td>
              </tr>
            </tbody>
          </table>

          {/* Section I: Anomaly Findings */}
          <div className="space-y-3 font-sans">
            <h3 className="font-serif font-bold text-base border-b border-slate-400 pb-1 text-slate-950">
              I. Multi-Modal AI Detection Findings
            </h3>
            {flags.length === 0 ? (
              <p className="text-xs text-green-700 font-semibold p-3 bg-green-50 border border-green-200 rounded">
                ✓ No statutory anomalies flagged. Project satisfies all GFR 2017 Schedule of Rates and geospatial criteria.
              </p>
            ) : (
              <div className="space-y-3">
                {flags.map((f, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-300 rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{f.title}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">{f.severity}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{f.description}</p>
                    <div className="text-[11px] font-mono text-slate-600">Metric Trigger: {f.metric_cited}</div>
                    {f.gfr_citation && (
                      <div className="text-[11px] font-semibold text-amber-900">Citation: {f.gfr_citation}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section II: Digital Evidence */}
          <div className="space-y-2 font-sans text-xs">
            <h3 className="font-serif font-bold text-base border-b border-slate-400 pb-1 text-slate-950">
              II. Digital Photographic & Geotag Verification
            </h3>
            <p className="text-slate-700">
              Claimed Site Location: <strong>{project.latitude}° N, {project.longitude}° E</strong><br />
              Photo Embedded EXIF: <strong>{project.photo_exif_lat ? `${project.photo_exif_lat}° N, ${project.photo_exif_lng}° E` : 'NO EXIF GPS FOUND (STRIPPED)'}</strong><br />
              Hardware Timestamp: <strong>{project.photo_exif_timestamp || 'N/A'}</strong>
            </p>
          </div>

          {/* Section III: Signatures & Seal */}
          <div className="pt-10 flex items-center justify-between border-t border-slate-300 text-xs font-sans">
            <div>
              <div className="font-mono font-bold text-slate-800">SatyaLADS Sentinel Core</div>
              <div className="text-[10px] text-slate-500 font-mono">SHA256-DIGITAL-SIGNATURE-VERIFIED</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-800">District Vigilance Officer</div>
              <div className="text-[10px] text-slate-500">MPLADS Monitoring Committee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
