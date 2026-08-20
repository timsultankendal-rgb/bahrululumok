import React, { useState } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles,
  Search,
  Edit2,
  Trash2,
  Save,
  X,
  Check
} from 'lucide-react';
import { CATATAN_KEGIATAN_LIST } from '../../data/madrasahCompleteData';
import { CatatanKegiatanItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_KEGIATAN = 'madrasah_catatan_kegiatan_v2';

interface CatatanKegiatanViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const CatatanKegiatanView: React.FC<CatatanKegiatanViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('8_catatan_kegiatan', activeRole, explicitCanEdit);
  const [kegiatanList, setKegiatanList] = useState<CatatanKegiatanItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KEGIATAN);
      if (saved) return JSON.parse(saved);
    } catch {}
    return CATATAN_KEGIATAN_LIST;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CatatanKegiatanItem | null>(null);

  const [formHari, setFormHari] = useState<string>('Senin');
  const [formTanggal, setFormTanggal] = useState<string>('');
  const [formKeterangan, setFormKeterangan] = useState<string>('');
  const [formTempat, setFormTempat] = useState<string>('');
  const [formPJ, setFormPJ] = useState<string>('');
  const [formStatus, setFormStatus] = useState<string>('Akan Datang');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const saveList = (newList: CatatanKegiatanItem[]) => {
    setKegiatanList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_KEGIATAN, JSON.stringify(newList));
    } catch {}
  };

  const filteredList = kegiatanList.filter((k) =>
    k.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.tempat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    playTapSound();
    setEditingItem(null);
    setFormHari('Senin');
    setFormTanggal(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }));
    setFormKeterangan('');
    setFormTempat('Masjid Jamie\' MDTW');
    setFormPJ('Dewan Asatidz');
    setFormStatus('Akan Datang');
    setIsAdding(true);
  };

  const handleOpenEdit = (item: CatatanKegiatanItem) => {
    playTapSound();
    setEditingItem(item);
    setFormHari(item.hari);
    setFormTanggal(item.tanggal);
    setFormKeterangan(item.keterangan);
    setFormTempat(item.tempat);
    setFormPJ(item.penanggungJawab);
    setFormStatus(item.status || 'Akan Datang');
    setIsAdding(true);
  };

  const handleSaveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTanggal || !formKeterangan || !formTempat) return;
    playTapSound();

    let updated: CatatanKegiatanItem[];
    if (editingItem) {
      updated = kegiatanList.map((k) =>
        k.id === editingItem.id
          ? {
              ...k,
              hari: formHari,
              tanggal: formTanggal,
              keterangan: formKeterangan,
              tempat: formTempat,
              penanggungJawab: formPJ || 'Dewan Asatidz',
              status: formStatus
            }
          : k
      );
      showToast(`Catatan kegiatan "${formKeterangan.slice(0, 25)}..." diperbarui.`);
    } else {
      const newItem: CatatanKegiatanItem = {
        id: `ck-${Date.now()}`,
        hari: formHari,
        tanggal: formTanggal,
        keterangan: formKeterangan,
        tempat: formTempat,
        penanggungJawab: formPJ || 'Dewan Asatidz',
        status: formStatus
      };
      updated = [newItem, ...kegiatanList];
      showToast('Catatan kegiatan baru berhasil ditambahkan.');
    }

    saveList(updated);
    setIsAdding(false);
  };

  const handleDelete = (item: CatatanKegiatanItem) => {
    if (window.confirm(`Hapus catatan kegiatan "${item.keterangan}"?`)) {
      playTapSound();
      const updated = kegiatanList.filter((k) => k.id !== item.id);
      saveList(updated);
      showToast('Catatan kegiatan telah dihapus.');
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
      <div className="bg-gradient-to-r from-teal-800 via-emerald-700 to-teal-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 8
            </span>
            <span className="text-teal-100 text-xs font-semibold">Logbook & Notulensi Harian</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">8. CATATAN KEGIATAN MADRASAH</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Agenda Kegiatan Harian: Hari, Tanggal, Keterangan, & Lokasi Tempat
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Catatan Baru</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari catatan agenda / tempat / penanggung jawab..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-emerald-500 shadow-xs font-medium"
        />
      </div>

      {/* List of Catatan Kegiatan */}
      <div className="space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900">
                  {item.hari}
                </span>
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {item.tanggal}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                  item.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'Sedang Berlangsung'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                {item.keterangan}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {item.tempat}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PJ: {item.penanggungJawab}
                </span>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-xl text-teal-700 hover:bg-teal-50 border border-slate-200 text-xs font-bold flex items-center gap-1"
                  title="Edit Catatan Ini"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-slate-200 text-xs font-bold flex items-center gap-1"
                  title="Hapus Catatan Ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Kegiatan */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                {editingItem ? 'Edit Catatan Kegiatan' : 'Input Catatan Kegiatan Baru'}
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKegiatan} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Hari:</label>
                  <select
                    value={formHari}
                    onChange={(e) => setFormHari(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Ahad'].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Status:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1 text-xs">Tanggal Kegiatan:</label>
                <input
                  type="text"
                  required
                  placeholder="25 Agustus 2026"
                  value={formTanggal}
                  onChange={(e) => setFormTanggal(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1 text-xs">Keterangan Kegiatan:</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Tulis rincian agenda kegiatan..."
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Tempat / Lokasi:</label>
                  <input
                    type="text"
                    required
                    placeholder="Masjid / Aula"
                    value={formTempat}
                    onChange={(e) => setFormTempat(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Penanggung Jawab:</label>
                  <input
                    type="text"
                    placeholder="Nama Ustadz / Panitia"
                    value={formPJ}
                    onChange={(e) => setFormPJ(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white font-black rounded-xl text-xs hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Catatan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
