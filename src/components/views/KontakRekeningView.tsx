import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Building,
  QrCode,
  Users,
  Edit2,
  Plus,
  Trash2,
  Save,
  X,
  Cloud,
  RotateCcw,
  Printer
} from 'lucide-react';
import { KONTAK_REKENING_DATA } from '../../data/madrasahCompleteData';
import { UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { 
  saveMenuRecordToFirestore, 
  subscribeMenuRecords 
} from '../../services/firestoreService';
import { useAccessPermission } from '../../hooks/useAccessPermission';

const STORAGE_KEY_KONTAK = 'madrasah_kontak_rekening_data_v2';

interface KontakRekeningViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const KontakRekeningView: React.FC<KontakRekeningViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('18_kontak_rekening', activeRole, explicitCanEdit);
  const [copiedRekening, setCopiedRekening] = useState<string | null>(null);
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KONTAK);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return KONTAK_REKENING_DATA;
  });

  const [cloudStatus, setCloudStatus] = useState<'synced' | 'saving' | 'offline'>('synced');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modals
  const [isEditAlamatOpen, setIsEditAlamatOpen] = useState(false);
  const [isEditRekeningOpen, setIsEditRekeningOpen] = useState(false);
  const [isEditKontakOpen, setIsEditKontakOpen] = useState(false);
  const [isEditGroupWaOpen, setIsEditGroupWaOpen] = useState(false);

  // Forms
  const [alamatForm, setAlamatForm] = useState({
    namaLembaga: data.namaLembaga,
    alamatLengkap: data.alamatLengkap,
    patokan: data.patokan,
    googleMapsUrl: data.googleMapsUrl
  });

  // Rekening Bank CRUD Form
  const [rekeningList, setRekeningList] = useState(data.rekeningBank);
  const [editingRekIndex, setEditingRekIndex] = useState<number | null>(null);
  const [rekForm, setRekForm] = useState({
    bank: '',
    nomorRekening: '',
    atasNama: '',
    kodeBank: '451',
    keterangan: 'Syahriyah, Infaq & Donasi'
  });

  // Kontak Hotline CRUD Form
  const [kontakList, setKontakList] = useState(data.kontak);
  const [editingKontakIndex, setEditingKontakIndex] = useState<number | null>(null);
  const [kontakForm, setKontakForm] = useState({
    label: '',
    noTelp: '',
    icon: 'MessageCircle'
  });

  // Group WA CRUD Form
  const [groupWaList, setGroupWaList] = useState(data.groupWhatsApp);
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [groupForm, setGroupForm] = useState({
    namaGroup: '',
    link: 'https://chat.whatsapp.com/',
    jumlahMember: '150 Anggota'
  });

  // Subscribe to Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    const unsub = subscribeMenuRecords<typeof KONTAK_REKENING_DATA>('kontak_rekening', (records) => {
      if (!isMounted) return;
      if (records && records.length > 0 && records[0].payload) {
        const payload = records[0].payload;
        setData(payload);
        setRekeningList(payload.rekeningBank || []);
        setKontakList(payload.kontak || []);
        setGroupWaList(payload.groupWhatsApp || []);
        localStorage.setItem(STORAGE_KEY_KONTAK, JSON.stringify(payload));
      } else {
        // Seed initial data
        saveMenuRecordToFirestore('kontak_rekening', 'main', 'Kontak & Rekening', KONTAK_REKENING_DATA);
      }
      setCloudStatus('synced');
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleCopy = (nomor: string) => {
    playTapSound();
    navigator.clipboard.writeText(nomor.replace(/[^0-9]/g, ''));
    setCopiedRekening(nomor);
    showToast(`📋 No. Rekening disalin: ${nomor}`);
    setTimeout(() => setCopiedRekening(null), 2500);
  };

  const persistData = async (newData: typeof KONTAK_REKENING_DATA, msg: string) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY_KONTAK, JSON.stringify(newData));
    setCloudStatus('saving');
    try {
      await saveMenuRecordToFirestore('kontak_rekening', 'main', 'Kontak & Rekening', newData);
      setCloudStatus('synced');
      showToast(msg);
    } catch (e) {
      console.warn('Firestore fallback', e);
      setCloudStatus('offline');
      showToast('💾 Tersimpan di penyimpanan lokal');
    }
  };

  // Save Alamat
  const handleSaveAlamat = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    const updated = {
      ...data,
      namaLembaga: alamatForm.namaLembaga,
      alamatLengkap: alamatForm.alamatLengkap,
      patokan: alamatForm.patokan,
      googleMapsUrl: alamatForm.googleMapsUrl
    };
    persistData(updated, '✅ Alamat Lembaga berhasil diperbarui!');
    setIsEditAlamatOpen(false);
  };

  // Save Rekening Bank
  const handleSaveRekeningItem = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    let updatedList = [...rekeningList];
    if (editingRekIndex !== null) {
      updatedList[editingRekIndex] = rekForm;
    } else {
      updatedList.push(rekForm);
    }
    setRekeningList(updatedList);
    const updated = { ...data, rekeningBank: updatedList };
    persistData(updated, '✅ Rekening Bank berhasil diperbarui!');
    setEditingRekIndex(null);
    setRekForm({ bank: '', nomorRekening: '', atasNama: '', kodeBank: '451', keterangan: '' });
  };

  const handleDeleteRekeningItem = (idx: number) => {
    if (confirm('Hapus rekening bank ini?')) {
      playTapSound();
      const updatedList = rekeningList.filter((_, i) => i !== idx);
      setRekeningList(updatedList);
      const updated = { ...data, rekeningBank: updatedList };
      persistData(updated, '🗑️ Rekening Bank telah dihapus');
    }
  };

  // Save Kontak
  const handleSaveKontakItem = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    let updatedList = [...kontakList];
    if (editingKontakIndex !== null) {
      updatedList[editingKontakIndex] = kontakForm;
    } else {
      updatedList.push(kontakForm);
    }
    setKontakList(updatedList);
    const updated = { ...data, kontak: updatedList };
    persistData(updated, '✅ Hotline Kontak berhasil diperbarui!');
    setEditingKontakIndex(null);
    setKontakForm({ label: '', noTelp: '', icon: 'MessageCircle' });
  };

  const handleDeleteKontakItem = (idx: number) => {
    if (confirm('Hapus nomor kontak ini?')) {
      playTapSound();
      const updatedList = kontakList.filter((_, i) => i !== idx);
      setKontakList(updatedList);
      const updated = { ...data, kontak: updatedList };
      persistData(updated, '🗑️ Kontak telah dihapus');
    }
  };

  // Save Group WA
  const handleSaveGroupItem = (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    let updatedList = [...groupWaList];
    if (editingGroupIndex !== null) {
      updatedList[editingGroupIndex] = groupForm;
    } else {
      updatedList.push(groupForm);
    }
    setGroupWaList(updatedList);
    const updated = { ...data, groupWhatsApp: updatedList };
    persistData(updated, '✅ Group WhatsApp berhasil diperbarui!');
    setEditingGroupIndex(null);
    setGroupForm({ namaGroup: '', link: 'https://chat.whatsapp.com/', jumlahMember: '150 Anggota' });
  };

  const handleDeleteGroupItem = (idx: number) => {
    if (confirm('Hapus group WhatsApp ini?')) {
      playTapSound();
      const updatedList = groupWaList.filter((_, i) => i !== idx);
      setGroupWaList(updatedList);
      const updated = { ...data, groupWhatsApp: updatedList };
      persistData(updated, '🗑️ Group WhatsApp telah dihapus');
    }
  };

  // Reset to Factory Default Data
  const handleReset = () => {
    if (confirm('Kembalikan seluruh data Kontak, Alamat & Rekening ke data bawaan madrasah?')) {
      playTapSound();
      persistData(KONTAK_REKENING_DATA, '🔄 Data Kontak & Rekening di-reset ke template resmi');
      setRekeningList(KONTAK_REKENING_DATA.rekeningBank);
      setKontakList(KONTAK_REKENING_DATA.kontak);
      setGroupWaList(KONTAK_REKENING_DATA.groupWhatsApp);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 18
            </span>
            <span className="text-teal-100 text-xs font-semibold">Pusat Informasi & Rekening Resmi</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white">
            18. ALAMAT, KONTAK & NO. REKENING
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
            Alamat Kampus, Hotline Layanan, Tautan Group WhatsApp Wali, & Nomor Rekening Bank
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs text-white">
            <Cloud className="w-4 h-4 text-teal-300 animate-pulse" />
            <span>{cloudStatus === 'synced' ? 'Cloud Terhubung' : 'Offline'}</span>
          </div>

          <button
            onClick={() => window.print()}
            title="Cetak Info Kontak"
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            title="Reset Default Data"
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. ALAMAT LENGKAP & PETA */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 text-rose-600">
            <MapPin className="w-5 h-5" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Alamat Lengkap & Titik Lokasi Kampus
            </h3>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                playTapSound();
                setAlamatForm({
                  namaLembaga: data.namaLembaga,
                  alamatLengkap: data.alamatLengkap,
                  patokan: data.patokan,
                  googleMapsUrl: data.googleMapsUrl
                });
                setIsEditAlamatOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Alamat</span>
            </button>
          )}
        </div>

        <div className="space-y-1.5 text-xs text-slate-700">
          <p className="font-extrabold text-sm text-slate-800">{data.namaLembaga}</p>
          <p className="leading-relaxed">{data.alamatLengkap}</p>
          <p className="text-slate-500 italic">Petunjuk Arah: {data.patokan}</p>
        </div>

        <a
          href={data.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
        >
          <MapPin className="w-4 h-4" />
          <span>Buka di Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 2. NO TELP & HOTLINE LAYANAN */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 text-teal-700">
            <Phone className="w-5 h-5" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Hotline & Layanan WhatsApp Kantor ({kontakList.length})
            </h3>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                playTapSound();
                setIsEditKontakOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-extrabold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Kelola Hotline</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {kontakList.map((k, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-500 block">{k.label}</span>
                <span className="font-mono font-extrabold text-slate-800 text-sm mt-0.5 block">
                  {k.noTelp}
                </span>
              </div>

              <a
                href={`https://wa.me/${k.noTelp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-bold shrink-0 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 3. GROUP WHATSAPP WALI SANTRI */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 text-emerald-700">
            <Users className="w-5 h-5" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Tautan Group WhatsApp Resmi ({groupWaList.length})
            </h3>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                playTapSound();
                setIsEditGroupWaOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Kelola Group WA</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {groupWaList.map((grp, idx) => (
            <div
              key={idx}
              className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <h4 className="font-extrabold text-emerald-950">{grp.namaGroup}</h4>
                <span className="text-[11px] text-emerald-700">{grp.jumlahMember}</span>
              </div>

              <a
                href={grp.link}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Gabung Group</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 4. NOMOR REKENING BANK */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2 text-blue-700">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Nomor Rekening Bank Resmi Madrasah ({rekeningList.length})
            </h3>
          </div>
          {canEdit && (
            <button
              onClick={() => {
                playTapSound();
                setIsEditRekeningOpen(true);
              }}
              className="flex items-center gap-1 text-xs font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Kelola Rekening Bank</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rekeningList.map((rek, idx) => (
            <div
              key={idx}
              className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300">{rek.bank}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Kode: {rek.kodeBank}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] text-slate-400 block">Nomor Rekening:</span>
                  <p className="font-mono font-black text-base tracking-wider text-emerald-300">
                    {rek.nomorRekening}
                  </p>
                </div>
                <div className="text-[11px] text-slate-300">
                  <span>a.n. </span>
                  <strong className="text-white">{rek.atasNama}</strong>
                </div>
                {rek.keterangan && (
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-700/60">
                    {rek.keterangan}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleCopy(rek.nomorRekening)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-white/15 hover:bg-white/25 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer"
              >
                {copiedRekening === rek.nomorRekening ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Nomor</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT ALAMAT */}
      {/* ========================================================================= */}
      {isEditAlamatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">Edit Alamat Lembaga</h3>
              </div>
              <button
                onClick={() => setIsEditAlamatOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlamat} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Nama Lembaga:</label>
                <input
                  type="text"
                  required
                  value={alamatForm.namaLembaga}
                  onChange={(e) => setAlamatForm({ ...alamatForm, namaLembaga: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Alamat Lengkap:</label>
                <textarea
                  rows={3}
                  required
                  value={alamatForm.alamatLengkap}
                  onChange={(e) => setAlamatForm({ ...alamatForm, alamatLengkap: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Petunjuk Arah / Patokan:</label>
                <input
                  type="text"
                  required
                  value={alamatForm.patokan}
                  onChange={(e) => setAlamatForm({ ...alamatForm, patokan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-rose-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Tautan Google Maps URL:</label>
                <input
                  type="text"
                  required
                  value={alamatForm.googleMapsUrl}
                  onChange={(e) => setAlamatForm({ ...alamatForm, googleMapsUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-rose-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditAlamatOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Alamat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: KELOLA REKENING BANK */}
      {/* ========================================================================= */}
      {isEditRekeningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-blue-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">Kelola Nomor Rekening Bank</h3>
              </div>
              <button
                onClick={() => setIsEditRekeningOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Form Input Rekening */}
              <form
                onSubmit={handleSaveRekeningItem}
                className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3"
              >
                <h4 className="font-extrabold text-blue-950">
                  {editingRekIndex !== null ? '✏️ Edit Rekening' : '➕ Tambah Rekening Bank Baru'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Bank:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                      value={rekForm.bank}
                      onChange={(e) => setRekForm({ ...rekForm, bank: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Rekening:</label>
                    <input
                      type="text"
                      required
                      placeholder="719.8822.334"
                      value={rekForm.nomorRekening}
                      onChange={(e) => setRekForm({ ...rekForm, nomorRekening: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono font-bold focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Atas Nama (Rekening):</label>
                    <input
                      type="text"
                      required
                      placeholder="YAYASAN AL-IKHLAS KENDAL"
                      value={rekForm.atasNama}
                      onChange={(e) => setRekForm({ ...rekForm, atasNama: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kode Bank (Transfer):</label>
                    <input
                      type="text"
                      required
                      placeholder="451"
                      value={rekForm.kodeBank}
                      onChange={(e) => setRekForm({ ...rekForm, kodeBank: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peruntukan / Keterangan:</label>
                  <input
                    type="text"
                    placeholder="Pembayaran Syahriyah & Donasi"
                    value={rekForm.keterangan}
                    onChange={(e) => setRekForm({ ...rekForm, keterangan: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-blue-600"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {editingRekIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRekIndex(null);
                        setRekForm({ bank: '', nomorRekening: '', atasNama: '', kodeBank: '451', keterangan: '' });
                      }}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-extrabold cursor-pointer"
                  >
                    {editingRekIndex !== null ? 'Simpan Perubahan' : '+ Tambah ke Daftar'}
                  </button>
                </div>
              </form>

              {/* Daftar Rekening */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-700 block">Daftar Rekening Terdaftar:</span>
                {rekeningList.map((rek, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{rek.bank}</span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-md">
                          {rek.kodeBank}
                        </span>
                      </div>
                      <p className="font-mono font-bold text-blue-700">{rek.nomorRekening}</p>
                      <p className="text-[11px] text-slate-600">a.n. {rek.atasNama}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingRekIndex(idx);
                          setRekForm(rek);
                        }}
                        className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRekeningItem(idx)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: KELOLA HOTLINE KONTAK */}
      {/* ========================================================================= */}
      {isEditKontakOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-teal-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">Kelola Hotline Layanan</h3>
              </div>
              <button
                onClick={() => setIsEditKontakOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
              <form
                onSubmit={handleSaveKontakItem}
                className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-200 space-y-3"
              >
                <h4 className="font-extrabold text-teal-950">
                  {editingKontakIndex !== null ? '✏️ Edit Kontak' : '➕ Tambah Nomor Kontak Baru'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Label Layanan:</label>
                    <input
                      type="text"
                      required
                      placeholder="Kantor Tata Usaha / Hotline Pendaftaran"
                      value={kontakForm.label}
                      onChange={(e) => setKontakForm({ ...kontakForm, label: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp:</label>
                    <input
                      type="text"
                      required
                      placeholder="0812-3456-7890"
                      value={kontakForm.noTelp}
                      onChange={(e) => setKontakForm({ ...kontakForm, noTelp: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono focus:outline-teal-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {editingKontakIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKontakIndex(null);
                        setKontakForm({ label: '', noTelp: '', icon: 'MessageCircle' });
                      }}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-extrabold cursor-pointer"
                  >
                    {editingKontakIndex !== null ? 'Simpan Perubahan' : '+ Tambah Kontak'}
                  </button>
                </div>
              </form>

              {/* List Kontak */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-700 block">Daftar Kontak Hotline:</span>
                {kontakList.map((k, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-extrabold text-slate-900">{k.label}</p>
                      <p className="font-mono font-bold text-teal-700 text-xs">{k.noTelp}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingKontakIndex(idx);
                          setKontakForm(k);
                        }}
                        className="p-1.5 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteKontakItem(idx)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: KELOLA GROUP WA */}
      {/* ========================================================================= */}
      {isEditGroupWaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-300" />
                <h3 className="font-black text-sm sm:text-base">Kelola Group WhatsApp Wali</h3>
              </div>
              <button
                onClick={() => setIsEditGroupWaOpen(false)}
                className="p-1 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
              <form
                onSubmit={handleSaveGroupItem}
                className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3"
              >
                <h4 className="font-extrabold text-emerald-950">
                  {editingGroupIndex !== null ? '✏️ Edit Group' : '➕ Tambah Group WA Baru'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Group:</label>
                    <input
                      type="text"
                      required
                      placeholder="Group WA Wali Santri Kelas 1 - 3"
                      value={groupForm.namaGroup}
                      onChange={(e) => setGroupForm({ ...groupForm, namaGroup: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jumlah Member:</label>
                    <input
                      type="text"
                      required
                      placeholder="150 Anggota"
                      value={groupForm.jumlahMember}
                      onChange={(e) => setGroupForm({ ...groupForm, jumlahMember: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tautan Link WhatsApp:</label>
                  <input
                    type="text"
                    required
                    placeholder="https://chat.whatsapp.com/..."
                    value={groupForm.link}
                    onChange={(e) => setGroupForm({ ...groupForm, link: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  {editingGroupIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGroupIndex(null);
                        setGroupForm({ namaGroup: '', link: 'https://chat.whatsapp.com/', jumlahMember: '150 Anggota' });
                      }}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold cursor-pointer"
                  >
                    {editingGroupIndex !== null ? 'Simpan Perubahan' : '+ Tambah Group'}
                  </button>
                </div>
              </form>

              {/* List Group */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-700 block">Daftar Group WA Resmi:</span>
                {groupWaList.map((grp, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="font-extrabold text-slate-900">{grp.namaGroup}</p>
                      <p className="font-mono text-[11px] text-emerald-700 truncate max-w-xs">{grp.link}</p>
                      <span className="text-[10px] text-slate-500">{grp.jumlahMember}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditingGroupIndex(idx);
                          setGroupForm(grp);
                        }}
                        className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroupItem(idx)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
