// Types for Madrasah Complete System (18 Menus & General Subsystems)

export type MenuId =
  | '1_daftar_hadir'
  | '2_biodata'
  | '3_kopas'
  | '4_dokumentasi'
  | '5_raport'
  | '6_jadwal_seragam_mapel'
  | '7_profile_madrasah'
  | '8_catatan_kegiatan'
  | '9_visi_misi'
  | '10_mutakhorijin'
  | '11_syahriyah'
  | '12_jadwal_tahunan'
  | '13_tata_tertib'
  | '14_syarat_pendaftaran'
  | '15_fasilitas'
  | '16_ekstrakurikuler'
  | '17_prestasi'
  | '18_kontak_rekening';

export type UserRole = 'santri' | 'guru' | 'wali' | 'admin';
export type TabType = 'home' | MenuId | 'quran' | 'akademik' | 'keuangan' | 'profil';

// 1. DAFTAR HADIR
export interface PresensiMuridItem {
  id: string;
  noInduk: string;
  nama: string;
  kelas: string; // 'Kelas 1' s/d 'Kelas 6'
  status: 'Hadir' | 'Sakit' | 'Ijin' | 'Alpha';
  keterangan?: string;
  waktu: string;
  tanggal?: string; // Format YYYY-MM-DD
}

export interface PresensiAsatidzItem {
  id: string;
  niy: string;
  nama: string;
  jabatan: string; // 'Asatidz' | 'Kepala Madrasah' | 'TU Administrasi'
  tugas: string;
  status: 'Hadir' | 'Sakit' | 'Ijin' | 'Alpha' | 'Tugas Luar';
  jamMasuk: string;
  jamPulang: string;
  keterangan?: string;
  tanggal?: string; // Format YYYY-MM-DD
}

// 2. BIODATA
export interface BiodataAsatidz {
  id: string;
  niy: string;
  nama: string;
  foto: string;
  tanggalLahir: string;
  tempatLahir: string;
  alamat: string;
  orangTua: {
    ayah: string;
    ibu: string;
    wali?: string;
  };
  pendidikanTerakhir: string;
  noWa: string;
  tanggalMasuk?: string;
  tanggalMasukMadrasah?: string;
  bidangStudi?: string[];
  bidangStudiYangDiajar?: string[];
  jabatan?: string;
  statusKepegawaian?: string;
}

export interface BiodataMurid {
  id: string;
  noInduk: string;
  nisn?: string;
  nama: string;
  foto: string;
  tanggalLahir: string;
  tempatLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  kelas: string; // 'Kelas 1' s/d 'Kelas 6'
  alamat: string;
  orangTua: {
    ayah: string;
    ibu: string;
    wali?: string;
  };
  noWa: string;
  tanggalMasuk?: string;
  tanggalMasukMadrasah?: string;
  status?: string;
  namaWaliKelas?: string;
}

// 3. KOPERASI SANTRI (KOPAS)
export interface BarangKopas {
  id: string;
  kode: string;
  nama: string;
  kategori: 'ATK' | 'Kitab' | 'Seragam' | 'Perlengkapan' | string;
  harga: number;
  stok: number;
  satuan: string;
  deskripsi?: string;
  foto?: string;
}
export type KopasProduk = BarangKopas;

export interface RiwayatTabunganItem {
  id: string;
  tanggal: string;
  waktu?: string;
  tipe?: 'Setor' | 'Tarik' | string;
  jenis: 'Setor' | 'Tarik';
  nominal: number;
  saldoSebelum?: number;
  saldoSesudah?: number;
  kategori?: string;
  keterangan: string;
  petugas?: string;
  pembayarPenarik?: string;
  idKuitansi?: string;
}

export interface TabunganSantri {
  id: string;
  noInduk: string;
  nisn?: string;
  noRekening?: string;
  namaSantri?: string;
  nama: string;
  kelas: string;
  foto?: string;
  namaWali?: string;
  noWaWali?: string;
  programTabungan?: 'Reguler/Saku' | 'Haflah & Wisuda' | 'Qurban' | 'Kitab & ATK' | string;
  status?: 'Aktif' | 'Nonaktif' | 'Ditutup';
  totalTabungan?: number;
  jumlahTabungan: number;
  terakhirTransaksi?: string;
  terakhirUpdate?: string;
  tanggalBuka?: string;
  riwayat: RiwayatTabunganItem[];
}

