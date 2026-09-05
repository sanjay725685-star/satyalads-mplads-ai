import React, { useState } from 'react';
import { 
  Satellite, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Camera, 
  ShieldAlert, 
  Search, 
  Sparkles,
  Info,
  Calendar,
  Compass,
  FileCheck2
} from 'lucide-react';
import { WorkItem, SatelliteScan } from '../types';
import { SATELLITE_SCANS } from '../data/mockData';

interface SatelliteInspectorProps {
  works: WorkItem[];
  selectedWork: WorkItem;
  onSelectWork: (work: WorkItem) => void;
}

export const SatelliteInspector: React.FC<SatelliteInspectorProps> = ({
  works,
  selectedWork,
  onSelectWork
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [spectralMode, setSpectralMode] = useState<'OPTICAL' | 'SAR_RADAR' | 'NDBI_HEATMAP'>('OPTICAL');
  const [activeScanId, setActiveScanId] = useState<string>(
    selectedWork.satelliteScanId || 'SAT-001'
  );

  const currentScan: SatelliteScan = SATELLITE_SCANS[activeScanId] || SATELLITE_SCANS['SAT-001'];
  const matchedWork = works.find(w => w.id === currentScan.workId) || selectedWork;

  const isGhost = currentScan.verificationVerdict === 'GHOST_WORK_SUSPECTED';
  const isVerified = currentScan.verificationVerdict === 'VERIFIED_PHYSICAL_CHANGE';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
              Space-to-Ground Dual-Verification Sentinel
            </span>
            <span className="text-xs text-slate-400 font-mono">ESA Sentinel-1/2 SAR & Optical Pipeline</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Satellite className="w-5 h-5 text-sky-400" />
            <span>Time-Series Satellite Physical Change & Photo Forensics</span>
          </h1>
        </div>

        {/* Project Selector for Satellite Analysis */}
        <div className="flex items-center space-x-2 bg-[#020C1B] px-3 py-2 rounded-xl border border-[#1E3A5F] text-xs">
          <span className="text-slate-400 font-mono">Select Target:</span>
          <select
            value={activeScanId}
            onChange={(e) => {
              setActiveScanId(e.target.value);
              const target = works.find(w => w.satelliteScanId === e.target.value);
              if (target) onSelectWork(target);
            }}
            className="bg-transparent text-white font-semibold outline-none cursor-pointer"
          >
            <option value="SAT-001" className="bg-[#0A192F]">Rohania CC Road (Flagged Ghost Work)</option>
            <option value="SAT-002" className="bg-[#0A192F]">Kashi Tube Well (Relabeled Asset)</option>
            <option value="SAT-003" className="bg-[#0A192F]">Shivpur Community Hall (Verified Physical)</option>
          </select>
        </div>
      </div>

      {/* Target Work Banner */}
      <div className="bg-[#0A192F] border border-[#1E3A5F] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-mono text-sky-400 font-bold">{matchedWork.code}</span>
          <h2 className="text-sm font-bold text-white mt-0.5">{matchedWork.title}</h2>
          <div className="flex items-center gap-3 text-slate-400 mt-1">
            <span>Location: <strong className="text-slate-200">{matchedWork.locationName}</strong></span>
            <span>•</span>
            <span>Agency: <strong className="text-slate-200">{matchedWork.implementingAgency}</strong></span>
            <span>•</span>
            <span>Budget: <strong className="text-amber-400 font-mono">₹{matchedWork.sanctionedAmountLakhs} L</strong></span>
          </div>
        </div>

        {/* Verdict Badge */}
        <div>
          {isGhost ? (
            <div className="bg-rose-500/20 border border-rose-500/50 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-rose-300 block font-mono">AI Verdict</span>
              <span className="text-sm font-extrabold text-rose-400 flex items-center gap-1.5 justify-center">
                <AlertTriangle className="w-4 h-4" /> GHOST WORK SUSPECTED
              </span>
            </div>
          ) : isVerified ? (
            <div className="bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block font-mono">AI Verdict</span>
              <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="w-4 h-4" /> VERIFIED PHYSICAL ASSET
              </span>
            </div>
          ) : (
            <div className="bg-amber-500/20 border border-amber-500/50 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-amber-300 block font-mono">AI Verdict</span>
              <span className="text-sm font-extrabold text-amber-400 flex items-center gap-1.5 justify-center">
                <AlertTriangle className="w-4 h-4" /> SURFACE MISMATCH
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Analysis Grid: Satellite Split Slider & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Satellite Split-Slider (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-sky-400" />
              <span>Multi-Temporal Satellite Change Detection</span>
            </h3>

            {/* Spectral Filter Toggle */}
            <div className="flex items-center bg-[#020C1B] p-1 rounded-lg border border-[#1E3A5F] text-xs">
              {[
                { id: 'OPTICAL', label: 'Optical RGB' },
                { id: 'SAR_RADAR', label: 'SAR Radar (dB)' },
                { id: 'NDBI_HEATMAP', label: 'NDBI Concrete Index' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSpectralMode(mode.id as any)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    spectralMode === mode.id
                      ? 'bg-sky-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Split Slider Container */}
          <div className="relative h-80 rounded-xl overflow-hidden border border-[#1E3A5F] select-none group">
            {/* Sanction Date Image (Background / Left) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${currentScan.sanctionDateImage})`,
                filter: spectralMode === 'SAR_RADAR' ? 'contrast(200%) grayscale(100%)' : spectralMode === 'NDBI_HEATMAP' ? 'hue-rotate(90deg)' : 'none'
              }}
            >
              <div className="absolute top-3 left-3 bg-[#0A192F]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#1E3A5F] text-xs font-mono text-amber-300">
                T0: Sanction Date (Pre-Work)
              </div>
            </div>

            {/* Claimed Completion Date Image (Foreground / Right - Clipped) */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${currentScan.completionDateImage})`,
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
                filter: spectralMode === 'SAR_RADAR' ? 'contrast(200%) grayscale(100%)' : spectralMode === 'NDBI_HEATMAP' ? 'hue-rotate(270deg)' : 'none'
              }}
            >
              <div className="absolute top-3 right-3 bg-[#0A192F]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#1E3A5F] text-xs font-mono text-sky-300">
                T1: Claimed Completion Date
              </div>
            </div>

            {/* Vertical Divider Bar */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-xl text-xs font-bold font-mono">
                ↔
              </div>
            </div>

            {/* Slider Range Input Overlay */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
            />
          </div>

          {/* Slider Instruction */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>◄ Drag slider horizontally to compare terrain before vs after claim ►</span>
            <span className="font-mono text-sky-300">Position: {sliderPosition}%</span>
          </div>

          {/* Key Spectral Metric Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-[#020C1B] p-3 rounded-xl border border-[#1E3A5F] text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Detected Physical Change</span>
              <span className={`text-lg font-bold font-mono ${isGhost ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentScan.detectedGroundChangePercent}%
              </span>
              <span className="text-[10px] text-slate-500 block">Claimed: {currentScan.claimedProgressPercent}%</span>
            </div>

            <div className="bg-[#020C1B] p-3 rounded-xl border border-[#1E3A5F] text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">SAR Radar Delta (dB)</span>
              <span className={`text-lg font-bold font-mono ${isGhost ? 'text-rose-400' : 'text-sky-400'}`}>
                +{currentScan.sarBackscatterChangeDb} dB
              </span>
              <span className="text-[10px] text-slate-500 block">Baseline: 0.05 dB</span>
            </div>

            <div className="bg-[#020C1B] p-3 rounded-xl border border-[#1E3A5F] text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">NDBI Concrete Index</span>
              <span className={`text-lg font-bold font-mono ${isGhost ? 'text-rose-400' : 'text-emerald-400'}`}>
                +{currentScan.ndbiChangePercent}%
              </span>
              <span className="text-[10px] text-slate-500 block">Threshold: &gt;25%</span>
            </div>
          </div>
        </div>

        {/* Right: Ground Photo Forensics & EXIF Tamper Detector (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Ground Photo Forensic Inspector</span>
              </h3>
              <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                pHash + ELA
              </span>
            </div>

            {/* Uploaded Ground Photo */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-[#1E3A5F] mb-4">
              <img 
                src={currentScan.groundPhotoUrl} 
                alt="Claimed Completion Ground Photo"
                className="w-full h-full object-cover"
              />
              {currentScan.groundPhotoExif.isSpoofed && (
                <div className="absolute top-2 right-2 bg-rose-600/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-md shadow-lg border border-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> FORGED EXIF METADATA
                </div>
              )}
            </div>

            {/* EXIF Forensic Breakdown */}
            <div className="space-y-2 text-xs bg-[#020C1B] p-3.5 rounded-xl border border-[#1E3A5F]">
              <div className="flex justify-between">
                <span className="text-slate-400">Captured Device:</span>
                <span className="text-slate-200 font-mono">{currentScan.groundPhotoExif.cameraModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">EXIF Timestamp:</span>
                <span className="text-slate-200 font-mono">{currentScan.groundPhotoExif.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GPS Deviation:</span>
                <span className={`font-mono font-bold ${
                  currentScan.groundPhotoExif.gpsDeviationMeters > 500 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {currentScan.groundPhotoExif.gpsDeviationMeters > 1000 
                    ? `${(currentScan.groundPhotoExif.gpsDeviationMeters / 1000).toFixed(1)} km (SPOOFED)` 
                    : `${currentScan.groundPhotoExif.gpsDeviationMeters} meters`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Error Level Analysis (ELA):</span>
                <span className={`font-mono font-bold ${
                  currentScan.groundPhotoExif.errorLevelAnalysisScore > 50 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {currentScan.groundPhotoExif.errorLevelAnalysisScore}/100 {currentScan.groundPhotoExif.errorLevelAnalysisScore > 50 ? '(Tampered)' : '(Authentic)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Perceptual Hash (pHash):</span>
                <span className={`font-mono font-bold ${
                  currentScan.groundPhotoExif.perceptualHashMatchFound ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {currentScan.groundPhotoExif.perceptualHashMatchFound ? 'Duplicate Found In DB' : 'Unique Image'}
                </span>
              </div>
            </div>

            {/* Hash Match Warning if any */}
            {currentScan.groundPhotoExif.duplicateMatchedWorkCode && (
              <div className="mt-3 bg-rose-500/15 border border-rose-500/30 p-2.5 rounded-lg text-xs space-y-1">
                <span className="font-bold text-rose-300 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Recycled Photo Fraud Detected:
                </span>
                <p className="text-[11px] text-slate-300">
                  This photo is an exact 99.4% perceptual hash match of completed project{' '}
                  <span className="font-mono text-amber-300">{currentScan.groundPhotoExif.duplicateMatchedWorkCode}</span>.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-[#1E3A5F]/70">
            Powered by Automated Multi-Spectral Change Detection & Convolutional Neural Network (CNN) Forensics.
          </div>
        </div>
      </div>
    </div>
  );
};
