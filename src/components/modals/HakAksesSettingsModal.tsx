import React, { useState, useEffect } from 'react';
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
  FileText
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
  { id: '11_syahriyah', number: 11, title: 'Syahriyah & Keuangan', desc: 'SPP, Infaq & Rekap Kas' },
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
    isActive: true,
  });

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
      isActive: true,
    });
    setIsUserFormOpen(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    playTapSound();
    setEditingUserId(user.id);
    setUserFormData({ ...user });
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
      avatarUrl: userFormData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };

    await syncUserAccountToCloud(newUser);
    setUsers(getLocalUserAccounts());
    setIsUserFormOpen(false);
    showToast(`✅ Akun ${newUser.fullName} berhasil disimpan!`);
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
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
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
                          onClick={() => handleToggleUserActive(user)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                            user.isActive
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                          title="Ubah Status Aktif/Nonaktif"
                        >
                          {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>

                        <button
                          onClick={() => handleOpenEditUser(user)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all"
                          title="Edit Akun"
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

      {/* SUB-MODAL: Add / Edit User Form */}
      {isUserFormOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-black text-sm">
                {editingUserId ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsUserFormOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="p-4 sm:p-5 space-y-3">
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
                  <label className="text-xs font-bold text-slate-700 block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="cth: guru_fauzi"
                    value={userFormData.username || ''}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600"
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
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600"
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
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
