import React from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { Language, UserRole } from '../types';

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
  const isHi = lang === 'hi';

  const navItems = [
    { id: 'dashboard', label: isHi ? 'डैशबोर्ड' : 'Dashboard', icon: Layers },
    { id: 'projects', label: isHi ? 'प्रोजेक्ट डायरेक्टरी' : 'Project Directory', icon: FileText },
    { id: 'gis_map', label: isHi ? '3D जीआईएस मैप' : 'GIS Geo-Map', icon: MapPin },
    { id: 'capture_photo', label: isHi ? 'लाइव फोटो कैप्चर' : 'Capture Site Photo', icon: Camera },
    { id: 'before_after', label: isHi ? 'तुलना स्लाइडर' : 'Before/After Slider', icon: Sliders },
    { id: 'cartels', label: isHi ? 'कार्टेल ग्राफ' : 'Cartel Network', icon: Users },
    { id: 'satellite', label: isHi ? 'उपग्रह रडार' : 'Satellite SAR', icon: Satellite },
    { id: 'transparency', label: isHi ? 'नागरिक पोर्टल' : 'Public Transparency', icon: Globe },
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
          {/* Multilingual Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#0F233D] hover:bg-[#1E3A5F] border border-[#1E3A5F] text-amber-300 font-bold text-[10px] transition-all cursor-pointer"
            title="Toggle Language"
          >
            <Languages className="w-3 h-3 text-amber-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

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
            <span className="hidden sm:inline">{isScanning ? 'Auditing...' : 'Run AI Re-Scan'}</span>
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
