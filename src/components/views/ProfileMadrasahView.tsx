import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Award, 
  Users, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  School,
  CheckCircle2,
  Edit2,
  Save,
  X,
  RotateCcw,
  Cloud,
  Check,
  Printer,
  Settings,
  Image as ImageIcon
} from 'lucide-react';
import { PROFILE_MADRASAH_DATA } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';
import { 
  saveMenuRecordToFirestore, 
  subscribeMenuRecords 
} from '../../services/firestoreService';

const STORAGE_KEY_PROFILE = 'madrasah_profile_data_v2';

interface ProfileMadrasahViewProps {
  onOpenBrandingSettings?: () => void;
}

export const ProfileMadrasahView: React.FC<ProfileMadrasahViewProps> = ({
  onOpenBrandingSettings
}) => {
  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return PROFILE_MADRASAH_DATA;
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [cloudStatus, setCloudStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Subscribe to Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeMenuRecords<typeof PROFILE_MADRASAH_DATA>('profile_madrasah', (records) => {
      if (!isMounted) return;
      if (records && records.length > 0 && records[0].payload) {
        setProfileData(records[0].payload);
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(records[0].payload));
      } else {
        // Seed initial data
        saveMenuRecordToFirestore('profile_madrasah', 'main', 'Profil Madrasah', PROFILE_MADRASAH_DATA);
      }
      setCloudStatus('synced');
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleOpenEdit = () => {
    playTapSound();
    setEditForm(profileData);
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setCloudStatus('saving');

    try {
      await saveMenuRecordToFirestore('profile_madrasah', 'main', 'Profil Madrasah', editForm);
      setProfileData(editForm);
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(editForm));
      setIsEditOpen(false);
      setCloudStatus('synced');
      showToast('✅ Data Profil Madrasah berhasil disimpan ke Cloud & Perangkat!');
    } catch (err) {
      console.warn('Firestore fallback', err);
      setProfileData(editForm);
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(editForm));
      setIsEditOpen(false);
      setCloudStatus('offline');
      showToast('💾 Profil tersimpan di memori perangkat');
    }
  };

  const handleReset = () => {
    if (confirm('Kembalikan profil ke data bawaan resmi madrasah?')) {
      playTapSound();
      setProfileData(PROFILE_MADRASAH_DATA);
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(PROFILE_MADRASAH_DATA));
      saveMenuRecordToFirestore('profile_madrasah', 'main', 'Profil Madrasah', PROFILE_MADRASAH_DATA);
      showToast('🔄 Profil di-reset ke template resmi madrasah');
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 rounded-3xl p-5 text-white shadow-md space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                MENU 7
              </span>
              <span className="text-emerald-100 text-xs font-semibold">Identitas & Legalitas Lembaga</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white leading-tight">
              {profileData.namaLembaga}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {profileData.naungan}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs text-white">
              <Cloud className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{cloudStatus === 'synced' ? 'Cloud Terhubung' : 'Offline'}</span>
            </div>

            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>

            {onOpenBrandingSettings && (
              <button
                onClick={() => {
                  playTapSound();
                  onOpenBrandingSettings();
                }}
                className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 text-white px-3 py-1.5 rounded-2xl text-xs font-black shadow-xs transition-all cursor-pointer"
                title="Ganti Logo, Nama & Slogan Aplikasi"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>Logo & Branding</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              title="Cetak Profil"
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleReset}
              title="Reset Default"
              className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/20 text-xs">
          <span className="bg-white/20 px-3 py-1 rounded-xl backdrop-blur-xs font-mono font-bold">
            {profileData.nomorStatistikMadrasah}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-xl backdrop-blur-xs font-mono font-bold">
            {profileData.npsn}
          </span>
          <span className="bg-amber-400 text-emerald-950 px-3 py-1 rounded-xl font-extrabold shadow-xs">
            {profileData.akreditasi}
          </span>
        </div>
      </div>

      {/* Quick Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Tahun Berdiri</span>
          <span className="text-sm sm:text-base font-black text-emerald-800">{profileData.tahunBerdiri}</span>
        </div>

        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Santri Aktif</span>
          <span className="text-sm sm:text-base font-black text-teal-800">{profileData.jumlahSantriAktif}</span>
        </div>

        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Dewan Asatidz</span>
          <span className="text-sm sm:text-base font-black text-blue-800">{profileData.jumlahAsatidz}</span>
        </div>

        <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Kurikulum</span>
          <span className="text-xs sm:text-sm font-black text-purple-800">Salaf Kitab Kuning</span>
        </div>
      </div>

      {/* Sejarah & Profil Lembaga */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <School className="w-5 h-5" />
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
            Sejarah Singkat & Pendirian Lembaga
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
          {profileData.sejarahSingkat}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Pendiri & Sesepuh:</span>
            <p className="font-extrabold text-slate-800 mt-0.5">{profileData.pendiri}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Kepala Madrasah Saat Ini:</span>
            <p className="font-extrabold text-emerald-800 mt-0.5">{profileData.kepalaMadrasah}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Alamat Kampus:</span>
          <p className="font-semibold text-slate-800">{profileData.alamat}</p>
        </div>
      </div>

      {/* MODAL EDIT PROFIL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">Edit Profil Madrasah</h3>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Nama Lembaga Madrasah:</label>
                <input
                  type="text"
                  required
                  value={editForm.namaLembaga}
                  onChange={(e) => setEditForm({ ...editForm, namaLembaga: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Naungan Yayasan & Legalitas:</label>
                <input
                  type="text"
                  required
                  value={editForm.naungan}
                  onChange={(e) => setEditForm({ ...editForm, naungan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Nomor Statistik (NSM):</label>
                  <input
                    type="text"
                    required
                    value={editForm.nomorStatistikMadrasah}
                    onChange={(e) => setEditForm({ ...editForm, nomorStatistikMadrasah: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">NPSN:</label>
                  <input
                    type="text"
                    required
                    value={editForm.npsn}
                    onChange={(e) => setEditForm({ ...editForm, npsn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Status Akreditasi:</label>
                  <input
                    type="text"
                    required
                    value={editForm.akreditasi}
                    onChange={(e) => setEditForm({ ...editForm, akreditasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Nama Pendiri / Sesepuh:</label>
                  <input
                    type="text"
                    required
                    value={editForm.pendiri}
                    onChange={(e) => setEditForm({ ...editForm, pendiri: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Kepala Madrasah:</label>
                  <input
                    type="text"
                    required
                    value={editForm.kepalaMadrasah}
                    onChange={(e) => setEditForm({ ...editForm, kepalaMadrasah: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Tahun Berdiri:</label>
                  <input
                    type="text"
                    required
                    value={editForm.tahunBerdiri}
                    onChange={(e) => setEditForm({ ...editForm, tahunBerdiri: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Jumlah Santri:</label>
                  <input
                    type="text"
                    required
                    value={editForm.jumlahSantriAktif}
                    onChange={(e) => setEditForm({ ...editForm, jumlahSantriAktif: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Jumlah Asatidz:</label>
                  <input
                    type="text"
                    required
                    value={editForm.jumlahAsatidz}
                    onChange={(e) => setEditForm({ ...editForm, jumlahAsatidz: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Alamat Kampus:</label>
                <input
                  type="text"
                  required
                  value={editForm.alamat}
                  onChange={(e) => setEditForm({ ...editForm, alamat: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Sejarah Singkat Lembaga:</label>
                <textarea
                  rows={4}
                  required
                  value={editForm.sejarahSingkat}
                  onChange={(e) => setEditForm({ ...editForm, sejarahSingkat: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-xs cursor-pointer"
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
