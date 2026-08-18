import React, { useState } from 'react';
import { 
  FileText, 
  Award, 
  TrendingUp, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  Download, 
  User, 
  Calendar,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { RAPORT_SANTRI_SAMPLE, BIODATA_MURID_LIST } from '../../data/madrasahCompleteData';
import { RaportSantriData } from '../../types';
import { playTapSound } from '../../utils/audio';

export const RaportView: React.FC = () => {
  const [selectedSantriId, setSelectedSantriId] = useState<string>('mrd-4');
  const [selectedCawu, setSelectedCawu] = useState<string>('Cawu 1');
  const [raportData, setRaportData] = useState<RaportSantriData>(RAPORT_SANTRI_SAMPLE);

  // Santri lookup
  const currentSantri = BIODATA_MURID_LIST.find((m) => m.id === selectedSantriId) || BIODATA_MURID_LIST[3];

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 5
            </span>
            <span className="text-teal-100 text-xs font-semibold">Laporan Hasil Belajar Cawu</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">5. BUKU RAPORT SANTRI</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Evaluasi 11 Mata Pelajaran Kitab Kuning, Peringkat Kelas & Catatan Wali Kelas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playTapSound();
              window.print();
            }}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl border border-white/30 text-xs font-extrabold flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak Raport</span>
          </button>
        </div>
      </div>

      {/* Santri & Cawu Selector Bar */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <User className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-slate-600 shrink-0">Pilih Santri:</span>
          <select
            value={selectedSantriId}
            onChange={(e) => {
              playTapSound();
              setSelectedSantriId(e.target.value);
            }}
            className="text-xs font-extrabold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-emerald-500 w-full sm:w-64"
          >
            {BIODATA_MURID_LIST.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama} ({m.kelas})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {['Cawu 1', 'Cawu 2', 'Cawu 3'].map((cw) => (
            <button
              key={cw}
              onClick={() => {
                playTapSound();
                setSelectedCawu(cw);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs shrink-0 transition-all cursor-pointer ${
                selectedCawu === cw
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cw}
            </button>
          ))}
        </div>
      </div>

      {/* Santri Identity & Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap Santri</span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800">{currentSantri.nama}</h3>
            <p className="text-xs text-slate-500 font-mono">No. Induk: {currentSantri.noInduk}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Tingkat & Periode</span>
            <h3 className="font-extrabold text-sm sm:text-base text-emerald-800">{currentSantri.kelas} • {selectedCawu}</h3>
            <p className="text-xs text-slate-500 font-medium">Tahun Ajaran: 2025/2026</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Rata-Rata Nilai</span>
              <span className="text-xl font-black text-emerald-900 font-mono">{raportData.rataRata}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Peringkat Kelas</span>
              <span className="text-xl font-black text-amber-900 font-mono">
                Ke-{raportData.peringkat} <span className="text-xs font-normal text-amber-700">dari {raportData.totalSiswa}</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 11 MATA PELAJARAN DINIYAH TABLE */}
      {/* (Fiqih, Tauhid, Ahlaq, Alquran / Tajwid, B. Arab, Nahwu-Sorof, Tarikh, Ke NU an, Hadist, Imlak/Pegon, Hafalan) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span className="font-extrabold text-xs sm:text-sm text-slate-800">
              Daftar Nilai 11 Mata Pelajaran Kurikulum Diniyah KTSP+
            </span>
          </div>
          <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            11 Mapel Lengkap
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 text-slate-600 font-extrabold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">No</th>
                <th className="py-3 px-3.5">Mata Pelajaran (Kitab Rujukan)</th>
                <th className="py-3 px-3 text-center w-16">KKM</th>
                <th className="py-3 px-3 text-center w-20">Nilai Angka</th>
                <th className="py-3 px-3.5 text-center w-32 hidden sm:table-cell">Huruf</th>
                <th className="py-3 px-3.5 text-center w-28">Predikat</th>
                <th className="py-3 px-3.5 hidden md:table-cell">Keterangan Capaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {raportData.nilaiList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-3.5">
                    <span className="font-extrabold text-slate-800 block">{item.namaMapel}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-500">{item.kkm}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-mono font-black text-sm px-2 py-0.5 rounded-md ${
                      item.nilaiAngka >= 85
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.nilaiAngka >= 75
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.nilaiAngka}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center font-medium text-slate-600 hidden sm:table-cell italic">
                    {item.nilaiHuruf}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {item.predikat}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-500 text-[11px] hidden md:table-cell">
                    {item.keterangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Akhlak, Sikap, Hafalan & Catatan Guru */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Adab & Hafalan */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
          <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            Adab, Kepribadian & Capaian Tahfidz
          </h4>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div>
              <span className="font-semibold text-slate-500 block">Sikap, Akhlak & Kedisiplinan:</span>
              <p className="font-bold text-slate-800 mt-0.5">{raportData.sikapDanAkhlak}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-500 block">Capaian Hafalan Al-Qur'an:</span>
              <p className="font-bold text-emerald-800 mt-0.5">{raportData.hafalanJuz}</p>
            </div>
          </div>
        </div>

        {/* Catatan Guru / Wali Kelas */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Catatan Wali Kelas & Pengasuh
            </h4>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950 italic leading-relaxed">
              "{raportData.catatanGuru}"
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Wali Kelas: <strong>Ust. Ahmad Mufid, M.Pd.I.</strong></span>
            <span>Kendal, 28 Nov 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
