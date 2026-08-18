import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Award, 
  MapPin, 
  School, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { MUTAKHORIJIN_LIST } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';

export const MutakhorijinView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTahun, setSelectedTahun] = useState<string>('Semua');

  const filteredList = MUTAKHORIJIN_LIST.filter((m) => {
    const matchTahun = selectedTahun === 'Semua' || m.tahunLulus === selectedTahun;
    const matchQuery =
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.noIjazah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.pendidikanLanjutan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTahun && matchQuery;
  });

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 10
            </span>
            <span className="text-teal-100 text-xs font-semibold">Ikatan Alumni Santri (IKAS)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">10. DAFTAR MUTAKHORIJIN (ALUMNI)</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Buku Induk Kelulusan, No. Ijazah, & Studi Lanjutan Pesantren / Universitas
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <GraduationCap className="w-4 h-4 text-amber-300 inline mr-1.5" />
          <span>{MUTAKHORIJIN_LIST.length} Alumni Terdata</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          {['Semua', '2025', '2024', '2023'].map((thn) => (
            <button
              key={thn}
              onClick={() => {
                playTapSound();
                setSelectedTahun(thn);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                selectedTahun === thn
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {thn === 'Semua' ? 'Semua Angkatan' : `Lulusan ${thn}`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Alumni / No Ijazah / Pesantren..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Grid of Alumni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {m.angkatan}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    Lulus Th. {m.tahunLulus}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {m.nama}
                </h3>
                <p className="text-xs font-mono font-bold text-teal-700 mt-0.5">
                  No. Ijazah : {m.noIjazah}
                </p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <School className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500">Pendidikan Lanjutan:</span>
                  <p className="font-bold text-slate-800">{m.pendidikanLanjutan}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-500">Domisili / Lokasi Sekarang:</span>
                  <p className="font-medium text-slate-700">{m.alamatSekarang}</p>
                </div>
              </div>

              {m.prestasiTerbaik && (
                <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500">Prestasi Terbaik:</span>
                    <p className="font-bold text-amber-900">{m.prestasiTerbaik}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
