import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Award, 
  MapPin, 
  School, 
  Calendar, 
  Sparkles,
  CheckCircle2,
  FileCheck,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Check
} from 'lucide-react';
import { MUTAKHORIJIN_LIST } from '../../data/madrasahCompleteData';
import { MutakhorijinItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_MUTAKHORIJIN = 'madrasah_mutakhorijin_list_v2';

interface MutakhorijinViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const MutakhorijinView: React.FC<MutakhorijinViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('10_mutakhorijin', activeRole, explicitCanEdit);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTahun, setSelectedTahun] = useState<string>('Semua');

  const [alumniList, setAlumniList] = useState<MutakhorijinItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MUTAKHORIJIN);
      if (saved) return JSON.parse(saved);
    } catch {}
    return MUTAKHORIJIN_LIST;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MutakhorijinItem | null>(null);
  const [form, setForm] = useState<Omit<MutakhorijinItem, 'id'>>({
    nama: '',
    tahunLulus: '2025',
    noIjazah: '',
    pendidikanLanjutan: '',
    alamatSekarang: '',
    angkatan: 'Angkatan VII (2025)',
    prestasiTerbaik: ''
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const saveList = (newList: MutakhorijinItem[]) => {
    setAlumniList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_MUTAKHORIJIN, JSON.stringify(newList));
    } catch {}
  };

  const filteredList = alumniList.filter((m) => {
    const matchTahun = selectedTahun === 'Semua' || m.tahunLulus === selectedTahun;
    const matchQuery =
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.noIjazah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.pendidikanLanjutan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTahun && matchQuery;
  });

  const handleOpenAdd = () => {
    playTapSound();
    setEditingItem(null);
    setForm({
      nama: '',
      tahunLulus: '2025',
      noIjazah: `DN-01/MDTW/${Date.now().toString().slice(-4)}`,
      pendidikanLanjutan: 'Pondok Pesantren Al-Falah Ploso',
      alamatSekarang: 'Kendal, Jawa Tengah',
      angkatan: 'Angkatan VII (2025)',
      prestasiTerbaik: 'Juara 1 Musabaqah Qiraatil Kutub'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: MutakhorijinItem) => {
    playTapSound();
    setEditingItem(item);
    setForm({
      nama: item.nama,
      tahunLulus: item.tahunLulus,
      noIjazah: item.noIjazah,
      pendidikanLanjutan: item.pendidikanLanjutan,
      alamatSekarang: item.alamatSekarang,
      angkatan: item.angkatan,
      prestasiTerbaik: item.prestasiTerbaik || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim()) return;
    playTapSound();

    let updated: MutakhorijinItem[];
    if (editingItem) {
      updated = alumniList.map((a) => a.id === editingItem.id ? { ...form, id: editingItem.id } : a);
      showToast(`Data alumni "${form.nama}" berhasil disimpan.`);
    } else {
      const newItem: MutakhorijinItem = {
        ...form,
        id: `alm-${Date.now()}`
      };
      updated = [newItem, ...alumniList];
      showToast(`Alumni baru "${form.nama}" berhasil ditambahkan.`);
    }

    saveList(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (item: MutakhorijinItem) => {
    if (window.confirm(`Hapus data alumni "${item.nama}"?`)) {
      playTapSound();
      const updated = alumniList.filter((a) => a.id !== item.id);
      saveList(updated);
      showToast(`Data alumni "${item.nama}" telah dihapus.`);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 10
            </span>
            <span className="text-teal-100 text-xs font-semibold">Ikatan Alumni Santri (IKAS)</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">10. DAFTAR MUTAKHORIJIN (ALUMNI)</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Buku Induk Kelulusan, No. Ijazah, & Studi Lanjutan Pesantren / Universitas
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>{alumniList.length} Alumni Terdata</span>
          </div>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Alumni</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="grid grid-cols-4 sm:flex gap-1.5 w-full sm:w-auto">
          {['Semua', '2025', '2024', '2023'].map((thn) => (
            <button
              key={thn}
              onClick={() => {
                playTapSound();
                setSelectedTahun(thn);
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                selectedTahun === thn
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {thn === 'Semua' ? 'Semua' : thn}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Alumni / No Ijazah / Pesantren..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Grid of Alumni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 space-y-3 relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {m.angkatan}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      Lulus Th. {m.tahunLulus}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                    {m.nama}
                  </h3>
                  <p className="text-xs font-mono font-bold text-teal-700 mt-0.5">
                    No. Ijazah : {m.noIjazah}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs mt-3">
                <div className="flex items-start gap-2">
                  <School className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500">Pendidikan Lanjutan:</span>
                    <p className="font-bold text-slate-800">{m.pendidikanLanjutan}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-500">Domisili / Lokasi Sekarang:</span>
                    <p className="font-medium text-slate-700">{m.alamatSekarang}</p>
                  </div>
                </div>

                {m.prestasiTerbaik && (
                  <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-500">Prestasi Terbaik:</span>
                      <p className="font-bold text-amber-900">{m.prestasiTerbaik}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(m)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Alumni */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                {editingItem ? 'Edit Data Alumni' : 'Tambah Data Alumni Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap Alumni:</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Ust. Ahmad Fauzi"
                  className="w-full px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tahun Lulus:</label>
                  <input
                    type="text"
                    value={form.tahunLulus}
                    onChange={(e) => setForm({ ...form, tahunLulus: e.target.value })}
                    placeholder="2025"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">No. Ijazah:</label>
                  <input
                    type="text"
                    value={form.noIjazah}
                    onChange={(e) => setForm({ ...form, noIjazah: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pendidikan Lanjutan / Pesantren:</label>
                <input
                  type="text"
                  value={form.pendidikanLanjutan}
                  onChange={(e) => setForm({ ...form, pendidikanLanjutan: e.target.value })}
                  placeholder="Contoh: PP Lirboyo Kediri / UIN Walisongo"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Domisili / Alamat Sekarang:</label>
                <input
                  type="text"
                  value={form.alamatSekarang}
                  onChange={(e) => setForm({ ...form, alamatSekarang: e.target.value })}
                  placeholder="Contoh: Kaliwungu, Kendal"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Prestasi Terbaik (Opsional):</label>
                <input
                  type="text"
                  value={form.prestasiTerbaik}
                  onChange={(e) => setForm({ ...form, prestasiTerbaik: e.target.value })}
                  placeholder="Contoh: Juara 1 MQK Tingkat Kabupaten"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
