import React, { useState, useEffect, useMemo } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Clock, 
  Camera, 
  BookOpen, 
  FileText, 
  Award, 
  Wallet, 
  HelpCircle, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Flame, 
  BookMarked,
  MapPin,
  Compass,
  ArrowUpRight,
  Edit3,
  UserCheck,
  MessageSquare,
  UserPlus,
  Shirt,
  RotateCcw,
  CheckCheck,
  Check,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  StudentProfile, 
  TeacherProfile, 
  UserRole, 
  PrayerTime, 
  JadwalItem, 
  TugasItem, 
  MutabaahItem, 
  PengumumanItem,
  PresensiRecord
} from '../../types';
import { JADWAL_SERAGAM_LIST } from '../../data/madrasahCompleteData';
import { JADWAL_PELAJARAN } from '../../data/mockData';
import { playTapSound, playAdzanChime, playSuccessSound } from '../../utils/audio';
import { BerandaConfig, DEFAULT_BERANDA_CONFIG } from '../modals/EditBerandaModal';
import { AppBrandingConfig, DEFAULT_BRANDING } from '../modals/AppBrandingModal';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const PRAYER_ARABIC_NAMES: Record<string, string> = {
  imsak: 'الإمساك',
  subuh: 'الفجر',
  fajar: 'الفجر',
  terbit: 'الشروق',
  syuruq: 'الشروق',
  dhuha: 'الضحى',
  dzuhur: 'الظهر',
  zuhur: 'الظهر',
  ashar: 'العصر',
  asar: 'العصر',
  maghrib: 'المغرب',
  magrib: 'المغرب',
  isya: 'العشاء',
};

interface NextPrayerInfo {
  name: string;
  time: string;
  arabicName: string;
  countdown: string;
  isToday: boolean;
}

function calculateNextPrayer(prayerList: PrayerTime[], now: Date): { nextPrayer: NextPrayerInfo; currentLiveTime: string } {
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTotalSecs = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  const currentLiveTime = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')} WIB`;

  if (!prayerList || prayerList.length === 0) {
    return {
      nextPrayer: {
        name: 'Dzuhur',
        time: '12:00',
        arabicName: 'الظهر',
        countdown: '00:00:00',
        isToday: true,
      },
      currentLiveTime,
    };
  }

  // Parse each prayer into seconds from midnight
  const parsedList = prayerList.map((p) => {
    const timeClean = (p.time || '00:00').trim();
    const [hStr, mStr] = timeClean.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const totalSecs = (isNaN(h) ? 0 : h) * 3600 + (isNaN(m) ? 0 : m) * 60;
    const cleanKey = p.name.toLowerCase().replace(/[^a-z]/g, '');
    const arabic = p.arabicName || PRAYER_ARABIC_NAMES[cleanKey] || 'الصلاة';
    return {
      ...p,
      arabicName: arabic,
      totalSecs,
    };
  });

  // Sort chronologically
  parsedList.sort((a, b) => a.totalSecs - b.totalSecs);

  // Find the first prayer today where totalSecs > currentTotalSecs
  const nextToday = parsedList.find((p) => p.totalSecs > currentTotalSecs);

  if (nextToday) {
    const diffSecs = nextToday.totalSecs - currentTotalSecs;
    const hrs = Math.floor(diffSecs / 3600);
    const mins = Math.floor((diffSecs % 3600) / 60);
    const secs = diffSecs % 60;
    const countdown = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return {
      nextPrayer: {
        name: nextToday.name,
        time: nextToday.time,
        arabicName: nextToday.arabicName,
        countdown,
        isToday: true,
      },
      currentLiveTime,
    };
  }

  // If no upcoming prayer today, the next prayer is the first prayer tomorrow (e.g. Subuh/Imsak)
  const firstTomorrow = parsedList[0];
  const diffSecs = (24 * 3600 - currentTotalSecs) + firstTomorrow.totalSecs;
  const hrs = Math.floor(diffSecs / 3600);
  const mins = Math.floor((diffSecs % 3600) / 60);
  const secs = diffSecs % 60;
  const countdown = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return {
    nextPrayer: {
      name: firstTomorrow.name,
      time: firstTomorrow.time,
      arabicName: firstTomorrow.arabicName,
      countdown,
      isToday: false,
    },
    currentLiveTime,
  };
}

