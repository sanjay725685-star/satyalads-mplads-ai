import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Eye, 
  Satellite, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  Lock, 
  FileText,
  ChevronDown,
  ChevronUp,
  Cpu,
  MapPin,
  Compass,
  Layers,
  Network,
  Calculator,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, lang }) => {
  const isHi = lang !== 'en';
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Read initial hash on mount or hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['detection-engine', 'geotag-verification', 'gfr-citations'].includes(hash)) {
        setActiveSection(hash);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const scrollToFeature = (id: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveSection(id);
    try {
      window.history.pushState(null, '', `#${id}`);
    } catch {}
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 bg-[#F5F7FA] text-[#1A1A1A] flex flex-col justify-between">
      {/* 1. Official Government Header Strip */}
      <div className="bg-[#002244] text-white">
        <div className="h-1 w-full flex">
          <div className="h-full flex-1 bg-[#FF9933]" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-[#138808]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span>🏛️</span>
            <span className="font-bold">भारत सरकार | GOVERNMENT OF INDIA</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-amber-300 hidden sm:inline">Ministry of Statistics & Programme Implementation (MoSPI)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="bg-[#003366] px-2 py-0.5 rounded border border-slate-600 text-amber-300 font-bold">
              SIH 2026 PS 26102
            </span>
          </div>
        </div>
      </div>

      {/* 2. Official News / Announcement Banner */}
      <div className="bg-amber-50 border-b border-amber-200 text-[#002244] px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="bg-[#FF9933] text-[#002244] font-black text-[10px] uppercase px-1.5 py-0.5 rounded">
            ALERT
          </span>
          <p className="truncate text-[11px] font-medium">
            {isHi 
              ? 'एमपीलैड्स (MPLADS) ई-साक्षी 2026: सभी 25 संसदीय क्षेत्रों में स्वचालित एआई भू-स्थानिक और वित्तीय ऑडिट सक्रिय है।'
              : 'Official Notice: Autonomous AI Spatial and Financial Vigilance active across 25 Lok Sabha Constituencies under GFR 2017.'}
          </p>
        </div>
      </div>

      {/* 3. Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 flex flex-col justify-center space-y-10">
        {/* National Emblem & Title */}
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded bg-white border border-amber-300 p-2 shadow-sm flex flex-col items-center justify-center text-center flex-shrink-0">
            <span className="text-3xl">🏛️</span>
            <span className="text-[8px] font-serif font-bold text-[#002244] uppercase tracking-tighter mt-0.5">सत्यमेव जयते</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[#0B3D91] text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5 text-[#0B3D91]" />
              <span>National Scheme Integrity Sentinel • e-SAKSHI Guidelines 2023</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#002244] tracking-tight font-serif">
              SATYALADS <span className="text-[#FF9933] font-sans font-bold">(सत्य-LADS)</span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-700 font-medium max-w-3xl mt-1 leading-relaxed">
              {isHi 
                ? 'संसद सदस्य स्थानीय क्षेत्र विकास योजना (MPLADS) में भ्रष्टाचार रोकथाम, कार्टेल डिटेक्शन एवं वास्तविक जियो-टैग सत्यापन का आधिकारिक एआई पोर्टल।'
                : 'Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation — MoSPI e-SAKSHI & GFR 2017 Sentinel.'}
            </p>
          </div>
        </div>

        {/* 4. Interactive Feature Cards Grid (Clickable Links with Hover States & Accessibility) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase font-bold tracking-wider text-[#002244] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{isHi ? 'मुख्य सतर्कता स्तम्भ (विवरण देखने के लिए क्लिक करें)' : 'Core Vigilance Architecture (Click card to view methodology)'}</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              3-Layer Algorithmic Defense
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Algorithmic Detection Engine */}
            <a
              href="#detection-engine"
              role="link"
              tabIndex={0}
              aria-label="View details on the Algorithmic Detection Engine"
              onClick={(e) => scrollToFeature('detection-engine', e)}
              className={`bg-white border rounded-md p-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0B3D91] group cursor-pointer block text-left ${
                activeSection === 'detection-engine' 
                  ? 'border-[#0B3D91] ring-2 ring-[#0B3D91]/20 shadow-md bg-blue-50/20' 
                  : 'border-slate-300 hover:border-[#0B3D91] hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 text-[#0B3D91] group-hover:bg-[#0B3D91] group-hover:text-white transition-colors flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0B3D91] flex items-center gap-1 group-hover:underline">
                  <span>{isHi ? 'विवरण देखें' : 'View Methodology'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="font-bold text-[#002244] text-base mb-1 group-hover:text-[#0B3D91] transition-colors">
                {isHi ? 'वास्तविक एल्गोरिदम इंजन' : 'Algorithmic Detection Engine'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi 
                  ? 'DBSCAN स्पेशल क्लस्टरिंग, PWD दर अनुसूची Z-स्कोर लागत विसंगति, NetworkX कार्टेल ग्राफ और pHash घोस्ट फोटो डिटेक्शन।'
                  : 'Deploying DBSCAN spatial clustering (150m), Schedule of Rates Z-score & IQR outlier analysis, and NetworkX bidding cartel graphs.'}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-[#0B3D91] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Zero-Heuristic Mathematical Checks</span>
              </div>
            </a>

            {/* Card 2: EXIF Geotag Verification */}
            <a
              href="#geotag-verification"
              role="link"
              tabIndex={0}
              aria-label="View details on EXIF Geotag Verification"
              onClick={(e) => scrollToFeature('geotag-verification', e)}
              className={`bg-white border rounded-md p-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 group cursor-pointer block text-left ${
                activeSection === 'geotag-verification' 
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md bg-emerald-50/20' 
                  : 'border-slate-300 hover:border-emerald-600 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors flex items-center justify-center">
                  <Satellite className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 group-hover:underline">
                  <span>{isHi ? 'सत्यापन देखें' : 'View Verification'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="font-bold text-[#002244] text-base mb-1 group-hover:text-emerald-700 transition-colors">
                {isHi ? 'लाइव जियो-टैग सत्यापन' : 'EXIF Geotag Verification'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi 
                  ? 'तस्वीरों से EXIF GPS और टाइमस्टैम्प निकालकर 500m से अधिक दूरी के फर्जीवाड़े और छेड़छाड़ किए गए साक्ष्यों को तुरंत पकड़ता है।'
                  : 'Binary extraction of camera EXIF GPS tags & timestamps with Haversine distance verification to flag >500m site discrepancies.'}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-[#0B3D91] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Anti-Spoofing Camera Sentinel</span>
              </div>
            </a>

            {/* Card 3: Statutory GFR 2017 Citations */}
            <a
              href="#gfr-citations"
              role="link"
              tabIndex={0}
              aria-label="View details on Statutory GFR 2017 Citations"
              onClick={(e) => scrollToFeature('gfr-citations', e)}
              className={`bg-white border rounded-md p-5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-600 group cursor-pointer block text-left ${
                activeSection === 'gfr-citations' 
                  ? 'border-amber-600 ring-2 ring-amber-600/20 shadow-md bg-amber-50/20' 
                  : 'border-slate-300 hover:border-amber-600 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 text-amber-800 group-hover:bg-amber-800 group-hover:text-white transition-colors flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1 group-hover:underline">
                  <span>{isHi ? 'कानूनी नियम देखें' : 'View Compliance'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="font-bold text-[#002244] text-base mb-1 group-hover:text-amber-800 transition-colors">
                {isHi ? 'जीएफआर 2017 विधिक उद्धरण' : 'Statutory GFR 2017 Citations'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi 
                  ? 'हर संदिग्ध कार्य के साथ जनरल फाइनेंशियल रूल्स (GFR 2017) और केंद्रीय सतर्कता आयोग (CVC) के नियमों का स्पष्ट साक्ष्य पत्र।'
                  : 'Every automated flag links directly to General Financial Rules (GFR 2017 Rules 144, 149) and CVC vigilance mandates.'}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1 text-[10px] text-[#0B3D91] font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Court-Admissible Audit Dossiers</span>
              </div>
            </a>
          </div>
        </div>

        {/* 5. CTA Section (Officer Login Access) */}
        <div className="bg-white border-2 border-[#0B3D91] rounded-md p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-[#002244] border border-amber-300 font-mono">
                SECURE ACCESS
              </span>
              <span className="text-xs text-slate-500 font-mono">2-Factor JWT Role Authentication</span>
            </div>
            <h4 className="font-bold text-[#002244] text-base">
              {isHi ? 'अधिकृत सतर्कता अधिकारी लॉगिन' : 'Authorized Vigilance Officer Portal'}
            </h4>
            <p className="text-xs text-slate-600">
              {isHi 
                ? 'जिला सतर्कता अधिकारी, राज्य नोडल अधिकारी एवं सीएजी/सीवीसी ऑडिटर हेतु सुरक्षित प्रवेश।'
                : 'Role-based entry for District Vigilance Auditors, State Nodal Officers, and Central Vigilance Officers.'}
            </p>
          </div>
          
          <button
            type="button"
            onClick={onEnterApp}
            className="px-6 py-3 bg-[#0B3D91] hover:bg-[#002244] text-white font-bold rounded text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{isHi ? 'पोर्टल में प्रवेश करें (Officer Login)' : 'Access Officer Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED TECHNICAL DETAIL SECTIONS FOR THE THREE FEATURES               */}
        {/* ========================================================================= */}

        {/* SECTION 1: Algorithmic Detection Engine */}
        <section 
          id="detection-engine" 
          tabIndex={-1}
          className="scroll-mt-6 bg-white border border-slate-300 rounded-md p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-[#0B3D91] border border-blue-300 uppercase font-mono">
                  METHODOLOGY 01 • SPATIAL & GRAPH INTELLIGENCE
                </span>
                <span className="text-xs text-slate-500 font-mono">scikit-learn DBSCAN • NetworkX • scipy</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#002244] font-serif flex items-center gap-2.5">
                <Eye className="w-6 h-6 text-[#0B3D91]" />
                <span>Algorithmic Detection Engine: Mathematical Fraud Vigilance</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Project: <em>Development of an AI-powered system to detect anomalies, fraud, and inefficiencies in MPLAD Scheme implementation.</em> SATYALADS rejects hardcoded rule heuristics in favor of formal spatial clustering, price deviation statistics, and graph-theoretic cartel rings.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs text-[#0B3D91] hover:underline font-bold flex items-center gap-1 self-start md:self-auto"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: DBSCAN */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#0B3D91] font-bold text-xs">
                <MapPin className="w-4 h-4 text-[#0B3D91]" />
                <span>1. DBSCAN Spatial Clustering</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Project Collision & Double-Dipping</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Executes density-based spatial clustering on asset GPS coordinates with <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">eps = 150m</code> and <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">min_samples = 2</code> using Haversine distance metric.
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700 font-mono">
                Flag: SPATIAL_DOUBLE_DIPPING<br />
                Overlap Radius: &le; 150 meters<br />
                Multi-Scheme Cross Check: PMGSY + MLALADS
              </div>
              <p className="text-[10px] text-slate-500">
                Catches situations where an MP funds a road or tube-well that was already sanctioned and executed under a state municipal grant.
              </p>
            </div>

            {/* Pillar 2: Z-Score / IQR */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#0B3D91] font-bold text-xs">
                <Calculator className="w-4 h-4 text-[#0B3D91]" />
                <span>2. Schedule of Rates Z-Score & IQR</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">DPR Price Inflation Detection</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Calculates unit rate deviations against state CPWD/PWD District Schedule of Rates (DSR):
                <span className="block my-1 font-mono text-[10px] bg-white p-1 rounded border border-slate-200 text-center">
                  Z = (ClaimedRate - MeanDSR) / StdDevDSR
                </span>
                Flags items where <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">Z &gt; +2.5</code> or cost exceeds <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">Q3 + 1.5 &times; IQR</code>.
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700 font-mono">
                Enforces: GFR 2017 Rule 149<br />
                Markup Threshold: &gt; 15% Over permissible<br />
                Detects: Cement/Bitumen Rate Pumping
              </div>
            </div>

            {/* Pillar 3: NetworkX Cartels */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#0B3D91] font-bold text-xs">
                <Network className="w-4 h-4 text-[#0B3D91]" />
                <span>3. NetworkX Bipartite Cartel Graph</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">Bidding Syndicates & Ring Tendering</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Builds bipartite graph linking contractors, registered phone numbers, PAN/GSTIN, and awarded tenders. Algorithms run community detection and cyclic subgraphs to identify rotational cover-bidding.
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700 font-mono">
                Engine: NetworkX MultiGraph<br />
                Cluster Detection: Shared PAN / Directors<br />
                Monopoly Trigger: Win-Ratio &gt; 80% with co-bidders
              </div>
              <p className="text-[10px] text-slate-500">
                Directly flags violations of GFR 2017 Rule 144 preventing anti-competitive bid splitting.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-800">
              <strong className="text-[#0B3D91]">Interactive Demo:</strong> Inspect the full algorithmic graph and radar score in the live auditor dashboard.
            </div>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 bg-[#0B3D91] text-white rounded font-bold hover:bg-[#002244] transition-colors whitespace-nowrap cursor-pointer"
            >
              Open Live Detection Engine
            </button>
          </div>
        </section>

        {/* SECTION 2: EXIF Geotag Verification */}
        <section 
          id="geotag-verification" 
          tabIndex={-1}
          className="scroll-mt-6 bg-white border border-slate-300 rounded-md p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase font-mono">
                  METHODOLOGY 02 • SENSOR & EXIF FORENSICS
                </span>
                <span className="text-xs text-slate-500 font-mono">piexif • Haversine Great-Circle • Sentinel SAR CV</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#002244] font-serif flex items-center gap-2.5">
                <Satellite className="w-6 h-6 text-emerald-700" />
                <span>EXIF Geotag Verification & Anti-Spoofing Camera Sentinel</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Autonomous validation of site ground-truth photographs submitted by contractors and citizens. Prevents fraudulent claims by computing physical distance deviation and detecting synthetic or recycled images.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1 self-start md:self-auto"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: EXIF Extraction & Haversine Metric */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  Binary EXIF GPS & Timestamp Extraction
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  SATYALADS reads raw JPEG/TIFF APP1 binary segments to extract embedded hardware metadata:
                </p>
                <ul className="text-[11px] text-slate-700 list-disc list-inside space-y-1 font-mono bg-white p-2.5 rounded border border-slate-200">
                  <li>GPSLatitude & GPSLongitude (deg/min/sec converted to decimal)</li>
                  <li>GPSAltitude & GPSTimeStamp</li>
                  <li>DateTimeOriginal & Camera Hardware Model</li>
                  <li>Software Tag (flags editing apps like Photoshop or FakeGPS)</li>
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900">Haversine Distance Formula (&gt;500m Limit)</h4>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Distance between sanctioned coordinates <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">(&phi;1, &lambda;1)</code> and photo coordinates <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded">(&phi;2, &lambda;2)</code> is computed via:
                </p>
                <div className="font-mono text-[10px] bg-white p-2 rounded border border-emerald-300 text-center text-slate-800">
                  d = 2 &times; R &times; arcsin(&radic;(sin&sup2;(&Delta;&phi;/2) + cos(&phi;1)cos(&phi;2)sin&sup2;(&Delta;&lambda;/2)))
                </div>
                <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MoSPI Regulatory Standard: Strictly &le; 500m tolerance threshold</span>
                </div>
              </div>
            </div>

            {/* Right: Dual Space-Ground Sentinel */}
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0B3D91]" />
                  Space-to-Ground Dual Verification Pass
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Ground photos alone can be manipulated. SATYALADS correlates ground photos against:
                </p>
                <div className="space-y-2 pt-1">
                  <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                    <span className="font-bold text-[#0B3D91] block">1. ESA Sentinel-1 C-Band SAR Radar</span>
                    <span className="text-slate-600">Measures backscatter surface roughness delta (&Delta;dB). Unaffected by cloud cover or night time.</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                    <span className="font-bold text-emerald-700 block">2. ESA Sentinel-2 Optical NDBI</span>
                    <span className="text-slate-600">Normalized Difference Built-up Index verifies physical terrain transition from barren to built concrete.</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-[11px] text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">pHash & Error Level Analysis (ELA)</span>
                <p className="text-slate-600">
                  Perceptual hash matching (<code className="font-mono text-[10px]">imagehash.phash</code>) prevents contractors from reusing the same photograph across multiple financial years or neighboring parliamentary constituencies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Statutory GFR 2017 Citations */}
        <section 
          id="gfr-citations" 
          tabIndex={-1}
          className="scroll-mt-6 bg-white border border-slate-300 rounded-md p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase font-mono">
                  COMPLIANCE & LEGAL FRAMEWORK • COURT-ADMISSIBLE AUDIT
                </span>
                <span className="text-xs text-slate-500 font-mono">GFR 2017 Rules 144, 149 • CVC Vigilance Directives</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#002244] font-serif flex items-center gap-2.5">
                <Scale className="w-6 h-6 text-amber-800" />
                <span>Statutory GFR 2017 Rules & CVC Vigilance Mandate Citations</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Every anomaly flagged by SATYALADS is directly tethered to Indian public finance statutes, creating cryptographically verifiable, court-admissible audit dossiers for District Collector inquiries and CAG / CVC action.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs text-amber-800 hover:underline font-bold flex items-center gap-1 self-start md:self-auto"
            >
              <span>Back to Top</span>
              <ChevronUp className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Statute 1: GFR Rule 144 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono text-[10px] inline-block">
                RULE 144
              </span>
              <h4 className="font-bold text-[#002244] text-sm">Fundamental Principles of Public Procurement</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mandates that every authority delegated financial powers must ensure transparency, equal opportunity, and eliminate any conflict of interest or cartel collusion.
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700 font-mono">
                Flag: CARTEL_BID_RIGGING<br />
                Citation: GFR 2017 Rule 144(i) & CVC Circular No. 02/02/2022
              </div>
            </div>

            {/* Statute 2: GFR Rule 149 */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono text-[10px] inline-block">
                RULE 149
              </span>
              <h4 className="font-bold text-[#002244] text-sm">Price Reasonableness & GeM Benchmarks</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Procurement must satisfy price reasonableness against standard schedule of rates (DSR) and prevailing market prices, forbidding arbitrary markups in contractor estimates.
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700 font-mono">
                Flag: DPR_PRICE_INFLATION<br />
                Citation: GFR 2017 Rule 149(viii) Price Certification Mandate
              </div>
            </div>

            {/* Statute 3: MoSPI e-SAKSHI Guidelines */}
            <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono text-[10px] inline-block">
                e-SAKSHI 2023
              </span>
              <h4 className="font-bold text-[#002244] text-sm">Statutory SC/ST Quotas & Permissible Assets</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mandatory expenditure quotas: &ge; 15% for Scheduled Caste (SC) areas and &ge; 7.5% for Scheduled Tribe (ST) areas. Absolute ban on commercial or private trust properties.
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 text-[10px] text-slate-700 font-mono">
                Flag: STATUTORY_QUOTA_DEFICIT / NON_PERMISSIBLE_ASSET<br />
                Citation: MoSPI MPLADS Guidelines 2023 Para 2.5, 2.6 & 3.12
              </div>
            </div>
          </div>

          {/* Audit Dossier Pipeline Summary */}
          <div className="bg-amber-50/60 border border-amber-300 rounded p-4 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-800" />
              <strong className="text-[#002244]">Court-Admissible Evidence Dossier Trail:</strong>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              When an irregularity is escalated, SATYALADS automatically generates an SHA-256 tamper-evident PDF dossier containing: GPS discrepancy charts, satellite before/after overlays, contractor registry graph, and specific GFR 2017 citations. This dossier can be directly forwarded to the District Magistrate (DM/DC), State Vigilance Commission, or CAG audit cell.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
