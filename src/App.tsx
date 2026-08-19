import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { LeftSidebar } from './components/LeftSidebar';
import { HomeTab } from './components/tabs/HomeTab';
import { AbsensiModal } from './components/modals/AbsensiModal';
import { TanyaUstadzModal } from './components/modals/TanyaUstadzModal';
import { SetoranTahfidzModal } from './components/modals/SetoranTahfidzModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { PengumumanDetailModal } from './components/modals/PengumumanDetailModal';
import { IdCardModal } from './components/modals/IdCardModal';
import { 
  AppBrandingModal, 
  AppBrandingConfig, 
  DEFAULT_BRANDING 
} from './components/modals/AppBrandingModal';
import {
  EditBerandaModal,
  BerandaConfig,
  DEFAULT_BERANDA_CONFIG
} from './components/modals/EditBerandaModal';
import {
  EditSambutanModal,
  SambutanKepalaConfig,
  DEFAULT_SAMBUTAN_CONFIG
} from './components/modals/EditSambutanModal';
import { LoginPage } from './components/auth/LoginPage';
import { LoginPageView } from './components/auth/LoginPageView';
import { PublicWebsiteView } from './components/public/PublicWebsiteView';
import { HakAksesSettingsModal } from './components/modals/HakAksesSettingsModal';
import { 
  getSavedAuthSession, 
  saveAuthSession, 
  canViewMenu, 
  checkMenuAccessLevel 
} from './services/authService';
import { Lock, LogIn, ShieldAlert, ArrowLeft } from 'lucide-react';
import { playTapSound } from './utils/audio';

// 18 Requested Madrasah Views
import { DaftarHadirView } from './components/views/DaftarHadirView';
import { BiodataView } from './components/views/BiodataView';
import { KopasView } from './components/views/KopasView';
import { DokumentasiView } from './components/views/DokumentasiView';
import { RaportView } from './components/views/RaportView';
import { JadwalSeragamMapelView } from './components/views/JadwalSeragamMapelView';
import { ProfileMadrasahView } from './components/views/ProfileMadrasahView';
import { CatatanKegiatanView } from './components/views/CatatanKegiatanView';
import { VisiMisiView } from './components/views/VisiMisiView';
import { MutakhorijinView } from './components/views/MutakhorijinView';
import { SyahriyahView } from './components/views/SyahriyahView';
import { JadwalTahunanView } from './components/views/JadwalTahunanView';
import { TataTertibView } from './components/views/TataTertibView';
import { SyaratPendaftaranView } from './components/views/SyaratPendaftaranView';
import { FasilitasView } from './components/views/FasilitasView';
import { EkstrakurikulerView } from './components/views/EkstrakurikulerView';
import { PrestasiView } from './components/views/PrestasiView';
import { KontakRekeningView } from './components/views/KontakRekeningView';

import { 
  INITIAL_STUDENT, 
  INITIAL_TEACHER, 
  PRAYER_SCHEDULE, 
  JADWAL_PELAJARAN, 
  TUGAS_LIST, 
  MUTABAAH_ITEMS, 
  PENGUMUMAN_LIST, 
  INITIAL_PRESENSI 
} from './data/mockData';

import { 
  StudentProfile, 
  TeacherProfile, 
  UserRole, 
  TugasItem, 
  MutabaahItem, 
  TahfidzRecord, 
  PengumumanItem, 
  PresensiRecord,
  TabType 
} from './types';

import { 
  saveMenuRecordToFirestore, 
  subscribeMenuRecords 
} from './services/firestoreService';

const STORAGE_KEY_BRANDING = 'madrasah_app_branding_v2';
const STORAGE_KEY_BERANDA = 'madrasah_beranda_config_v2';
const STORAGE_KEY_SAMBUTAN = 'madrasah_sambutan_data_v2';

export type AppRoute = 'website' | 'login' | 'portal';

function detectCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return 'website';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (path.includes('/login') || hash.includes('/login') || hash.includes('login') || search.includes('page=login')) {
    return 'login';
  }
  if (path.includes('/portal') || path.includes('/dashboard') || path.includes('/app') || hash.includes('/portal') || hash.includes('portal') || search.includes('page=portal')) {
    return 'portal';
  }
  return 'website';
}

