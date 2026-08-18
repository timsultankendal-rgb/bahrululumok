import React, { useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles,
  Search
} from 'lucide-react';
import { CATATAN_KEGIATAN_LIST } from '../../data/madrasahCompleteData';
import { CatatanKegiatanItem } from '../../types';
import { playTapSound } from '../../utils/audio';

export const CatatanKegiatanView: React.FC = () => {
  const [kegiatanList, setKegiatanList] = useState<CatatanKegiatanItem[]>(CATATAN_KEGIATAN_LIST);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newHari, setNewHari] = useState<string>('Senin');
  const [newTanggal, setNewTanggal] = useState<string>('');
  const [newKeterangan, setNewKeterangan] = useState<string>('');
  const [newTempat, setNewTempat] = useState<string>('');
  const [newPJ, setNewPJ] = useState<string>('');

  const filteredList = kegiatanList.filter((k) =>
    k.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.tempat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTanggal || !newKeterangan || !newTempat) return;
    playTapSound();

    const newItem: CatatanKegiatanItem = {
      id: `ck-${Date.now()}`,
      hari: newHari,
      tanggal: newTanggal,
      keterangan: newKeterangan,
      tempat: newTempat,
      penanggungJawab: newPJ || 'Dewan Asatidz',
      status: 'Akan Datang'
    };

    setKegiatanList([newItem, ...kegiatanList]);
    setNewTanggal('');
    setNewKeterangan('');
    setNewTempat('');
    setNewPJ('');
    setIsAdding(false);
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 8
            </span>
            <span className="text-teal-100 text-xs font-semibold">Logbook & Notulensi Harian</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">8. CATATAN KEGIATAN MADRASAH</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Agenda Kegiatan Harian: Hari, Tanggal, Keterangan, & Lokasi Tempat
          </p>
        </div>

        <button
          onClick={() => {
            playTapSound();
            setIsAdding(!isAdding);
          }}
          className="px-3.5 py-2 bg-white text-teal-900 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xs hover:bg-teal-50 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Batal Tambah' : 'Tambah Catatan Baru'}</span>
        </button>
      </div>

      {/* Add Form Collapse */}
      {isAdding && (
        <form onSubmit={handleAddKegiatan} className="bg-white p-4 rounded-3xl border border-emerald-300 shadow-md space-y-3 animate-fadeIn">
          <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            Input Catatan Kegiatan Baru
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Hari:</label>
              <select
                value={newHari}
                onChange={(e) => setNewHari(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Ahad'].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Tanggal (contoh: 25 Agustus 2026):</label>
              <input
                type="text"
                required
                placeholder="25 Agustus 2026"
                value={newTanggal}
                onChange={(e) => setNewTanggal(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-600 block mb-1">Keterangan Kegiatan:</label>
              <textarea
                required
                rows={2}
                placeholder="Tulis rincian agenda kegiatan..."
                value={newKeterangan}
                onChange={(e) => setNewKeterangan(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Tempat / Lokasi:</label>
              <input
                type="text"
                required
                placeholder="Masjid Jamie' / Aula Lt. 2"
                value={newTempat}
                onChange={(e) => setNewTempat(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">Penanggung Jawab:</label>
              <input
                type="text"
                placeholder="Nama Ustadz / Panitia"
                value={newPJ}
                onChange={(e) => setNewPJ(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 text-white font-black rounded-xl text-xs hover:bg-emerald-700"
            >
              Simpan Kegiatan
            </button>
          </div>
        </form>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari catatan agenda / tempat / penanggung jawab..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-emerald-500 shadow-xs font-medium"
        />
      </div>

      {/* List of Catatan Kegiatan */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900">
                  {item.hari}
                </span>
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {item.tanggal}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                  item.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'Sedang Berlangsung'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                {item.keterangan}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {item.tempat}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PJ: {item.penanggungJawab}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
