import React from 'react';
import { 
  Target, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Award, 
  Heart, 
  ShieldCheck 
} from 'lucide-react';
import { VISI_MISI_DATA } from '../../data/madrasahCompleteData';

export const VisiMisiView: React.FC = () => {
  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 rounded-3xl p-5 text-white shadow-md space-y-2">
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
          {VISI_MISI_DATA.visi}
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
          {VISI_MISI_DATA.misi.map((m, idx) => (
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
            5 TUJUAN POKOK MADRASAH
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VISI_MISI_DATA.tujuan.map((t, idx) => (
            <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {t}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