interface HomeTabProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  prayerTimes: PrayerTime[];
  jadwalHariIni: JadwalItem[];
  tugasList: TugasItem[];
  mutabaahList: MutabaahItem[];
  onToggleMutabaah: (id: string) => void;
  onResetMutabaah?: () => void;
  onToggleAllMutabaah?: () => void;
  pengumumanList: PengumumanItem[];
  onOpenPresensi: () => void;
  onOpenTanyaUstadz: () => void;
  onOpenSetoranTahfidz: () => void;
  onOpenCBT: () => void;
  onOpenSPP: () => void;
  onOpenJadwal: () => void;
  onOpenQuran: () => void;
  onOpenDoa: () => void;
  onOpenTasbih: () => void;
  onOpenRaport: () => void;
  onOpenBiodata?: () => void;
  onOpenKopas?: () => void;
  onOpenPSB?: () => void;
  onOpenPengumumanDetail: (item: PengumumanItem) => void;
  presensiHariIni: PresensiRecord | null;
  berandaConfig?: BerandaConfig;
  onOpenEditBeranda?: () => void;
  branding?: AppBrandingConfig;
  onOpenBrandingSettings?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  student,
  teacher,
  activeRole,
  prayerTimes,
  jadwalHariIni,
  tugasList,
  mutabaahList,
  onToggleMutabaah,
  onResetMutabaah,
  onToggleAllMutabaah,
  pengumumanList,
  onOpenPresensi,
  onOpenTanyaUstadz,
  onOpenSetoranTahfidz,
  onOpenCBT,
  onOpenSPP,
  onOpenJadwal,
  onOpenQuran,
  onOpenDoa,
  onOpenTasbih,
  onOpenRaport,
  onOpenBiodata,
  onOpenKopas,
  onOpenPSB,
  onOpenPengumumanDetail,
  presensiHariIni,
  berandaConfig = DEFAULT_BERANDA_CONFIG,
  onOpenEditBeranda,
  branding = DEFAULT_BRANDING,
  onOpenBrandingSettings,
}) => {
  const { canManage } = useAccessPermission('home', activeRole);
  const [adzanSoundEnabled, setAdzanSoundEnabled] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [mutabaahCategoryFilter, setMutabaahCategoryFilter] = useState<string>('Semua');
  const [isMutabaahExpanded, setIsMutabaahExpanded] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activePrayerSchedule = useMemo(() => {
    return (berandaConfig.prayerSchedule && berandaConfig.prayerSchedule.length > 0)
      ? berandaConfig.prayerSchedule
      : prayerTimes;
  }, [berandaConfig.prayerSchedule, prayerTimes]);

  const { nextPrayer, currentLiveTime } = useMemo(() => {
    return calculateNextPrayer(activePrayerSchedule, currentDate);
  }, [activePrayerSchedule, currentDate]);

  const formattedDate = useMemo(() => {
    try {
      return currentDate.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Hari ini';
    }
  }, [currentDate]);

  // Nama hari saat ini dalam bahasa Indonesia
  const currentDayName = useMemo(() => {
    const dayIndex = currentDate.getDay(); // 0 = Ahad/Minggu, 1 = Senin, ...
    const dayNames = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return dayNames[dayIndex] || 'Senin';
  }, [currentDate]);

  // Jadwal seragam hari ini
  const currentSeragam = useMemo(() => {
    try {
      const saved = localStorage.getItem('madrasah_jadwal_seragam_v2');
      const list = saved ? JSON.parse(saved) : JADWAL_SERAGAM_LIST;
      const found = list.find((s: { hari: string }) => {
        const sHari = (s.hari || '').toLowerCase().replace(/[^a-z]/g, '');
        const cHari = currentDayName.toLowerCase().replace(/[^a-z]/g, '');
        return sHari.includes(cHari) || cHari.includes(sHari);
      });
      return found || list.find((s: { hari: string }) => s.hari.toLowerCase().includes('senin')) || list[0];
    } catch {
      return JADWAL_SERAGAM_LIST[2]; // Default Senin
    }
  }, [currentDayName]);

  // Filter jadwal pelajaran sesuai hari saat ini
  const activeJadwalHariIni = useMemo(() => {
    // 1. Coba ambil dari props yang diteruskan jika sudah sesuai hari
    const fromProps = (jadwalHariIni || []).filter((j) => {
      const jHari = (j.hari || '').toLowerCase().replace(/[^a-z]/g, '');
      const cHari = currentDayName.toLowerCase().replace(/[^a-z]/g, '');
      return jHari === cHari || jHari.includes(cHari) || cHari.includes(jHari);
    });

    if (fromProps.length > 0) return fromProps;

    // 2. Jika tidak ada di props, cari di master JADWAL_PELAJARAN
    const fromMaster = JADWAL_PELAJARAN.filter((j) => {
      const jHari = (j.hari || '').toLowerCase().replace(/[^a-z]/g, '');
      const cHari = currentDayName.toLowerCase().replace(/[^a-z]/g, '');
      return jHari === cHari || jHari.includes(cHari) || cHari.includes(jHari);
    });

    if (fromMaster.length > 0) return fromMaster;

    // 3. Fallback jika hari libur atau belum ada jadwal spesifik hari tersebut
    return JADWAL_PELAJARAN.filter((j) => j.hari === 'Senin');
  }, [jadwalHariIni, currentDayName]);

  const completedMutabaah = mutabaahList.filter((m) => m.isDone).length;
  const totalMutabaah = mutabaahList.length;
  const mutabaahPercent = totalMutabaah > 0 ? Math.round((completedMutabaah / totalMutabaah) * 100) : 0;

  const mutabaahCategories = ['Semua', 'Sholat Wajib', 'Sholat Sunnah', 'Tilawah & Dzikir', 'Adab & Akhlak'];

  const filteredMutabaahList = useMemo(() => {
    if (mutabaahCategoryFilter === 'Semua') return mutabaahList;
    return mutabaahList.filter((m) => {
      const kat = (m.kategori || '').toLowerCase();
      const filter = mutabaahCategoryFilter.toLowerCase();
      return kat.includes(filter) || filter.includes(kat);
    });
  }, [mutabaahList, mutabaahCategoryFilter]);

  const displayedMutabaahList = useMemo(() => {
    if (isMutabaahExpanded) return filteredMutabaahList;
    return filteredMutabaahList.slice(0, 5);
  }, [filteredMutabaahList, isMutabaahExpanded]);

  const getCategoryBadgeClass = (category: string) => {
    const c = (category || '').toLowerCase();
    if (c.includes('wajib') || c.includes('fardhu')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (c.includes('sunnah')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    if (c.includes('tilawah') || c.includes('dzikir') || c.includes('quran')) {
      return 'bg-teal-50 text-teal-700 border-teal-200';
    }
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  const handleAdzanChime = () => {
    if (adzanSoundEnabled) {
      playAdzanChime();
    }
    setAdzanSoundEnabled(!adzanSoundEnabled);
  };

  const quickFeatures = [
    {
      id: 'feat-presensi',
      title: 'Presensi GPS',
      subtitle: presensiHariIni ? 'Sudah Masuk' : 'Scan Wajah',
      icon: Camera,
      badge: presensiHariIni ? '✓' : 'Baru',
      badgeColor: presensiHariIni ? 'bg-emerald-600' : 'bg-rose-500',
      bgColor: 'from-emerald-600 to-teal-700',
      action: onOpenPresensi,
    },
    {
      id: 'feat-biodata',
      title: 'Biodata',
      subtitle: 'Data Santri & Guru',
      icon: UserCheck,
      badge: 'Profil',
      badgeColor: 'bg-amber-500',
      bgColor: 'from-amber-600 to-orange-700',
      action: () => {
        if (onOpenBiodata) {
          onOpenBiodata();
        } else {
          onOpenPresensi();
        }
      },
    },
    {
      id: 'feat-kopas',
      title: 'Kopas',
      subtitle: 'Buku Penghubung',
      icon: MessageSquare,
      badge: 'Wali',
      badgeColor: 'bg-teal-600',
      bgColor: 'from-teal-600 to-emerald-800',
      action: () => {
        if (onOpenKopas) {
          onOpenKopas();
        } else {
          onOpenTanyaUstadz();
        }
      },
    },
    {
      id: 'feat-spp',
      title: 'Syahriyah & ADM',
      subtitle: 'Bayar QRIS',
      icon: Wallet,
      badge: 'Tagihan',
      badgeColor: 'bg-rose-500',
      bgColor: 'from-blue-600 to-indigo-700',
      action: onOpenSPP,
    },
    {
      id: 'feat-tanya-ustadz',
      title: 'Tanya Ustadz',
      subtitle: 'Konsultasi AI',
      icon: HelpCircle,
      badge: 'AI 24/7',
      badgeColor: 'bg-emerald-500',
      bgColor: 'from-purple-600 to-indigo-800',
      action: onOpenTanyaUstadz,
    },
    {
      id: 'feat-raport',
      title: 'E-Raport',
      subtitle: 'Nilai Santri',
      icon: FileText,
      bgColor: 'from-sky-600 to-blue-800',
      action: onOpenRaport,
    },
    {
      id: 'feat-jadwal',
      title: 'Jadwal',
      subtitle: 'Seragam & Mapel',
      icon: Calendar,
      badge: 'KBM',
      badgeColor: 'bg-indigo-500',
      bgColor: 'from-indigo-600 to-purple-800',
      action: onOpenJadwal,
    },
    {
      id: 'feat-psb',
      title: 'PSB / PPDB',
      subtitle: 'Syarat Daftar',
      icon: UserPlus,
      badge: 'Baru',
      badgeColor: 'bg-rose-500',
      bgColor: 'from-rose-600 to-pink-700',
      action: () => {
        if (onOpenPSB) {
          onOpenPSB();
        } else {
          onOpenRaport();
        }
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 p-2.5 sm:p-4 pb-24 sm:pb-8 bg-slate-50 min-w-0 max-w-full">
      {/* 1. Header Card with Islamic Pattern & Prayer Widget */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-3 sm:p-4 shadow-lg border border-emerald-500/40">
        {/* Subtle geometric overlay */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Control Bar: Hijri Date, Real Date, Live Clock & Quick Actions */}
        <div className="flex items-center justify-between relative z-10 mb-2.5 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-100 min-w-0 flex-1 flex-wrap">
            <span className="font-extrabold tracking-wider text-amber-300 text-[10px] sm:text-xs truncate">
              {berandaConfig.hijriDate || '14 SAFAR 1448 H'}
            </span>
            <span className="text-emerald-300/80">•</span>
            <span className="text-[9.5px] sm:text-xs text-emerald-100 font-medium truncate">
              {formattedDate}
            </span>
            <span className="text-emerald-300/80 hidden sm:inline">•</span>
            <span className="font-mono font-bold text-amber-200 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-white/10 text-[9px] sm:text-[10px] shrink-0">
              {currentLiveTime}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {canManage && onOpenEditBeranda && (
              <button
                id="btn-edit-beranda"
                onClick={() => {
                  playTapSound();
                  onOpenEditBeranda();
                }}
                className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-full text-[10px] sm:text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95"
                title="Kelola Konten Beranda (Banner, Pengumuman, Sholat)"
              >
                <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Edit Beranda</span>
              </button>
            )}

            <button
              id="adzan-audio-toggle"
              onClick={handleAdzanChime}
              className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/15 hover:bg-white/25 rounded-full text-[10px] sm:text-xs text-white border border-white/20 transition-colors shadow-xs active:scale-95"
              title="Pengingat Suara Adzan"
            >
              {adzanSoundEnabled ? <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" /> : <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70" />}
              <span className="font-semibold">{adzanSoundEnabled ? 'Adzan' : 'Mute'}</span>
            </button>
          </div>
        </div>

        {/* Institution Branding & Logo Row */}
        <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 mb-3">
          <div 
            onClick={() => {
              if (canManage && onOpenBrandingSettings) {
                playTapSound();
                onOpenBrandingSettings();
              }
            }}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 border border-white/30 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm transition-transform ${canManage ? 'cursor-pointer hover:scale-105' : ''}`}
            title={canManage ? 'Klik untuk Mengganti Logo & Identitas Madrasah' : branding.institutionName}
          >
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.appName}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white leading-tight truncate">
                {berandaConfig.bannerTitle || branding.institutionName || 'MTs Al-Ikhlas Kendal'}
              </h2>
              {berandaConfig.bannerBadge && (
                <span className="text-[9px] sm:text-[10px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded uppercase shadow-2xs shrink-0">
                  {berandaConfig.bannerBadge}
                </span>
              )}
            </div>

            {/* Slogan / Subjudul Madrasah (Tampil di HP & Desktop) */}
            {(berandaConfig.bannerSubtitle || branding.appSubtitle) && (
              <p className="text-[10px] sm:text-[11px] text-emerald-100/95 font-medium leading-snug mt-0.5 line-clamp-1">
                {berandaConfig.bannerSubtitle || branding.appSubtitle}
              </p>
            )}

            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="bg-emerald-950/40 text-emerald-200 px-1.5 py-0.2 rounded font-semibold text-[8.5px] sm:text-[9.5px] border border-white/10 truncate max-w-full">
                {branding.portalBadge || 'Portal Madrasah Kemenag RI'}
              </span>
            </div>
          </div>
        </div>

        {/* Next Prayer Highlight Box */}
        <div className="bg-emerald-950/40 border border-white/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 flex items-center justify-between backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-100 flex-wrap">
                <span className="font-medium">Shalat Berikutnya:</span>
                <span className="font-extrabold text-amber-300">
                  {nextPrayer.name} ({nextPrayer.time} WIB)
                </span>
                {!nextPrayer.isToday && (
                  <span className="text-[8.5px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded shadow-2xs">
                    Besok
                  </span>
                )}
              </div>
              <div className="text-[11px] sm:text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-amber-200">-{nextPrayer.countdown}</span>
                <span className="text-[9px] sm:text-[10px] font-normal text-emerald-200 truncate">
                  ({berandaConfig.locationLabel || 'Kendal'})
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 pl-2">
            <div className="font-arabic text-lg sm:text-xl text-amber-300 leading-none">
              {nextPrayer.arabicName}
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-200 font-medium">
              {branding.kemenagText || 'Kemenag RI'}
            </span>
          </div>
        </div>

        {/* Horizontal Prayer Times Bar - Responsive Grid */}
        <div className="mt-2.5 pt-2 border-t border-white/20 grid grid-cols-6 gap-1 text-center text-xs">
          {activePrayerSchedule.map((pt) => {
            const isTarget = pt.name.toLowerCase().trim() === nextPrayer.name.toLowerCase().trim();
            return (
              <div
                key={pt.name}
                className={`py-1 sm:py-1.5 px-0.5 rounded-lg sm:rounded-xl transition-all ${
                  isTarget
                    ? 'bg-amber-400 text-emerald-950 font-extrabold shadow-sm ring-1 ring-amber-300/80 scale-[1.02]'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <div className="text-[9px] sm:text-[10px] uppercase font-bold truncate">{pt.name}</div>
                <div className="text-[10px] sm:text-[11px] font-mono font-bold">{pt.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Presensi Cepat & Status Belajar */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        <button
          id="btn-quick-attendance"
          onClick={onOpenPresensi}
          className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md text-left transition-all group active:scale-[0.98] cursor-pointer min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1 truncate">
              <span>Presensi GPS</span>
              {presensiHariIni && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
              {presensiHariIni ? `${presensiHariIni.jamMasuk} (Hadir)` : 'Tap Check-in'}
            </div>
          </div>
        </button>

        <button
          id="btn-quick-tahfidz-shortcut"
          onClick={onOpenSetoranTahfidz}
          className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500/50 hover:shadow-md text-left transition-all group active:scale-[0.98] cursor-pointer min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">Tahfidz Santri</div>
            <div className="text-[10px] sm:text-[11px] text-emerald-600 font-bold truncate mt-0.5">
              {student.tahfidzProgress.juzMemorized} / {student.tahfidzProgress.targetJuz} Juz
            </div>
          </div>
        </button>
      </div>

      {/* 3. Grid Fitur Utama Madrasah (App Shortcuts) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Layanan Madrasah Digital
          </span>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold">8 Menu Pintas</span>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2">
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                id={`btn-feature-${feat.id}`}
                onClick={() => {
                  playTapSound();
                  feat.action();
                }}
                className="flex flex-col items-center text-center p-1 sm:p-2 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all group focus:outline-none cursor-pointer active:scale-95"
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${feat.bgColor} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform border border-white/20`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {feat.badge && (
                    <span
                      className={`absolute -top-1 -right-1 text-[7px] sm:text-[8px] font-bold text-white px-1 py-0.1 sm:px-1.5 sm:py-0.2 rounded-full ${feat.badgeColor} border border-white shadow-xs`}
                    >
                      {feat.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 mt-1.5 line-clamp-1 group-hover:text-emerald-600 w-full text-center">
                  {feat.title}
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium line-clamp-1 w-full text-center">
                  {feat.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 & 5. Responsive 2-Column Grid on Tablet/Desktop: Jadwal Hari Ini + Mutaba'ah Yaumiyah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 items-stretch">
        {/* Jadwal Pelajaran Hari Ini */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Jadwal Hari Ini ({currentDayName})
                </h3>
              </div>
              <button
                id="btn-view-all-schedule"
                onClick={onOpenJadwal}
                className="text-[11px] sm:text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Kode Seragam Hari Ini */}
            {currentSeragam && (
              <div 
                onClick={onOpenJadwal}
                className="mb-2.5 p-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-between gap-2 cursor-pointer hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <Shirt className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9.5px] text-emerald-800 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <span>Seragam {currentDayName}</span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] font-bold text-slate-800 truncate">
                      {currentSeragam.seragam}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                  Detail
                </span>
              </div>
            )}

            {/* List Mata Pelajaran Hari Ini */}
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {activeJadwalHariIni.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-black text-[11px] sm:text-xs shadow-2xs shrink-0">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">{item.mataPelajaran}</h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{item.guru}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-800 bg-amber-100 px-1.5 sm:px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs inline-block">
                      {item.jamMulai} - {item.jamSelesai}
                    </span>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium mt-0.5">{item.ruang}</div>
                  </div>
                </div>
              ))}

              {activeJadwalHariIni.length === 0 && (
                <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Tidak ada jadwal KBM tatap muka hari ini ({currentDayName})</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mutaba'ah Yaumiyah (Daily Worship Checklist) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-2xs">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Mutaba'ah Yaumiyah (Ibadah)
                  </h3>
                  <span className="text-[9.5px] text-slate-500 font-medium">
                    {completedMutabaah} dari {totalMutabaah} Amalan Selesai
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                {onResetMutabaah && (
                  <button
                    type="button"
                    onClick={() => {
                      playTapSound();
                      onResetMutabaah();
                    }}
                    title="Kosongkan Centang Hari Ini"
                    className="p-1 sm:px-2 sm:py-0.5 rounded-lg border border-slate-200 text-[10px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span className="hidden sm:inline font-semibold">Reset</span>
                  </button>
                )}
                {onToggleAllMutabaah && (
                  <button
                    type="button"
                    onClick={() => {
                      playSuccessSound();
                      onToggleAllMutabaah();
                    }}
                    title="Tandai Selesai Semua"
                    className="p-1 sm:px-2 sm:py-0.5 rounded-lg border border-emerald-200 text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span className="hidden sm:inline font-semibold">Semua</span>
                  </button>
                )}
                <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                  {mutabaahPercent}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2.5 border border-slate-200/50">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${mutabaahPercent}%` }}
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 mb-2 scrollbar-none">
              {mutabaahCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playTapSound();
                    setMutabaahCategoryFilter(cat);
                  }}
                  className={`px-2 py-0.5 text-[9.5px] rounded-lg font-bold shrink-0 transition-all cursor-pointer border ${
                    mutabaahCategoryFilter === cat
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mutaba'ah Items List */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {displayedMutabaahList.map((item) => (
                <button
                  key={item.id}
                  id={`mutabaah-item-${item.id}`}
                  onClick={() => {
                    onToggleMutabaah(item.id);
                    if (!item.isDone) playSuccessSound();
                    else playTapSound();
                  }}
                  className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border transition-all text-left group cursor-pointer active:scale-[0.99] gap-2 ${
                    item.isDone
                      ? 'bg-emerald-50/40 border-emerald-200/80 hover:bg-emerald-50/70'
                      : 'bg-slate-50 border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/20'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {item.isDone ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[11px] sm:text-xs truncate ${
                            item.isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-800 font-semibold'
                          }`}
                        >
                          {item.kegiatan}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[8.5px] px-1.5 py-0.2 rounded-md font-semibold border ${getCategoryBadgeClass(item.kategori)}`}>
                          {item.kategori}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 font-semibold shrink-0 bg-white px-1.5 py-0.5 rounded-md border border-slate-200/80">
                    {item.waktu}
                  </span>
                </button>
              ))}

              {filteredMutabaahList.length === 0 && (
                <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Tidak ada amalan pada kategori ini</p>
                </div>
              )}
            </div>

            {/* Expand / Collapse Button */}
            {filteredMutabaahList.length > 5 && (
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  setIsMutabaahExpanded(!isMutabaahExpanded);
                }}
                className="w-full mt-2.5 py-1.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                {isMutabaahExpanded ? (
                  <>
                    <span>Sembunyikan Sebagian</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Tampilkan Semua ({filteredMutabaahList.length} Amalan)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. Pengumuman & Berita Madrasah */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">
            Pengumuman & Kabar Madrasah
          </span>
          <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold">Terbaru</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
          {(berandaConfig.announcements && berandaConfig.announcements.length > 0 ? berandaConfig.announcements : pengumumanList).map((ann) => (
            <div
              key={ann.id}
              onClick={() => onOpenPengumumanDetail(ann)}
              className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs active:scale-[0.99] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ann.isImportant
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {ann.kategori}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{ann.tanggal}</span>
                </div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {ann.judul}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ann.ringkasan}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
