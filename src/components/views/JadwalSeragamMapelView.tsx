import React, { useState, useEffect } from 'react';
import { 
  Shirt, 
  BookOpen, 
  Calendar, 
  Clock, 
  UserCheck, 
  Layers, 
  Filter, 
  CheckCircle2,
  Sparkles,
  Edit2,
  Plus,
  Trash2,
  Save,
  X,
  Check
} from 'lucide-react';
import { JADWAL_SERAGAM_LIST, MAPEL_KTSP_LIST } from '../../data/madrasahCompleteData';
import { JadwalSeragamItem, MapelKTSPItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_SERAGAM = 'madrasah_jadwal_seragam_v2';
const STORAGE_KEY_MAPEL = 'madrasah_jadwal_mapel_v2';

interface JadwalSeragamMapelViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const JadwalSeragamMapelView: React.FC<JadwalSeragamMapelViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('6_jadwal_seragam_mapel', activeRole, explicitCanEdit);
  const [activeTab, setActiveTab] = useState<'seragam' | 'mapel'>('seragam');
  const [selectedCawu, setSelectedCawu] = useState<string>('Cawu 1');
  const [selectedHari, setSelectedHari] = useState<string>('Semua');

  const [seragamList, setSeragamList] = useState<JadwalSeragamItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERAGAM);
      if (saved) return JSON.parse(saved);
    } catch {}
    return JADWAL_SERAGAM_LIST;
  });

  const [mapelList, setMapelList] = useState<MapelKTSPItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAPEL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return MAPEL_KTSP_LIST;
  });

  // Modal State for Seragam
  const [editingSeragam, setEditingSeragam] = useState<JadwalSeragamItem | null>(null);
  const [seragamForm, setSeragamForm] = useState<JadwalSeragamItem>({
    hari: '',
    seragam: '',
    warna: 'from-emerald-600 to-teal-700',
    keterangan: ''
  });

  // Modal State for Mapel
  const [isMapelModalOpen, setIsMapelModalOpen] = useState(false);
  const [editingMapel, setEditingMapel] = useState<MapelKTSPItem | null>(null);
  const [mapelForm, setMapelForm] = useState<Omit<MapelKTSPItem, 'id'>>({
    hari: 'Sabtu',
    mapel: '',
    kitabRujukan: '',
    guruPengajar: '',
    kelas: 'Kelas 1',
    jam: '14.00 - 14.45 WIB',
    cawu: 'Cawu 1'
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredMapel = mapelList.filter((m) => {
    const matchCawu = m.cawu === selectedCawu;
    const matchHari = selectedHari === 'Semua' || m.hari === selectedHari;
    return matchCawu && matchHari;
  });

  // Save Seragam
  const handleOpenEditSeragam = (srg: JadwalSeragamItem) => {
    playTapSound();
    setEditingSeragam(srg);
    setSeragamForm({ ...srg });
  };

  const handleSaveSeragam = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    const updated = seragamList.map((s) => s.hari === editingSeragam?.hari ? seragamForm : s);
    setSeragamList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_SERAGAM, JSON.stringify(updated));
    } catch {}
    setEditingSeragam(null);
    showToast(`Jadwal seragam hari ${seragamForm.hari} berhasil diperbarui!`);
  };

  // Save Mapel
  const handleOpenAddMapel = () => {
    playTapSound();
    setEditingMapel(null);
    setMapelForm({
      hari: selectedHari !== 'Semua' ? selectedHari : 'Sabtu',
      mapel: '',
      kitabRujukan: '',
      guruPengajar: '',
      kelas: 'Kelas 1',
      jam: '14.00 - 14.45 WIB',
      cawu: selectedCawu
    });
    setIsMapelModalOpen(true);
  };

  const handleOpenEditMapel = (mp: MapelKTSPItem) => {
    playTapSound();
    setEditingMapel(mp);
    setMapelForm({
      hari: mp.hari,
      mapel: mp.mapel,
      kitabRujukan: mp.kitabRujukan,
      guruPengajar: mp.guruPengajar,
      kelas: mp.kelas,
      jam: mp.jam,
      cawu: mp.cawu
    });
    setIsMapelModalOpen(true);
  };

  const handleSaveMapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapelForm.mapel.trim()) return;
    playTapSound();

    let updated: MapelKTSPItem[];
    if (editingMapel) {
      updated = mapelList.map((m) => m.id === editingMapel.id ? { ...mapelForm, id: editingMapel.id } : m);
      showToast(`Jadwal mapel "${mapelForm.mapel}" berhasil disimpan.`);
    } else {
      const newItem: MapelKTSPItem = {
        ...mapelForm,
        id: `mp-${Date.now()}`
      };
      updated = [newItem, ...mapelList];
      showToast(`Jadwal mapel "${mapelForm.mapel}" berhasil ditambahkan.`);
    }

    setMapelList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_MAPEL, JSON.stringify(updated));
    } catch {}
    setIsMapelModalOpen(false);
  };

  const handleDeleteMapel = (mp: MapelKTSPItem) => {
    if (window.confirm(`Hapus jadwal mata pelajaran "${mp.mapel}"?`)) {
      playTapSound();
      const updated = mapelList.filter((m) => m.id !== mp.id);
      setMapelList(updated);
      try {
        localStorage.setItem(STORAGE_KEY_MAPEL, JSON.stringify(updated));
      } catch {}
      showToast(`Jadwal mapel "${mp.mapel}" telah dihapus.`);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 6
            </span>
            <span className="text-teal-100 text-xs font-semibold">Kurikulum KTSP+ & Tata Tertib Busana</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">
            6. JADWAL SERAGAM & MAPEL KTSP+
          </h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Jadwal Harian Seragam Santri & Mata Pelajaran Kelas 1-6 Per Caturwulan
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>Tahun Ajaran 2026/2027</span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveTab('seragam');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'seragam'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>1. JADWAL PAKAI SERAGAM</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('mapel');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'mapel'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. MATA PELAJARAN KTSP+ (KELAS 1-6)</span>
        </button>
      </div>

      {/* SUB-SECTION 1: JADWAL PAKAI SERAGAM */}
      {activeTab === 'seragam' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {seragamList.map((srg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
                      HARI {srg.hari.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEditSeragam(srg)}
                          className="p-1 rounded-lg text-teal-700 hover:bg-teal-50"
                          title="Edit Seragam Ini"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <Shirt className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${srg.warna} text-white shadow-xs`}>
                    <h3 className="font-extrabold text-sm">{srg.seragam}</h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {srg.keterangan}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Ketentuan Seragam */}
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 text-xs text-amber-900 space-y-1.5">
            <span className="font-extrabold text-sm block">⚠️ Catatan & Ketentuan Pemakaian Seragam:</span>
            <p>• Santri Putra wajib memakai kopyah hitam polos/bordir madrasah dan kancing baju terpasang rapi.</p>
            <p>• Santri Putri wajib memakai jilbab berlogo madrasah yang menutup dada dengan inner kerudung rapi.</p>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: JADWAL MATA PELAJARAN KTSP+ */}
      {activeTab === 'mapel' && (
        <div className="space-y-4">
          {/* Cawu Filter & Hari Filter (Responsive Grid) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Cawu Chips */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-600">Caturwulan:</span>
                <div className="grid grid-cols-3 gap-1 sm:flex">
                  {['Cawu 1', 'Cawu 2', 'Cawu 3'].map((cawu) => (
                    <button
                      key={cawu}
                      onClick={() => {
                        playTapSound();
                        setSelectedCawu(cawu);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        selectedCawu === cawu
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cawu}
                    </button>
                  ))}
                </div>
              </div>

              {canEdit && (
                <button
                  onClick={handleOpenAddMapel}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Jadwal Mapel</span>
                </button>
              )}
            </div>

            {/* Responsive Day Filter */}
            <div className="w-full pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1 mb-1.5 sm:hidden">
                <span className="text-[11px] font-bold text-slate-500">Pilih Hari:</span>
                <span className="text-[10px] text-teal-800 font-bold bg-teal-100 px-2 py-0.5 rounded-md">{selectedHari}</span>
              </div>
              <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 w-full">
                {['Semua', 'Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis'].map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      playTapSound();
                      setSelectedHari(h);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                      selectedHari === h
                        ? 'bg-teal-700 text-white shadow-2xs font-black ring-2 ring-teal-400/40'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Mapel */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Daftar Mata Pelajaran & Guru Pengajar ({selectedCawu})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {filteredMapel.length} Jam Pelajaran Terjadwal
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredMapel.map((mp, idx) => (
                <div
                  key={mp.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 font-black text-xs flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] uppercase font-bold text-emerald-700">{mp.hari}</span>
                      <span className="text-xs">{idx + 1}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{mp.mapel}</h4>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.2 rounded-md">
                          {mp.kelas}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        Kitab Rujukan: {mp.kitabRujukan}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                        Guru Pengajar: <strong className="text-slate-700">{mp.guruPengajar}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{mp.jam}</span>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditMapel(mp)}
                          className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50"
                          title="Edit Jadwal Mapel"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMapel(mp)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Hapus Jadwal Mapel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Seragam */}
      {editingSeragam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-teal-600" />
                Edit Seragam Hari {editingSeragam.hari}
              </h3>
              <button
                onClick={() => setEditingSeragam(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSeragam} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama / Jenis Seragam:
                </label>
                <input
                  type="text"
                  value={seragamForm.seragam}
                  onChange={(e) => setSeragamForm({ ...seragamForm, seragam: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Kelengkapan:
                </label>
                <textarea
                  rows={2}
                  value={seragamForm.keterangan}
                  onChange={(e) => setSeragamForm({ ...seragamForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSeragam(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-teal-700 hover:bg-teal-800 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Seragam</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Mapel */}
      {isMapelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                {editingMapel ? 'Edit Jadwal Mata Pelajaran' : 'Tambah Jadwal Mata Pelajaran'}
              </h3>
              <button
                onClick={() => setIsMapelModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMapel} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Hari:</label>
                  <select
                    value={mapelForm.hari}
                    onChange={(e) => setMapelForm({ ...mapelForm, hari: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  >
                    {['Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kelas:</label>
                  <select
                    value={mapelForm.kelas}
                    onChange={(e) => setMapelForm({ ...mapelForm, kelas: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  >
                    {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
                <input
                  type="text"
                  value={mapelForm.mapel}
                  onChange={(e) => setMapelForm({ ...mapelForm, mapel: e.target.value })}
                  placeholder="Contoh: Fiqih (Safinatun Najah)"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kitab Rujukan:</label>
                <input
                  type="text"
                  value={mapelForm.kitabRujukan}
                  onChange={(e) => setMapelForm({ ...mapelForm, kitabRujukan: e.target.value })}
                  placeholder="Contoh: Matan Safinah An-Najah"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Guru Pengajar:</label>
                  <input
                    type="text"
                    value={mapelForm.guruPengajar}
                    onChange={(e) => setMapelForm({ ...mapelForm, guruPengajar: e.target.value })}
                    placeholder="Contoh: Ust. Ahmad Mufid"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Jam Belajar:</label>
                  <input
                    type="text"
                    value={mapelForm.jam}
                    onChange={(e) => setMapelForm({ ...mapelForm, jam: e.target.value })}
                    placeholder="14.00 - 14.45 WIB"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMapelModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingMapel ? 'Simpan Perubahan' : 'Tambah Mapel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
