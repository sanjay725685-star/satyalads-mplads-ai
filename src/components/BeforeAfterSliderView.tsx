import React, { useState } from 'react';
import { Sliders, Layers, Eye, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface BeforeAfterSliderViewProps {
  lang: Language;
}

export const BeforeAfterSliderView: React.FC<BeforeAfterSliderViewProps> = ({ lang }) => {
  const isHi = lang === 'hi';
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [spectralMode, setSpectralMode] = useState<'OPTICAL' | 'SAR_RADAR' | 'NDBI_HEATMAP'>('OPTICAL');

  const beforeImg = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80";
  const afterImg = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&auto=format&fit=crop&q=80";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
              Temporal Verification
            </span>
            <span className="text-xs text-slate-400 font-mono">Sentinel-2 Optical & Sentinel-1 SAR</span>
          </div>
          <h1 className="text-xl font-extrabold text-white font-serif">
            {isHi ? "साइट फोटो एवं उपग्रह समय-श्रृंखला तुलना" : "Before / After Physical Site Photo & Satellite Comparison"}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            {isHi 
              ? "कार्य प्रारंभ से पूर्व की प्रारंभिक स्थिति और वर्तमान पूर्णता स्थिति की इंटरैक्टिव स्प्लिट स्लाइडर तुलना।"
              : "Compare baseline pre-construction ground truth against completion filing using interactive split slider."}
          </p>
        </div>

        {/* Spectral Filter Toggle */}
        <div className="flex items-center bg-[#020C1B] p-1.5 rounded-xl border border-[#1E3A5F] text-xs font-mono">
          {[
            { id: 'OPTICAL', label: 'Optical RGB' },
            { id: 'SAR_RADAR', label: 'SAR Radar (dB)' },
            { id: 'NDBI_HEATMAP', label: 'NDBI Concrete' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setSpectralMode(m.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                spectralMode === m.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Split Slider Canvas */}
      <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>BASELINE SANCTION DATE (01-Apr-2024)</span>
          </span>
          <span className="text-amber-400 font-bold">SLIDER: {sliderPos}%</span>
          <span className="flex items-center gap-1.5">
            <span>COMPLETION AUDIT DATE (15-Feb-2025)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </span>
        </div>

        {/* Interactive Slider Container */}
        <div className="relative h-96 sm:h-[480px] w-full rounded-xl overflow-hidden select-none border border-[#1E3A5F]">
          {/* Background: After Image (Full width) */}
          <img
            src={afterImg}
            alt="After / Completed Site"
            className={`w-full h-full object-cover ${spectralMode === 'SAR_RADAR' ? 'filter hue-rotate-180 contrast-150' : spectralMode === 'NDBI_HEATMAP' ? 'filter sepia contrast-125' : ''}`}
          />
          <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
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
            <div className="absolute top-4 left-4 bg-sky-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-sky-500/40 text-sky-300 text-xs font-mono font-bold">
              PRE-CONSTRUCTION BASELINE
            </div>
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] cursor-ew-resize flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg border-2 border-white">
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
          <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase block">SAR Radar Backscatter Delta</span>
            <span className="text-emerald-400 font-bold text-sm">+4.82 dB (Definite Concrete Infill)</span>
          </div>
          <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase block">NDBI Built-Up Index Shift</span>
            <span className="text-sky-400 font-bold text-sm">0.12 ➔ 0.68 (Structural Expansion)</span>
          </div>
          <div className="bg-[#020C1B] border border-[#1E3A5F] p-3 rounded-xl">
            <span className="text-slate-500 text-[10px] uppercase block">Physical Ground Match Status</span>
            <span className="text-amber-400 font-bold text-sm">Verified Against e-SAKSHI Filing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
