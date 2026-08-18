import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Search, 
  Filter, 
  UserCheck, 
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Building,
  UserX,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Copy,
  Check,
  X,
  AlertTriangle,
  Printer,
  CheckCheck,
  Info,
  Cloud
} from 'lucide-react';
import { DAFTAR_HADIR_MURID, DAFTAR_HADIR_ASATIDZ } from '../../data/madrasahCompleteData';
import { PresensiMuridItem, PresensiAsatidzItem } from '../../types';
import { playTapSound } from '../../utils/audio';
import { 
  saveDailyAttendanceToFirestore, 
  subscribeDailyAttendanceFromFirestore, 
  DailyAttendanceRecord 
} from '../../services/firestoreService';

const STORAGE_KEY_MURID = 'madrasah_presensi_murid_v2';
const STORAGE_KEY_ASATIDZ = 'madrasah_presensi_asatidz_v2';
const STORAGE_ARCHIVE_KEY = 'madrasah_presensi_archive_v1';

// Helper date formatter Indonesian
const formatIndonesianDate = (isoStr: string) => {
  try {
    const [year, month, day] = isoStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const dayName = days[dateObj.getDay()];
    const monthName = months[dateObj.getMonth()];
    return `${dayName}, ${day} ${monthName} ${year}`;
  } catch {
    return isoStr;
  }
};

