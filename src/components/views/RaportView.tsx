import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Award, 
  TrendingUp, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Printer, 
  Share2, 
  User, 
  Calendar,
  Sparkles,
  ChevronDown,
  Edit2,
  Save,
  X,
  Plus,
  Check,
  Search,
  Users,
  Layers,
  CloudCheck,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { BIODATA_MURID_LIST } from '../../data/madrasahCompleteData';
import { 
  INITIAL_RAPORT_COLLECTION, 
  generateDefaultRaport, 
  angkaKeHuruf, 
  hitungPredikat,
  getKeteranganCapaian 
} from '../../data/raportData';
import { RaportSantri, RaportNilaiItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';
import { 
  saveRaportToFirestore, 
  subscribeRaportFromFirestore 
} from '../../services/firestoreService';
import { CetakRaportModal } from '../raport/CetakRaportModal';

const STORAGE_KEY_RAPORT_MAP = 'madrasah_raport_all_v3';

interface RaportViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const RaportView: React.FC<RaportViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('5_raport', activeRole, explicitCanEdit);
  
  // View states
  const [viewMode, setViewMode] = useState<'individual' | 'leger'>('individual');
  const [selectedClass, setSelectedClass] = useState<string>('Semua Kelas');
  const [selectedCawu, setSelectedCawu] = useState<'Cawu 1' | 'Cawu 2' | 'Cawu 3'>('Cawu 1');
  const [selectedSantriId, setSelectedSantriId] = useState<string>('mrd-4');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data store: Map of id -> RaportSantri
  const [raportMap, setRaportMap] = useState<Record<string, RaportSantri>>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_RAPORT_MAP);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {}
    
    // Default initial map
    const initialMap: Record<string, RaportSantri> = {};
    INITIAL_RAPORT_COLLECTION.forEach((r) => {
      initialMap[r.id] = r;
    });
    return initialMap;
  });

  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<RaportSantri | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. Subscribe to Cloud Firestore
  useEffect(() => {
    const unsub = subscribeRaportFromFirestore((cloudItems) => {
      if (cloudItems && cloudItems.length > 0) {
        setRaportMap((prev) => {
          const updated = { ...prev };
          cloudItems.forEach((item) => {
            if (item.id) {
              updated[item.id] = item;
            }
          });
          try {
            localStorage.setItem(STORAGE_KEY_RAPORT_MAP, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setIsCloudSynced(true);
      }
    });

    return () => unsub();
  }, []);

  // Get active student's current cawu report
  const currentRaportKey = `rap_${selectedSantriId}_${selectedCawu.replace(/\s+/g, '').toLowerCase()}`;
  const currentRaport: RaportSantri = useMemo(() => {
    if (raportMap[currentRaportKey]) {
      return raportMap[currentRaportKey];
    }
    // Generate fallback
    return generateDefaultRaport(selectedSantriId, selectedCawu);
  }, [raportMap, currentRaportKey, selectedSantriId, selectedCawu]);

  // Current active student profile
  const currentSantri = useMemo(() => {
    return BIODATA_MURID_LIST.find((m) => m.id === selectedSantriId) || BIODATA_MURID_LIST[3];
  }, [selectedSantriId]);

  // Filtered students for selector / leger
  const filteredStudents = useMemo(() => {
    return BIODATA_MURID_LIST.filter((s) => {
      const matchClass = selectedClass === 'Semua Kelas' || s.kelas === selectedClass;
      const matchSearch = searchQuery === '' || 
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.noInduk.includes(searchQuery) ||
        s.kelas.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [selectedClass, searchQuery]);

  // Handle opening edit modal
  const handleOpenEdit = (raportToEdit?: RaportSantri) => {
    playTapSound();
    const target = raportToEdit || currentRaport;
    setEditForm(JSON.parse(JSON.stringify(target)));
    setIsEditOpen(true);
  };

  // Grade score calculation in edit modal
  const handleGradeComponentChange = (
    index: number,
    field: 'nilaiTugas' | 'nilaiUjian' | 'kkm',
    val: number
  ) => {
    if (!editForm) return;
    const updated = [...editForm.nilaiList];
    const item = { ...updated[index] };

    if (field === 'nilaiTugas') item.nilaiTugas = val;
    if (field === 'nilaiUjian') item.nilaiUjian = val;
    if (field === 'kkm') item.kkm = val;

    // Recalculate Final Score: 40% Tugas + 60% Ujian
    const nt = item.nilaiTugas ?? item.nilaiAngka;
    const nu = item.nilaiUjian ?? item.nilaiAngka;
    const finalScore = Math.round(nt * 0.4 + nu * 0.6);

    item.nilaiAngka = finalScore;
    item.nilaiHuruf = angkaKeHuruf(finalScore);
    item.predikat = hitungPredikat(finalScore);
    item.keterangan = getKeteranganCapaian(item.namaMapel, finalScore);

    updated[index] = item;

    // Recalculate total & average
    const total = updated.reduce((sum, n) => sum + (n.nilaiAngka || 0), 0);
    const avg = Number((total / updated.length).toFixed(2));

    setEditForm({
      ...editForm,
      nilaiList: updated,
      totalNilai: total,
      rataRata: avg,
    });
  };

  // Save changes to Firestore and LocalStorage
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    playTapSound();
    setIsSaving(true);

    try {
      const updatedItem: RaportSantri = {
        ...editForm,
        updatedAt: new Date().toISOString(),
      };

      // 1. Update local state
      setRaportMap((prev) => {
        const next = { ...prev, [updatedItem.id]: updatedItem };
        try {
          localStorage.setItem(STORAGE_KEY_RAPORT_MAP, JSON.stringify(next));
        } catch {}
        return next;
      });

      // 2. Persist to Firestore
      await saveRaportToFirestore(updatedItem);

      setIsEditOpen(false);
      showToast(`Raport ${updatedItem.nama} (${updatedItem.cawu}) berhasil disimpan ke Cloud!`);
    } catch (err) {
      showToast('Gagal menyimpan ke cloud, tersimpan di perangkat lokal.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick share to WhatsApp
  const handleShareWA = () => {
    playTapSound();
    const text = `*E-RAPORT SANTRI MADRASAH WATHONIYAH KENDAL*
👤 *Nama:* ${currentRaport.nama}
🏫 *Kelas:* ${currentRaport.kelas} • ${currentRaport.cawu}
📊 *Rata-Rata:* ${currentRaport.rataRata} (Peringkat Ke-${currentRaport.peringkat} dari ${currentRaport.totalSiswa || 32} santri)
📖 *Capaian 11 Mapel Diniyah:*
${currentRaport.nilaiList.map((n, i) => `${i + 1}. ${n.namaMapel}: *${n.nilaiAngka}* (${n.predikat})`).join('\n')}
⭐ *Tahfidz:* ${currentRaport.hafalanJuz || '-'}
📝 *Catatan Wali Kelas:* "${currentRaport.catatanGuru}"`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2.5 border border-emerald-500/60 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-4 sm:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
              MENU 5
            </span>
            <span className="text-teal-100 text-xs font-semibold">
              Laporan Hasil Belajar Kurikulum Diniyah KTSP+
            </span>
            <div className="flex items-center gap-1 bg-emerald-700/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isCloudSynced ? 'Firestore Cloud Active' : 'Online Sync'}</span>
            </div>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
            5. E-RAPORT HASIL BELAJAR SANTRI
          </h1>
          <p className="text-xs text-teal-100/90 max-w-2xl">
            Evaluasi 11 Mata Pelajaran Kitab Kuning, Rekapitulasi Presensi, Capaian Tahfidz, Nilai Terbilang, dan Cetak Format Resmi Kemenag/LP Ma'arif NU.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              onClick={() => handleOpenEdit()}
              className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Nilai Raport</span>
            </button>
          )}

          <button
            onClick={() => {
              playTapSound();
              setIsPrintModalOpen(true);
            }}
            className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl border border-white/30 text-xs font-black flex items-center gap-2 backdrop-blur-xs transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak Raport Resmi</span>
          </button>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => {
                playTapSound();
                setViewMode('individual');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'individual'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Buku Raport Santri</span>
            </button>
            <button
              onClick={() => {
                playTapSound();
                setViewMode('leger');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'leger'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Rekap Nilai Kelas (Leger)</span>
            </button>
          </div>

          {/* Cawu Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-500 px-2 hidden sm:inline">Periode:</span>
            {(['Cawu 1', 'Cawu 2', 'Cawu 3'] as const).map((cw) => (
              <button
                key={cw}
                onClick={() => {
                  playTapSound();
                  setSelectedCawu(cw);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  selectedCawu === cw
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cw}
              </button>
            ))}
          </div>

        </div>

        {/* Second Row: Filters & Student Search */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-slate-100">
          
          {/* Class Filter */}
          <div className="sm:col-span-4">
            <select
              value={selectedClass}
              onChange={(e) => {
                playTapSound();
                setSelectedClass(e.target.value);
              }}
              className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500"
            >
              <option value="Semua Kelas">Semua Tingkat Kelas</option>
              <option value="Kelas 1">Kelas 1 Ula</option>
              <option value="Kelas 2">Kelas 2 Ula</option>
              <option value="Kelas 3">Kelas 3 Ula</option>
              <option value="Kelas 4">Kelas 4 Wustha</option>
              <option value="Kelas 5">Kelas 5 Wustha</option>
              <option value="Kelas 6">Kelas 6 Ulya</option>
            </select>
          </div>

          {/* Student Selector (for Individual mode) */}
          {viewMode === 'individual' && (
            <div className="sm:col-span-5">
              <select
                value={selectedSantriId}
                onChange={(e) => {
                  playTapSound();
                  setSelectedSantriId(e.target.value);
                }}
                className="w-full text-xs font-extrabold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-emerald-500"
              >
                {filteredStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama} ({s.kelas} • NIS: {s.noInduk})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Search bar */}
          <div className={viewMode === 'individual' ? 'sm:col-span-3' : 'sm:col-span-8'}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari santri / NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-emerald-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ===================== VIEW MODE 1: INDIVIDUAL RAPORT ===================== */}
      {viewMode === 'individual' && (
        <div className="space-y-4">
          
          {/* Identity & Stats Overview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Identitas Santri</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">{currentRaport.nama}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>NIS: {currentRaport.noInduk}</span>
                  <span>•</span>
                  <span>NISN: {currentRaport.nisn || '-'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat & Periode</span>
                <h3 className="font-extrabold text-sm sm:text-base text-emerald-800">
                  {currentRaport.kelas} • {currentRaport.cawu}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Tahun Ajaran: {currentRaport.tahunAjaran}</p>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 text-center flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Rata-Rata Nilai</span>
                  <span className="text-2xl font-black text-emerald-950 font-mono">{currentRaport.rataRata}</span>
                  <span className="text-[10px] font-bold text-emerald-700 block">Total: {currentRaport.totalNilai}</span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-center flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase block">Peringkat Kelas</span>
                  <span className="text-2xl font-black text-amber-950 font-mono">
                    Ke-{currentRaport.peringkat}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 block">
                    dari {currentRaport.totalSiswa || 32} Santri
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <Award className="w-6 h-6" />
                </div>
              </div>

            </div>
          </div>

          {/* 11 Mata Pelajaran Diniyah Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                  Daftar Nilai 11 Mata Pelajaran Kurikulum Diniyah Salafiyah KTSP+
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  11 Mapel Lengkap
                </span>
                <button
                  onClick={handleShareWA}
                  className="p-1.5 hover:bg-slate-200 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Bagikan ringkasan via WA"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kirim WA</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/75 text-slate-600 font-extrabold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">No</th>
                    <th className="py-3 px-3.5">Mata Pelajaran (Kitab Rujukan)</th>
                    <th className="py-3 px-2 text-center w-14">KKM</th>
                    <th className="py-3 px-2 text-center w-16">Tugas</th>
                    <th className="py-3 px-2 text-center w-16">Ujian</th>
                    <th className="py-3 px-2 text-center w-20">Nilai Akhir</th>
                    <th className="py-3 px-3 text-center w-36 hidden sm:table-cell">Terbilang (Huruf)</th>
                    <th className="py-3 px-3 text-center w-28">Predikat</th>
                    <th className="py-3 px-3.5 hidden md:table-cell">Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRaport.nilaiList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="font-extrabold text-slate-800 block">{item.namaMapel}</span>
                        {item.kitab && (
                          <span className="text-[10px] text-slate-500 italic block">{item.kitab}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold text-slate-500">{item.kkm}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-600">{item.nilaiTugas ?? item.nilaiAngka}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-slate-600">{item.nilaiUjian ?? item.nilaiAngka}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg ${
                          item.nilaiAngka >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.nilaiAngka >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.nilaiAngka}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-600 hidden sm:table-cell italic text-[11px]">
                        {item.nilaiHuruf}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-bold text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {item.predikat}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 text-[11px] hidden md:table-cell">
                        {item.keterangan}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Adab, Tahfidz, Presensi & Catatan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Adab & Tahfidz */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                Adab & Capaian Tahfidz
              </h4>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                <div>
                  <span className="font-bold text-slate-500 block text-[11px]">Sikap & Kedisiplinan:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{currentRaport.sikapDanAkhlak || 'Sangat Baik (A)'}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-500 block text-[11px]">Hafalan Al-Qur'an & Wirid:</span>
                  <p className="font-black text-emerald-800 mt-0.5">{currentRaport.hafalanJuz || '-'}</p>
                </div>
              </div>
            </div>

            {/* Presensi Kehadiran */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                Kehadiran Santri ({currentRaport.cawu})
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Sakit</span>
                  <span className="text-lg font-mono font-black text-emerald-950">
                    {currentRaport.kehadiran?.sakit ?? 0}
                  </span>
                  <span className="text-[9px] text-emerald-700 block">Hari</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-800 uppercase block">Izin</span>
                  <span className="text-lg font-mono font-black text-blue-950">
                    {currentRaport.kehadiran?.izin ?? (currentRaport.kehadiran?.ijin ?? 0)}
                  </span>
                  <span className="text-[9px] text-blue-700 block">Hari</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Alpa</span>
                  <span className="text-lg font-mono font-black text-slate-800">
                    {currentRaport.kehadiran?.alpa ?? (currentRaport.kehadiran?.alpha ?? 0)}
                  </span>
                  <span className="text-[9px] text-slate-400 block">Hari</span>
                </div>
              </div>

              {currentRaport.keputusan && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                  <strong>Keputusan:</strong> {currentRaport.keputusan}
                </div>
              )}
            </div>

            {/* Catatan Guru / Wali Kelas */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Catatan Wali Kelas & Pengasuh
                </h4>
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-xs text-emerald-950 italic leading-relaxed">
                  "{currentRaport.catatanGuru}"
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Wali: <strong>{currentRaport.namaWaliKelas || 'Ust. Ahmad Mufid, M.Pd.I.'}</strong></span>
                <span>{currentRaport.tanggalRaport || '28 Nov 2025'}</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ===================== VIEW MODE 2: REKAP NILAI KELAS (LEGER) ===================== */}
      {viewMode === 'leger' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-xs sm:text-sm text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                Leger Rekapitulasi Nilai & Peringkat Santri ({selectedCawu})
              </h3>
              <p className="text-[11px] text-slate-500">
                Tingkat: {selectedClass} • Menampilkan {filteredStudents.length} santri
              </p>
            </div>
            <button
              onClick={() => {
                playTapSound();
                window.print();
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cetak Leger Kelas</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-extrabold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">Rank</th>
                  <th className="py-3 px-3.5">Nama Santri</th>
                  <th className="py-3 px-3 text-center w-24">Kelas</th>
                  <th className="py-3 px-3 text-center w-24">Rata-Rata</th>
                  <th className="py-3 px-3 text-center w-24">Total Nilai</th>
                  <th className="py-3 px-3 text-center w-24">Kehadiran</th>
                  <th className="py-3 px-3.5">Catatan Evaluasi</th>
                  <th className="py-3 px-3 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const rKey = `rap_${student.id}_${selectedCawu.replace(/\s+/g, '').toLowerCase()}`;
                  const rData = raportMap[rKey] || generateDefaultRaport(student.id, selectedCawu);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs mx-auto ${
                          rData.peringkat <= 3 
                            ? 'bg-amber-400 text-slate-950 shadow-2xs'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rData.peringkat}
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="font-extrabold text-slate-900">{student.nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">NIS: {student.noInduk}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-800">{student.kelas}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-black text-sm text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {rData.rataRata}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-600">
                        {rData.totalNilai}
                      </td>
                      <td className="py-3 px-3 text-center text-[10px] text-slate-500 font-mono">
                        S:{rData.kehadiran?.sakit ?? 0} I:{rData.kehadiran?.izin ?? 0} A:{rData.kehadiran?.alpa ?? 0}
                      </td>
                      <td className="py-3 px-3.5 text-[11px] text-slate-600 max-w-xs truncate">
                        {rData.catatanGuru}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              playTapSound();
                              setSelectedSantriId(student.id);
                              setViewMode('individual');
                            }}
                            className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-colors cursor-pointer"
                            title="Buka Raport Santri"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => {
                                handleOpenEdit(rData);
                              }}
                              className="p-1.5 hover:bg-amber-50 text-amber-700 rounded-lg transition-colors cursor-pointer"
                              title="Edit Nilai Raport"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================== MODAL EDIT RAPORT ===================== */}
      {isEditOpen && editForm && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-4 sm:p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl space-y-4 border border-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-emerald-600" />
                  Edit Nilai Raport - {editForm.nama}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {editForm.kelas} • {editForm.cawu} • Tahun Ajaran {editForm.tahunAjaran}
                </p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              
              {/* Summary Stats Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Peringkat Kelas:
                  </label>
                  <input
                    type="number"
                    value={editForm.peringkat}
                    onChange={(e) => setEditForm({ ...editForm, peringkat: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Total Santri Kelas:
                  </label>
                  <input
                    type="number"
                    value={editForm.totalSiswa || 32}
                    onChange={(e) => setEditForm({ ...editForm, totalSiswa: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Total Nilai:
                  </label>
                  <div className="px-2.5 py-1.5 text-xs font-mono font-black bg-slate-200 text-slate-800 rounded-xl">
                    {editForm.totalNilai}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Rata-Rata Otomatis:
                  </label>
                  <div className="px-2.5 py-1.5 text-xs font-mono font-black bg-emerald-100 text-emerald-950 rounded-xl">
                    {editForm.rataRata}
                  </div>
                </div>
              </div>

              {/* 11 Grades Inputs (Tugas 40% + Ujian 60%) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    Nilai 11 Mata Pelajaran (Bobot: Tugas 40% + Ujian 60% = Nilai Akhir):
                  </span>
                  <span className="text-[10px] text-slate-500">Auto Hitung Terbilang & Predikat</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {editForm.nilaiList.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-slate-800 block truncate">
                          {idx + 1}. {item.namaMapel}
                        </span>
                        <span className="text-[10px] text-slate-500 italic block truncate">
                          {item.kitab || 'Kitab Diniyah'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400">KKM:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.kkm}
                            onChange={(e) => handleGradeComponentChange(idx, 'kkm', Number(e.target.value))}
                            className="w-12 px-1.5 py-1 text-center font-mono font-semibold bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400">Tugas:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.nilaiTugas ?? item.nilaiAngka}
                            onChange={(e) => handleGradeComponentChange(idx, 'nilaiTugas', Number(e.target.value))}
                            className="w-14 px-1.5 py-1 text-center font-mono font-semibold bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400">Ujian:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.nilaiUjian ?? item.nilaiAngka}
                            onChange={(e) => handleGradeComponentChange(idx, 'nilaiUjian', Number(e.target.value))}
                            className="w-14 px-1.5 py-1 text-center font-mono font-semibold bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-emerald-700">Akhir:</span>
                          <span className="w-12 py-1 text-center font-mono font-black bg-emerald-100 text-emerald-950 rounded-lg text-xs">
                            {item.nilaiAngka}
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          {item.predikat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Presensi, Tahfidz & Catatan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                
                {/* Presensi Inputs */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">Rekap Kehadiran (Hari):</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block uppercase">Sakit</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.kehadiran?.sakit ?? 0}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          kehadiran: { ...editForm.kehadiran, sakit: Number(e.target.value) } as any
                        })}
                        className="w-full p-1 text-center font-mono text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block uppercase">Izin</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.kehadiran?.izin ?? (editForm.kehadiran?.ijin ?? 0)}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          kehadiran: { ...editForm.kehadiran, izin: Number(e.target.value), ijin: Number(e.target.value) } as any
                        })}
                        className="w-full p-1 text-center font-mono text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block uppercase">Alpa</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.kehadiran?.alpa ?? (editForm.kehadiran?.alpha ?? 0)}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          kehadiran: { ...editForm.kehadiran, alpa: Number(e.target.value), alpha: Number(e.target.value) } as any
                        })}
                        className="w-full p-1 text-center font-mono text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Tahfidz & Sikap */}
                <div className="sm:col-span-2 space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Capaian Hafalan Al-Qur'an / Doa:
                    </label>
                    <input
                      type="text"
                      value={editForm.hafalanJuz || ''}
                      onChange={(e) => setEditForm({ ...editForm, hafalanJuz: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Sikap, Akhlak & Kedisiplinan:
                    </label>
                    <input
                      type="text"
                      value={editForm.sikapDanAkhlak || ''}
                      onChange={(e) => setEditForm({ ...editForm, sikapDanAkhlak: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                    />
                  </div>
                </div>

              </div>

              {/* Catatan Wali Kelas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Wali Kelas & Pengasuh:
                </label>
                <textarea
                  rows={2}
                  value={editForm.catatanGuru}
                  onChange={(e) => setEditForm({ ...editForm, catatanGuru: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Menyimpan ke Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Raport</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ===================== CETAK RAPORT MODAL ===================== */}
      {isPrintModalOpen && (
        <CetakRaportModal
          raport={currentRaport}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

    </div>
  );
};