export default function App() {
  // Application Primary View Route ('website' = Landing Page, 'login' = Dedicated Login, 'portal' = 18-Menu App)
  const [appRoute, setAppRoute] = useState<AppRoute>(() => detectCurrentRoute());

  // Navigation & Role State (Defaults to 'home' or Menu 1)
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('santri');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // App Branding State
  const [branding, setBranding] = useState<AppBrandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRANDING);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_BRANDING;
  });

  // Beranda Config State
  const [berandaConfig, setBerandaConfig] = useState<BerandaConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BERANDA);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_BERANDA_CONFIG;
  });

  // Sambutan & Kepala Madrasah Config State
  const [sambutanConfig, setSambutanConfig] = useState<SambutanKepalaConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAMBUTAN);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SAMBUTAN_CONFIG;
  });

  // Core Data State
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [teacher, setTeacher] = useState<TeacherProfile>(INITIAL_TEACHER);
  const [tugasList, setTugasList] = useState<TugasItem[]>(TUGAS_LIST);
  const [mutabaahList, setMutabaahList] = useState<MutabaahItem[]>(MUTABAAH_ITEMS);
  const [pengumumanList, setPengumumanList] = useState<PengumumanItem[]>(PENGUMUMAN_LIST);
  const [presensiHariIni, setPresensiHariIni] = useState<PresensiRecord | null>(INITIAL_PRESENSI[0]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  // Modal Visibility State
  const [isPresensiOpen, setIsPresensiOpen] = useState<boolean>(false);
  const [isTanyaUstadzOpen, setIsTanyaUstadzOpen] = useState<boolean>(false);
  const [isNewTahfidzOpen, setIsNewTahfidzOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState<boolean>(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState<boolean>(false);
  const [isEditBerandaOpen, setIsEditBerandaOpen] = useState<boolean>(false);
  const [isEditSambutanOpen, setIsEditSambutanOpen] = useState<boolean>(false);
  const [selectedPengumuman, setSelectedPengumuman] = useState<PengumumanItem | null>(null);

  // Auth & RBAC State
  const [authSession, setAuthSession] = useState(() => getSavedAuthSession());
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isHakAksesOpen, setIsHakAksesOpen] = useState<boolean>(false);
  const [loginNotice, setLoginNotice] = useState<string | undefined>();
  const [pendingTargetTab, setPendingTargetTab] = useState<TabType | undefined>();
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole | undefined>();

  // Sync route with browser back/forward and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const detected = detectCurrentRoute();
      setAppRoute(detected);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: AppRoute, targetTab?: TabType) => {
    playTapSound();
    setAppRoute(route);
    if (targetTab) {
      setActiveTab(targetTab);
    }
    const urlMap: Record<AppRoute, string> = {
      website: '/',
      login: '/login',
      portal: '/portal',
    };
    try {
      window.history.pushState({ route, tab: targetTab }, '', urlMap[route]);
    } catch {
      // safe fallback for restricted sandbox
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated handlers for protected navigation
  const handleNavigateToLogin = (role?: UserRole, targetTab?: string, notice?: string) => {
    if (role) {
      setLoginInitialRole(role);
    }
    if (targetTab) {
      setPendingTargetTab(targetTab as TabType);
    }
    if (notice) {
      setLoginNotice(notice);
    } else {
      setLoginNotice(undefined);
    }
    navigateTo('login');
  };

  const handleNavigateToPortal = (targetTab?: string, roleHint?: UserRole) => {
    if (roleHint) {
      setLoginInitialRole(roleHint);
    }
    if (!authSession) {
      setPendingTargetTab(targetTab ? (targetTab as TabType) : 'home');
      setLoginNotice(
        targetTab
          ? '🔒 Modul ini memerlukan otentikasi login. Silakan masuk terlebih dahulu untuk mengakses sistem.'
          : '🔒 Akses Dashboard & 18 Modul terproteksi. Silakan login terlebih dahulu.'
      );
      navigateTo('login');
      return;
    }
    // User is logged in, navigate safely to portal
    navigateTo('portal', targetTab ? (targetTab as TabType) : undefined);
  };

  const handleLogout = () => {
    saveAuthSession(null);
    setAuthSession(null);
    setLoginNotice(undefined);
    setPendingTargetTab(undefined);
    navigateTo('website');
  };

  // Sync role when session changes
  useEffect(() => {
    if (authSession?.role) {
      setActiveRole(authSession.role);
    }
  }, [authSession]);

  const handleLoginSuccess = (session: typeof authSession) => {
    if (!session) return;
    setAuthSession(session);
    setActiveRole(session.role);
    saveAuthSession(session);
    setIsLoginOpen(false);
    setLoginNotice(undefined);
    const target = pendingTargetTab || 'home';
    setPendingTargetTab(undefined);
    navigateTo('portal', target);
  };

  // Subscribe to Cloud Firestore for App Branding
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeMenuRecords<AppBrandingConfig>('app_branding', (records) => {
      if (!isMounted) return;
      if (records && records.length > 0 && records[0].payload) {
        const payload = records[0].payload;
        setBranding(payload);
        localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(payload));
      } else {
        saveMenuRecordToFirestore('app_branding', 'main', 'Branding Aplikasi', DEFAULT_BRANDING);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Subscribe to Cloud Firestore for Beranda Config
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeMenuRecords<BerandaConfig>('beranda_config', (records) => {
      if (!isMounted) return;
      if (records && records.length > 0 && records[0].payload) {
        const payload = records[0].payload;
        setBerandaConfig(payload);
        localStorage.setItem(STORAGE_KEY_BERANDA, JSON.stringify(payload));
      } else {
        saveMenuRecordToFirestore('beranda_config', 'main', 'Konfigurasi Beranda', DEFAULT_BERANDA_CONFIG);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Subscribe to Cloud Firestore for Sambutan & Profil Kepala Madrasah
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeMenuRecords<SambutanKepalaConfig>('sambutan_kepala', (records) => {
      if (!isMounted) return;
      if (records && records.length > 0 && records[0].payload) {
        const payload = records[0].payload;
        setSambutanConfig(payload);
        localStorage.setItem(STORAGE_KEY_SAMBUTAN, JSON.stringify(payload));
      } else {
        saveMenuRecordToFirestore('sambutan_kepala', 'main', 'Sambutan Kepala Madrasah', DEFAULT_SAMBUTAN_CONFIG);
      }
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleSaveBranding = async (newBranding: AppBrandingConfig) => {
    setBranding(newBranding);
    localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(newBranding));
    try {
      await saveMenuRecordToFirestore('app_branding', 'main', 'Branding Aplikasi', newBranding);
    } catch (err) {
      console.warn('Firestore fallback', err);
    }
  };

  const handleSaveBerandaConfig = async (newConfig: BerandaConfig) => {
    setBerandaConfig(newConfig);
    localStorage.setItem(STORAGE_KEY_BERANDA, JSON.stringify(newConfig));
    try {
      await saveMenuRecordToFirestore('beranda_config', 'main', 'Konfigurasi Beranda', newConfig);
    } catch (err) {
      console.warn('Firestore fallback', err);
    }
  };

  const handleSaveSambutanConfig = async (newConfig: SambutanKepalaConfig) => {
    setSambutanConfig(newConfig);
    localStorage.setItem(STORAGE_KEY_SAMBUTAN, JSON.stringify(newConfig));
    try {
      await saveMenuRecordToFirestore('sambutan_kepala', 'main', 'Sambutan Kepala Madrasah', newConfig);
    } catch (err) {
      console.warn('Firestore fallback', err);
    }
  };

  // Mutaba'ah item toggle
  const handleToggleMutabaah = (id: string) => {
    setMutabaahList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  // Add Tahfidz Record
  const handleAddTahfidz = (newRec: TahfidzRecord) => {
    if (newRec.kategori.includes('Ziyadah') && student.tahfidzProgress.juzMemorized < student.tahfidzProgress.targetJuz) {
      setStudent((prev) => ({
        ...prev,
        tahfidzProgress: {
          ...prev.tahfidzProgress,
          juzMemorized: prev.tahfidzProgress.juzMemorized + 1
        }
      }));
    }
  };

  // Success Presensi
  const handleSuccessPresensi = (record: PresensiRecord) => {
    setPresensiHariIni(record);
  };

  // If user is visiting the Public Website (Landing Page)
  if (appRoute === 'website') {
    return (
      <PublicWebsiteView
        onNavigateToLogin={(role, tab, notice) => handleNavigateToLogin(role, tab, notice)}
        onNavigateToPortal={(tab, roleHint) => handleNavigateToPortal(tab, roleHint)}
        branding={branding}
        sambutanConfig={sambutanConfig}
        onOpenEditSambutan={() => setIsEditSambutanOpen(true)}
        isLoggedIn={!!authSession}
        userRole={authSession?.role}
        userName={authSession?.user?.fullName}
        onLogout={handleLogout}
      />
    );
  }

  // If user is visiting the Dedicated Standalone Login Page
  if (appRoute === 'login') {
    return (
      <LoginPageView
        onLoginSuccess={(session) => handleLoginSuccess(session)}
        onNavigateToHome={() => navigateTo('website')}
        onNavigateToPortal={() => handleNavigateToPortal()}
        branding={branding}
        initialRole={loginInitialRole || activeRole}
        loginNotice={loginNotice}
      />
    );
  }

  // If user tries to open Portal directly without authentication
  if (!authSession) {
    return (
      <LoginPageView
        onLoginSuccess={(session) => handleLoginSuccess(session)}
        onNavigateToHome={() => navigateTo('website')}
        onNavigateToPortal={() => handleNavigateToPortal()}
        branding={branding}
        initialRole={loginInitialRole || activeRole}
        loginNotice={loginNotice || '🔒 Anda harus login terlebih dahulu untuk mengakses Dashboard & 18 Modul Sistem MDTW Bahrul Ulum.'}
      />
    );
  }

  // Otherwise, render the 18-Menu Internal Portal System
  return (
    <AndroidFrame
      activeRole={activeRole}
      onChangeRole={setActiveRole}
      onOpenNotifications={() => setIsNotificationOpen(true)}
      unreadNotifications={unreadNotifications}
      branding={branding}
      onOpenBrandingSettings={() => setIsBrandingModalOpen(true)}
    >
      {/* Left Navigation Sidebar (Menu Tampilan Sisi Kiri dengan 18 Menu) */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        activeRole={activeRole}
        onChangeRole={setActiveRole}
        unreadNotifications={unreadNotifications}
        onOpenIdCard={() => setIsIdCardOpen(true)}
        branding={branding}
        onOpenBrandingSettings={() => setIsBrandingModalOpen(true)}
        onOpenLogin={() => handleNavigateToLogin()}
        onOpenHakAkses={() => setIsHakAksesOpen(true)}
        onNavigateToHome={() => navigateTo('website')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative overflow-hidden">
        {/* Top Application Bar with Hamburger Menu & Madrasah Identity */}
        <TopAppBar
          student={student}
          teacher={teacher}
          activeRole={activeRole}
          unreadCount={unreadNotifications}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenIdCard={() => setIsIdCardOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onChangeRole={setActiveRole}
          onOpenLogin={() => handleNavigateToLogin()}
          onOpenHakAkses={() => setIsHakAksesOpen(true)}
          onNavigateToHome={() => navigateTo('website')}
          onLogout={handleLogout}
          currentUser={authSession?.user}
        />

        {/* Main Tab Screens Container (Scrollable) */}
        <div className="flex-1 w-full bg-slate-50 overflow-y-auto hide-scrollbar">
          {/* Permission Check for 18 Menus */}
          {activeTab !== 'home' && !canViewMenu(activeRole, activeTab as any) ? (
            <div className="p-4 sm:p-8 max-w-md mx-auto text-center my-10 bg-white rounded-3xl border border-rose-200 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block">
                  Akses Terbatas
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  Modul Ini Memerlukan Hak Akses Khusus
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Akun Anda saat ini memiliki peran <strong className="capitalize text-slate-700">{activeRole}</strong>.
                  Modul ini dikunci sesuai dengan pengaturan Hak Akses Madrasah.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => {
                    playTapSound();
                    setActiveTab('home');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                >
                  Kembali ke Beranda
                </button>
                <button
                  onClick={() => {
                    playTapSound();
                    setIsLoginOpen(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ganti Akun Login</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Default Home / Dashboard */}
              {activeTab === 'home' && (
                <HomeTab
                  student={student}
                  teacher={teacher}
                  activeRole={activeRole}
                  prayerTimes={PRAYER_SCHEDULE}
                  jadwalHariIni={JADWAL_PELAJARAN}
                  tugasList={tugasList}
                  mutabaahList={mutabaahList}
                  onToggleMutabaah={handleToggleMutabaah}
                  pengumumanList={pengumumanList}
                  onOpenPresensi={() => setActiveTab('1_daftar_hadir')}
                  onOpenTanyaUstadz={() => setIsTanyaUstadzOpen(true)}
                  onOpenSetoranTahfidz={() => setIsNewTahfidzOpen(true)}
                  onOpenCBT={() => setActiveTab('5_raport')}
                  onOpenSPP={() => setActiveTab('11_syahriyah')}
                  onOpenJadwal={() => setActiveTab('6_jadwal_seragam_mapel')}
                  onOpenQuran={() => setIsTanyaUstadzOpen(true)}
                  onOpenDoa={() => setIsTanyaUstadzOpen(true)}
                  onOpenTasbih={() => setIsTanyaUstadzOpen(true)}
                  onOpenRaport={() => setActiveTab('5_raport')}
                  onOpenPengumumanDetail={(item) => setSelectedPengumuman(item)}
                  presensiHariIni={presensiHariIni}
                  berandaConfig={berandaConfig}
                  onOpenEditBeranda={() => setIsEditBerandaOpen(true)}
                  branding={branding}
                  onOpenBrandingSettings={() => setIsBrandingModalOpen(true)}
                />
              )}

              {/* 18 Individual Madrasah Views */}
              {activeTab === '1_daftar_hadir' && <DaftarHadirView activeRole={activeRole} />}
              {activeTab === '2_biodata' && <BiodataView activeRole={activeRole} />}
              {activeTab === '3_kopas' && <KopasView />}
              {activeTab === '4_dokumentasi' && <DokumentasiView />}
              {activeTab === '5_raport' && <RaportView />}
              {activeTab === '6_jadwal_seragam_mapel' && <JadwalSeragamMapelView />}
              {activeTab === '7_profile_madrasah' && (
                <ProfileMadrasahView
                  activeRole={activeRole}
                  onOpenBrandingSettings={() => setIsBrandingModalOpen(true)}
                  sambutanConfig={sambutanConfig}
                  onOpenEditSambutan={() => setIsEditSambutanOpen(true)}
                />
              )}
              {activeTab === '8_catatan_kegiatan' && <CatatanKegiatanView />}
              {activeTab === '9_visi_misi' && <VisiMisiView />}
              {activeTab === '10_mutakhorijin' && <MutakhorijinView />}
              {activeTab === '11_syahriyah' && <SyahriyahView />}
              {activeTab === '12_jadwal_tahunan' && <JadwalTahunanView />}
              {activeTab === '13_tata_tertib' && <TataTertibView />}
              {activeTab === '14_syarat_pendaftaran' && <SyaratPendaftaranView />}
              {activeTab === '15_fasilitas' && <FasilitasView />}
              {activeTab === '16_ekstrakurikuler' && <EkstrakurikulerView />}
              {activeTab === '17_prestasi' && <PrestasiView />}
              {activeTab === '18_kontak_rekening' && <KontakRekeningView />}
            </>
          )}
        </div>

        {/* Bottom Navigation Bar (Visible on Mobile / Small screens) */}
        <div className="lg:hidden shrink-0">
          <BottomNavBar
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
        </div>
      </div>

      {/* Modals & Dialog Overlays */}
      <AppBrandingModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        branding={branding}
        onSave={handleSaveBranding}
      />

      <EditBerandaModal
        isOpen={isEditBerandaOpen}
        onClose={() => setIsEditBerandaOpen(false)}
        config={berandaConfig}
        onSave={handleSaveBerandaConfig}
      />

      {/* Edit Sambutan & Biodata Kepala Madrasah Modal */}
      <EditSambutanModal
        isOpen={isEditSambutanOpen}
        onClose={() => setIsEditSambutanOpen(false)}
        config={sambutanConfig}
        onSave={handleSaveSambutanConfig}
      />

      {/* Login Page Modal */}
      {isLoginOpen && (
        <LoginPage
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          branding={branding}
          currentRole={activeRole}
        />
      )}

      {/* Hak Akses & Akun Login Settings Modal */}
      {isHakAksesOpen && (
        <HakAksesSettingsModal
          isOpen={isHakAksesOpen}
          onClose={() => setIsHakAksesOpen(false)}
          onPermissionsUpdated={() => {
            // Re-render when permissions change
            setActiveRole((r) => r);
          }}
        />
      )}

      {isPresensiOpen && (
        <AbsensiModal
          student={student}
          onClose={() => setIsPresensiOpen(false)}
          onSuccessPresensi={handleSuccessPresensi}
          existingPresensi={presensiHariIni}
        />
      )}

      {isTanyaUstadzOpen && (
        <TanyaUstadzModal onClose={() => setIsTanyaUstadzOpen(false)} />
      )}

      {isNewTahfidzOpen && (
        <SetoranTahfidzModal
          onClose={() => setIsNewTahfidzOpen(false)}
          onAddRecord={handleAddTahfidz}
        />
      )}

      {isNotificationOpen && (
        <NotificationModal
          onClose={() => setIsNotificationOpen(false)}
          onClearAll={() => setUnreadNotifications(0)}
        />
      )}

      {isIdCardOpen && (
        <IdCardModal
          student={student}
          teacher={teacher}
          activeRole={activeRole}
          onClose={() => setIsIdCardOpen(false)}
          branding={branding}
        />
      )}

      {selectedPengumuman && (
        <PengumumanDetailModal
          item={selectedPengumuman}
          onClose={() => setSelectedPengumuman(null)}
        />
      )}
    </AndroidFrame>
  );
}
