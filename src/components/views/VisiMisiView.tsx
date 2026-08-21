import React, { useState } from 'react';
import { 
  Target, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Award, 
  Heart, 
  ShieldCheck,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { VISI_MISI_DATA } from '../../data/madrasahCompleteData';
import { UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_VISIMISI = 'madrasah_visimisi_data_v2';

interface VisiMisiViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const VisiMisiView: React.FC<VisiMisiViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('9_visi_misi', activeRole, explicitCanEdit);
  const [data, setData] = useState<{ visi: string; misi: string[]; tujuan: string[] }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VISIMISI);
      if (saved) return JSON.parse(saved);
    } catch {}
    return VISI_MISI_DATA;
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tempVisi, setTempVisi] = useState(data.visi);
  const [tempMisi, setTempMisi] = useState<string[]>([...data.misi]);
  const [tempTujuan, setTempTujuan] = useState<string[]>([...data.tujuan]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenEdit = () => {
    playTapSound();
    setTempVisi(data.visi);
    setTempMisi([...data.misi]);
    setTempTujuan([...data.tujuan]);
    setIsEditOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    const updated = {
      visi: tempVisi,
      misi: tempMisi.filter((m) => m.trim().length > 0),
      tujuan: tempTujuan.filter((t) => t.trim().length > 0),
    };
    setData(updated);
    try {
      localStorage.setItem(STORAGE_KEY_VISIMISI, JSON.stringify(updated));
    } catch {}
    setIsEditOpen(false);
    showToast('Visi, Misi & Tujuan Madrasah berhasil disimpan!');
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 9
            </span>
            <span className="text-emerald-100 text-xs font-semibold">Landasan & Orientasi Pendidikan</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white">
            9. VISI, MISI & TUJUAN MADRASAH
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Arah Pijakan Pembinaan Moral, Intelektual, & Spiritual Santri Salafiyah
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenEdit}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Visi & Misi</span>
          </button>
        )}
      </div>

      {/* 1. VISI UTAMA */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-300 p-5 shadow-xs space-y-2 relative overflow-hidden">
        <div className="flex items-center gap-2 text-emerald-900">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
            VISI UTAMA MADRASAH
          </h2>
        </div>

        <p className="text-sm sm:text-base font-extrabold text-emerald-950 italic leading-relaxed pt-1">
          {data.visi}
        </p>
      </div>

      {/* 2. BUTIR-BUTIR MISI */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2 text-teal-800 border-b border-slate-100 pb-3">
          <Target className="w-5 h-5 text-teal-600" />
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide">
            MISI MADRASAH
          </h2>
        </div>

        <div className="space-y-2.5">
          {data.misi.map((m, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 hover:bg-teal-50/60 transition-colors">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {m}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TUJUAN LEMBAGA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-700 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-amber-600" />
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide">
            TUJUAN POKOK MADRASAH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.tujuan.map((t, idx) => (
            <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {t}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit Visi Misi */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-emerald-600" />
                Edit Visi, Misi & Tujuan Madrasah
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Visi Utama:
                </label>
                <textarea
                  rows={3}
                  value={tempVisi}
                  onChange={(e) => setTempVisi(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-medium"
                  required
                />
              </div>

              {/* Misi List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Butir-Butir Misi:
                  </label>
                  <button
                    type="button"
                    onClick={() => setTempMisi([...tempMisi, ''])}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Misi</span>
                  </button>
                </div>
                {tempMisi.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => {
                        const copy = [...tempMisi];
                        copy[idx] = e.target.value;
                        setTempMisi(copy);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                    />
                    {tempMisi.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setTempMisi(tempMisi.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Tujuan List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Tujuan Pokok:
                  </label>
                  <button
                    type="button"
                    onClick={() => setTempTujuan([...tempTujuan, ''])}
                    className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Tujuan</span>
                  </button>
                </div>
                {tempTujuan.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={t}
                      onChange={(e) => {
                        const copy = [...tempTujuan];
                        copy[idx] = e.target.value;
                        setTempTujuan(copy);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                    />
                    {tempTujuan.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setTempTujuan(tempTujuan.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
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
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
