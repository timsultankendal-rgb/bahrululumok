import React, { useState } from 'react';
import { 
  Building, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Layers,
  School,
  Eye
} from 'lucide-react';
import { FASILITAS_LIST } from '../../data/madrasahCompleteData';
import { FasilitasItem } from '../../types';
import { playTapSound } from '../../utils/audio';

export const FasilitasView: React.FC = () => {
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');

  const filteredList = FASILITAS_LIST.filter(
    (f) => selectedKategori === 'Semua' || f.kategori === selectedKategori
  );

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 15
            </span>
            <span className="text-teal-100 text-xs font-semibold">Sarana & Prasarana</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">15. FASILITAS LEMBAGA</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Daftar Sarana Gedung Belajar, Masjid Jamie', Perpustakaan Kitab, & KOPAS
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <Building className="w-4 h-4 text-amber-300 inline mr-1.5" />
          <span>{FASILITAS_LIST.length} Fasilitas Unggulan</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {['Semua', 'Ruang Belajar', 'Ibadah', 'Penunjang'].map((k) => (
          <button
            key={k}
            onClick={() => {
              playTapSound();
              setSelectedKategori(k);
            }}
            className={`px-4 py-2 rounded-2xl font-extrabold text-xs shrink-0 transition-all cursor-pointer ${
              selectedKategori === k
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Grid of Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {item.foto && (
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-teal-800/90 text-white backdrop-blur-xs shadow-xs">
                      {item.kategori}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-600 text-white shadow-xs">
                      Kondisi: {item.kondisi}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                    {item.nama}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md shrink-0">
                    {item.jumlah} Unit
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
