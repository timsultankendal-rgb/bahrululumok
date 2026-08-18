import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  RotateCw,
  RefreshCw,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentProfile, PresensiRecord } from '../../types';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface AbsensiModalProps {
  student: StudentProfile;
  onClose: () => void;
  onSuccessPresensi: (record: PresensiRecord) => void;
  existingPresensi: PresensiRecord | null;
}

export const AbsensiModal: React.FC<AbsensiModalProps> = ({
  student,
  onClose,
  onSuccessPresensi,
  existingPresensi,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [gpsDistance, setGpsDistance] = useState<number>(8); // 8 meters from madrasah center
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCaptureAttendance = () => {
    playTapSound();
    setIsCapturing(true);

    setTimeout(() => {
      setIsCapturing(false);
      setIsSuccess(true);
      playSuccessSound();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.5 }
      });

      const newRec: PresensiRecord = {
        id: 'pres-' + Date.now(),
        tanggal: 'Hari Ini, 18 Agustus 2026',
        jamMasuk: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        status: 'Hadir',
        lokasi: `Gerbang MTs Al-Ikhlas Kendal (Radius ${gpsDistance}m Valid)`,
      };

      onSuccessPresensi(newRec);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">Presensi Mandiri GPS & Face ID</h3>
            <span className="text-[10px] text-slate-500 font-medium">Validasi Lokasi Madrasah</span>
          </div>
        </div>

        {!isSuccess ? (
          <div className="flex flex-col gap-3">
            {/* Live Camera Viewfinder Simulation */}
            <div className="w-full h-56 rounded-2xl bg-slate-950 border-2 border-dashed border-emerald-500/50 relative overflow-hidden flex flex-col items-center justify-center">
              {/* Simulated Selfie Background */}
              <img
                src={student.photoUrl}
                alt="Student Camera"
                className="w-full h-full object-cover opacity-60 filter contrast-110"
                referrerPolicy="no-referrer"
              />

              {/* Face Target Reticle Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-36 h-44 border-2 border-emerald-400/80 rounded-3xl relative flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-300" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-300" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-300" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-300" />
                  
                  {isCapturing ? (
                    <div className="w-full h-1 bg-emerald-400 animate-pulse shadow-[0_0_15px_#10b981]" />
                  ) : (
                    <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-emerald-300 backdrop-blur-sm font-semibold">
                      Posisikan Wajah
                    </span>
                  )}
                </div>
              </div>

              {/* Status Overlay */}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] text-emerald-300 flex items-center gap-1 font-mono font-bold">
                <Clock className="w-3 h-3" />
                <span>{currentTime || '06:45:00 WIB'}</span>
              </div>
            </div>

            {/* GPS Radius Validation Box */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-bold">Lokasi Madrasah:</span>
                </div>
                <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                  Radius Valid ({gpsDistance}m)
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Titik GPS: -6.918239, 110.204581 (MTs Al-Ikhlas Kendal)
              </p>
            </div>

            {/* Action Button */}
            <button
              id="btn-confirm-attendance"
              disabled={isCapturing}
              onClick={handleCaptureAttendance}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memindai Biometrik Wajah...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Ambil Foto & Check-in Kehadiran</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center mb-3 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-base font-extrabold text-slate-800">Presensi Berhasil Terkirim!</h3>
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">Status: Tepat Waktu (Hadir)</p>

            <div className="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Santri:</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">NISN / Kelas:</span>
                <span className="font-semibold text-slate-700">{student.nisn} ({student.level})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Waktu Masuk:</span>
                <span className="font-mono text-emerald-700 font-bold">{currentTime}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-xs cursor-pointer"
            >
              Tutup & Kembali ke Beranda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