// 4. DOKUMENTASI
export interface DokumentasiItem {
  id: string;
  tipe?: 'Foto' | 'Video' | 'File' | string;
  judul: string;
  tanggal: string;
  kategori: string;
  url: string;
  thumbnail?: string;
  thumbnailUrl?: string;
  deskripsi?: string;
  keterangan?: string;
  ukuranFile?: string;
  tipeFile?: string;
}

// 5. RAPORT SANTRI
export interface RaportNilaiItem {
  id?: string;
  namaMapel: string;
  kitab?: string;
  kkm: number;
  nilaiTugas?: number;
  nilaiUjian?: number;
  nilaiAngka: number; // Nilai Akhir (0-100)
  nilaiHuruf: string; // Terbilang (misal: "Delapan Puluh Delapan")
  predikat: string; // "A (Mumtaz)", "B+ (Jayyid Jiddan)", "B (Jayyid)", "C (Maqbul)", "D (Rosib)"
  keterangan: string; // Capaian kompetensi
}

export interface MataPelajaranNilai {
  namaMapel: string;
  kkm: number;
  nilaiTugas: number;
  nilaiUjian: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
}

export interface RaportSantri {
  id: string;
  santriId?: string;
  noInduk: string;
  nisn?: string;
  namaSantri?: string;
  nama: string;
  kelas: string;
  cawu: 'Cawu 1' | 'Cawu 2' | 'Cawu 3' | string;
  tahunAjaran: string;
  semester?: string;
  totalNilai: number;
  rataRata: number;
  peringkat: number;
  totalSantri?: number;
  totalSiswa?: number;
  catatanGuru: string;
  sikapDanAkhlak?: string;
  hafalanJuz?: string;
  nilaiList: RaportNilaiItem[];
  kehadiran?: {
    sakit: number;
    ijin?: number;
    izin?: number;
    alpha?: number;
    alpa?: number;
  };
  ekskul?: Array<{
    kegiatan: string;
    nilai: string;
    keterangan: string;
  }>;
  keputusan?: string;
  namaWaliKelas?: string;
  namaKepalaMadrasah?: string;
  tanggalRaport?: string;
  updatedAt?: string;
  nilaiMapel?: {
    fiqih: MataPelajaranNilai;
    tauhid: MataPelajaranNilai;
    ahlaq: MataPelajaranNilai;
    alquranTajwid: MataPelajaranNilai;
    bArab: MataPelajaranNilai;
    nahwuSorof: MataPelajaranNilai;
    tarikh: MataPelajaranNilai;
    keNUan: MataPelajaranNilai;
    hadist: MataPelajaranNilai;
    imlakPegon: MataPelajaranNilai;
    hafalan: MataPelajaranNilai;
  };
}
export type RaportSantriData = RaportSantri;

export interface JadwalSeragamItem {
  id?: string;
  hari: string;
  seragamSantri: string;
  seragamGuru: string;
  keterangan: string;
  warnaBadge?: string;
}

export interface MapelKTSPItem {
  id?: string;
  kelas: string;
  hari: string;
  mapel: string;
  kitabRujukan: string;
  guruPengajar: string;
  jam: string;
  cawu?: string;
}

// 6. JADWAL SERAGAM & MAPEL KTSP+
export interface JadwalSeragamMapel {
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jum\'at' | 'Sabtu' | 'Ahad' | string;
  seragam: string;
  kodeWarnaSeragam: string;
  jadwalKelas: {
    kelas: string; // 'Kelas 1' s/d 'Kelas 6'
    mapelList: {
      jam: string;
      mapel: string;
      guru: string;
      kitab: string;
    }[];
  }[];
  keteranganPercawu: {
    cawu1: string;
    cawu2: string;
    cawu3: string;
  };
}
export type JadwalSeragamHarian = any;
export type MapelPerCawu = any;

// 7. PROFILE MADRASAH
export interface ProfileMadrasah {
  namaLembaga: string;
  nomorStatistikMadrasah: string;
  npsn: string;
  akreditasi: string;
  sejarahSingkat: string;
  alamat: string;
  pendiri: string;
  kepalaMadrasah: string;
  naungan: string;
}

