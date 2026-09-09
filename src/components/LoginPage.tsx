import React, { useState } from 'react';
import { Shield, Key, UserCheck, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole, UserSession, Language } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  lang: Language;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, lang }) => {
  const isHi = lang !== 'en';
  const [selectedRole, setSelectedRole] = useState<UserRole>('auditor');
  const [username, setUsername] = useState('auditor_varanasi');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'auditor') setUsername('auditor_varanasi');
    else if (role === 'nodal_officer') setUsername('nodal_officer_up');
    else if (role === 'admin') setUsername('admin_mospi_vigilance');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = await api.login(username, password, selectedRole);
      onLoginSuccess(session);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#F5F7FA] flex items-center justify-center p-6 text-[#1A1A1A]">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded-md p-8 shadow-sm space-y-6">
        {/* Top Government Seal & Title */}
        <div className="text-center space-y-2 border-b border-slate-200 pb-5">
          <div className="w-14 h-14 mx-auto rounded bg-amber-50 border border-amber-300 p-2 flex flex-col items-center justify-center shadow-xs">
            <span className="text-2xl">🏛️</span>
            <span className="text-[6px] font-serif font-bold text-[#002244] uppercase">सत्यमेव जयते</span>
          </div>
          <h2 className="text-xl font-black text-[#002244] font-serif tracking-wide">
            PARICHAY / MERIPEHCHAAN SSO
          </h2>
          <p className="text-xs text-[#0B3D91] font-semibold">
            {isHi ? 'राष्ट्रीय सतर्कता एवं एमपीलैड्स ऑडिट प्राधिकरण' : 'National Vigilance & MPLADS Audit Authority Portal'}
          </p>
          <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>256-Bit TLS 1.3 Certified Government Gateway</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              {isHi ? 'अपनी प्राधिकृत भूमिका चुनें (Audit Role):' : 'Select Authorized Audit Role:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'auditor', label: isHi ? 'जिला ऑडिटर' : 'Auditor', desc: 'DM Cell' },
                { id: 'nodal_officer', label: isHi ? 'नोडल अधिकारी' : 'Nodal Officer', desc: 'State Gov' },
                { id: 'admin', label: isHi ? 'सीवीसी एडमिन' : 'Admin', desc: 'MoSPI HQ' }
              ].map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id as UserRole)}
                  className={`p-2 rounded border text-center transition-all cursor-pointer ${
                    selectedRole === r.id
                      ? 'bg-[#002244] border-[#002244] text-white font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs">{r.label}</div>
                  <div className={`text-[10px] font-mono ${selectedRole === r.id ? 'text-amber-300' : 'text-slate-500'}`}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {isHi ? 'अधिकारी यूजरनेम / सर्विस आईडी:' : 'Officer Username / Service ID:'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono text-xs outline-none focus:border-[#0B3D91] focus:bg-white"
                required
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {isHi ? 'सुरक्षित टोकन / पासवर्ड:' : 'Security Token / Password:'}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono text-xs outline-none focus:border-[#0B3D91] focus:bg-white"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#0B3D91] hover:bg-[#002244] text-white font-bold rounded flex items-center justify-center gap-2 shadow-sm text-xs transition-all cursor-pointer"
          >
            <span>{isLoading ? (isHi ? 'प्रमाणीकरण जारी...' : 'Authenticating...') : (isHi ? 'सुरक्षित प्रवेश करें' : 'Authorize & Access Portal')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[10px] text-center text-slate-500 font-mono border-t border-slate-200 pt-3">
          Ministry of Statistics & Programme Implementation • Smart India Hackathon 2026
        </div>
      </div>
    </div>
  );
};
