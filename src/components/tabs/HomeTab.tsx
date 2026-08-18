import React, { useState, useEffect } from 'react';
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
  Edit3
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
import { playTapSound, playAdzanChime, playSuccessSound } from '../../utils/audio';
import { BerandaConfig, DEFAULT_BERANDA_CONFIG } from '../modals/EditBerandaModal';

interface HomeTabProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  prayerTimes: PrayerTime[];
  jadwalHariIni: JadwalItem[];
  tugasList: TugasItem[];
  mutabaahList: MutabaahItem[];
  onToggleMutabaah: (id: string) => void;
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
  onOpenPengumumanDetail: (item: PengumumanItem) => void;
  presensiHariIni: PresensiRecord | null;
  berandaConfig?: BerandaConfig;
  onOpenEditBeranda?: () => void;
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
  onOpenPengumumanDetail,
  presensiHariIni,
  berandaConfig = DEFAULT_BERANDA_CONFIG,
  onOpenEditBeranda,
}) => {
  const [adzanSoundEnabled, setAdzanSoundEnabled] = useState<boolean>(true);
  const [nextPrayerCountdown, setNextPrayerCountdown] = useState<string>('01:24:10');

  useEffect(() => {
    const timer = setInterval(() => {
      // simulate live countdown
      const now = new Date();
      const mins = 59 - now.getMinutes();
      const secs = 59 - now.getSeconds();
      setNextPrayerCountdown(`01:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completedMutabaah = mutabaahList.filter((m) => m.isDone).length;
  const mutabaahPercent = Math.round((completedMutabaah / mutabaahList.length) * 100);

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
      id: 'feat-cbt',
      title: 'Ujian CBT',
      subtitle: 'PTS Online',
      icon: Award,
      badge: 'Aktif',
      badgeColor: 'bg-amber-500',
      bgColor: 'from-amber-600 to-orange-700',
      action: onOpenCBT,
    },
    {
      id: 'feat-tahfidz',
      title: 'Tahfidz Qur\'an',
      subtitle: `${student.tahfidzProgress.juzMemorized} / ${student.tahfidzProgress.targetJuz} Juz`,
      icon: BookOpen,
      bgColor: 'from-teal-600 to-emerald-800',
      action: onOpenSetoranTahfidz,
    },
    {
      id: 'feat-spp',
      title: 'SPP & Infaq',
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
      id: 'feat-tasbih',
      title: 'Tasbih Digital',
      subtitle: 'Dzikir Harian',
      icon: Sparkles,
      bgColor: 'from-emerald-700 to-teal-900',
      action: onOpenTasbih,
    },
    {
      id: 'feat-doa',
      title: 'Doa Harian',
      subtitle: 'Hadits Pilihan',
      icon: BookMarked,
      bgColor: 'from-amber-700 to-yellow-800',
      action: onOpenDoa,
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 pb-8 bg-slate-50">
      {/* 1. Header Card with Islamic Pattern & Prayer Widget */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-4 shadow-lg border border-emerald-500/40">
        {/* Subtle geometric overlay */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-100">
              <span className="font-bold tracking-wider text-amber-300">{berandaConfig.hijriDate || '14 SAFAR 1448 H'}</span>
              <span>•</span>
              <span>18 Agustus 2026</span>
            </div>
            <h2 className="text-lg font-extrabold text-white mt-0.5 flex items-center gap-1.5">
              <span>{berandaConfig.bannerTitle || 'MTs Al-Ikhlas Kendal'}</span>
              {berandaConfig.bannerBadge && (
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded uppercase shadow-xs">
                  {berandaConfig.bannerBadge}
                </span>
              )}
            </h2>
            {berandaConfig.bannerSubtitle && (
              <p className="text-[11px] text-emerald-100/90 font-medium line-clamp-1 mt-0.5">
                {berandaConfig.bannerSubtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenEditBeranda && (
              <button
                id="btn-edit-beranda"
                onClick={() => {
                  playTapSound();
                  onOpenEditBeranda();
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-full text-xs font-black transition-all shadow-xs cursor-pointer"
                title="Kelola Konten Beranda (Banner, Pengumuman, Sholat)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[11px]">Edit Beranda</span>
              </button>
            )}

            <button
              id="adzan-audio-toggle"
              onClick={handleAdzanChime}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-full text-xs text-white border border-white/20 transition-colors shadow-xs"
              title="Pengingat Suara Adzan"
            >
              {adzanSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-white/70" />}
              <span className="text-[11px] font-semibold">{adzanSoundEnabled ? 'Adzan On' : 'Mute'}</span>
            </button>
          </div>
        </div>

        {/* Next Prayer Highlight Box */}
        <div className="bg-emerald-950/40 border border-white/20 rounded-2xl p-3 flex items-center justify-between backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-100">
                <span className="font-medium">Shalat Berikutnya</span>
                <span className="font-extrabold text-amber-300">Ashar (15:08 WIB)</span>
              </div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1 mt-0.5">
                <span>-{nextPrayerCountdown}</span>
                <span className="text-[10px] font-normal text-emerald-200">({berandaConfig.locationLabel || 'Kendal & sekitarnya'})</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-arabic text-xl text-amber-300 leading-none">العصر</div>
            <span className="text-[10px] text-emerald-200 font-medium">Kemenag RI</span>
          </div>
        </div>

        {/* Horizontal Prayer Times Bar */}
        <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between overflow-x-auto hide-scrollbar gap-2 text-center text-xs">
          {(berandaConfig.prayerSchedule && berandaConfig.prayerSchedule.length > 0 ? berandaConfig.prayerSchedule : prayerTimes).map((pt) => {
            const isTarget = pt.name === 'Ashar';
            return (
              <div
                key={pt.name}
                className={`flex-1 min-w-[52px] py-1.5 px-1 rounded-xl transition-all ${
                  isTarget
                    ? 'bg-amber-400 text-emerald-950 font-extrabold shadow-sm'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">{pt.name}</div>
                <div className="text-[11px] font-mono font-bold">{pt.time}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Presensi Cepat & Status Belajar */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          id="btn-quick-attendance"
          onClick={onOpenPresensi}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500/50 hover:shadow-md text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>Presensi GPS</span>
              {presensiHariIni && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
              {presensiHariIni ? `${presensiHariIni.jamMasuk} (Hadir)` : 'Tap untuk Check-in'}
            </div>
          </div>
        </button>

        <button
          id="btn-quick-tahfidz-shortcut"
          onClick={onOpenSetoranTahfidz}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500/50 hover:shadow-md text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Tahfidz Santri</div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
              {student.tahfidzProgress.juzMemorized} Juz Mutqin
            </div>
          </div>
        </button>
      </div>

      {/* 3. Grid Fitur Utama Madrasah (App Shortcuts) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Layanan Madrasah Digital
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">Menu Terpadu</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
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
                className="flex flex-col items-center text-center p-2 rounded-2xl hover:bg-slate-50 transition-all group focus:outline-none"
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.bgColor} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform border border-white/20`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {feat.badge && (
                    <span
                      className={`absolute -top-1 -right-1 text-[8px] font-bold text-white px-1.5 py-0.2 rounded-full ${feat.badgeColor} border border-white shadow-xs`}
                    >
                      {feat.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-slate-700 mt-2 line-clamp-1 group-hover:text-emerald-600">
                  {feat.title}
                </span>
                <span className="text-[9px] text-slate-500 font-medium line-clamp-1">{feat.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Jadwal Pelajaran Hari Ini */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Jadwal Hari Ini (Senin)
            </h3>
          </div>
          <button
            id="btn-view-all-schedule"
            onClick={onOpenJadwal}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {jadwalHariIni.slice(0, 3).map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs shadow-2xs">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.mataPelajaran}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.guru}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                  {item.jamMulai} - {item.jamSelesai}
                </span>
                <div className="text-[10px] text-slate-500 font-medium mt-1">{item.ruang}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Mutaba'ah Yaumiyah (Daily Worship Checklist) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Mutaba'ah Yaumiyah (Ibadah)
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
            {mutabaahPercent}% Selesai
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${mutabaahPercent}%` }}
          />
        </div>

        <div className="flex flex-col gap-2">
          {(berandaConfig.mutabaahItems && berandaConfig.mutabaahItems.length > 0 ? berandaConfig.mutabaahItems : mutabaahList).map((item) => (
            <button
              key={item.id}
              id={`mutabaah-item-${item.id}`}
              onClick={() => {
                onToggleMutabaah(item.id);
                if (!item.isDone) playSuccessSound();
                else playTapSound();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                {item.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                )}
                <span
                  className={`text-xs ${
                    item.isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-700 font-semibold'
                  }`}
                >
                  {item.kegiatan}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-medium">{item.waktu}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Pengumuman & Berita Madrasah */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Pengumuman & Kabar Madrasah
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">Terbaru</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {(berandaConfig.announcements && berandaConfig.announcements.length > 0 ? berandaConfig.announcements : pengumumanList).map((ann) => (
            <div
              key={ann.id}
              onClick={() => onOpenPengumumanDetail(ann)}
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/70 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ann.isImportant
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {ann.kategori}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{ann.tanggal}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {ann.judul}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ann.ringkasan}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
