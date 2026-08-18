import React, { useState } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  Receipt, 
  Sparkles,
  CreditCard
} from 'lucide-react';
import { SYAHRIYAH_LIST } from '../../data/madrasahCompleteData';
import { SyahriyahRecord } from '../../types';
import { playTapSound } from '../../utils/audio';

export const SyahriyahView: React.FC = () => {
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syahriyahList, setSyahriyahList] = useState<SyahriyahRecord[]>(SYAHRIYAH_LIST);

  const filteredList = syahriyahList.filter((s) => {
    const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchQuery = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.noInduk.includes(searchQuery);
    return matchKelas && matchQuery;
  });

  const handleBayar = (id: string, cawuKey: 'cawu1' | 'cawu2' | 'cawu3') => {
    playTapSound();
    setSyahriyahList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [cawuKey]: {
              ...item[cawuKey],
              status: item[cawuKey].status === 'Lunas' ? 'Belum' : 'Lunas',
              tanggalBayar: item[cawuKey].status === 'Lunas' ? undefined : 'Hari ini',
              kuitansi: item[cawuKey].status === 'Lunas' ? undefined : `KWT-${Date.now().toString().slice(-6)}`
            }
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 11
            </span>
            <span className="text-teal-100 text-xs font-semibold">Keuangan & Iuran Santri</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">11. SYAHRIYAH & ADMINISTRASI</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Monitoring Iuran Syahriyah Kelas 1-6 Per Caturwulan (Cawu 1, 2, & 3)
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <CreditCard className="w-4 h-4 text-amber-300 inline mr-1.5" />
          <span>Rp 150.000 / Cawu</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
          {['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
            <button
              key={k}
              onClick={() => {
                playTapSound();
                setSelectedKelas(k);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                selectedKelas === k
                  ? 'bg-emerald-600 text-white shadow-2xs'
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
            placeholder="Cari Santri / No. Induk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Syahriyah Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            Daftar Administrasi Syahriyah ({selectedKelas})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Tahun Ajaran 2026/2027
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-800">{item.nama}</h4>
                  <span className="text-[10px] font-black px-2 py-0.2 rounded-md bg-slate-100 text-slate-700">
                    {item.kelas}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  No. Induk: {item.noInduk}
                </p>
              </div>

              {/* Status Cawu 1, Cawu 2, Cawu 3 */}
              <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
                {/* Cawu 1 */}
                <div className={`p-2.5 rounded-2xl border flex flex-col justify-between text-xs ${
                  item.cawu1.status === 'Lunas' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[10px] uppercase text-slate-600">Cawu 1</span>
                    {item.cawu1.status === 'Lunas' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">Rp 150.000</span>
                  <button
                    onClick={() => handleBayar(item.id, 'cawu1')}
                    className={`mt-1.5 py-1 px-2 rounded-lg font-black text-[10px] transition-colors cursor-pointer ${
                      item.cawu1.status === 'Lunas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.cawu1.status}
                  </button>
                </div>

                {/* Cawu 2 */}
                <div className={`p-2.5 rounded-2xl border flex flex-col justify-between text-xs ${
                  item.cawu2.status === 'Lunas' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[10px] uppercase text-slate-600">Cawu 2</span>
                    {item.cawu2.status === 'Lunas' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">Rp 150.000</span>
                  <button
                    onClick={() => handleBayar(item.id, 'cawu2')}
                    className={`mt-1.5 py-1 px-2 rounded-lg font-black text-[10px] transition-colors cursor-pointer ${
                      item.cawu2.status === 'Lunas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.cawu2.status}
                  </button>
                </div>

                {/* Cawu 3 */}
                <div className={`p-2.5 rounded-2xl border flex flex-col justify-between text-xs ${
                  item.cawu3.status === 'Lunas' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[10px] uppercase text-slate-600">Cawu 3</span>
                    {item.cawu3.status === 'Lunas' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">Rp 150.000</span>
                  <button
                    onClick={() => handleBayar(item.id, 'cawu3')}
                    className={`mt-1.5 py-1 px-2 rounded-lg font-black text-[10px] transition-colors cursor-pointer ${
                      item.cawu3.status === 'Lunas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.cawu3.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
