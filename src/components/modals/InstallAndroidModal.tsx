import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Info,
  ChevronRight,
  Flame,
  Globe
} from 'lucide-react';
import { playTapSound } from '../../utils/audio';

interface InstallAndroidModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAndroidModal: React.FC<InstallAndroidModalProps> = ({
  isOpen,
  onClose,
  appName = 'Bahrululumku'
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'share'>('pwa');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Capture beforeinstallprompt event for Android browsers
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://madrasahku.app';

  const handleInstallClick = async () => {
    playTapSound();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // If browser hasn't fired prompt yet, show guide
      alert("Untuk memasang di Android:\n1. Ketuk ikon titik tiga (⋮) di pojok kanan atas browser Chrome.\n2. Pilih 'Instal aplikasi' atau 'Tambahkan ke Layar Utama'.");
    }
  };

  const handleCopyLink = () => {
    playTapSound();
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = (code: string, id: string) => {
    playTapSound();
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg">Pasang Aplikasi ke Android</h3>
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  PWA & APK
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Gunakan aplikasi {appName} di HP Android tanpa kuota berlebih & mode fullscreen
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('pwa');
            }}
            className={`flex-1 py-3 px-4 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'pwa'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>1. Pasang Langsung di HP (PWA WebAPK)</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('apk');
            }}
            className={`flex-1 py-3 px-4 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>2. Build File .APK Standalone</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700 text-xs sm:text-sm">
          {/* TAB 1: PWA Direct Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-5">
              {/* Primary Action Button */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50/50 p-5 rounded-3xl border border-emerald-200 space-y-3.5 text-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Teknologi WebAPK (Ringan & Cepat)</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-slate-900">
                    Pasang {appName} di Layar HP Anda
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Aplikasi akan terpasang di menu HP Android seperti aplikasi Play Store, lengkap dengan ikon, splash screen, dan mode fullscreen.
                  </p>
                </div>

                <div className="pt-1 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-emerald-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalled ? 'Aplikasi Sudah Terpasang' : 'Pasang Sekarang ke Android'}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link App'}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Visual Guide */}
              <div className="space-y-3">
                <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                  Panduan Pasang Manual di HP Android (Chrome / Samsung Browser):
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h6 className="font-extrabold text-slate-900 text-xs">Buka di Chrome HP</h6>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Buka link website aplikasi di browser Google Chrome pada HP Android Anda.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <h6 className="font-extrabold text-slate-900 text-xs">Ketuk Titik Tiga (⋮)</h6>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Ketuk menu <strong>titik tiga (⋮)</strong> di sudut kanan atas browser Chrome.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h6 className="font-extrabold text-slate-900 text-xs">Pilih "Instal Aplikasi"</h6>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Pilih <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Keunggulan PWA */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Keuntungan Memasang via PWA:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <p>✅ Ukuran sangat ringan (&lt; 2 MB)</p>
                  <p>✅ Update otomatis tanpa download ulang APK</p>
                  <p>✅ Tampilan fullscreen murni seperti aplikasi native</p>
                  <p>✅ Mendukung offline cache & database Firestore</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Standalone APK Build */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span>Ingin Membagikan File Mentah .APK (Offline Installer)?</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Anda dapat mengonversi project ini menjadi file <strong>.APK siap install</strong> atau file <strong>.AAB untuk Google Play Store</strong> menggunakan beberapa metode mudah di bawah:
                </p>
              </div>

              {/* Method A: PWABuilder (Paling Mudah, Tanpa Coding) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                      Metode 1
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      PWABuilder (Otomatis Jadi APK Online)
                    </h5>
                  </div>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 hover:text-emerald-900"
                  >
                    <span>Buka PWABuilder</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  1. Buka <strong>www.pwabuilder.com</strong> di laptop/komputer.<br />
                  2. Masukkan link URL aplikasi ini: <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">{currentUrl}</code><br />
                  3. Klik tombol <strong>"Build Android Package"</strong> dan download file APK siap pakai!
                </p>
              </div>

              {/* Method B: Capacitor Native Bridge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-600 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                      Metode 2
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-900">
                      Capacitor / Android Studio (Full Native APK)
                    </h5>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Export project ini ke ZIP (melalui menu Pengaturan AI Studio &gt; Export ZIP), lalu jalankan perintah berikut di komputer Anda:
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[10px] flex items-center justify-between gap-2 overflow-x-auto">
                  <code>npm install @capacitor/core @capacitor/cli @capacitor/android && npx cap init && npx cap add android</code>
                  <button
                    onClick={() => handleCopyCode('npm install @capacitor/core @capacitor/cli @capacitor/android && npx cap init && npx cap add android', 'cap')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg shrink-0 cursor-pointer"
                  >
                    {copiedCode === 'cap' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Smartphone className="w-4 h-4 text-emerald-700" />
            <span>Kompatibel untuk semua HP Android (Samsung, Xiaomi, Oppo, Vivo, Realme, dll.)</span>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
