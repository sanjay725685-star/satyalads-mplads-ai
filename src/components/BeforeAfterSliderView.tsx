import React, { useState } from 'react';
import { Sliders, Layers, Eye, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface BeforeAfterSliderViewProps {
  lang: Language;
}

export const BeforeAfterSliderView: React.FC<BeforeAfterSliderViewProps> = ({ lang }) => {
  const isHi = lang !== 'en';
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [spectralMode, setSpectralMode] = useState<'OPTICAL' | 'SAR_RADAR' | 'NDBI_HEATMAP'>('OPTICAL');

  const beforeImg = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80";
  const afterImg = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&auto=format&fit=crop&q=80";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Official Section Header Card */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm border-t-4 border-[#003366] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#FF9933]/15 text-[#B85D00] border border-[#FF9933]/30 uppercase font-mono tracking-wider">
              Temporal Earth Observation • Remote Sensing
            </span>
            <span className="text-xs text-slate-500 font-mono">ISRO Bhuvan / Copernicus Sentinel Sentinel-1 SAR & Sentinel-2 Optical</span>
          </div>
          <h1 className="text-xl font-bold text-[#002244] font-serif">
            {isHi ? "भौतिक साइट फोटो एवं उपग्रह समय-श्रृंखला तुलना" : "Before / After Physical Site Photo & Satellite Spectral Comparison"}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {isHi 
              ? "कार्य प्रारंभ से पूर्व की प्रारंभिक स्थिति और वर्तमान पूर्णता स्थिति की आधिकारिक स्प्लिट स्लाइडर तुलना।"
              : "Compare baseline pre-construction ground truth against completion filing using interactive split slider verification."}
          </p>
        </div>

        {/* Spectral Filter Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-300 text-xs font-mono">
          {[
            { id: 'OPTICAL', label: 'Optical RGB' },
            { id: 'SAR_RADAR', label: 'SAR Radar (dB)' },
            { id: 'NDBI_HEATMAP', label: 'NDBI Concrete Index' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setSpectralMode(m.id as any)}
              className={`px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                spectralMode === m.id
                  ? 'bg-[#003366] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Slider Canvas Card */}
      <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm space-y-4 border-t-2 border-slate-200">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 border-b border-slate-200 pb-3">
          <span className="flex items-center gap-1.5 font-bold text-[#003366]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#003366]" />
            <span>BASELINE SANCTION DATE (01-Apr-2024)</span>
          </span>
          <span className="text-[#B85D00] font-bold bg-[#FF9933]/15 px-3 py-0.5 rounded border border-[#FF9933]/30">
            SPLIT POSITION: {sliderPos}%
          </span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-800">
            <span>COMPLETION AUDIT DATE (15-Feb-2025)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </span>
        </div>

        {/* Interactive Slider Container */}
        <div className="relative h-96 sm:h-[480px] w-full rounded-lg overflow-hidden select-none border border-slate-300 shadow-inner">
          {/* Background: After Image (Full width) */}
          <img
            src={afterImg}
            alt="After / Completed Site"
            className={`w-full h-full object-cover ${spectralMode === 'SAR_RADAR' ? 'filter hue-rotate-180 contrast-150' : spectralMode === 'NDBI_HEATMAP' ? 'filter sepia contrast-125' : ''}`}
          />
          <div className="absolute top-4 right-4 bg-[#002244]/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/20 text-white text-xs font-mono font-bold shadow-md">
            POST-CONSTRUCTION CLAIMED
          </div>

          {/* Foreground: Before Image (Clipped by slider position) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={beforeImg}
              alt="Before / Baseline Site"
              className="w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/20 text-white text-xs font-mono font-bold shadow-md">
              PRE-CONSTRUCTION BASELINE
            </div>
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#FF9933] shadow-[0_0_8px_rgba(255,153,51,0.8)] cursor-ew-resize flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-[#FF9933] text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
              ⟷
            </div>
          </div>

          {/* Invisible Range Input for Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={e => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
        </div>

        {/* Change Detection Analytics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="bg-[#F8FAFC] border border-slate-200 p-3.5 rounded">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">SAR Radar Backscatter Delta</span>
            <span className="text-emerald-700 font-bold text-sm">+4.82 dB (Definite Concrete Infill)</span>
          </div>
          <div className="bg-[#F8FAFC] border border-slate-200 p-3.5 rounded">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">NDBI Built-Up Index Shift</span>
            <span className="text-[#003366] font-bold text-sm">0.12 ➔ 0.68 (Structural Expansion)</span>
          </div>
          <div className="bg-[#F8FAFC] border border-slate-200 p-3.5 rounded">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Physical Ground Match Status</span>
            <span className="text-[#B85D00] font-bold text-sm">Verified Against e-SAKSHI Filing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
