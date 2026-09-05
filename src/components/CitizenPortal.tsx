import React, { useState } from 'react';
import { 
  MessageSquare, 
  Camera, 
  MapPin, 
  Mic, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  Star,
  Smartphone,
  Info
} from 'lucide-react';
import { CITIZEN_REPORTS } from '../data/mockData';
import { CitizenReport } from '../types';

export const CitizenPortal: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>(CITIZEN_REPORTS);
  const [selectedReport, setSelectedReport] = useState<CitizenReport>(CITIZEN_REPORTS[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // New report simulation state
  const [newWorkCode, setNewWorkCode] = useState('MPLADS/2024-25/UP-VAR-0104');
  const [newTranscript, setNewTranscript] = useState('रोहनिया में जो सीसी रोड का दावा किया गया है वह जमीन पर कहीं नहीं है। केवल पत्थर गिरे हैं।');
  const [newRating, setNewRating] = useState<1 | 2 | 3 | 4 | 5>(1);

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newEntry: CitizenReport = {
        id: `CR-00${reports.length + 1}`,
        workId: 'W001',
        workTitle: 'Construction of CC Road from Rohania Canal to PHC',
        citizenName: 'Anonymous Whistleblower',
        phoneMasked: '+91 94150 XXXXX',
        submissionDate: 'Just Now',
        lat: 25.2651,
        lng: 82.9122,
        distanceFromAssetMeters: 18,
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
        voiceNoteTranscript: newTranscript,
        language: 'Hindi',
        aiDefectTags: ['No Concrete Pavement Found', 'Unpaved Mud Track', 'Ground Reality Mismatch'],
        citizenRating: newRating,
        status: 'PENDING_REVIEW'
      };

      setReports([newEntry, ...reports]);
      setSelectedReport(newEntry);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Crowdsourced Zero-Knowledge Loop
            </span>
            <span className="text-xs text-slate-400 font-mono">Bhashini Multilingual NLP + Vision AI</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <span>Citizen Ground-Truth & WhatsApp Grievance Sentinel</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Empowers local constituents to submit geotagged photos and voice notes in regional vernacular languages with automated AI quality tagging.
          </p>
        </div>

        <div className="bg-[#020C1B] border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Anti-Spoofing</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              GPS Boundary Guard Active
            </span>
            <span className="text-[10px] text-slate-400 block">Within 50m of registered work</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Mobile Simulation Form & Citizen Grievance Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Mobile Citizen Grievance Form (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <h2 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Simulate Citizen WhatsApp Grievance</span>
            </h2>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
              AI Powered
            </span>
          </div>

          <form onSubmit={handleSubmitNewReport} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Target MPLADS Work Code:</label>
              <select
                value={newWorkCode}
                onChange={(e) => setNewWorkCode(e.target.value)}
                className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-lg p-2 text-white text-xs outline-none focus:border-sky-500 font-mono"
              >
                <option value="MPLADS/2024-25/UP-VAR-0104">MPLADS/2024-25/UP-VAR-0104 (Rohania CC Road)</option>
                <option value="MPLADS/2024-25/UP-VAR-0108">MPLADS/2024-25/UP-VAR-0108 (Kashi Solar Tube Well)</option>
              </select>
            </div>

            {/* Geotag Photo Simulation */}
            <div>
              <label className="block text-slate-400 font-mono mb-1">Live Camera Capture (Auto-Geotagged):</label>
              <div className="relative h-28 bg-[#020C1B] rounded-xl border border-dashed border-[#1E3A5F] flex flex-col items-center justify-center p-3 text-center group cursor-pointer hover:border-sky-500">
                <Camera className="w-6 h-6 text-sky-400 mb-1" />
                <span className="text-[11px] text-slate-300 font-medium">Capture Live Site Photo</span>
                <span className="text-[9px] text-emerald-400 font-mono mt-0.5">GPS: 25.2651° N, 82.9122° E (18m Deviation - Verified)</span>
              </div>
            </div>

            {/* Voice / Text Grievance */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-mono">Voice Note / Vernacular Text:</label>
                <span className="text-[10px] text-purple-300 flex items-center gap-1 font-mono">
                  <Mic className="w-3 h-3 text-purple-400" /> Bhashini AI ASR
                </span>
              </div>
              <textarea
                rows={3}
                value={newTranscript}
                onChange={(e) => setNewTranscript(e.target.value)}
                className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-lg p-2.5 text-white text-xs outline-none focus:border-sky-500"
                placeholder="Speak or type grievance in any Indian language..."
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-slate-400 font-mono mb-1">Citizen Ground Quality Rating:</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star as any)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      newRating >= star 
                        ? 'bg-amber-400/20 text-amber-400 border-amber-400/40' 
                        : 'bg-[#020C1B] text-slate-600 border-[#1E3A5F]'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
                <span className="text-slate-400 text-xs ml-2 font-mono">({newRating}/5 Stars)</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isSubmitting 
                  ? 'bg-emerald-700/50 text-emerald-200 cursor-not-allowed animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'AI Inspecting Photo & Audio...' : 'Submit Verified Grievance'}</span>
            </button>

            {submittedSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 p-2.5 rounded-lg text-center font-bold">
                ✓ Grievance Logged & Dispatched to District Magistrate!
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Verified Grievance Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E3A5F] pb-3">
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Citizen Verified Ground-Truth Feed</span>
              </h2>
              <p className="text-xs text-slate-400">
                Audited submissions with AI Computer Vision defect tags
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-[#020C1B] px-3 py-1 rounded-lg border border-[#1E3A5F]">
              {reports.length} Verified Reports
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-[#020C1B] border border-[#1E3A5F] rounded-xl p-4 space-y-3 hover:border-slate-600 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400">{rep.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-xs text-slate-300 font-semibold">{rep.citizenName} ({rep.phoneMasked})</span>
                    </div>
                    <h4 className="font-bold text-white text-xs mt-0.5">{rep.workTitle}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 w-fit">
                    {rep.status}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <img 
                    src={rep.photoUrl} 
                    alt="Citizen Upload" 
                    className="w-20 h-20 rounded-lg object-cover border border-[#1E3A5F] flex-shrink-0"
                  />
                  <div className="space-y-2 text-xs flex-1">
                    <p className="text-slate-300 italic bg-[#0A192F] p-2.5 rounded-lg border border-[#1E3A5F]/70">
                      "{rep.voiceNoteTranscript}"
                    </p>
                    
                    {/* AI Defect Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {rep.aiDefectTags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-[#1E3A5F]/60 pt-2 font-mono">
                  <span>GPS Distance: <strong className="text-emerald-400">{rep.distanceFromAssetMeters}m from asset</strong></span>
                  <span>Submitted: {rep.submissionDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
