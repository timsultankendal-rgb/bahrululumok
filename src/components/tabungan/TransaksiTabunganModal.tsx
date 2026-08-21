import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Tag, 
  FileText, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { TabunganSantri, RiwayatTabunganItem } from '../../types';
import { playTapSound } from '../../utils/audio';

interface TransaksiTabunganModalProps {
  santriList: TabunganSantri[];
  initialSantri?: TabunganSantri | null;
  initialJenis?: 'Setor' | 'Tarik';
  currentUser?: { fullName?: string; username?: string; role?: string } | null;
  onClose: () => void;
  onSave: (santriId: string, item: RiwayatTabunganItem) => void;
}

const QUICK_NOMINALS = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];

const KATEGORI_OPTIONS = [
  'Uang Saku Mingguan',
  'Kitab & ATK KOPAS',
  'Seragam & Perlengkapan',
  'Tabungan Qurban',
  'Haflah & Wisuda',
  'Kesehatan / Poskestren',
  'Uang Saku Bulanan',
  'Keperluan Pribadi',
  'Lain-lain'
];

export const TransaksiTabunganModal: React.FC<TransaksiTabunganModalProps> = ({
  santriList,
  initialSantri,
  initialJenis = 'Setor',
  currentUser,
  onClose,
  onSave,
}) => {
  const [selectedSantriId, setSelectedSantriId] = useState<string>(
    initialSantri?.id || (santriList[0]?.id ?? '')
  );
  const [jenis, setJenis] = useState<'Setor' | 'Tarik'>(initialJenis);
  const [nominal, setNominal] = useState<number>(50000);
  const [kategori, setKategori] = useState<string>('Uang Saku Mingguan');
  const [keterangan, setKeterangan] = useState<string>('Setoran uang saku rutin');
  const [pembayarPenarik, setPembayarPenarik] = useState<string>(
    initialSantri?.nama || ''
  );
  const [petugas, setPetugas] = useState<string>(
    currentUser?.fullName || 'Ustzh. Nur Laili'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedSantri = santriList.find(s => s.id === selectedSantriId) || santriList[0];
  const saldoSaatIni = selectedSantri ? selectedSantri.jumlahTabungan : 0;
  const saldoSetelah = jenis === 'Setor' ? saldoSaatIni + nominal : saldoSaatIni - nominal;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleNominalChange = (val: number) => {
    setNominal(val);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) {
      setErrorMsg('Pilih santri terlebih dahulu.');
      return;
    }
    if (nominal <= 0) {
      setErrorMsg('Nominal transaksi harus lebih dari Rp 0.');
      return;
    }
    if (jenis === 'Tarik' && nominal > saldoSaatIni) {
      setErrorMsg(`Saldo tidak mencukupi! Saldo saat ini hanya ${formatRupiah(saldoSaatIni)}.`);
      return;
    }

    playTapSound();
    const now = new Date();
    const tanggalStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const waktuStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const timestamp = Date.now().toString().slice(-6);

    const newTransaksi: RiwayatTabunganItem = {
      id: `rw_${Date.now()}`,
      tanggal: tanggalStr,
      waktu: waktuStr,
      jenis: jenis,
      nominal: nominal,
      saldoSebelum: saldoSaatIni,
      saldoSesudah: saldoSetelah,
      kategori: kategori,
      keterangan: keterangan || (jenis === 'Setor' ? 'Setoran Tabungan Santri' : 'Penarikan Tabungan Santri'),
      petugas: petugas || 'Ustzh. Nur Laili',
      pembayarPenarik: pembayarPenarik || selectedSantri.nama,
      idKuitansi: `KWT-${jenis === 'Setor' ? 'STR' : 'TRK'}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${timestamp}`,
    };

    onSave(selectedSantri.id, newTransaksi);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-auto border border-emerald-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs ${
            jenis === 'Setor' ? 'bg-emerald-600' : 'bg-rose-600'
          }`}>
            {jenis === 'Setor' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              {jenis === 'Setor' ? 'Setor Tunai Tabungan Santri' : 'Tarik Tunai Tabungan Santri'}
            </h3>
            <p className="text-xs text-slate-500">
              Pencatatan kas masuk/keluar tabungan terhubung Cloud Firestore
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Switch Jenis Transaksi */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                playTapSound();
                setJenis('Setor');
                setKeterangan('Setoran uang saku rutin');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                jenis === 'Setor'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>SETOR TUNAI (+)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playTapSound();
                setJenis('Tarik');
                setKeterangan('Penarikan uang saku / keperluan');
                setErrorMsg(null);
              }}
              className={`py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                jenis === 'Tarik'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>TARIK TUNAI (-)</span>
            </button>
          </div>

          {/* Pilih Santri */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              Rekening Santri
            </label>
            <select
              value={selectedSantriId}
              onChange={(e) => {
                setSelectedSantriId(e.target.value);
                const s = santriList.find(item => item.id === e.target.value);
                if (s) setPembayarPenarik(s.nama);
                setErrorMsg(null);
              }}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            >
              {santriList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.kelas}) • {s.noRekening || s.noInduk} • Saldo: {formatRupiah(s.jumlahTabungan)}
                </option>
              ))}
            </select>
          </div>

          {/* Kartu Pratinjau Saldo Sebelum & Sesudah */}
          {selectedSantri && (
            <div className="p-3.5 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl border border-emerald-200/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Saldo Saat Ini</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {formatRupiah(saldoSaatIni)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">
                  {jenis === 'Setor' ? 'Saldo Setelah Setor' : 'Saldo Setelah Tarik'}
                </span>
                <span className={`font-mono font-black text-sm ${
                  saldoSetelah < 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {formatRupiah(saldoSetelah)}
                </span>
              </div>
            </div>
          )}

          {/* Nominal Input & Tombol Cepat */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                Nominal Transaksi (Rp)
              </label>
              <span className="text-[11px] font-mono font-black text-emerald-800">
                {formatRupiah(nominal)}
              </span>
            </div>

            <input
              type="number"
              min={1000}
              step={1000}
              value={nominal || ''}
              onChange={(e) => handleNominalChange(Number(e.target.value))}
              placeholder="Masukkan nominal..."
              className="w-full text-sm font-black font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              required
            />

            {/* Tombol Nominal Cepat */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_NOMINALS.map((qNom) => (
                <button
                  key={qNom}
                  type="button"
                  onClick={() => {
                    playTapSound();
                    handleNominalChange(qNom);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    nominal === qNom
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {qNom >= 1000000 ? `${qNom / 1000000} Jt` : `${qNom / 1000} rb`}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori & Keterangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-600" />
                Kategori Transaksi
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                {KATEGORI_OPTIONS.map((kat) => (
                  <option key={kat} value={kat}>{kat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-600" />
                Penyetor / Penarik
              </label>
              <input
                type="text"
                value={pembayarPenarik}
                onChange={(e) => setPembayarPenarik(e.target.value)}
                placeholder="Nama penyetor / penarik"
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3 text-emerald-600" />
              Keterangan & Catatan
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Setoran saku dari wali murid / Beli kitab Fathul Qorib"
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              required
            />
          </div>

          {/* Petugas Bendahara / Kasir */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Petugas Pencatat
            </label>
            <input
              type="text"
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              placeholder="Nama petugas kasir"
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={jenis === 'Tarik' && nominal > saldoSaatIni}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all ${
                jenis === 'Setor'
                  ? 'bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
                  : 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Terbitkan Kuitansi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
