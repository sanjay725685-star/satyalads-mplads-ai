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
        throw new Error('Camera API not available in this browser environment.');
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
      console.warn('Camera access issue:', err);
      setCameraError('Camera access not permitted or device unavailable. Please click Sample Photo to test verification.');
      setIsCameraOpen(false);
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

  const loadSamplePhoto = () => {
    setCapturedPhoto('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80');
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
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
      {/* Official Section Header Card */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-t-4 border-[#003366] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#138808]/15 text-[#0F6806] border border-[#138808]/30 uppercase tracking-wider font-mono">
              Crowdsourced Zero-Knowledge Loop • CPGRAMS & WhatsApp Gateway
            </span>
            <span className="text-xs text-slate-500 font-mono">Bhashini Multilingual NLP + Computer Vision AI</span>
          </div>
          <h1 className="text-xl font-bold text-[#002244] font-serif flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#003366]" />
            <span>Citizen Ground-Truth & WhatsApp Grievance Sentinel</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Empowers local constituents to submit geotagged photos and voice notes in regional Indian languages with automated AI quality tagging.
          </p>
        </div>

        <div className="bg-[#F8FAFC] border border-emerald-300 p-4 rounded-lg flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">Anti-Spoofing Guard</span>
            <span className="text-sm font-bold text-emerald-800 font-mono">
              GPS Boundary Lock Active
            </span>
            <span className="text-[10px] text-slate-500 block">Within 50m of registered work site</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Mobile Simulation Form & Citizen Grievance Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Simulated Mobile Citizen Grievance Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-t-2 border-[#003366] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-bold text-sm text-[#002244] flex items-center gap-2 font-serif">
              <MessageSquare className="w-4 h-4 text-[#003366]" />
              <span>Simulate Citizen WhatsApp Grievance</span>
            </h2>
            <span className="text-[10px] bg-[#003366]/10 text-[#003366] px-2 py-0.5 rounded font-mono font-bold">
              AI Verification
            </span>
          </div>

          <form onSubmit={handleSubmitNewReport} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-mono font-bold mb-1">Target MPLADS Work Code:</label>
              <select
                value={newWorkCode}
                onChange={(e) => setNewWorkCode(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded p-2 text-slate-900 text-xs outline-none focus:border-[#003366] font-mono"
              >
                <option value="MPLADS/2024-25/UP-VAR-0104">MPLADS/2024-25/UP-VAR-0104 (Rohania CC Road)</option>
                <option value="MPLADS/2024-25/UP-VAR-0108">MPLADS/2024-25/UP-VAR-0108 (Kashi Solar Tube Well)</option>
              </select>
            </div>

            {/* Geotag Photo Live Camera / Upload Section */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-mono font-bold">Live Camera Capture (Auto-Geotagged):</label>
                {capturedPhoto && (
                  <span className="text-[10px] text-emerald-700 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Hardware Verified
                  </span>
                )}
              </div>

              {/* 1. Live Camera Stream Mode */}
              {isCameraOpen && (
                <div className="relative h-60 bg-black rounded-lg overflow-hidden border-2 border-[#003366] shadow-md">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder crosshair overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Crosshair className="w-12 h-12 text-white/70 animate-pulse" />
                  </div>
                  {/* Top GPS HUD */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/20 text-[10px] font-mono text-emerald-300">
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
                      className="px-4 py-2 bg-[#138808] hover:bg-[#0F6806] text-white font-bold rounded flex items-center gap-2 shadow-md text-xs transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center gap-1 text-xs border border-slate-600 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Photo Already Captured Mode */}
              {!isCameraOpen && capturedPhoto && (
                <div className="relative h-48 bg-slate-900 rounded-lg overflow-hidden border-2 border-[#138808] group shadow-sm">
                  <img 
                    src={capturedPhoto} 
                    alt="Captured site" 
                    className="w-full h-full object-cover"
                  />
                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>GEOTAG VERIFIED (18m deviation)</span>
                  </div>
                  {/* Retake Button */}
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white text-[10px] font-mono px-2 py-1 rounded border border-white/20 flex items-center gap-1 shadow transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-[#FF9933]" />
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

              {/* 3. Empty State (Choose Camera or Sample Photo) */}
              {!isCameraOpen && !capturedPhoto && (
                <div className="space-y-2">
                  <div 
                    onClick={startCamera}
                    className="relative h-28 bg-[#F8FAFC] rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center group cursor-pointer hover:border-[#003366] hover:bg-blue-50/20 transition-all"
                  >
                    <div className="p-2.5 rounded-full bg-[#003366]/10 group-hover:bg-[#003366]/20 text-[#003366] mb-1 transition-all">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-slate-900 font-bold group-hover:text-[#003366] transition-colors">
                      Tap to Open Live Camera
                    </span>
                    <span className="text-[9px] text-[#0F6806] font-mono font-bold mt-0.5">
                      GPS: 25.2651° N, 82.9122° E (18m Deviation - Verified)
                    </span>
                  </div>

                  {/* Direct Action Buttons: Live Camera / Sample Photo */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="py-2 px-3 rounded bg-[#003366] hover:bg-[#002244] text-white flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm"
                    >
                      <Camera className="w-4 h-4 text-[#FF9933]" />
                      <span>Live Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={loadSamplePhoto}
                      className="py-2 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center gap-1.5 text-xs font-medium transition-all cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#B85D00]" />
                      <span>Sample Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <p className="text-[10px] text-amber-800 font-mono mt-1">
                  ⚠️ {cameraError}
                </p>
              )}
            </div>

            {/* Voice / Text Grievance */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-700 font-mono font-bold">Voice Note / Vernacular Text:</label>
                <span className="text-[10px] text-purple-700 flex items-center gap-1 font-mono font-bold">
                  <Mic className="w-3 h-3 text-purple-600" /> Bhashini AI ASR
                </span>
              </div>
              <textarea
                rows={3}
                value={newTranscript}
                onChange={(e) => setNewTranscript(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-300 rounded p-2.5 text-slate-900 text-xs outline-none focus:border-[#003366]"
                placeholder="Speak or type grievance in any Indian language..."
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-slate-700 font-mono font-bold mb-1">Citizen Ground Quality Rating:</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewRating(star as any)}
                    className={`p-1.5 rounded border transition-all ${
                      newRating >= star 
                        ? 'bg-amber-100 text-amber-600 border-amber-400' 
                        : 'bg-[#F8FAFC] text-slate-400 border-slate-300'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
                <span className="text-slate-600 text-xs ml-2 font-mono">({newRating}/5 Stars)</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                isSubmitting 
                  ? 'bg-slate-400 text-white cursor-not-allowed animate-pulse'
                  : 'bg-[#003366] hover:bg-[#002244] text-white'
              }`}
            >
              <Send className="w-4 h-4 text-[#FF9933]" />
              <span>{isSubmitting ? 'AI Inspecting Photo & Audio...' : 'Submit Official Grievance'}</span>
            </button>

            {submittedSuccess && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-2.5 rounded text-center font-bold">
                ✓ Grievance Logged & Dispatched to District Magistrate!
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Verified Grievance Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-t-2 border-[#003366] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-bold text-sm text-[#002244] flex items-center gap-2 font-serif">
                <span>Citizen Verified Ground-Truth Feed</span>
              </h2>
              <p className="text-xs text-slate-500">
                Audited submissions with AI Computer Vision defect tags
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-3 py-1 rounded border border-blue-200">
              {reports.length} Verified Reports
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-[#F8FAFC] border border-slate-200 rounded p-4 space-y-3 hover:border-slate-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#003366]">{rep.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-xs text-slate-700 font-semibold">{rep.citizenName} ({rep.phoneMasked})</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mt-0.5">{rep.workTitle}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 w-fit font-mono">
                    {rep.status}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <img 
                    src={rep.photoUrl} 
                    alt="Citizen Upload" 
                    className="w-20 h-20 rounded object-cover border border-slate-300 flex-shrink-0 shadow-xs"
                  />
                  <div className="space-y-2 text-xs flex-1">
                    <p className="text-slate-800 italic bg-white p-2.5 rounded border border-slate-200">
                      "{rep.voiceNoteTranscript}"
                    </p>
                    
                    {/* AI Defect Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {rep.aiDefectTags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-50 text-red-700 border border-red-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 pt-2 font-mono">
                  <span>GPS Distance: <strong className="text-emerald-700">{rep.distanceFromAssetMeters}m from asset</strong></span>
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