// 8. CATATAN KEGIATAN
export interface CatatanKegiatanItem {
  id: string;
  hari: string;
  tanggal: string;
  keterangan: string;
  tempat: string;
  penanggungJawab: string;
  status: 'Selesai' | 'Sedang Berlangsung' | 'Akan Datang';
}

// 9. VISI, MISI, TUJUAN
export interface VisiMisiTujuan {
  visi: string;
  misi: string[];
  tujuan: string[];
}

// 10. DAFTAR MUTAKHORIJIN (KELULUSAN)
export interface MutakhorijinItem {
  id: string;
  noIjazah: string;
  nama: string;
  tahunLulus: string;
  angkatan: string;
  pendidikanLanjutan: string;
  alamatSekarang: string;
  prestasiTerbaik?: string;
}

// 11. SYAHRIYAH & ADMINISTRASI
export interface SyahriyahRecord {
  id: string;
  noInduk: string;
  nama: string;
  kelas: string;
  cawu1: {
    status: 'Lunas' | 'Belum';
    tanggalBayar?: string;
    nominal: number;
    kuitansi?: string;
  };
  cawu2: {
    status: 'Lunas' | 'Belum';
    tanggalBayar?: string;
    nominal: number;
    kuitansi?: string;
  };
  cawu3: {
    status: 'Lunas' | 'Belum';
    tanggalBayar?: string;
    nominal: number;
    kuitansi?: string;
  };
}

// 12. JADWAL KEGIATAN TAHUNAN
export interface KegiatanTahunanItem {
  id: string;
  bulan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  namaKegiatan: string;
  kategori: 'PHBI' | 'Imtihan & Ujian' | 'Khutbatul Arsy' | 'Haflah Akhirussanah' | 'Ziarah' | 'Libur' | string;
  keterangan: string;
}

// 13. TATA TERTIB
export interface TataTertibItem {
  id: string;
  kategori: 'Asatidz' | 'Murid';
  bab: string;
  pasal: string;
  isi: string[];
  sanksi?: string[];
}
export type TataTertibPasal = TataTertibItem;

// 14. SYARAT PENDAFTARAN
export interface SyaratPendaftaranData {
  jalurPendaftaran: {
    nama: string;
    periode: string;
    kuota: number;
  }[];
  syaratBerkas: string[];
  rincianBiayaMasuk: {
    item: string;
    nominal: number;
  }[];
  totalBiayaMasuk: number;
}

// 15. FASILITAS
export interface FasilitasItem {
  id: string;
  nama: string;
  kategori: 'Ruang Belajar' | 'Ibadah' | 'Penunjang' | 'Umum' | string;
  jumlah: number;
  kondisi: 'Sangat Baik' | 'Baik' | 'Perlu Perbaikan' | string;
  deskripsi: string;
  foto?: string;
}

// 16. EKSTRAKURIKULER
export interface EkstrakurikulerItem {
  id: string;
  nama: string;
  pembina: string;
  jadwalLatihan: string;
  tempat: string;
  deskripsi: string;
  jumlahAnggota: number;
  foto?: string;
}

// 17. PRESTASI
export interface PrestasiItem {
  id: string;
  namaLomba: string;
  tingkat: 'Kecamatan' | 'Kabupaten' | 'Karesidenan / Wilayah' | 'Provinsi' | 'Nasional' | string;
  juara: string;
  namaPeserta: string;
  tahun: string;
  penyelenggara: string;
  kategori?: string;
  foto?: string;
}

// 18. KONTAK & REKENING
export interface KontakRekeningData {
  namaLembaga: string;
  alamatLengkap: string;
  patokan: string;
  googleMapsUrl: string;
  kontak: {
    label: string;
    noTelp: string;
    tipe: 'WhatsApp' | 'Telepon' | 'Email' | string;
  }[];
  groupWhatsApp: {
    namaGroup: string;
    link: string;
    jumlahMember: string;
  }[];
  rekeningBank: {
    bank: string;
    nomorRekening: string;
    atasNama: string;
    kodeBank: string;
    keterangan: string;
  }[];
}

// Subsystem Models for Compatibility
export interface StudentProfile {
  nis?: string;
  nisn: string;
  name: string;
  class?: string;
  level: string;
  photoUrl: string;
  madrasahName: string;
  address: string;
  phone: string;
  parentName?: string;
  birthDate?: string;
  academicYear?: string;
  gender?: string;
  waliName?: string;
  arabicName?: string;
  points?: number;
  tahfidzProgress: {
    juzMemorized: number;
    targetJuz: number;
    currentSurah: string;
  };
}

