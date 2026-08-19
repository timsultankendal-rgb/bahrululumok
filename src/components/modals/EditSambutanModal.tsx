import React, { useState, useRef } from 'react';
import {
  Sparkles,
  User,
  Image as ImageIcon,
  Save,
  X,
  RotateCcw,
  Check,
  UploadCloud,
  GraduationCap,
  FileText,
  Quote,
  ShieldCheck,
  Award,
  BookOpen,
  Eye
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export interface SambutanKepalaConfig {
  namaKepala: string;
  gelarJabatan: string;
  fotoUrl: string;
  alumni: string;
  izinOperasional: string;
  statusAkreditasi: string;
  judulSambutan: string;
  isiSambutan: string;
  pesanKutipan: string;
}

export const DEFAULT_SAMBUTAN_CONFIG: SambutanKepalaConfig = {
  namaKepala: 'KH. Abdullah Syukri, Lc., M.A.',
  gelarJabatan: 'Kepala Madrasah Diniyah Takmiliyah Wustho',
  fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
  alumni: 'Univ. Al-Azhar Kairo, Mesir',
  izinOperasional: 'Kd.11.24/5/PP.00.7/108/2016',
  statusAkreditasi: 'Terakreditasi "A" (Unggul)',
  judulSambutan: 'Membangun Benteng Moral & Intelektual Santri di Era Transformasi Digital',
  isiSambutan: `Bismillâhirrahmânirrahîm. Assalamu’alaikum Warahmatullahi Wabarakatuh.

Segala puji bagi Allah SWT yang senantiasa melimpahkan taufiq dan hidayah-Nya kepada kita semua. Di tengah arus globalisasi dan kemajuan teknologi yang begitu pesat, keberadaan madrasah menjadi oase sekaligus benteng kokoh dalam menjaga aqidah, menanamkan akhlaqul karimah, serta melestarikan warisan keilmuan para ulama salafussolih.

Melalui portal web dan sistem informasi terpadu 18 modul ini, kami berkomitmen mewujudkan transparansi informasi, mempermudah pemantauan KBM oleh wali santri, serta meningkatkan kualitas layanan pendidikan keagamaan yang akuntabel dan profesional.

Semoga ikhtiar kita bersama ini diridhai oleh Allah SWT dan melahirkan santri-santri yang bermanfaat bagi agama, nusa, dan bangsa. Âmîn Yâ Rabbal ‘Âlamîn.`,
  pesanKutipan: 'Mendidik dengan Hati, Membina dengan Keteladanan, Berprestasi dengan Akhlakul Karimah.'
};

const FOTO_PRESETS = [
  {
    name: 'Foto Tokoh 1 (Ulama Berwibawa)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Foto Tokoh 2 (Ustadz Akademisi)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Foto Tokoh 3 (Pendidik Senior)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Foto Tokoh 4 (Kyai Pesantren Modern)',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80'
  }
];

interface EditSambutanModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SambutanKepalaConfig;
  onSave: (newConfig: SambutanKepalaConfig) => void;
}

