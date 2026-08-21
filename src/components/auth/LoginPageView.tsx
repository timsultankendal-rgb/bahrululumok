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
  ArrowLeft,
  Layers,
  Info
} from 'lucide-react';
import { UserRole, AuthSession } from '../../types';
import { AppBrandingConfig, DEFAULT_BRANDING } from '../modals/AppBrandingModal';
import { authenticateUser } from '../../services/authService';
import { playTapSound } from '../../utils/audio';

interface LoginPageViewProps {
  onLoginSuccess: (session: AuthSession) => void;
  onNavigateToHome: () => void;
  onNavigateToPortal: () => void;
  branding?: AppBrandingConfig;
  initialRole?: UserRole;
  loginNotice?: string | null;
}

export const LoginPageView: React.FC<LoginPageViewProps> = ({
  onLoginSuccess,
  onNavigateToHome,
  onNavigateToPortal,
  branding = DEFAULT_BRANDING,
  initialRole = 'santri',
  loginNotice,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const roleConfigs = [
    {
      id: 'santri' as UserRole,
      label: 'Santri / Murid',
      icon: GraduationCap,
      placeholderUser: 'Masukkan No Induk / NISN (cth: 2024001)',
      hint: 'Gunakan NIS/NISN atau username santri',
      color: 'from-emerald-700 via-teal-800 to-emerald-950',
      badge: 'Santri Digital',
      desc: 'Akses jadwal KBM, mutaba\'ah ibadah, materi kitab, dan catatan tugas harian.',
    },
    {
      id: 'guru' as UserRole,
      label: 'Dewan Asatidz',
      icon: Users,
      placeholderUser: 'Masukkan NIP / NIY (cth: 1985071201)',
      hint: 'Gunakan NIP/NIY atau username ustadz/ustadzah',
      color: 'from-teal-800 via-emerald-900 to-slate-900',
      badge: 'Pendidik KBM',
      desc: 'Input presensi kelas harian, penilaian buku raport cawu, dan jurnal mengajar.',
    },
    {
      id: 'wali' as UserRole,
      label: 'Wali Santri',
      icon: UserCheck,
      placeholderUser: 'Masukkan No WhatsApp (cth: 081234567890)',
      hint: 'Gunakan No WA terdaftar atau username wali',
      color: 'from-blue-800 via-indigo-900 to-slate-900',
      badge: 'Orang Tua / Wali',
      desc: 'Pantau kehadiran putra-putri, capaian hafalan tahfidz, dan kartu Syahriyah & ADM.',
    },
    {
      id: 'admin' as UserRole,
      label: 'Administrator',
      icon: Crown,
      placeholderUser: 'Username Admin (cth: admin)',
      hint: 'Akses penuh TU & Pengaturan Hak Akses',
      color: 'from-rose-800 via-amber-900 to-slate-900',
      badge: 'Super Admin TU',
      desc: 'Kelola master data santri & asatidz, branding aplikasi, dan matriks hak akses.',
    },
  ];

  // Sync when initialRole changes
  React.useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

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
      const result = authenticateUser(usernameInput, passwordInput, rememberMe, selectedRole);
      setIsLoading(false);

      if (result.success && result.session) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onLoginSuccess(result.session!);
        }, 600);
      } else {
        setErrorMessage(result.message);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Islamic Ornaments */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* ========================================================================= */}
      {/* TOP BAR / NAVIGATION */}
      {/* ========================================================================= */}
      <header className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between gap-3 relative z-10">
        <button
          onClick={() => {
            playTapSound();
            onNavigateToHome();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-300" />
          <span>Kembali ke Website Utama</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] text-teal-200/80 font-mono bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            https://bahrululumok.vercel.app/login
          </span>
          <button
            onClick={() => {
              playTapSound();
              setErrorMessage('Silakan isi formulir login di bawah untuk masuk ke akun Anda.');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-400/90 hover:bg-amber-400 text-emerald-950 text-xs font-black transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            title="Akses Dashboard Memerlukan Login"
          >
            <Lock className="w-4 h-4 text-emerald-950" />
            <span className="hidden sm:inline">Akses Terkunci (Perlu Login)</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN LOGIN CARD */}
      {/* ========================================================================= */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
          {/* Header Card */}
          <div className={`bg-gradient-to-r ${currentRoleConfig.color} p-6 text-white relative`}>
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-white/20 border border-white/30 p-1 flex items-center justify-center backdrop-blur-xs shadow-md overflow-hidden shrink-0">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt="Logo Madrasah"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <School className="w-7 h-7 text-amber-300" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md shadow-xs">
                  {branding.institutionName || branding.appName || 'MDTW BAHRUL ULUM'}
                </span>
                <h1 className="text-base sm:text-lg font-black text-white leading-tight mt-1">
                  Portal Login Sistem Digital
                </h1>
                <p className="text-[11px] text-teal-100/90 font-medium">
                  {currentRoleConfig.badge} • Terkoneksi Cloud Firestore
                </p>
              </div>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Peran Akun untuk Masuk:
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
                        : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-600'
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

          {/* Form Content */}
          <div className="p-6 space-y-4">
            {/* Required Login Notice */}
            {loginNotice && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in">
                <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1 font-bold leading-relaxed">
                  {loginNotice}
                </div>
              </div>
            )}

            {/* Role Context Hint */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Akses {currentRoleConfig.label}:</strong> {currentRoleConfig.desc}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-bold">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                  <span>Username / Nomor Identitas</span>
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
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:outline-emerald-600 focus:bg-white font-medium text-slate-800 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                  <span>Password / PIN Akun</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Masukkan password akun Anda
                  </span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password atau PIN"
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:outline-emerald-600 focus:bg-white font-medium text-slate-800 transition-all"
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span>Ingat Sesi Login</span>
                </label>

                <a
                  href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Admin%20TU,%20saya%20butuh%20bantuan%20reset%20password%20akun%20Madrasah."
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Bantuan TU</span>
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memproses Otentikasi...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>Masuk ke Akun {currentRoleConfig.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="p-4 text-center text-xs text-teal-200/70 relative z-10">
        <p>© {new Date().getFullYear()} {branding.institutionName || branding.appName || 'MDTW Bahrul Ulum'}. Sistem Informasi Digital Terpadu.</p>
      </footer>
    </div>
  );
};
