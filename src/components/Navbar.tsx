import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Satellite, 
  MapPin, 
  Bell, 
  Layers, 
  FileText, 
  Users, 
  Camera, 
  Sliders, 
  Globe, 
  LogOut, 
  Languages,
  Sparkles,
  ChevronDown,
  Search,
  Check,
  X,
  Volume2,
  QrCode,
  Cpu
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { INDIAN_LANGUAGES, getNavTranslations } from '../utils/languages';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userTitle: string;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  onTriggerScan: () => void;
  isScanning: boolean;
  fontSize?: 'sm' | 'base' | 'lg';
  setFontSize?: (size: 'sm' | 'base' | 'lg') => void;
  onOpenAIDetectionExplainer?: () => void;
  onOpenQRHandoff?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  userTitle,
  lang,
  setLang,
  onLogout,
  notificationCount,
  onOpenNotifications,
  onTriggerScan,
  isScanning,
  fontSize = 'base',
  setFontSize,
  onOpenAIDetectionExplainer,
  onOpenQRHandoff
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const t = getNavTranslations(lang);
  const currentLang = INDIAN_LANGUAGES.find(l => l.code === lang) || INDIAN_LANGUAGES[0];
  const isHi = lang !== 'en';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen]);

  const filteredLanguages = INDIAN_LANGUAGES.filter(item => 
    item.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    item.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    item.region.toLowerCase().includes(langSearch.toLowerCase()) ||
    item.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: Layers },
    { id: 'projects', label: t.projects, icon: FileText },
    { id: 'gis_map', label: t.gis_map, icon: MapPin },
    { id: 'capture_photo', label: t.capture_photo, icon: Camera },
    { id: 'before_after', label: t.before_after, icon: Sliders },
    { id: 'cartels', label: t.cartels, icon: Users },
    { id: 'satellite', label: t.satellite, icon: Satellite },
    { id: 'transparency', label: t.transparency, icon: Globe },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm">
      {/* 1. GIGW Top Official Indian Utility & Accessibility Bar */}
      <div className="bg-[#002244] text-slate-100 text-[11px] font-sans border-b border-[#003366]">
        {/* Tricolor Micro-Line */}
        <div className="h-1 w-full flex">
          <div className="h-full flex-1 bg-[#FF9933]" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-[#138808]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 flex items-center justify-between gap-2">
          {/* Left: Official Tagline & Flag Emblem */}
          <div className="flex items-center gap-2.5">
            <span className="text-sm">🇮🇳</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="font-bold text-white">भारत सरकार</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-200 hidden sm:inline">GOVERNMENT OF INDIA</span>
            </div>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-slate-300 text-[10px] hidden md:inline">
              {isHi ? 'सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय' : 'Ministry of Statistics & Programme Implementation'}
            </span>
          </div>

          {/* Right: Accessibility Toolbar & Language Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Skip to Main Content Link */}
            <a 
              href="#main-content" 
              className="text-[10px] text-amber-300 hover:text-white underline font-semibold focus:ring-1 focus:ring-amber-400 px-1 py-0.5 rounded hidden sm:inline"
            >
              Skip to Main Content
            </a>

            {/* Screen Reader Icon */}
            <span className="text-slate-400 hidden lg:flex items-center gap-1 text-[10px]" title="Screen Reader Accessible">
              <Volume2 className="w-3 h-3 text-slate-300" />
              <span className="hidden xl:inline">Screen Reader</span>
            </span>

            {/* Font Size Adjuster (A- A A+) */}
            {setFontSize && (
              <div className="flex items-center bg-[#001A33] border border-slate-700 rounded px-1.5 py-0.5 space-x-1">
                <button
                  type="button"
                  onClick={() => setFontSize('sm')}
                  className={`px-1 text-[10px] font-bold ${fontSize === 'sm' ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <span className="text-slate-600 text-[9px]">|</span>
                <button
                  type="button"
                  onClick={() => setFontSize('base')}
                  className={`px-1 text-[10px] font-bold ${fontSize === 'base' ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
                  title="Default Font Size"
                >
                  A
                </button>
                <span className="text-slate-600 text-[9px]">|</span>
                <button
                  type="button"
                  onClick={() => setFontSize('lg')}
                  className={`px-1 text-[10px] font-bold ${fontSize === 'lg' ? 'text-amber-400' : 'text-slate-300 hover:text-white'}`}
                  title="Increase Font Size"
                >
                  A+
                </button>
              </div>
            )}

            {/* Digital India Bhashini Language Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#001A33] hover:bg-[#003366] border border-amber-500/40 text-amber-300 font-bold text-[10px] transition-all cursor-pointer"
                title="Digital India Bhashini National Language Mission"
              >
                <Languages className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <span>{currentLang.nativeName}</span>
                <span className="text-[9px] text-amber-400/80 font-mono hidden md:inline">({currentLang.code.toUpperCase()})</span>
                <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown Modal */}
              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white border border-slate-300 rounded-lg shadow-2xl z-50 p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-100 max-w-[95vw]">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        <Languages className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#003366] flex items-center gap-1.5">
                          <span>Digital India भाषिणी (Bhashini AI)</span>
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
                            {INDIAN_LANGUAGES.length} Languages
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-500">Official Eighth Schedule Indian Languages</div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsLangMenuOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search language (e.g. Tamil, Marathi, Bengali)..."
                      className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0B3D91]"
                      autoFocus
                    />
                  </div>

                  {/* Language Grid */}
                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                    {filteredLanguages.map((item) => {
                      const isSelected = item.code === lang;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => {
                            setLang(item.code);
                            setIsLangMenuOpen(false);
                            setLangSearch('');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-50 border border-amber-400 text-[#003366] font-semibold' 
                              : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#003366]">{item.nativeName}</span>
                              <span className="text-[10px] text-slate-500">({item.name})</span>
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">{item.region}</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Ministry Header Strip (White Background) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Ministry Crest & SATYALADS Branding */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          {/* Government of India Ashoka Lion Seal Icon */}
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center p-1 rounded-md bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-300 shadow-sm">
            <div className="text-center leading-tight">
              <div className="text-lg">🏛️</div>
              <div className="text-[7px] font-serif font-bold text-[#003366] uppercase tracking-tighter">सत्यमेव जयते</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#002244] tracking-tight font-serif">SATYALADS</span>
              <span className="text-sm font-bold text-[#FF9933] font-sans">(सत्य-LADS)</span>
              <span className="hidden sm:inline-block bg-[#0B3D91] text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                e-SAKSHI SENTINEL
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#003366] tracking-tight">
              MPLADS Autonomous Anti-Fraud Vigilance & Spatial Audit Portal
            </p>
            <p className="text-[9px] text-slate-500 hidden md:block">
              Ministry of Statistics & Programme Implementation • Smart India Hackathon 2026 (Problem 26102)
            </p>
          </div>
        </div>

        {/* Right Officer Info & Logout */}
        <div className="flex items-center gap-3">
          {/* Officer Verification Badge */}
          <div className="bg-slate-50 border border-slate-300 rounded px-3 py-1 flex items-center gap-2 text-right">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="text-[11px] font-bold text-[#002244] uppercase tracking-wide">
                {userRole}: <span className="text-[#0B3D91] capitalize">{userTitle}</span>
              </div>
              <div className="text-[9px] text-slate-500 font-mono">
                Verified Officer Session
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="text-slate-600 hover:text-red-700 p-2 rounded hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Sign Out / Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Primary Navigation Bar (Solid Government Navy Blue #003366) */}
      <div className="bg-[#003366] text-white border-t border-[#0B3D91]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2">
          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold tracking-wide transition-all cursor-pointer border-b-4 ${
                    isActive
                      ? 'border-[#FF9933] bg-[#002244] text-white'
                      : 'border-transparent text-slate-200 hover:bg-[#0B3D91] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-300" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Tab Scroller */}
          <div className="xl:hidden flex items-center space-x-1 overflow-x-auto py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                    isActive ? 'bg-[#FF9933] text-[#002244] font-bold' : 'text-slate-200 hover:bg-[#0B3D91]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 py-1.5 flex-shrink-0">
            {/* QR Mobile Capture Handoff Button */}
            {onOpenQRHandoff && (
              <button
                type="button"
                onClick={onOpenQRHandoff}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#002244] hover:bg-[#0B3D91] border border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title="Scan QR to capture photo from phone"
              >
                <QrCode className="w-3.5 h-3.5 text-[#FF9933]" />
                <span className="hidden md:inline">Mobile Capture</span>
              </button>
            )}

            {/* How AI Works Button */}
            {onOpenAIDetectionExplainer && (
              <button
                type="button"
                onClick={onOpenAIDetectionExplainer}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#002244] hover:bg-[#0B3D91] border border-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                title="How AI Detection Works & Pipeline"
              >
                <Cpu className="w-3.5 h-3.5 text-[#FF9933]" />
                <span className="hidden md:inline">How AI Works</span>
              </button>
            )}

            {/* Critical Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded bg-[#002244] hover:bg-[#0B3D91] text-amber-300 border border-slate-700 transition-all cursor-pointer"
              title="Audit Alerts"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Run AI Re-Scan Button */}
            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="px-3.5 py-1.5 rounded bg-[#FF9933] hover:bg-[#ffaa4d] text-[#003366] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap border border-amber-600"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? t.scanning : t.run_rescan}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
