import React from 'react';
import { Bell, Search, ShieldCheck, QrCode, Menu, LogIn, LogOut, ShieldAlert, KeyRound } from 'lucide-react';
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
  onOpenLogin?: () => void;
  onOpenHakAkses?: () => void;
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
  currentUser,
}) => {
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

  const handleCycleRole = () => {
    if (!onChangeRole) return;
    playTapSound();
    const roles: UserRole[] = ['santri', 'guru', 'wali', 'admin'];
    const nextIdx = (roles.indexOf(activeRole) + 1) % roles.length;
    onChangeRole(roles[nextIdx]);
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 backdrop-blur-md text-white px-3 sm:px-4 py-2.5 sm:py-3 border-b border-emerald-500/40 shadow-md">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Menu Toggle + User Info & Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Menu Drawer Toggle Button */}
          <button
            id="btn-toggle-left-menu"
            onClick={() => {
              playTapSound();
              if (onToggleSidebar) onToggleSidebar();
            }}
            className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all shadow-xs cursor-pointer shrink-0"
            title="Buka Menu Sisi Kiri"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="avatar-profile-btn"
            onClick={onOpenIdCard}
            className="relative group focus:outline-none shrink-0 cursor-pointer"
            title="Lihat Kartu Identitas Digital"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl ring-2 ring-white/80 overflow-hidden bg-emerald-700 p-0.5 transition-transform group-hover:scale-105 shadow-xs">
              <img
                src={currentPhoto}
                alt={currentName}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-md p-0.5 border border-emerald-900 text-[10px] shadow-xs">
              <QrCode className="w-2.5 h-2.5 text-emerald-950" />
            </div>
          </button>

          <div className="flex flex-col text-left min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white truncate max-w-[120px] sm:max-w-[200px]">
                {currentName}
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-emerald-100 flex-wrap">
              <span className="truncate max-w-[90px] sm:max-w-[140px] font-medium">{currentSubtitle}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-200 shrink-0" />
              <button
                type="button"
                onClick={handleCycleRole}
                title="Klik untuk Beralih Peran Akun (Santri/Guru/Wali/Admin)"
                className="font-extrabold text-emerald-950 capitalize text-[8px] sm:text-[10px] bg-amber-300 hover:bg-amber-200 active:scale-95 transition-all px-1.5 py-0.2 rounded shadow-xs cursor-pointer flex items-center gap-0.5 shrink-0"
              >
                <span>{activeRole}</span>
                <span className="text-[8px] opacity-70">⇄</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Hak Akses Button (Super Admin / Kepala) */}
          {activeRole === 'admin' && onOpenHakAkses && (
            <button
              onClick={() => {
                playTapSound();
                onOpenHakAkses();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-[10px] sm:text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              title="Pengaturan Hak Akses Login"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Hak Akses</span>
            </button>
          )}

          {/* Login / Switch Account Button */}
          {onOpenLogin && (
            <button
              onClick={() => {
                playTapSound();
                onOpenLogin();
              }}
              className="w-8 h-8 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 shadow-xs cursor-pointer"
              title="Masuk / Ganti Akun Login"
            >
              <LogIn className="w-4 h-4 text-emerald-200" />
            </button>
          )}

          <button
            id="btn-scan-qr"
            onClick={onOpenIdCard}
            className="w-8 h-8 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 shadow-xs cursor-pointer"
            title="Kartu Santri / QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            id="btn-notifications"
            onClick={onOpenNotifications}
            className="relative w-8 h-8 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors border border-white/20 shadow-xs cursor-pointer"
            title="Pemberitahuan Madrasah"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce shadow-md">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};


