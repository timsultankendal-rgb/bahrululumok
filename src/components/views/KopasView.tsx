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
  Sparkles,
  Edit2,
  Trash2,
  Save,
  X,
  Check
} from 'lucide-react';
import { KOPAS_PRODUK_LIST, TABUNGAN_SANTRI_LIST } from '../../data/madrasahCompleteData';
import { KopasProduk, TabunganSantri, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_PRODUK = 'madrasah_kopas_produk_v2';
const STORAGE_KEY_TABUNGAN = 'madrasah_kopas_tabungan_v2';

interface KopasViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const KopasView: React.FC<KopasViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('3_kopas', activeRole, explicitCanEdit);
  const [activeTab, setActiveTab] = useState<'produk' | 'tabungan' | 'kitab_khusus'>('produk');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [produkList, setProdukList] = useState<KopasProduk[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUK);
      if (saved) return JSON.parse(saved);
    } catch {}
    return KOPAS_PRODUK_LIST;
  });

  const [tabunganList, setTabunganList] = useState<TabunganSantri[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TABUNGAN);
      if (saved) return JSON.parse(saved);
    } catch {}
    return TABUNGAN_SANTRI_LIST;
  });

  const [selectedSantriTabungan, setSelectedSantriTabungan] = useState<TabunganSantri | null>(null);

  // Modals
  const [isProdukModalOpen, setIsProdukModalOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState<KopasProduk | null>(null);
  const [produkForm, setProdukForm] = useState<Omit<KopasProduk, 'id'>>({
    kode: '',
    nama: '',
    kategori: 'ATK',
    harga: 5000,
    stok: 50,
    satuan: 'pcs',
    deskripsi: ''
  });

  const [isTabunganModalOpen, setIsTabunganModalOpen] = useState(false);
  const [selectedTabunganItem, setSelectedTabunganItem] = useState<TabunganSantri | null>(null);
  const [transaksiJenis, setTransaksiJenis] = useState<'Setor' | 'Tarik'>('Setor');
  const [transaksiNominal, setTransaksiNominal] = useState<number>(20000);
  const [transaksiKeterangan, setTransaksiKeterangan] = useState<string>('Setoran rutin');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const saveProduk = (newList: KopasProduk[]) => {
    setProdukList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(newList));
    } catch {}
  };

  const saveTabungan = (newList: TabunganSantri[]) => {
    setTabunganList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_TABUNGAN, JSON.stringify(newList));
    } catch {}
  };

  // Filter Produk
  const filteredProduk = produkList.filter((p) => {
    const matchKategori = selectedKategori === 'Semua' || p.kategori === selectedKategori;
    const matchQuery = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.kode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchQuery;
  });

  // Filter Kitab Saja
  const filteredKitab = produkList.filter((p) => p.kategori === 'Kitab' && (p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.kode.toLowerCase().includes(searchQuery.toLowerCase())));

  // Total Tabungan Keseluruhan
  const totalDanaTabungan = tabunganList.reduce((acc, curr) => acc + curr.jumlahTabungan, 0);

  // Produk actions
  const handleOpenAddProduk = () => {
    playTapSound();
    setEditingProduk(null);
    setProdukForm({
      kode: `KP-${Date.now().toString().slice(-4)}`,
      nama: '',
      kategori: 'ATK',
      harga: 10000,
      stok: 25,
      satuan: 'pcs',
      deskripsi: ''
    });
    setIsProdukModalOpen(true);
  };

  const handleOpenEditProduk = (p: KopasProduk) => {
    playTapSound();
    setEditingProduk(p);
    setProdukForm({
      kode: p.kode,
      nama: p.nama,
      kategori: p.kategori,
      harga: p.harga,
      stok: p.stok,
      satuan: p.satuan,
      deskripsi: p.deskripsi || ''
    });
    setIsProdukModalOpen(true);
  };

  const handleSaveProduk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produkForm.nama.trim()) return;
    playTapSound();

    let updated: KopasProduk[];
    if (editingProduk) {
      updated = produkList.map((p) => p.id === editingProduk.id ? { ...produkForm, id: editingProduk.id } : p);
      showToast(`Produk "${produkForm.nama}" berhasil diperbarui.`);
    } else {
      const newItem: KopasProduk = {
        ...produkForm,
        id: `p-${Date.now()}`
      };
      updated = [newItem, ...produkList];
      showToast(`Produk "${produkForm.nama}" berhasil ditambahkan.`);
    }
    saveProduk(updated);
    setIsProdukModalOpen(false);
  };

  const handleDeleteProduk = (p: KopasProduk) => {
    if (window.confirm(`Hapus produk "${p.nama}"?`)) {
      playTapSound();
      const updated = produkList.filter((item) => item.id !== p.id);
      saveProduk(updated);
      showToast(`Produk "${p.nama}" telah dihapus.`);
    }
  };

  // Tabungan actions
  const handleOpenTransaksi = (tab: TabunganSantri, jenis: 'Setor' | 'Tarik') => {
    playTapSound();
    setSelectedTabunganItem(tab);
    setTransaksiJenis(jenis);
    setTransaksiNominal(20000);
    setTransaksiKeterangan(jenis === 'Setor' ? 'Setoran saku santri' : 'Penarikan uang jajan/kitab');
    setIsTabunganModalOpen(true);
  };

  const handleSaveTransaksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTabunganItem || transaksiNominal <= 0) return;
    playTapSound();

    const updated = tabunganList.map((t) => {
      if (t.id === selectedTabunganItem.id) {
        const newSaldo = transaksiJenis === 'Setor' 
          ? t.jumlahTabungan + transaksiNominal 
          : Math.max(0, t.jumlahTabungan - transaksiNominal);
        
        const newRiwayat = [
          {
            id: `rw-${Date.now()}`,
            tanggal: new Date().toLocaleDateString('id-ID'),
            jenis: transaksiJenis,
            nominal: transaksiNominal,
            keterangan: transaksiKeterangan,
            petugas: 'Admin Kopas'
          },
          ...t.riwayat
        ];

        return {
          ...t,
          jumlahTabungan: newSaldo,
          riwayat: newRiwayat
        };
      }
      return t;
    });

    saveTabungan(updated);
    if (selectedSantriTabungan?.id === selectedTabunganItem.id) {
      setSelectedSantriTabungan(updated.find((u) => u.id === selectedTabunganItem.id) || null);
    }
    setIsTabunganModalOpen(false);
    showToast(`Transaksi ${transaksiJenis} Rp ${transaksiNominal.toLocaleString('id-ID')} untuk ${selectedTabunganItem.nama} berhasil dicatat.`);
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

      {/* Sub Tab Switcher */}
      <div className="grid grid-cols-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveTab('produk');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'produk'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Daftar Harga</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('tabungan');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'kitab_khusus'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kitab Kuning</span>
        </button>
      </div>

      {/* SUB-SECTION 1: DAFTAR PRODUK KOPERASI */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Kategori (Responsive Grid) */}
            <div className="grid grid-cols-4 sm:flex gap-1.5 w-full sm:w-auto">
              {['Semua', 'ATK', 'Kitab', 'Seragam'].map((kat) => (
                <button
                  key={kat}
                  onClick={() => {
                    playTapSound();
                    setSelectedKategori(kat);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                    selectedKategori === kat
                      ? 'bg-emerald-600 text-white shadow-2xs font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-1 sm:justify-end">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari Barang / Kitab..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              {canEdit && (
                <button
                  onClick={handleOpenAddProduk}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Produk</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProduk.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      prod.kategori === 'Kitab'
                        ? 'bg-amber-100 text-amber-800'
                        : prod.kategori === 'Seragam'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {prod.kategori}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {prod.kode}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-800 leading-snug">
                    {prod.nama}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {prod.deskripsi || 'Perlengkapan madrasah santri'}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Harga Resmi</span>
                      <span className="text-sm font-black text-emerald-700 font-mono">
                        Rp {prod.harga.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">Stok Tersedia</span>
                      <span className="text-xs font-bold text-slate-700">
                        {prod.stok} {prod.satuan}
                      </span>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => handleOpenEditProduk(prod)}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduk(prod)}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: TABUNGAN SANTRI */}
      {activeTab === 'tabungan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-teal-600" />
                Buku Rekening Tabungan Santri
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {tabunganList.length} Santri Memiliki Rekening
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {tabunganList.map((tab) => (
                <div
                  key={tab.id}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-800">{tab.nama}</h4>
                        <span className="text-[10px] font-black px-2 py-0.2 rounded-md bg-slate-100 text-slate-700">
                          {tab.kelas}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        No. Rek: <strong>{tab.noRekening}</strong> • No. Induk: {tab.noInduk}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 font-bold block">Saldo Aktif</span>
                        <span className="text-base font-black text-emerald-800 font-mono">
                          Rp {tab.jumlahTabungan.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleOpenTransaksi(tab, 'Setor')}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                              title="Setor Tabungan"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Setor</span>
                            </button>
                            <button
                              onClick={() => handleOpenTransaksi(tab, 'Tarik')}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                              title="Tarik Tabungan"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Tarik</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => {
                            playTapSound();
                            setSelectedSantriTabungan(selectedSantriTabungan?.id === tab.id ? null : tab);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {selectedSantriTabungan?.id === tab.id ? 'Tutup' : 'Riwayat'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mutasi Riwayat Setor/Tarik */}
                  {selectedSantriTabungan?.id === tab.id && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2 animate-fadeIn">
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

      {/* Modal Tambah / Edit Produk */}
      {isProdukModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                {editingProduk ? 'Edit Produk Koperasi' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsProdukModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduk} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode Produk:</label>
                  <input
                    type="text"
                    value={produkForm.kode}
                    onChange={(e) => setProdukForm({ ...produkForm, kode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori:</label>
                  <select
                    value={produkForm.kategori}
                    onChange={(e) => setProdukForm({ ...produkForm, kategori: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-emerald-500"
                  >
                    <option value="ATK">ATK</option>
                    <option value="Kitab">Kitab</option>
                    <option value="Seragam">Seragam</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Produk:</label>
                <input
                  type="text"
                  value={produkForm.nama}
                  onChange={(e) => setProdukForm({ ...produkForm, nama: e.target.value })}
                  placeholder="Contoh: Kitab Fathul Qorib"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Harga (Rp):</label>
                  <input
                    type="number"
                    value={produkForm.harga}
                    onChange={(e) => setProdukForm({ ...produkForm, harga: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Stok:</label>
                  <input
                    type="number"
                    value={produkForm.stok}
                    onChange={(e) => setProdukForm({ ...produkForm, stok: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Satuan:</label>
                  <input
                    type="text"
                    value={produkForm.satuan}
                    onChange={(e) => setProdukForm({ ...produkForm, satuan: e.target.value })}
                    placeholder="pcs / stel / exp"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi:</label>
                <textarea
                  rows={2}
                  value={produkForm.deskripsi}
                  onChange={(e) => setProdukForm({ ...produkForm, deskripsi: e.target.value })}
                  placeholder="Keterangan singkat..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProdukModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Produk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Setor / Tarik Tabungan */}
      {isTabunganModalOpen && selectedTabunganItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-teal-600" />
                  {transaksiJenis === 'Setor' ? 'Setor Tabungan' : 'Tarik Tabungan'}
                </h3>
                <p className="text-xs text-slate-500">{selectedTabunganItem.nama} ({selectedTabunganItem.kelas})</p>
              </div>
              <button
                onClick={() => setIsTabunganModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaksi} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nominal Transaksi (Rp):
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={transaksiNominal}
                  onChange={(e) => setTransaksiNominal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Keterangan:
                </label>
                <input
                  type="text"
                  value={transaksiKeterangan}
                  onChange={(e) => setTransaksiKeterangan(e.target.value)}
                  placeholder="Contoh: Uang saku mingguan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Saldo Saat Ini:</span>
                  <span className="font-mono font-bold">Rp {selectedTabunganItem.jumlahTabungan.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-slate-200">
                  <span>Saldo Baru:</span>
                  <span className="font-mono">
                    Rp {(transaksiJenis === 'Setor' ? selectedTabunganItem.jumlahTabungan + transaksiNominal : Math.max(0, selectedTabunganItem.jumlahTabungan - transaksiNominal)).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTabunganModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold text-white shadow-xs ${
                    transaksiJenis === 'Setor' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Konfirmasi {transaksiJenis}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