export interface TeacherProfile {
  nip: string;
  name: string;
  title: string;
  subject: string;
  classTeacherOf: string;
  photoUrl: string;
  madrasahName: string;
  phone: string;
}

export interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  isNext?: boolean;
}

export interface JadwalItem {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Ahad' | 'Minggu';
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: string;
  guru: string;
  ruang: string;
  iconName: string;
  color?: string;
}

export interface TugasItem {
  id: string;
  mataPelajaran: string;
  guru: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  status: 'belum_selesai' | 'dikirim' | 'dinilai';
  nilai?: number;
  catatanGuru?: string;
  fileAttachment?: string;
}

export interface TagihanItem {
  id: string;
  kategori?: 'SPP' | 'Ujian' | 'Kitab' | 'Seragam' | 'Pembangunan' | string;
  judul: string;
  bulan: string;
  nominal: number;
  jatuhTempo: string;
  status: 'lunas' | 'belum_bayar' | 'jatuh_tempo' | 'belum_lunas' | string;
  tanggalBayar?: string;
  metodePembayaran?: string;
  idTransaksi?: string;
}

export interface MutabaahItem {
  id: string;
  namaIbadah?: string;
  kegiatan?: string;
  kategori: 'Sholat Wajib' | 'Sholat Sunnah' | 'Tilawah & Dzikir' | 'Adab & Akhlak' | string;
  waktu: string;
  isDone: boolean;
  targetCount?: number;
  currentCount?: number;
  iconName?: string;
}

export interface PengumumanItem {
  id: string;
  judul: string;
  tanggal: string;
  kategori: 'Akademik' | 'Kesiswaan' | 'Keagamaan' | 'Umum' | string;
  isi: string;
  ringkasan?: string;
  penulis: string;
  isImportant?: boolean;
  lampiran?: string;
  gambarUrl?: string;
}

export interface PresensiRecord {
  id: string;
  tanggal: string;
  jamMasuk: string;
  jamPulang?: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  lokasi: string;
  jarakMeter?: number;
  keterangan?: string;
  fotoPresensiUrl?: string;
}

export interface TahfidzRecord {
  id: string;
  tanggal: string;
  surah?: string;
  surat?: string;
  ayatMulai?: number;
  ayatSelesai?: number;
  ayat?: string;
  juz?: number;
  kategori?: string;
  nilai?: string;
  penguji?: string;
  ustadz?: string;
  catatan?: string;
}

export interface CBTExam {
  id: string;
  mapel?: string;
  mataPelajaran?: string;
  judul: string;
  durasiMenit: number;
  jumlahSoal: number;
  deadline?: string;
  status: 'tersedia' | 'sedang_dikerjakan' | 'selesai' | 'siap' | string;
  nilai?: number;
  guru: string;
  soalList?: any[];
}

export interface SurahItem {
  number: number;
  name: string;
  arabicName: string;
  translatedName?: string;
  numberOfAyahs: number;
  revelationType: 'Makkiyah' | 'Madaniyah' | 'Makkah' | 'Madinah' | string;
  englishTranslation?: string;
  indonesianTranslation?: string;
  ayahs?: any[];
}

export interface DoaItem {
  id: string;
  judul: string;
  arabic?: string;
  arab?: string;
  latin: string;
  terjemahan?: string;
  terjemah?: string;
  kategori: string;
  riwayat?: string;
}

// ----------------------------------------------------
// HAK AKSES & OTENTIKASI LOGIN (RBAC & AUTHENTICATION)
// ----------------------------------------------------
export type AccessLevel = 'none' | 'read' | 'read_write';

export interface RolePermissions {
  role: UserRole;
  roleName: string;
  badgeColor: string;
  description: string;
  menuAccess: Record<MenuId | string, AccessLevel>;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canExportPdf: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  password?: string;
  identifier?: string; // NIS / NIY / No HP / NIP
  subTitle?: string;
  kelas?: string;
  noWa?: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserAccount;
  role: UserRole;
  loginAt: string;
  isRemembered?: boolean;
}

export interface AccessSecurityConfig {
  allowGuestPreview: boolean;
  sessionTimeoutHours: number;
  requireStrongPin: boolean;
  autoSyncCloud: boolean;
  lastUpdated: string;
}

