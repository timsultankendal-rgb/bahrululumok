import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

export interface AppBrandingConfig {
  appName: string;
  appBadge: string;
  appSubtitle: string;
  institutionName: string;
  logoUrl: string;
  themeColor: 'emerald' | 'teal' | 'blue' | 'indigo';
}

export const DEFAULT_BRANDING: AppBrandingConfig = {
  appName: 'MadrasahKu',
  appBadge: 'DIGITAL',
  appSubtitle: 'Sistem Informasi Akademik & Kesiswaan Madrasah',
  institutionName: 'Madrasah Diniyah Takmiliyah Al-Ikhlas',
  logoUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=150&auto=format&fit=crop&q=80',
  themeColor: 'emerald'
};

const LOGO_PRESETS = [
  {
    name: 'Logo Default (Masjid Hijau)',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Logo Al-Qur\'an & Kaligrafi',
    url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Logo Lambang Kubah Emas',
    url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Logo Kitab Kuning Salaf',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=150&auto=format&fit=crop&q=80'
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
  const [form, setForm] = useState<AppBrandingConfig>(branding);
  const [previewError, setPreviewError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Kembalikan logo dan nama aplikasi ke pengaturan bawaan awal?')) {
      playTapSound();
      setForm(DEFAULT_BRANDING);
      onSave(DEFAULT_BRANDING);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base">Pengaturan Logo & Nama Aplikasi</h3>
              <p className="text-[10px] text-emerald-200">Kustomisasi Branding, Nama Lembaga & Lambang</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Pratinjau Tampilan Header:
          </span>
          <div className="p-3 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-2xl text-white flex items-center gap-3 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 overflow-hidden shrink-0 flex items-center justify-center">
              {form.logoUrl && !previewError ? (
                <img
                  src={form.logoUrl}
                  alt="Logo Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Sparkles className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-sm tracking-tight text-white truncate">
                  {form.appName || 'Nama Aplikasi'}
                </h4>
                <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs">
                  {form.appBadge || 'DIGITAL'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-semibold truncate">
                {form.institutionName || 'Nama Madrasah'}
              </p>
              <p className="text-[9px] text-emerald-200 truncate">
                {form.appSubtitle || 'Subjudul aplikasi'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="font-extrabold text-slate-700 block mb-1">
                Nama Utama Aplikasi:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: MadrasahKu / E-Madrasah"
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-emerald-600"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center uppercase focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Nama Lengkap Madrasah / Lembaga:
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Madrasah Diniyah Takmiliyah Al-Ikhlas"
              value={form.institutionName}
              onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="font-extrabold text-slate-700 block mb-1">
              Slogan / Subjudul Singkat:
            </label>
            <input
              type="text"
              placeholder="Contoh: Sistem Informasi Akademik & Kesiswaan Terpadu"
              value={form.appSubtitle}
              onChange={(e) => setForm({ ...form, appSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
            />
          </div>

          {/* Logo URL Input & Presets */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-700 block">
              Tautan URL Logo / Lambang Madrasah:
            </label>
            <input
              type="url"
              placeholder="https://.../logo.png"
              value={form.logoUrl}
              onChange={(e) => {
                setPreviewError(false);
                setForm({ ...form, logoUrl: e.target.value });
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-emerald-600"
            />

            <div>
              <span className="text-[10px] text-slate-500 font-bold block mb-1">
                Atau Pilih Pilihan Preset Logo:
              </span>
              <div className="grid grid-cols-2 gap-2">
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
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-6 h-6 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
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
                <span>Simpan Logo & Nama</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
