import React, { useState } from 'react';
import { 
  ShoppingBag, 
  BookOpen, 
  Wallet, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Package, 
  Tag,
  Receipt,
  Sparkles
} from 'lucide-react';
import { KOPAS_PRODUK_LIST, TABUNGAN_SANTRI_LIST } from '../../data/madrasahCompleteData';
import { KopasProduk, TabunganSantri } from '../../types';
import { playTapSound } from '../../utils/audio';

export const KopasView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'produk' | 'tabungan' | 'kitab_khusus'>('produk');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tabunganList, setTabunganList] = useState<TabunganSantri[]>(TABUNGAN_SANTRI_LIST);
  const [selectedSantriTabungan, setSelectedSantriTabungan] = useState<TabunganSantri | null>(null);

  // Filter Produk
  const filteredProduk = KOPAS_PRODUK_LIST.filter((p) => {
    const matchKategori = selectedKategori === 'Semua' || p.kategori === selectedKategori;
    const matchQuery = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.kode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchQuery;
  });

  // Filter Kitab Saja
  const filteredKitab = KOPAS_PRODUK_LIST.filter((p) => p.kategori === 'Kitab' && (p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.kode.toLowerCase().includes(searchQuery.toLowerCase())));

  // Total Tabungan Keseluruhan
  const totalDanaTabungan = tabunganList.reduce((acc, curr) => acc + curr.jumlahTabungan, 0);

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-700 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 3
            </span>
            <span className="text-emerald-100 text-xs font-semibold">Koperasi Pondok & Santri</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">3. KOPERASI SANTRI (KOPAS)</h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Daftar Harga ATK, Kitab Kuning, Seragam & Buku Tabungan Santri
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-2 rounded-2xl border border-white/20 text-right backdrop-blur-xs">
          <span className="text-[10px] text-emerald-100 font-bold block">Total Saldo Tabungan Santri</span>
          <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
            Rp {totalDanaTabungan.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      {/* Sub Tab Switcher: 1. ATK + Kitab + Seragam, 2. Tabungan Santri, 3. Daftar Kitab & Harga */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveTab('produk');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'produk'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Daftar Harga (ATK, Kitab, Seragam)</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('tabungan');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'tabungan'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Tabungan Santri</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('kitab_khusus');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'kitab_khusus'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Daftar Kitab & Harga</span>
        </button>
      </div>

      {/* SUB-SECTION 1: DAFTAR HARGA ATK + KITAB + SERAGAM */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          {/* Filter Kategori & Search */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
              {['Semua', 'Kitab', 'ATK', 'Seragam'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    playTapSound();
                    setSelectedKategori(k);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                    selectedKategori === k
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
                placeholder="Cari barang / kode KOPAS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Grid of Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredProduk.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      item.kategori === 'Kitab'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.kategori === 'ATK'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.kategori}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      {item.kode}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 mb-1">
                    {item.nama}
                  </h3>

                  {item.deskripsi && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {item.deskripsi}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Harga Resmi KOPAS:</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      Rp {item.harga.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                    Stok: {item.stok} {item.satuan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: TABUNGAN SANTRI (NAMA, JUMLAH TABUNGAN, RIWAYAT SETOR/TARIK) */}
      {activeTab === 'tabungan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-teal-600" />
                Daftar Rekening Tabungan Santri KOPAS
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Update Terakhir: Agustus 2026
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {tabunganList.map((tab) => (
                <div
                  key={tab.id}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-800">{tab.nama}</h4>
                        <span className="text-[10px] font-black px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                          {tab.kelas}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        No. Induk: {tab.noInduk} • Terakhir Update: {tab.terakhirUpdate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Saldo:</span>
                        <span className="text-base sm:text-lg font-black text-teal-700 font-mono">
                          Rp {tab.jumlahTabungan.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          playTapSound();
                          setSelectedSantriTabungan(selectedSantriTabungan?.id === tab.id ? null : tab);
                        }}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        {selectedSantriTabungan?.id === tab.id ? 'Tutup Mutasi' : 'Lihat Mutasi'}
                      </button>
                    </div>
                  </div>

                  {/* Mutasi Riwayat Setor/Tarik */}
                  {selectedSantriTabungan?.id === tab.id && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2">
                      <span className="text-xs font-extrabold text-slate-700 block">
                        Riwayat Transaksi Setor & Tarik Tabungan:
                      </span>
                      <div className="space-y-1.5">
                        {tab.riwayat.map((rw) => (
                          <div
                            key={rw.id}
                            className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                                rw.jenis === 'Setor' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                {rw.jenis === 'Setor' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-800">{rw.keterangan}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">{rw.tanggal} • Petugas: {rw.petugas}</span>
                              </div>
                            </div>

                            <span className={`font-black font-mono text-sm ${
                              rw.jenis === 'Setor' ? 'text-emerald-700' : 'text-rose-700'
                            }`}>
                              {rw.jenis === 'Setor' ? '+' : '-'} Rp {rw.nominal.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: DAFTAR KITAB & HARGA KHUSUS */}
      {activeTab === 'kitab_khusus' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 text-xs text-amber-900">
            <span className="font-extrabold text-sm block mb-1">
              📖 Standar Kitab Kuning Pegon Madrasah Diniyah
            </span>
            Seluruh kitab merupakan edisi berharakat dan telah dilengkapi lafadz makna gandul Pegon Arab-Jawa standar pesantren Kaliwungu & Sarang.
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredKitab.map((k, idx) => (
                <div
                  key={k.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{k.nama}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{k.deskripsi}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">
                      Rp {k.harga.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Stok: {k.stok} exp</span>
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
