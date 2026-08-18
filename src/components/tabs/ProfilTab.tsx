import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  QrCode, 
  RotateCw, 
  Settings, 
  Bell, 
  Lock, 
  Smartphone, 
  HelpCircle, 
  LogOut, 
  Check, 
  Sparkles, 
  CreditCard,
  Building,
  GraduationCap,
  Users
} from 'lucide-react';
import { StudentProfile, TeacherProfile, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';

interface ProfilTabProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenNotifications: () => void;
}

export const ProfilTab: React.FC<ProfilTabProps> = ({
  student,
  teacher,
  activeRole,
  onChangeRole,
  onOpenNotifications,
}) => {
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [darkTheme, setDarkTheme] = useState<boolean>(true);
  const [autoAdzan, setAutoAdzan] = useState<boolean>(true);

  const currentName = activeRole === 'guru' ? teacher.name : student.name;
  const currentPhoto = activeRole === 'guru' ? teacher.photoUrl : student.photoUrl;

  const handleFlipCard = () => {
    playTapSound();
    setIsCardFlipped(!isCardFlipped);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8 bg-slate-50">
      {/* Role Switcher Banner */}
      <div className="p-3 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2 px-1">
          Ganti Mode Pengguna (Multi-Role Demo):
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            id="role-santri-select"
            onClick={() => {
              playTapSound();
              onChangeRole('santri');
            }}
            className={`p-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              activeRole === 'santri'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Santri / Siswa</span>
          </button>

          <button
            id="role-guru-select"
            onClick={() => {
              playTapSound();
              onChangeRole('guru');
            }}
            className={`p-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              activeRole === 'guru'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guru / Ustadz</span>
          </button>

          <button
            id="role-wali-select"
            onClick={() => {
              playTapSound();
              onChangeRole('wali');
            }}
            className={`p-2 rounded-2xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              activeRole === 'wali'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Wali Murid</span>
          </button>
        </div>
      </div>

      {/* ================= 3D DIGITAL STUDENT ID CARD ================= */}
      <div className="flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Kartu Identitas Digital
          </span>
          <button
            onClick={handleFlipCard}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Putar Kartu</span>
          </button>
        </div>

        {/* The Card Container */}
        <div
          onClick={handleFlipCard}
          className="w-full cursor-pointer perspective-[1000px] select-none"
        >
          <div
            className={`w-full rounded-3xl p-4 transition-all duration-500 shadow-md relative border ${
              !isCardFlipped
                ? 'bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-800 border-emerald-600 text-white'
                : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 border-slate-700 text-slate-200'
            }`}
          >
            {!isCardFlipped ? (
              /* CARD FRONT */
              <div>
                {/* Madrasah Header on Card */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-600/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-white">
                        MTs AL-IKHLAS KENDAL
                      </h4>
                      <p className="text-[9px] text-emerald-100 font-medium">KEMENTERIAN AGAMA REPUBLIK INDONESIA</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-400 text-emerald-950 font-extrabold px-1.5 py-0.5 rounded-lg shadow-2xs">
                    KARTU SANTRI
                  </span>
                </div>

                {/* Profile row */}
                <div className="flex gap-3 items-center">
                  <div className="w-16 h-20 rounded-2xl overflow-hidden ring-2 ring-amber-300/90 bg-slate-900 shrink-0 shadow-xs">
                    <img
                      src={currentPhoto}
                      alt={currentName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-extrabold text-white truncate">{currentName}</h3>
                    {student.arabicName && activeRole === 'santri' && (
                      <div className="font-arabic text-xs text-amber-300 font-bold">{student.arabicName}</div>
                    )}
                    <div className="text-[11px] font-mono text-emerald-200 mt-1 font-bold">
                      NISN: {activeRole === 'guru' ? teacher.nip : student.nisn}
                    </div>
                    <div className="text-[10px] text-emerald-100 font-medium">
                      {activeRole === 'guru' ? teacher.subject : student.level}
                    </div>
                  </div>

                  {/* QR Code on Card */}
                  <div className="w-14 h-14 bg-white p-1 rounded-2xl shrink-0 flex items-center justify-center shadow-xs">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                </div>

                {/* Card Bottom Bar */}
                <div className="mt-3 pt-2 border-t border-emerald-600/50 flex items-center justify-between text-[10px] text-emerald-100 font-medium">
                  <span>Tahun Ajaran 2025/2026</span>
                  <span className="text-amber-300 font-bold">Valid ID • Terverifikasi</span>
                </div>
              </div>
            ) : (
              /* CARD BACK */
              <div className="text-left text-xs py-1">
                <div className="text-center font-extrabold text-amber-300 pb-1 border-b border-slate-700 mb-2">
                  KETENTUAN KARTU SANTRI DIGITAL
                </div>
                <ul className="space-y-1 text-[10px] text-slate-300 list-disc pl-4 leading-relaxed font-medium">
                  <li>Kartu ini adalah identitas resmi civitas akademika MTs Al-Ikhlas Kendal.</li>
                  <li>Dapat digunakan untuk presensi GPS, peminjaman e-library, dan transaksi kantin digital.</li>
                  <li>Wajib menjaga marwah dan akhlakul karimah almamater madrasah.</li>
                </ul>

                {/* Simulated Barcode */}
                <div className="mt-3 pt-2 border-t border-slate-700 flex flex-col items-center">
                  <div className="h-6 flex items-center gap-0.5 opacity-80">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-white ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 mt-1">
                    *MDR-IKH-232409042*
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BIODATA LENGKAP ================= */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-3">Informasi Akun</h4>
        <div className="space-y-2.5">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Nama Madrasah</span>
            <span className="font-bold text-slate-800">{student.madrasahName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Wali Murid</span>
            <span className="font-semibold text-slate-700">{student.waliName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Nomor Kontak</span>
            <span className="font-mono font-bold text-emerald-600">{student.phone}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Poin Kedisiplinan</span>
            <span className="font-extrabold text-amber-600">{student.points} / 100 Poin</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-slate-500 font-medium">Alamat Rumah</span>
            <span className="text-slate-700 font-medium text-right max-w-[180px] truncate">{student.address}</span>
          </div>
        </div>
      </div>

      {/* ================= PENGATURAN APK ================= */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-xs">
        <h4 className="font-extrabold text-slate-800 uppercase tracking-wider mb-3">Pengaturan Aplikasi</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700 font-semibold">Notifikasi Adzan & Tugas</span>
            </div>
            <button
              onClick={() => {
                playTapSound();
                setAutoAdzan(!autoAdzan);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                autoAdzan ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoAdzan ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-slate-700 font-semibold">Ganti Kata Sandi</span>
            </div>
            <button
              onClick={() => {
                playTapSound();
                alert('Tautan ganti kata sandi telah dikirim ke nomor WhatsApp terdaftar.');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-bold"
            >
              Ubah
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span className="text-slate-700 font-semibold">Versi Aplikasi Android</span>
            </div>
            <span className="font-mono text-slate-500 font-bold">v2.5.0-release</span>
          </div>
        </div>
      </div>
    </div>
  );
};
