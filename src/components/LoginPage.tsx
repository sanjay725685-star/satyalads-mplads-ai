import React, { useState } from 'react';
import { Shield, Key, UserCheck, Lock, ArrowRight, Award } from 'lucide-react';
import { UserRole, UserSession, Language } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  lang: Language;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, lang }) => {
  const isHi = lang === 'hi';
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
    <div className="min-h-screen bg-[#071326] flex items-center justify-center p-6 text-slate-100 selection:bg-amber-500 selection:text-black">
      <div className="w-full max-w-md bg-[#0F233D] border border-[#1E3A5F] rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-serif tracking-wide">
            SATYALADS <span className="text-amber-400 font-sans font-bold text-lg">LOGIN</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isHi ? "राष्ट्रीय सतर्कता एवं एमपीलैड्स ऑडिट प्राधिकरण" : "National Vigilance & MPLADS Audit Authority Portal"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-slate-400 font-mono mb-2">
              {isHi ? "अपनी प्राधिकृत भूमिका चुनें:" : "Select Authorized Audit Role:"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'auditor', label: isHi ? 'जिला ऑडिटर' : 'Auditor', desc: 'DM Cell' },
                { id: 'nodal_officer', label: isHi ? 'नोडल अधिकारी' : 'Nodal Officer', desc: 'State' },
                { id: 'admin', label: isHi ? 'सीवीसी एडमिन' : 'Admin', desc: 'MoSPI HQ' }
              ].map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id as UserRole)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedRole === r.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-lg shadow-amber-500/10'
                      : 'bg-[#020C1B] border-[#1E3A5F] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-slate-400 font-mono mb-1">
              {isHi ? "अधिकारी यूजरनेम / सर्विस आईडी:" : "Officer Username / Service ID:"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-amber-400"
                required
              />
              <UserCheck className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-400 font-mono mb-1">
              {isHi ? "सुरक्षित टोकन / पासवर्ड:" : "Security Token / Password:"}
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#020C1B] border border-[#1E3A5F] rounded-xl px-3 py-2.5 text-white font-mono outline-none focus:border-amber-400"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm transition-all cursor-pointer font-sans"
          >
            <span>{isLoading ? (isHi ? 'प्रमाणीकरण जारी...' : 'Authenticating...') : (isHi ? 'सिस्टम में प्रवेश करें' : 'Authorize & Enter Portal')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[11px] text-center text-slate-500 font-mono border-t border-[#1E3A5F] pt-4">
          e-Pramaan Single Sign-On (SSO) & JWT Role Authorization Active
        </div>
      </div>
    </div>
  );
};
