import React, { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Building, 
  Search, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  QrCode,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Cloud,
  Check,
  AlertTriangle,
  Download,
  RotateCcw,
  Eye,
  Filter,
  UserCheck
} from 'lucide-react';
import { BIODATA_ASATIDZ_LIST, BIODATA_MURID_LIST } from '../../data/madrasahCompleteData';
import { BiodataAsatidz, BiodataMurid } from '../../types';
import { playTapSound } from '../../utils/audio';
import {
  saveAsatidzToFirestore,
  deleteAsatidzFromFirestore,
  subscribeAsatidzFromFirestore,
  saveMuridToFirestore,
  deleteMuridFromFirestore,
  subscribeMuridFromFirestore
} from '../../services/firestoreService';

const STORAGE_KEY_ASATIDZ = 'madrasah_biodata_asatidz_v2';
const STORAGE_KEY_MURID = 'madrasah_biodata_murid_v2';

const AVATAR_PRESETS_ASATIDZ = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
];

const AVATAR_PRESETS_MURID = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80'
];

export const BiodataView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'asatidz' | 'murid'>('asatidz');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<'Semua' | 'Laki-laki' | 'Perempuan'>('Semua');

  // Cloud & Local State
  const [asatidzList, setAsatidzList] = useState<BiodataAsatidz[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASATIDZ);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return BIODATA_ASATIDZ_LIST;
  });

  const [muridList, setMuridList] = useState<BiodataMurid[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MURID);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return BIODATA_MURID_LIST;
  });

  const [cloudStatus, setCloudStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Modals & Detail State
  const [isAddAsatidzOpen, setIsAddAsatidzOpen] = useState(false);
  const [editingAsatidz, setEditingAsatidz] = useState<BiodataAsatidz | null>(null);
  const [deletingAsatidz, setDeletingAsatidz] = useState<BiodataAsatidz | null>(null);
  const [viewingAsatidz, setViewingAsatidz] = useState<BiodataAsatidz | null>(null);

  const [isAddMuridOpen, setIsAddMuridOpen] = useState(false);
  const [editingMurid, setEditingMurid] = useState<BiodataMurid | null>(null);
  const [deletingMurid, setDeletingMurid] = useState<BiodataMurid | null>(null);
  const [viewingMurid, setViewingMurid] = useState<BiodataMurid | null>(null);

  // Form State for Asatidz
  const [formAsatidz, setFormAsatidz] = useState<Omit<BiodataAsatidz, 'id'>>({
    niy: '',
    nama: '',
    foto: AVATAR_PRESETS_ASATIDZ[0],
    tanggalLahir: '',
    tempatLahir: '',
    alamat: '',
    orangTua: { ayah: '', ibu: '', wali: '' },
    pendidikanTerakhir: 'S1 Pendidikan Agama Islam',
    noWa: '0812-3456-7890',
    tanggalMasukMadrasah: '01 Juli 2020',
    bidangStudiYangDiajar: ['Fiqih & Fathul Qorib'],
    jabatan: 'Dewan Asatidz'
  });

  const [bidangStudiInput, setBidangStudiInput] = useState<string>('Fiqih, Nahwu');

  // Form State for Murid
  const [formMurid, setFormMurid] = useState<Omit<BiodataMurid, 'id'>>({
    noInduk: '',
    nisn: '',
    nama: '',
    foto: AVATAR_PRESETS_MURID[0],
    tanggalLahir: '',
    tempatLahir: '',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 1',
    alamat: '',
    orangTua: { ayah: '', ibu: '', wali: '' },
    noWa: '0813-9876-5432',
    tanggalMasukMadrasah: '15 Juli 2023',
    status: 'Aktif'
  });

  // 1. Subscribe to Firestore Asatidz Real-time
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeAsatidzFromFirestore(
      (items) => {
        if (!isMounted) return;
        if (items && items.length > 0) {
          setAsatidzList(items);
          localStorage.setItem(STORAGE_KEY_ASATIDZ, JSON.stringify(items));
        } else {
          // If remote is empty, seed initial data to Firestore
          BIODATA_ASATIDZ_LIST.forEach((ast) => saveAsatidzToFirestore(ast));
        }
        setCloudStatus('synced');
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Asatidz subscription fallback:', error);
        setCloudStatus('offline');
      }
    );
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 2. Subscribe to Firestore Santri / Murid Real-time
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = subscribeMuridFromFirestore(
      (items) => {
        if (!isMounted) return;
        if (items && items.length > 0) {
          setMuridList(items);
          localStorage.setItem(STORAGE_KEY_MURID, JSON.stringify(items));
        } else {
          // If remote is empty, seed initial data to Firestore
          BIODATA_MURID_LIST.forEach((mrd) => saveMuridToFirestore(mrd));
        }
        setCloudStatus('synced');
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Murid subscription fallback:', error);
        setCloudStatus('offline');
      }
    );
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASATIDZ, JSON.stringify(asatidzList));
    } catch (e) {
      console.error(e);
    }
  }, [asatidzList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MURID, JSON.stringify(muridList));
    } catch (e) {
      console.error(e);
    }
  }, [muridList]);

  // Handle Create / Update Asatidz
  const handleOpenAddAsatidz = () => {
    playTapSound();
    setFormAsatidz({
      niy: `NIY.${new Date().getFullYear()}.${String(asatidzList.length + 1).padStart(3, '0')}`,
      nama: '',
      foto: AVATAR_PRESETS_ASATIDZ[Math.floor(Math.random() * AVATAR_PRESETS_ASATIDZ.length)],
      tanggalLahir: '12 Mei 1990',
      tempatLahir: 'Semarang',
      alamat: 'Jl. Pesantren No. 12, Kendal',
      orangTua: { ayah: 'H. Abdullah', ibu: 'Hj. Aminah', wali: '-' },
      pendidikanTerakhir: 'S1 Pendidikan Agama Islam',
      noWa: '0812-3456-7890',
      tanggalMasukMadrasah: '01 Juli 2021',
      bidangStudiYangDiajar: ['Fiqih & Fathul Qorib', 'Nahwu Jurumiyah'],
      jabatan: 'Dewan Asatidz'
    });
    setBidangStudiInput('Fiqih & Fathul Qorib, Nahwu Jurumiyah');
    setEditingAsatidz(null);
    setIsAddAsatidzOpen(true);
  };

  const handleOpenEditAsatidz = (ast: BiodataAsatidz) => {
    playTapSound();
    setEditingAsatidz(ast);
    setFormAsatidz({
      niy: ast.niy,
      nama: ast.nama,
      foto: ast.foto,
      tanggalLahir: ast.tanggalLahir,
      tempatLahir: ast.tempatLahir,
      alamat: ast.alamat,
      orangTua: {
        ayah: ast.orangTua.ayah,
        ibu: ast.orangTua.ibu,
        wali: ast.orangTua.wali || '-'
      },
      pendidikanTerakhir: ast.pendidikanTerakhir,
      noWa: ast.noWa,
      tanggalMasukMadrasah: ast.tanggalMasukMadrasah || ast.tanggalMasuk || '01 Juli 2020',
      bidangStudiYangDiajar: ast.bidangStudiYangDiajar || ast.bidangStudi || ['Fiqih'],
      jabatan: ast.jabatan || 'Dewan Asatidz'
    });
    setBidangStudiInput((ast.bidangStudiYangDiajar || ast.bidangStudi || []).join(', '));
    setIsAddAsatidzOpen(true);
  };

  const handleSaveAsatidz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAsatidz.nama.trim() || !formAsatidz.niy.trim()) {
      alert('Nama dan NIY wajib diisi.');
      return;
    }

    playTapSound();
    setCloudStatus('saving');

    const splitMapel = bidangStudiInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedData: BiodataAsatidz = {
      id: editingAsatidz ? editingAsatidz.id : `ast_${Date.now()}`,
      niy: formAsatidz.niy.trim(),
      nama: formAsatidz.nama.trim(),
      foto: formAsatidz.foto || AVATAR_PRESETS_ASATIDZ[0],
      tanggalLahir: formAsatidz.tanggalLahir.trim(),
      tempatLahir: formAsatidz.tempatLahir.trim(),
      alamat: formAsatidz.alamat.trim(),
      orangTua: formAsatidz.orangTua,
      pendidikanTerakhir: formAsatidz.pendidikanTerakhir.trim(),
      noWa: formAsatidz.noWa.trim(),
      tanggalMasukMadrasah: formAsatidz.tanggalMasukMadrasah || '01 Juli 2020',
      bidangStudiYangDiajar: splitMapel.length > 0 ? splitMapel : ['Pendidikan Agama'],
      jabatan: formAsatidz.jabatan || 'Dewan Asatidz'
    };

    try {
      // 1. Save to Cloud Firestore
      await saveAsatidzToFirestore(updatedData);

      // 2. Update Local State
      if (editingAsatidz) {
        setAsatidzList((prev) => prev.map((a) => (a.id === updatedData.id ? updatedData : a)));
        showToast(`✅ Data Asatidz ${updatedData.nama} berhasil diperbarui di Cloud & Lokal!`);
      } else {
        setAsatidzList((prev) => [updatedData, ...prev]);
        showToast(`✅ Asatidz Baru ${updatedData.nama} berhasil ditambahkan!`);
      }
      setIsAddAsatidzOpen(false);
      setCloudStatus('synced');
    } catch (err) {
      console.warn('Firestore write fallback', err);
      if (editingAsatidz) {
        setAsatidzList((prev) => prev.map((a) => (a.id === updatedData.id ? updatedData : a)));
      } else {
        setAsatidzList((prev) => [updatedData, ...prev]);
      }
      setIsAddAsatidzOpen(false);
      setCloudStatus('offline');
      showToast(`💾 Tersimpan di memori perangkat lokal`);
    }
  };

  const handleConfirmDeleteAsatidz = async () => {
    if (!deletingAsatidz) return;
    playTapSound();
    setCloudStatus('saving');
    const target = deletingAsatidz;
    try {
      await deleteAsatidzFromFirestore(target.id);
      setAsatidzList((prev) => prev.filter((a) => a.id !== target.id));
      showToast(`🗑️ Data Asatidz ${target.nama} telah dihapus.`);
      setDeletingAsatidz(null);
      setCloudStatus('synced');
    } catch (e) {
      console.warn('Delete fallback', e);
      setAsatidzList((prev) => prev.filter((a) => a.id !== target.id));
      showToast(`🗑️ Dihapus dari penyimpanan lokal.`);
      setDeletingAsatidz(null);
      setCloudStatus('offline');
    }
  };

  // Handle Create / Update Murid
  const handleOpenAddMurid = () => {
    playTapSound();
    setFormMurid({
      noInduk: `M.${String(muridList.length + 1).padStart(3, '0')}`,
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      nama: '',
      foto: AVATAR_PRESETS_MURID[Math.floor(Math.random() * AVATAR_PRESETS_MURID.length)],
      tanggalLahir: '10 Januari 2015',
      tempatLahir: 'Kendal',
      jenisKelamin: 'Laki-laki',
      kelas: selectedKelas !== 'Semua' ? selectedKelas : 'Kelas 1',
      alamat: 'Desa Karangdowo, RT 02/03, Kec. Weleri',
      orangTua: { ayah: 'Bpk. Suryanto', ibu: 'Ibu Fatimah', wali: '-' },
      noWa: '0813-9876-5432',
      tanggalMasukMadrasah: '15 Juli 2023',
      status: 'Aktif'
    });
    setEditingMurid(null);
    setIsAddMuridOpen(true);
  };

  const handleOpenEditMurid = (mrd: BiodataMurid) => {
    playTapSound();
    setEditingMurid(mrd);
    setFormMurid({
      noInduk: mrd.noInduk,
      nisn: mrd.nisn || '',
      nama: mrd.nama,
      foto: mrd.foto,
      tanggalLahir: mrd.tanggalLahir,
      tempatLahir: mrd.tempatLahir,
      jenisKelamin: mrd.jenisKelamin,
      kelas: mrd.kelas,
      alamat: mrd.alamat,
      orangTua: {
        ayah: mrd.orangTua.ayah,
        ibu: mrd.orangTua.ibu,
        wali: mrd.orangTua.wali || '-'
      },
      noWa: mrd.noWa,
      tanggalMasukMadrasah: mrd.tanggalMasukMadrasah || mrd.tanggalMasuk || '15 Juli 2023',
      status: mrd.status || 'Aktif'
    });
    setIsAddMuridOpen(true);
  };

  const handleSaveMurid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMurid.nama.trim() || !formMurid.noInduk.trim()) {
      alert('Nama dan No. Induk wajib diisi.');
      return;
    }

    playTapSound();
    setCloudStatus('saving');

    const updatedData: BiodataMurid = {
      id: editingMurid ? editingMurid.id : `mrd_${Date.now()}`,
      noInduk: formMurid.noInduk.trim(),
      nisn: formMurid.nisn?.trim() || `00${Date.now().toString().slice(-8)}`,
      nama: formMurid.nama.trim(),
      foto: formMurid.foto || AVATAR_PRESETS_MURID[0],
      tanggalLahir: formMurid.tanggalLahir.trim(),
      tempatLahir: formMurid.tempatLahir.trim(),
      jenisKelamin: formMurid.jenisKelamin,
      kelas: formMurid.kelas,
      alamat: formMurid.alamat.trim(),
      orangTua: formMurid.orangTua,
      noWa: formMurid.noWa.trim(),
      tanggalMasukMadrasah: formMurid.tanggalMasukMadrasah || '15 Juli 2023',
      status: formMurid.status || 'Aktif'
    };

    try {
      // 1. Save to Cloud Firestore
      await saveMuridToFirestore(updatedData);

      // 2. Update Local State
      if (editingMurid) {
        setMuridList((prev) => prev.map((m) => (m.id === updatedData.id ? updatedData : m)));
        showToast(`✅ Data Santri ${updatedData.nama} berhasil diperbarui di Cloud!`);
      } else {
        setMuridList((prev) => [updatedData, ...prev]);
        showToast(`✅ Santri Baru ${updatedData.nama} (${updatedData.kelas}) berhasil didaftarkan!`);
      }
      setIsAddMuridOpen(false);
      setCloudStatus('synced');
    } catch (err) {
      console.warn('Firestore write fallback', err);
      if (editingMurid) {
        setMuridList((prev) => prev.map((m) => (m.id === updatedData.id ? updatedData : m)));
      } else {
        setMuridList((prev) => [updatedData, ...prev]);
      }
      setIsAddMuridOpen(false);
      setCloudStatus('offline');
      showToast(`💾 Tersimpan di memori perangkat lokal`);
    }
  };

  const handleConfirmDeleteMurid = async () => {
    if (!deletingMurid) return;
    playTapSound();
    setCloudStatus('saving');
    const target = deletingMurid;
    try {
      await deleteMuridFromFirestore(target.id);
      setMuridList((prev) => prev.filter((m) => m.id !== target.id));
      showToast(`🗑️ Data Santri ${target.nama} telah dihapus.`);
      setDeletingMurid(null);
      setCloudStatus('synced');
    } catch (e) {
      console.warn('Delete fallback', e);
      setMuridList((prev) => prev.filter((m) => m.id !== target.id));
      showToast(`🗑️ Dihapus dari penyimpanan lokal.`);
      setDeletingMurid(null);
      setCloudStatus('offline');
    }
  };

  // Reset to Factory Default Data
  const handleResetDefaultData = () => {
    if (confirm('Kembalikan data Biodata Asatidz & Santri ke data bawaan lengkap madrasah?')) {
      playTapSound();
      setAsatidzList(BIODATA_ASATIDZ_LIST);
      setMuridList(BIODATA_MURID_LIST);
      localStorage.setItem(STORAGE_KEY_ASATIDZ, JSON.stringify(BIODATA_ASATIDZ_LIST));
      localStorage.setItem(STORAGE_KEY_MURID, JSON.stringify(BIODATA_MURID_LIST));
      BIODATA_ASATIDZ_LIST.forEach((ast) => saveAsatidzToFirestore(ast));
      BIODATA_MURID_LIST.forEach((mrd) => saveMuridToFirestore(mrd));
      showToast('🔄 Data Biodata berhasil di-reset ke template resmi madrasah!');
    }
  };

  // Print/Export Helper
  const handlePrintTable = () => {
    playTapSound();
    window.print();
  };

  // Filter Asatidz
  const filteredAsatidz = asatidzList.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      a.nama.toLowerCase().includes(q) ||
      a.niy.toLowerCase().includes(q) ||
      (a.jabatan && a.jabatan.toLowerCase().includes(q)) ||
      (a.alamat && a.alamat.toLowerCase().includes(q)) ||
      (a.bidangStudiYangDiajar &&
        a.bidangStudiYangDiajar.some((b) => b.toLowerCase().includes(q)))
    );
  });

  // Filter Murid
  const filteredMurid = muridList.filter((m) => {
    const matchKelas = selectedKelas === 'Semua' || m.kelas === selectedKelas;
    const matchGender = selectedGender === 'Semua' || m.jenisKelamin === selectedGender;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      m.nama.toLowerCase().includes(q) ||
      m.noInduk.toLowerCase().includes(q) ||
      (m.nisn && m.nisn.includes(q)) ||
      m.alamat.toLowerCase().includes(q) ||
      (m.orangTua?.ayah && m.orangTua.ayah.toLowerCase().includes(q)) ||
      (m.orangTua?.ibu && m.orangTua.ibu.toLowerCase().includes(q));
    return matchKelas && matchGender && matchQuery;
  });

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-700 to-emerald-800 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 2
            </span>
            <span className="text-emerald-100 text-xs font-semibold">Pangkalan Data Induk Digital</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            2. BUKU INDUK BIODATA LENGKAP
          </h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Manajemen Data Asatidz, Tenaga Kependidikan & Santri Kelas 1 - 6
          </p>
        </div>

        {/* Cloud Sync Status & Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs text-white">
            <Cloud className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>
              {cloudStatus === 'synced' ? 'Cloud Terhubung' : cloudStatus === 'saving' ? 'Menyimpan...' : 'Offline Cache'}
            </span>
          </div>

          <button
            onClick={handlePrintTable}
            title="Cetak Rekap"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          <button
            onClick={handleResetDefaultData}
            title="Reset Data Bawaan"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub Tab Switcher: A. Asatidz vs B. Murid */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveTab('asatidz');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'asatidz'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>A. BIODATA ASATIDZ ({asatidzList.length})</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveTab('murid');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'murid'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>B. BIODATA SANTRI / MURID ({muridList.length})</span>
        </button>
      </div>

      {/* Search, Filter & Quick Add Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeTab === 'asatidz'
                  ? 'Cari Asatidz / NIY / Mapel / Alamat...'
                  : 'Cari Nama Santri / No Induk / Orang Tua / Alamat...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Add Data Button */}
          {activeTab === 'asatidz' ? (
            <button
              onClick={handleOpenAddAsatidz}
              className="flex items-center justify-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Asatidz Baru</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddMurid}
              className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Santri Baru</span>
            </button>
          )}
        </div>

        {/* Filter Chips for Murid (Kelas 1-6 & Gender) */}
        {activeTab === 'murid' && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            {/* Filter Kelas */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Kelas:</span>
              {['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    playTapSound();
                    setSelectedKelas(k);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs shrink-0 transition-all cursor-pointer ${
                    selectedKelas === k
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Filter Gender */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Gender:</span>
              {(['Semua', 'Laki-laki', 'Perempuan'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    playTapSound();
                    setSelectedGender(g);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    selectedGender === g
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SUB-SECTION A: BIODATA ASATIDZ */}
      {activeTab === 'asatidz' && (
        <>
          {filteredAsatidz.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
              <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Data Asatidz Tidak Ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci lain atau tambahkan asatidz baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredAsatidz.map((ast) => (
                <div
                  key={ast.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-28 h-28 bg-teal-50 rounded-bl-full pointer-events-none -z-0" />

                  <div className="relative z-10 space-y-3">
                    {/* Header: Foto + Nama + NIY + Jabatan + Quick Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-teal-600 bg-slate-100 shrink-0 shadow-xs">
                          <img
                            src={ast.foto || AVATAR_PRESETS_ASATIDZ[0]}
                            alt={ast.nama}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 inline-block mb-1">
                            {ast.jabatan || 'Dewan Asatidz'}
                          </span>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                            {ast.nama}
                          </h3>
                          <p className="text-xs font-mono font-bold text-teal-700 mt-0.5">
                            NIY : {ast.niy}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            playTapSound();
                            setViewingAsatidz(ast);
                          }}
                          title="Lihat Detail & Kartu Asatidz"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditAsatidz(ast)}
                          title="Edit Biodata"
                          className="p-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            playTapSound();
                            setDeletingAsatidz(ast);
                          }}
                          title="Hapus Asatidz"
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Information Grid */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Tempat, Tanggal Lahir:</span>
                          <p className="font-bold text-slate-800">{ast.tempatLahir}, {ast.tanggalLahir}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Alamat Lengkap:</span>
                          <p className="font-medium text-slate-800">{ast.alamat}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Heart className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Orang Tua (Ayah & Ibu):</span>
                          <p className="font-bold text-slate-800">{ast.orangTua.ayah} & {ast.orangTua.ibu}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Pendidikan Terakhir:</span>
                          <p className="font-bold text-slate-800">{ast.pendidikanTerakhir}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-500">No. WhatsApp:</span>
                        <a
                          href={`https://wa.me/${ast.noWa.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold font-mono text-emerald-700 hover:underline"
                        >
                          {ast.noWa}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="font-semibold text-slate-500">Tanggal Masuk:</span>
                        <span className="font-bold text-slate-800">{ast.tanggalMasukMadrasah || ast.tanggalMasuk}</span>
                      </div>
                    </div>

                    {/* Bidang Study Yang Diajar */}
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-600 block mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                        Bidang Study / Kitab Yang Diajar:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(ast.bidangStudiYangDiajar || ast.bidangStudi || []).map((b, i) => (
                          <span
                            key={i}
                            className="bg-teal-50 border border-teal-200 text-teal-950 text-[10px] font-bold px-2.5 py-1 rounded-xl"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* SUB-SECTION B: BIODATA MURID */}
      {activeTab === 'murid' && (
        <>
          {filteredMurid.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Data Santri Tidak Ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba ganti filter kelas atau tambahkan santri baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredMurid.map((mrd) => (
                <div
                  key={mrd.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header: Foto + Nama + Kelas + Quick Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-600 bg-slate-100 shrink-0 shadow-xs">
                          <img
                            src={mrd.foto || AVATAR_PRESETS_MURID[0]}
                            alt={mrd.nama}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                              {mrd.kelas}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">
                              {mrd.jenisKelamin}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                            {mrd.nama}
                          </h3>
                          <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                            No. Induk : {mrd.noInduk} {mrd.nisn && `(NISN: ${mrd.nisn})`}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            playTapSound();
                            setViewingMurid(mrd);
                          }}
                          title="Lihat Kartu Santri & QR"
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditMurid(mrd)}
                          title="Edit Santri"
                          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            playTapSound();
                            setDeletingMurid(mrd);
                          }}
                          title="Hapus Santri"
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Information Grid */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Tempat, Tanggal Lahir:</span>
                          <p className="font-bold text-slate-800">{mrd.tempatLahir}, {mrd.tanggalLahir}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Alamat Lengkap:</span>
                          <p className="font-medium text-slate-800">{mrd.alamat}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Heart className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-500">Orang Tua / Wali Santri:</span>
                          <p className="font-bold text-slate-800">Ayah: {mrd.orangTua.ayah} | Ibu: {mrd.orangTua.ibu}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-500">No. WhatsApp Wali:</span>
                        <a
                          href={`https://wa.me/${mrd.noWa.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold font-mono text-emerald-700 hover:underline"
                        >
                          {mrd.noWa}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="font-semibold text-slate-500">Tanggal Masuk:</span>
                        <span className="font-bold text-slate-800">{mrd.tanggalMasukMadrasah || mrd.tanggalMasuk}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH / EDIT ASATIDZ */}
      {/* ========================================================================= */}
      {isAddAsatidzOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-teal-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">
                  {editingAsatidz ? 'Edit Biodata Asatidz' : 'Tambah Asatidz Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddAsatidzOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsatidz} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">NIY (Nomor Induk Yayasan):</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.niy}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, niy: e.target.value })}
                    placeholder="Contoh: NIY.2020.001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Jabatan / Amanah:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.jabatan}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, jabatan: e.target.value })}
                    placeholder="Contoh: Dewan Asatidz / Kepala Madrasah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Nama Lengkap & Gelar:</label>
                <input
                  type="text"
                  required
                  value={formAsatidz.nama}
                  onChange={(e) => setFormAsatidz({ ...formAsatidz, nama: e.target.value })}
                  placeholder="Contoh: Ust. Ahmad Fauzi, S.Pd.I"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tempat Lahir:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.tempatLahir}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, tempatLahir: e.target.value })}
                    placeholder="Kendal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tanggal Lahir:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.tanggalLahir}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, tanggalLahir: e.target.value })}
                    placeholder="12 Mei 1990"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Alamat Lengkap Domisili:</label>
                <textarea
                  rows={2}
                  required
                  value={formAsatidz.alamat}
                  onChange={(e) => setFormAsatidz({ ...formAsatidz, alamat: e.target.value })}
                  placeholder="Dukuh Krajan RT 01/02, Desa Sukomulyo, Kaliwungu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Nama Ayah:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.orangTua.ayah}
                    onChange={(e) =>
                      setFormAsatidz({
                        ...formAsatidz,
                        orangTua: { ...formAsatidz.orangTua, ayah: e.target.value }
                      })
                    }
                    placeholder="H. Abdullah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Nama Ibu:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.orangTua.ibu}
                    onChange={(e) =>
                      setFormAsatidz({
                        ...formAsatidz,
                        orangTua: { ...formAsatidz.orangTua, ibu: e.target.value }
                      })
                    }
                    placeholder="Hj. Aminah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Pendidikan Terakhir:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.pendidikanTerakhir}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, pendidikanTerakhir: e.target.value })}
                    placeholder="S1 Pendidikan Agama Islam"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">No. WhatsApp Aktif:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.noWa}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, noWa: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Bidang Studi Yang Diajar (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  required
                  value={bidangStudiInput}
                  onChange={(e) => setBidangStudiInput(e.target.value)}
                  placeholder="Fiqih, Nahwu Jurumiyah, Tauhid"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tanggal Masuk Madrasah:</label>
                  <input
                    type="text"
                    required
                    value={formAsatidz.tanggalMasukMadrasah}
                    onChange={(e) => setFormAsatidz({ ...formAsatidz, tanggalMasukMadrasah: e.target.value })}
                    placeholder="01 Juli 2020"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Foto Profil (Pilih Preset / URL):</label>
                  <div className="flex items-center gap-1.5">
                    {AVATAR_PRESETS_ASATIDZ.slice(0, 4).map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormAsatidz({ ...formAsatidz, foto: p })}
                        className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                          formAsatidz.foto === p ? 'border-teal-600 scale-105 ring-2 ring-teal-400' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={p} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddAsatidzOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Asatidz</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH / EDIT SANTRI / MURID */}
      {/* ========================================================================= */}
      {isAddMuridOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">
                  {editingMurid ? 'Edit Biodata Santri' : 'Tambah Santri / Murid Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddMuridOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMurid} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">No. Induk Santri:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.noInduk}
                    onChange={(e) => setFormMurid({ ...formMurid, noInduk: e.target.value })}
                    placeholder="Contoh: M.001 / 2023.001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">NISN (Opsional):</label>
                  <input
                    type="text"
                    value={formMurid.nisn}
                    onChange={(e) => setFormMurid({ ...formMurid, nisn: e.target.value })}
                    placeholder="0087654321"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Nama Lengkap Santri:</label>
                <input
                  type="text"
                  required
                  value={formMurid.nama}
                  onChange={(e) => setFormMurid({ ...formMurid, nama: e.target.value })}
                  placeholder="Contoh: Muhammad Rayhan Al-Fatih"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tingkat Kelas:</label>
                  <select
                    value={formMurid.kelas}
                    onChange={(e) => setFormMurid({ ...formMurid, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                  >
                    {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Jenis Kelamin:</label>
                  <select
                    value={formMurid.jenisKelamin}
                    onChange={(e) =>
                      setFormMurid({
                        ...formMurid,
                        jenisKelamin: e.target.value as 'Laki-laki' | 'Perempuan'
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                  >
                    <option value="Laki-laki">Laki-laki (Santriwan)</option>
                    <option value="Perempuan">Perempuan (Santriwati)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tempat Lahir:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.tempatLahir}
                    onChange={(e) => setFormMurid({ ...formMurid, tempatLahir: e.target.value })}
                    placeholder="Kendal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tanggal Lahir:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.tanggalLahir}
                    onChange={(e) => setFormMurid({ ...formMurid, tanggalLahir: e.target.value })}
                    placeholder="10 Januari 2015"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Alamat Lengkap Santri:</label>
                <textarea
                  rows={2}
                  required
                  value={formMurid.alamat}
                  onChange={(e) => setFormMurid({ ...formMurid, alamat: e.target.value })}
                  placeholder="Dukuh Krajan RT 02/01, Desa Mororejo, Kaliwungu"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Nama Ayah:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.orangTua.ayah}
                    onChange={(e) =>
                      setFormMurid({
                        ...formMurid,
                        orangTua: { ...formMurid.orangTua, ayah: e.target.value }
                      })
                    }
                    placeholder="Bpk. Suryanto"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Nama Ibu:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.orangTua.ibu}
                    onChange={(e) =>
                      setFormMurid({
                        ...formMurid,
                        orangTua: { ...formMurid.orangTua, ibu: e.target.value }
                      })
                    }
                    placeholder="Ibu Fatimah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">No. WhatsApp Wali:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.noWa}
                    onChange={(e) => setFormMurid({ ...formMurid, noWa: e.target.value })}
                    placeholder="0813-9876-5432"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tanggal Masuk:</label>
                  <input
                    type="text"
                    required
                    value={formMurid.tanggalMasukMadrasah}
                    onChange={(e) => setFormMurid({ ...formMurid, tanggalMasukMadrasah: e.target.value })}
                    placeholder="15 Juli 2023"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Foto Santri (Preset):</label>
                <div className="flex items-center gap-1.5">
                  {AVATAR_PRESETS_MURID.map((p, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormMurid({ ...formMurid, foto: p })}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                        formMurid.foto === p ? 'border-emerald-600 scale-105 ring-2 ring-emerald-400' : 'border-slate-200 opacity-60'
                      }`}
                    >
                      <img src={p} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddMuridOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Santri</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {(deletingAsatidz || deletingMurid) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Konfirmasi Hapus Data</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus data{' '}
                <strong className="text-slate-800">
                  {deletingAsatidz ? deletingAsatidz.nama : deletingMurid?.nama}
                </strong>
                ? Aksi ini akan menghapus data dari Cloud Firestore dan memori perangkat.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeletingAsatidz(null);
                  setDeletingMurid(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={deletingAsatidz ? handleConfirmDeleteAsatidz : handleConfirmDeleteMurid}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DETAIL & KARTU ASATIDZ PRINT PREVIEW */}
      {/* ========================================================================= */}
      {viewingAsatidz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-800 to-emerald-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold text-sm">KARTU IDENTITAS ASATIDZ</span>
              </div>
              <button
                onClick={() => setViewingAsatidz(null)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ID Card Content */}
            <div className="p-5 space-y-4">
              <div className="border-2 border-teal-700 rounded-2xl p-4 bg-gradient-to-b from-teal-50/40 to-white relative shadow-xs">
                <div className="flex items-center justify-between border-b border-teal-200 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-xs">
                      M
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-teal-950">MADRASAH DINIYAH AL-IKHLAS</h4>
                      <p className="text-[9px] text-teal-700 font-semibold">Kendal, Jawa Tengah • NSM: 311.33.24.01</p>
                    </div>
                  </div>
                  <QrCode className="w-8 h-8 text-teal-800" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden ring-2 ring-teal-700 shadow-sm shrink-0 bg-slate-100">
                    <img
                      src={viewingAsatidz.foto || AVATAR_PRESETS_ASATIDZ[0]}
                      alt={viewingAsatidz.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-xs space-y-1 min-w-0 flex-1">
                    <h3 className="font-black text-slate-900 text-sm">{viewingAsatidz.nama}</h3>
                    <p className="font-mono font-bold text-teal-800 text-[11px]">NIY: {viewingAsatidz.niy}</p>
                    <p className="text-[10px] text-slate-600">
                      <strong>Amanah:</strong> {viewingAsatidz.jabatan}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>TTL:</strong> {viewingAsatidz.tempatLahir}, {viewingAsatidz.tanggalLahir}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>Pendidikan:</strong> {viewingAsatidz.pendidikanTerakhir}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>WA:</strong> {viewingAsatidz.noWa}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-teal-200 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Masuk: {viewingAsatidz.tanggalMasukMadrasah || viewingAsatidz.tanggalMasuk}</span>
                  <span className="font-bold text-teal-800">E-KARTU ASATIDZ RESMI</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Kartu Identitas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DETAIL & KARTU SANTRI PRINT PREVIEW */}
      {/* ========================================================================= */}
      {viewingMurid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold text-sm">KARTU TANDA PELAJAR SANTRI</span>
              </div>
              <button
                onClick={() => setViewingMurid(null)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Card Content */}
            <div className="p-5 space-y-4">
              <div className="border-2 border-emerald-700 rounded-2xl p-4 bg-gradient-to-b from-emerald-50/40 to-white relative shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-xs">
                      M
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-emerald-950">MADRASAH DINIYAH AL-IKHLAS</h4>
                      <p className="text-[9px] text-emerald-700 font-semibold">Kendal, Jawa Tengah • Jenjang Ula/Wustha</p>
                    </div>
                  </div>
                  <QrCode className="w-8 h-8 text-emerald-800" />
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden ring-2 ring-emerald-700 shadow-sm shrink-0 bg-slate-100">
                    <img
                      src={viewingMurid.foto || AVATAR_PRESETS_MURID[0]}
                      alt={viewingMurid.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-xs space-y-1 min-w-0 flex-1">
                    <h3 className="font-black text-slate-900 text-sm">{viewingMurid.nama}</h3>
                    <p className="font-mono font-bold text-emerald-800 text-[11px]">
                      No. Induk: {viewingMurid.noInduk}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>Tingkat:</strong> {viewingMurid.kelas} ({viewingMurid.jenisKelamin})
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>TTL:</strong> {viewingMurid.tempatLahir}, {viewingMurid.tanggalLahir}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>Orang Tua:</strong> {viewingMurid.orangTua.ayah}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      <strong>Alamat:</strong> {viewingMurid.alamat}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-emerald-200 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Terdaftar: {viewingMurid.tanggalMasukMadrasah || viewingMurid.tanggalMasuk}</span>
                  <span className="font-bold text-emerald-800">KARTU SANTRI RESMI</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Kartu Santri</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
