import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Award, FileText, PhoneCall, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isHi = lang !== 'en';

  return (
    <footer className="w-full bg-[#002244] text-white border-t-4 border-[#FF9933] mt-auto font-sans">
      {/* Indian Tricolor Stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#0B3D91]">
          {/* Col 1: Ministry / Portal Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-md">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                  alt="State Emblem of India" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-[#FF9933] uppercase">
                  {isHi ? "भारत सरकार" : "GOVERNMENT OF INDIA"}
                </div>
                <div className="text-xs font-bold text-white leading-tight">
                  {isHi ? "सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय" : "Ministry of Statistics & Programme Implementation"}
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>SATYALADS</strong> — Autonomous Multi-Modal AI Sentinel for Integrity & Fraud Detection in MPLADS Fund Allocation & Physical Asset Execution.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit TLS Encrypted Government Portal</span>
            </div>
          </div>

          {/* Col 2: GIGW Compliance Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF9933] font-mono border-b border-[#0B3D91] pb-1">
              {isHi ? "अनिवार्य नीतियां (GIGW)" : "Mandatory Policies (GIGW)"}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <a href="#privacy" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Privacy Policy (DPDP Act, 2023)</span>
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Terms &amp; Conditions of Usage</span>
                </a>
              </li>
              <li>
                <a href="#hyperlink" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Hyperlinking Policy</span>
                </a>
              </li>
              <li>
                <a href="#copyright" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Copyright Policy</span>
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Accessibility Statement</span>
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Disclaimer &amp; Caveat</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Help & Vigilance Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF9933] font-mono border-b border-[#0B3D91] pb-1">
              {isHi ? "सतर्कता एवं सहायता" : "Vigilance &amp; Helpdesk"}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
                <span>Right to Information (RTI Act 2005) Section 4 Disclosures</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
                <span>National Vigilance Toll-Free: 1800-11-2026</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF9933] shrink-0 mt-0.5" />
                <span>CPGRAMS Public Grievance Redressal Integration</span>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 font-mono">
                  MoSPI Headquarters: Khurshid Lal Bhawan, Janpath, New Delhi - 110001
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: National Initiatives & Visitor Counter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF9933] font-mono border-b border-[#0B3D91] pb-1">
              {isHi ? "राष्ट्रीय पहल एवं मान्यता" : "National Initiatives &amp; Badges"}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-[#001830] p-2.5 rounded border border-[#0B3D91]">
                <div className="text-[10px] uppercase font-mono text-slate-400">Competition Category</div>
                <div className="font-bold text-[#FF9933]">Smart India Hackathon 2026</div>
                <div className="text-[10px] text-slate-300 font-mono">Problem Statement 26102 • Team Stack Attack</div>
              </div>

              <div className="bg-[#001830] p-2.5 rounded border border-[#0B3D91] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400">Total Portal Hits</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">1,48,924</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Build Version</div>
                  <div className="text-xs font-bold text-white font-mono">v2.4.0-GOV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="text-center md:text-left leading-relaxed">
            <div>
              &copy; {new Date().getFullYear()} Ministry of Statistics and Programme Implementation, Government of India. All Rights Reserved.
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Portal Designed &amp; Developed for Smart India Hackathon (SIH) 2026 by Team Stack Attack under GIGW 3.0 Guidelines.
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-slate-300 shrink-0">
            <span className="bg-[#001830] px-3 py-1 rounded border border-[#0B3D91]">
              Last Updated: <strong>09-Sep-2026</strong>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> STQC Compliant
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
