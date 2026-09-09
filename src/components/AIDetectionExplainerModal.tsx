import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  Sliders, 
  FileText, 
  Camera, 
  MapPin, 
  Hash, 
  Eye, 
  Activity,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { api } from '../services/api';
import { AIDetectionResult, AIDecisionLog } from '../types';

interface AIDetectionExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkCode?: string;
}

export const AIDetectionExplainerModal: React.FC<AIDetectionExplainerModalProps> = ({
  isOpen,
  onClose,
  initialWorkCode = 'MPLADS/2024-25/UP-VAR-0104'
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'playground' | 'logs'>('pipeline');

  // Playground state
  const [testSample, setTestSample] = useState<'mud_track' | 'relabeled_asset' | 'verified_road'>('mud_track');
  const [isRunningPlayground, setIsRunningPlayground] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [playgroundResult, setPlaygroundResult] = useState<AIDetectionResult | null>(null);

  // Historical logs state
  const [logs, setLogs] = useState<AIDecisionLog[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.getAIDetections().then(res => setLogs(res.detections));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Run live simulation on playground sample
  const handleRunPlayground = async () => {
    setIsRunningPlayground(true);
    setCurrentStep(1);
    setPlaygroundResult(null);

    const sampleWorkMap = {
      mud_track: 'MPLADS/2024-25/UP-VAR-0104',
      relabeled_asset: 'MPLADS/2024-25/UP-VAR-0108',
      verified_road: 'MPLADS/2024-25/UP-VAR-0101'
    };

    const targetCode = sampleWorkMap[testSample];

    // Animate stages step-by-step
    await new Promise(r => setTimeout(r, 400));
    setCurrentStep(2);
    await new Promise(r => setTimeout(r, 400));
    setCurrentStep(3);
    await new Promise(r => setTimeout(r, 400));
    setCurrentStep(4);
    await new Promise(r => setTimeout(r, 400));
    setCurrentStep(5);

    try {
      const res = await api.runAIDetection(targetCode);
      setPlaygroundResult(res.detection);
      // Refresh logs
      const updatedLogs = await api.getAIDetections();
      setLogs(updatedLogs.detections);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningPlayground(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border-t-4 border-[#003366] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#003366] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF9933]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-[#002244] font-serif">
                  How AI Detection Works &amp; Multi-Stage Vision Pipeline
                </h3>
                <span className="text-[10px] font-mono bg-blue-100 text-[#003366] px-2 py-0.5 rounded font-bold">
                  v2.4 Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Mathematical Formulations, Computer Vision Defect Taxonomy &amp; Auditable Decision Logger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-medium">
          {[
            { id: 'pipeline', label: '1. Architecture & 5-Stage Pipeline', icon: Layers },
            { id: 'playground', label: '2. Interactive Test Playground', icon: Play },
            { id: 'logs', label: '3. Auditable Decision Logs (ai_detections.json)', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 flex items-center gap-2 font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#003366] text-[#003366] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF9933]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-y-auto text-xs text-slate-700 space-y-6">
          {/* TAB 1: 5-STAGE PIPELINE EXPLANATION */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-4 leading-relaxed">
                <h4 className="font-bold text-sm text-[#002244] font-serif mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Autonomous Multi-Modal Audit Defense Strategy</span>
                </h4>
                <p className="text-slate-600 text-xs">
                  SATYALADS does not rely on simple if/else checks or unverified citizen reports. Every uploaded site photo passes through an interconnected <strong>5-Stage Verification Pipeline</strong> combining convolutional visual feature extraction, structural baseline diffing, spatial Haversine trigonometry, and perceptual image hashing.
                </p>
              </div>

              {/* 5 Stages Grid */}
              <div className="space-y-4">
                {/* Stage 1 */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs border-l-4 border-[#003366] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[#003366] text-xs uppercase">
                      Stage 1: Computer Vision Defect Classification
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-[#003366] font-bold border border-blue-200">
                      ResNet-50 / CNN + Defect Head
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Runs multi-scale texture and edge-frequency analysis across the image matrix to recognize physical surface defects.
                  </p>
                  <div className="bg-[#F8FAFC] p-2.5 rounded border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 font-mono block">Recognized Defect Classes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "No Concrete Pavement Found",
                        "Unpaved Mud Track",
                        "Ghost Work Indicator",
                        "Relabeled Asset",
                        "Broken Filter Dispenser",
                        "Double-Dipping Evidence",
                        "Structural Concrete Infill Verified"
                      ].map((cls, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-300">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs border-l-4 border-[#FF9933] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-[#B85D00] text-xs uppercase">
                      Stage 2: Before / After Structural Similarity Comparison (SSIM)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      Multi-Scale SSIM &gt; 0.50 Threshold
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Compares the official pre-construction baseline photo against the newly submitted completion claim. If structural difference index drops below 0.50, flags that the claimed physical asset was never laid on ground.
                  </p>
                  <div className="bg-[#F8FAFC] p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                    Formula: <code>SSIM(x,y) = [l(x,y)^α · c(x,y)^β · s(x,y)^γ]</code> where luminance &amp; structural contrast deviations indicate phantom progress.
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs border-l-4 border-[#138808] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-emerald-800 text-xs uppercase">
                      Stage 3: Geotag Verification with 20m Strict Perimeter
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      e-SAKSHI Para 4.2 Mandate
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Decodes EXIF hardware GPS coordinates from camera payload and evaluates Haversine great-circle distance against sanctioned GIS asset bounds.
                  </p>
                  <div className="bg-[#F8FAFC] p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                    Rule: Deviation ≤ 20.0 meters = <strong>COMPLIANT</strong>. Deviation &gt; 20m = <strong>WARNING</strong>. Deviation &gt; 50m = <strong>CRITICAL REJECTION</strong>.
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs border-l-4 border-purple-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-purple-900 text-xs uppercase">
                      Stage 4: Perceptual Hash (pHash) Double-Dipping Sentinel
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-800 font-bold border border-purple-200">
                      Hamming Distance ≤ 5 (Duplicate)
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Generates 64-bit Discrete Cosine Transform (DCT) perceptual image hash. Cross-matches hash against 320 other projects in the district repository to detect recycled photos claimed for multiple funds.
                  </p>
                </div>

                {/* Stage 5 */}
                <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs border-l-4 border-rose-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-rose-900 text-xs uppercase">
                      Stage 5: Synthesis, Confidence Scoring &amp; Human-Readable Justification
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-800 font-bold border border-rose-200">
                      Auditable Explanation String
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Aggregates confidence scores across all stages and automatically outputs a legally defensible justification string formatted for the District Magistrate's Show-Cause Notice.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE TEST PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="space-y-5">
              {/* Sample Selector */}
              <div>
                <label className="block font-bold text-slate-800 font-mono text-[11px] mb-2">
                  Select Field Photo Sample to Run Through AI Pipeline:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'mud_track', label: '1. Rohania CC Road (Mud Track Defect)', desc: 'Claimed CC Road is pure mud track; GPS 28m off.' },
                    { id: 'relabeled_asset', label: '2. Kashi Solar Tube Well (Recycled Asset)', desc: 'Old pump relabeled with MPLADS sticker; broken nozzle.' },
                    { id: 'verified_road', label: '3. Shivpur Community Hall (Verified Physical)', desc: 'Fresh concrete slab, compliant GPS location.' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setTestSample(s.id as any);
                        setPlaygroundResult(null);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                        testSample === s.id
                          ? 'bg-blue-50 border-[#003366] text-[#003366] shadow-xs'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center justify-between bg-[#F8FAFC] border border-slate-200 p-3 rounded-lg">
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Ready to Execute Pipeline on Target Sample</span>
                  <span className="text-slate-500 text-[11px]">Simulates model inference and registers decision log</span>
                </div>
                <button
                  onClick={handleRunPlayground}
                  disabled={isRunningPlayground}
                  className={`px-4 py-2 rounded font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    isRunningPlayground
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#003366] hover:bg-[#002244] text-white shadow-sm'
                  }`}
                >
                  <Play className="w-4 h-4 text-[#FF9933]" />
                  <span>{isRunningPlayground ? `Running Stage ${currentStep}/5...` : 'Run AI Defect Detection Pipeline'}</span>
                </button>
              </div>

              {/* Step Progress Tracker */}
              {isRunningPlayground && (
                <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-600">
                      {currentStep === 1 && 'Stage 1: ResNet-50 Defect Classification in progress...'}
                      {currentStep === 2 && 'Stage 2: Calculating Structural Similarity Index (SSIM)...'}
                      {currentStep === 3 && 'Stage 3: Testing Haversine GPS deviation against 20m bound...'}
                      {currentStep === 4 && 'Stage 4: Searching 320 projects for matching pHash fingerprints...'}
                      {currentStep === 5 && 'Stage 5: Synthesizing confidence & generating justification string...'}
                    </span>
                    <span className="font-bold text-[#FF9933]">{currentStep * 20}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#003366] h-full transition-all duration-300"
                      style={{ width: `${currentStep * 20}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Result Dossier Card */}
              {playgroundResult && (
                <div className="bg-white border border-slate-300 rounded-lg p-5 shadow-sm space-y-4 border-t-4 border-[#003366]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#003366]">{playgroundResult.work_code}</span>
                      <h3 className="font-bold text-sm text-slate-900 mt-0.5 font-serif">
                        AI Multi-Stage Evaluation Verdict
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded font-mono font-bold text-xs border ${
                      playgroundResult.is_flagged
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {playgroundResult.risk_level} RISK • {Math.round(playgroundResult.confidence * 100)}% CONFIDENCE
                    </span>
                  </div>

                  {/* Auto-Tags */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase block">
                      Generated Defect Tags:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {playgroundResult.defect_tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 rounded font-mono text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stage Metrics Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                    <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 rounded">
                      <span className="text-slate-500 text-[10px] uppercase block">CV Classification</span>
                      <strong className={playgroundResult.stages.stage1_cv_classification.status === 'FLAGGED' ? 'text-rose-700' : 'text-emerald-700'}>
                        {playgroundResult.stages.stage1_cv_classification.status}
                      </strong>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 rounded">
                      <span className="text-slate-500 text-[10px] uppercase block">SSIM Similarity</span>
                      <strong className={playgroundResult.stages.stage2_before_after.status === 'FLAGGED' ? 'text-rose-700' : 'text-emerald-700'}>
                        {playgroundResult.stages.stage2_before_after.structural_similarity_index}
                      </strong>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 rounded">
                      <span className="text-slate-500 text-[10px] uppercase block">GPS Deviation</span>
                      <strong className={playgroundResult.stages.stage3_geotag_verification.status === 'FLAGGED' ? 'text-rose-700' : 'text-emerald-700'}>
                        {playgroundResult.stages.stage3_geotag_verification.deviation_meters}m
                      </strong>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-200 p-2.5 rounded">
                      <span className="text-slate-500 text-[10px] uppercase block">pHash Duplicate</span>
                      <strong className={playgroundResult.stages.stage4_duplicate_detection.status === 'FLAGGED' ? 'text-rose-700' : 'text-emerald-700'}>
                        {playgroundResult.stages.stage4_duplicate_detection.status}
                      </strong>
                    </div>
                  </div>

                  {/* Legal Justification String */}
                  <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs space-y-1">
                    <span className="font-bold text-amber-900 block font-mono text-[10px] uppercase">
                      Official Audit Justification String:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-sans font-medium">
                      "{playgroundResult.justification}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AUDITABLE DECISION LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#002244] font-serif">
                    Auditable AI Decision Logs (ai_detections.json)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Immutable historical ledger recording every input photo fingerprint, model verdict, and justification.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {logs.length} Logged Decisions
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-[#003366] text-white uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Audit Log ID</th>
                      <th className="p-3">Work Code</th>
                      <th className="p-3">Photo SHA-256</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Defect Tags</th>
                      <th className="p-3">Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {logs.map((log, idx) => (
                      <tr key={log.id || idx} className={idx % 2 === 0 ? 'bg-white hover:bg-blue-50/40' : 'bg-[#F8FAFC] hover:bg-blue-50/40'}>
                        <td className="p-3 font-mono font-bold text-[#003366] text-[10px] whitespace-nowrap">{log.id}</td>
                        <td className="p-3 font-mono text-slate-900 font-bold whitespace-nowrap">{log.work_code}</td>
                        <td className="p-3 font-mono text-slate-500 text-[10px]">{log.photo_sha256}</td>
                        <td className="p-3 font-mono font-bold text-amber-700">{Math.round(log.confidence * 100)}%</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {log.defect_tags.map((t, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-50 text-red-800 border border-red-200">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-slate-600 max-w-xs truncate" title={log.justification}>
                          {log.justification}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Compliant with CVC Circular 04/2021 &amp; MoSPI e-SAKSHI Computer Vision Guidelines
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white font-bold cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
