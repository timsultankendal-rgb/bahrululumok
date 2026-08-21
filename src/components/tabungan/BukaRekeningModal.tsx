import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Phone, 
  User, 
  GraduationCap
} from 'lucide-react';
import { TabunganSantri, BiodataMurid } from '../../types';
import { BIODATA_MURID_LIST } from '../../data/madrasahCompleteData';
import { playTapSound } from '../../utils/audio';

interface BukaRekeningModalProps {
  existingTabunganList: TabunganSantri[];
  onClose: () => void;
  onSave: (newTabungan: TabunganSantri) => void;
}

const PROGRAM_OPTIONS = [
  'Reguler/Saku',
  'Haflah & Wisuda',
  'Qurban',
  'Kitab & ATK',
  'Khusus / Multiguna'
];

const KELAS_OPTIONS = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

export const BukaRekeningModal: React.FC<BukaRekeningModalProps> = ({
  existingTabunganList,
  onClose,
  onSave,
}) => {
  const [selectedMuridId, setSelectedMuridId] = useState<string>('manual');
  const [nama, setNama] = useState('');
  const [noInduk, setNoInduk] = useState(`2026.01.${(existingTabunganList.length + 1).toString().padStart(3, '0')}`);
  const [nisn, setNisn] = useState('');
  const [noRekening, setNoRekening] = useState(`TAB-2026-${(existingTabunganList.length + 1).toString().padStart(3, '0')}`);
  const [kelas, setKelas] = useState('Kelas 1');
  const [foto, setFoto] = useState('');
  const [namaWali, setNamaWali] = useState('');
  const [noWaWali, setNoWaWali] = useState('');
  const [programTabungan, setProgramTabungan] = useState('Reguler/Saku');
  const [setoranAwal, setSetoranAwal] = useState<number>(50000);
  const [petugas, setPetugas] = useState('Ustzh. Nur Laili');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectMurid = (id: string) => {
    setSelectedMuridId(id);
    if (id === 'manual') {
      setNama('');
      setFoto('');
      setNamaWali('');
      setNoWaWali('');
      return;
    }

    const murid = BIODATA_MURID_LIST.find(m => m.id === id);
    if (murid) {
      setNama(murid.nama);
      setNoInduk(murid.noInduk);
      setNisn(murid.nisn || '');
      setKelas(murid.kelas);
      setFoto(murid.foto || '');
      setNamaWali(murid.orangTua?.ayah || murid.orangTua?.ibu || '');
      setNoWaWali(murid.noWa || '');
      setNoRekening(`TAB-${murid.kelas.replace(/\s+/g, '')}-${murid.noInduk.replace(/[^0-9]/g, '').slice(-3)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama santri wajib diisi.');
      return;
    }
    if (setoranAwal < 0) {
      setErrorMsg('Setoran awal tidak boleh negatif.');
      return;
    }

    playTapSound();
    const now = new Date();
    const tanggalStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    const waktuStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const newId = `tab_${Date.now()}`;

    const newAccount: TabunganSantri = {
      id: newId,
      noInduk: noInduk || `IND-${Date.now().toString().slice(-4)}`,
      nisn: nisn || undefined,
      noRekening: noRekening || `TAB-2026-${Date.now().toString().slice(-4)}`,
      nama: nama.trim(),
      namaSantri: nama.trim(),
      kelas: kelas,
      foto: foto || undefined,
      namaWali: namaWali || undefined,
      noWaWali: noWaWali || undefined,
      programTabungan: programTabungan,
      status: 'Aktif',
      jumlahTabungan: setoranAwal,
      totalTabungan: setoranAwal,
      tanggalBuka: tanggalStr,
      terakhirTransaksi: tanggalStr,
      terakhirUpdate: tanggalStr,
      riwayat: setoranAwal > 0 ? [
        {
          id: `rw_init_${Date.now()}`,
          tanggal: tanggalStr,
          waktu: waktuStr,
          jenis: 'Setor',
          nominal: setoranAwal,
          saldoSebelum: 0,
          saldoSesudah: setoranAwal,
          kategori: 'Setoran Awal',
          keterangan: 'Setoran Awal Pembukaan Rekening Tabungan',
          petugas: petugas,
          pembayarPenarik: namaWali || nama.trim(),
          idKuitansi: `KWT-BUKA-${Date.now().toString().slice(-6)}`
        }
      ] : []
    };

    onSave(newAccount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95 my-auto border border-emerald-500/20 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Buka Rekening Tabungan Santri Baru
            </h3>
            <p className="text-xs text-slate-500">
              Registrasi buku tabungan digital terhubung database madrasah
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 overflow-y-auto pr-1">
          
          {/* Opsi Pilih dari Master Murid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ambil dari Biodata Santri Madrasah
            </label>
            <select
              value={selectedMuridId}
              onChange={(e) => handleSelectMurid(e.target.value)}
              className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            >
              <option value="manual">+ Input Manual / Santri Baru</option>
              {BIODATA_MURID_LIST.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} ({m.kelas}) - No. Induk: {m.noInduk}
                </option>
              ))}
            </select>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Santri <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap santri"
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                {KELAS_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. Induk / NIS
              </label>
              <input
                type="text"
                value={noInduk}
                onChange={(e) => setNoInduk(e.target.value)}
                placeholder="2026.01.001"
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. Rekening Buku
              </label>
              <input
                type="text"
                value={noRekening}
                onChange={(e) => setNoRekening(e.target.value)}
                placeholder="TAB-2026-001"
                className="w-full text-xs font-mono font-bold text-emerald-800 px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Program Tabungan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Program Tabungan
              </label>
              <select
                value={programTabungan}
                onChange={(e) => setProgramTabungan(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              >
                {PROGRAM_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Setoran Awal (Rp)
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                value={setoranAwal}
                onChange={(e) => setSetoranAwal(Number(e.target.value))}
                className="w-full text-xs font-mono font-black px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-emerald-800"
              />
            </div>
          </div>

          {/* Wali Santri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Wali Santri
              </label>
              <input
                type="text"
                value={namaWali}
                onChange={(e) => setNamaWali(e.target.value)}
                placeholder="Bpk / Ibu ..."
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. WhatsApp Wali
              </label>
              <input
                type="text"
                value={noWaWali}
                onChange={(e) => setNoWaWali(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Petugas Bendahara */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Petugas Pembuka Rekening
            </label>
            <input
              type="text"
              value={petugas}
              onChange={(e) => setPetugas(e.target.value)}
              placeholder="Ustzh. Nur Laili"
              className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-900"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-xs transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Buka Rekening & Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
