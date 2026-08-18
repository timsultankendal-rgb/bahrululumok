import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Building2, 
  Save, 
  X, 
  RotateCcw, 
  Check, 
  UploadCloud, 
  ShieldCheck,
  Palette,
  ExternalLink,
  Layers,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export interface AppBrandingConfig {
  appName: string;
  appBadge: string;
  portalBadge: string;
  institutionName: string;
  kemenagText: string;
  appSubtitle: string;
  logoUrl: string;
  themeColor: 'emerald' | 'teal' | 'blue' | 'indigo';
}

export const DEFAULT_BRANDING: AppBrandingConfig = {
  appName: 'MadrasahKu',
  appBadge: 'DIGITAL',
  portalBadge: 'Portal Madrasah Kemenag RI',
  institutionName: 'MTs Al-Ikhlas Kendal',
  kemenagText: 'Kemenag RI',
  appSubtitle: 'Sistem Informasi Akademik & Kesiswaan Terpadu',
  logoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=150&auto=format&fit=crop&q=80',
  themeColor: 'emerald'
};

const LOGO_PRESETS = [
  {
    name: 'Logo Default (Masjid Hijau Modern)',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Emblem Kaligrafi & Al-Qur\'an Emas',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Lambang Kubah Emas & Menara',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Lambang Kitab Kuning Salafiyah',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Madrasah Hebat & Bermartabat',
    url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Bintang & Bulan Sabit Zamrud',
    url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=150&auto=format&fit=crop&q=80'
  }
];

interface AppBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: AppBrandingConfig;
  onSave: (newBranding: AppBrandingConfig) => void;
}

export const AppBrandingModal: React.FC<AppBrandingModalProps> = ({
  isOpen,
  onClose,
  branding,
  onSave
}) => {
  const [form, setForm] = useState<AppBrandingConfig>({
    ...DEFAULT_BRANDING,
    ...branding
  });
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload & compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus('Memproses gambar...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize image using canvas to max 256x256 px
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewError(false);
          setForm((prev) => ({ ...prev, logoUrl: dataUrl }));
          setUploadStatus('✅ Gambar logo berhasil dimuat!');
          setTimeout(() => setUploadStatus(null), 2500);
        }
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
    if (confirm('Kembalikan logo, nama aplikasi, dan portal Kemenag ke pengaturan awal?')) {
      playTapSound();
      setForm(DEFAULT_BRANDING);
      onSave(DEFAULT_BRANDING);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">Pengaturan Logo & Identitas Madrasah</h3>
              <p className="text-[10px] text-emerald-200">Edit Nama Aplikasi, Portal Kemenag, dan Logo Lambang</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Header Box */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              Pratinjau Langsung (Live Preview Header):
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {form.portalBadge || 'Portal Madrasah Kemenag RI'}
            </span>
          </div>

          <div className="p-3 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-2xl text-white flex items-center gap-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
              {form.logoUrl && !previewError ? (
                <img
                  src={form.logoUrl}
                  alt="Logo Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Sparkles className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-black text-sm sm:text-base tracking-tight text-white truncate">
                  {form.appName || 'MadrasahKu'}
                </h4>
                <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
                  {form.appBadge || 'DIGITAL'}
                </span>
                <span className="text-[10px] text-emerald-200 font-medium">•</span>
                <span className="text-[11px] text-amber-200 font-bold truncate">
                  {form.institutionName || 'MTs Al-Ikhlas Kendal'}
                </span>
              </div>
              <p className="text-[10px] text-emerald-100 font-medium truncate mt-0.5">
                {form.appSubtitle || 'Sistem Informasi Akademik & Kesiswaan Terpadu'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Section 1: Nama Aplikasi & Portal Kemenag */}
          <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs mb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>1. Identitas Aplikasi & Portal Kemenag:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="font-extrabold text-slate-700 block mb-1">
                  Nama Utama Aplikasi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MadrasahKu"
                  value={form.appName}
                  onChange={(e) => setForm({ ...form, appName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-emerald-600"
                />
              </div>
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Label Badge:
                </label>
                <input
                  type="text"
                  required
                  placeholder="DIGITAL / MOBILE"
                  value={form.appBadge}
                  onChange={(e) => setForm({ ...form, appBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-center uppercase text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Label Portal Kemenag / Naungan:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Portal Madrasah Kemenag RI"
                  value={form.portalBadge}
                  onChange={(e) => setForm({ ...form, portalBadge: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-emerald-600"
                />
                <span className="text-[9px] text-slate-400 mt-0.5 block">
                  Ditampilkan pada header atas &amp; kartu madrasah
                </span>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Nama Lembaga / Madrasah:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MTs Al-Ikhlas Kendal"
                  value={form.institutionName}
                  onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Slogan / Deskripsi Singkat:
              </label>
              <input
                type="text"
                placeholder="Contoh: Sistem Informasi Akademik & Kesiswaan Terpadu"
                value={form.appSubtitle}
                onChange={(e) => setForm({ ...form, appSubtitle: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-emerald-600"
              />
            </div>
          </div>

          {/* Section 2: Upload / Ganti Logo */}
          <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-xs">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Ganti Lambang &amp; Logo Madrasah:</span>
              </div>
              {uploadStatus && (
                <span className="text-[10px] font-bold text-emerald-700">{uploadStatus}</span>
              )}
            </div>

            {/* Upload File Direct from Phone/PC */}
            <div className="p-3 bg-white border-2 border-dashed border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-xs">Upload Gambar Logo dari HP / Laptop</h5>
                  <p className="text-[10px] text-slate-500">Pilih file JPG, PNG, atau WEBP langsung</p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer transition-all shadow-xs shrink-0"
              >
                Pilih File Logo...
              </button>
            </div>

            {/* Input URL Gambar */}
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Atau Tempel Tautan URL Logo:
              </label>
              <input
                type="url"
                placeholder="https://domain.com/logo-madrasah.png"
                value={form.logoUrl}
                onChange={(e) => {
                  setPreviewError(false);
                  setForm({ ...form, logoUrl: e.target.value });
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-emerald-600"
              />
            </div>

            {/* Preset Logo Pilihan */}
            <div>
              <span className="text-[10px] text-slate-500 font-bold block mb-1.5">
                Pilihan Preset Lambang Madrasah Islami:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {LOGO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playTapSound();
                      setPreviewError(false);
                      setForm({ ...form, logoUrl: preset.url });
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-left text-[11px] transition-all cursor-pointer ${
                      form.logoUrl === preset.url
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <span className="truncate flex-1">{preset.name}</span>
                    {form.logoUrl === preset.url && (
                      <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
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
          </div>
        </form>
      </div>
    </div>
  );
};
