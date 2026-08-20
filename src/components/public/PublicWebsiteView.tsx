import React, { useState, useEffect } from 'react';
import {
  School,
  Sparkles,
  BookOpen,
  Users,
  Award,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
  FileText,
  ChevronRight,
  ExternalLink,
  LogIn,
  LogOut,
  Lock,
  Layers,
  Star,
  Copy,
  Check,
  Building,
  DollarSign,
  Camera,
  Compass,
  Bookmark,
  Bell,
  MessageCircle,
  HelpCircle,
  Menu as MenuIcon,
  X,
  Volume2,
  Quote,
  User,
  Smartphone
} from 'lucide-react';
import { AppBrandingConfig, DEFAULT_BRANDING } from '../modals/AppBrandingModal';
import { SambutanKepalaConfig, DEFAULT_SAMBUTAN_CONFIG } from '../modals/EditSambutanModal';
import { VISI_MISI_DATA, PRESTASI_LIST, FASILITAS_LIST, EKSTRAKURIKULER_LIST, JADWAL_TAHUNAN_LIST } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';
import { UserRole } from '../../types';

interface PublicWebsiteViewProps {
  onNavigateToLogin: (initialRole?: UserRole, targetTab?: string, notice?: string) => void;
  onNavigateToPortal: (menuId?: string, roleHint?: UserRole) => void;
  branding?: AppBrandingConfig;
  sambutanConfig?: SambutanKepalaConfig;
  onOpenInstallAndroid?: () => void;
  isLoggedIn?: boolean;
  userRole?: UserRole;
  userName?: string;
  onLogout?: () => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  onNavigateToLogin,
  onNavigateToPortal,
  branding = DEFAULT_BRANDING,
  sambutanConfig = DEFAULT_SAMBUTAN_CONFIG,
  onOpenInstallAndroid,
  isLoggedIn = false,
  userRole,
  userName,
  onLogout,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [copiedRekening, setCopiedRekening] = useState<string | null>(null);
  const [currentDateString, setCurrentDateString] = useState<string>('');

  const madrasahName = branding.institutionName || branding.appName || 'Madrasah Diniyah Takmiliyah';

  useEffect(() => {
    const d = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDateString(d.toLocaleDateString('id-ID', options));
  }, []);

  const handleCopy = (text: string, id: string) => {
    playTapSound();
    navigator.clipboard.writeText(text);
    setCopiedRekening(id);
    setTimeout(() => setCopiedRekening(null), 2500);
  };

