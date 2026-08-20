import React, { useState } from 'react';
import { 
  ShieldAlert, 
  GraduationCap, 
  Building, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  BookOpen,
  Edit2,
  Plus,
  Trash2,
  Save,
  X,
  Check
} from 'lucide-react';
import { TATA_TERTIB_LIST } from '../../data/madrasahCompleteData';
import { TataTertibItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_TATATERTIB = 'madrasah_tatatertib_list_v2';

interface TataTertibViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const TataTertibView: React.FC<TataTertibViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('13_tatatertib', activeRole, explicitCanEdit);
  const [activeKategori, setActiveKategori] = useState<'Murid' | 'Asatidz'>('Murid');

  const [list, setList] = useState<TataTertibItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TATATERTIB);
      if (saved) return JSON.parse(saved);
    } catch {}
    return TATA_TERTIB_LIST;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TataTertibItem | null>(null);
  const [formBab, setFormBab] = useState('');
  const [formPasal, setFormPasal] = useState('');
  const [formIsi, setFormIsi] = useState<string[]>(['']);
  const [formSanksi, setFormSanksi] = useState<string[]>(['']);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const saveList = (newList: TataTertibItem[]) => {
    setList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_TATATERTIB, JSON.stringify(newList));
    } catch {}
  };

  const filteredList = list.filter((t) => t.kategori === activeKategori);

  const handleOpenAdd = () => {
    playTapSound();
    setEditingItem(null);
    setFormBab(activeKategori === 'Murid' ? 'BAB I - KEDISIPLINAN SANTRI' : 'BAB I - KEDISIPLINAN ASATIDZ');
    setFormPasal('Pasal Tambahan');
    setFormIsi(['Wajib hadir 10 menit sebelum jam pelajaran dimulai']);
    setFormSanksi(['Teguran lisan oleh bagian kedisiplinan']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TataTertibItem) => {
    playTapSound();
    setEditingItem(item);
    setFormBab(item.bab);
    setFormPasal(item.pasal);
    setFormIsi([...item.isi]);
    setFormSanksi(item.sanksi ? [...item.sanksi] : ['']);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPasal.trim()) return;
    playTapSound();

    const cleanIsi = formIsi.filter((i) => i.trim().length > 0);
    const cleanSanksi = formSanksi.filter((s) => s.trim().length > 0);

    let updated: TataTertibItem[];
    if (editingItem) {
      updated = list.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              bab: formBab,
              pasal: formPasal,
              isi: cleanIsi,
              sanksi: cleanSanksi.length > 0 ? cleanSanksi : undefined
            }
          : item
      );
      showToast(`Tata tertib "${formPasal}" berhasil diperbarui.`);
    } else {
      const newItem: TataTertibItem = {
        id: `tt-${Date.now()}`,
        kategori: activeKategori,
        bab: formBab,
        pasal: formPasal,
        isi: cleanIsi,
        sanksi: cleanSanksi.length > 0 ? cleanSanksi : undefined
      };
      updated = [...list, newItem];
      showToast(`Pasal baru "${formPasal}" berhasil ditambahkan.`);
    }

    saveList(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (item: TataTertibItem) => {
    if (window.confirm(`Hapus ${item.pasal}?`)) {
      playTapSound();
      const updated = list.filter((i) => i.id !== item.id);
      saveList(updated);
      showToast(`${item.pasal} telah dihapus.`);
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
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 13
            </span>
            <span className="text-teal-100 text-xs font-semibold">Kode Etik & Disiplin Madrasah</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">13. TATA TERTIB ASATIDZ & MURID</h1>
          <p className="text-xs text-teal-100 mt-0.5">
            Pedoman Hak, Kewajiban, Larangan, & Ketentuan Kedisiplinan
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Tata Tertib</span>
            </button>
          )}
        </div>
      </div>

      {/* Switcher Murid vs Asatidz */}
      <div className="grid grid-cols-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            playTapSound();
            setActiveKategori('Murid');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeKategori === 'Murid'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tata Tertib Santri</span>
        </button>

        <button
          onClick={() => {
            playTapSound();
            setActiveKategori('Asatidz');
          }}
          className={`py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeKategori === 'Asatidz'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Tata Tertib Asatidz</span>
        </button>
      </div>

      {/* Content Pasal-Pasal */}
      <div className="space-y-4">
        {filteredList.map((pasal) => (
          <div
            key={pasal.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3 relative"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 block">{pasal.bab}</span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 mt-0.5">{pasal.pasal}</h3>
              </div>

              {canEdit && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(pasal)}
                    className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50"
                    title="Edit Pasal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(pasal)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Hapus Pasal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 block">Kewajiban & Ketentuan:</span>
              {pasal.isi.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            {pasal.sanksi && pasal.sanksi.length > 0 && (
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 space-y-1.5">
                <span className="text-[11px] font-extrabold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Sanksi Pelanggaran:
                </span>
                {pasal.sanksi.map((snk, i) => (
                  <p key={i} className="text-xs text-rose-900 leading-relaxed pl-5">
                    • {snk}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Tata Tertib */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                {editingItem ? 'Edit Pasal Tata Tertib' : 'Tambah Pasal Tata Tertib Baru'}
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Kategori BAB:</label>
                <input
                  type="text"
                  value={formBab}
                  onChange={(e) => setFormBab(e.target.value)}
                  placeholder="Contoh: BAB I - KEWAJIBAN"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Pasal:</label>
                <input
                  type="text"
                  value={formPasal}
                  onChange={(e) => setFormPasal(e.target.value)}
                  placeholder="Contoh: Pasal 1 - Kedisiplinan Masuk Madrasah"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500 font-semibold"
                  required
                />
              </div>

              {/* Isi Butir */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-700">Butir Ketentuan / Kewajiban:</label>
                  <button
                    type="button"
                    onClick={() => setFormIsi([...formIsi, ''])}
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Butir</span>
                  </button>
                </div>

                {formIsi.map((isi, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={isi}
                      onChange={(e) => {
                        const copy = [...formIsi];
                        copy[idx] = e.target.value;
                        setFormIsi(copy);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-500"
                    />
                    {formIsi.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormIsi(formIsi.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Sanksi */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-rose-800">Sanksi Pelanggaran (Opsional):</label>
                  <button
                    type="button"
                    onClick={() => setFormSanksi([...formSanksi, ''])}
                    className="text-[11px] font-bold text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Sanksi</span>
                  </button>
                </div>

                {formSanksi.map((snk, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-5">•</span>
                    <input
                      type="text"
                      value={snk}
                      onChange={(e) => {
                        const copy = [...formSanksi];
                        copy[idx] = e.target.value;
                        setFormSanksi(copy);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-rose-50 border border-rose-200 rounded-xl focus:outline-rose-500"
                    />
                    {formSanksi.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormSanksi(formSanksi.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Pasal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
