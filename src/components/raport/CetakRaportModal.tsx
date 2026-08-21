import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Award, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  User, 
  BookOpen, 
  Star,
  FileCheck
} from 'lucide-react';
import { RaportSantri } from '../../types';
import { playTapSound } from '../../utils/audio';
import { PROFILE_MADRASAH_DATA, KONTAK_REKENING_DATA } from '../../data/madrasahCompleteData';
import { DEFAULT_BRANDING, AppBrandingConfig } from '../modals/AppBrandingModal';
import { subscribeMenuRecords } from '../../services/firestoreService';

const STORAGE_KEY_PROFILE = 'madrasah_profile_data_v2';
const STORAGE_KEY_BRANDING = 'madrasah_app_branding_v2';
const STORAGE_KEY_KONTAK = 'madrasah_kontak_rekening_data_v2';

interface CetakRaportModalProps {
  raport: RaportSantri;
  onClose: () => void;
}

export const CetakRaportModal: React.FC<CetakRaportModalProps> = ({ raport, onClose }) => {
  // 1. Madrasah Profile state (with local storage & firestore fallback)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {}
    return PROFILE_MADRASAH_DATA;
  });

  // 2. App Branding / Logo state
  const [branding, setBranding] = useState<AppBrandingConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BRANDING);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BRANDING;
  });

  // 3. Kontak & Info state
  const [kontakData, setKontakData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KONTAK);
      if (saved) return JSON.parse(saved);
    } catch {}
    return KONTAK_REKENING_DATA;
  });

  // Subscribe to real-time Cloud updates for Profile, Branding, and Kontak
  useEffect(() => {
    const unsubProfile = subscribeMenuRecords<typeof PROFILE_MADRASAH_DATA>('profile_madrasah', (records) => {
      if (records && records.length > 0 && records[0].payload) {
        setProfile(records[0].payload);
      }
    });

    const unsubBranding = subscribeMenuRecords<AppBrandingConfig>('app_branding', (records) => {
      if (records && records.length > 0 && records[0].payload) {
        setBranding(records[0].payload);
      }
    });

    const unsubKontak = subscribeMenuRecords<typeof KONTAK_REKENING_DATA>('kontak_rekening', (records) => {
      if (records && records.length > 0 && records[0].payload) {
        setKontakData(records[0].payload);
      }
    });

    return () => {
      unsubProfile();
      unsubBranding();
      unsubKontak();
    };
  }, []);

  const handlePrint = () => {
    playTapSound();
    window.print();
  };

  const namaMadrasah = profile.namaLembaga || branding.institutionName || 'Madrasah Diniyah Takmiliyah Al-Ikhlas';
  const yayasanNaungan = profile.naungan || 'Yayasan Pendidikan Islam Al-Ikhlas Kendal';
  const alamatMadrasah = profile.alamat || kontakData.alamatLengkap;
  const kepalaMadrasah = profile.kepalaMadrasah || raport.namaKepalaMadrasah || 'KH. Abdullah Syukri, Lc., M.A.';
  const primaryPhone = kontakData.kontak?.[0]?.noTelp || '(0294) 381234';
  const hotlineWA = kontakData.kontak?.[1]?.noTelp || '';

  const handleShareWhatsApp = () => {
    playTapSound();
    const text = `*LAPORAN HASIL BELAJAR SANTRI (E-RAPORT)*
*${namaMadrasah.toUpperCase()}*
_${yayasanNaungan}_
=================================
👤 *Nama Santri:* ${raport.nama}
📌 *No. Induk / NIS:* ${raport.noInduk}
🏫 *Kelas / Cawu:* ${raport.kelas} • ${raport.cawu}
📅 *Tahun Ajaran:* ${raport.tahunAjaran}
🏆 *Peringkat Kelas:* Ke-${raport.peringkat} dari ${raport.totalSiswa || 32} santri
📊 *Rata-Rata Nilai:* ${raport.rataRata} (Total: ${raport.totalNilai})
---------------------------------
📖 *Ringkasan Nilai 11 Mapel Diniyah:*
${raport.nilaiList.map((n, i) => `${i + 1}. ${n.namaMapel}: *${n.nilaiAngka}* (${n.predikat})`).join('\n')}
---------------------------------
⭐ *Tahfidz Al-Qur'an:* ${raport.hafalanJuz || '-'}
🌟 *Sikap & Akhlak:* ${raport.sikapDanAkhlak || 'Sangat Baik (A)'}
📝 *Catatan Wali Kelas:* "${raport.catatanGuru}"
---------------------------------
✨ *Keputusan:* ${raport.keputusan || 'Tuntas dan Naik Tingkat'}

🏛️ *Kepala Madrasah:* ${kepalaMadrasah}
📍 *Alamat:* ${alamatMadrasah}
_Dokumen resmi e-Raport ${branding.appName || 'MadrasahKu'} Mobile Cloud System_`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Container Dialog */}
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col border border-slate-200 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Header Action Bar (Hidden on Print) */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Pratinjau Cetak E-Raport Resmi</h3>
              <p className="text-[11px] text-slate-400">Format Kemenag RI & LP Ma'arif NU (Standar A4 / Folio)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kirim WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Raport</span>
            </button>
            <button
              onClick={() => {
                playTapSound();
                onClose();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-4 sm:p-8 space-y-6 text-slate-900 bg-white print:p-6" id="printable-raport-doc">
          
          {/* 1. KOP SURAT MADRASAH RESMI */}
          <div className="text-center border-b-4 border-double border-slate-900 pb-3 relative">
            <div className="flex items-center justify-between mb-2">
              {/* Left Logo / Lambang Madrasah */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={namaMadrasah}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl border border-slate-200 p-1 bg-white shadow-2xs"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-800 text-amber-300 font-bold flex flex-col items-center justify-center p-1 border-2 border-amber-400 shadow-xs">
                    <span className="text-[9px] font-extrabold uppercase leading-tight text-center">LP MA'ARIF NU</span>
                    <span className="text-xl sm:text-2xl font-black">★</span>
                    <span className="text-[8px] font-bold text-center">KENDAL</span>
                  </div>
                )}
              </div>

              {/* Center Madrasah Identity */}
              <div className="flex-1 px-3 text-center">
                <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950 tracking-wider uppercase">
                  {yayasanNaungan}
                </h4>
                <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                  {namaMadrasah}
                </h2>
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 mt-0.5">
                  {profile.akreditasi ? `${profile.akreditasi} • ` : ''}
                  {profile.nomorStatistikMadrasah ? `${profile.nomorStatistikMadrasah} • ` : ''}
                  {profile.npsn || 'NPSN : 69987654'}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                  {alamatMadrasah}
                  {primaryPhone ? ` | Telp: ${primaryPhone}` : ''}
                  {hotlineWA ? ` | Hotline: ${hotlineWA}` : ''}
                </p>
              </div>

              {/* Right Logo / Lambang Kemenag RI */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-900 text-white font-bold flex flex-col items-center justify-center p-1 border-2 border-emerald-600 shadow-xs">
                  <span className="text-[9px] font-extrabold uppercase leading-tight text-center text-amber-300">
                    {branding.kemenagText || 'KEMENAG RI'}
                  </span>
                  <span className="text-lg font-black">📖</span>
                  <span className="text-[8px] font-bold text-center text-teal-200">
                    {profile.akreditasi ? 'TERAKREDITASI' : 'DINIYAH'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. JUDUL RAPOR & IDENTITAS SANTRI */}
          <div>
            <div className="text-center my-3">
              <h3 className="text-sm sm:text-base font-black uppercase text-slate-900 tracking-wide underline underline-offset-4">
                LAPORAN HASIL BELAJAR SANTRI (E-RAPORT)
              </h3>
              <p className="text-xs font-extrabold text-emerald-800 uppercase mt-1">
                {raport.cawu} • TAHUN AJARAN {raport.tahunAjaran}
              </p>
            </div>

            {/* Identitas Peserta Didik Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex">
                <span className="w-32 font-bold text-slate-600">Nama Santri</span>
                <span className="font-bold text-slate-900">: {raport.nama}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-600">Tingkat / Kelas</span>
                <span className="font-bold text-slate-900">: {raport.kelas}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-600">No. Induk (NIS)</span>
                <span className="font-bold text-slate-900">: {raport.noInduk}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-600">Periode Evaluasi</span>
                <span className="font-bold text-slate-900">: {raport.cawu} (Caturwulan)</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-600">NISN</span>
                <span className="font-bold text-slate-900">: {raport.nisn || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-bold text-slate-600">Tahun Pembelajaran</span>
                <span className="font-bold text-slate-900">: {raport.tahunAjaran}</span>
              </div>
            </div>
          </div>

          {/* 3. TABEL NILAI 11 MATA PELAJARAN */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
                <span>A. NILAI PRESTASI MATA PELAJARAN DINIYAH SALAFIYAH</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-500">Skala Nilai: 0 - 100</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-extrabold text-[11px] border-b border-slate-300">
                    <th className="py-2.5 px-2 text-center w-10 border-r border-slate-300">No</th>
                    <th className="py-2.5 px-3 border-r border-slate-300">Mata Pelajaran (Kitab Rujukan)</th>
                    <th className="py-2.5 px-2 text-center w-14 border-r border-slate-300">KKM</th>
                    <th className="py-2.5 px-2 text-center w-16 border-r border-slate-300">Angka</th>
                    <th className="py-2.5 px-3 text-center w-36 border-r border-slate-300">Terbilang (Huruf)</th>
                    <th className="py-2.5 px-2 text-center w-28 border-r border-slate-300">Predikat</th>
                    <th className="py-2.5 px-3">Keterangan Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {raport.nilaiList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-2 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                        {item.namaMapel}
                        {item.kitab && <span className="block text-[10px] font-normal text-slate-500 italic">({item.kitab})</span>}
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-semibold text-slate-600 border-r border-slate-200">{item.kkm}</td>
                      <td className="py-2 px-2 text-center font-mono font-black text-slate-900 border-r border-slate-200">
                        {item.nilaiAngka}
                      </td>
                      <td className="py-2 px-3 text-center font-medium italic text-slate-700 border-r border-slate-200 text-[11px]">
                        {item.nilaiHuruf}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-[11px] text-emerald-800 border-r border-slate-200">
                        {item.predikat}
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-[11px]">
                        {item.keterangan}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100/90 font-extrabold text-slate-900 border-t-2 border-slate-300">
                    <td colSpan={3} className="py-2.5 px-3 text-right border-r border-slate-300 uppercase text-[11px]">
                      Jumlah Total Nilai
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-sm font-black border-r border-slate-300 text-emerald-900">
                      {raport.totalNilai}
                    </td>
                    <td colSpan={3} className="py-2.5 px-3 text-[11px] text-slate-600 font-semibold">
                      Terbilang: <em>{raport.totalNilai} Poin Prestasi</em>
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-extrabold text-slate-900 border-t border-slate-200">
                    <td colSpan={3} className="py-2.5 px-3 text-right border-r border-slate-300 uppercase text-[11px] text-emerald-900">
                      Nilai Rata-Rata & Peringkat
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-sm font-black border-r border-slate-300 text-emerald-900">
                      {raport.rataRata}
                    </td>
                    <td colSpan={3} className="py-2.5 px-3 text-[11px] text-emerald-950 font-bold">
                      🏆 Peringkat Kelas: <strong>Ke-{raport.peringkat}</strong> dari total <strong>{raport.totalSiswa || 32}</strong> santri
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 4. SIKAP, TAHFIDZ & KEHADIRAN (2-COLUMN GRID) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Adab & Tahfidz */}
            <div className="space-y-3 p-3.5 rounded-2xl border border-slate-300 bg-slate-50/70">
              <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>B. Sikap, Akhlak & Capaian Tahfidz</span>
              </h4>

              <div className="space-y-2">
                <div>
                  <span className="font-bold text-slate-600 block text-[11px]">Sikap & Kepribadian Santri:</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{raport.sikapDanAkhlak || 'Sangat Baik (A)'}</p>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-600 block text-[11px]">Capaian Hafalan Al-Qur'an & Doa:</span>
                  <p className="font-extrabold text-emerald-800 mt-0.5">{raport.hafalanJuz || '-'}</p>
                </div>
              </div>
            </div>

            {/* Presensi / Kehadiran */}
            <div className="space-y-3 p-3.5 rounded-2xl border border-slate-300 bg-slate-50/70">
              <h4 className="font-black text-slate-900 uppercase text-[11px] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>C. Rekapitulasi Kehadiran (Presensi)</span>
              </h4>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Sakit</span>
                  <span className="text-base font-mono font-black text-slate-800">{raport.kehadiran?.sakit ?? 0}</span>
                  <span className="text-[9px] text-slate-400 block">Hari</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Izin</span>
                  <span className="text-base font-mono font-black text-slate-800">{raport.kehadiran?.izin ?? (raport.kehadiran?.ijin ?? 0)}</span>
                  <span className="text-[9px] text-slate-400 block">Hari</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Tanpa Ket. (Alpa)</span>
                  <span className="text-base font-mono font-black text-slate-800">{raport.kehadiran?.alpa ?? (raport.kehadiran?.alpha ?? 0)}</span>
                  <span className="text-[9px] text-slate-400 block">Hari</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. CATATAN WALI KELAS & KEPUTUSAN */}
          <div className="p-3.5 rounded-2xl border border-slate-300 bg-emerald-50/60 space-y-2 text-xs">
            <h4 className="font-black text-emerald-950 uppercase text-[11px]">
              D. Catatan Wali Kelas & Keputusan Hasil Belajar
            </h4>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-slate-800 italic leading-relaxed">
              "{raport.catatanGuru}"
            </div>
            {raport.keputusan && (
              <div className="flex items-center gap-2 pt-1 text-emerald-900 font-bold text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Keputusan:</strong> {raport.keputusan}</span>
              </div>
            )}
          </div>

          {/* 6. KOLOM TANDA TANGAN RESMI TIGA PIHAK */}
          <div className="pt-4 border-t border-slate-300">
            <div className="text-right text-xs text-slate-700 font-semibold mb-6">
              Kendal, {raport.tanggalRaport || '28 November 2025'}
            </div>

            <div className="grid grid-cols-3 text-center text-xs gap-4">
              {/* Orang Tua */}
              <div className="flex flex-col justify-between h-32">
                <span className="font-bold text-slate-700">Orang Tua / Wali Santri,</span>
                <div className="border-b border-slate-400 mx-4 pb-1">
                  <span className="font-bold text-slate-800">( ........................................ )</span>
                </div>
              </div>

              {/* Wali Kelas */}
              <div className="flex flex-col justify-between h-32">
                <span className="font-bold text-slate-700">Wali Kelas {raport.kelas},</span>
                <div className="border-b border-slate-400 mx-4 pb-1">
                  <span className="font-bold text-slate-900 underline">{raport.namaWaliKelas || 'Ust. Ahmad Mufid, M.Pd.I.'}</span>
                </div>
              </div>

              {/* Kepala Madrasah & Cap Basah */}
              <div className="flex flex-col justify-between h-32 relative">
                <span className="font-bold text-slate-700">Mengetahui,<br />Kepala Madrasah Diniyah</span>
                
                {/* Visual Official Stamp Badge */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-dashed border-emerald-600/50 rounded-full flex flex-col items-center justify-center text-[7px] font-black text-emerald-800 uppercase p-1 rotate-[-12deg] pointer-events-none opacity-80 select-none">
                  <span className="truncate max-w-[85px] text-center">{namaMadrasah.slice(0, 24)}</span>
                  <span className="text-[10px] text-amber-600 leading-none my-0.5">★ ★ ★</span>
                  <span className="text-[7px]">KENDAL</span>
                </div>

                <div className="border-b border-slate-400 mx-4 pb-1">
                  <span className="font-black text-slate-900 underline">{kepalaMadrasah}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