  // 18 Modul Sistem List for Interactive Grid
  const modules18 = [
    { id: '1_daftar_hadir', num: '01', title: 'Daftar Hadir (Presensi)', desc: 'Presensi harian santri & asatidz terhubung Cloud realtime', icon: Calendar, color: 'bg-emerald-500 text-white' },
    { id: '2_biodata', num: '02', title: 'Biodata Santri & Asatidz', desc: 'Arsip data induk kependidikan, wali, dan riwayat santri', icon: Users, color: 'bg-teal-500 text-white' },
    { id: '3_kopas', num: '03', title: 'KOPAS & Tabungan', desc: 'Koperasi madrasah, seragam, kitab, dan tabungan santri', icon: DollarSign, color: 'bg-amber-500 text-white' },
    { id: '4_dokumentasi', num: '04', title: 'Dokumentasi KBM', desc: 'Galeri foto & video kegiatan pembelajaran harian', icon: Camera, color: 'bg-indigo-500 text-white' },
    { id: '5_raport', num: '05', title: 'Buku Raport Santri', desc: 'Evaluasi 11 mapel diniyah cawu, peringkat & catatan wali kelas', icon: BookOpen, color: 'bg-blue-500 text-white' },
    { id: '6_jadwal_seragam_mapel', num: '06', title: 'Jadwal & Seragam', desc: 'Jadwal pelajaran harian, kitab rujukan & kode seragam santri', icon: Layers, color: 'bg-purple-500 text-white' },
    { id: '7_profile_madrasah', num: '07', title: 'Profil Lembaga', desc: 'Struktur kepengurusan, izin operasional Kemenag & sejarah', icon: School, color: 'bg-emerald-600 text-white' },
    { id: '8_catatan_kegiatan', num: '08', title: 'Catatan KBM Harian', desc: 'Jurnal harian asatidz, materi bahasan kitab & evaluasi santri', icon: FileText, color: 'bg-cyan-600 text-white' },
    { id: '9_visi_misi', num: '09', title: 'Visi, Misi & Tujuan', desc: 'Arah haluan kurikulum Ahlussunnah Wal Jama\'ah An-Nahdliyyah', icon: Compass, color: 'bg-emerald-700 text-white' },
    { id: '10_mutakhorijin', num: '10', title: 'Data Mutakhorijin', desc: 'Direktori alumni, nomor ijazah & jejak studi lanjut pesantren', icon: GraduationCap, color: 'bg-rose-500 text-white' },
    { id: '11_syahriyah', num: '11', title: 'Syahriyah & ADM', desc: 'Kartu iuran bulanan cawu, status lunas & kuitansi resmi', icon: DollarSign, color: 'bg-emerald-500 text-white' },
    { id: '12_jadwal_tahunan', num: '12', title: 'Kalender Tahunan', desc: 'Agenda Haflah Akhirussanah, Imtihan, PHBI & Ziarah', icon: Calendar, color: 'bg-amber-600 text-white' },
    { id: '13_tata_tertib', num: '13', title: 'Tata Tertib Madrasah', desc: 'Kedisiplinan santri, kode etik asatidz & pedoman adab santri', icon: ShieldCheck, color: 'bg-red-500 text-white' },
    { id: '14_syarat_pendaftaran', num: '14', title: 'PPDB Santri Baru', desc: 'Persyaratan masuk, alur pendaftaran santri baru tahun ajaran 2026/2027', icon: HeartHandshake, color: 'bg-emerald-500 text-white' },
    { id: '15_fasilitas', num: '15', title: 'Fasilitas & Sarpras', desc: 'Gedung representatif, lab komputer, perpustakaan & asrama', icon: Building, color: 'bg-teal-600 text-white' },
    { id: '16_ekstrakurikuler', num: '16', title: 'Ekstrakurikuler', desc: 'Rebana Hadroh, Khitobah 3 Bahasa, Qiroah & Kaligrafi', icon: Sparkles, color: 'bg-violet-600 text-white' },
    { id: '17_prestasi', num: '17', title: 'Prestasi Santri', desc: 'Juara MQK Jawa Tengah, MTQ, Pidato & Festival Seni Santri', icon: Award, color: 'bg-amber-500 text-white' },
    { id: '18_kontak_rekening', num: '18', title: 'Kontak & Rekening', desc: 'Layanan WhatsApp Center & Rekening Infaq Donasi Madrasah', icon: Phone, color: 'bg-emerald-800 text-white' },
  ];

