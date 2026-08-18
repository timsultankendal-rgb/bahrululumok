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

export default function App() {
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
  const [selectedPengumuman, setSelectedPengumuman] = useState<PengumumanItem | null>(null);

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
        />

        {/* Main Tab Screens Container (Scrollable) */}
        <div className="flex-1 w-full bg-slate-50 overflow-y-auto hide-scrollbar">
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
          {activeTab === '1_daftar_hadir' && <DaftarHadirView />}
          {activeTab === '2_biodata' && <BiodataView />}
          {activeTab === '3_kopas' && <KopasView />}
          {activeTab === '4_dokumentasi' && <DokumentasiView />}
          {activeTab === '5_raport' && <RaportView />}
          {activeTab === '6_jadwal_seragam_mapel' && <JadwalSeragamMapelView />}
          {activeTab === '7_profile_madrasah' && (
            <ProfileMadrasahView onOpenBrandingSettings={() => setIsBrandingModalOpen(true)} />
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
