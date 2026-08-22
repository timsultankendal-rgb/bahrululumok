import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Calendar, 
  Bell, 
  Check, 
  Plus, 
  Trash2, 
  Flame, 
  Clock, 
  Compass, 
  Edit3,
  Layers
} from 'lucide-react';
import { PengumumanItem, PrayerTime, MutabaahItem } from '../../types';
import { playTapSound } from '../../utils/audio';

export interface BerandaConfig {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBadge: string;
  hijriDate: string;
  locationLabel: string;
  announcements: PengumumanItem[];
  prayerSchedule: PrayerTime[];
  mutabaahItems: MutabaahItem[];
}

export const DEFAULT_BERANDA_CONFIG: BerandaConfig = {
  bannerTitle: 'MDT Ula NU 09 Bahrul Ulum Kendal',
  bannerSubtitle: 'Sistem Informasi KBM & Kesiswaan Terpadu',
  bannerBadge: 'Akreditasi A',
  hijriDate: '14 SAFAR 1448 H',
  locationLabel: 'Tunggulsari, Brangsong, Kendal',
  announcements: [
    {
      id: 'ann-1',
      judul: 'Penerimaan Santri Baru (PSB) Gelombang II Telah Dibuka',
      tanggal: '16 Agu 2026',
      kategori: 'PSB',
      penulis: 'Panitia PSB',
      isi: 'Pendaftaran murid baru tahun ajaran 1448 H / 2026 M telah dibuka untuk tingkat Ibtidaiyah dan Tsanawiyah.',
      ringkasan: 'Pendaftaran murid baru tahun ajaran 1448 H / 2026 M telah dibuka untuk tingkat Ibtidaiyah dan Tsanawiyah.',
      isImportant: true
    },
    {
      id: 'ann-2',
      judul: 'Jadwal Imtihan & Haflah Akhirussanah Cawu 1',
      tanggal: '12 Agu 2026',
      kategori: 'Akademik',
      penulis: 'Bagian Kurikulum',
      isi: 'Pelaksanaan ujian Cawu 1 dijadwalkan berlangsung tanggal 10-20 September 2026. Seluruh santri diharap mempersiapkan diri.',
      ringkasan: 'Pelaksanaan ujian Cawu 1 dijadwalkan berlangsung tanggal 10-20 September 2026. Seluruh santri diharap mempersiapkan diri.',
      isImportant: false
    }
  ],
  prayerSchedule: [
    { name: 'Imsak', time: '04:18', arabicName: 'الإمساك' },
    { name: 'Subuh', time: '04:28', arabicName: 'الفجر' },
    { name: 'Terbit', time: '05:44', arabicName: 'الشروق' },
    { name: 'Dhuha', time: '06:08', arabicName: 'الضحى' },
    { name: 'Dzuhur', time: '11:46', arabicName: 'الظهر' },
    { name: 'Ashar', time: '15:06', arabicName: 'العصر' },
    { name: 'Maghrib', time: '17:44', arabicName: 'المغرب' },
    { name: 'Isya', time: '18:54', arabicName: 'العشاء' }
  ],
  mutabaahItems: [
    { id: 'm-1', kegiatan: 'Sholat Shubuh Berjamaah di Masjid', kategori: 'Sholat Wajib', isDone: true, waktu: '04:35 WIB' },
    { id: 'm-2', kegiatan: 'Dzikir Pagi & Ratib Al-Haddad', kategori: 'Tilawah & Dzikir', isDone: true, waktu: '05:15 WIB' },
    { id: 'm-3', kegiatan: 'Sholat Dhuha (2 / 4 Rakaat)', kategori: 'Sholat Sunnah', isDone: true, waktu: '07:15 WIB' },
    { id: 'm-4', kegiatan: 'Tadarus Al-Qur\'an & Ziyadah Tahfidz', kategori: 'Tilawah & Dzikir', isDone: false, waktu: '11:30 WIB' },
    { id: 'm-5', kegiatan: 'Sholat Dzuhur Berjamaah di Masjid', kategori: 'Sholat Wajib', isDone: false, waktu: '12:00 WIB' },
    { id: 'm-6', kegiatan: 'Sholat Ashar Berjamaah & Wirid', kategori: 'Sholat Wajib', isDone: false, waktu: '15:15 WIB' },
    { id: 'm-7', kegiatan: 'Dzikir Petang & Surat Al-Waqi\'ah', kategori: 'Tilawah & Dzikir', isDone: false, waktu: '16:30 WIB' },
    { id: 'm-8', kegiatan: 'Sholat Maghrib Berjamaah & Rawatib', kategori: 'Sholat Wajib', isDone: false, waktu: '18:00 WIB' },
    { id: 'm-9', kegiatan: 'Muthala\'ah Kitab Kuning / Belajar Malam', kategori: 'Adab & Akhlak', isDone: false, waktu: '19:00 WIB' },
    { id: 'm-10', kegiatan: 'Sholat Isya Berjamaah & Sholat Witir', kategori: 'Sholat Wajib', isDone: false, waktu: '19:30 WIB' },
    { id: 'm-11', kegiatan: 'Sholat Qiyamul Lail / Tahajjud', kategori: 'Sholat Sunnah', isDone: false, waktu: '03:15 WIB' },
    { id: 'm-12', kegiatan: 'Sedekah Subuh / Infaq Yaumiyah', kategori: 'Adab & Akhlak', isDone: false, waktu: '05:00 WIB' }
  ]
};