const getTodayIso = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DaftarHadirView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'murid' | 'asatidz'>('murid');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Date State with ISO Date and Indonesian Formatted Name
  const [selectedDateIso, setSelectedDateIso] = useState<string>(getTodayIso);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>('Baru saja');
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');

  // State Data Murid & Asatidz with LocalStorage persistence
  const [muridList, setMuridList] = useState<PresensiMuridItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MURID);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DAFTAR_HADIR_MURID;
  });

  const [asatidzList, setAsatidzList] = useState<PresensiAsatidzItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASATIDZ);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DAFTAR_HADIR_ASATIDZ;
  });

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Realtime Firestore Subscription for Selected Date
  useEffect(() => {
    let isMounted = true;
    setCloudSyncStatus('saving');
    
    const unsubscribe = subscribeDailyAttendanceFromFirestore(
      selectedDateIso,
      (remoteRecord) => {
        if (!isMounted) return;
        if (remoteRecord) {
          if (remoteRecord.murid && remoteRecord.murid.length > 0) {
            setMuridList(remoteRecord.murid);
          }
          if (remoteRecord.asatidz && remoteRecord.asatidz.length > 0) {
            setAsatidzList(remoteRecord.asatidz);
          }
          if (remoteRecord.updatedAt) {
            const timeStr = new Date(remoteRecord.updatedAt).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            setLastSavedTimestamp(`${timeStr} WIB (Cloud)`);
          }
        }
        setCloudSyncStatus('synced');
      },
      (error) => {
        if (!isMounted) return;
        console.warn('Firestore subscription using local fallback:', error);
        setCloudSyncStatus('offline');
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedDateIso]);

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MURID, JSON.stringify(muridList));
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTimestamp(`${nowStr} WIB`);
    } catch (e) {
      console.error('Failed to save murid list', e);
    }
  }, [muridList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASATIDZ, JSON.stringify(asatidzList));
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTimestamp(`${nowStr} WIB`);
    } catch (e) {
      console.error('Failed to save asatidz list', e);
    }
  }, [asatidzList]);

  // Handle Date Changing (Load from date archive if exists, or keep state)
  const handleDateChange = (newDateIso: string) => {
    playTapSound();
    setSelectedDateIso(newDateIso);
    try {
      const archiveRaw = localStorage.getItem(`${STORAGE_ARCHIVE_KEY}_${newDateIso}`);
      if (archiveRaw) {
        const parsed = JSON.parse(archiveRaw);
        if (parsed.murid) setMuridList(parsed.murid);
        if (parsed.asatidz) setAsatidzList(parsed.asatidz);
        showToast(`📅 Membuka data absensi tanggal ${formatIndonesianDate(newDateIso)}`);
      }
    } catch {
      // fallback
    }
  };

  // Quick Date Jumpers
  const handleQuickDate = (offsetDays: number) => {
    playTapSound();
    const [year, month, day] = selectedDateIso.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() + offsetDays);
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${d}`;
    handleDateChange(iso);
  };

  // Explicit Save Button (Saves to both Firestore and LocalStorage)
  const handleManualSave = async () => {
    playTapSound();
    setIsManualSaving(true);
    setCloudSyncStatus('saving');

    const totalHadirM = muridList.filter((m) => m.status === 'Hadir').length;
    const totalSakitM = muridList.filter((m) => m.status === 'Sakit').length;
    const totalIjinM = muridList.filter((m) => m.status === 'Ijin').length;
    const totalAlphaM = muridList.filter((m) => m.status === 'Alpha').length;
    const totalHadirA = asatidzList.filter((a) => a.status === 'Hadir').length;

    const record: DailyAttendanceRecord = {
      tanggal: selectedDateIso,
      tanggalFormat: formatIndonesianDate(selectedDateIso),
      murid: muridList,
      asatidz: asatidzList,
      totalMurid: muridList.length,
      totalHadirMurid: totalHadirM,
      totalSakitMurid: totalSakitM,
      totalIjinMurid: totalIjinM,
      totalAlphaMurid: totalAlphaM,
      totalHadirAsatidz: totalHadirA,
      updatedAt: new Date().toISOString(),
    };

    try {
      // 1. Save to Cloud Firestore
      await saveDailyAttendanceToFirestore(record);
      setCloudSyncStatus('synced');

      // 2. Save to LocalStorage cache
      localStorage.setItem(STORAGE_KEY_MURID, JSON.stringify(muridList));
      localStorage.setItem(STORAGE_KEY_ASATIDZ, JSON.stringify(asatidzList));
      localStorage.setItem(`${STORAGE_ARCHIVE_KEY}_${selectedDateIso}`, JSON.stringify(record));
      
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTimestamp(`${nowStr} WIB (Cloud & Lokal)`);
      
      setIsManualSaving(false);
      showToast(`☁️ Data Absensi (${formatIndonesianDate(selectedDateIso)}) BERHASIL DISIMPAN KE FIREBASE & LOKAL!`);
    } catch (e) {
      console.warn('Firestore write fallback to local storage', e);
      localStorage.setItem(STORAGE_KEY_MURID, JSON.stringify(muridList));
      localStorage.setItem(STORAGE_KEY_ASATIDZ, JSON.stringify(asatidzList));
      localStorage.setItem(`${STORAGE_ARCHIVE_KEY}_${selectedDateIso}`, JSON.stringify(record));
      
      setCloudSyncStatus('offline');
      setIsManualSaving(false);
      showToast(`💾 Tersimpan di memori perangkat lokal`);
    }
  };

  // Modal States for Murid
  const [isAddMuridOpen, setIsAddMuridOpen] = useState(false);
  const [editingMurid, setEditingMurid] = useState<PresensiMuridItem | null>(null);
  const [deletingMurid, setDeletingMurid] = useState<PresensiMuridItem | null>(null);

  // Form State for Murid
  const [muridForm, setMuridForm] = useState<{
    nama: string;
    noInduk: string;
    kelas: string;
    status: 'Hadir' | 'Sakit' | 'Ijin' | 'Alpha';
    waktu: string;
    keterangan: string;
  }>({
    nama: '',
    noInduk: '',
    kelas: 'Kelas 1',
    status: 'Hadir',
    waktu: '07:00 WIB',
    keterangan: '',
  });

  // Modal States for Asatidz
  const [isAddAsatidzOpen, setIsAddAsatidzOpen] = useState(false);
  const [editingAsatidz, setEditingAsatidz] = useState<PresensiAsatidzItem | null>(null);
  const [deletingAsatidz, setDeletingAsatidz] = useState<PresensiAsatidzItem | null>(null);

  // Form State for Asatidz
  const [asatidzForm, setAsatidzForm] = useState<{
    nama: string;
    niy: string;
    jabatan: string;
    tugas: string;
    status: 'Hadir' | 'Sakit' | 'Ijin' | 'Alpha' | 'Tugas Luar';
    jamMasuk: string;
    jamPulang: string;
    keterangan: string;
  }>({
    nama: '',
    niy: '',
    jabatan: 'Asatidz',
    tugas: 'Pengajar Mapel',
    status: 'Hadir',
    jamMasuk: '07:00',
    jamPulang: '14:30',
    keterangan: '',
  });

  // Filter Murid
  const filteredMurid = muridList.filter((m) => {
    const matchKelas = selectedKelas === 'Semua' || m.kelas === selectedKelas;
    const matchQuery =
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.noInduk.includes(searchQuery);
    return matchKelas && matchQuery;
  });

  // Filter Asatidz
  const filteredAsatidz = asatidzList.filter((a) =>
    a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.niy.includes(searchQuery) ||
    a.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.tugas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics Murid
  const totalHadirMurid = muridList.filter((m) => m.status === 'Hadir').length;
  const totalSakitMurid = muridList.filter((m) => m.status === 'Sakit').length;
  const totalIjinMurid = muridList.filter((m) => m.status === 'Ijin').length;
  const totalAlphaMurid = muridList.filter((m) => m.status === 'Alpha').length;
  const totalMuridCount = muridList.length;

  // Statistics Asatidz
  const totalHadirAsatidz = asatidzList.filter((a) => a.status === 'Hadir').length;
  const totalIjinAsatidz = asatidzList.filter(
    (a) => a.status === 'Ijin' || a.status === 'Sakit' || a.status === 'Tugas Luar'
  ).length;

  // Quick 1-tap update status for Murid
  const handleUpdateStatusMurid = (id: string, newStatus: 'Hadir' | 'Sakit' | 'Ijin' | 'Alpha') => {
    playTapSound();
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setMuridList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              waktu: newStatus === 'Hadir' ? nowTime : '-',
            }
          : item
      )
    );
  };

  // Quick 1-tap update status for Asatidz
  const handleUpdateStatusAsatidz = (id: string, newStatus: 'Hadir' | 'Sakit' | 'Ijin' | 'Alpha' | 'Tugas Luar') => {
    playTapSound();
    setAsatidzList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );
  };

  // Set All Present for filtered class
  const handleSetAllHadirMurid = () => {
    playTapSound();
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setMuridList((prev) =>
      prev.map((m) => {
        if (selectedKelas === 'Semua' || m.kelas === selectedKelas) {
          return { ...m, status: 'Hadir', waktu: nowTime };
        }
        return m;
      })
    );
    showToast(`✅ Semua santri ${selectedKelas === 'Semua' ? 'keseluruhan' : selectedKelas} ditandai Hadir!`);
  };

  // Open Add Murid Modal
  const handleOpenAddMurid = () => {
    playTapSound();
    setMuridForm({
      nama: '',
      noInduk: `${Math.floor(100000 + Math.random() * 900000)}`,
      kelas: selectedKelas !== 'Semua' ? selectedKelas : 'Kelas 1',
      status: 'Hadir',
      waktu: '07:00 WIB',
      keterangan: '',
    });
    setIsAddMuridOpen(true);
  };

  // Submit Add Murid
  const handleSaveAddMurid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!muridForm.nama.trim()) {
      alert('Mohon isi nama lengkap santri.');
      return;
    }
    playTapSound();
    const newMurid: PresensiMuridItem = {
      id: `mrd_${Date.now()}`,
      noInduk: muridForm.noInduk.trim() || `${Date.now()}`.slice(-6),
      nama: muridForm.nama.trim(),
      kelas: muridForm.kelas,
      status: muridForm.status,
      waktu: muridForm.waktu || '07:00 WIB',
      keterangan: muridForm.keterangan.trim(),
    };
    setMuridList((prev) => [newMurid, ...prev]);
    setIsAddMuridOpen(false);
    showToast(`✅ Santri "${newMurid.nama}" berhasil ditambahkan ke daftar hadir!`);
  };

  // Open Edit Murid Modal
  const handleOpenEditMurid = (item: PresensiMuridItem) => {
    playTapSound();
    setEditingMurid(item);
    setMuridForm({
      nama: item.nama,
      noInduk: item.noInduk,
      kelas: item.kelas,
      status: item.status,
      waktu: item.waktu,
      keterangan: item.keterangan || '',
    });
  };

  // Submit Edit Murid
  const handleSaveEditMurid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMurid || !muridForm.nama.trim()) return;
    playTapSound();
    setMuridList((prev) =>
      prev.map((item) =>
        item.id === editingMurid.id
          ? {
              ...item,
              nama: muridForm.nama.trim(),
              noInduk: muridForm.noInduk.trim(),
              kelas: muridForm.kelas,
              status: muridForm.status,
              waktu: muridForm.waktu,
              keterangan: muridForm.keterangan.trim(),
            }
          : item
      )
    );
    setEditingMurid(null);
    showToast(`✅ Perubahan presensi santri "${muridForm.nama}" berhasil disimpan!`);
  };

  // Confirm Delete Murid
  const handleConfirmDeleteMurid = () => {
    if (!deletingMurid) return;
    playTapSound();
    const nama = deletingMurid.nama;
    setMuridList((prev) => prev.filter((item) => item.id !== deletingMurid.id));
    setDeletingMurid(null);
    showToast(`🗑️ Data presensi "${nama}" berhasil dihapus.`);
  };

  // Open Add Asatidz Modal
  const handleOpenAddAsatidz = () => {
    playTapSound();
    setAsatidzForm({
      nama: '',
      niy: `NIY.${Math.floor(1000 + Math.random() * 9000)}`,
      jabatan: 'Asatidz',
      tugas: 'Pengajar Mapel',
      status: 'Hadir',
      jamMasuk: '07:00',
      jamPulang: '14:30',
      keterangan: '',
    });
    setIsAddAsatidzOpen(true);
  };

  // Submit Add Asatidz
  const handleSaveAddAsatidz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asatidzForm.nama.trim()) {
      alert('Mohon isi nama lengkap asatidz/staf.');
      return;
    }
    playTapSound();
    const newAsatidz: PresensiAsatidzItem = {
      id: `ast_${Date.now()}`,
      niy: asatidzForm.niy.trim() || `NIY.${Date.now()}`.slice(-4),
      nama: asatidzForm.nama.trim(),
      jabatan: asatidzForm.jabatan,
      tugas: asatidzForm.tugas.trim() || 'Pendidik',
      status: asatidzForm.status,
      jamMasuk: asatidzForm.jamMasuk,
      jamPulang: asatidzForm.jamPulang,
      keterangan: asatidzForm.keterangan.trim(),
    };
    setAsatidzList((prev) => [newAsatidz, ...prev]);
    setIsAddAsatidzOpen(false);
    showToast(`✅ Asatidz "${newAsatidz.nama}" berhasil ditambahkan ke daftar hadir!`);
  };

  // Open Edit Asatidz Modal
  const handleOpenEditAsatidz = (item: PresensiAsatidzItem) => {
    playTapSound();
    setEditingAsatidz(item);
    setAsatidzForm({
      nama: item.nama,
      niy: item.niy,
      jabatan: item.jabatan,
      tugas: item.tugas,
      status: item.status,
      jamMasuk: item.jamMasuk,
      jamPulang: item.jamPulang,
      keterangan: item.keterangan || '',
    });
  };

  // Submit Edit Asatidz
  const handleSaveEditAsatidz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsatidz || !asatidzForm.nama.trim()) return;
    playTapSound();
    setAsatidzList((prev) =>
      prev.map((item) =>
        item.id === editingAsatidz.id
          ? {
              ...item,
              nama: asatidzForm.nama.trim(),
              niy: asatidzForm.niy.trim(),
              jabatan: asatidzForm.jabatan,
              tugas: asatidzForm.tugas.trim(),
              status: asatidzForm.status,
              jamMasuk: asatidzForm.jamMasuk,
              jamPulang: asatidzForm.jamPulang,
              keterangan: asatidzForm.keterangan.trim(),
            }
          : item
      )
    );
    setEditingAsatidz(null);
    showToast(`✅ Perubahan presensi asatidz "${asatidzForm.nama}" berhasil disimpan!`);
  };

  // Confirm Delete Asatidz
  const handleConfirmDeleteAsatidz = () => {
    if (!deletingAsatidz) return;
    playTapSound();
    const nama = deletingAsatidz.nama;
    setAsatidzList((prev) => prev.filter((item) => item.id !== deletingAsatidz.id));
    setDeletingAsatidz(null);
    showToast(`🗑️ Data presensi "${nama}" berhasil dihapus.`);
  };

  // Reset Data to Default Initial
  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan data presensi ke data bawaan madrasah? Perubahan kustom saat ini akan disetel ulang.')) {
      playTapSound();
      setMuridList(DAFTAR_HADIR_MURID);
      setAsatidzList(DAFTAR_HADIR_ASATIDZ);
      localStorage.removeItem(STORAGE_KEY_MURID);
      localStorage.removeItem(STORAGE_KEY_ASATIDZ);
      showToast('🔄 Data presensi berhasil direset ke data awal madrasah.');
    }
  };

  // Copy Rekap to Clipboard
  const handleCopyRekap = () => {
    playTapSound();
    const tglFormatted = formatIndonesianDate(selectedDateIso);
    let text = `📋 REKAP DAFTAR HADIR MADRASAH\nHari / Tanggal: ${tglFormatted}\n\n`;
    if (activeSubTab === 'murid') {
      text += `A. REKAP SANTRI KELAS 1-6 (Total: ${muridList.length})\n`;
      text += `- Hadir: ${totalHadirMurid} Santri\n- Sakit: ${totalSakitMurid} Santri\n- Ijin: ${totalIjinMurid} Santri\n- Alpha: ${totalAlphaMurid} Santri\n\n`;
      text += `Detail Kehadiran Santri (${selectedKelas}):\n`;
      filteredMurid.forEach((m, idx) => {
        text += `${idx + 1}. [${m.status.toUpperCase()}] ${m.nama} (${m.kelas}) - NIS: ${m.noInduk} - Jam: ${m.waktu} ${m.keterangan ? `[Ket: ${m.keterangan}]` : ''}\n`;
      });
    } else {
      text += `B. REKAP DEWAN ASATIDZ & TU (Total: ${asatidzList.length})\n`;
      text += `- Hadir: ${totalHadirAsatidz} Orang\n- Ijin/Tugas: ${totalIjinAsatidz} Orang\n\n`;
      text += `Detail Kehadiran Asatidz & TU:\n`;
      filteredAsatidz.forEach((a, idx) => {
        text += `${idx + 1}. [${a.status.toUpperCase()}] ${a.nama} (${a.jabatan}) - NIY: ${a.niy} - Jam: ${a.jamMasuk}-${a.jamPulang} ${a.keterangan ? `[Ket: ${a.keterangan}]` : ''}\n`;
      });
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Salinan rekap presensi berhasil disalin ke papan klip!');
    });
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto pb-16">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/40 text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-3">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
              MENU 1
            </span>
            <span className="text-emerald-100 text-xs font-semibold">Presensi & Kehadiran Terpadu</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">1. DAFTAR HADIR MADRASAH</h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Manajemen Data Kehadiran Santri (Kelas 1-6) dan Dewan Asatidz / Staf TU
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Simpan Absensi Hari Ini */}
          <button
            id="btn-simpan-absensi-header"
            onClick={handleManualSave}
            disabled={isManualSaving}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
            title="Klik untuk memastikan data absensi tersimpan"
          >
            <Save className="w-4 h-4 text-emerald-900" />
            <span>{isManualSaving ? 'Menyimpan...' : '💾 SIMPAN ABSENSI'}</span>
          </button>

          <button
            onClick={handleCopyRekap}
            title="Salin Rekap Teks untuk WhatsApp"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-white/20"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salin Rekap WA</span>
          </button>

          <button
            onClick={handleResetToDefault}
            title="Reset ke data awal madrasah"
            className="flex items-center gap-1 bg-white/15 hover:bg-rose-500/80 text-white p-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PANEL PILIHAN TANGGAL & STATUS PENYIMPANAN */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Pilihan Hari & Tanggal Absensi */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Pilihan Tanggal Absensi</span>
              <span className="text-sm sm:text-base font-black text-slate-800">
                {formatIndonesianDate(selectedDateIso)}
              </span>
            </div>
          </div>

          {/* Date Picker Input & Quick Navigator */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleQuickDate(-1)}
              title="Absensi Kemarin"
              className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-xl transition-all cursor-pointer"
            >
              ◀ Kemarin
            </button>
            <button
              type="button"
              onClick={() => handleDateChange(getTodayIso())}
              title="Kembali ke Hari Ini"
              className={`px-2.5 py-1 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer ${
                selectedDateIso === getTodayIso()
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              📅 Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(1)}
              title="Absensi Besok"
              className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-white hover:text-slate-900 rounded-xl transition-all cursor-pointer"
            >
              Besok ▶
            </button>
            
            {/* Native Date Picker */}
            <div className="relative border-l border-slate-200 pl-1.5">
              <input
                id="input-tanggal-absensi"
                type="date"
                value={selectedDateIso}
                onChange={(e) => {
                  if (e.target.value) handleDateChange(e.target.value);
                }}
                className="bg-white border border-slate-300 hover:border-emerald-500 rounded-xl px-2 py-1 text-xs font-bold text-slate-700 cursor-pointer focus:outline-emerald-500 shadow-2xs"
                title="Pilih tanggal dari kalender"
              />
            </div>
          </div>
        </div>

        {/* Status Penyimpanan & Tombol Simpan Cepat */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              {cloudSyncStatus === 'synced' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Firebase Cloud Terhubung</span>
                  </span>
                </>
              )}
              {cloudSyncStatus === 'saving' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5 text-amber-600" />
                    <span>Menyinkronkan ke Cloud...</span>
                  </span>
                </>
              )}
              {cloudSyncStatus === 'offline' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <span>Lokal & Offline Cache</span>
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {lastSavedTimestamp}
            </span>
          </div>

          <button
            onClick={handleManualSave}
            disabled={isManualSaving}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Petunjuk Interaktif Singkat (Penyimpanan, Tambah, Edit, Hapus) */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-900 flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-extrabold text-emerald-950">Panduan Operasi Daftar Hadir:</p>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            • <strong>Pilihan Tanggal</strong>: Ubah tanggal di panel kalender atas untuk melihat atau mencatat presensi hari lain.<br />
            • <strong>Tombol Simpan</strong>: Tombol <strong>💾 SIMPAN ABSENSI</strong> di atas berfungsi untuk menyimpan rekapan harian (setiap aksi juga <em>otomatis tersimpan</em> ke memori perangkat).<br />
            • <strong>Tambah Santri/Asatidz</strong>: Gunakan tombol <strong>+ Tambah Santri / Asatidz</strong> di kanan atas tabel.<br />
            • <strong>Ubah Status & Edit</strong>: Klik tombol status (<em>Hadir, Sakit, Ijin, Alpha</em>) atau ikon pensil ✏️ untuk mengubah detail.<br />
            • <strong>Hapus</strong>: Klik ikon tempat sampah 🗑️ pada baris yang ingin dihapus.
          </p>
        </div>
      </div>

      {/* Sub Tab Switcher: A. Murid vs B. Asatidz & TU */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveSubTab('murid');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'murid'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>A. Murid Kelas 1 - 6</span>
          <span className="bg-emerald-800 text-white text-[10px] px-2 py-0.2 rounded-full">
            {totalMuridCount}
          </span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveSubTab('asatidz');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'asatidz'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>B. Asatidz & TU Administrasi</span>
          <span className="bg-teal-800 text-white text-[10px] px-2 py-0.2 rounded-full">
            {asatidzList.length}
          </span>
        </button>
      </div>

      {/* SUB-SECTION A: MURID KELAS 1-6 */}
      {activeSubTab === 'murid' && (
        <div className="space-y-4">
          {/* Summary Stat Badges (Hadir, Sakit, Ijin, Alpha, Jumlah Total) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Hadir</span>
              <span className="text-xl font-black text-emerald-900">{totalHadirMurid}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Santri</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Sakit</span>
              <span className="text-xl font-black text-amber-900">{totalSakitMurid}</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Santri</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Ijin</span>
              <span className="text-xl font-black text-blue-900">{totalIjinMurid}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Santri</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Alpha</span>
              <span className="text-xl font-black text-rose-900">{totalAlphaMurid}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Santri</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-100 border border-slate-300 rounded-2xl p-3 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Jumlah Total</span>
              <span className="text-xl font-black text-slate-800">{totalMuridCount}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Rekap Santri</span>
            </div>
          </div>

          {/* Action & Filter Bar: Kelas 1-6 Selector, Search, Tambah Santri, Set Semua Hadir */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Kelas Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
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

              {/* Action Buttons: Tambah Santri & Set Semua Hadir */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <button
                  id="btn-set-semua-hadir-murid"
                  onClick={handleSetAllHadirMurid}
                  title="Tandai semua santri di filter ini sebagai Hadir"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Set Semua Hadir</span>
                </button>

                <button
                  id="btn-tambah-santri-presensi"
                  onClick={handleOpenAddMurid}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Santri</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-presensi-murid"
                type="text"
                placeholder="Cari Nama Santri atau No Induk (NIS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          {/* Table List of Murid Attendance */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Daftar Presensi Santri ({selectedKelas})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Menampilkan {filteredMurid.length} dari {muridList.length} santri
              </span>
            </div>

            {filteredMurid.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Tidak ada data santri ditemukan</p>
                <p className="text-[11px] text-slate-400 mt-1">Coba ubah kata kunci pencarian atau tambah santri baru.</p>
                <button
                  onClick={handleOpenAddMurid}
                  className="mt-3 inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Santri Sekarang
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMurid.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{item.nama}</h4>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.2 rounded-md">
                            {item.kelas}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono">No. Induk: {item.noInduk}</span>
                          <span>•</span>
                          <span>Waktu: {item.waktu}</span>
                          {item.keterangan && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 font-medium italic">Ket: {item.keterangan}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status & CRUD Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Status Toggle Buttons */}
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => handleUpdateStatusMurid(item.id, 'Hadir')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            item.status === 'Hadir'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-emerald-50'
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          onClick={() => handleUpdateStatusMurid(item.id, 'Sakit')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            item.status === 'Sakit'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-amber-50'
                          }`}
                        >
                          Sakit
                        </button>
                        <button
                          onClick={() => handleUpdateStatusMurid(item.id, 'Ijin')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            item.status === 'Ijin'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-blue-50'
                          }`}
                        >
                          Ijin
                        </button>
                        <button
                          onClick={() => handleUpdateStatusMurid(item.id, 'Alpha')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            item.status === 'Alpha'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-rose-50'
                          }`}
                        >
                          Alpha
                        </button>
                      </div>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          id={`btn-edit-murid-${item.id}`}
                          onClick={() => handleOpenEditMurid(item)}
                          title="Edit Data Santri"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-murid-${item.id}`}
                          onClick={() => setDeletingMurid(item)}
                          title="Hapus Dari Daftar Hadir"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION B: ASATIDZ & TU ADMINISTRASI */}
      {activeSubTab === 'asatidz' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-teal-700 uppercase block">Hadir Mengajar / Bertugas</span>
              <span className="text-xl font-black text-teal-900">{totalHadirAsatidz}</span>
              <span className="text-[10px] text-teal-600 block mt-0.5">Asatidz & Staf TU</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Ijin / Tugas Luar</span>
              <span className="text-xl font-black text-amber-900">{totalIjinAsatidz}</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Ustadz</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-100 border border-slate-300 rounded-2xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Pendidik & TU</span>
              <span className="text-xl font-black text-slate-800">{asatidzList.length}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Pegawai Aktif</span>
            </div>
          </div>

          {/* Action & Filter Bar for Asatidz */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-presensi-asatidz"
                type="text"
                placeholder="Cari Nama, NIY, Tugas / Jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-teal-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <button
              id="btn-tambah-asatidz-presensi"
              onClick={handleOpenAddAsatidz}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Asatidz / Staf TU</span>
            </button>
          </div>

          {/* List Asatidz & TU */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                Daftar Kehadiran Asatidz & TU Administrasi
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Menampilkan {filteredAsatidz.length} dari {asatidzList.length} asatidz
              </span>
            </div>

            {filteredAsatidz.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Tidak ada data asatidz ditemukan</p>
                <p className="text-[11px] text-slate-400 mt-1">Coba ubah kata kunci pencarian atau tambahkan asatidz baru.</p>
                <button
                  onClick={handleOpenAddAsatidz}
                  className="mt-3 inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Asatidz Sekarang
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAsatidz.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">{item.nama}</h4>
                          <span
                            className={`text-[10px] font-black px-2 py-0.2 rounded-md ${
                              item.jabatan === 'Kepala Madrasah'
                                ? 'bg-purple-100 text-purple-800'
                                : item.jabatan === 'TU Administrasi'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.jabatan}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="font-mono font-bold text-slate-700">NIY: {item.niy}</span>
                          <span>•</span>
                          <span>
                            Tugas: <strong className="text-slate-700">{item.tugas}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Jam: {item.jamMasuk} - {item.jamPulang}
                          </span>
                        </div>
                        {item.keterangan && (
                          <p className="text-[11px] text-amber-700 font-medium italic mt-0.5">
                            Ket: {item.keterangan}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status & CRUD Action Buttons for Asatidz */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatusAsatidz(item.id, e.target.value as any)}
                        className={`text-xs font-black px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                          item.status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.status === 'Ijin'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : item.status === 'Sakit'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : item.status === 'Tugas Luar'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Hadir">✅ Hadir</option>
                        <option value="Ijin">ℹ️ Ijin</option>
                        <option value="Sakit">🏥 Sakit</option>
                        <option value="Tugas Luar">🚗 Tugas Luar</option>
                        <option value="Alpha">❌ Alpha</option>
                      </select>

                      <button
                        id={`btn-edit-asatidz-${item.id}`}
                        onClick={() => handleOpenEditAsatidz(item)}
                        title="Edit Data Asatidz"
                        className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`btn-delete-asatidz-${item.id}`}
                        onClick={() => setDeletingAsatidz(item)}
                        title="Hapus Dari Daftar Hadir"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH SANTRI */}
      {/* ========================================================================= */}
      {isAddMuridOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-extrabold text-sm sm:text-base">Tambah Presensi Santri Baru</h3>
              </div>
              <button
                onClick={() => setIsAddMuridOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddMurid} className="p-4 sm:p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Ihsan Fadilah"
                  value={muridForm.nama}
                  onChange={(e) => setMuridForm({ ...muridForm, nama: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. Induk / NIS</label>
                  <input
                    type="text"
                    placeholder="Contoh: 2026101"
                    value={muridForm.noInduk}
                    onChange={(e) => setMuridForm({ ...muridForm, noInduk: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kelas *</label>
                  <select
                    value={muridForm.kelas}
                    onChange={(e) => setMuridForm({ ...muridForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-bold bg-white"
                  >
                    {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehadiran *</label>
                  <select
                    value={muridForm.status}
                    onChange={(e) => setMuridForm({ ...muridForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-bold bg-white"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Ijin">Ijin</option>
                    <option value="Alpha">Alpha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Masuk</label>
                  <input
                    type="text"
                    placeholder="07:00 WIB"
                    value={muridForm.waktu}
                    onChange={(e) => setMuridForm({ ...muridForm, waktu: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Keterangan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Surat dokter / Dispensasi lomba"
                  value={muridForm.keterangan}
                  onChange={(e) => setMuridForm({ ...muridForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMuridOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Santri</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT SANTRI */}
      {/* ========================================================================= */}
      {editingMurid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-extrabold text-sm sm:text-base">Edit Presensi Santri</h3>
              </div>
              <button
                onClick={() => setEditingMurid(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMurid} className="p-4 sm:p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Santri *</label>
                <input
                  type="text"
                  required
                  value={muridForm.nama}
                  onChange={(e) => setMuridForm({ ...muridForm, nama: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. Induk / NIS</label>
                  <input
                    type="text"
                    value={muridForm.noInduk}
                    onChange={(e) => setMuridForm({ ...muridForm, noInduk: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kelas *</label>
                  <select
                    value={muridForm.kelas}
                    onChange={(e) => setMuridForm({ ...muridForm, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-bold bg-white"
                  >
                    {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehadiran *</label>
                  <select
                    value={muridForm.status}
                    onChange={(e) => setMuridForm({ ...muridForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-bold bg-white"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Ijin">Ijin</option>
                    <option value="Alpha">Alpha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Masuk</label>
                  <input
                    type="text"
                    value={muridForm.waktu}
                    onChange={(e) => setMuridForm({ ...muridForm, waktu: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Keterangan</label>
                <input
                  type="text"
                  placeholder="Keterangan tambahan..."
                  value={muridForm.keterangan}
                  onChange={(e) => setMuridForm({ ...muridForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMurid(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: HAPUS SANTRI KONFIRMASI */}
      {/* ========================================================================= */}
      {deletingMurid && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 p-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Hapus Data Presensi Santri?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Data presensi atas nama <strong>{deletingMurid.nama}</strong> ({deletingMurid.kelas}) akan dihapus dari rekapan.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setDeletingMurid(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteMurid}
                className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TAMBAH ASATIDZ / STAF */}
      {/* ========================================================================= */}
      {isAddAsatidzOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-teal-700 to-cyan-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <h3 className="font-extrabold text-sm sm:text-base">Tambah Presensi Asatidz / Staf</h3>
              </div>
              <button
                onClick={() => setIsAddAsatidzOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddAsatidz} className="p-4 sm:p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ust. Ahmad Fauzi, S.Pd.I"
                  value={asatidzForm.nama}
                  onChange={(e) => setAsatidzForm({ ...asatidzForm, nama: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIY / NIP</label>
                  <input
                    type="text"
                    placeholder="Contoh: NIY.1023"
                    value={asatidzForm.niy}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, niy: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan *</label>
                  <select
                    value={asatidzForm.jabatan}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-bold bg-white"
                  >
                    <option value="Asatidz">Asatidz</option>
                    <option value="Kepala Madrasah">Kepala Madrasah</option>
                    <option value="TU Administrasi">TU Administrasi</option>
                    <option value="Pembina Asrama">Pembina Asrama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tugas / Mata Pelajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengajar Fathul Qorib / TU Keuangan"
                  value={asatidzForm.tugas}
                  onChange={(e) => setAsatidzForm({ ...asatidzForm, tugas: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={asatidzForm.status}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, status: e.target.value as any })}
                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-bold bg-white"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Ijin">Ijin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Tugas Luar">Tugas Luar</option>
                    <option value="Alpha">Alpha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Masuk</label>
                  <input
                    type="text"
                    value={asatidzForm.jamMasuk}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, jamMasuk: e.target.value })}
                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Pulang</label>
                  <input
                    type="text"
                    value={asatidzForm.jamPulang}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, jamPulang: e.target.value })}
                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  placeholder="Catatan / tugas khusus..."
                  value={asatidzForm.keterangan}
                  onChange={(e) => setAsatidzForm({ ...asatidzForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddAsatidzOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data Asatidz</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EDIT ASATIDZ / STAF */}
      {/* ========================================================================= */}
      {editingAsatidz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-teal-700 to-cyan-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                <h3 className="font-extrabold text-sm sm:text-base">Edit Presensi Asatidz</h3>
              </div>
              <button
                onClick={() => setEditingAsatidz(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAsatidz} className="p-4 sm:p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={asatidzForm.nama}
                  onChange={(e) => setAsatidzForm({ ...asatidzForm, nama: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIY / NIP</label>
                  <input
                    type="text"
                    value={asatidzForm.niy}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, niy: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan *</label>
                  <select
                    value={asatidzForm.jabatan}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-bold bg-white"
                  >
                    <option value="Asatidz">Asatidz</option>
                    <option value="Kepala Madrasah">Kepala Madrasah</option>
                    <option value="TU Administrasi">TU Administrasi</option>
                    <option value="Pembina Asrama">Pembina Asrama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tugas / Mata Pelajaran</label>
                <input
                  type="text"
                  value={asatidzForm.tugas}
                  onChange={(e) => setAsatidzForm({ ...asatidzForm, tugas: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={asatidzForm.status}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, status: e.target.value as any })}
                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-bold bg-white"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Ijin">Ijin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Tugas Luar">Tugas Luar</option>
                    <option value="Alpha">Alpha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Masuk</label>
                  <input
                    type="text"
                    value={asatidzForm.jamMasuk}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, jamMasuk: e.target.value })}
                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Pulang</label>
                  <input
                    type="text"
                    value={asatidzForm.jamPulang}
                    onChange={(e) => setAsatidzForm({ ...asatidzForm, jamPulang: e.target.value })}
                    className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  placeholder="Catatan / tugas khusus..."
                  value={asatidzForm.keterangan}
                  onChange={(e) => setAsatidzForm({ ...asatidzForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-teal-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAsatidz(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: HAPUS ASATIDZ KONFIRMASI */}
      {/* ========================================================================= */}
      {deletingAsatidz && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3.5">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 p-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Hapus Data Presensi Asatidz?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Data presensi atas nama <strong>{deletingAsatidz.nama}</strong> ({deletingAsatidz.jabatan}) akan dihapus.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setDeletingAsatidz(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteAsatidz}
                className="px-4 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

