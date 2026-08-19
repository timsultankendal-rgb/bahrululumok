import React, { useState } from 'react';
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  School,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Phone,
  ArrowRight,
  UserCheck,
  Users,
  GraduationCap,
  Crown,
  ChevronRight,
  X
} from 'lucide-react';
import { UserRole, AuthSession, UserAccount } from '../../types';
import { AppBrandingConfig, DEFAULT_BRANDING } from '../modals/AppBrandingModal';
import { 
  authenticateUser, 
  getLocalUserAccounts 
} from '../../services/authService';
import { playTapSound } from '../../utils/audio';

interface LoginPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLoginSuccess: (session: AuthSession) => void;
  branding?: AppBrandingConfig;
  currentRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen = true,
  onClose,
  onLoginSuccess,
  branding = DEFAULT_BRANDING,
  currentRole = 'santri',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleConfigs = [
    {
      id: 'santri' as UserRole,
      label: 'Santri / Murid',
      icon: GraduationCap,
      placeholderUser: 'Masukkan No Induk / NISN (cth: 2024001)',
      hint: 'Gunakan NIS/NISN atau username santri',
      color: 'from-emerald-600 to-teal-700',
      badge: 'Santri Digital',
    },
    {
      id: 'guru' as UserRole,
      label: 'Dewan Asatidz',
      icon: Users,
      placeholderUser: 'Masukkan NIP / NIY (cth: 1985071201)',
      hint: 'Gunakan NIP/NIY atau username ustadz/ustadzah',
      color: 'from-teal-700 to-emerald-800',
      badge: 'Pendidik KBM',
    },
    {
      id: 'wali' as UserRole,
      label: 'Wali Santri',
      icon: UserCheck,
      placeholderUser: 'Masukkan No WhatsApp (cth: 081234567890)',
      hint: 'Gunakan No WA terdaftar atau username wali',
      color: 'from-blue-700 to-indigo-800',
      badge: 'Orang Tua / Wali',
    },
    {
      id: 'admin' as UserRole,
      label: 'Administrator',
      icon: Crown,
      placeholderUser: 'Username Admin (cth: admin)',
      hint: 'Akses penuh TU & Pengaturan Hak Akses',
      color: 'from-rose-700 to-amber-800',
      badge: 'Super Admin TU',
    },
  ];

  const currentRoleConfig = roleConfigs.find((r) => r.id === selectedRole) || roleConfigs[0];

  const handleRoleChange = (role: UserRole) => {
    playTapSound();
    setSelectedRole(role);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!usernameInput.trim()) {
      setErrorMessage('Silakan isi Username, NIS/NIY, atau Nomor WhatsApp.');
      return;
    }
    if (!passwordInput.trim()) {
      setErrorMessage('Silakan isi Password atau PIN akun Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(usernameInput, passwordInput, rememberMe);
      setIsLoading(false);

      if (result.success && result.session) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onLoginSuccess(result.session!);
          if (onClose) onClose();
        }, 600);
      } else {
        setErrorMessage(result.message);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header with Islamic Geometric Gradient */}
        <div className={`bg-gradient-to-br ${currentRoleConfig.color} p-5 sm:p-6 text-white relative`}>
          {/* Close button if optional */}
          {onClose && (
            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer backdrop-blur-xs"
              title="Tutup Halaman Login"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 p-1 flex items-center justify-center backdrop-blur-xs shadow-md overflow-hidden shrink-0">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt="Logo Madrasah"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <School className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md shadow-xs">
                  {branding.portalBadge || branding.kemenagText || 'Portal Madrasah Kemenag RI'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-1">
                {branding.appName || 'MADRASAHKU DIGITAL'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-white/90 font-medium">
            Masuk ke Sistem Terpadu Pembelajaran & Administrasi Madrasah
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pilih Peran Akun Pengguna:
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {roleConfigs.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white border-emerald-600 text-emerald-800 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200/80 text-slate-600'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold leading-tight line-clamp-1">
                    {r.label.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>Username / Identitas</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {currentRoleConfig.hint}
                </span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={currentRoleConfig.placeholderUser}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:outline-emerald-600 focus:bg-white font-medium text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>Password / PIN Masuk</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  PIN standar: <strong className="text-slate-600">123456</strong>
                </span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan Password / PIN 6 digit"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:outline-emerald-600 focus:bg-white font-medium text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
                <span>Ingat Sesi Saya</span>
              </label>

              <a
                href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Admin%20TU,%20saya%20butuh%20bantuan%20reset%20PIN%20login%20Madrasah."
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan TU</span>
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses Otentikasi...</span>
              ) : (
                <>
                  <span>Masuk Sebagai {currentRoleConfig.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Security Note */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Koneksi Aman SSL & Cloud Database</span>
          </div>
          <span className="font-mono text-[10px]">v2.4.0</span>
        </div>
      </div>
    </div>
  );
};
