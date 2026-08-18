import React, { useState } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Building2, 
  ArrowUpRight,
  Receipt,
  Share2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TagihanItem, StudentProfile } from '../../types';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface KeuanganTabProps {
  student: StudentProfile;
  tagihanList: TagihanItem[];
  onPayBill: (billId: string, paymentMethod: string) => void;
}

export const KeuanganTab: React.FC<KeuanganTabProps> = ({
  student,
  tagihanList,
  onPayBill,
}) => {
  const [selectedBillToPay, setSelectedBillToPay] = useState<TagihanItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bsi' | 'muamalat'>('qris');
  const [isCopiedVA, setIsCopiedVA] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<TagihanItem | null>(null);

  const totalBelumBayar = tagihanList
    .filter((t) => t.status !== 'lunas')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleOpenPayment = (bill: TagihanItem) => {
    playTapSound();
    setSelectedBillToPay(bill);
  };

  const handleConfirmSimulatedPayment = () => {
    if (!selectedBillToPay) return;
    playSuccessSound();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.5 }
    });
    
    const methodName =
      paymentMethod === 'qris'
        ? 'QRIS Nasional (Instant Settlement)'
        : paymentMethod === 'bsi'
        ? 'BSI Virtual Account 988241890'
        : 'Bank Muamalat VA';

    onPayBill(selectedBillToPay.id, methodName);
    
    // Open receipt immediately
    setActiveReceipt({
      ...selectedBillToPay,
      status: 'lunas',
      metodePembayaran: methodName,
      tanggalBayar: '18 Agustus 2026, ' + new Date().toLocaleTimeString('id-ID'),
      idTransaksi: 'TRX-MDR-' + Math.floor(10000000 + Math.random() * 90000000)
    });

    setSelectedBillToPay(null);
  };

  const copyVirtualAccount = (text: string) => {
    playTapSound();
    navigator.clipboard.writeText(text);
    setIsCopiedVA(true);
    setTimeout(() => setIsCopiedVA(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 p-4 pb-8 bg-slate-50">
      {/* Keuangan Summary Card */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 p-4 border border-emerald-500/40 shadow-md text-white relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-emerald-100 font-medium">Portal Keuangan & Infaq</span>
          <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            Kassier Digital MTs
          </span>
        </div>

        <div className="text-2xl font-extrabold font-mono tracking-tight text-white mb-1">
          {formatRupiah(totalBelumBayar)}
        </div>
        <p className="text-xs text-emerald-100">
          {totalBelumBayar === 0 ? 'Semua tagihan lunas. Jazakumullah khair!' : 'Total tagihan aktif yang perlu diselesaikan'}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 text-xs">
          <div>
            <span className="text-[10px] text-emerald-200 font-medium">Nama Santri:</span>
            <div className="font-bold text-white truncate">{student.name}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-200 font-medium">NISN / VA:</span>
            <div className="font-mono font-bold text-amber-300">{student.nisn}</div>
          </div>
        </div>
      </div>

      {/* Bill List */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rincian Tagihan & SPP
          </span>
          <span className="text-xs text-slate-500 font-medium">{tagihanList.length} Tagihan Terdata</span>
        </div>

        {tagihanList.map((bill) => {
          const isPaid = bill.status === 'lunas';

          return (
            <div
              key={bill.id}
              className={`p-4 rounded-3xl border transition-all shadow-xs ${
                isPaid
                  ? 'bg-white border-slate-200/60 opacity-90'
                  : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isPaid ? 'Lunas' : 'Belum Dibayar'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1">{bill.judul}</h4>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold font-mono text-emerald-700">
                    {formatRupiah(bill.nominal)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Tempo: {bill.jatuhTempo}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Periode: {bill.bulan}</span>

                {isPaid ? (
                  <button
                    onClick={() => {
                      playTapSound();
                      setActiveReceipt(bill);
                    }}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Lihat Kuitansi</span>
                  </button>
                ) : (
                  <button
                    id={`btn-pay-bill-${bill.id}`}
                    onClick={() => handleOpenPayment(bill)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Bayar Sekarang</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL BAYAR SPP DENGAN QRIS / VA ================= */}
      {selectedBillToPay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedBillToPay(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pembayaran Tagihan</h3>
                <span className="text-[10px] text-slate-500">Madrasah Payment Gateway</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4">
              <div className="text-[11px] text-slate-500 font-medium">{selectedBillToPay.judul}</div>
              <div className="text-lg font-extrabold font-mono text-emerald-700 mt-0.5">
                {formatRupiah(selectedBillToPay.nominal)}
              </div>
            </div>

            {/* Method Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <button
                onClick={() => {
                  playTapSound();
                  setPaymentMethod('qris');
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                  paymentMethod === 'qris'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>QRIS Instant</span>
              </button>

              <button
                onClick={() => {
                  playTapSound();
                  setPaymentMethod('bsi');
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                  paymentMethod === 'bsi'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>BSI VA</span>
              </button>

              <button
                onClick={() => {
                  playTapSound();
                  setPaymentMethod('muamalat');
                }}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 font-bold transition-all ${
                  paymentMethod === 'muamalat'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Muamalat</span>
              </button>
            </div>

            {/* QRIS Display */}
            {paymentMethod === 'qris' ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center text-slate-900 shadow-inner mb-4 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-rose-600">QRIS</span>
                  <span className="text-[9px] font-bold text-slate-500">GPN • Standar BI</span>
                </div>

                {/* Simulated High-Res QR Code Graphic */}
                <div className="w-40 h-40 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center relative shadow-xs">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                            ? 'bg-slate-900'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                      AL-IKHLAS
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-slate-600 mt-2">
                  Buka GoPay, OVO, ShopeePay, DANA, atau Mobile Banking Syariah
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-4 text-xs">
                <span className="text-[10px] text-slate-500 font-medium block mb-1">Nomor Virtual Account Syariah:</span>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-mono text-sm font-bold text-emerald-800 tracking-wider">
                    9882418902026
                  </span>
                  <button
                    onClick={() => copyVirtualAccount('9882418902026')}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-xs font-bold"
                  >
                    {isCopiedVA ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedVA ? 'Disalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="mt-2 text-[10px] text-slate-600">
                  Nama Rekening: <span className="text-slate-900 font-bold">MTs Al-Ikhlas - {student.name}</span>
                </div>
              </div>
            )}

            {/* Simulated Payment Action */}
            <button
              id="btn-simulate-confirm-payment"
              onClick={handleConfirmSimulatedPayment}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulasikan Pembayaran Berhasil</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL KUITANSI RESMI ================= */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-2xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">BUKTI PEMBAYARAN DIGITAL</h3>
              <p className="text-[10px] text-slate-500 font-medium">Kemenag RI • MTs Al-Ikhlas Unggulan Kendal</p>
            </div>

            <div className="py-4 space-y-2 text-xs border-b border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Transaksi:</span>
                <span className="font-mono font-bold text-slate-800">{activeReceipt.idTransaksi || 'TRX-88219401'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Santri:</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NISN / Kelas:</span>
                <span className="font-medium text-slate-700">{student.nisn} ({student.level})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rincian:</span>
                <span className="font-bold text-slate-800">{activeReceipt.judul}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Bayar:</span>
                <span className="text-slate-700 font-medium">{activeReceipt.tanggalBayar || '18 Agustus 2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode:</span>
                <span className="text-emerald-700 font-bold">{activeReceipt.metodePembayaran || 'QRIS'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold">
                <span className="text-slate-800">Total Bayar:</span>
                <span className="text-emerald-700 font-mono font-extrabold">{formatRupiah(activeReceipt.nominal)}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  playTapSound();
                  alert('Kuitansi berhasil diunduh sebagai PDF digital.');
                  setActiveReceipt(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </button>
              <button
                onClick={() => {
                  playTapSound();
                  alert('Kuitansi siap dibagikan via WhatsApp Wali Murid.');
                }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                title="Bagikan"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
