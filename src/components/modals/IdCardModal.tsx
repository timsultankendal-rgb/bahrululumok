import React, { useState } from 'react';
import { X, QrCode, RotateCw, Download, Sparkles, ShieldCheck } from 'lucide-react';
import { StudentProfile, TeacherProfile, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';

interface IdCardModalProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  onClose: () => void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  student,
  teacher,
  activeRole,
  onClose,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentName = activeRole === 'guru' ? teacher.name : student.name;
  const currentPhoto = activeRole === 'guru' ? teacher.photoUrl : student.photoUrl;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-3">
          <h3 className="text-sm font-extrabold text-slate-800">Kartu Pelajar & Santri Digital</h3>
          <span className="text-[10px] text-emerald-700 font-bold">Barcode & QR Scan Resmi</span>
        </div>

        {/* Card Component */}
        <div
          onClick={() => {
            playTapSound();
            setIsFlipped(!isFlipped);
          }}
          className="w-full cursor-pointer perspective-[1000px] select-none my-2"
        >
          <div
            className={`w-full rounded-2xl p-4 transition-all duration-500 shadow-xl relative border ${
              !isFlipped
                ? 'bg-gradient-to-tr from-emerald-900 via-emerald-700 to-teal-800 border-emerald-500/40 text-white'
                : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border-slate-700 text-slate-200'
            }`}
          >
            {!isFlipped ? (
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-600/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/15 p-1 flex items-center justify-center border border-white/20">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        MTs AL-IKHLAS KENDAL
                      </h4>
                      <p className="text-[8px] text-emerald-200 font-medium">KEMENAG REPUBLIK INDONESIA</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-md shadow-2xs">
                    KARTU DIGITAL
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-16 h-20 rounded-xl overflow-hidden ring-2 ring-amber-400 bg-slate-900 shrink-0 shadow-xs">
                    <img
                      src={currentPhoto}
                      alt={currentName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{currentName}</h3>
                    {student.arabicName && activeRole === 'santri' && (
                      <div className="font-arabic text-xs text-amber-300">{student.arabicName}</div>
                    )}
                    <div className="text-[11px] font-mono text-emerald-200 mt-1 font-bold">
                      NISN: {activeRole === 'guru' ? teacher.nip : student.nisn}
                    </div>
                    <div className="text-[10px] text-emerald-100 font-medium">
                      {activeRole === 'guru' ? teacher.subject : student.level}
                    </div>
                  </div>

                  <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center shadow-md">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-emerald-600/50 flex items-center justify-between text-[9px] text-emerald-200">
                  <span>Tahun 2025/2026</span>
                  <span className="text-amber-300 font-bold">Valid • Madrasah Mandiri Berprestasi</span>
                </div>
              </div>
            ) : (
              <div className="text-left text-xs py-1">
                <div className="text-center font-bold text-amber-400 pb-1 border-b border-slate-700 mb-2">
                  TATA TERTIB SANTRI
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  Menjaga sholat berjamaah tepat waktu di masjid, menghormati ustadz/ustadzah, dan menjunjung tinggi nama baik madrasah.
                </p>
                <div className="mt-4 pt-2 border-t border-slate-700 flex flex-col items-center">
                  <div className="h-6 flex items-center gap-0.5 opacity-80">
                    {Array.from({ length: 35 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-white ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 mt-1">
                    *MDR-232409042*
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              playTapSound();
              setIsFlipped(!isFlipped);
            }}
            className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Balik Kartu</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              alert('Kartu Santri berhasil diunduh sebagai gambar beresolusi tinggi.');
            }}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan Kartu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
