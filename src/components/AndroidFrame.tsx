import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, Minimize2, Sparkles, Menu, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeRole,
  onChangeRole,
  onOpenNotifications,
  unreadNotifications,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('07:00');
  const [batteryLevel] = useState<number>(92);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-100/50 text-slate-800 flex flex-col items-center justify-center p-0 sm:p-3 md:p-5 overflow-x-hidden">
      {/* Top Application Header Bar */}
      <header className="w-full max-w-6xl mb-2.5 px-3 hidden sm:flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-slate-800 tracking-tight">MadrasahKu Digital • MTs Al-Ikhlas Kendal</span>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200 shadow-2xs">
            Portal Madrasah Kemenag RI
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Role Switcher Pill */}
          <div className="bg-white p-0.5 rounded-2xl border border-slate-200/90 shadow-xs flex text-[11px]">
            <button
              id="role-btn-santri-top"
              onClick={() => onChangeRole('santri')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'santri'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Santri / Siswa
            </button>
            <button
              id="role-btn-guru-top"
              onClick={() => onChangeRole('guru')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'guru'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Guru / Ustadz
            </button>
            <button
              id="role-btn-wali-top"
              onClick={() => onChangeRole('wali')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'wali'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Wali Murid
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container Frame */}
      <main className="w-full max-w-6xl h-[100vh] sm:h-[90vh] sm:max-h-[920px] sm:rounded-3xl shadow-2xl sm:border sm:border-slate-200/90 bg-slate-50 relative overflow-hidden flex flex-col ring-1 ring-slate-200/60">
        {/* Android Status Bar */}
        <div className="w-full bg-emerald-700 text-white text-xs px-5 pt-2 pb-1.5 flex items-center justify-between select-none z-30 border-b border-emerald-800/30 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">{currentTime}</span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-100">
              <span className="bg-emerald-800/80 px-1.5 py-0.2 rounded font-mono font-bold">5G</span>
              <span className="font-medium">Kemenag-Net</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-white" />
            <Wifi className="w-3.5 h-3.5 text-white" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono font-bold text-white">{batteryLevel}%</span>
              <Battery className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Dynamic App Content Body (Accommodates Left Sidebar + Main Content) */}
        <div className="flex-1 w-full bg-slate-50 overflow-hidden relative flex flex-row">
          {children}
        </div>

        {/* Android Gesture Bar / Navigation Pill at Bottom */}
        <div className="w-full bg-white py-1.5 flex items-center justify-center z-30 select-none border-t border-slate-200/80 shrink-0">
          <div className="w-32 h-1 bg-slate-300 rounded-full hover:bg-emerald-500 transition-colors cursor-pointer" />
        </div>
      </main>

      {/* Bottom helper */}
      <footer className="mt-2 text-center text-[11px] text-slate-500 sm:block hidden font-medium">
        <span>Portal Digital Madrasah Terpadu © 2026 Kementerian Agama RI & Yayasan Al-Ikhlas</span>
      </footer>
    </div>
  );
};

