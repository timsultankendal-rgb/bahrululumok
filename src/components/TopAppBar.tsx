import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ShieldCheck,
  QrCode,
  Menu,
  LogIn,
  LogOut,
  KeyRound,
  Globe,
  Smartphone,
  MoreVertical,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { StudentProfile, TeacherProfile, UserRole, UserAccount } from '../types';
import { playTapSound } from '../utils/audio';

interface TopAppBarProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenIdCard: () => void;
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  onChangeRole?: (role: UserRole) => void;
  onOpenLogin?: (role?: UserRole) => void;
  onOpenHakAkses?: () => void;
  onNavigateToHome?: () => void;
  onOpenInstallAndroid?: () => void;
  onLogout?: () => void;
  currentUser?: UserAccount | null;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  student,
  teacher,
  activeRole,
  unreadCount,
  onOpenNotifications,
  onOpenIdCard,
  onToggleSidebar,
  onChangeRole,
  onOpenLogin,
  onOpenHakAkses,
  onNavigateToHome,
  onOpenInstallAndroid,
  onLogout,
  currentUser,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentName = currentUser?.fullName || (activeRole === 'guru' ? teacher.name : activeRole === 'admin' ? 'Administrator Madrasah' : student.name);
  const currentPhoto = currentUser?.avatarUrl || (activeRole === 'guru' ? teacher.photoUrl : student.photoUrl);
  const currentSubtitle =
    currentUser?.subTitle ||
    (activeRole === 'guru'
      ? teacher.title
      : activeRole === 'wali'
      ? `Wali dari ${student.name.split(' ')[0]}`
      : activeRole === 'admin'
      ? 'Super Admin / TU'
      : student.level);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleCycleRole = () => {
    if (!onChangeRole) return;
    playTapSound();
    const roles: UserRole[] = ['santri', 'guru', 'wali', 'admin'];
    const nextIdx = (roles.indexOf(activeRole) + 1) % roles.length;
    onChangeRole(roles[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 backdrop-blur-md text-white px-2.5 sm:px-4 py-2 sm:py-2.5 border-b border-emerald-500/40 shadow-md">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Menu Toggle + User Info & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Menu Drawer Toggle Button */}
          <button
            id="btn-toggle-left-menu"
            onClick={() => {
              playTapSound();
              if (onToggleSidebar) onToggleSidebar();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white border border-white/20 transition-all shadow-xs cursor-pointer shrink-0"
            title="Buka 18 Menu Madrasah"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* User Avatar with Quick ID Card Click */}
          <button
            id="avatar-profile-btn"
            onClick={() => {
              playTapSound();
              onOpenIdCard();
            }}
            className="relative group focus:outline-none shrink-0 cursor-pointer"
            title="Lihat Kartu Identitas Digital / QR"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ring-2 ring-white/80 overflow-hidden bg-emerald-800 p-0.5 transition-transform group-hover:scale-105 shadow-xs">
              <img
                src={currentPhoto}
                alt={currentName}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-md p-0.5 border border-emerald-950 text-[10px] shadow-xs">
              <QrCode className="w-2.5 h-2.5 text-emerald-950" />
            </div>
          </button>

          {/* User Identity Info */}
          <div className="flex flex-col text-left min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white truncate max-w-[110px] sm:max-w-[220px]">
                {currentName}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-emerald-100 flex-wrap">
              <span className="truncate max-w-[85px] sm:max-w-[140px] font-medium opacity-90">{currentSubtitle}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-300 shrink-0" />
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  if (onOpenLogin) {
                    onOpenLogin();
                  }
                }}
                title="Ganti Akun / Login Peran Lain"
                className="font-extrabold text-emerald-950 capitalize text-[8px] sm:text-[10px] bg-amber-300 hover:bg-amber-200 active:scale-95 transition-all px-1.5 py-0.2 rounded shadow-2xs cursor-pointer flex items-center gap-0.5 shrink-0"
              >
                <span>{activeRole}</span>
                <span className="text-[8px] opacity-70">🔑</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons - Ringkas & Responsif */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* DESKTOP/TABLET ONLY (Hidden on Mobile) */}
          <div className="hidden sm:flex items-center gap-1.5">
            {/* Install Android */}
            {onOpenInstallAndroid && (
              <button
                onClick={() => {
                  playTapSound();
                  onOpenInstallAndroid();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer animate-pulse hover:animate-none"
                title="Pasang Aplikasi Android"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install APK</span>
              </button>
            )}

            {/* Website Utama */}
            {onNavigateToHome && (
              <button
                onClick={() => {
                  playTapSound();
                  onNavigateToHome();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer border border-white/20"
                title="Kembali ke Website Utama"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>Website</span>
              </button>
            )}

            {/* Hak Akses Button (Admin) */}
            {activeRole === 'admin' && onOpenHakAkses && (
              <button
                onClick={() => {
                  playTapSound();
                  onOpenHakAkses();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                title="Pengaturan Hak Akses"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Hak Akses</span>
              </button>
            )}

            {/* Login / Ganti Akun */}
            {onOpenLogin && (
              <button
                onClick={() => {
                  playTapSound();
                  onOpenLogin();
                }}
                className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 shadow-xs cursor-pointer"
                title="Ganti Akun / Login"
              >
                <LogIn className="w-4 h-4 text-emerald-200" />
              </button>
            )}

            {/* Logout */}
            {onLogout && (
              <button
                onClick={() => {
                  playTapSound();
                  onLogout();
                }}
                className="px-2 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer border border-rose-400/30"
                title="Keluar / Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Keluar</span>
              </button>
            )}
          </div>

          {/* PRIMARY: Tombol Notifikasi (Tampil di HP & Desktop) */}
          <button
            id="btn-notifications"
            onClick={() => {
              playTapSound();
              onOpenNotifications();
            }}
            className="relative p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all border border-white/20 shadow-xs cursor-pointer"
            title="Pemberitahuan Madrasah"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-bounce shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* RINGKASAN MENU OPSI UNTUK HP (Mobile More Action Button & Dropdown) */}
          <div className="relative sm:hidden" ref={menuRef}>
            <button
              id="btn-mobile-more-menu"
              onClick={() => {
                playTapSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`p-2 rounded-xl text-white flex items-center justify-center transition-all border shadow-xs cursor-pointer active:scale-95 ${
                isMobileMenuOpen
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-300/40'
                  : 'bg-white/15 hover:bg-white/25 border-white/20'
              }`}
              title="Menu Cepat Lainnya"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header Menu Ringkas */}
                <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Aksi Cepat Madrasah</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {/* Pasang Aplikasi Android */}
                  {onOpenInstallAndroid && (
                    <button
                      onClick={() => {
                        playTapSound();
                        setIsMobileMenuOpen(false);
                        onOpenInstallAndroid();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-emerald-950 text-xs font-bold flex items-center justify-between transition-colors text-left cursor-pointer border border-amber-200/80"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center">
                          <Smartphone className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight">Install Aplikasi HP</p>
                          <p className="text-[10px] text-amber-800 font-normal">Unduh APK / Pasang PWA</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-700" />
                    </button>
                  )}

                  {/* Website Utama */}
                  {onNavigateToHome && (
                    <button
                      onClick={() => {
                        playTapSound();
                        setIsMobileMenuOpen(false);
                        onNavigateToHome();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Website Publik</p>
                          <p className="text-[10px] text-slate-500 font-normal">Halaman Beranda Madrasah</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Kartu Santri & QR */}
                  <button
                    onClick={() => {
                      playTapSound();
                      setIsMobileMenuOpen(false);
                      onOpenIdCard();
                    }}
                    className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
                        <QrCode className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">Kartu ID & QR Code</p>
                        <p className="text-[10px] text-slate-500 font-normal">Kartu Identitas Digital Santri</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Hak Akses (Jika Admin) */}
                  {activeRole === 'admin' && onOpenHakAkses && (
                    <button
                      onClick={() => {
                        playTapSound();
                        setIsMobileMenuOpen(false);
                        onOpenHakAkses();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
                          <KeyRound className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Pengaturan Hak Akses</p>
                          <p className="text-[10px] text-slate-500 font-normal">Manajemen Akun & Role</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Ganti Akun / Login */}
                  {onOpenLogin && (
                    <button
                      onClick={() => {
                        playTapSound();
                        setIsMobileMenuOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-between transition-colors text-left cursor-pointer border-t border-slate-100 mt-1 pt-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                          <LogIn className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">Ganti Akun</p>
                          <p className="text-[10px] text-slate-500 font-normal">Masuk akun lain</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* Logout */}
                  {onLogout && (
                    <button
                      onClick={() => {
                        playTapSound();
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-between transition-colors text-left cursor-pointer border border-rose-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-rose-200/60 text-rose-800 flex items-center justify-center">
                          <LogOut className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-black text-rose-800 leading-tight">Keluar Aplikasi</p>
                          <p className="text-[10px] text-rose-600 font-normal">Logout dari sesi saat ini</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-400" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