  // Program Unggulan
  const programUnggulan = [
    {
      title: 'Kajian Kitab Kuning Salafiyah',
      desc: 'Mengkaji kitab-kitab muktabarah dengan makna Pegon Jawa/Indonesia: Fiqih Fathul Qorib, Safinatun Najah, Nahwu Jurumiyah, Imrithi, dan Ta\'limul Muta\'allim.',
      badge: 'Kurikulum Salaf'
    },
    {
      title: 'Tahfidz & Tahsin Al-Qur\'an',
      desc: 'Bimbingan tartil Al-Qur\'an dengan kaidah tajwid makharijul huruf yang fasih, disertai target hafalan Juz 30 (Juz \'Amma) dan surat-surat pilihan.',
      badge: 'Target Juz \'Amma'
    },
    {
      title: 'Amaliyah Ahlussunnah Wal Jama\'ah',
      desc: 'Pembiasaan ibadah praktis sehari-hari: Sholat Fardhu Berjamaah, Istighotsah, Tahlil, Rotib Al-Haddad, Diba\'iyyah, dan Sholawat Nabi SAW.',
      badge: 'Tradisi Pesantren'
    },
    {
      title: 'Muhadharah & Khitobah 3 Bahasa',
      desc: 'Latihan dakwah dan pidato santri dalam 3 bahasa (Arab, Inggris, Indonesia) untuk melatih keberanian, kepemimpinan, dan retorika berdakwah.',
      badge: 'Kader Da\'i'
    },
    {
      title: 'Sistem Informasi Digital Terpadu',
      desc: 'Pelaporan absensi harian, nilai raport santri, dan administrasi syahriyah yang dapat dipantau oleh wali santri secara transparan dan akurat.',
      badge: 'Digital Madrasah'
    },
    {
      title: 'Seni Rebana & Kaligrafi Islam',
      desc: 'Pengembangan bakat seni islami santri dalam melantunkan qasidah shalawat rebana hadroh kontemporer serta seni menulis khat indah Al-Qur\'an.',
      badge: 'Seni Islami'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* ========================================================================= */}
      {/* TOP NOTIFICATION TICKER */}
      {/* ========================================================================= */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase shrink-0">
            Resmi
          </span>
          <span className="truncate font-medium text-[11px] sm:text-xs">
            Selamat Datang di Portal Resmi {madrasahName} • PPDB Santri Baru Tahun Ajaran 2026/2027 Telah Dibuka!
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-emerald-300 font-medium shrink-0 ml-auto">
          <span className="hidden sm:inline">📅 {currentDateString}</span>
          <span>•</span>
          <a 
            href="https://wa.me/6281234567890" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-amber-300 transition-colors flex items-center gap-1 font-bold"
          >
            <Phone className="w-3 h-3" />
            <span>WA: 0812-3456-7890</span>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STICKY MAIN NAVBAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Madrasah Name */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={madrasahName}
                className="w-12 h-12 object-contain rounded-2xl p-1 bg-emerald-50 border border-emerald-200 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                <School className="w-6 h-6 text-amber-300" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base sm:text-lg text-emerald-950 tracking-tight leading-tight line-clamp-1">
                  {madrasahName}
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
                {branding.appSubtitle || 'Pendidikan Diniyah Takmiliyah Wustho Berakhlakul Karimah'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#beranda" className="hover:text-emerald-700 transition-colors">Beranda</a>
            <a href="#profil" className="hover:text-emerald-700 transition-colors">Profil & Visi</a>
            <a href="#modul-sistem" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
              <span>18 Modul Sistem</span>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-black">Lengkap</span>
            </a>
            <a href="#program" className="hover:text-emerald-700 transition-colors">Program Unggulan</a>
            <a href="#prestasi" className="hover:text-emerald-700 transition-colors">Prestasi</a>
            <a href="#fasilitas" className="hover:text-emerald-700 transition-colors">Fasilitas</a>
            <a href="#kontak" className="hover:text-emerald-700 transition-colors">Kontak & Rekening</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenInstallAndroid && (
              <button
                onClick={() => {
                  playTapSound();
                  onOpenInstallAndroid();
                }}
                className="px-3 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                title="Pasang / Install Aplikasi ke HP Android"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install di Android</span>
              </button>
            )}

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    playTapSound();
                    onNavigateToPortal();
                  }}
                  className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  title="Buka Dashboard Portal Aktif"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <Layers className="w-4 h-4 text-amber-300" />
                  <span>Buka Dashboard ({userRole || 'Aktif'})</span>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      playTapSound();
                      onLogout();
                    }}
                    className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Keluar / Logout Akun"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Tombol Masuk Portal (18 Menu) */}
                <button
                  onClick={() => {
                    playTapSound();
                    onNavigateToPortal();
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
                  title="Akses Portal (Memerlukan Login)"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Buka Portal (18 Menu)</span>
                </button>

                {/* Tombol Login */}
                <button
                  id="btn-nav-login"
                  onClick={() => {
                    playTapSound();
                    onNavigateToLogin();
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>Masuk Login</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => {
                playTapSound();
                if (isLoggedIn) {
                  onNavigateToPortal();
                } else {
                  onNavigateToLogin();
                }
              }}
              className="p-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              {isLoggedIn ? <Layers className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isLoggedIn ? 'Dashboard' : 'Login'}</span>
            </button>
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 text-slate-600 hover:text-emerald-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileNavOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-xl">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              <button
                onClick={() => {
                  playTapSound();
                  setIsMobileNavOpen(false);
                  onNavigateToLogin();
                }}
                className="w-full py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Halaman Login</span>
              </button>
              <button
                onClick={() => {
                  playTapSound();
                  setIsMobileNavOpen(false);
                  onNavigateToPortal();
                }}
                className="w-full py-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-emerald-700" />
                <span>18 Modul Portal</span>
              </button>
            </div>
            {onOpenInstallAndroid && (
              <button
                onClick={() => {
                  playTapSound();
                  setIsMobileNavOpen(false);
                  onOpenInstallAndroid();
                }}
                className="w-full py-2.5 bg-amber-400 text-emerald-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pasang / Install Aplikasi ke HP Android</span>
              </button>
            )}
            {isLoggedIn && onLogout && (
              <button
                onClick={() => {
                  playTapSound();
                  setIsMobileNavOpen(false);
                  onLogout();
                }}
                className="w-full py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar / Logout Akun ({userName || userRole})</span>
              </button>
            )}
            <nav className="flex flex-col gap-2.5 text-xs font-bold text-slate-700">
              <a href="#beranda" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Beranda</a>
              <a href="#profil" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Profil & Sambutan</a>
              <a href="#modul-sistem" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">18 Modul Sistem Informasi</a>
              <a href="#program" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Program Unggulan</a>
              <a href="#prestasi" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Prestasi Santri</a>
              <a href="#fasilitas" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Fasilitas Sarpras</a>
              <a href="#kontak" onClick={() => setIsMobileNavOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">Kontak & Rekening Infaq</a>
            </nav>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section id="beranda" className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badges */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-teal-200 shadow-inner">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>NSMD: 311233240019</span>
                <span>•</span>
                <span>Akreditasi Kemenag RI (Baik)</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                Mencetak Generasi Shalih, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-200 to-teal-200">
                  Unggul Kitab Kuning & Berakhlak Mulia
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-teal-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Selamat Datang di <strong>{madrasahName}</strong>. Lembaga pendidikan keagamaan Islam berlandaskan tradisi Ahlussunnah Wal Jama'ah An-Nahdliyyah, memadukan keteguhan sanad keilmuan salaf dengan tata kelola digital modern terpadu.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="btn-hero-login"
                  onClick={() => {
                    playTapSound();
                    onNavigateToLogin();
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm transition-all cursor-pointer flex items-center gap-2.5 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
                >
                  <LogIn className="w-5 h-5 text-emerald-900" />
                  <span>Masuk Portal Login</span>
                  <ArrowRight className="w-4 h-4 text-emerald-900" />
                </button>

                {onOpenInstallAndroid && (
                  <button
                    onClick={() => {
                      playTapSound();
                      onOpenInstallAndroid();
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-emerald-950 font-black text-sm transition-all cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Smartphone className="w-5 h-5 text-emerald-950" />
                    <span>Install di Android</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    playTapSound();
                    onNavigateToPortal();
                  }}
                  className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-sm backdrop-blur-xs transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Layers className="w-5 h-5 text-teal-300" />
                  <span>Jelajahi 18 Modul</span>
                </button>

                <a
                  href="#ppdb"
                  className="px-4 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-teal-100 border border-emerald-600/50 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <span>Info PPDB 2026</span>
                </a>
              </div>

              {/* Mini Highlights */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block">350+</span>
                  <span className="text-[11px] text-teal-200">Santri Aktif</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block">24</span>
                  <span className="text-[11px] text-teal-200">Dewan Asatidz</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block">18</span>
                  <span className="text-[11px] text-teal-200">Modul Digital</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block">100%</span>
                  <span className="text-[11px] text-teal-200">Lulusan Terarah</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/20 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-extrabold text-sm text-white">Akses Cepat Pengguna</h3>
                  </div>
                  <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    4 Peran Terintegrasi
                  </span>
                </div>

                <p className="text-xs text-teal-100 leading-relaxed">
                  Sistem mendukung otentikasi login aman dengan pembagian hak akses teratur:
                </p>

                <div className="space-y-2.5">
                  <div 
                    onClick={() => onNavigateToLogin('admin', undefined, '🔒 Silakan login sebagai Administrator / Kepala Madrasah untuk mengelola master data & sistem.')}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xs">
                        👑
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Admin & Kepala Madrasah</h4>
                        <p className="text-[10px] text-teal-200">Kelola master data, RBAC & laporan menyeluruh</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>

                  <div 
                    onClick={() => onNavigateToLogin('guru', undefined, '🔒 Silakan login sebagai Dewan Asatidz / TU untuk menginput presensi & KBM santri.')}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-400 text-emerald-950 flex items-center justify-center font-bold text-xs">
                        🎓
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Dewan Asatidz & TU</h4>
                        <p className="text-[10px] text-teal-200">Presensi harian, nilai raport & catatan KBM santri</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>

                  <div 
                    onClick={() => onNavigateToLogin('wali', undefined, '🔒 Silakan login sebagai Wali Santri untuk memantau presensi, hafalan & Syahriyah/ADM.')}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                        👨‍👩‍👧
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Wali Santri</h4>
                        <p className="text-[10px] text-teal-200">Pantau kehadiran, mutaba'ah hafalan & syahriyah</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>

                  <div 
                    onClick={() => onNavigateToLogin('santri', undefined, '🔒 Silakan login sebagai Santri untuk melihat jadwal, tugas & materi kitab.')}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold text-xs">
                        📖
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">Santri / Murid</h4>
                        <p className="text-[10px] text-teal-200">Jadwal pelajaran, tugas, materi kitab & setor tahfidz</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => onNavigateToLogin()}
                    className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Masuk Halaman Login Utama</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SAMBUTAN KEPALA MADRASAH & PROFIL SINGKAT */}
      {/* ========================================================================= */}
      <section id="profil" className="py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Foto & Kartu Kepala Madrasah */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl rotate-3 opacity-20"></div>
                <div className="relative bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-xl space-y-4">
                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-slate-200 relative group">
                    <img
                      src={sambutanConfig.fotoUrl || DEFAULT_SAMBUTAN_CONFIG.fotoUrl}
                      alt={sambutanConfig.namaKepala}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_SAMBUTAN_CONFIG.fotoUrl;
                      }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/50 to-transparent p-4 text-white">
                      <h4 className="font-black text-sm sm:text-base leading-tight">
                        {sambutanConfig.namaKepala}
                      </h4>
                      <p className="text-[11px] text-teal-200 font-medium mt-0.5">
                        {sambutanConfig.gelarJabatan}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 font-medium">
                      <span className="text-slate-500">Alumni:</span>
                      <strong className="text-slate-800">{sambutanConfig.alumni}</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 font-medium">
                      <span className="text-slate-500">Izin Operasional:</span>
                      <strong className="text-emerald-700">{sambutanConfig.izinOperasional}</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-100 font-medium">
                      <span className="text-slate-500">Status Kelembagaan:</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        {sambutanConfig.statusAkreditasi}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teks Sambutan & Visi Misi Singkat */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Sambutan Kepala Madrasah
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {sambutanConfig.judulSambutan}
                </h2>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {sambutanConfig.isiSambutan}
              </div>

              {/* Kutipan Motto Pimpinan */}
              {sambutanConfig.pesanKutipan && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs italic font-medium flex items-center gap-2.5">
                  <Quote className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>"{sambutanConfig.pesanKutipan}"</span>
                </div>
              )}

              {/* Visi Box */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Visi Utama Madrasah:</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 font-bold italic leading-relaxed">
                  {VISI_MISI_DATA.visi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SHOWCASE 18 MODUL SISTEM INFORMASI TERPADU */}
      {/* ========================================================================= */}
      <section id="modul-sistem" className="py-16 sm:py-24 bg-slate-100 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-emerald-600 text-white font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
              Sistem Informasi Digital
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              18 Modul Layanan & Administrasi Terpadu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Seluruh aspek KBM, data santri, evaluasi cawu, hingga tata kelola syahriyah telah terintegrasi secara digital dalam 18 modul interaktif. Klik salah satu modul untuk langsung mengaksesnya di portal.
            </p>
          </div>

          {/* 18 Modul Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {modules18.map((mod) => {
              const IconComponent = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    playTapSound();
                    onNavigateToPortal(mod.id);
                  }}
                  className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                >
                  {!isLoggedIn && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Login</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl ${mod.color} flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isLoggedIn && (
                        <span className="font-mono text-xs font-black text-slate-400 group-hover:text-emerald-700 transition-colors">
                          #{mod.num}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {mod.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700 group-hover:text-emerald-800">
                    <span>{isLoggedIn ? 'Buka Modul' : '🔒 Login untuk Buka'}</span>
                    {isLoggedIn ? (
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <LogIn className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner Buka Semua Modul */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-extrabold text-base sm:text-lg">Ingin Membuka Seluruh Antarmuka 18 Modul?</h4>
              <p className="text-xs text-teal-100">
                Akses dashboard terpadu lengkap dengan sidebar navigasi dan tampilan khusus santri, asatidz, dan wali santri.
              </p>
            </div>
            <button
              onClick={() => {
                playTapSound();
                onNavigateToPortal();
              }}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition-all cursor-pointer shrink-0 shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {isLoggedIn ? (
                <>
                  <Layers className="w-4 h-4 text-emerald-900" />
                  <span>Buka Portal Sistem (18 Menu)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-900" />
                  <span>Login untuk Buka Portal (18 Menu)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROGRAM UNGGULAN MADRASAH */}
      {/* ========================================================================= */}
      <section id="program" className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
              Kurikulum Berkarakter
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Program Pendidikan & Keunggulan Santri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Memadukan penguasaan kitab kuning, pembiasaan ibadah sunnah, dan keterampilan dakwah kontemporer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programUnggulan.map((prog, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:bg-white hover:border-emerald-300 hover:shadow-lg transition-all space-y-3.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    0{idx + 1}
                  </span>
                  <span className="bg-white text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {prog.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {prog.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prog.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRESTASI SANTRI & FASILITAS */}
      {/* ========================================================================= */}
      <section id="prestasi" className="py-16 sm:py-20 bg-slate-100 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kolom Prestasi Santri */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-base text-slate-900">Prestasi Santri Terkini</h3>
                </div>
                <button
                  onClick={() => onNavigateToPortal('17_prestasi')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {PRESTASI_LIST.slice(0, 4).map((pres) => (
                  <div key={pres.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {pres.tingkat} • {pres.tahun}
                      </span>
                      <h4 className="font-extrabold text-xs text-slate-800">{pres.namaLomba}</h4>
                      <p className="text-[11px] text-slate-500">Peraih: <strong>{pres.namaPeserta}</strong></p>
                    </div>
                    <span className="font-black text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl shrink-0">
                      {pres.juara}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Fasilitas Sarana Prasarana */}
            <div id="fasilitas" className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Building className="w-5 h-5 text-teal-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Fasilitas Sarana Prasarana</h3>
                </div>
                <button
                  onClick={() => onNavigateToPortal('15_fasilitas')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {FASILITAS_LIST.slice(0, 4).map((fas) => (
                  <div key={fas.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-200">
                      <img src={fas.foto} alt={fas.nama} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{fas.nama}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{fas.deskripsi}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PPDB ONLINE & PENDAFTARAN SANTRI BARU */}
      {/* ========================================================================= */}
      <section id="ppdb" className="py-16 sm:py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>Penerimaan Santri Baru (PPDB) 2026/2027</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Bergabung Bersama Keluarga Besar {madrasahName}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl mx-auto leading-relaxed">
              Mendidik putra-putri Anda menjadi insan yang berakhlak mulia, hafal juz 'Amma, menguasai dasar-dasar kitab kuning, dan berkepribadian tangguh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
              <span className="text-amber-300 font-bold text-xs">Syarat 1</span>
              <h4 className="font-extrabold text-sm text-white">Fotokopi Akta & KK</h4>
              <p className="text-[11px] text-teal-200">2 lembar fotokopi Akta Kelahiran dan Kartu Keluarga</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
              <span className="text-amber-300 font-bold text-xs">Syarat 2</span>
              <h4 className="font-extrabold text-sm text-white">Pas Foto 3x4</h4>
              <p className="text-[11px] text-teal-200">3 lembar pas foto berseragam/berpeci latar biru/merah</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-1">
              <span className="text-amber-300 font-bold text-xs">Syarat 3</span>
              <h4 className="font-extrabold text-sm text-white">Formulir Pendaftaran</h4>
              <p className="text-[11px] text-teal-200">Mengisi formulir resmi pendaftaran santri baru</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Assalamu'alaikum Panitia PPDB ${madrasahName}, saya ingin mendaftar santri baru`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Daftar via WhatsApp Panitia</span>
            </a>

            <button
              onClick={() => onNavigateToPortal('14_syarat_pendaftaran')}
              className="px-5 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>Brosur & Rincian Biaya</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INFAQ & REKENING DONASI */}
      {/* ========================================================================= */}
      <section id="kontak" className="py-16 sm:py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Info Rekening Infaq */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3 py-1 rounded-full uppercase">
                  Amal Jariyah
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Rekening Infaq & Wakaf Pengembangan Madrasah
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Salurkan donasi, sedekah, dan infaq terbaik Anda untuk pembebasan tanah wakaf, renovasi sarana KBM, dan beasiswa santri dhuafa berprestasi.
                </p>
              </div>

              <div className="space-y-3">
                {/* Bank BSI */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-teal-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md">BSI</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">Bank Syariah Indonesia (BSI)</h4>
                    </div>
                    <p className="font-mono font-black text-sm sm:text-base text-emerald-800 mt-1">7182-9012-34</p>
                    <p className="text-[11px] text-slate-500">a.n. <strong>{madrasahName}</strong></p>
                  </div>
                  <button
                    onClick={() => handleCopy('7182901234', 'bsi')}
                    className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl transition-all text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedRekening === 'bsi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedRekening === 'bsi' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                {/* Bank BRI */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-700 text-white text-[10px] font-black px-2 py-0.5 rounded-md">BRI</span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">Bank Rakyat Indonesia (BRI)</h4>
                    </div>
                    <p className="font-mono font-black text-sm sm:text-base text-blue-900 mt-1">0034-01-023456-53-1</p>
                    <p className="text-[11px] text-slate-500">a.n. <strong>Yayasan {madrasahName}</strong></p>
                  </div>
                  <button
                    onClick={() => handleCopy('003401023456531', 'bri')}
                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl transition-all text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedRekening === 'bri' ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedRekening === 'bri' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Kontak & Lokasi */}
            <div className="lg:col-span-6 bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
              <h3 className="font-extrabold text-lg sm:text-xl text-white">Hubungi Sekretariat Madrasah</h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Alamat Kampus:</strong>
                    <p className="text-teal-200 leading-relaxed">
                      Jl. Pesantren No. 09 RT 03/RW 02, Magelung, Kaliwungu Selatan, Kendal, Jawa Tengah
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Telepon / WhatsApp TU:</strong>
                    <p className="text-teal-200">0812-3456-7890 (Ustadz Zainuri, S.Pd.)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Email Resmi:</strong>
                    <p className="text-teal-200">mdtw.bahrululum@kemenag.go.id</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Waktu KBM Diniyah:</strong>
                    <p className="text-teal-200">Setiap Hari Sabtu s.d. Kamis: 14.00 - 17.00 WIB (Jumat Libur)</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateToLogin()}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                >
                  <LogIn className="w-4 h-4 text-emerald-900" />
                  <span>Akses Halaman Login Portal Sistem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER */}
      {/* ========================================================================= */}
      <footer className="mt-auto bg-slate-900 text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt={madrasahName} className="w-10 h-10 object-contain rounded-xl bg-white p-1" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                    <School className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-sm text-white">{madrasahName}</h4>
                  <p className="text-[11px] text-slate-500">Pendidikan Diniyah Takmiliyah Wustho</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Menyelenggarakan pendidikan diniyah berkualitas berlandaskan tradisi keilmuan Islam Ahlussunnah Wal Jama'ah, mengkaji kitab kuning makna pegon, dan membina akhlaqul karimah santri.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h5 className="font-extrabold text-xs text-white uppercase tracking-wider">Navigasi Utama</h5>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#beranda" className="hover:text-emerald-400 transition-colors">Beranda</a></li>
                <li><a href="#profil" className="hover:text-emerald-400 transition-colors">Profil Lembaga</a></li>
                <li><a href="#modul-sistem" className="hover:text-emerald-400 transition-colors">18 Modul Sistem</a></li>
                <li><a href="#program" className="hover:text-emerald-400 transition-colors">Program Unggulan</a></li>
                <li><a href="#ppdb" className="hover:text-emerald-400 transition-colors">Pendaftaran (PPDB)</a></li>
              </ul>
            </div>

            {/* Akses Portal */}
            <div className="space-y-2">
              <h5 className="font-extrabold text-xs text-white uppercase tracking-wider">Akses Portal</h5>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => onNavigateToLogin()} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    🔑 Halaman Login (/login)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateToPortal()} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    📱 Portal 18 Modul (/portal)
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateToPortal('1_daftar_hadir')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    📋 Presensi Santri & Asatidz
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateToPortal('5_raport')} className="hover:text-emerald-400 transition-colors cursor-pointer text-left">
                    📖 Buku Raport Santri
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {madrasahName}. All Rights Reserved. Terhubung ke Cloud Firestore.</p>
            <div className="flex items-center gap-4">
              <a href="#beranda" className="hover:text-slate-400">Kembali ke Atas ↑</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
