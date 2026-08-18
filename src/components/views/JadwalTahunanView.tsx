import React, { useState } from 'react';
import { 
  CalendarRange, 
  Calendar, 
  Clock, 
  Sparkles, 
  Search, 
  Tag,
  Bookmark
} from 'lucide-react';
import { JADWAL_TAHUNAN_LIST } from '../../data/madrasahCompleteData';
import { KegiatanTahunanItem } from '../../types';
import { playTapSound } from '../../utils/audio';

export const JadwalTahunanView: React.FC = () => {
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredList = JADWAL_TAHUNAN_LIST.filter((j) => {
    const matchKategori = selectedKategori === 'Semua' || j.kategori === selectedKategori;
    const matchQuery =
      j.namaKegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.bulan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.keterangan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchQuery;
  });

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 12
            </span>
            <span className="text-teal-100 text-xs font-semibold">Kalender Pendidikan Madrasah</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">12. JADWAL KEGIATAN TAHUNAN</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Agenda PHBI, Imtihan Syafahi/Tahriri, Khutbatul Iftitah & Haflah Akhirussanah
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <CalendarRange className="w-4 h-4 text-amber-300 inline mr-1.5" />
          <span>Tahun 1447 - 1448 H</span>
        </div>
      </div>

      {/* Filter Chips & Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          {['Semua', 'PHBI', 'Imtihan & Ujian', 'Khutbatul Arsy', 'Haflah Akhirussanah', 'Ziarah', 'Libur'].map((k) => (
            <button
              key={k}
              onClick={() => {
                playTapSound();
                setSelectedKategori(k);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                selectedKategori === k
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kegiatan / bulan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Timeline Calendar List */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-200 text-teal-900 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-black uppercase text-teal-700">Bulan</span>
                <span className="text-xs font-black">{item.bulan}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    item.kategori === 'PHBI'
                      ? 'bg-purple-100 text-purple-800'
                      : item.kategori === 'Imtihan & Ujian'
                      ? 'bg-amber-100 text-amber-800'
                      : item.kategori === 'Haflah Akhirussanah'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.kategori}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {item.tanggalMulai} s/d {item.tanggalSelesai}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                  {item.namaKegiatan}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.keterangan}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
