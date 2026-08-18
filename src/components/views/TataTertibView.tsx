import React, { useState } from 'react';
import { 
  ShieldAlert, 
  GraduationCap, 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { TATA_TERTIB_LIST } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';

export const TataTertibView: React.FC = () => {
  const [activeKategori, setActiveKategori] = useState<'Murid' | 'Asatidz'>('Murid');

  const filteredList = TATA_TERTIB_LIST.filter((t) => t.kategori === activeKategori);

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 13
            </span>
            <span className="text-teal-100 text-xs font-semibold">Kode Etik & Disiplin Madrasah</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">13. TATA TERTIB ASATIDZ & MURID</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Pedoman Hak, Kewajiban, Larangan, & Ketentuan Kedisiplinan
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <ShieldAlert className="w-4 h-4 text-amber-300 inline mr-1.5" />
          <span>Buku Saku Santri & Asatidz</span>
        </div>
      </div>

      {/* Switcher Murid vs Asatidz */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveKategori('Murid');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeKategori === 'Murid'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tata Tertib Santri / Murid</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveKategori('Asatidz');
          }}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeKategori === 'Asatidz'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Tata Tertib Dewan Asatidz</span>
        </button>
      </div>

      {/* Content Pasal-Pasal */}
      <div className="space-y-4">
        {filteredList.map((pasal) => (
          <div
            key={pasal.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3"
          >
            <div className="border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-black uppercase text-teal-700 block">{pasal.bab}</span>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mt-0.5">{pasal.pasal}</h3>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 block">Kewajiban & Ketentuan:</span>
              {pasal.isi.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {pasal.sanksi && pasal.sanksi.length > 0 && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 space-y-1.5">
                <span className="text-[11px] font-extrabold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Sanksi Pelanggaran:
                </span>
                {pasal.sanksi.map((snk, i) => (
                  <p key={i} className="text-xs text-rose-900 leading-relaxed pl-5">
                    • {snk}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
