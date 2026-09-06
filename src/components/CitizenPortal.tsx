import React, { useState, useRef, useEffect } from 'react';
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
  Info,
  Upload,
  RotateCcw,
  X,
  Crosshair,
  Image as ImageIcon
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

  // Live Camera and Upload States
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera tracks on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser. Opening file upload...');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });

      streamRef.current = mediaStream;
      setIsCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => console.error('Video play error:', err));
        }
      }, 150);
    } catch (err: any) {
      console.warn('Camera access issue, opening file selector fallback:', err);
      setCameraError('Camera access not permitted or device unavailable. Please pick a file or sample.');
      setIsCameraOpen(false);
      // Trigger file selector as seamless fallback
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCapturedPhoto(reader.result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSamplePhoto = () => {
    setCapturedPhoto('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80');
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const photoToUse = capturedPhoto || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80';

      const newEntry: CitizenReport = {
        id: `CR-00${reports.length + 1}`,
        workId: 'W001',
        workTitle: 'Construction of CC Road from Rohania Canal to PHC',
        citizenName: 'Verified Ground Witness',
        phoneMasked: '+91 94150 XXXXX',
        submissionDate: 'Just Now',
        lat: 25.2651,
        lng: 82.9122,
        distanceFromAssetMeters: 18,
        photoUrl: photoToUse,
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
      setTimeout(() => setSubmittedSuccess(false), 4000);
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

            {/* Hidden File Input for Device Camera/Gallery */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Geotag Photo Live Camera / Upload Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-mono">Live Camera Capture (Auto-Geotagged):</label>
                {capturedPhoto && (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hardware Verified
                  </span>
                )}
              </div>

              {/* 1. Live Camera Stream Mode */}
              {isCameraOpen && (
                <div className="relative h-60 bg-black rounded-xl overflow-hidden border-2 border-emerald-500 shadow-xl">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder crosshair overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-12 h-12 text-emerald-400/60 animate-pulse" />
                  </div>
                  {/* Top GPS HUD */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between bg-[#020C1B]/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      LIVE GPS LOCK: 25.2651° N, 82.9122° E
                    </span>
                    <span>DEV: 18m</span>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={captureSnapshot}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-500/30 text-xs transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1 text-xs border border-slate-600 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Photo Already Captured Mode */}
              {!isCameraOpen && capturedPhoto && (
                <div className="relative h-48 bg-[#020C1B] rounded-xl overflow-hidden border-2 border-emerald-500/70 group shadow-lg">
                  <img 
                    src={capturedPhoto} 
                    alt="Captured site" 
                    className="w-full h-full object-cover"
                  />
                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>GEOTAG VERIFIED (18m deviation)</span>
                  </div>
                  {/* Retake Button */}
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="absolute top-2 right-2 bg-slate-900/90 hover:bg-slate-800 text-white text-[10px] font-mono px-2 py-1 rounded border border-slate-600 flex items-center gap-1 shadow transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-sky-400" />
                    <span>Retake</span>
                  </button>
                  {/* Bottom Geotag Overlay HUD */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-2 text-[9px] font-mono text-emerald-300">
                    <div className="flex justify-between items-center">
                      <span>LAT: 25.2651° N, LNG: 82.9122° E</span>
                      <span className="text-slate-300">ACCURACY: ±3.2m</span>
                    </div>
                    <div className="text-[8px] text-slate-400">
                      SECURE HARDWARE TIMESTAMP: {new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN')}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Empty State (Choose Camera or File Upload) */}
              {!isCameraOpen && !capturedPhoto && (
                <div className="space-y-2">
                  <div 
                    onClick={startCamera}
                    className="relative h-28 bg-[#020C1B] rounded-xl border border-dashed border-[#1E3A5F] flex flex-col items-center justify-center p-3 text-center group cursor-pointer hover:border-emerald-400 hover:bg-emerald-950/10 transition-all"
                  >
                    <div className="p-2.5 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 mb-1 transition-all">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-white font-bold group-hover:text-emerald-300 transition-colors">
                      Tap to Open Live Camera
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono mt-0.5">
                      GPS: 25.2651° N, 82.9122° E (18m Deviation - Verified)
                    </span>
                  </div>

                  {/* Direct Action Buttons: Camera / Upload / Sample */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="py-1.5 px-2 rounded-lg bg-[#020C1B] hover:bg-[#1E3A5F]/50 border border-[#1E3A5F] text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[10px] font-medium transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-1.5 px-2 rounded-lg bg-[#020C1B] hover:bg-[#1E3A5F]/50 border border-[#1E3A5F] text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[10px] font-medium transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={loadSamplePhoto}
                      className="py-1.5 px-2 rounded-lg bg-[#020C1B] hover:bg-[#1E3A5F]/50 border border-[#1E3A5F] text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-[10px] font-medium transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sample Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <p className="text-[10px] text-amber-400 font-mono mt-1">
                  ⚠️ {cameraError}
                </p>
              )}
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