export const EditSambutanModal: React.FC<EditSambutanModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [form, setForm] = useState<SambutanKepalaConfig>({
    ...DEFAULT_SAMBUTAN_CONFIG,
    ...config
  });
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'kepala' | 'sambutan' | 'preview'>('kepala');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Memproses foto...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setForm((prev) => ({ ...prev, fotoUrl: dataUrl }));
        setUploadStatus('✅ Foto berhasil diunggah!');
        setTimeout(() => setUploadStatus(null), 3000);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Kembalikan data Kepala Madrasah dan Sambutan ke bawaan resmi?')) {
      playTapSound();
      setForm(DEFAULT_SAMBUTAN_CONFIG);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Edit Kepala Madrasah & Sambutan
              </h3>
              <p className="text-[11px] text-teal-200 font-medium">
                Sinkron otomatis ke Halaman Depan Web & Dashboard Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-Nav */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 px-4 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('kepala')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kepala'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Biodata & Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sambutan')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sambutan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Teks Sambutan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>3. Pratinjau Tampilan</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: KEPALA MADRASAH */}
          {activeTab === 'kepala' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    type="text"
                    required
                    value={form.namaKepala}
                    onChange={(e) => setForm({ ...form, namaKepala: e.target.value })}
                    placeholder="cth: KH. Abdullah Syukri, Lc., M.A."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Jabatan Resmi:
                  </label>
                  <input
                    type="text"
                    required
                    value={form.gelarJabatan}
                    onChange={(e) => setForm({ ...form, gelarJabatan: e.target.value })}
                    placeholder="cth: Kepala Madrasah Diniyah Takmiliyah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Foto Section */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-700">Foto Kepala Madrasah:</span>
                  {uploadStatus && (
                    <span className="text-[11px] font-bold text-emerald-700">{uploadStatus}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-600 shrink-0 shadow-xs">
                    <img
                      src={form.fotoUrl || DEFAULT_SAMBUTAN_CONFIG.fotoUrl}
                      alt="Foto Kepala"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_SAMBUTAN_CONFIG.fotoUrl;
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="url"
                      value={form.fotoUrl}
                      onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
                      placeholder="Masukkan URL Gambar Foto (https://...)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Unggah Foto dari Perangkat</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Photos */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">
                    Atau Pilih Foto Preset Tersedia:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {FOTO_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          playTapSound();
                          setForm({ ...form, fotoUrl: p.url });
                        }}
                        className={`p-1.5 rounded-xl border flex items-center gap-2 text-left cursor-pointer transition-all ${
                          form.fotoUrl === p.url
                            ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-100'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                        <span className="text-[10px] font-bold text-slate-700 truncate">{p.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kredensial & Legalitas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Riwayat Alumni / Pendidikan:
                  </label>
                  <input
                    type="text"
                    value={form.alumni}
                    onChange={(e) => setForm({ ...form, alumni: e.target.value })}
                    placeholder="cth: Univ. Al-Azhar Kairo, Mesir"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Izin Operasional Kemenag:
                  </label>
                  <input
                    type="text"
                    value={form.izinOperasional}
                    onChange={(e) => setForm({ ...form, izinOperasional: e.target.value })}
                    placeholder="cth: Kd.11.24/5/PP.00.7/108/2016"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    Status Akreditasi:
                  </label>
                  <input
                    type="text"
                    value={form.statusAkreditasi}
                    onChange={(e) => setForm({ ...form, statusAkreditasi: e.target.value })}
                    placeholder="cth: Terakreditasi A (Unggul)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAMBUTAN */}
          {activeTab === 'sambutan' && (
            <div className="space-y-3.5">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Judul Utama Sambutan:
                </label>
                <input
                  type="text"
                  required
                  value={form.judulSambutan}
                  onChange={(e) => setForm({ ...form, judulSambutan: e.target.value })}
                  placeholder="cth: Membangun Benteng Moral & Intelektual Santri"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Isi Lengkap Sambutan Kepala Madrasah:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Mendukung multi-paragraf</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={form.isiSambutan}
                  onChange={(e) => setForm({ ...form, isiSambutan: e.target.value })}
                  placeholder="Tuliskan isi sambutan resmi kepala madrasah..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-normal text-slate-800 leading-relaxed focus:outline-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Pesan Kutipan / Slogan Pimpinan (Quote):
                </label>
                <input
                  type="text"
                  value={form.pesanKutipan}
                  onChange={(e) => setForm({ ...form, pesanKutipan: e.target.value })}
                  placeholder="cth: Mendidik dengan Hati, Membina dengan Keteladanan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl italic text-slate-700 focus:outline-emerald-600"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                  Pratinjau Halaman Web & Profil
                </span>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-600 shrink-0 shadow-md">
                    <img
                      src={form.fotoUrl || DEFAULT_SAMBUTAN_CONFIG.fotoUrl}
                      alt={form.namaKepala}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                      {form.namaKepala}
                    </h4>
                    <p className="text-xs text-emerald-700 font-bold">{form.gelarJabatan}</p>
                    <p className="text-[11px] text-slate-500">🎓 {form.alumni}</p>
                    <p className="text-[11px] text-slate-500">📜 {form.izinOperasional}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <h5 className="font-extrabold text-xs text-slate-800">
                    "{form.judulSambutan}"
                  </h5>
                  <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line line-clamp-4">
                    {form.isiSambutan}
                  </div>
                </div>

                {form.pesanKutipan && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] italic font-medium flex items-center gap-2">
                    <Quote className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{form.pesanKutipan}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
