import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  Search, 
  Calendar, 
  Sparkles, 
  Medal, 
  ShieldCheck 
} from 'lucide-react';
import { PRESTASI_LIST } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';

export const PrestasiView: React.FC = () => {
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredList = PRESTASI_LIST.filter((p) => {
    const matchTingkat = selectedTingkat === 'Semua' || p.tingkat === selectedTingkat;
    const matchQuery =
      p.namaLomba.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.namaPeserta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.juara.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTingkat && matchQuery;
  });

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-teal-800 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-900 text-amber-300 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 17
            </span>
            <span className="text-amber-100 text-xs font-semibold">Ruang Penghargaan & Gelar Juara</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">17. DAFTAR PRESTASI MADRASAH</h1>
          <p className="text-xs text-amber-100 mt-0.5">
            Pencapaian Juara MQK, Porsadin, MTQ, Hadroh, & Pencak Silat
          </p>
        </div>

        <div className="bg-white/20 px-3.5 py-1.5 rounded-2xl border border-white/30 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-200" />
          <span>{PRESTASI_LIST.length} Trofi Kejuaraan</span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          {['Semua', 'Kabupaten', 'Karesidenan / Wilayah', 'Provinsi'].map((t) => (
            <button
              key={t}
              onClick={() => {
                playTapSound();
                setSelectedTingkat(t);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                selectedTingkat === t
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kejuaraan / nama santri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-amber-500 font-medium"
          />
        </div>
      </div>

      {/* Grid of Prestasi */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Trophy className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    Tingkat {item.tingkat}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Tahun {item.tahun}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {item.namaLomba}
                </h3>

                <p className="text-xs font-bold text-emerald-700">
                  🏆 {item.juara} • <span className="text-slate-700">{item.namaPeserta}</span>
                </p>

                <p className="text-[11px] text-slate-400">
                  Penyelenggara: {item.penyelenggara}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
