import React, { useState } from 'react';
import { 
  Shirt, 
  BookOpen, 
  Calendar, 
  Clock, 
  UserCheck, 
  Layers, 
  Filter, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { JADWAL_SERAGAM_LIST, MAPEL_KTSP_LIST } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';

export const JadwalSeragamMapelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seragam' | 'mapel'>('seragam');
  const [selectedCawu, setSelectedCawu] = useState<string>('Cawu 1');
  const [selectedHari, setSelectedHari] = useState<string>('Semua');

  const filteredMapel = MAPEL_KTSP_LIST.filter((m) => {
    const matchCawu = m.cawu === selectedCawu;
    const matchHari = selectedHari === 'Semua' || m.hari === selectedHari;
    return matchCawu && matchHari;
  });

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
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

      {/* Sub Tab Switcher: 1. Jadwal Pakai Seragam vs 2. Jadwal Mata Pelajaran KTSP+ */}
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
            {JADWAL_SERAGAM_LIST.map((srg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
                      HARI {srg.hari.toUpperCase()}
                    </span>
                    <Shirt className="w-5 h-5 text-teal-600" />
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

      {/* SUB-SECTION 2: JADWAL MATA PELAJARAN KTSP+ (PERCAWU & GURU PENGAJAR) */}
      {activeTab === 'mapel' && (
        <div className="space-y-4">
          {/* Cawu Filter & Hari Filter */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-600">Pilih Caturwulan:</span>
              <div className="flex items-center gap-1.5">
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

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
              {['Semua', 'Sabtu', 'Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis'].map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    playTapSound();
                    setSelectedHari(h);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                    selectedHari === h
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {h}
                </button>
              ))}
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

                  <div className="self-end sm:self-center bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{mp.jam}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
