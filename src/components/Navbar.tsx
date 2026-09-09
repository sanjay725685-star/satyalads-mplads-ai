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
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Search,
  Check,
  X
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
  isScanning
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const t = getNavTranslations(lang);
  const currentLang = INDIAN_LANGUAGES.find(l => l.code === lang) || INDIAN_LANGUAGES[0];

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
    <header className="sticky top-0 z-50 bg-[#071326]/95 backdrop-blur-md border-b border-[#1E3A5F] shadow-lg">
      {/* Top Gov Ribbon */}
      <div className="bg-[#020C1B] border-b border-[#1E3A5F]/40 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            GOVERNMENT OF INDIA • MoSPI
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline">e-SAKSHI Mandatory Geotag Sentinel</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-emerald-400 font-bold hidden md:inline">SIH 2026 Problem 26102 (Stack Attack)</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Multilingual Bhashini Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F233D] hover:bg-[#1E3A5F] border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold text-[11px] transition-all cursor-pointer shadow-sm"
              title="Select All-India Official Language (Digital India Bhashini Mission)"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="font-sans font-bold">{currentLang.nativeName}</span>
              <span className="text-[9px] text-amber-400/80 font-mono hidden sm:inline">({currentLang.code.toUpperCase()})</span>
              <ChevronDown className={`w-3 h-3 text-amber-400 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#071326] border border-amber-500/30 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl max-w-[95vw]">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1E3A5F] mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Digital India Bhashini AI</span>
                        <span className="text-[8px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">{INDIAN_LANGUAGES.length} Languages</span>
                      </div>
                      <div className="text-[9px] text-slate-400">Constitution 8th Schedule Official Languages</div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsLangMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search language (e.g. Tamil, Marathi, Bengali)..."
                    className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
                    autoFocus
                  />
                </div>

                {/* Scrollable Language Grid */}
                <div className="max-h-64 overflow-y-auto pr-1 space-y-1">
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
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-500/20 border border-amber-500/60 text-white shadow' 
                            : 'hover:bg-[#0F233D] text-slate-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-amber-300">{item.nativeName}</span>
                            <span className="text-[10px] text-slate-400 font-sans">({item.name})</span>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono mt-0.5">{item.region}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                  {filteredLanguages.length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-xs font-mono">
                      No matching Indian language found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Badge */}
          <div className="flex items-center gap-1.5 bg-[#0F233D] px-2.5 py-0.5 rounded border border-[#1E3A5F] text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-amber-300 uppercase text-[10px]">{userRole}:</span>
            <span className="text-[10px] truncate max-w-[130px] hidden sm:inline">{userTitle}</span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
            title="Exit / Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-black text-lg text-white leading-none tracking-tight flex items-center gap-1.5">
              <span>SATYALADS</span>
              <span className="text-amber-400 font-sans font-bold text-xs">सत्य-LADS</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 tracking-wider">
              AUTONOMOUS AUDIT SENTINEL
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center space-x-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-[#0F233D] border border-transparent hover:border-[#1E3A5F]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#0F233D] hover:bg-[#1E3A5F] border border-[#1E3A5F] text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Critical Audit Alerts"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center animate-pulse">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Quick Re-Scan Button */}
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isScanning ? t.scanning : t.run_rescan}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overflow */}
      <div className="xl:hidden flex items-center space-x-1 overflow-x-auto px-4 py-2 bg-[#020C1B]/80 border-t border-[#1E3A5F]/40 text-xs">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg whitespace-nowrap text-[11px] ${
                isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
