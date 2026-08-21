import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Building2, 
  Plus, 
  Calendar, 
  User, 
  Phone, 
  QrCode, 
  ShieldCheck,
  Receipt,
  Download
} from 'lucide-react';
import { TabunganSantri, RiwayatTabunganItem } from '../../types';
import { playTapSound } from '../../utils/audio';

interface BukuTabunganModalProps {
  santri: TabunganSantri;
  onClose: () => void;
  onOpenTransaksi?: (santri: TabunganSantri, jenis: 'Setor' | 'Tarik') => void;
  onViewKuitansi?: (santri: TabunganSantri, item: RiwayatTabunganItem) => void;
  canEdit?: boolean;
}

export const BukuTabunganModal: React.FC<BukuTabunganModalProps> = ({
  santri,
  onClose,
  onOpenTransaksi,
  onViewKuitansi,
  canEdit = true,
}) => {
  const [filterJenis, setFilterJenis] = useState<'Semua' | 'Setor' | 'Tarik'>('Semua');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const totalSetor = santri.riwayat
    .filter(r => r.jenis === 'Setor')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalTarik = santri.riwayat
    .filter(r => r.jenis === 'Tarik')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const filteredRiwayat = santri.riwayat.filter(r => {
    if (filterJenis === 'Semua') return true;
    return r.jenis === filterJenis;
  });

  const handleShareWhatsApp = () => {
    playTapSound();
    const last3 = santri.riwayat.slice(0, 3).map((r, i) => 
      `${i+1}. [${r.jenis.toUpperCase()}] ${formatRupiah(r.nominal)} (${r.tanggal}) - ${r.keterangan}`
    ).join('\n');

    const pesan = `*LAPORAN BUKU TABUNGAN SANTRI*\n` +
      `Madrasah & KOPAS Al-Ikhlas Unggulan Kendal\n\n` +
      `👤 *Nama Santri:* ${santri.nama}\n` +
      `💳 *No. Rekening:* ${santri.noRekening || santri.noInduk}\n` +
      `🏫 *Kelas / Program:* ${santri.kelas} • ${santri.programTabungan || 'Reguler'}\n` +
      `💰 *Saldo Aktif:* ${formatRupiah(santri.jumlahTabungan)}\n` +
      `📥 *Total Setor:* ${formatRupiah(totalSetor)}\n` +
      `📤 *Total Tarik:* ${formatRupiah(totalTarik)}\n\n` +
      `*Mutasi Transaksi Terakhir:*\n${last3 || 'Belum ada transaksi'}\n\n` +
      `_Pencatatan resmi terverifikasi sistem MadrasahKu Mobile._`;

    const encoded = encodeURIComponent(pesan);
    const targetWa = santri.noWaWali ? santri.noWaWali.replace(/[^0-9]/g, '') : '';
    const url = targetWa 
      ? `https://wa.me/${targetWa.startsWith('0') ? '62' + targetWa.slice(1) : targetWa}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    playTapSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 my-auto border border-emerald-500/20 overflow-hidden">
        
        {/* Header Buku Tabungan */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-md">
                  PASBOOK DIGITAL
                </span>
                <span className="text-xs text-emerald-200">KOPAS AL-IKHLAS</span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Buku Rekening Tabungan Santri
              </h2>
            </div>
          </div>

          {/* Kartu Profil Rekening Santri */}
          <div className="mt-3 p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              {santri.foto ? (
                <img 
                  src={santri.foto} 
                  alt={santri.nama} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white/40 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-700 border border-white/30 flex items-center justify-center font-black text-base text-white">
                  {santri.nama.charAt(0)}
                </div>
              )}
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-white">{santri.nama}</h3>
                <div className="text-[11px] text-emerald-100 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="font-mono bg-emerald-900/60 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                    {santri.noRekening || santri.noInduk}
                  </span>
                  <span>• {santri.kelas}</span>
                  <span>• {santri.programTabungan || 'Reguler/Saku'}</span>
                </div>
                {santri.namaWali && (
                  <div className="text-[10px] text-emerald-200">
                    Wali: {santri.namaWali} {santri.noWaWali ? `(${santri.noWaWali})` : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Saldo Aktif Besar */}
            <div className="bg-emerald-950/70 p-2.5 px-3.5 rounded-xl border border-emerald-400/30 text-right">
              <span className="text-[10px] font-bold text-emerald-300 block uppercase">Saldo Aktif Simpanan</span>
              <span className="text-lg sm:text-xl font-black font-mono text-amber-300">
                {formatRupiah(santri.jumlahTabungan)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar & Summary Bar */}
        <div className="p-3 sm:px-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="text-xs">
              <span className="text-slate-500">Total Masuk: </span>
              <strong className="text-emerald-700 font-mono">+{formatRupiah(totalSetor)}</strong>
            </div>
            <span className="text-slate-300">|</span>
            <div className="text-xs">
              <span className="text-slate-500">Total Keluar: </span>
              <strong className="text-rose-700 font-mono">-{formatRupiah(totalTarik)}</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {canEdit && onOpenTransaksi && (
              <>
                <button
                  onClick={() => {
                    playTapSound();
                    onOpenTransaksi(santri, 'Setor');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Setor Tunai</span>
                </button>
                <button
                  onClick={() => {
                    playTapSound();
                    onOpenTransaksi(santri, 'Tarik');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Tarik Tunai</span>
                </button>
              </>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="p-1.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Kirim ke WhatsApp Wali"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 px-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Cetak Buku Tabungan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Filter Tab & Mutasi List */}
        <div className="p-3 sm:p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Daftar Riwayat Mutasi Rekening ({santri.riwayat.length})
            </span>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-[11px] font-bold">
              {(['Semua', 'Setor', 'Tarik'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    playTapSound();
                    setFilterJenis(mode);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    filterJenis === mode 
                      ? 'bg-white text-emerald-800 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {filteredRiwayat.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              Belum ada mutasi transaksi untuk filter ini.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRiwayat.map((rw, idx) => (
                <div
                  key={rw.id || idx}
                  className="p-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      rw.jenis === 'Setor' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {rw.jenis === 'Setor' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">{rw.keterangan}</span>
                        {rw.kategori && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {rw.kategori}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex flex-wrap items-center gap-x-2">
                        <span>{rw.tanggal} {rw.waktu ? `• ${rw.waktu}` : ''}</span>
                        <span>• Petugas: {rw.petugas || 'Admin'}</span>
                        {rw.pembayarPenarik && <span>• Oleh: {rw.pembayarPenarik}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className={`font-black font-mono text-sm ${
                        rw.jenis === 'Setor' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {rw.jenis === 'Setor' ? '+' : '-'} {formatRupiah(rw.nominal)}
                      </div>
                      {rw.saldoSesudah !== undefined && (
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Saldo: {formatRupiah(rw.saldoSesudah)}
                        </span>
                      )}
                    </div>

                    {onViewKuitansi && (
                      <button
                        onClick={() => {
                          playTapSound();
                          onViewKuitansi(santri, rw);
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-slate-200 transition-colors"
                        title="Lihat Kuitansi"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Kuitansi</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terhubung Cloud Firestore MTs Al-Ikhlas</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
