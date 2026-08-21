import React, { useState } from 'react';
import { 
  UserPlus, 
  FileText, 
  Wallet, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Phone, 
  ArrowRight 
} from 'lucide-react';
import { SYARAT_PENDAFTARAN_DATA } from '../../data/madrasahCompleteData';
import { UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

interface SyaratPendaftaranViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const SyaratPendaftaranView: React.FC<SyaratPendaftaranViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('14_syarat_pendaftaran', activeRole, explicitCanEdit);
  const [showOnlineForm, setShowOnlineForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nisn: '',
    tempatLahir: '',
    tanggalLahir: '',
    namaAyah: '',
    namaIbu: '',
    noWa: '',
    alamat: '',
    pilihanKelas: 'Kelas 1'
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setFormSubmitted(true);
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-800 rounded-3xl p-5 text-white shadow-md space-y-2">
        <div className="flex items-center gap-2">
          <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
            MENU 14
          </span>
          <span className="text-emerald-100 text-xs font-semibold">Penerimaan Santri Baru (PSB)</span>
        </div>
        <h1 className="text-lg sm:text-2xl font-black text-white">
          14. SYARAT PENDAFTARAN MURID
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100">
          Informasi Jalur Pendaftaran, Persyaratan Berkas, & Rincian Biaya Santri Baru / Pindahan
        </p>
      </div>

      {/* Jalur Pendaftaran Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SYARAT_PENDAFTARAN_DATA.jalurPendaftaran.map((jalur, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-2"
          >
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Jalur {idx + 1}
              </span>
              <h3 className="font-extrabold text-sm text-slate-800 mt-1">{jalur.nama}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kuota: <strong>{jalur.kuota}</strong></p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] font-medium text-teal-800">
              📅 {jalur.periode}
            </div>
          </div>
        ))}
      </div>

      {/* Syarat Berkas & Rincian Biaya Masuk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Syarat Berkas */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-teal-800 border-b border-slate-100 pb-2.5">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Persyaratan Berkas Administrasi
            </h3>
          </div>

          <div className="space-y-2">
            {SYARAT_PENDAFTARAN_DATA.syaratBerkas.map((syarat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{syarat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rincian Biaya */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 border-b border-slate-100 pb-2.5">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                Rincian Biaya Santri Baru
              </h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {SYARAT_PENDAFTARAN_DATA.rincianBiayaMasuk.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">{item.item}</span>
                  <span className="font-mono font-bold text-slate-800">
                    Rp {item.nominal.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-200 bg-emerald-50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 rounded-b-3xl flex items-center justify-between">
            <span className="text-xs font-black text-emerald-950 uppercase">Total Biaya Masuk:</span>
            <span className="text-base sm:text-lg font-black text-emerald-800 font-mono">
              Rp {SYARAT_PENDAFTARAN_DATA.totalBiayaMasuk.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Online Registration Trigger */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-600 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-base">Ingin Mendaftarkan Santri Secara Online?</h3>
          <p className="text-xs text-teal-100 mt-0.5">
            Isi formulir digital dalam waktu 2 menit tanpa perlu antri di kantor madrasah.
          </p>
        </div>

        <button
          onClick={() => {
            playTapSound();
            setShowOnlineForm(!showOnlineForm);
            setFormSubmitted(false);
          }}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{showOnlineForm ? 'Tutup Formulir' : 'Buka Formulir Online'}</span>
        </button>
      </div>

      {/* Online Registration Modal / Collapse */}
      {showOnlineForm && (
        <div className="bg-white rounded-3xl border border-teal-300 shadow-lg p-5 space-y-4 animate-fadeIn">
          {formSubmitted ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                Pendaftaran Online Berhasil Dikirim!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Terima kasih. Panitia PSB Madrasah Diniyah Al-Ikhlas akan segera menghubungi nomor WhatsApp orang tua dalam kurun 1x24 jam untuk verifikasi berkas.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Daftarkan Santri Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                Formulir Pendaftaran Calon Santri Baru
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Nama Lengkap Santri:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Ihsan"
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Pilihan Kelas Masuk:</label>
                  <select
                    value={formData.pilihanKelas}
                    onChange={(e) => setFormData({ ...formData, pilihanKelas: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Kelas 1">Kelas 1 (Ibtidaiyah Baru)</option>
                    <option value="Kelas 2">Kelas 2 (Pindahan)</option>
                    <option value="Kelas 3">Kelas 3 (Pindahan)</option>
                    <option value="Kelas 4">Kelas 4 (Pindahan)</option>
                    <option value="Kelas 5">Kelas 5 (Pindahan)</option>
                    <option value="Kelas 6">Kelas 6 (Pindahan)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Tempat & Tanggal Lahir:</label>
                  <input
                    type="text"
                    required
                    placeholder="Kendal, 15 Mei 2018"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Nama Orang Tua (Ayah / Ibu):</label>
                  <input
                    type="text"
                    required
                    placeholder="Bpk. Rahmat & Ibu Siti"
                    value={formData.namaAyah}
                    onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">No. WhatsApp Aktif Orang Tua:</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={formData.noWa}
                    onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Alamat Rumah Lengkap:</label>
                  <input
                    type="text"
                    required
                    placeholder="Jl. Pesantren No. 12 RT 01/RW 02..."
                    value={formData.alamat}
                    onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowOnlineForm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700"
                >
                  Kirim Pendaftaran Santri
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
