import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  UserPlus,
  Share2,
  Printer,
  Download,
  Filter,
  ShieldCheck,
  Building2,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { KOPAS_PRODUK_LIST, TABUNGAN_SANTRI_LIST } from '../../data/madrasahCompleteData';
import { KopasProduk, TabunganSantri, RiwayatTabunganItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';
import { 
  subscribeTabunganFromFirestore, 
  saveTabunganToFirestore, 
  deleteTabunganFromFirestore 
} from '../../services/firestoreService';
import { BukuTabunganModal } from '../tabungan/BukuTabunganModal';
import { KuitansiTabunganModal } from '../tabungan/KuitansiTabunganModal';
import { TransaksiTabunganModal } from '../tabungan/TransaksiTabunganModal';
import { BukaRekeningModal } from '../tabungan/BukaRekeningModal';

const STORAGE_KEY_PRODUK = 'madrasah_kopas_produk_v2';
const STORAGE_KEY_TABUNGAN = 'madrasah_kopas_tabungan_v2';

interface KopasViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
  currentUser?: { fullName?: string; username?: string; role?: string } | null;
}

export const KopasView: React.FC<KopasViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
  currentUser,
}) => {
  const { canEdit } = useAccessPermission('3_kopas', activeRole, explicitCanEdit);
  const [activeTab, setActiveTab] = useState<'produk' | 'tabungan' | 'kitab_khusus'>('tabungan');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Tabungan Filters & Sorting
  const [filterKelasTabungan, setFilterKelasTabungan] = useState<string>('Semua');
  const [filterProgramTabungan, setFilterProgramTabungan] = useState<string>('Semua');
  const [sortByTabungan, setSortByTabungan] = useState<'tertinggi' | 'terendah' | 'terbaru' | 'nama'>('tertinggi');

  // Produk State
  const [produkList, setProdukList] = useState<KopasProduk[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUK);
      if (saved) return JSON.parse(saved);
    } catch {}
    return KOPAS_PRODUK_LIST;
  });

  // Tabungan State
  const [tabunganList, setTabunganList] = useState<TabunganSantri[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TABUNGAN);
      if (saved) return JSON.parse(saved);
    } catch {}
    return TABUNGAN_SANTRI_LIST;
  });

  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Modals for Tabungan
  const [selectedPassbookSantri, setSelectedPassbookSantri] = useState<TabunganSantri | null>(null);
  const [isTransaksiModalOpen, setIsTransaksiModalOpen] = useState(false);
  const [transaksiTargetSantri, setTransaksiTargetSantri] = useState<TabunganSantri | null>(null);
  const [transaksiInitialJenis, setTransaksiInitialJenis] = useState<'Setor' | 'Tarik'>('Setor');
  const [isBukaRekeningModalOpen, setIsBukaRekeningModalOpen] = useState(false);

  // Kuitansi Modal
  const [kuitansiData, setKuitansiData] = useState<{
    santri: TabunganSantri;
    transaksi: RiwayatTabunganItem;
  } | null>(null);

  // Modals for Produk
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

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Real-time Cloud Firestore synchronization for Tabungan Santri
  useEffect(() => {
    const unsub = subscribeTabunganFromFirestore((cloudData) => {
      if (cloudData && cloudData.length > 0) {
        setTabunganList(cloudData);
        setIsCloudSynced(true);
        try {
          localStorage.setItem(STORAGE_KEY_TABUNGAN, JSON.stringify(cloudData));
        } catch {}
      } else {
        // If Firestore is empty initially, seed with our normalized default list
        TABUNGAN_SANTRI_LIST.forEach((item) => {
          saveTabunganToFirestore(item).catch(() => {});
        });
      }
    }, () => {
      setIsCloudSynced(false);
    });

    return () => unsub();
  }, []);

  const saveProduk = (newList: KopasProduk[]) => {
    setProdukList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_PRODUK, JSON.stringify(newList));
    } catch {}
  };

  const handleSaveTabunganAccount = async (newAccount: TabunganSantri) => {
    const updated = [newAccount, ...tabunganList.filter(t => t.id !== newAccount.id)];
    setTabunganList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TABUNGAN, JSON.stringify(updated));
    } catch {}
    
    try {
      await saveTabunganToFirestore(newAccount);
    } catch (e) {
      console.warn('Tabungan Firestore sync error:', e);
    }

    setIsBukaRekeningModalOpen(false);
    showToast(`Rekening ${newAccount.nama} (${newAccount.noRekening}) berhasil dibuka.`);

    // If there was an initial deposit, show receipt
    if (newAccount.riwayat && newAccount.riwayat.length > 0) {
      setKuitansiData({
        santri: newAccount,
        transaksi: newAccount.riwayat[0]
      });
    }
  };

  const handleSaveTransaksi = async (santriId: string, newTransaksi: RiwayatTabunganItem) => {
    const targetSantri = tabunganList.find(t => t.id === santriId);
    if (!targetSantri) return;

    const newSaldo = newTransaksi.saldoSesudah ?? (
      newTransaksi.jenis === 'Setor' 
        ? targetSantri.jumlahTabungan + newTransaksi.nominal 
        : Math.max(0, targetSantri.jumlahTabungan - newTransaksi.nominal)
    );

    const updatedSantri: TabunganSantri = {
      ...targetSantri,
      jumlahTabungan: newSaldo,
      totalTabungan: newSaldo,
      terakhirTransaksi: newTransaksi.tanggal,
      terakhirUpdate: newTransaksi.tanggal,
      riwayat: [newTransaksi, ...targetSantri.riwayat]
    };

    const updatedList = tabunganList.map(t => t.id === santriId ? updatedSantri : t);
    setTabunganList(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY_TABUNGAN, JSON.stringify(updatedList));
    } catch {}

    // Save to Firestore
    try {
      await saveTabunganToFirestore(updatedSantri);
    } catch (e) {
      console.warn('Firestore save error:', e);
    }

    setIsTransaksiModalOpen(false);
    setTransaksiTargetSantri(null);

    // If Passbook modal is open for this student, update it
    if (selectedPassbookSantri?.id === santriId) {
      setSelectedPassbookSantri(updatedSantri);
    }

    // Automatically open the official receipt modal
    setKuitansiData({
      santri: updatedSantri,
      transaksi: newTransaksi
    });

    showToast(`Transaksi ${newTransaksi.jenis} Rp ${newTransaksi.nominal.toLocaleString('id-ID')} untuk ${updatedSantri.nama} berhasil dicatat.`);
  };

  const handleDeleteTabungan = async (tab: TabunganSantri) => {
    if (window.confirm(`Yakin ingin menghapus / menutup rekening tabungan milik "${tab.nama}" (${tab.noRekening})?`)) {
      playTapSound();
      const updated = tabunganList.filter(t => t.id !== tab.id);
      setTabunganList(updated);
      try {
        localStorage.setItem(STORAGE_KEY_TABUNGAN, JSON.stringify(updated));
        await deleteTabunganFromFirestore(tab.id);
      } catch {}
      showToast(`Rekening ${tab.nama} telah ditutup.`);
    }
  };

  // Filter & Search Tabungan
  const filteredTabungan = useMemo(() => {
    return tabunganList.filter((t) => {
      const matchKelas = filterKelasTabungan === 'Semua' || t.kelas === filterKelasTabungan;
      const matchProgram = filterProgramTabungan === 'Semua' || (t.programTabungan || 'Reguler/Saku') === filterProgramTabungan;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        t.nama.toLowerCase().includes(query) ||
        t.noInduk.toLowerCase().includes(query) ||
        (t.noRekening && t.noRekening.toLowerCase().includes(query)) ||
        (t.namaWali && t.namaWali.toLowerCase().includes(query)) ||
        (t.nisn && t.nisn.includes(query));

      return matchKelas && matchProgram && matchQuery;
    }).sort((a, b) => {
      if (sortByTabungan === 'tertinggi') return b.jumlahTabungan - a.jumlahTabungan;
      if (sortByTabungan === 'terendah') return a.jumlahTabungan - b.jumlahTabungan;
      if (sortByTabungan === 'nama') return a.nama.localeCompare(b.nama);
      // terbaru
      return (b.terakhirTransaksi || '').localeCompare(a.terakhirTransaksi || '');
    });
  }, [tabunganList, filterKelasTabungan, filterProgramTabungan, searchQuery, sortByTabungan]);

  // Tabungan Financial Aggregates
  const totalDanaTabungan = tabunganList.reduce((acc, curr) => acc + curr.jumlahTabungan, 0);
  const totalTransaksiMasuk = tabunganList.reduce((acc, curr) => {
    const sumSetor = curr.riwayat.filter(r => r.jenis === 'Setor').reduce((s, r) => s + r.nominal, 0);
    return acc + sumSetor;
  }, 0);
  const totalTransaksiKeluar = tabunganList.reduce((acc, curr) => {
    const sumTarik = curr.riwayat.filter(r => r.jenis === 'Tarik').reduce((s, r) => s + r.nominal, 0);
    return acc + sumTarik;
  }, 0);

  // Filter Produk
  const filteredProduk = produkList.filter((p) => {
    const matchKategori = selectedKategori === 'Semua' || p.kategori === selectedKategori;
    const matchQuery = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.kode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKategori && matchQuery;
  });

  const filteredKitab = produkList.filter((p) => p.kategori === 'Kitab' && (p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.kode.toLowerCase().includes(searchQuery.toLowerCase())));

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

  const handleExportCSV = () => {
    playTapSound();
    const headers = ['No Rekening', 'No Induk', 'NISN', 'Nama Santri', 'Kelas', 'Program', 'Nama Wali', 'No WA Wali', 'Saldo Tabungan (Rp)', 'Terakhir Transaksi'];
    const rows = filteredTabungan.map(t => [
      t.noRekening || '-',
      t.noInduk,
      t.nisn || '-',
      `"${t.nama}"`,
      t.kelas,
      t.programTabungan || 'Reguler/Saku',
      `"${t.namaWali || '-'}"`,
      t.noWaWali || '-',
      t.jumlahTabungan,
      t.terakhirTransaksi || '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Tabungan_Santri_Madrasah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data Tabungan Santri berhasil diexport ke CSV.');
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/50 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 3
            </span>
            <span className="text-emerald-100 text-xs font-semibold">Koperasi & Simpanan Santri</span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-400/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {isCloudSynced ? 'Cloud Firestore Aktif' : 'Tersinkronisasi'}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">3. KOPERASI & TABUNGAN SANTRI</h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Buku Rekening Digital, Transaksi Setor/Tarik Real-Time & Koperasi Madrasah
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 text-right backdrop-blur-xs flex-shrink-0">
          <span className="text-[10px] text-emerald-200 font-bold block uppercase tracking-wider">Total Simpanan Santri</span>
          <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
            {formatRupiah(totalDanaTabungan)}
          </span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="grid grid-cols-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveTab('tabungan');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'tabungan'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Tabungan Santri</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('produk');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'produk'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Daftar Harga KOPAS</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('kitab_khusus');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'kitab_khusus'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kitab Pegon</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-SECTION 1: TABUNGAN SANTRI (PRIMARY & COMPLETE) */}
      {/* ========================================================================= */}
      {activeTab === 'tabungan' && (
        <div className="space-y-4">
          
          {/* Ringkasan Finansial Tabungan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-teal-800 block uppercase tracking-wider">Total Simpanan</span>
              <div className="text-base sm:text-lg font-black font-mono text-teal-950 mt-0.5">
                {formatRupiah(totalDanaTabungan)}
              </div>
              <span className="text-[10px] text-teal-700 mt-1 block">Dari {tabunganList.length} rekening santri</span>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 block uppercase tracking-wider">Total Setoran Masuk</span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-950 mt-0.5">
                +{formatRupiah(totalTransaksiMasuk)}
              </div>
              <span className="text-[10px] text-emerald-700 mt-1 block">Akumulasi seluruh setoran</span>
            </div>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-rose-800 block uppercase tracking-wider">Total Penarikan Dana</span>
              <div className="text-base sm:text-lg font-black font-mono text-rose-950 mt-0.5">
                -{formatRupiah(totalTransaksiKeluar)}
              </div>
              <span className="text-[10px] text-rose-700 mt-1 block">Penggunaan saku & kitab</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Rekening Terdaftar</span>
              <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-0.5">
                {tabunganList.length} Santri
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Kelas 1 s/d Kelas 6</span>
            </div>
          </div>

          {/* Action Bar & Filters */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari santri, no. rekening, NISN, atau wali..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                {canEdit && (
                  <>
                    <button
                      onClick={() => {
                        playTapSound();
                        setIsBukaRekeningModalOpen(true);
                      }}
                      className="bg-teal-700 hover:bg-teal-800 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Buka Rekening</span>
                    </button>

                    <button
                      onClick={() => {
                        playTapSound();
                        setTransaksiTargetSantri(null);
                        setTransaksiInitialJenis('Setor');
                        setIsTransaksiModalOpen(true);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Setor / Tarik</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleExportCSV}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200"
                  title="Export Data ke CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Row: Kelas, Program, Sorting */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter Kelas */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold text-[11px]">Kelas:</span>
                  <select
                    value={filterKelasTabungan}
                    onChange={(e) => setFilterKelasTabungan(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-emerald-500"
                  >
                    <option value="Semua">Semua Kelas</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 4">Kelas 4</option>
                    <option value="Kelas 5">Kelas 5</option>
                    <option value="Kelas 6">Kelas 6</option>
                  </select>
                </div>

                {/* Filter Program */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold text-[11px]">Program:</span>
                  <select
                    value={filterProgramTabungan}
                    onChange={(e) => setFilterProgramTabungan(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-emerald-500"
                  >
                    <option value="Semua">Semua Program</option>
                    <option value="Reguler/Saku">Reguler/Saku</option>
                    <option value="Haflah & Wisuda">Haflah & Wisuda</option>
                    <option value="Qurban">Qurban</option>
                    <option value="Kitab & ATK">Kitab & ATK</option>
                  </select>
                </div>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold text-[11px]">Urutkan:</span>
                <select
                  value={sortByTabungan}
                  onChange={(e) => setSortByTabungan(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-emerald-500"
                >
                  <option value="tertinggi">Saldo Tertinggi</option>
                  <option value="terendah">Saldo Terendah</option>
                  <option value="terbaru">Transaksi Terbaru</option>
                  <option value="nama">Nama (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Tabungan Santri */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-teal-600" />
                Daftar Buku Rekening Tabungan Santri ({filteredTabungan.length})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Tersinkron Cloud Firestore
              </span>
            </div>

            {filteredTabungan.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                Tidak ada data santri yang cocok dengan filter / pencarian.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTabungan.map((tab) => (
                  <div
                    key={tab.id}
                    className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Left: Santri Card & Photo */}
                    <div className="flex items-center gap-3">
                      {tab.foto ? (
                        <img 
                          src={tab.foto} 
                          alt={tab.nama} 
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center border border-teal-200 shadow-2xs shrink-0">
                          {tab.nama.charAt(0)}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900">{tab.nama}</h4>
                          <span className="text-[10px] font-black px-2 py-0.2 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
                            {tab.kelas}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 hidden sm:inline-block">
                            {tab.programTabungan || 'Reguler/Saku'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-mono flex flex-wrap items-center gap-x-2">
                          <span className="font-bold text-slate-700">{tab.noRekening || tab.noInduk}</span>
                          {tab.namaWali && <span className="text-slate-400">• Wali: {tab.namaWali}</span>}
                          {tab.terakhirTransaksi && (
                            <span className="text-slate-400 text-[10px]">• Update: {tab.terakhirTransaksi}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right: Saldo & Quick Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Saldo Simpanan</span>
                        <span className="text-base font-black text-emerald-800 font-mono">
                          {formatRupiah(tab.jumlahTabungan)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {canEdit && (
                          <>
                            <button
                              onClick={() => {
                                playTapSound();
                                setTransaksiTargetSantri(tab);
                                setTransaksiInitialJenis('Setor');
                                setIsTransaksiModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                              title="Setor Tunai"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Setor</span>
                            </button>

                            <button
                              onClick={() => {
                                playTapSound();
                                setTransaksiTargetSantri(tab);
                                setTransaksiInitialJenis('Tarik');
                                setIsTransaksiModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                              title="Tarik Tunai"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Tarik</span>
                            </button>
                          </>
                        )}

                        {/* Open Official Passbook Modal */}
                        <button
                          onClick={() => {
                            playTapSound();
                            setSelectedPassbookSantri(tab);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-extrabold transition-colors border border-teal-200 flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Buku Tabungan</span>
                        </button>

                        {/* Delete Account (Admin only) */}
                        {canEdit && activeRole === 'admin' && (
                          <button
                            onClick={() => handleDeleteTabungan(tab)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Tutup / Hapus Rekening"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 2: DAFTAR PRODUK KOPERASI */}
      {/* ========================================================================= */}
      {activeTab === 'produk' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Kategori */}
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
                        {formatRupiah(prod.harga)}
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

      {/* ========================================================================= */}
      {/* SUB-SECTION 3: DAFTAR KITAB & HARGA KHUSUS */}
      {/* ========================================================================= */}
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
                      {formatRupiah(k.harga)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Stok: {k.stok} exp</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Modal Buku Tabungan Digital (Passbook) */}
      {selectedPassbookSantri && (
        <BukuTabunganModal
          santri={selectedPassbookSantri}
          onClose={() => setSelectedPassbookSantri(null)}
          onOpenTransaksi={(s, jenis) => {
            setTransaksiTargetSantri(s);
            setTransaksiInitialJenis(jenis);
            setIsTransaksiModalOpen(true);
          }}
          onViewKuitansi={(s, item) => {
            setKuitansiData({
              santri: s,
              transaksi: item
            });
          }}
          canEdit={canEdit}
        />
      )}

      {/* Modal Transaksi Setor / Tarik Tabungan */}
      {isTransaksiModalOpen && (
        <TransaksiTabunganModal
          santriList={tabunganList}
          initialSantri={transaksiTargetSantri}
          initialJenis={transaksiInitialJenis}
          currentUser={currentUser}
          onClose={() => {
            setIsTransaksiModalOpen(false);
            setTransaksiTargetSantri(null);
          }}
          onSave={handleSaveTransaksi}
        />
      )}

      {/* Modal Buka Rekening Baru */}
      {isBukaRekeningModalOpen && (
        <BukaRekeningModal
          existingTabunganList={tabunganList}
          onClose={() => setIsBukaRekeningModalOpen(false)}
          onSave={handleSaveTabunganAccount}
        />
      )}

      {/* Modal Kuitansi Transaksi Resmi */}
      {kuitansiData && (
        <KuitansiTabunganModal
          santri={kuitansiData.santri}
          transaksi={kuitansiData.transaksi}
          onClose={() => setKuitansiData(null)}
        />
      )}

      {/* Modal Tambah / Edit Produk KOPAS */}
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
    </div>
  );
};
