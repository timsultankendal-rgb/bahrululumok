import React from 'react';
import { X, Download, Share2, ShieldCheck, CheckCircle2, Building2, Printer } from 'lucide-react';
import { TabunganSantri, RiwayatTabunganItem } from '../../types';
import { playTapSound } from '../../utils/audio';

interface KuitansiTabunganModalProps {
  santri: TabunganSantri;
  transaksi: RiwayatTabunganItem;
  onClose: () => void;
}

export const KuitansiTabunganModal: React.FC<KuitansiTabunganModalProps> = ({
  santri,
  transaksi,
  onClose,
}) => {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const terbilang = (angka: number): string => {
    const bilangan = [
      '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
    ];
    let hasil = '';
    if (angka < 12) {
      hasil = ' ' + bilangan[angka];
    } else if (angka < 20) {
      hasil = terbilang(angka - 10) + ' Belas';
    } else if (angka < 100) {
      hasil = terbilang(Math.floor(angka / 10)) + ' Puluh' + terbilang(angka % 10);
    } else if (angka < 200) {
      hasil = ' Seratus' + terbilang(angka - 100);
    } else if (angka < 1000) {
      hasil = terbilang(Math.floor(angka / 100)) + ' Ratus' + terbilang(angka % 100);
    } else if (angka < 2000) {
      hasil = ' Seribu' + terbilang(angka - 1000);
    } else if (angka < 1000000) {
      hasil = terbilang(Math.floor(angka / 1000)) + ' Ribu' + terbilang(angka % 1000);
    } else if (angka < 1000000000) {
      hasil = terbilang(Math.floor(angka / 1000000)) + ' Juta' + terbilang(angka % 1000000);
    }
    return hasil.trim() + ' Rupiah';
  };

  const handleShareWhatsApp = () => {
    playTapSound();
    const pesan = `*BUKTI TRANSAKSI TABUNGAN SANTRI*\n` +
      `MDT Ula NU 09 Bahrul Ulum Kendal\n\n` +
      `No. Kuitansi : ${transaksi.idKuitansi || transaksi.id}\n` +
      `Nama Santri  : ${santri.nama} (${santri.kelas})\n` +
      `No. Rekening : ${santri.noRekening || santri.noInduk}\n` +
      `Jenis        : ${transaksi.jenis === 'Setor' ? '🟢 SETORAN TUNAI (+)' : '🔴 PENARIKAN TUNAI (-)'}\n` +
      `Nominal      : ${formatRupiah(transaksi.nominal)}\n` +
      `Saldo Akhir  : ${formatRupiah(transaksi.saldoSesudah ?? santri.jumlahTabungan)}\n` +
      `Waktu        : ${transaksi.tanggal} ${transaksi.waktu || ''}\n` +
      `Keterangan   : ${transaksi.keterangan}\n` +
      `Petugas/Kasir: ${transaksi.petugas || 'Admin Kopas'}\n\n` +
      `_Syukron Jazakumullah Khairan Katsira._`;

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-auto border border-emerald-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Bukti */}
        <div className="text-center pb-3 border-b border-slate-100">
          <div className="w-11 h-11 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-black text-sm tracking-tight text-slate-900 uppercase">
            KUITANSI TRANSAKSI TABUNGAN SANTRI
          </h3>
          <p className="text-[10px] text-emerald-700 font-bold">
            KOPAS & BENDAHARA MADRASAH AL-IKHLAS KENDAL
          </p>
          <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {transaksi.idKuitansi || `KWT-${transaksi.id.toUpperCase()}`}
          </div>
        </div>

        {/* Jenis Badge & Nominal Besar */}
        <div className="my-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-emerald-100/80 text-center">
          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 ${
            transaksi.jenis === 'Setor' 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : 'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            <CheckCircle2 className="w-3 h-3" />
            {transaksi.jenis === 'Setor' ? 'SETORAN TUNAI TABUNGAN' : 'PENARIKAN TUNAI TABUNGAN'}
          </span>
          <div className={`text-2xl font-black font-mono tracking-tight ${
            transaksi.jenis === 'Setor' ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {transaksi.jenis === 'Setor' ? '+' : '-'} {formatRupiah(transaksi.nominal)}
          </div>
          <p className="text-[10px] text-slate-500 italic mt-0.5">
            "{terbilang(transaksi.nominal)}"
          </p>
        </div>

        {/* Rincian Transaksi */}
        <div className="space-y-2 text-xs py-2 border-y border-slate-100 text-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Nama Santri</span>
            <span className="font-extrabold text-slate-900 text-right">{santri.nama}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">No. Rekening / Induk</span>
            <span className="font-mono font-bold text-slate-800">{santri.noRekening || santri.noInduk}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Kelas / Program</span>
            <span className="font-medium text-slate-800">{santri.kelas} • {santri.programTabungan || 'Reguler'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Kategori & Keterangan</span>
            <span className="font-semibold text-slate-800 text-right max-w-[200px] truncate">{transaksi.kategori ? `[${transaksi.kategori}] ` : ''}{transaksi.keterangan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Waktu Transaksi</span>
            <span className="text-slate-700 font-mono">{transaksi.tanggal} {transaksi.waktu ? `• ${transaksi.waktu}` : ''}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Penyetor / Penarik</span>
            <span className="font-semibold text-slate-800">{transaksi.pembayarPenarik || santri.nama}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Petugas Kasir</span>
            <span className="font-bold text-emerald-800">{transaksi.petugas || 'Ustzh. Nur Laili'}</span>
          </div>

          {/* Mutasi Saldo */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 mt-2 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Saldo Sebelum:</span>
              <span className="font-mono text-slate-700">{formatRupiah(transaksi.saldoSebelum ?? (transaksi.jenis === 'Setor' ? santri.jumlahTabungan - transaksi.nominal : santri.jumlahTabungan + transaksi.nominal))}</span>
            </div>
            <div className="flex justify-between text-xs font-black pt-1 border-t border-slate-200/80">
              <span className="text-slate-800">Saldo Akhir Santri:</span>
              <span className="font-mono text-emerald-800 text-sm">{formatRupiah(transaksi.saldoSesudah ?? santri.jumlahTabungan)}</span>
            </div>
          </div>
        </div>

        {/* Stempel & Paraf */}
        <div className="flex items-center justify-between pt-3 pb-1 text-[10px] text-slate-500">
          <div className="text-center">
            <span>Penyetor / Penarik,</span>
            <div className="h-9 flex items-end justify-center font-bold text-slate-800">
              {transaksi.pembayarPenarik || santri.nama.split(' ')[0]}
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-bold">TERVALIDASI SISTEM</span>
          </div>
          <div className="text-center">
            <span>Kasir Bendahara,</span>
            <div className="h-9 flex items-end justify-center font-bold text-slate-800">
              {transaksi.petugas || 'KOPAS MTs'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors col-span-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kirim WhatsApp Wali</span>
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            title="Cetak Kuitansi"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
