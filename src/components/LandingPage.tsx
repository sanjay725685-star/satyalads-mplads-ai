import React from 'react';
import { Shield, ArrowRight, Eye, Satellite, FileText, Database, CheckCircle2, AlertTriangle, Scale, Award } from 'lucide-react';
import { Language } from '../types';

interface LandingPageProps {
  onEnterApp: () => void;
  lang: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, lang }) => {
  const isHi = lang !== 'en';

  return (
    <div className="min-h-screen bg-[#071326] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Top Gov Ribbon */}
      <div className="bg-[#020C1B] border-b border-[#1E3A5F] px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold tracking-wider">सत्यमेव जयते</span>
          <span>•</span>
          <span>GOVERNMENT OF INDIA • MoSPI</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">SMART INDIA HACKATHON 2026 (PROBLEM 26102)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
            TEAM: STACK ATTACK
          </span>
          <span>OFFICIAL VIGILANCE PRODUCT</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6 w-fit">
          <Shield className="w-3.5 h-3.5" />
          <span>Autonomous Multi-Modal AI Sentinel for Scheme Integrity</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight font-serif">
          SATYALADS <span className="text-amber-400 font-sans font-bold text-3xl sm:text-5xl">(सत्य-LADS)</span>
        </h1>
        <h2 className="text-lg sm:text-2xl font-medium text-slate-300 max-w-3xl mb-8 leading-relaxed">
          {isHi 
            ? "एमपीलैड्स (MPLADS) योजना में धोखाधड़ी, कार्टेल सिंडिकेट और गलत जियो-टैग्ड संपत्तियों को पकड़ने वाला वास्तविक एआई सतर्कता मंच।"
            : "AI-powered vigilance and fraud detection platform for Member of Parliament Local Area Development Scheme project filings."}
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-xl p-5 hover:border-sky-500 transition-all">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">
              {isHi ? "वास्तविक एल्गोरिदम इंजन" : "Real Detection Algorithms"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi 
                ? "DBSCAN स्पेशल क्लस्टरिंग, Z-स्कोर लागत विसंगति, NetworkX कार्टेल ग्राफ और pHash घोस्ट फोटो डिटेक्शन।"
                : "DBSCAN spatial clustering, Z-score cost distributions, NetworkX cartel graphs, and perceptual image hashing."}
            </p>
          </div>

          <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-xl p-5 hover:border-emerald-500 transition-all">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Satellite className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">
              {isHi ? "लाइव जियो-टैग सत्यापन" : "Live Geo-Tag Verification"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi 
                ? "तस्वीरों से EXIF GPS और टाइमस्टैम्प निकालकर 500m से अधिक विचलन और फर्जी साक्ष्य को तुरंत फ्लैग करता है।"
                : "Extracts EXIF GPS and timestamps from field photos to catch >500m location mismatches and stripped metadata."}
            </p>
          </div>

          <div className="bg-[#0F233D] border border-[#1E3A5F] rounded-xl p-5 hover:border-amber-500 transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">
              {isHi ? "कानूनी व्याख्या और जीएफआर संदर्भ" : "Explainable GFR Citations"}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi 
                ? "प्रत्येक फ्लैग के साथ जीएफआर नियम 144/149/153 और सीवीसी दिशानिर्देशों का स्पष्ट सांख्यिकीय प्रमाण।"
                : "Every anomaly cites the exact rule trigger, standard deviation, and General Financial Rules (GFR) clauses."}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 text-base transition-all cursor-pointer font-sans"
          >
            <span>{isHi ? "सतर्कता ऑडिट पोर्टल में प्रवेश करें" : "Access Vigilance Audit System"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>320+ MPLADS Projects Active • 25 Lok Sabha Seats</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#020C1B] border-t border-[#1E3A5F] px-6 py-4 text-center text-xs text-slate-500 font-mono">
        SATYALADS — Ministry of Statistics & Programme Implementation (MoSPI) • Built for Smart India Hackathon 2026 by Team Stack Attack
      </div>
    </div>
  );
};