interface EditBerandaModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BerandaConfig;
  onSave: (newConfig: BerandaConfig) => void;
}

export const EditBerandaModal: React.FC<EditBerandaModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'banner' | 'pengumuman' | 'jadwal' | 'mutabaah'>('banner');
  const [form, setForm] = useState<BerandaConfig>(config);

  // New Announcement Form State
  const [newAnn, setNewAnn] = useState<Partial<PengumumanItem>>({
    judul: '',
    kategori: 'Akademik',
    penulis: 'Sekretariat Madrasah',
    ringkasan: '',
    isi: '',
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    isImportant: false
  });

  // New Mutabaah Form State
  const [newMutabaah, setNewMutabaah] = useState({
    kegiatan: '',
    kategori: 'Sholat Sunnah' as const,
    waktu: '06:00'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    onSave(form);
    onClose();
  };

  const handleAddAnnouncement = () => {
    if (!newAnn.judul?.trim() || !newAnn.ringkasan?.trim()) {
      alert('Mohon lengkapi judul dan ringkasan pengumuman');
      return;
    }
    playTapSound();
    const item: PengumumanItem = {
      id: `ann-${Date.now()}`,
      judul: newAnn.judul,
      kategori: newAnn.kategori || 'Umum',
      penulis: newAnn.penulis || 'Sekretariat',
      isi: newAnn.ringkasan,
      ringkasan: newAnn.ringkasan,
      tanggal: newAnn.tanggal || 'Hari ini',
      isImportant: !!newAnn.isImportant
    };
    setForm({
      ...form,
      announcements: [item, ...form.announcements]
    });
    setNewAnn({
      judul: '',
      kategori: 'Akademik',
      penulis: 'Sekretariat Madrasah',
      ringkasan: '',
      isi: '',
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      isImportant: false
    });
  };

  const handleDeleteAnnouncement = (id: string) => {
    playTapSound();
    setForm({
      ...form,
      announcements: form.announcements.filter((a) => a.id !== id)
    });
  };

  const handleAddMutabaah = () => {
    if (!newMutabaah.kegiatan.trim()) {
      alert('Mohon isi nama kegiatan');
      return;
    }
    playTapSound();
    const item: MutabaahItem = {
      id: `mut-${Date.now()}`,
      kegiatan: newMutabaah.kegiatan,
      kategori: newMutabaah.kategori,
      waktu: newMutabaah.waktu,
      isDone: false
    };
    setForm({
      ...form,
      mutabaahItems: [...form.mutabaahItems, item]
    });
    setNewMutabaah({ kegiatan: '', kategori: 'Sholat Sunnah', waktu: '06:00' });
  };

  const handleDeleteMutabaah = (id: string) => {
    playTapSound();
    setForm({
      ...form,
      mutabaahItems: form.mutabaahItems.filter((m) => m.id !== id)
    });
  };

  const handlePrayerChange = (index: number, timeVal: string) => {
    const updated = [...form.prayerSchedule];
    updated[index] = { ...updated[index], time: timeVal };
    setForm({ ...form, prayerSchedule: updated });
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan seluruh susunan Beranda ke data awal bawaan?')) {
      playTapSound();
      setForm(DEFAULT_BERANDA_CONFIG);
      onSave(DEFAULT_BERANDA_CONFIG);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Edit3 className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">Kelola & Edit Konten Beranda</h3>
              <p className="text-[10px] text-emerald-200">Kustomisasi Banner, Pengumuman, Sholat & Ibadah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 overflow-x-auto hide-scrollbar shrink-0">
          {[
            { id: 'banner', label: 'Banner & Hijriyah', icon: Layers },
            { id: 'pengumuman', label: `Pengumuman (${form.announcements.length})`, icon: Bell },
            { id: 'jadwal', label: 'Waktu Sholat', icon: Clock },
            { id: 'mutabaah', label: `Ibadah Santri (${form.mutabaahItems.length})`, icon: Flame }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playTapSound();
                  setActiveSubTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-emerald-800 border-slate-200 border-b-transparent -mb-px'
                    : 'bg-transparent text-slate-500 hover:text-slate-700 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* 1. Sub-Tab: Banner & Header */}
          {activeSubTab === 'banner' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-[11px] font-extrabold text-emerald-900 block mb-1">
                  💡 Tips Banner Beranda:
                </span>
                <p className="text-[10px] text-emerald-700 leading-relaxed">
                  Data ini ditampilkan pada kartu paling atas Beranda aplikasi, mencakup nama madrasah, tanggal kalender Hijriyah, dan penanda akreditasi.
                </p>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Nama Lembaga / Judul Banner:
                </label>
                <input
                  type="text"
                  required
                  value={form.bannerTitle}
                  onChange={(e) => setForm({ ...form, bannerTitle: e.target.value })}
                  placeholder="Contoh: MDT Ula NU 09 Bahrul Ulum Kendal"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Label Badge / Akreditasi:
                  </label>
                  <input
                    type="text"
                    value={form.bannerBadge}
                    onChange={(e) => setForm({ ...form, bannerBadge: e.target.value })}
                    placeholder="Contoh: Akreditasi A / Salafiyah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Tanggal Hijriyah Manual / Otomatis:
                  </label>
                  <input
                    type="text"
                    value={form.hijriDate}
                    onChange={(e) => setForm({ ...form, hijriDate: e.target.value })}
                    placeholder="Contoh: 14 SAFAR 1448 H"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Slogan / Subjudul Beranda:
                </label>
                <input
                  type="text"
                  value={form.bannerSubtitle}
                  onChange={(e) => setForm({ ...form, bannerSubtitle: e.target.value })}
                  placeholder="Contoh: Sistem Informasi KBM & Kesiswaan Terpadu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Keterangan Wilayah / Lokasi Jadwal Sholat:
                </label>
                <input
                  type="text"
                  value={form.locationLabel}
                  onChange={(e) => setForm({ ...form, locationLabel: e.target.value })}
                  placeholder="Contoh: Kendal & Sekitarnya / Jawa Tengah"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>
            </div>
          )}

          {/* 2. Sub-Tab: Pengumuman Beranda */}
          {activeSubTab === 'pengumuman' && (
            <div className="space-y-4">
              {/* Form Tambah Pengumuman */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <span className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  Tambah Pengumuman Baru:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Judul Pengumuman..."
                      value={newAnn.judul}
                      onChange={(e) => setNewAnn({ ...newAnn, judul: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={newAnn.kategori}
                      onChange={(e) => setNewAnn({ ...newAnn, kategori: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="PSB">PSB</option>
                      <option value="Keuangan">Keuangan</option>
                      <option value="Kegiatan">Kegiatan</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Tulis ringkasan isi pengumuman..."
                  value={newAnn.ringkasan}
                  onChange={(e) => setNewAnn({ ...newAnn, ringkasan: e.target.value, isi: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-bold">
                    <input
                      type="checkbox"
                      checked={newAnn.isImportant}
                      onChange={(e) => setNewAnn({ ...newAnn, isImportant: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Tandai Sebagai Pengumuman Penting</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleAddAnnouncement}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambahkan</span>
                  </button>
                </div>
              </div>

              {/* Daftar Pengumuman Eksis */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-700 text-xs block">
                  Daftar Pengumuman Beranda Saat Ini ({form.announcements.length}):
                </span>
                {form.announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start justify-between gap-2 hover:border-emerald-300 transition-all shadow-2xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${ann.isImportant ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {ann.kategori}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{ann.tanggal}</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs truncate">{ann.judul}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ann.ringkasan}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Hapus Pengumuman"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Sub-Tab: Waktu Sholat */}
          {activeSubTab === 'jadwal' && (
            <div className="space-y-3">
              <span className="font-extrabold text-slate-700 text-xs block">
                Sesuaikan Jam Jadwal Shalat (Format 24 Jam):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {form.prayerSchedule.map((pt, idx) => (
                  <div key={pt.name} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <span className="font-black text-slate-700 text-xs block uppercase">{pt.name}</span>
                    <input
                      type="text"
                      value={pt.time}
                      onChange={(e) => handlePrayerChange(idx, e.target.value)}
                      placeholder="04:30"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-center text-xs focus:outline-emerald-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Sub-Tab: Mutaba'ah Ibadah Santri */}
          {activeSubTab === 'mutabaah' && (
            <div className="space-y-4">
              {/* Form Tambah Kegiatan */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama Ibadah / Kegiatan Santri..."
                  value={newMutabaah.kegiatan}
                  onChange={(e) => setNewMutabaah({ ...newMutabaah, kegiatan: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-semibold text-xs"
                />
                <input
                  type="text"
                  placeholder="06:00"
                  value={newMutabaah.waktu}
                  onChange={(e) => setNewMutabaah({ ...newMutabaah, waktu: e.target.value })}
                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl font-mono text-center text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddMutabaah}
                  className="w-full sm:w-auto px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer shrink-0"
                >
                  Tambah
                </button>
              </div>

              {/* List Kegiatan Mutabaah */}
              <div className="space-y-1.5">
                {form.mutabaahItems.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold text-slate-800 text-xs">{m.kegiatan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[10px]">{m.waktu}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMutabaah(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bawaan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Beranda</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
