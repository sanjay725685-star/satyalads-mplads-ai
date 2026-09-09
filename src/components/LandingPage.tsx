import React from 'react';
import { Shield, ArrowRight, Eye, Satellite, Scale, CheckCircle2, AlertTriangle, Building, Lock, FileText } from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, lang }) => {
  const isHi = lang !== 'en';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center">
        {/* National Emblem & Title */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded bg-white border border-amber-300 p-2 shadow-sm flex flex-col items-center justify-center text-center">
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
            <p className="text-sm sm:text-lg text-slate-700 font-medium max-w-3xl mt-1">
              {isHi 
                ? 'संसद सदस्य स्थानीय क्षेत्र विकास योजना (MPLADS) में भ्रष्टाचार रोकथाम, कार्टेल डिटेक्शन एवं वास्तविक जियो-टैग सत्यापन का आधिकारिक एआई पोर्टल।'
                : 'Official AI-powered vigilance and fraud detection portal for Member of Parliament Local Area Development Scheme project filings.'}
            </p>
          </div>
        </div>

        {/* Feature Cards Grid (Official Government Portal Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200 text-[#0B3D91] flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#002244] text-base mb-1">
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
          </div>

          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3">
              <Satellite className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#002244] text-base mb-1">
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
          </div>

          <div className="bg-white border border-slate-300 rounded-md p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#002244] text-base mb-1">
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
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border border-slate-300 rounded-md p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#002244] text-base">
              {isHi ? 'अधिकृत सतर्कता अधिकारी लॉगिन' : 'Authorized Vigilance Officer Portal'}
            </h4>
            <p className="text-xs text-slate-600">
              {isHi 
                ? 'जिला सतर्कता अधिकारी, राज्य नोडल अधिकारी एवं सीएजी/सीवीसी ऑडिटर हेतु सुरक्षित प्रवेश।'
                : 'Secure portal for District Vigilance Auditors, State Nodal Officers, and Central Administrators.'}
            </p>
          </div>
          
          <button
            onClick={onEnterApp}
            className="px-6 py-3 bg-[#0B3D91] hover:bg-[#003366] text-white font-bold rounded text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{isHi ? 'पोर्टल में प्रवेश करें (Officer Login)' : 'Access Officer Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
