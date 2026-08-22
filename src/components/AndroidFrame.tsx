import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Menu, 
  ShieldCheck, 
  Edit3 
} from 'lucide-react';
import { UserRole } from '../types';
import { AppBrandingConfig, DEFAULT_BRANDING } from './modals/AppBrandingModal';
import { playTapSound } from '../utils/audio';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenNotifications: () => void;
  unreadNotifications: number;
  branding?: AppBrandingConfig;
  onOpenBrandingSettings?: () => void;
  onOpenLogin?: (role?: UserRole) => void;
}

export type DeviceViewMode = 'mobile' | 'tablet' | 'desktop' | 'full';

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeRole,
  onChangeRole,
  onOpenNotifications,
  unreadNotifications,
  branding = DEFAULT_BRANDING,
  onOpenBrandingSettings,
  onOpenLogin,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('07:00');
  const [batteryLevel] = useState<number>(92);
  const [deviceViewMode, setDeviceViewMode] = useState<DeviceViewMode>(() => {
    try {
      const saved = localStorage.getItem('madrasah_device_view_mode');
      if (saved && ['mobile', 'tablet', 'desktop', 'full'].includes(saved)) {
        return saved as DeviceViewMode;
      }
    } catch {
      // fallback
    }
    return 'desktop';
  });

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

  const handleSelectViewMode = (mode: DeviceViewMode) => {
    playTapSound();
    setDeviceViewMode(mode);
    try {
      localStorage.setItem('madrasah_device_view_mode', mode);
    } catch {
      // ignore
    }
  };

  // Compute container dimensions based on selected device view mode
  const getContainerClasses = () => {
    switch (deviceViewMode) {
      case 'mobile':
        return 'w-full max-w-[430px] h-[100dvh] sm:h-[90vh] sm:max-h-[890px] sm:rounded-3xl shadow-2xl sm:border sm:border-slate-200/90';
      case 'tablet':
        return 'w-full max-w-3xl h-[100dvh] sm:h-[92vh] sm:max-h-[920px] sm:rounded-3xl shadow-2xl sm:border sm:border-slate-200/90';
      case 'full':
        return 'w-full max-w-full h-[100dvh] sm:h-screen rounded-none sm:rounded-none shadow-none border-none';
      case 'desktop':
      default:
        return 'w-full max-w-6xl h-[100dvh] sm:h-[92vh] sm:max-h-[940px] sm:rounded-3xl shadow-2xl sm:border sm:border-slate-200/90';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-100/50 text-slate-800 flex flex-col items-center justify-center ${
      deviceViewMode === 'full' ? 'p-0' : 'p-0 sm:p-2 md:p-4'
    } overflow-x-hidden transition-all duration-300`}>
      {/* Top Application Header Bar (Visible on Tablet & PC) */}
      <header className={`w-full ${
        deviceViewMode === 'full' ? 'max-w-full px-4 pt-2' : 'max-w-6xl px-3'
      } mb-2 hidden sm:flex items-center justify-between text-xs text-slate-600 gap-3`}>
        {/* Left Branding */}
        <div 
          onClick={() => {
            if (onOpenBrandingSettings) {
              playTapSound();
              onOpenBrandingSettings();
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90 transition-opacity min-w-0"
          title="Klik untuk Mengedit Logo, Nama Aplikasi & Portal Kemenag RI"
        >
          <div className="w-7 h-7 rounded-xl bg-white border border-emerald-300/60 shadow-2xs overflow-hidden flex items-center justify-center p-0.5 shrink-0 group-hover:scale-105 transition-transform">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.appName}
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <span className="font-extrabold text-slate-800 tracking-tight flex items-center gap-1 truncate">
            <span>{branding.appName} {branding.appBadge}</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-800 truncate">{branding.institutionName}</span>
          </span>
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200 shadow-2xs group-hover:bg-emerald-200 transition-colors flex items-center gap-1 shrink-0 hidden md:flex">
            <span>{branding.portalBadge || 'Portal Madrasah Kemenag RI'}</span>
            <Edit3 className="w-2.5 h-2.5 opacity-60" />
          </span>
        </div>

        {/* Right Controls: Device Mode Presets + Role Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Device Screen Switcher (HP / Tablet / Desktop / Full) */}
          <div className="bg-white p-0.5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center text-[11px]">
            <button
              id="view-mode-mobile"
              onClick={() => handleSelectViewMode('mobile')}
              className={`px-2 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceViewMode === 'mobile'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Mode HP (Smartphone)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">HP</span>
            </button>
            <button
              id="view-mode-tablet"
              onClick={() => handleSelectViewMode('tablet')}
              className={`px-2 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceViewMode === 'tablet'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Mode Tablet / iPad"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Tablet</span>
            </button>
            <button
              id="view-mode-desktop"
              onClick={() => handleSelectViewMode('desktop')}
              className={`px-2 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceViewMode === 'desktop'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Mode Desktop PC"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">PC</span>
            </button>
            <button
              id="view-mode-full"
              onClick={() => handleSelectViewMode('full')}
              className={`px-2 py-1 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                deviceViewMode === 'full'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Layar Penuh (100% Widescreen)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Penuh</span>
            </button>
          </div>

          {/* Quick Role Switcher Pill */}
          <div className="bg-white p-0.5 rounded-2xl border border-slate-200/90 shadow-xs flex text-[11px]">
            <button
              id="role-btn-santri-top"
              onClick={() => {
                playTapSound();
                if (activeRole !== 'santri' && onOpenLogin) {
                  onOpenLogin('santri');
                }
              }}
              title={activeRole === 'santri' ? 'Peran aktif: Santri' : 'Login sebagai Santri'}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'santri'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Santri
            </button>
            <button
              id="role-btn-guru-top"
              onClick={() => {
                playTapSound();
                if (activeRole !== 'guru' && onOpenLogin) {
                  onOpenLogin('guru');
                }
              }}
              title={activeRole === 'guru' ? 'Peran aktif: Guru' : 'Login sebagai Guru'}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'guru'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Guru
            </button>
            <button
              id="role-btn-wali-top"
              onClick={() => {
                playTapSound();
                if (activeRole !== 'wali' && onOpenLogin) {
                  onOpenLogin('wali');
                }
              }}
              title={activeRole === 'wali' ? 'Peran aktif: Wali' : 'Login sebagai Wali'}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'wali'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Wali
            </button>
            <button
              id="role-btn-admin-top"
              onClick={() => {
                playTapSound();
                if (activeRole !== 'admin' && onOpenLogin) {
                  onOpenLogin('admin');
                }
              }}
              title={activeRole === 'admin' ? 'Peran aktif: Admin' : 'Login sebagai Admin'}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main App Container Frame */}
      <main className={`${getContainerClasses()} bg-slate-50 relative overflow-hidden flex flex-col ring-1 ring-slate-200/60 transition-all duration-300`}>
        {/* Android Status Bar */}
        <div className="w-full bg-emerald-700 text-white text-xs px-3 sm:px-5 pt-1.5 sm:pt-2 pb-1 sm:pb-1.5 flex items-center justify-between select-none z-30 border-b border-emerald-800/30 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-bold text-white tracking-tight">{currentTime}</span>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-100">
              <span className="bg-emerald-800/80 px-1.5 py-0.2 rounded font-mono font-bold">5G</span>
              <span className="font-medium">Kemenag-Net</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Signal className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
            <Wifi className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white">{batteryLevel}%</span>
              <Battery className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Dynamic App Content Body (Accommodates Left Sidebar + Main Content) */}
        <div className="flex-1 w-full bg-slate-50 overflow-hidden relative flex flex-row min-h-0">
          {children}
        </div>

        {/* Android Gesture Bar / Navigation Pill at Bottom */}
        <div className="w-full bg-white py-1 sm:py-1.5 flex items-center justify-center z-30 select-none border-t border-slate-200/80 shrink-0">
          <div className="w-24 sm:w-32 h-1 bg-slate-300 rounded-full hover:bg-emerald-500 transition-colors cursor-pointer" />
        </div>
      </main>

      {/* Bottom helper info */}
      {deviceViewMode !== 'full' && (
        <footer className="mt-2 text-center text-[11px] text-slate-500 sm:block hidden font-medium">
          <span>Portal Digital Bahrululumku © 2026 MDT Ula NU 09 Bahrul Ulum Kendal</span>
        </footer>
      )}
    </div>
  );
};


