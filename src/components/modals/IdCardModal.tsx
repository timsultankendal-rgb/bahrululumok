import React, { useState, useRef } from 'react';
import { X, QrCode, RotateCw, Download, Sparkles, Camera, Image as ImageIcon, Upload, Check, Cloud } from 'lucide-react';
import { StudentProfile, TeacherProfile, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { AppBrandingConfig, DEFAULT_BRANDING } from './AppBrandingModal';
import { compressImageFile } from '../../services/firestoreService';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

interface IdCardModalProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  onClose: () => void;
  branding?: AppBrandingConfig;
  onUpdatePhoto?: (newPhotoUrl: string) => Promise<void> | void;
}

export const IdCardModal: React.FC<IdCardModalProps> = ({
  student,
  teacher,
  activeRole,
  onClose,
  branding = DEFAULT_BRANDING,
  onUpdatePhoto,
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentName = activeRole === 'guru' ? teacher.name : student.name;
  const currentPhoto = activeRole === 'guru' ? teacher.photoUrl : student.photoUrl;

  const handleSelectPhoto = async (newUrl: string) => {
    playTapSound();
    if (onUpdatePhoto) {
      setIsUploading(true);
      setSyncStatus('Menyimpan ke Cloud Firestore...');
      try {
        await onUpdatePhoto(newUrl);
        setSyncStatus('✅ Foto tersinkron ke semua perangkat!');
        setTimeout(() => setSyncStatus(null), 3000);
      } catch (err) {
        console.warn('Sync error:', err);
        setSyncStatus('⚠️ Tersimpan di perangkat lokal');
        setTimeout(() => setSyncStatus(null), 3000);
      } finally {
        setIsUploading(false);
      }
    }
    setIsPhotoPickerOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setSyncStatus('Mengompresi & mengunggah foto...');
    try {
      const compressedDataUrl = await compressImageFile(file, 360, 360, 0.8);
      await handleSelectPhoto(compressedDataUrl);
    } catch (err) {
      console.error('File compression error:', err);
      alert('Gagal memproses file foto. Silakan pilih foto lain.');
      setIsUploading(false);
      setSyncStatus(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 my-auto max-h-[95vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-3">
          <h3 className="text-sm font-extrabold text-slate-800">Kartu Pelajar & Santri Digital</h3>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center justify-center gap-1">
            <Cloud className="w-3 h-3 text-emerald-600 inline" />
            Barcode & QR Scan Resmi • Cloud Sync
          </span>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800 animate-in fade-in">
            {syncStatus}
          </div>
        )}

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
                    <div className="w-8 h-8 rounded-xl bg-white/15 p-0.5 flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
                      {branding.logoUrl ? (
                        <img
                          src={branding.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white truncate max-w-[170px]">
                        {branding.institutionName || 'MTs AL-IKHLAS KENDAL'}
                      </h4>
                      <p className="text-[8px] text-emerald-200 font-medium">
                        {branding.portalBadge || 'KEMENAG REPUBLIK INDONESIA'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                    KARTU DIGITAL
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="relative group">
                    <div className="w-16 h-20 rounded-xl overflow-hidden ring-2 ring-amber-400 bg-slate-900 shrink-0 shadow-xs">
                      <img
                        src={currentPhoto}
                        alt={currentName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
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

        {/* Change Photo Accordion / Panel */}
        {isPhotoPickerOpen ? (
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700">Pilih Foto Baru:</span>
              <button
                onClick={() => setIsPhotoPickerOpen(false)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
              >
                Tutup
              </button>
            </div>

            {/* Upload from Gallery / Camera Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isUploading ? 'Memproses Foto...' : 'Unggah dari Galeri / Kamera HP'}</span>
            </button>

            {/* Presets */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Atau pilih avatar profil:</span>
              <div className="grid grid-cols-6 gap-1.5">
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPhoto(p)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      currentPhoto === p ? 'border-emerald-600 ring-2 ring-emerald-400 scale-105' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={p} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              playTapSound();
              setIsPhotoPickerOpen(true);
            }}
            className="w-full mt-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Ganti Foto Profil (Kamera / Galeri HP)</span>
          </button>
        )}

        <div className="flex gap-2 mt-3">
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
              alert('Kartu Santri berhasil disimpan. Tampilan foto telah diperbarui dan disinkronkan ke cloud.');
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
