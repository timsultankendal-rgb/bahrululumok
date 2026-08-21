import React from 'react';
import { 
  Sparkles, 
  Users, 
  Clock, 
  MapPin, 
  UserCheck, 
  ShieldCheck, 
  Music, 
  Activity 
} from 'lucide-react';
import { EKSTRAKURIKULER_LIST } from '../../data/madrasahCompleteData';
import { UserRole } from '../../types';
import { useAccessPermission } from '../../hooks/useAccessPermission';

interface EkstrakurikulerViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const EkstrakurikulerView: React.FC<EkstrakurikulerViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('16_ekstrakurikuler', activeRole, explicitCanEdit);
  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-indigo-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 16
            </span>
            <span className="text-teal-100 text-xs font-semibold">Minat, Bakat, & Seni Budaya Islam</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">16. KEGIATAN EKSTRAKURIKULER</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Hadroh Rebana, Pencak Silat Pagar Nusa, Khitobah 3 Bahasa, & Seni Kaligrafi
          </p>
        </div>

        <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <Activity className="w-4 h-4 text-amber-300 inline mr-1.5" />
          <span>{EKSTRAKURIKULER_LIST.length} Kegiatan Aktif</span>
        </div>
      </div>

      {/* Ekstrakurikuler Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EKSTRAKURIKULER_LIST.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {item.foto && (
                <div className="h-44 bg-slate-900 overflow-hidden relative">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
                      {item.jumlahAnggota} Santri Bergabung
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 space-y-2.5">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  {item.nama}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.deskripsi}
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="text-slate-500 font-semibold">Pembina:</span>
                    <span className="font-bold text-slate-800">{item.pembina}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-slate-500 font-semibold">Jadwal:</span>
                    <span className="font-medium text-slate-800">{item.jadwalLatihan}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-slate-500 font-semibold">Tempat:</span>
                    <span className="font-medium text-slate-800">{item.tempat}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
