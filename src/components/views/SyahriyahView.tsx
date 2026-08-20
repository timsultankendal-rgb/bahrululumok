import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Calendar, 
  FileSpreadsheet, 
  Receipt, 
  Sparkles,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  RotateCcw,
  Check
} from 'lucide-react';
import { SYAHRIYAH_LIST } from '../../data/madrasahCompleteData';
import { SyahriyahRecord, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_SYAHRIYAH = 'madrasah_syahriyah_list_v2';
const STORAGE_KEY_NOMINAL = 'madrasah_syahriyah_nominal_v2';

interface SyahriyahViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const SyahriyahView: React.FC<SyahriyahViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('11_syahriyah', activeRole, explicitCanEdit);
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [nominalPerCawu, setNominalPerCawu] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOMINAL);
      if (saved) return Number(saved);
    } catch {}
    return 150000;
  });

  const [syahriyahList, setSyahriyahList] = useState<SyahriyahRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SYAHRIYAH);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SYAHRIYAH_LIST;
  });

  // Modal States
  const [isEditNominalOpen, setIsEditNominalOpen] = useState(false);
  const [tempNominal, setTempNominal] = useState(nominalPerCawu);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SyahriyahRecord | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formNoInduk, setFormNoInduk] = useState('');
  const [formKelas, setFormKelas] = useState('Kelas 1');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const saveList = (newList: SyahriyahRecord[]) => {
    setSyahriyahList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_SYAHRIYAH, JSON.stringify(newList));
    } catch {}
  };

  const filteredList = syahriyahList.filter((s) => {
    const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchQuery = s.nama.toLowerCase().includes(searchQuery.toLowerCase()) || s.noInduk.includes(searchQuery);
    return matchKelas && matchQuery;
  });

  const handleBayar = (id: string, cawuKey: 'cawu1' | 'cawu2' | 'cawu3') => {
    playTapSound();
    const updated = syahriyahList.map((item) => {
      if (item.id === id) {
        const isCurrentLunas = item[cawuKey].status === 'Lunas';
        return {
          ...item,
          [cawuKey]: {
            ...item[cawuKey],
            status: isCurrentLunas ? 'Belum' as const : 'Lunas' as const,
            tanggalBayar: isCurrentLunas ? undefined : new Date().toLocaleDateString('id-ID'),
            kuitansi: isCurrentLunas ? undefined : `KWT-${Date.now().toString().slice(-6)}`
          }
        };
      }
      return item;
    });
    saveList(updated);
    showToast('Status pembayaran berhasil diperbarui!');
  };

  const handleSaveNominal = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    setNominalPerCawu(tempNominal);
    try {
      localStorage.setItem(STORAGE_KEY_NOMINAL, String(tempNominal));
    } catch {}
    setIsEditNominalOpen(false);
    showToast(`Tarif Syahriyah diubah menjadi Rp ${tempNominal.toLocaleString('id-ID')} / Cawu`);
  };

  const handleOpenAdd = () => {
    playTapSound();
    setFormNama('');
    setFormNoInduk(`NIS.${Date.now()}`.slice(-4));
    setFormKelas('Kelas 1');
    setEditingItem(null);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item: SyahriyahRecord) => {
    playTapSound();
    setEditingItem(item);
    setFormNama(item.nama);
    setFormNoInduk(item.noInduk);
    setFormKelas(item.kelas);
    setIsAddOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;
    playTapSound();

    if (editingItem) {
      const updated = syahriyahList.map((s) =>
        s.id === editingItem.id
          ? { ...s, nama: formNama.trim(), noInduk: formNoInduk.trim(), kelas: formKelas }
          : s
      );
      saveList(updated);
      showToast(`Data santri "${formNama}" berhasil diperbarui.`);
    } else {
      const newItem: SyahriyahRecord = {
        id: `syh_${Date.now()}`,
        nama: formNama.trim(),
        noInduk: formNoInduk.trim() || `NIS.${Date.now()}`.slice(-4),
        kelas: formKelas,
        cawu1: { status: 'Belum', nominal: nominalPerCawu },
        cawu2: { status: 'Belum', nominal: nominalPerCawu },
        cawu3: { status: 'Belum', nominal: nominalPerCawu },
      };
      saveList([newItem, ...syahriyahList]);
      showToast(`Santri "${formNama}" berhasil ditambahkan ke Syahriyah.`);
    }
    setIsAddOpen(false);
  };

  const handleDelete = (item: SyahriyahRecord) => {
    if (window.confirm(`Hapus data syahriyah santri "${item.nama}"?`)) {
      playTapSound();
      const updated = syahriyahList.filter((s) => s.id !== item.id);
      saveList(updated);
      showToast(`Data santri "${item.nama}" telah dihapus.`);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 11
            </span>
            <span className="text-teal-100 text-xs font-semibold">Keuangan & Iuran Santri</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">11. SYAHRIYAH & ADMINISTRASI</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Monitoring Iuran Syahriyah Kelas 1-6 Per Caturwulan (Cawu 1, 2, & 3)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white/15 px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>Rp {nominalPerCawu.toLocaleString('id-ID')} / Cawu</span>
          </div>

          {canEdit && (
            <button
              onClick={() => {
                playTapSound();
                setTempNominal(nominalPerCawu);
                setIsEditNominalOpen(true);
              }}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Edit Tarif Syahriyah"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Tarif</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar & Add Button */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Quick Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Santri / No. Induk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 font-medium"
            />
          </div>

          {/* Add Data Button */}
          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Santri Syahriyah</span>
            </button>
          )}
        </div>

        {/* Responsive Kelas 1-6 Filter */}
        <div className="w-full pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 mb-1.5 sm:hidden">
            <span className="text-[11px] font-bold text-slate-500">Pilih Kelas:</span>
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">{selectedKelas}</span>
          </div>
          <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 w-full">
            <span className="hidden sm:inline-flex items-center text-[11px] font-bold text-slate-400 mr-1">Kelas:</span>
            {['Semua', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
              <button
                key={k}
                onClick={() => {
                  playTapSound();
                  setSelectedKelas(k);
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                  selectedKelas === k
                    ? 'bg-emerald-600 text-white shadow-2xs font-black ring-2 ring-emerald-400/40'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Syahriyah Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            Daftar Administrasi Syahriyah ({selectedKelas})
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Total: {filteredList.length} Santri
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-800">{item.nama}</h4>
                  <span className="text-[10px] font-black px-2 py-0.2 rounded-md bg-slate-100 text-slate-700">
                    {item.kelas}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  No. Induk: {item.noInduk}
                </p>

                {canEdit && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-[11px] text-teal-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Data</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status Cawu 1, Cawu 2, Cawu 3 */}
              <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
                {/* Cawu 1 */}
                <div className={`p-2.5 rounded-2xl border flex flex-col justify-between text-xs ${
                  item.cawu1.status === 'Lunas' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[10px] uppercase text-slate-600">Cawu 1</span>
                    {item.cawu1.status === 'Lunas' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">Rp {nominalPerCawu.toLocaleString('id-ID')}</span>
                  <button
                    onClick={() => handleBayar(item.id, 'cawu1')}
                    className={`mt-1.5 py-1 px-2 rounded-lg font-black text-[10px] transition-colors cursor-pointer ${
                      item.cawu1.status === 'Lunas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.cawu1.status}
                  </button>
                </div>

                {/* Cawu 2 */}
                <div className={`p-2.5 rounded-2xl border flex flex-col justify-between text-xs ${
                  item.cawu2.status === 'Lunas' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[10px] uppercase text-slate-600">Cawu 2</span>
                    {item.cawu2.status === 'Lunas' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">Rp {nominalPerCawu.toLocaleString('id-ID')}</span>
                  <button
                    onClick={() => handleBayar(item.id, 'cawu2')}
                    className={`mt-1.5 py-1 px-2 rounded-lg font-black text-[10px] transition-colors cursor-pointer ${
                      item.cawu2.status === 'Lunas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.cawu2.status}
                  </button>
                </div>

                {/* Cawu 3 */}
                <div className={`p-2.5 rounded-2xl border flex flex-col justify-between text-xs ${
                  item.cawu3.status === 'Lunas' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-[10px] uppercase text-slate-600">Cawu 3</span>
                    {item.cawu3.status === 'Lunas' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">Rp {nominalPerCawu.toLocaleString('id-ID')}</span>
                  <button
                    onClick={() => handleBayar(item.id, 'cawu3')}
                    className={`mt-1.5 py-1 px-2 rounded-lg font-black text-[10px] transition-colors cursor-pointer ${
                      item.cawu3.status === 'Lunas'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.cawu3.status}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit Tarif */}
      {isEditNominalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Edit Tarif Syahriyah
              </h3>
              <button
                onClick={() => setIsEditNominalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNominal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal Iuran Per Caturwulan (Rp):
                </label>
                <input
                  type="number"
                  value={tempNominal}
                  onChange={(e) => setTempNominal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditNominalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Santri */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-600" />
                {editingItem ? 'Edit Data Santri Syahriyah' : 'Tambah Santri ke Syahriyah'}
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Santri:
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Muhammad Wildan"
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. Induk (NIS):
                  </label>
                  <input
                    type="text"
                    value={formNoInduk}
                    onChange={(e) => setFormNoInduk(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas:
                  </label>
                  <select
                    value={formKelas}
                    onChange={(e) => setFormKelas(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                  >
                    {['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Santri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
