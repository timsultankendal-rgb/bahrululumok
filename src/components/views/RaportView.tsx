import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Edit2,
  Save,
  X,
  Plus,
  Check
} from 'lucide-react';
import { RAPORT_SANTRI_SAMPLE, BIODATA_MURID_LIST } from '../../data/madrasahCompleteData';
import { RaportSantriData, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_RAPORT = 'madrasah_raport_data_v2';

interface RaportViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const RaportView: React.FC<RaportViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('5_raport', activeRole, explicitCanEdit);
  const [selectedSantriId, setSelectedSantriId] = useState<string>('mrd-4');
  const [selectedCawu, setSelectedCawu] = useState<string>('Cawu 1');
  
  const [raportData, setRaportData] = useState<RaportSantriData>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_RAPORT}_${selectedSantriId}_${selectedCawu}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return RAPORT_SANTRI_SAMPLE;
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<RaportSantriData>(raportData);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reload data when student or cawu changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_RAPORT}_${selectedSantriId}_${selectedCawu}`);
      if (saved) {
        setRaportData(JSON.parse(saved));
        return;
      }
    } catch {}
    setRaportData(RAPORT_SANTRI_SAMPLE);
  }, [selectedSantriId, selectedCawu]);

  // Santri lookup
  const currentSantri = BIODATA_MURID_LIST.find((m) => m.id === selectedSantriId) || BIODATA_MURID_LIST[3];

  const handleOpenEdit = () => {
    playTapSound();
    setEditForm(JSON.parse(JSON.stringify(raportData)));
    setIsEditOpen(true);
  };

  const handleGradeChange = (index: number, newScore: number) => {
    const updatedNilai = [...editForm.nilaiList];
    const item = { ...updatedNilai[index] };
    item.nilaiAngka = newScore;
    
    // Auto predikat
    if (newScore >= 90) item.predikat = 'A (Mumtaz)';
    else if (newScore >= 80) item.predikat = 'B (Jayyid Jiddan)';
    else if (newScore >= 70) item.predikat = 'C (Jayyid)';
    else item.predikat = 'D (Maqbul)';
    
    updatedNilai[index] = item;
    
    // Calculate new average
    const total = updatedNilai.reduce((sum, n) => sum + (n.nilaiAngka || 0), 0);
    const avg = Number((total / updatedNilai.length).toFixed(1));

    setEditForm({
      ...editForm,
      nilaiList: updatedNilai,
      rataRata: avg
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setRaportData(editForm);
    try {
      localStorage.setItem(`${STORAGE_KEY_RAPORT}_${selectedSantriId}_${selectedCawu}`, JSON.stringify(editForm));
    } catch {}
    setIsEditOpen(false);
    showToast('Data nilai raport santri berhasil disimpan!');
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

        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              onClick={handleOpenEdit}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Nilai Raport</span>
            </button>
          )}

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

        {/* Responsive Cawu Buttons */}
        <div className="grid grid-cols-3 sm:flex gap-1.5 w-full sm:w-auto">
          {['Cawu 1', 'Cawu 2', 'Cawu 3'].map((cw) => (
            <button
              key={cw}
              onClick={() => {
                playTapSound();
                setSelectedCawu(cw);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs text-center transition-all cursor-pointer ${
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

      {/* Modal Edit Raport */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-emerald-600" />
                  Edit Nilai Raport - {currentSantri.nama}
                </h3>
                <p className="text-xs text-slate-500">{currentSantri.kelas} • {selectedCawu}</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Summary Stats Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
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
                    value={editForm.totalSiswa}
                    onChange={(e) => setEditForm({ ...editForm, totalSiswa: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Rata-Rata Otomatis:
                  </label>
                  <div className="px-2.5 py-1.5 text-xs font-mono font-black bg-emerald-100 text-emerald-900 rounded-xl">
                    {editForm.rataRata}
                  </div>
                </div>
              </div>

              {/* 11 Grades Inputs */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-slate-800 block">
                  Nilai 11 Mata Pelajaran:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {editForm.nilaiList.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 truncate flex-1">{item.namaMapel}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.nilaiAngka}
                        onChange={(e) => handleGradeChange(idx, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Tahfidz & Catatan Guru */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Capaian Hafalan Al-Qur'an:
                  </label>
                  <input
                    type="text"
                    value={editForm.hafalanJuz}
                    onChange={(e) => setEditForm({ ...editForm, hafalanJuz: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                  />
                </div>

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
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Raport</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
