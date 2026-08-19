import React, { useState } from 'react';
import {
  UserCheck,
  Users,
  ShoppingBag,
  Image as ImageIcon,
  GraduationCap,
  Calendar,
  School,
  ClipboardList,
  Target,
  FileCheck,
  Wallet,
  CalendarRange,
  ShieldAlert,
  UserPlus,
  Building,
  Activity,
  Trophy,
  PhoneCall,
  Home,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  Search,
  BookOpen,
  QrCode,
  Settings,
  LogIn,
  LogOut
} from 'lucide-react';
import { TabType, UserRole } from '../types';
import { playTapSound } from '../utils/audio';
import { AppBrandingConfig, DEFAULT_BRANDING } from './modals/AppBrandingModal';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  unreadNotifications?: number;
  onOpenIdCard?: () => void;
  branding?: AppBrandingConfig;
  onOpenBrandingSettings?: () => void;
  onOpenLogin?: () => void;
  onOpenHakAkses?: () => void;
  onNavigateToHome?: () => void;
  onLogout?: () => void;
}

interface MenuItemDef {
  id: TabType;
  number: number;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  badge?: string;
  category: 'KBM & Santri' | 'Administrasi & Profil' | 'Informasi Lembaga';
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  activeRole,
  onChangeRole,
  onOpenIdCard,
  branding = DEFAULT_BRANDING,
  onOpenBrandingSettings,
  onOpenLogin,
  onOpenHakAkses,
  onNavigateToHome,
  onLogout,
}) => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'KBM & Santri' | 'Administrasi & Profil' | 'Informasi Lembaga'>('Semua');

  const menuItems: MenuItemDef[] = [
    {
      id: '1_daftar_hadir',
      number: 1,
      label: 'DAFTAR HADIR',
      subLabel: 'Murid Kelas 1-6 & Asatidz/TU',
      icon: UserCheck,
      badge: 'Presensi',
      category: 'KBM & Santri'
    },
    {
      id: '2_biodata',
      number: 2,
      label: 'BIODATA',
      subLabel: 'Data Asatidz & Murid',
      icon: Users,
      badge: 'Database',
      category: 'KBM & Santri'
    },
    {
      id: '3_kopas',
      number: 3,
      label: 'KOPERASI SANTRI (KOPAS)',
      subLabel: 'ATK, Kitab, Seragam & Tabungan',
      icon: ShoppingBag,
      badge: 'Kantin/Toko',
      category: 'KBM & Santri'
    },
    {
      id: '4_dokumentasi',
      number: 4,
      label: 'DOKUMENTASI KEGIATAN',
      subLabel: 'Galeri Foto, Video, & File Dokumen',
      icon: ImageIcon,
      category: 'KBM & Santri'
    },
    {
      id: '5_raport',
      number: 5,
      label: 'RAPORT SANTRI',
      subLabel: '11 Mapel, Nilai, Ranking & Catatan',
      icon: GraduationCap,
      badge: 'Evaluasi',
      category: 'KBM & Santri'
    },
    {
      id: '6_jadwal_seragam_mapel',
      number: 6,
      label: 'JADWAL SERAGAM & MAPEL KTSP+',
      subLabel: 'Kelas 1-6 & Keterangan Percawu',
      icon: Calendar,
      category: 'KBM & Santri'
    },
    {
      id: '7_profile_madrasah',
      number: 7,
      label: 'PROFILE MADRASAH',
      subLabel: 'Legalitas, Sejarah, NSM & Akreditasi',
      icon: School,
      category: 'Administrasi & Profil'
    },
    {
      id: '8_catatan_kegiatan',
      number: 8,
      label: 'CATATAN KEGIATAN',
      subLabel: 'Hari, Tanggal, Keterangan & Tempat',
      icon: ClipboardList,
      category: 'Administrasi & Profil'
    },
    {
      id: '9_visi_misi',
      number: 9,
      label: 'VISI, MISI & TUJUAN',
      subLabel: 'Arah Pendidikan Salafiyah',
      icon: Target,
      category: 'Administrasi & Profil'
    },
    {
      id: '10_mutakhorijin',
      number: 10,
      label: 'DAFTAR MUTAKHORIJIN',
      subLabel: 'Buku Induk Alumni & Ijazah',
      icon: FileCheck,
      category: 'Administrasi & Profil'
    },
    {
      id: '11_syahriyah',
      number: 11,
      label: 'SYAHRIYAH & ADMINISTRASI',
      subLabel: 'Iuran Kelas 1-6 Cawu 1, 2, 3',
      icon: Wallet,
      badge: 'Iuran',
      category: 'Administrasi & Profil'
    },
    {
      id: '12_jadwal_tahunan',
      number: 12,
      label: 'JADWAL KEGIATAN TAHUNAN',
      subLabel: 'Kalender PHBI, Imtihan & Haflah',
      icon: CalendarRange,
      category: 'Informasi Lembaga'
    },
    {
      id: '13_tata_tertib',
      number: 13,
      label: 'TATA TERTIB',
      subLabel: 'Pedoman Santri & Dewan Asatidz',
      icon: ShieldAlert,
      category: 'Informasi Lembaga'
    },
    {
      id: '14_syarat_pendaftaran',
      number: 14,
      label: 'SYARAT PENDAFTARAN',
      subLabel: 'PSB Murid Baru / Lama & Biaya',
      icon: UserPlus,
      badge: 'PSB',
      category: 'Informasi Lembaga'
    },
    {
      id: '15_fasilitas',
      number: 15,
      label: 'FASILITAS LEMBAGA',
      subLabel: 'Gedung, Masjid, Lab & Perpustakaan',
      icon: Building,
      category: 'Informasi Lembaga'
    },
    {
      id: '16_ekstrakurikuler',
      number: 16,
      label: 'KEGIATAN EKSTRAKURIKULER',
      subLabel: 'Hadroh, Silat, Khitobah, Kaligrafi',
      icon: Activity,
      category: 'Informasi Lembaga'
    },
    {
      id: '17_prestasi',
      number: 17,
      label: 'DAFTAR PRESTASI MADRASAH',
      subLabel: 'Juara MQK, Porsadin & MTQ',
      icon: Trophy,
      badge: 'Juara',
      category: 'Informasi Lembaga'
    },
    {
      id: '18_kontak_rekening',
      number: 18,
      label: 'ALAMAT, KONTAK & NO REKENING',
      subLabel: 'WA Official, Maps, & Rekening Bank',
      icon: PhoneCall,
      category: 'Informasi Lembaga'
    }
  ];

  const filteredMenus = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.label.toLowerCase().includes(q) ||
      item.subLabel.toLowerCase().includes(q) ||
      item.number.toString().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleNavClick = (tab: TabType) => {
    playTapSound();
    onChangeTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-80 sm:w-88 bg-white border-r border-slate-200/90 shadow-2xl lg:shadow-none flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Madrasah Branding */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white flex items-center justify-between shadow-xs shrink-0">
          <div 
            onClick={() => {
              if (onOpenBrandingSettings) {
                playTapSound();
                onOpenBrandingSettings();
              }
            }}
            className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
            title="Klik untuk Mengubah Logo & Nama Aplikasi"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center p-0.5 shadow-2xs backdrop-blur-xs overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.appName}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Sparkles className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-sm tracking-tight text-white truncate">
                  {branding.appName}
                </h2>
                <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs shrink-0">
                  {branding.appBadge}
                </span>
              </div>
              <p className="text-[10px] text-emerald-100 font-medium truncate">
                {branding.institutionName}
              </p>
              {branding.portalBadge && (
                <span className="inline-block mt-0.5 text-[8px] bg-emerald-950/50 text-emerald-200 font-semibold px-1.5 py-0.2 rounded border border-white/10 truncate max-w-full">
                  {branding.portalBadge}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onOpenBrandingSettings && (
              <button
                onClick={() => {
                  playTapSound();
                  onOpenBrandingSettings();
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title="Pengaturan Logo & Nama Aplikasi"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Bar & Quick Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase">Akses Peran:</span>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase">
                {activeRole}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {(['santri', 'guru', 'wali', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    playTapSound();
                    onChangeRole(r);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold capitalize transition-colors cursor-pointer ${
                    activeRole === r
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="sidebar-search-input"
              type="text"
              placeholder="Cari dari 18 menu aplikasi..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-emerald-500 font-medium"
            />
          </div>

          {/* Category Quick Filter Chips */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 hide-scrollbar">
            {(['Semua', 'KBM & Santri', 'Administrasi & Profil', 'Informasi Lembaga'] as const).map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playTapSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua (18)' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Navigation 18 Menus */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-3.5 text-xs hide-scrollbar">
          {/* Dashboard Home Shortcut */}
          <div>
            <button
              id="sidebar-menu-btn-home"
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-amber-500" />
                <span className="font-extrabold text-xs">BERANDA / DASHBOARD UTAMA</span>
              </div>
              {activeTab === 'home' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          {filteredMenus.length === 0 ? (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Menu Tidak Ditemukan</p>
              <p className="text-[10px] text-slate-400 mt-1">Coba kata kunci lain atau pilih tab 'Semua'</p>
            </div>
          ) : (
            <>
              {/* Group 1: KBM & Santri (Menu 1-6) */}
              {filteredMenus.some((m) => m.category === 'KBM & Santri') && (
                <div>
                  <div className="flex items-center justify-between px-2.5 mb-1">
                    <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
                      KBM & AKTIVITAS SANTRI
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">Menu 1-6</span>
                  </div>

                  <div className="space-y-1">
                    {filteredMenus
                      .filter((m) => m.category === 'KBM & Santri')
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`sidebar-menu-btn-${item.number}`}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer text-left ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'
                                }`}
                              >
                                {item.number}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-xs truncate leading-tight block">
                                    {item.label}
                                  </span>
                                  {item.badge && !isActive && (
                                    <span className="text-[8px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] truncate block ${
                                    isActive ? 'text-emerald-100' : 'text-slate-400'
                                  }`}
                                >
                                  {item.subLabel}
                                </span>
                              </div>
                            </div>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group 2: Administrasi & Profil (Menu 7-11) */}
              {filteredMenus.some((m) => m.category === 'Administrasi & Profil') && (
                <div>
                  <div className="flex items-center justify-between px-2.5 mb-1">
                    <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
                      ADMINISTRASI & PROFIL
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">Menu 7-11</span>
                  </div>

                  <div className="space-y-1">
                    {filteredMenus
                      .filter((m) => m.category === 'Administrasi & Profil')
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`sidebar-menu-btn-${item.number}`}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer text-left ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-800'
                                }`}
                              >
                                {item.number}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-xs truncate leading-tight block">
                                    {item.label}
                                  </span>
                                  {item.badge && !isActive && (
                                    <span className="text-[8px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] truncate block ${
                                    isActive ? 'text-emerald-100' : 'text-slate-400'
                                  }`}
                                >
                                  {item.subLabel}
                                </span>
                              </div>
                            </div>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group 3: Informasi & Lembaga (Menu 12-18) */}
              {filteredMenus.some((m) => m.category === 'Informasi Lembaga') && (
                <div>
                  <div className="flex items-center justify-between px-2.5 mb-1">
                    <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
                      INFORMASI & SARANA LEMBAGA
                    </span>
                    <span className="text-[9px] font-bold text-slate-400">Menu 12-18</span>
                  </div>

                  <div className="space-y-1">
                    {filteredMenus
                      .filter((m) => m.category === 'Informasi Lembaga')
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            id={`sidebar-menu-btn-${item.number}`}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer text-left ${
                              isActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-cyan-50 text-cyan-800'
                                }`}
                              >
                                {item.number}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-xs truncate leading-tight block">
                                    {item.label}
                                  </span>
                                  {item.badge && !isActive && (
                                    <span className="text-[8px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[10px] truncate block ${
                                    isActive ? 'text-emerald-100' : 'text-slate-400'
                                  }`}
                                >
                                  {item.subLabel}
                                </span>
                              </div>
                            </div>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Settings & Auth Action Buttons */}
        <div className="p-3 bg-slate-50/90 border-t border-slate-200/90 space-y-1.5 shrink-0">
          {onOpenLogin && (
            <button
              onClick={() => {
                playTapSound();
                onOpenLogin();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Halaman Login / Ganti Akun</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={() => {
                playTapSound();
                onLogout();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar / Logout Akun</span>
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200/80 text-[10px] text-slate-400 font-medium text-center shrink-0">
          <span className="text-emerald-800 font-bold">{branding.appName || branding.institutionName || 'MDTW Bahrul Ulum'}</span> • E-Sistem V.2.5
        </div>
      </aside>
    </>
  );
};
