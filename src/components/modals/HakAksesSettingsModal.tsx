import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Key,
  Users,
  Lock,
  Unlock,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Cloud,
  Check,
  UserCheck,
  GraduationCap,
  Crown,
  Settings,
  Sparkles,
  Phone,
  HelpCircle,
  FileText,
  Camera,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  User,
  RefreshCw,
} from 'lucide-react';
import {
  UserRole,
  RolePermissions,
  UserAccount,
  AccessSecurityConfig,
  AccessLevel,
  MenuId
} from '../../types';
import {
  getLocalRolePermissions,
  saveLocalRolePermissions,
  syncRolePermissionsToCloud,
  getLocalUserAccounts,
  saveLocalUserAccounts,
  syncUserAccountToCloud,
  deleteUserAccountFromCloud,
  getLocalSecurityConfig,
  saveLocalSecurityConfig
} from '../../services/authService';
import { DEFAULT_ROLE_PERMISSIONS, DEFAULT_USER_ACCOUNTS } from '../../data/defaultAuthData';
import { playTapSound } from '../../utils/audio';

interface HakAksesSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionsUpdated?: () => void;
}

export const AVATAR_PRESETS = [
  {
    category: 'Dewan Asatidz (Ustadz)',
    role: 'guru',
    items: [
      { label: 'Ust. M. Fauzi', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { label: 'Ust. Abdullah', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { label: 'Ust. Mansur', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { label: 'Ust. Ridwan', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80' },
      { label: 'Ust. Hasan', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Dewan Asatidzah (Ustadzah)',
    role: 'guru',
    items: [
      { label: 'Usth. Siti Fatimah', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
      { label: 'Usth. Maryam', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80' },
      { label: 'Usth. Aisyah', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' },
      { label: 'Usth. Nurul', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Santri Putra',
    role: 'santri',
    items: [
      { label: 'Santri Ahmad', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
      { label: 'Santri Farhan', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80' },
      { label: 'Santri Bilal', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80' },
      { label: 'Santri Zaid', url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Santri Putri (Santriwati)',
    role: 'santri',
    items: [
      { label: 'Santriwati Zahra', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      { label: 'Santriwati Nabila', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80' },
      { label: 'Santriwati Khadijah', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      { label: 'Santriwati Salma', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Wali Santri & Pimpinan',
    role: 'wali',
    items: [
      { label: 'H. Budi (Wali Santri)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { label: 'Hj. Siti (Wali Santri)', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      { label: 'H. Ahmad Zaki (Admin)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { label: 'Staf TU Administrasi', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80' },
    ]
  }
];

const MENU_LIST_DEF: { id: MenuId; number: number; title: string; desc: string }[] = [
  { id: '1_daftar_hadir', number: 1, title: 'Daftar Hadir', desc: 'Presensi KBM Murid & Asatidz' },
  { id: '2_biodata', number: 2, title: 'Biodata', desc: 'Data Induk Asatidz & Murid' },
  { id: '3_kopas', number: 3, title: 'Koperasi Santri (KOPAS)', desc: 'ATK, Seragam, Kitab & Tabungan' },
  { id: '4_dokumentasi', number: 4, title: 'Dokumentasi', desc: 'Galeri Foto, Video & File' },
  { id: '5_raport', number: 5, title: 'Raport', desc: 'e-Raport Nilai & Hasil Belajar' },
  { id: '6_jadwal_seragam_mapel', number: 6, title: 'Jadwal Seragam & Mapel', desc: 'Jadwal Harian KBM & Seragam' },
  { id: '7_profile_madrasah', number: 7, title: 'Profile Madrasah', desc: 'Identitas, Legalitas & NSM' },
  { id: '8_catatan_kegiatan', number: 8, title: 'Catatan Kegiatan', desc: 'Jurnal Harian, Rapat & Event' },
  { id: '9_visi_misi', number: 9, title: 'Visi & Misi', desc: 'Tujuan & Strategi Lembaga' },
  { id: '10_mutakhorijin', number: 10, title: 'Mutakhorijin / Alumni', desc: 'Database Alumni & Kiprah' },
  { id: '11_syahriyah', number: 11, title: 'Syahriyah & ADM', desc: 'Syahriyah, ADM & Rekap Kas' },
  { id: '12_jadwal_tahunan', number: 12, title: 'Jadwal Tahunan', desc: 'Kalender Akademik Madrasah' },
  { id: '13_tata_tertib', number: 13, title: 'Tata Tertib', desc: 'Disiplin, Poin & Sanksi Santri' },
  { id: '14_syarat_pendaftaran', number: 14, title: 'Syarat Pendaftaran', desc: 'PPDB & Jalur Penerimaan' },
  { id: '15_fasilitas', number: 15, title: 'Fasilitas Lembaga', desc: 'Sarana Gedung, Lab & Asrama' },
  { id: '16_ekstrakurikuler', number: 16, title: 'Ekstrakurikuler', desc: 'Hadroh, Silat & Kaligrafi' },
  { id: '17_prestasi', number: 17, title: 'Prestasi Madrasah', desc: 'Juara MQK, Porsadin & MTQ' },
  { id: '18_kontak_rekening', number: 18, title: 'Alamat & Rekening', desc: 'Kontak Resmi & Rekening Bank' },
];

export const HakAksesSettingsModal: React.FC<HakAksesSettingsModalProps> = ({
  isOpen,
  onClose,
  onPermissionsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'users' | 'security'>('matrix');
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>(getLocalRolePermissions);
  const [users, setUsers] = useState<UserAccount[]>(getLocalUserAccounts);
  const [securityConfig, setSecurityConfig] = useState<AccessSecurityConfig>(getLocalSecurityConfig);

  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<UserRole>('guru');
  const [searchUserQuery, setSearchUserQuery] = useState<string>('');
  const [filterUserRole, setFilterUserRole] = useState<string>('Semua');

  // Form State for Adding / Editing User
  const [isUserFormOpen, setIsUserFormOpen] = useState<boolean>(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<UserAccount>>({
    username: '',
    fullName: '',
    role: 'santri',
    password: '123456',
    identifier: '',
    subTitle: '',
    kelas: 'Kelas 1',
    noWa: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    isActive: true,
  });

  // Photo Selector State inside Form
  const [photoPickerMode, setPhotoPickerMode] = useState<'preset' | 'upload' | 'url'>('preset');
  const [customPhotoUrlInput, setCustomPhotoUrlInput] = useState<string>('');
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>('Semua');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const formFileInputRef = useRef<HTMLInputElement>(null);

  // Quick Photo Change Modal for direct user card click
  const [quickPhotoUser, setQuickPhotoUser] = useState<UserAccount | null>(null);
  const [quickPhotoUrl, setQuickPhotoUrl] = useState<string>('');
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPermissions(getLocalRolePermissions());
      setUsers(getLocalUserAccounts());
      setSecurityConfig(getLocalSecurityConfig());
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  // Process File to Compressed Data URL
  const processImageFile = (file: File, onDone: (dataUrl: string) => void) => {
    setUploadStatus('Memproses kompresi foto...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 450;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onDone(compressedDataUrl);
        setUploadStatus('✅ Foto berhasil diunggah!');
        setTimeout(() => setUploadStatus(null), 2500);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Handle Changing Menu Access Level for a specific role
  const handleMenuAccessChange = (menuId: MenuId, level: AccessLevel) => {
    playTapSound();
    setPermissions((prev) => {
      const currentRolePerm = prev[selectedRoleForMatrix] || DEFAULT_ROLE_PERMISSIONS[selectedRoleForMatrix];
      const updatedMenuAccess = {
        ...currentRolePerm.menuAccess,
        [menuId]: level,
      };

      const updated = {
        ...prev,
        [selectedRoleForMatrix]: {
          ...currentRolePerm,
          menuAccess: updatedMenuAccess,
        },
      };
      return updated;
    });
  };

  // Toggle Global Permission for Role
  const handleToggleGlobalPerm = (permKey: 'canManageUsers' | 'canManageSettings' | 'canExportPdf') => {
    playTapSound();
    setPermissions((prev) => {
      const currentRolePerm = prev[selectedRoleForMatrix] || DEFAULT_ROLE_PERMISSIONS[selectedRoleForMatrix];
      return {
        ...prev,
        [selectedRoleForMatrix]: {
          ...currentRolePerm,
          [permKey]: !currentRolePerm[permKey],
        },
      };
    });
  };

  // Save All Permissions
  const handleSaveAllPermissions = async () => {
    playTapSound();
    setIsSaving(true);
    try {
      saveLocalRolePermissions(permissions);
      // Sync each role to Firestore
      for (const roleKey of Object.keys(permissions) as UserRole[]) {
        await syncRolePermissionsToCloud(roleKey, permissions[roleKey]);
      }
      setIsSaving(false);
      showToast('✅ Hak Akses Peran berhasil disimpan ke Cloud & Perangkat!');
      if (onPermissionsUpdated) onPermissionsUpdated();
    } catch (err) {
      console.warn('Error saving permissions:', err);
      setIsSaving(false);
      showToast('✅ Hak Akses disimpan secara lokal!');
      if (onPermissionsUpdated) onPermissionsUpdated();
    }
  };

  // Reset to Default Permissions
  const handleResetToDefaultPermissions = () => {
    playTapSound();
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh Hak Akses ke standar madrasah?')) {
      setPermissions(DEFAULT_ROLE_PERMISSIONS);
      saveLocalRolePermissions(DEFAULT_ROLE_PERMISSIONS);
      showToast('🔄 Hak Akses berhasil dikembalikan ke standar default.');
      if (onPermissionsUpdated) onPermissionsUpdated();
    }
  };

  // User Form Handlers
  const handleOpenAddUser = () => {
    playTapSound();
    setEditingUserId(null);
    setUserFormData({
      username: '',
      fullName: '',
      role: 'santri',
      password: '123456',
      identifier: '',
      subTitle: '',
      kelas: 'Kelas 1',
      noWa: '',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      isActive: true,
    });
    setCustomPhotoUrlInput('');
    setPhotoPickerMode('preset');
    setIsUserFormOpen(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    playTapSound();
    setEditingUserId(user.id);
    setUserFormData({ ...user });
    setCustomPhotoUrlInput(user.avatarUrl || '');
    setPhotoPickerMode('preset');
    setIsUserFormOpen(true);
  };

  const handleSaveUserForm = async (e: React.FormEvent) => {
    e.preventDefault();
    playTapSound();
    if (!userFormData.username?.trim() || !userFormData.fullName?.trim()) {
      alert('Username dan Nama Lengkap wajib diisi!');
      return;
    }

    const newUser: UserAccount = {
      id: editingUserId || `user_${Date.now()}`,
      username: userFormData.username.trim().toLowerCase(),
      fullName: userFormData.fullName.trim(),
      role: userFormData.role || 'santri',
      password: userFormData.password || '123456',
      identifier: userFormData.identifier?.trim() || '',
      subTitle: userFormData.subTitle?.trim() || '',
      kelas: userFormData.kelas || '',
      noWa: userFormData.noWa?.trim() || '',
      isActive: userFormData.isActive ?? true,
      createdAt: userFormData.createdAt || new Date().toISOString().split('T')[0],
      avatarUrl: userFormData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    };

    await syncUserAccountToCloud(newUser);
    setUsers(getLocalUserAccounts());
    setIsUserFormOpen(false);
    showToast(`✅ Akun ${newUser.fullName} dengan foto berhasil disimpan!`);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    playTapSound();
    if (userId === 'user_admin_1') {
      alert('Akun Administrator Utama tidak boleh dihapus demi keamanan!');
      return;
    }
    if (window.confirm(`Hapus akun pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      await deleteUserAccountFromCloud(userId);
      setUsers(getLocalUserAccounts());
      showToast(`🗑️ Akun ${userName} berhasil dihapus.`);
    }
  };

  const handleToggleUserActive = async (user: UserAccount) => {
    playTapSound();
    const updated: UserAccount = { ...user, isActive: !user.isActive };
    await syncUserAccountToCloud(updated);
    setUsers(getLocalUserAccounts());
    showToast(`Status akun ${user.fullName} diubah menjadi ${updated.isActive ? 'Aktif' : 'Nonaktif'}.`);
  };

  // Quick Photo Modal Handlers
  const handleOpenQuickPhoto = (user: UserAccount) => {
    playTapSound();
    setQuickPhotoUser(user);
    setQuickPhotoUrl(user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  };

  const handleSaveQuickPhoto = async (newUrl: string) => {
    if (!quickPhotoUser) return;
    playTapSound();
    const updatedUser: UserAccount = {
      ...quickPhotoUser,
      avatarUrl: newUrl,
    };
    await syncUserAccountToCloud(updatedUser);
    setUsers(getLocalUserAccounts());
    setQuickPhotoUser(null);
    showToast(`📸 Foto akun ${updatedUser.fullName} berhasil diperbarui!`);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchRole = filterUserRole === 'Semua' || u.role === filterUserRole;
    const q = searchUserQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.identifier && u.identifier.toLowerCase().includes(q));
    return matchRole && matchQuery;
  });

  const currentRolePerm = permissions[selectedRoleForMatrix] || DEFAULT_ROLE_PERMISSIONS[selectedRoleForMatrix];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-white/20 text-amber-300 px-2 py-0.5 rounded-full border border-white/20">
                  Panel Administrator
                </span>
                <span className="text-xs text-emerald-200 font-semibold">RBAC & Otorisasi</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                Pengaturan Hak Akses & Akun Login
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Tutup Pengaturan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-150">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 overflow-x-auto shrink-0 hide-scrollbar">
          <button
            onClick={() => {
              playTapSound();
              setActiveTab('matrix');
            }}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'matrix'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Matrix Hak Akses Peran (18 Menu)</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('users');
            }}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'users'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span>Manajemen Akun Login ({users.length})</span>
          </button>

          <button
            onClick={() => {
              playTapSound();
              setActiveTab('security');
            }}
            className={`px-4 py-2.5 font-bold text-xs sm:text-sm rounded-t-2xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'security'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Keamanan & Sesi</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* 1. MATRIX TAB */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              {/* Role Selection Chips */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pilih Peran yang Ingin Dikonfigurasi Izin Aksesnya:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Atur izin untuk melihat, mengedit, atau mengunci 18 modul menu madrasah.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                  {(['admin', 'guru', 'wali', 'santri'] as UserRole[]).map((r) => {
                    const isSelected = selectedRoleForMatrix === r;
                    const perm = permissions[r] || DEFAULT_ROLE_PERMISSIONS[r];
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          playTapSound();
                          setSelectedRoleForMatrix(r);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-500/30'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {r === 'admin' && <Crown className="w-3.5 h-3.5 text-amber-300" />}
                        {r === 'guru' && <Users className="w-3.5 h-3.5 text-teal-300" />}
                        {r === 'wali' && <UserCheck className="w-3.5 h-3.5 text-blue-300" />}
                        {r === 'santri' && <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />}
                        <span>{r}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Role Summary Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base text-amber-300">
                      {currentRolePerm.roleName}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-md">
                      Role: {selectedRoleForMatrix}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {currentRolePerm.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleResetToDefaultPermissions}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Kembalikan ke Default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>

                  <button
                    onClick={handleSaveAllPermissions}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Izin'}</span>
                  </button>
                </div>
              </div>

              {/* Global Permissions Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div
                  onClick={() => handleToggleGlobalPerm('canManageUsers')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentRolePerm.canManageUsers
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold">Kelola Akun Pengguna</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentRolePerm.canManageUsers || false}
                    readOnly
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </div>

                <div
                  onClick={() => handleToggleGlobalPerm('canManageSettings')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentRolePerm.canManageSettings
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold">Ubah Pengaturan Aplikasi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentRolePerm.canManageSettings || false}
                    readOnly
                    className="w-4 h-4 accent-teal-600 rounded"
                  />
                </div>

                <div
                  onClick={() => handleToggleGlobalPerm('canExportPdf')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    currentRolePerm.canExportPdf
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Cetak / Ekspor PDF</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentRolePerm.canExportPdf || false}
                    readOnly
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                </div>
              </div>

              {/* Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 w-12 text-center">No</th>
                        <th className="p-3">Nama Menu & Deskripsi</th>
                        <th className="p-3 text-center w-32">Izin Akses Saat Ini</th>
                        <th className="p-3 text-center w-64">Pilihan Hak Akses</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MENU_LIST_DEF.map((m) => {
                        const level: AccessLevel = currentRolePerm.menuAccess?.[m.id] ?? 'read';
                        return (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 text-center font-bold text-slate-400 font-mono">
                              {m.number}
                            </td>
                            <td className="p-3">
                              <div className="font-extrabold text-slate-800">{m.title}</div>
                              <div className="text-[11px] text-slate-400">{m.desc}</div>
                            </td>
                            <td className="p-3 text-center">
                              {level === 'read_write' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Edit3 className="w-3 h-3" />
                                  <span>Baca & Tulis</span>
                                </span>
                              )}
                              {level === 'read' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl bg-blue-100 text-blue-800 border border-blue-200">
                                  <Eye className="w-3 h-3" />
                                  <span>Hanya Lihat</span>
                                </span>
                              )}
                              {level === 'none' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
                                  <Lock className="w-3 h-3" />
                                  <span>Terkunci</span>
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() => handleMenuAccessChange(m.id, 'read_write')}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                                    level === 'read_write'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                  title="Izinkan melihat dan mengedit data"
                                >
                                  Tulis/Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMenuAccessChange(m.id, 'read')}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                                    level === 'read'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                  title="Hanya izinkan melihat data (read-only)"
                                >
                                  Lihat
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMenuAccessChange(m.id, 'none')}
                                  className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                                    level === 'none'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'text-slate-600 hover:bg-slate-200'
                                  }`}
                                  title="Kunci menu untuk peran ini"
                                >
                                  Kunci
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. USERS MANAGEMENT TAB */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Filter & Action Toolbar */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama / username / NIS..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-medium"
                    />
                  </div>

                  <select
                    value={filterUserRole}
                    onChange={(e) => setFilterUserRole(e.target.value)}
                    className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 focus:outline-emerald-600 cursor-pointer"
                  >
                    <option value="Semua">Semua Peran</option>
                    <option value="admin">Admin</option>
                    <option value="guru">Asatidz</option>
                    <option value="wali">Wali Santri</option>
                    <option value="santri">Santri</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddUser}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Akun Baru</span>
                </button>
              </div>

              {/* Users List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`bg-white rounded-2xl border p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 ${
                      user.isActive ? 'border-slate-200' : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar with Quick Photo Change Overlay */}
                      <div 
                        onClick={() => handleOpenQuickPhoto(user)}
                        className="relative group w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-emerald-500/30 shrink-0 cursor-pointer shadow-xs"
                        title="Klik untuk ganti foto profil akun"
                      >
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                          alt={user.fullName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <Camera className="w-4 h-4" />
                          <span className="text-[8px] font-bold mt-0.5">Ubah</span>
                        </div>
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-800 truncate">
                            {user.fullName}
                          </h4>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full capitalize ${
                              user.role === 'admin'
                                ? 'bg-rose-100 text-rose-800'
                                : user.role === 'guru'
                                ? 'bg-teal-100 text-teal-800'
                                : user.role === 'wali'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                          <span>@{user.username}</span>
                          {user.identifier && (
                            <>
                              <span>•</span>
                              <span>{user.identifier}</span>
                            </>
                          )}
                        </div>

                        {user.subTitle && (
                          <div className="text-[11px] text-slate-400 truncate">
                            {user.subTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span className="text-[11px] font-semibold text-slate-500">
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          (PIN: {user.password || '123456'})
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenQuickPhoto(user)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                          title="Ganti Foto Profil"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Foto</span>
                        </button>

                        <button
                          onClick={() => handleToggleUserActive(user)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            user.isActive
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                          title="Ubah Status Aktif/Nonaktif"
                        >
                          {user.isActive ? 'Nonaktif' : 'Aktif'}
                        </button>

                        <button
                          onClick={() => handleOpenEditUser(user)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
                          title="Edit Lengkap Akun"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {user.id !== 'user_admin_1' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.fullName)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-all"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SECURITY & SESSION TAB */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Kebijakan Keamanan & Sesi Login Madrasah</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Masa Berlaku Sesi Login (Auto-Logout):
                    </label>
                    <select
                      value={securityConfig.sessionTimeoutHours}
                      onChange={(e) => {
                        const updated = {
                          ...securityConfig,
                          sessionTimeoutHours: Number(e.target.value),
                        };
                        setSecurityConfig(updated);
                        saveLocalSecurityConfig(updated);
                        showToast('✅ Pengaturan masa aktif sesi berhasil diperbarui.');
                      }}
                      className="w-full sm:w-72 text-xs bg-slate-50 border border-slate-300 rounded-xl p-2 font-medium"
                    >
                      <option value={12}>12 Jam (Sangat Ketat)</option>
                      <option value={24}>24 Jam (1 Hari)</option>
                      <option value={72}>72 Jam (3 Hari - Rekomendasi)</option>
                      <option value={168}>7 Hari (1 Minggu)</option>
                      <option value={720}>30 Hari (1 Bulan)</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Izinkan Mode Pratinjau Cepat Tamu
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Memungkinkan pergantian peran cepat tanpa logout penuh saat demonstrasi / evaluasi KBM.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityConfig.allowGuestPreview}
                      onChange={(e) => {
                        const updated = {
                          ...securityConfig,
                          allowGuestPreview: e.target.checked,
                        };
                        setSecurityConfig(updated);
                        saveLocalSecurityConfig(updated);
                        showToast('✅ Pengaturan mode pratinjau diperbarui.');
                      }}
                      className="w-5 h-5 accent-emerald-600 rounded"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Sinkronisasi Otomatis Cloud Firestore
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Menyimpan perubahan hak akses dan akun login langsung ke database cloud madrasah.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityConfig.autoSyncCloud}
                      onChange={(e) => {
                        const updated = {
                          ...securityConfig,
                          autoSyncCloud: e.target.checked,
                        };
                        setSecurityConfig(updated);
                        saveLocalSecurityConfig(updated);
                      }}
                      className="w-5 h-5 accent-emerald-600 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Security Audit Card */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <div className="font-extrabold">Tips Keamanan Madrasah Digital:</div>
                  <p className="leading-relaxed">
                    1. Selalu ganti password default <code className="bg-emerald-200/60 px-1 py-0.2 rounded font-mono">123456</code> untuk akun Kepala Madrasah dan Bendahara Syahriyah.
                  </p>
                  <p className="leading-relaxed">
                    2. Batasi izin Tulis/Edit modul e-Raport dan Biodata hanya untuk Dewan Asatidz dan Admin TU.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Cloud className="w-4 h-4 text-emerald-600" />
            <span>Tersinkronisasi Realtime dengan Cloud Firestore</span>
          </div>

          <button
            onClick={() => {
              playTapSound();
              onClose();
            }}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* SUB-MODAL: Add / Edit User Form with Full Photo Management */}
      {isUserFormOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm">
                    {editingUserId ? 'Edit Akun & Foto Pengguna' : 'Tambah Akun Pengguna Baru'}
                  </h3>
                  <p className="text-[11px] text-emerald-100">Kredensial login & foto profil madrasah</p>
                </div>
              </div>
              <button
                onClick={() => setIsUserFormOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              {/* SECTION: FOTO PROFIL / AVATAR */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Foto Profil Akun</span>
                  </label>
                  {uploadStatus && (
                    <span className="text-[10px] font-bold text-emerald-700 animate-pulse">
                      {uploadStatus}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
                  {/* Avatar Preview */}
                  <div className="relative group w-20 h-20 rounded-2xl bg-white border-2 border-emerald-600/40 shadow-sm overflow-hidden shrink-0">
                    <img
                      src={userFormData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                      alt="Preview Foto"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => formFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-[9px] font-bold mt-0.5">Unggah</span>
                    </button>
                  </div>

                  {/* Photo Controls */}
                  <div className="flex-1 w-full space-y-2">
                    {/* Mode Tabs */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-200/80 p-1 rounded-xl text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setPhotoPickerMode('preset')}
                        className={`py-1 rounded-lg transition-all cursor-pointer ${
                          photoPickerMode === 'preset'
                            ? 'bg-white text-emerald-800 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Galeri Avatar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPickerMode('upload');
                          formFileInputRef.current?.click();
                        }}
                        className={`py-1 rounded-lg transition-all cursor-pointer ${
                          photoPickerMode === 'upload'
                            ? 'bg-white text-emerald-800 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Unggah File
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhotoPickerMode('url')}
                        className={`py-1 rounded-lg transition-all cursor-pointer ${
                          photoPickerMode === 'url'
                            ? 'bg-white text-emerald-800 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Link URL
                      </button>
                    </div>

                    {/* Mode 1: Presets */}
                    {photoPickerMode === 'preset' && (
                      <div className="space-y-2">
                        {/* Category filter */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 hide-scrollbar">
                          {['Semua', 'Dewan Asatidz (Ustadz)', 'Dewan Asatidzah (Ustadzah)', 'Santri Putra', 'Santri Putri (Santriwati)', 'Wali Santri & Pimpinan'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedPresetCategory(cat)}
                              className={`px-2 py-0.5 rounded-lg text-[9px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                                selectedPresetCategory === cat
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-white text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {cat === 'Semua' ? 'Semua' : cat.split(' ')[0]}
                            </button>
                          ))}
                        </div>

                        {/* Presets Grid */}
                        <div className="grid grid-cols-5 gap-1.5 max-h-28 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                          {AVATAR_PRESETS.filter((group) =>
                            selectedPresetCategory === 'Semua' ? true : group.category === selectedPresetCategory
                          ).flatMap((group) => group.items).map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                playTapSound();
                                setUserFormData((prev) => ({ ...prev, avatarUrl: item.url }));
                              }}
                              className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                                userFormData.avatarUrl === item.url
                                  ? 'border-emerald-600 ring-2 ring-emerald-400/50'
                                  : 'border-transparent hover:border-slate-300'
                              }`}
                              title={item.label}
                            >
                              <img
                                src={item.url}
                                alt={item.label}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {userFormData.avatarUrl === item.url && (
                                <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center text-white">
                                  <Check className="w-3.5 h-3.5 drop-shadow" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mode 2: Upload File */}
                    {photoPickerMode === 'upload' && (
                      <div className="space-y-1.5">
                        <input
                          ref={formFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              processImageFile(file, (dataUrl) => {
                                setUserFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
                              });
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => formFileInputRef.current?.click()}
                          className="w-full py-2 px-3 border border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Galeri / Kamera</span>
                        </button>
                        <p className="text-[10px] text-slate-400 text-center">
                          Format JPG/PNG/WebP otomatis dikompresi untuk performa optimal.
                        </p>
                      </div>
                    )}

                    {/* Mode 3: Custom URL */}
                    {photoPickerMode === 'url' && (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={customPhotoUrlInput}
                          onChange={(e) => setCustomPhotoUrlInput(e.target.value)}
                          className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customPhotoUrlInput.trim()) {
                              setUserFormData((prev) => ({ ...prev, avatarUrl: customPhotoUrlInput.trim() }));
                              showToast('✅ Link URL foto diterapkan!');
                            }
                          }}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Terapkan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="cth: Ust. Ahmad Fauzi, S.Pd.I"
                  value={userFormData.fullName || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: guru_fauzi"
                    value={userFormData.username || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Peran (Role)</label>
                  <select
                    value={userFormData.role || 'santri'}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as UserRole })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600 font-bold"
                  >
                    <option value="santri">Santri</option>
                    <option value="guru">Dewan Asatidz</option>
                    <option value="wali">Wali Santri</option>
                    <option value="admin">Admin / TU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Password / PIN</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: 123456"
                    value={userFormData.password || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">No Induk (NIS/NIY)</label>
                  <input
                    type="text"
                    placeholder="cth: 2024001"
                    value={userFormData.identifier || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, identifier: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Keterangan / Jabatan / Kelas</label>
                <input
                  type="text"
                  placeholder="cth: Wali Kelas 6 / Santri Kelas 5"
                  value={userFormData.subTitle || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, subTitle: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  placeholder="cth: 081234567890"
                  value={userFormData.noWa || ''}
                  onChange={(e) => setUserFormData({ ...userFormData, noWa: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 shrink-0 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Akun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: Quick Photo Change Modal */}
      {quickPhotoUser && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm">Ganti Foto Profil Akun</h3>
                  <p className="text-[11px] text-emerald-100 truncate max-w-[200px]">
                    {quickPhotoUser.fullName} (@{quickPhotoUser.username})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickPhotoUser(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {/* Photo Big Preview */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 border-4 border-emerald-500/40 shadow-md overflow-hidden">
                  <img
                    src={quickPhotoUrl}
                    alt={quickPhotoUser.fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-xs font-bold text-slate-700">{quickPhotoUser.fullName}</span>
              </div>

              {/* Upload Action */}
              <input
                ref={quickFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    processImageFile(file, (dataUrl) => {
                      setQuickPhotoUrl(dataUrl);
                    });
                  }
                }}
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => quickFileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah dari Galeri / Kamera</span>
                </button>
              </div>

              {/* Quick Presets Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 block">
                  Atau Pilih Avatar Siap Pakai:
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVATAR_PRESETS.flatMap((g) => g.items).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        playTapSound();
                        setQuickPhotoUrl(item.url);
                      }}
                      className={`relative group rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                        quickPhotoUrl === item.url
                          ? 'border-emerald-600 ring-2 ring-emerald-400/50 scale-95'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                      title={item.label}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {quickPhotoUrl === item.url && (
                        <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickPhotoUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveQuickPhoto(quickPhotoUrl)}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
