import React, { useState } from 'react';
import { BookOpen, X, CheckCircle2, Mic, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TahfidzRecord } from '../../types';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface SetoranTahfidzModalProps {
  onClose: () => void;
  onAddRecord: (record: TahfidzRecord) => void;
}

export const SetoranTahfidzModal: React.FC<SetoranTahfidzModalProps> = ({
  onClose,
  onAddRecord,
}) => {
  const [surat, setSurat] = useState<string>("An-Naba'");
  const [ayat, setAyat] = useState<string>('Ayat 21 - 40');
  const [juz, setJuz] = useState<number>(30);
  const [kategori, setKategori] = useState<'Ziyadah (Hafalan Baru)' | 'Murajaah (Ulang Hafalan)'>('Ziyadah (Hafalan Baru)');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();

    const newRecord: TahfidzRecord = {
      id: 'thf-' + Date.now(),
      tanggal: '18 Agustus 2026',
      surat,
      ayat,
      juz,
      kategori,
      nilai: 'Mumtaz (A)',
      ustadz: 'Ustadz Hafidz Al-Mukarram',
      catatan: 'Hafalan lancar, makhorijul huruf tartil dan fasih.'
    };

    onAddRecord(newRecord);
    playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">Buku Kendali Tahfidz</h3>
            <span className="text-[10px] text-slate-500 font-medium">Form Setoran Hafalan Baru / Murajaah</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="text-slate-700 block mb-1 font-bold">Jenis Setoran</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  setKategori('Ziyadah (Hafalan Baru)');
                }}
                className={`p-2 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  kategori === 'Ziyadah (Hafalan Baru)'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Ziyadah (Baru)
              </button>
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  setKategori('Murajaah (Ulang Hafalan)');
                }}
                className={`p-2 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                  kategori === 'Murajaah (Ulang Hafalan)'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                Murajaah (Ulang)
              </button>
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1 font-bold">Nama Surat & Juz</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={surat}
                onChange={(e) => setSurat(e.target.value)}
                placeholder="Contoh: An-Naba'"
                className="col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
                required
              />
              <input
                type="number"
                value={juz}
                onChange={(e) => setJuz(Number(e.target.value))}
                placeholder="Juz"
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 text-center focus:outline-none focus:border-emerald-500 shadow-2xs font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 block mb-1 font-bold">Rentang Ayat</label>
            <input
              type="text"
              value={ayat}
              onChange={(e) => setAyat(e.target.value)}
              placeholder="Contoh: Ayat 1 - 20"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
              required
            />
          </div>

          {/* Voice Record Test Preview */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  setIsRecording(!isRecording);
                }}
                className={`p-2 rounded-xl text-white transition-all cursor-pointer ${
                  isRecording ? 'bg-rose-600 animate-pulse' : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <div>
                <span className="font-bold block text-[11px] text-slate-800">
                  {isRecording ? 'Merekam Audio Santri...' : 'Rekaman Hafalan Mandiri'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isRecording ? '00:15 (Perekaman Aktif)' : 'Opsional (Verifikasi Tartil)'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-tahfidz-form"
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Setoran Hafalan</span>
          </button>
        </form>
      </div>
    </div>
  );
};
