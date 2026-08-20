import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  Sparkles, 
  Share2, 
  MoreVertical, 
  PlusSquare, 
  ShieldCheck, 
  WifiOff, 
  Zap, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { playTapSound } from '../utils/audio';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'chrome' | 'samsung' | 'ios' | 'apk'>('chrome');

  useEffect(() => {
    // Check if already standalone
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    playTapSound();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show manual guide
      setActiveTab('chrome');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-emerald-500/20 overflow-hidden space-y-0 my-auto animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 p-5 text-white relative">
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-md shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.2 rounded-full">
                  PWA & APK ANDROID
                </span>
                <span className="text-teal-200 text-xs font-semibold">Resmi Madrasah</span>
              </div>
              <h2 className="text-lg font-black text-white">
                Pasang di HP Android
              </h2>
              <p className="text-xs text-teal-100 mt-0.5">
                Akses cepat seperti aplikasi Play Store tanpa perlu buka browser
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Quick Install Banner if Prompt Available */}
          {deferredPrompt && (
            <div className="p-3.5 bg-gradient-to-r from-amber-500/15 to-emerald-500/15 rounded-2xl border border-amber-400/40 flex items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <span className="font-extrabold text-slate-800 block">Tombol Pasang Otomatis Siap!</span>
                <span className="text-slate-600 text-[11px]">HP Anda mendukung instalasi langsung 1-klik</span>
              </div>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Install Sekarang</span>
              </button>
            </div>
          )}

          {installSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Aplikasi telah berhasil dipasang di layar utama ponsel Android Anda!</span>
            </div>
          )}

          {/* Keunggulan Pasang di Android */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <span className="font-extrabold text-xs text-slate-800 block">Layar Penuh</span>
              <span className="text-[10px] text-slate-500">Bebas address bar</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <WifiOff className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <span className="font-extrabold text-xs text-slate-800 block">Cache Cepat</span>
              <span className="text-[10px] text-slate-500">Hemat kuota data</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="font-extrabold text-xs text-slate-800 block">Aman & Ringan</span>
              <span className="text-[10px] text-slate-500">Hanya ~1 MB</span>
            </div>
          </div>

          {/* Tab Panduan Browser */}
          <div className="space-y-2.5">
            <span className="text-xs font-extrabold text-slate-800 block">
              Cara Pasang Manual di Layar Utama HP:
            </span>

            <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => {
                  playTapSound();
                  setActiveTab('chrome');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'chrome' ? 'bg-white text-emerald-900 shadow-xs font-extrabold' : 'text-slate-600'
                }`}
              >
                Google Chrome
              </button>
              <button
                onClick={() => {
                  playTapSound();
                  setActiveTab('samsung');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'samsung' ? 'bg-white text-teal-900 shadow-xs font-extrabold' : 'text-slate-600'
                }`}
              >
                Browser Lain
              </button>
              <button
                onClick={() => {
                  playTapSound();
                  setActiveTab('apk');
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'apk' ? 'bg-white text-amber-900 shadow-xs font-extrabold' : 'text-slate-600'
                }`}
              >
                File APK Info
              </button>
            </div>

            {/* Guide Step Contents */}
            {activeTab === 'chrome' && (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-slate-700">
                    Buka link aplikasi ini di <strong>Google Chrome</strong> di ponsel Android Anda.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-slate-700">
                    Ketuk <strong>menu titik tiga (⋮)</strong> di pojok kanan atas browser Chrome.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p className="text-slate-700">
                    Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <p className="text-slate-700">
                    Ikon aplikasi <strong>MadrasahKu</strong> akan langsung muncul di home screen HP Android Anda.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'samsung' && (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <p className="text-slate-700">
                    Di <strong>Samsung Internet</strong>, <strong>Mi Browser</strong>, atau <strong>Opera</strong>, ketuk menu garis tiga (≡) atau titik tiga.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <p className="text-slate-700">
                    Pilih menu <strong>"Tambahkan Halaman Ke"</strong> ➔ <strong>"Layar Depan / Home Screen"</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <p className="text-slate-700">
                    Buka langsung dari layar utama untuk pengalaman fullscreen layaknya native app.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'apk' && (
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="space-y-1.5 text-slate-700">
                  <p>
                    Aplikasi ini sudah berstandar <strong>Progressive Web App (PWA) & WebAPK</strong> dengan service worker aktif dan manifest web.
                  </p>
                  <p className="text-slate-600 text-[11px]">
                    Jika Anda membutuhkan bundle <strong>.APK mandiri</strong> untuk dibagikan via WhatsApp atau diunggah ke Google Play Console, Anda dapat mengemas web ini menggunakan <strong>PWABuilder.com</strong> atau <strong>Bubblewrap CLI (Google TWA)</strong> secara langsung tanpa coding ulang.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Pasang Aplikasi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
