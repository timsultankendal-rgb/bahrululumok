import {
  PresensiMuridItem,
  PresensiAsatidzItem,
  BiodataAsatidz,
  BiodataMurid,
  KopasProduk,
  TabunganSantri,
  DokumentasiItem,
  RaportSantriData,
  JadwalSeragamHarian,
  MapelPerCawu,
  CatatanKegiatanItem,
  MutakhorijinItem,
  SyahriyahRecord,
  KegiatanTahunanItem,
  TataTertibPasal,
  FasilitasItem,
  EkstrakurikulerItem,
  PrestasiItem
} from '../types';

// =========================================================================
// 1. DAFTAR HADIR
// =========================================================================
export const DAFTAR_HADIR_MURID: PresensiMuridItem[] = [
  { id: 'pres-m1', noInduk: '2024.01.001', nama: 'Ahmad Faiz Al-Faruq', kelas: 'Kelas 1', status: 'Hadir', waktu: '06:45 WIB' },
  { id: 'pres-m2', noInduk: '2024.01.002', nama: 'Siti Nur Aisyah', kelas: 'Kelas 1', status: 'Hadir', waktu: '06:50 WIB' },
  { id: 'pres-m3', noInduk: '2024.01.003', nama: 'Muhammad Bilal Habibi', kelas: 'Kelas 1', status: 'Sakit', keterangan: 'Demam panas', waktu: '07:05 WIB' },
  { id: 'pres-m4', noInduk: '2023.02.015', nama: 'Fathir Azzam Robbani', kelas: 'Kelas 2', status: 'Hadir', waktu: '06:40 WIB' },
  { id: 'pres-m5', noInduk: '2023.02.016', nama: 'Khadijah Zahra', kelas: 'Kelas 2', status: 'Ijin', keterangan: 'Acara keluarga', waktu: '07:00 WIB' },
  { id: 'pres-m6', noInduk: '2022.03.021', nama: 'Zaidan Ahsanul Hadi', kelas: 'Kelas 3', status: 'Hadir', waktu: '06:42 WIB' },
  { id: 'pres-m7', noInduk: '2022.03.022', nama: 'Nailah Putri Ramadhani', kelas: 'Kelas 3', status: 'Hadir', waktu: '06:55 WIB' },
  { id: 'pres-m8', noInduk: '2021.04.030', nama: 'Muhammad Rayhan Pratama', kelas: 'Kelas 4', status: 'Hadir', waktu: '06:35 WIB' },
  { id: 'pres-m9', noInduk: '2021.04.031', nama: 'Salma Aqila Mumtazah', kelas: 'Kelas 4', status: 'Hadir', waktu: '06:48 WIB' },
  { id: 'pres-m10', noInduk: '2020.05.045', nama: 'Ibrahim Malik Al-Kindi', kelas: 'Kelas 5', status: 'Alpha', keterangan: 'Tanpa konfirmasi', waktu: '-' },
  { id: 'pres-m11', noInduk: '2020.05.046', nama: 'Zulfa Hanifah', kelas: 'Kelas 5', status: 'Hadir', waktu: '06:52 WIB' },
  { id: 'pres-m12', noInduk: '2019.06.050', nama: 'Muhammad Hilman Farisi', kelas: 'Kelas 6', status: 'Hadir', waktu: '06:30 WIB' },
  { id: 'pres-m13', noInduk: '2019.06.051', nama: 'Maryam Al-Adawiyah', kelas: 'Kelas 6', status: 'Hadir', waktu: '06:45 WIB' }
];

export const DAFTAR_HADIR_ASATIDZ: PresensiAsatidzItem[] = [
  { id: 'pres-g1', niy: '2015.01.001', nama: 'KH. Abdullah Syukri, Lc.', jabatan: 'Kepala Madrasah', tugas: 'Pimpinan & Pembina', status: 'Hadir', jamMasuk: '06:30 WIB', jamPulang: '16:30 WIB' },
  { id: 'pres-g2', niy: '2017.02.008', nama: 'Ustadz Ahmad Mufid, M.Pd.I.', jabatan: 'Asatidz', tugas: 'Fiqih & Wali Kelas 4', status: 'Hadir', jamMasuk: '06:40 WIB', jamPulang: '15:30 WIB' },
  { id: 'pres-g3', niy: '2018.03.012', nama: 'Ustadzah Siti Fatimah, S.Pd.I.', jabatan: 'Asatidz', tugas: 'Nahwu-Sorof & B. Arab', status: 'Hadir', jamMasuk: '06:45 WIB', jamPulang: '15:30 WIB' },
  { id: 'pres-g4', niy: '2019.04.015', nama: 'Ustadz Ridwan Hakim, S.Ag.', jabatan: 'Asatidz', tugas: 'Al-Qur\'an Tajwid & Hadist', status: 'Ijin', jamMasuk: '-', jamPulang: '-', keterangan: 'Menghadiri Bahtsul Masail Kemenag' },
  { id: 'pres-g5', niy: '2020.05.020', nama: 'Ustadz Muhammad Zainuri, S.Pd.', jabatan: 'TU Administrasi', tugas: 'Kepala Tata Usaha & Kesiswaan', status: 'Hadir', jamMasuk: '06:35 WIB', jamPulang: '16:00 WIB' },
  { id: 'pres-g6', niy: '2021.06.024', nama: 'Ustadzah Nur Laili, S.E.', jabatan: 'TU Administrasi', tugas: 'Bendahara Syahriyah & KOPAS', status: 'Hadir', jamMasuk: '06:40 WIB', jamPulang: '16:00 WIB' }
];

// =========================================================================
// 2. BIODATA
// =========================================================================
export const BIODATA_ASATIDZ_LIST: BiodataAsatidz[] = [
  {
    id: 'ast-1',
    niy: '2015.01.001',
    nama: 'KH. Abdullah Syukri, Lc., M.A.',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '14 Agustus 1978',
    tempatLahir: 'Kendal',
    alamat: 'Jl. Pesantren No. 09 RT 03/RW 02, Pegandon, Kendal, Jawa Tengah',
    orangTua: {
      ayah: 'KH. Ahmad Dahlan (Alm)',
      ibu: 'Hj. Siti Ruqoyyah'
    },
    pendidikanTerakhir: 'S2 Dirasat Islamiyah - Universitas Al-Azhar Kairo Mesir',
    noWa: '0812-3456-7891',
    tanggalMasukMadrasah: '01 Juli 2015',
    bidangStudiYangDiajar: ['Fiqih Muamalah', 'Tafsir Jalalain', 'Ushul Fiqih'],
    jabatan: 'Kepala Madrasah Diniyah'
  },
  {
    id: 'ast-2',
    niy: '2017.02.008',
    nama: 'Ustadz Ahmad Mufid, M.Pd.I.',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '12 April 1985',
    tempatLahir: 'Semarang',
    alamat: 'Desa Krajan Kulon RT 01/RW 04, Kaliwungu, Kendal',
    orangTua: {
      ayah: 'H. Mustofa',
      ibu: 'Hj. Munawaroh'
    },
    pendidikanTerakhir: 'S2 Pendidikan Agama Islam - UIN Walisongo Semarang',
    noWa: '0813-9876-5432',
    tanggalMasukMadrasah: '15 Juli 2017',
    bidangStudiYangDiajar: ['Fiqih Ibadah', 'Tauhid Fathul Majid', 'Ahlaqul Banin'],
    jabatan: 'Wakil Kepala Bidang Kurikulum & Wali Kelas 4'
  },
  {
    id: 'ast-3',
    niy: '2018.03.012',
    nama: 'Ustadzah Siti Fatimah, S.Pd.I.',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '25 November 1990',
    tempatLahir: 'Kudus',
    alamat: 'Komplek Pondok Putri Al-Ikhlas No. 12, Kendal',
    orangTua: {
      ayah: 'H. Sholeh Abdul Ghoni',
      ibu: 'Hj. Zubaidah'
    },
    pendidikanTerakhir: 'S1 Pendidikan Bahasa Arab - Ma\'had Aly TBS Kudus',
    noWa: '0815-7766-5544',
    tanggalMasukMadrasah: '02 Januari 2018',
    bidangStudiYangDiajar: ['Nahwu Al-Jurumiyyah', 'Sorof Amtsilah Tashrifiyyah', 'Bahasa Arab'],
    jabatan: 'Koordinator Bahasa & Pembina Tahfidz Putri'
  },
  {
    id: 'ast-4',
    niy: '2019.04.015',
    nama: 'Ustadz Ridwan Hakim, S.Ag.',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '08 Juni 1988',
    tempatLahir: 'Pekalongan',
    alamat: 'Jl. Kyai Asyari No. 45, Weleri, Kendal',
    orangTua: {
      ayah: 'Kyai Mansyur',
      ibu: 'Nyai Hj. Marwiyah'
    },
    pendidikanTerakhir: 'S1 Ilmu Al-Qur\'an dan Tafsir - PTIQ Jakarta',
    noWa: '0857-1122-3344',
    tanggalMasukMadrasah: '10 Juli 2019',
    bidangStudiYangDiajar: ['Al-Qur\'an Tajwid Tuhfatul Athfal', 'Hadits Arba\'in Nawawi', 'Imlak & Pegon'],
    jabatan: 'Pembina Qiro\'ah & Seni Kaligrafi Islam'
  },
  {
    id: 'ast-5',
    niy: '2020.05.020',
    nama: 'Ustadz Muhammad Zainuri, S.Pd.',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '19 September 1993',
    tempatLahir: 'Kendal',
    alamat: 'Kelurahan Patukangan RT 02/RW 01, Kota Kendal',
    orangTua: {
      ayah: 'Bpk. Subari',
      ibu: 'Ibu Aminah'
    },
    pendidikanTerakhir: 'S1 Manajemen Pendidikan Islam - UNISSULA Semarang',
    noWa: '0896-5544-3322',
    tanggalMasukMadrasah: '01 Juli 2020',
    bidangStudiYangDiajar: ['Ke-NU-an / Aswaja', 'Tarikh Khulafaur Rasyidin'],
    jabatan: 'Kepala Tata Usaha & Administrasi Madrasah'
  }
];

export const BIODATA_MURID_LIST: BiodataMurid[] = [
  {
    id: 'mrd-1',
    noInduk: '2024.01.001',
    nisn: '3145678901',
    nama: 'Ahmad Faiz Al-Faruq',
    foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '10 Mei 2017',
    tempatLahir: 'Kendal',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 1',
    alamat: 'Jl. Pahlawan No. 42, RT 02/RW 03, Sukorejo, Kendal',
    orangTua: {
      ayah: 'H. Lukman Hakim, S.T.',
      ibu: 'Hj. Anis Sulistiawati'
    },
    noWa: '0812-4455-6677',
    tanggalMasukMadrasah: '15 Juli 2024',
    status: 'Aktif'
  },
  {
    id: 'mrd-2',
    noInduk: '2023.02.015',
    nisn: '3134567892',
    nama: 'Fathir Azzam Robbani',
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '21 Agustus 2016',
    tempatLahir: 'Semarang',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 2',
    alamat: 'Desa Magelung RT 04/RW 01, Kaliwungu Selatan, Kendal',
    orangTua: {
      ayah: 'Drs. Supriyanto',
      ibu: 'Ibu Ratna Juwita'
    },
    noWa: '0813-8899-0011',
    tanggalMasukMadrasah: '17 Juli 2023',
    status: 'Aktif'
  },
  {
    id: 'mrd-3',
    noInduk: '2022.03.021',
    nisn: '3123456783',
    nama: 'Zaidan Ahsanul Hadi',
    foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '04 Februari 2015',
    tempatLahir: 'Kendal',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 3',
    alamat: 'Dusun Jetis RT 02/RW 05, Plantungan, Kendal',
    orangTua: {
      ayah: 'Bpk. Mahfudz Shiddiq',
      ibu: 'Ibu Sri Wahyuni'
    },
    noWa: '0858-1234-5678',
    tanggalMasukMadrasah: '18 Juli 2022',
    status: 'Aktif'
  },
  {
    id: 'mrd-4',
    noInduk: '2021.04.030',
    nisn: '0089241890',
    nama: 'Muhammad Rayhan Pratama',
    foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '16 September 2014',
    tempatLahir: 'Kendal',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 4',
    alamat: 'Jl. Raya Soekarno-Hatta No. 128, RT 01/RW 06, Kendal',
    orangTua: {
      ayah: 'H. Bambang Setyawan, S.E.',
      ibu: 'Hj. Nurul Inayah'
    },
    noWa: '0812-3456-7890',
    tanggalMasukMadrasah: '12 Juli 2021',
    status: 'Aktif'
  },
  {
    id: 'mrd-5',
    noInduk: '2020.05.045',
    nisn: '3101234565',
    nama: 'Ibrahim Malik Al-Kindi',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '11 November 2013',
    tempatLahir: 'Batang',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 5',
    alamat: 'Desa Mororejo RT 03/RW 02, Kaliwungu, Kendal',
    orangTua: {
      ayah: 'Bpk. Agus Santoso',
      ibu: 'Ibu Maryani'
    },
    noWa: '0877-2233-4455',
    tanggalMasukMadrasah: '13 Juli 2020',
    status: 'Aktif'
  },
  {
    id: 'mrd-6',
    noInduk: '2019.06.050',
    nisn: '3099876546',
    nama: 'Muhammad Hilman Farisi',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
    tanggalLahir: '03 Maret 2012',
    tempatLahir: 'Kendal',
    jenisKelamin: 'Laki-laki',
    kelas: 'Kelas 6',
    alamat: 'Jl. Tentara Pelajar No. 88, Kebondalem, Kendal',
    orangTua: {
      ayah: 'K.H. Masruri Yusuf',
      ibu: 'Hj. Kholisoh'
    },
    noWa: '0813-7788-9900',
    tanggalMasukMadrasah: '15 Juli 2019',
    status: 'Aktif'
  }
];

// =========================================================================
// 3. KOPERASI SANTRI (KOPAS)
// =========================================================================
export const KOPAS_PRODUK_LIST: KopasProduk[] = [
  // Kitab-Kitab
  { id: 'kop-1', kode: 'KTB-001', kategori: 'Kitab', nama: 'Kitab Safinatun Najah (Fiqih Dasar)', harga: 15000, stok: 60, satuan: 'Buku', deskripsi: 'Matan Safinatun Najah dengan makna gandul Pegon Jawa' },
  { id: 'kop-2', kode: 'KTB-002', kategori: 'Kitab', nama: 'Kitab Fathul Qorib Al-Mujib (Fiqih Lengkap)', harga: 45000, stok: 35, satuan: 'Buku', deskripsi: 'Karya Syaikh Muhammad Ibnu Qasim Al-Ghazi' },
  { id: 'kop-3', kode: 'KTB-003', kategori: 'Kitab', nama: 'Kitab Matan Al-Jurumiyyah (Nahwu)', harga: 18000, stok: 50, satuan: 'Buku', deskripsi: 'Kaidah tata bahasa Arab dasar untuk pemula' },
  { id: 'kop-4', kode: 'KTB-004', kategori: 'Kitab', nama: 'Kitab Al-Amtsilah At-Tashrifiyyah (Sorof)', harga: 22000, stok: 45, satuan: 'Buku', deskripsi: 'Kaidah perubahan bentuk kata bahasa Arab karya KH. Ma\'shum Ali' },
  { id: 'kop-5', kode: 'KTB-005', kategori: 'Kitab', nama: 'Kitab Aqidatul Awam (Nadhom Tauhid)', harga: 14000, stok: 70, satuan: 'Buku', deskripsi: 'Nadhom aqidah 50 karya Sayyid Ahmad Al-Marzuqi' },
  { id: 'kop-6', kode: 'KTB-006', kategori: 'Kitab', nama: 'Kitab Ahlaqul Banin / Banat Juz 1-3', harga: 25000, stok: 40, satuan: 'Buku', deskripsi: 'Budi pekerti luhur santri karya Ustadz Umar Baradja' },
  { id: 'kop-7', kode: 'KTB-007', kategori: 'Kitab', nama: 'Kitab Tuhfatul Athfal & Jazariyyah (Tajwid)', harga: 20000, stok: 55, satuan: 'Buku', deskripsi: 'Nadhom ilmu tajwid Al-Qur\'an lengkap' },
  { id: 'kop-8', kode: 'KTB-008', kategori: 'Kitab', nama: 'Kitab Hadits Arba\'in An-Nawawiyyah', harga: 20000, stok: 48, satuan: 'Buku', deskripsi: 'Kumpulan 42 Hadits Pokok Islam karya Imam An-Nawawi' },
  { id: 'kop-9', kode: 'KTB-009', kategori: 'Kitab', nama: 'Al-Qur\'an Pojok Kudus Menara 15 Baris', harga: 75000, stok: 30, satuan: 'Eksemplar', deskripsi: 'Mushaf standar hafalan santri Jawa Tengah' },
  
  // ATK
  { id: 'kop-10', kode: 'ATK-001', kategori: 'ATK', nama: 'Buku Tulis Pegon Garis Khusus Makna 38 Lbr', harga: 6000, stok: 200, satuan: 'Buku', deskripsi: 'Buku tulis bergaris ganda untuk nulis pegon Arab Jawa' },
  { id: 'kop-11', kode: 'ATK-002', kategori: 'ATK', nama: 'Pulpen Kaligrafi Khat / Spidol Snowman 2.0', harga: 8000, stok: 120, satuan: 'Pcs', deskripsi: 'Ujung miring khusus menulis arab dan makna gandul' },
  { id: 'kop-12', kode: 'ATK-003', kategori: 'ATK', nama: 'Pensil 2B & Penghapus Khusus Kitab Kuning', harga: 4000, stok: 150, satuan: 'Set', deskripsi: 'Mudah dihapus tanpa merusak kertas kitab' },
  { id: 'kop-13', kode: 'ATK-004', kategori: 'ATK', nama: 'Buku Raport & Prestasi Santri', harga: 15000, stok: 80, satuan: 'Buku', deskripsi: 'Buku laporan hasil belajar cawu' },

  // Seragam
  { id: 'kop-14', kode: 'SRG-001', kategori: 'Seragam', nama: 'Setel Seragam Putih Hijau Madrasah (Baju + Celana/Rok)', harga: 135000, stok: 40, satuan: 'Set', deskripsi: 'Kain oxford tebal, bordir logo Kemenag & LP Ma\'arif' },
  { id: 'kop-15', kode: 'SRG-002', kategori: 'Seragam', nama: 'Baju Batik Khas Madrasah Al-Ikhlas', harga: 85000, stok: 35, satuan: 'Pcs', deskripsi: 'Batik motif hijau khas madrasah' },
  { id: 'kop-16', kode: 'SRG-003', kategori: 'Seragam', nama: 'Setel Baju Koko Santri Putih & Sarung Wadimor', harga: 145000, stok: 30, satuan: 'Set', deskripsi: 'Dipakai pada hari Kamis dan Jum\'at' },
  { id: 'kop-17', kode: 'SRG-004', kategori: 'Seragam', nama: 'Peci / Kopyah Hitam Logo Bordir Madrasah', harga: 40000, stok: 50, satuan: 'Pcs', deskripsi: 'Bahan beludru halus anti air ukuran 4-9' }
];

export const TABUNGAN_SANTRI_LIST: TabunganSantri[] = [
  {
    id: 'tab-1',
    noInduk: '2024.01.001',
    nama: 'Ahmad Faiz Al-Faruq',
    kelas: 'Kelas 1',
    jumlahTabungan: 350000,
    terakhirUpdate: '15 Agustus 2026',
    riwayat: [
      { id: 'rw-1', tanggal: '01 Agustus 2026', jenis: 'Setor', nominal: 150000, petugas: 'Ustzh. Nur Laili', keterangan: 'Setoran Awal Tabungan' },
      { id: 'rw-2', tanggal: '08 Agustus 2026', jenis: 'Setor', nominal: 100000, petugas: 'Ustzh. Nur Laili', keterangan: 'Uang Saku Mingguan' },
      { id: 'rw-3', tanggal: '15 Agustus 2026', jenis: 'Setor', nominal: 100000, petugas: 'Ustzh. Nur Laili', keterangan: 'Uang Saku Mingguan' }
    ]
  },
  {
    id: 'tab-2',
    noInduk: '2021.04.030',
    nama: 'Muhammad Rayhan Pratama',
    kelas: 'Kelas 4',
    jumlahTabungan: 1250000,
    terakhirUpdate: '16 Agustus 2026',
    riwayat: [
      { id: 'rw-4', tanggal: '10 Juli 2026', jenis: 'Setor', nominal: 500000, petugas: 'Ustzh. Nur Laili', keterangan: 'Tabungan Idul Adha' },
      { id: 'rw-5', tanggal: '28 Juli 2026', jenis: 'Tarik', nominal: 150000, petugas: 'Ustzh. Nur Laili', keterangan: 'Beli Kitab & Seragam KOPAS' },
      { id: 'rw-6', tanggal: '16 Agustus 2026', jenis: 'Setor', nominal: 900000, petugas: 'Ustzh. Nur Laili', keterangan: 'Tabungan Qurban & Studi Tour' }
    ]
  },
  {
    id: 'tab-3',
    noInduk: '2019.06.050',
    nama: 'Muhammad Hilman Farisi',
    kelas: 'Kelas 6',
    jumlahTabungan: 2100000,
    terakhirUpdate: '17 Agustus 2026',
    riwayat: [
      { id: 'rw-7', tanggal: '01 Juli 2026', jenis: 'Setor', nominal: 1000000, petugas: 'Ustzh. Nur Laili', keterangan: 'Tabungan Biaya Haflah & Wisuda' },
      { id: 'rw-8', tanggal: '17 Agustus 2026', jenis: 'Setor', nominal: 1100000, petugas: 'Ustzh. Nur Laili', keterangan: 'Pelunasan Tabungan Akhirussanah' }
    ]
  }
];

// =========================================================================
// 4. DOKUMENTASI KEGIATAN
// =========================================================================
export const DOKUMENTASI_LIST: DokumentasiItem[] = [
  {
    id: 'dok-1',
    judul: 'Haflah Akhirussanah & Wisuda Santri Ke-18',
    kategori: 'Foto',
    tanggal: '24 Juni 2026',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&auto=format&fit=crop&q=80',
    keterangan: 'Pelepasan wisudawan Mutakhorijin Kelas 6 dan santri khotmil Qur\'an 30 Juz disaksikan para wali murid dan masyayikh.'
  },
  {
    id: 'dok-2',
    judul: 'Peringatan Maulid Nabi Muhammad SAW & Gema Sholawat',
    kategori: 'Foto',
    tanggal: '12 September 2025',
    url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=300&auto=format&fit=crop&q=80',
    keterangan: 'Grup Hadroh El-Ikhlas bersama seluruh Asatidz dan santri menggemakan sholawat Nabi di halaman madrasah.'
  },
  {
    id: 'dok-3',
    judul: 'Ujian Imtihan Syafahi (Lisan) & Tahriri (Tulis) Cawu 1',
    kategori: 'Foto',
    tanggal: '20 November 2025',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=80',
    keterangan: 'Pelaksanaan ujian lisan membaca kitab kuning makna pegon dan hafalan nadhom Jurumiyyah di depan dewan penguji.'
  },
  {
    id: 'dok-4',
    judul: 'Video Profil & Kegiatan Belajar Mengajar Santri 2026',
    kategori: 'Video',
    tanggal: '10 Juli 2026',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
    keterangan: 'Tayangan dokumenter pembelajaran kitab kuning, praktek sholat jenazah, dan latihan rebana santri madrasah.'
  },
  {
    id: 'dok-5',
    judul: 'Brosur & Panduan Pendaftaran Murid Baru (PPDB) 2026/2027',
    kategori: 'File Unduhan',
    tanggal: '01 Januari 2026',
    url: '#',
    ukuranFile: '2.4 MB',
    tipeFile: 'PDF Dokumen',
    keterangan: 'File PDF resmi berisi syarat pendaftaran, rincian biaya, jadwal tes seleksi masuk, dan formulir pendaftaran.'
  },
  {
    id: 'dok-6',
    judul: 'Kalender Pendidikan & Jadwal Tahunan Madrasah 1447-1448 H',
    kategori: 'File Unduhan',
    tanggal: '15 Juli 2026',
    url: '#',
    ukuranFile: '1.8 MB',
    tipeFile: 'PDF Dokumen',
    keterangan: 'Jadwal hari libur madrasah, jadwal ujian cawu, peringatan hari besar Islam, dan agenda ziarah wali.'
  }
];

// =========================================================================
// 5. RAPORT SANTRI
// =========================================================================
export const RAPORT_SANTRI_SAMPLE: RaportSantriData = {
  id: 'rap-1',
  noInduk: '2021.04.030',
  nama: 'Muhammad Rayhan Pratama',
  kelas: 'Kelas 4',
  cawu: 'Cawu 1',
  tahunAjaran: '2025/2026',
  peringkat: 2,
  totalSiswa: 32,
  totalNilai: 948,
  rataRata: 86.18,
  sikapDanAkhlak: 'Sangat Baik (A), disiplin dalam sholat berjamaah dan takdzim kepada Asatidz.',
  hafalanJuz: 'Juz 30 (Lulus Mutqin) & Surat Al-Mulk s/d Al-Qolam',
  catatanGuru: 'Alhamdulillah ananda Rayhan menunjukkan peningkatan pesat dalam pemahaman kaidah Nahwu dan membaca makna pegon kitab Fiqih. Pertahankan prestasinya!',
  nilaiList: [
    { namaMapel: 'Fiqih (Safinatun Najah / Fathul Qorib)', kkm: 70, nilaiAngka: 88, nilaiHuruf: 'Delapan Puluh Delapan', predikat: 'A (Sangat Baik)', keterangan: 'Tuntas & Menguasai bab Thoharoh & Sholat' },
    { namaMapel: 'Tauhid (Aqidatul Awam / Jawahirul Kalamiyah)', kkm: 70, nilaiAngka: 90, nilaiHuruf: 'Sembilan Puluh', predikat: 'A (Sangat Baik)', keterangan: 'Hafal seluruh nadhom sifat wajib 20 bagi Allah' },
    { namaMapel: 'Ahlaq (Ahlaqul Banin Juz 2)', kkm: 75, nilaiAngka: 92, nilaiHuruf: 'Sembilan Puluh Dua', predikat: 'A (Sangat Baik)', keterangan: 'Adab santri kepada guru dan sesama teman sangat terpuji' },
    { namaMapel: 'Al-Qur\'an / Tajwid (Tuhfatul Athfal)', kkm: 75, nilaiAngka: 87, nilaiHuruf: 'Delapan Puluh Tujuh', predikat: 'A (Sangat Baik)', keterangan: 'Menguasai hukum Nun Sukun, Tanwin & Mad' },
    { namaMapel: 'Bahasa Arab (Durusullughoh)', kkm: 65, nilaiAngka: 82, nilaiHuruf: 'Delapan Puluh Dua', predikat: 'B (Baik)', keterangan: 'Mampu membuat kalimat dasar dan mufrodat harian' },
    { namaMapel: 'Nahwu - Sorof (Jurumiyyah & Amtsilah)', kkm: 65, nilaiAngka: 85, nilaiHuruf: 'Delapan Puluh Lima', predikat: 'B+ (Amat Baik)', keterangan: 'Mampu meng-i\'rob tarkib mubtada\' khobar & fi\'il fa\'il' },
    { namaMapel: 'Tarikh Islam (Khulashoh Nurul Yaqin)', kkm: 70, nilaiAngka: 86, nilaiHuruf: 'Delapan Puluh Enam', predikat: 'B+ (Amat Baik)', keterangan: 'Memahami sirah Nabawiyyah masa Makkah & Madinah' },
    { namaMapel: 'Ke-NU-an / Aswaja', kkm: 70, nilaiAngka: 90, nilaiHuruf: 'Sembilan Puluh', predikat: 'A (Sangat Baik)', keterangan: 'Memahami amaliyah Aswaja An-Nahdliyyah & tradisi tahlil' },
    { namaMapel: 'Hadits (Arba\'in An-Nawawiyyah)', kkm: 70, nilaiAngka: 84, nilaiHuruf: 'Delapan Puluh Empat', predikat: 'B+ (Amat Baik)', keterangan: 'Hafal 20 Hadits pertama beserta sanad dan rowinya' },
    { namaMapel: 'Imlak / Pegon (Khat Riq\'ah & Naskhi)', kkm: 70, nilaiAngka: 80, nilaiHuruf: 'Delapan Puluh', predikat: 'B (Baik)', keterangan: 'Tulisan pegon makna gandul rapi dan mudah dibaca' },
    { namaMapel: 'Hafalan Surat Pendek & Doa Pilihan', kkm: 75, nilaiAngka: 84, nilaiHuruf: 'Delapan Puluh Empat', predikat: 'B+ (Amat Baik)', keterangan: 'Lancar membaca doa qunut subuh & wirid ba\'da sholat' }
  ]
};

// =========================================================================
// 6. JADWAL PAKAI SERAGAM & MAPEL KTSP+
// =========================================================================
export const JADWAL_SERAGAM_LIST: JadwalSeragamHarian[] = [
  { hari: 'Sabtu', seragam: 'Seragam Putih - Hijau Madrasah + Kopyah Hitam', warna: 'from-emerald-700 to-teal-800', keterangan: 'Lengkap dengan dasi madrasah dan ikat pinggang hijau' },
  { hari: 'Ahad', seragam: 'Seragam Batik Ma\'arif Khas Madrasah', warna: 'from-teal-700 to-cyan-800', keterangan: 'Celana / Rok hijau tua dan peci hitam rapi' },
  { hari: 'Senin', seragam: 'Seragam Baju Koko Santri Putih & Sarung', warna: 'from-blue-700 to-indigo-800', keterangan: 'Khusus santri putra memakai sarung santri sopan' },
  { hari: 'Selasa', seragam: 'Seragam Pramuka Santri Lengkap / Kemeja Cokelat', warna: 'from-amber-800 to-yellow-900', keterangan: 'Dipakai pada kegiatan kepanduan santri' },
  { hari: 'Rabu', seragam: 'Seragam Olahraga & Kaos Madrasah', warna: 'from-purple-700 to-pink-800', keterangan: 'Pagi hari senam santri dan praktek fisik' },
  { hari: 'Kamis', seragam: 'Baju Gamis Santri / Koko Putih Bersih', warna: 'from-slate-700 to-slate-900', keterangan: 'Persiapan pembacaan Ratib Al-Haddad dan Tahlil Kamis sore' },
  { hari: 'Jum\'at', seragam: 'LIBUR MADRASAH (Ibadah Sholat Jum\'at)', warna: 'from-emerald-900 to-slate-900', keterangan: 'Hari libur mingguan pesantren & madrasah' }
];

export const MAPEL_KTSP_LIST: MapelPerCawu[] = [
  // Cawu 1
  { id: 'mp-1', hari: 'Sabtu', jam: '14:00 - 15:00', mapel: 'Fiqih Ibadah (Safinatun Najah)', kitabRujukan: 'Safinatun Najah Makna Pegon', guruPengajar: 'Ust. Ahmad Mufid, M.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-2', hari: 'Sabtu', jam: '15:15 - 16:15', mapel: 'Tauhid Aqidah (Aqidatul Awam)', kitabRujukan: 'Aqidatul Awam Nadhom', guruPengajar: 'KH. Abdullah Syukri, Lc.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-3', hari: 'Ahad', jam: '14:00 - 15:00', mapel: 'Al-Qur\'an & Tajwid Praktis', kitabRujukan: 'Tuhfatul Athfal & Yanbu\'a', guruPengajar: 'Ust. Ridwan Hakim, S.Ag.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-4', hari: 'Ahad', jam: '15:15 - 16:15', mapel: 'Ahlaqul Karimah (Ahlaqul Banin)', kitabRujukan: 'Ahlaqul Banin Juz 1', guruPengajar: 'Ust. Ahmad Mufid, M.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-5', hari: 'Senin', jam: '14:00 - 15:00', mapel: 'Nahwu Dasar (Matan Al-Jurumiyyah)', kitabRujukan: 'Jurumiyyah Arab Jawa', guruPengajar: 'Ustzh. Siti Fatimah, S.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-6', hari: 'Senin', jam: '15:15 - 16:15', mapel: 'Sorof (Al-Amtsilah At-Tashrifiyyah)', kitabRujukan: 'Kubah Amtsilah', guruPengajar: 'Ustzh. Siti Fatimah, S.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-7', hari: 'Selasa', jam: '14:00 - 15:00', mapel: 'Bahasa Arab (Durusullughoh)', kitabRujukan: 'Durusullughoh Al-Arobiyyah', guruPengajar: 'Ustzh. Siti Fatimah, S.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-8', hari: 'Selasa', jam: '15:15 - 16:15', mapel: 'Tarikh Islam (Khulashoh Nurul Yaqin)', kitabRujukan: 'Nurul Yaqin Juz 1', guruPengajar: 'Ust. Muhammad Zainuri, S.Pd.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-9', hari: 'Rabu', jam: '14:00 - 15:00', mapel: 'Ke-NU-an & Amaliyah Aswaja', kitabRujukan: 'Buku Risalah Aswaja NU', guruPengajar: 'Ust. Muhammad Zainuri, S.Pd.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-10', hari: 'Rabu', jam: '15:15 - 16:15', mapel: 'Hadits Pilihan (Arba\'in An-Nawawi)', kitabRujukan: 'Matan Arba\'in', guruPengajar: 'Ust. Ridwan Hakim, S.Ag.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-11', hari: 'Kamis', jam: '14:00 - 15:00', mapel: 'Imlak & Tulis Pegon Arab Melayu', kitabRujukan: 'Pedoman Pegon Jawa', guruPengajar: 'Ust. Ridwan Hakim, S.Ag.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },
  { id: 'mp-12', hari: 'Kamis', jam: '15:15 - 16:30', mapel: 'Hafalan Nadhom & Rotib Al-Haddad', kitabRujukan: 'Rotibul Haddad & Wirid', guruPengajar: 'KH. Abdullah Syukri, Lc.', kelas: 'Kelas 1-6', cawu: 'Cawu 1' },

  // Cawu 2
  { id: 'mp-13', hari: 'Sabtu', jam: '14:00 - 15:00', mapel: 'Fiqih Bab Muamalah & Sholat Sunnah', kitabRujukan: 'Safinatun Najah & Sullamut Taufiq', guruPengajar: 'Ust. Ahmad Mufid, M.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 2' },
  { id: 'mp-14', hari: 'Senin', jam: '14:00 - 15:00', mapel: 'Nahwu Bab Marfuatul Asma\' (I\'rob Fiqih)', kitabRujukan: 'Kawakibud Durriyyah', guruPengajar: 'Ustzh. Siti Fatimah, S.Pd.I.', kelas: 'Kelas 1-6', cawu: 'Cawu 2' },

  // Cawu 3
  { id: 'mp-15', hari: 'Sabtu', jam: '14:00 - 15:00', mapel: 'Fiqih Jenazah, Puasa & Zakat Fitrah', kitabRujukan: 'Fathul Qorib Bab Shiyam', guruPengajar: 'KH. Abdullah Syukri, Lc.', kelas: 'Kelas 1-6', cawu: 'Cawu 3' },
  { id: 'mp-16', hari: 'Kamis', jam: '14:00 - 16:30', mapel: 'Praktik Khotmil Qur\'an & Bahtsul Masail', kitabRujukan: 'Fathul Wahhab & Majmu\'', guruPengajar: 'KH. Abdullah Syukri, Lc.', kelas: 'Kelas 1-6', cawu: 'Cawu 3' }
];

// =========================================================================
// 7. PROFILE MADRASAH
// =========================================================================
export const PROFILE_MADRASAH_DATA = {
  namaLembaga: 'Madrasah Diniyah Takmiliyah Awaliyah & Wustho Al-Ikhlas',
  naungan: 'Yayasan Pendidikan Islam Al-Ikhlas Kendal • Terdaftar di Kemenag RI',
  nomorStatistikMadrasah: 'NSM : 311.33.24.05.089',
  npsn: 'NPSN : 69987654',
  akreditasi: 'TERAKREDITASI "A" (Unggul) - BAN-PDM Kemenag',
  tahunBerdiri: '1418 H / 1997 M (29 Tahun Mengabdi)',
  pendiri: 'Al-Maghfurlah KH. Ahmad Dahlan & Masyayikh Kaliwungu',
  kepalaMadrasah: 'KH. Abdullah Syukri, Lc., M.A.',
  jumlahSantriAktif: '485 Santri (Putra: 240, Putri: 245)',
  jumlahAsatidz: '26 Ustadz & Ustadzah',
  kurikulum: 'Perpaduan Kurikulum Salafiyah Kitab Kuning (Kemenag) & Karakter Aswaja An-Nahdliyyah',
  alamat: 'Jl. Pesantren No. 09, Desa Magelung Kulon RT 03/RW 02, Kec. Kaliwungu Selatan, Kab. Kendal, Jawa Tengah 51372',
  sejarahSingkat: `Madrasah Diniyah Al-Ikhlas didirikan pada tahun 1997 atas restu para ulama sepuh Kendal untuk membentengi aqidah generasi muda melalui pendidikan diniyah petang hari. Menggunakan sistem pembelajaran sorogan, bandongan, dan klasikal berjenjang Kelas 1 sampai Kelas 6 dengan sistem Caturwulan (Cawu). Hingga saat ini telah melahirkan ribuan alumni yang berkiprah sebagai kyai, ustadz, akademisi, dan pemimpin masyarakat.`
};

// =========================================================================
// 8. CATATAN KEGIATAN
// =========================================================================
export const CATATAN_KEGIATAN_LIST: CatatanKegiatanItem[] = [
  {
    id: 'ck-1',
    hari: 'Kamis',
    tanggal: '14 Agustus 2026',
    keterangan: 'Peringatan Hari Kemerdekaan RI Ke-81 & Doa Bersama untuk Para Pahlawan / Pejuang Kemerdekaan',
    tempat: 'Halaman Utama Madrasah & Masjid Jamie\' Al-Ikhlas',
    penanggungJawab: 'Ust. Muhammad Zainuri, S.Pd.',
    status: 'Selesai'
  },
  {
    id: 'ck-2',
    hari: 'Sabtu',
    tanggal: '22 Agustus 2026',
    keterangan: 'Rapat Koordinasi Dewan Asatidz Persiapan Ujian Imtihan Tahriri Cawu 1 Tahun Ajaran 2026/2027',
    tempat: 'Ruang Rapat Asatidz Lt. 2',
    penanggungJawab: 'Ust. Ahmad Mufid, M.Pd.I.',
    status: 'Sedang Berlangsung'
  },
  {
    id: 'ck-3',
    hari: 'Ahad',
    tanggal: '30 Agustus 2026',
    keterangan: 'Pertemuan Rutin Paguyuban Wali Santri & Pembagian Buku Tabungan Santri',
    tempat: 'Aula Gedung Pertemuan Al-Ikhlas',
    penanggungJawab: 'Ustzh. Nur Laili, S.E.',
    status: 'Akan Datang'
  },
  {
    id: 'ck-4',
    hari: 'Kamis',
    tanggal: '10 September 2026',
    keterangan: 'Gema Sholawat Nabi & Santunan Anak Yatim / Piatu Sambut Bulan Maulid 1448 H',
    tempat: 'Masjid Jami\' Al-Ikhlas',
    penanggungJawab: 'Ust. Ridwan Hakim, S.Ag.',
    status: 'Akan Datang'
  }
];

// =========================================================================
// 9. VISI, MISI DAN TUJUAN MADRASAH
// =========================================================================
export const VISI_MISI_DATA = {
  visi: '“Terwujudnya Generasi Santri yang Berakhlakul Karimah, Unggul dalam Pemahaman Kitab Kuning, Berjiwa Mandiri, dan Teguh Memegang Ajaran Ahlussunnah Wal Jama\'ah An-Nahdliyyah.”',
  misi: [
    'Menyelenggarakan pendidikan diniyah berkualitas berlandaskan tradisi keilmuan Islam Ahlussunnah Wal Jama\'ah.',
    'Mendidik santri agar mahir membaca, memahami, dan mengamalkan kitab kuning berbahasa Arab makna Pegon.',
    'Menanamkan adab, sopan santun, dan keteladanan akhlaqul karimah dalam kehidupan sehari-hari.',
    'Membimbing santri menghafal Al-Qur\'an Juz 30 (Juz \'Amma) dan doa-doa ma\'tsurat harian.',
    'Membekali santri dengan ketrampilan dakwah, pidato (khitobah), kaligrafi, dan seni rebana hadroh.',
    'Mewujudkan tata kelola madrasah yang modern, transparan, dan berbasis teknologi digital santri.'
  ],
  tujuan: [
    'Mencetak lulusan yang mampu membaca Al-Qur\'an secara tartil berkaidah tajwid dan fasih.',
    'Meluluskan santri yang mampu membaca dan mengkaji kitab kuning tingkat Ibtidaiyah/Wustho dengan baik.',
    'Menghasilkan pribadi yang istiqomah dalam menjalankan sholat fardhu berjamaah dan amalan sunnah.',
    'Mempersiapkan kader pemimpin umat yang berwawasan luas dan berbakti kepada orang tua serta tanah air.',
    'Mencapai prestasi gemilang dalam ajang Musabaqah Qira\'atil Kutub (MQK) dan MTQ tingkat regional maupun nasional.'
  ]
};

// =========================================================================
// 10. DAFTAR MUTAKHORIJIN / KELULUSAN
// =========================================================================
export const MUTAKHORIJIN_LIST: MutakhorijinItem[] = [
  { id: 'mut-1', noIjazah: 'MD-2025-06-001', nama: 'Fajar Shodiq Al-Hafidz', tahunLulus: '2025', angkatan: 'Angkatan XVIII', pendidikanLanjutan: 'Pondok Pesantren Al-Anwar Sarang Rembang', alamatSekarang: 'Sarang, Rembang', prestasiTerbaik: 'Juara 1 MQK Fathul Qorib Tingkat Jateng' },
  { id: 'mut-2', noIjazah: 'MD-2025-06-002', nama: 'Nabilatus Zahro', tahunLulus: '2025', angkatan: 'Angkatan XVIII', pendidikanLanjutan: 'Pondok Pesantren Yanbu\'ul Qur\'an Kudus', alamatSekarang: 'Kudus', prestasiTerbaik: 'Khotmil Qur\'an 30 Juz Bil Ghoib' },
  { id: 'mut-3', noIjazah: 'MD-2024-06-015', nama: 'Rizqi Maulana Akbar', tahunLulus: '2024', angkatan: 'Angkatan XVII', pendidikanLanjutan: 'Universitas Islam Negeri (UIN) Walisongo', alamatSekarang: 'Semarang', prestasiTerbaik: 'Juara 1 Pidato B. Arab Porsadin' },
  { id: 'mut-4', noIjazah: 'MD-2024-06-016', nama: 'Salma Hanifah', tahunLulus: '2024', angkatan: 'Angkatan XVII', pendidikanLanjutan: 'Ma\'had Aly Tebuireng Jombang', alamatSekarang: 'Jombang, Jatim', prestasiTerbaik: 'Lulusan Terbaik Nilai Imtihan 98.5' },
  { id: 'mut-5', noIjazah: 'MD-2023-06-028', nama: 'Muhammad Danial Haq', tahunLulus: '2023', angkatan: 'Angkatan XVI', pendidikanLanjutan: 'Universitas Al-Azhar Kairo Mesir', alamatSekarang: 'Kairo, Mesir', prestasiTerbaik: 'Penerima Beasiswa Penuh Kemenag RI' }
];

// =========================================================================
// 11. SYAHRIYAH + ADMINISTRASI
// =========================================================================
export const SYAHRIYAH_LIST: SyahriyahRecord[] = [
  {
    id: 'syh-1',
    noInduk: '2024.01.001',
    nama: 'Ahmad Faiz Al-Faruq',
    kelas: 'Kelas 1',
    cawu1: { nominal: 150000, status: 'Lunas', tanggalBayar: '10 Juli 2026', kuitansi: 'KWT-2026-01-001' },
    cawu2: { nominal: 150000, status: 'Belum' },
    cawu3: { nominal: 150000, status: 'Belum' }
  },
  {
    id: 'syh-2',
    noInduk: '2023.02.015',
    nama: 'Fathir Azzam Robbani',
    kelas: 'Kelas 2',
    cawu1: { nominal: 150000, status: 'Lunas', tanggalBayar: '12 Juli 2026', kuitansi: 'KWT-2026-02-015' },
    cawu2: { nominal: 150000, status: 'Lunas', tanggalBayar: '14 Agustus 2026', kuitansi: 'KWT-2026-02-088' },
    cawu3: { nominal: 150000, status: 'Belum' }
  },
  {
    id: 'syh-3',
    noInduk: '2022.03.021',
    nama: 'Zaidan Ahsanul Hadi',
    kelas: 'Kelas 3',
    cawu1: { nominal: 150000, status: 'Lunas', tanggalBayar: '15 Juli 2026', kuitansi: 'KWT-2026-03-021' },
    cawu2: { nominal: 150000, status: 'Belum' },
    cawu3: { nominal: 150000, status: 'Belum' }
  },
  {
    id: 'syh-4',
    noInduk: '2021.04.030',
    nama: 'Muhammad Rayhan Pratama',
    kelas: 'Kelas 4',
    cawu1: { nominal: 150000, status: 'Lunas', tanggalBayar: '08 Juli 2026', kuitansi: 'KWT-2026-04-030' },
    cawu2: { nominal: 150000, status: 'Lunas', tanggalBayar: '15 Agustus 2026', kuitansi: 'KWT-2026-04-092' },
    cawu3: { nominal: 150000, status: 'Lunas', tanggalBayar: '15 Agustus 2026', kuitansi: 'KWT-2026-04-093' }
  },
  {
    id: 'syh-5',
    noInduk: '2020.05.045',
    nama: 'Ibrahim Malik Al-Kindi',
    kelas: 'Kelas 5',
    cawu1: { nominal: 150000, status: 'Lunas', tanggalBayar: '20 Juli 2026', kuitansi: 'KWT-2026-05-045' },
    cawu2: { nominal: 150000, status: 'Belum' },
    cawu3: { nominal: 150000, status: 'Belum' }
  },
  {
    id: 'syh-6',
    noInduk: '2019.06.050',
    nama: 'Muhammad Hilman Farisi',
    kelas: 'Kelas 6',
    cawu1: { nominal: 150000, status: 'Lunas', tanggalBayar: '05 Juli 2026', kuitansi: 'KWT-2026-06-050' },
    cawu2: { nominal: 150000, status: 'Lunas', tanggalBayar: '10 Agustus 2026', kuitansi: 'KWT-2026-06-085' },
    cawu3: { nominal: 150000, status: 'Lunas', tanggalBayar: '10 Agustus 2026', kuitansi: 'KWT-2026-06-086' }
  }
];

// =========================================================================
// 12. JADWAL KEGIATAN SETIAP TAHUNAN
// =========================================================================
export const JADWAL_TAHUNAN_LIST: KegiatanTahunanItem[] = [
  { id: 'thn-1', bulan: 'Juli', namaKegiatan: 'Masa Ta\'aruf Santri Baru (MATSAMA) & Khutbatul Iftitah', kategori: 'Khutbatul Arsy', tanggalMulai: '15 Juli 2026', tanggalSelesai: '18 Juli 2026', keterangan: 'Pengenalan lingkungan madrasah, pembagian kelas, dan pembekalan adab menuntut ilmu.' },
  { id: 'thn-2', bulan: 'Agustus', namaKegiatan: 'Peringatan Hari Kemerdekaan RI Ke-81 & Khotmil Qur\'an Kebangsaan', kategori: 'PHBI', tanggalMulai: '16 Agustus 2026', tanggalSelesai: '17 Agustus 2026', keterangan: 'Upacara bendera, perlombaan santri islami, dan doa tasyakuran.' },
  { id: 'thn-3', bulan: 'September', namaKegiatan: 'Peringatan Maulid Nabi Muhammad SAW & Festival Rebana', kategori: 'PHBI', tanggalMulai: '10 September 2026', tanggalSelesai: '12 September 2026', keterangan: 'Pembacaan Maulid Simthudduror dan santunan anak yatim.' },
  { id: 'thn-4', bulan: 'Oktober', namaKegiatan: 'Peringatan Hari Santri Nasional (HSN) 2026 & Kirab Obor', kategori: 'PHBI', tanggalMulai: '21 Oktober 2026', tanggalSelesai: '22 Oktober 2026', keterangan: 'Apel akbar santri, pembacaan 1 Miliar Sholawat Nariyah, dan kirab santri.' },
  { id: 'thn-5', bulan: 'November', namaKegiatan: 'Ujian Imtihan Syafahi (Lisan) & Tahriri (Tulis) Cawu 1', kategori: 'Imtihan & Ujian', tanggalMulai: '20 November 2026', tanggalSelesai: '28 November 2026', keterangan: 'Evaluasi caturwulan 1 membaca kitab pegon dan nadhom.' },
  { id: 'thn-6', bulan: 'Desember', namaKegiatan: 'Pembagian Raport Santri Cawu 1 & Libur Cawu 1', kategori: 'Libur', tanggalMulai: '05 Desember 2026', tanggalSelesai: '14 Desember 2026', keterangan: 'Pertemuan wali santri dan pembagian hasil belajar.' },
  { id: 'thn-7', bulan: 'Januari', namaKegiatan: 'Peringatan Isra\' Mi\'raj Nabi Muhammad SAW 1448 H', kategori: 'PHBI', tanggalMulai: '15 Januari 2027', tanggalSelesai: '15 Januari 2027', keterangan: 'Pengajian akbar dan praktik sholat sunnah tasbih.' },
  { id: 'thn-8', bulan: 'Maret', namaKegiatan: 'Pesantren Ramadhan, Tadarus 30 Juz & Iktikaf Nuzulul Qur\'an', kategori: 'PHBI', tanggalMulai: '01 Ramadhan 1448 H', tanggalSelesai: '20 Ramadhan 1448 H', keterangan: 'Kajian pasaran kitab kilatan Ramadhan dan buka puasa bersama.' },
  { id: 'thn-9', bulan: 'April', namaKegiatan: 'Ujian Akhir Madrasah (Imtihan Nihai) Kelas 6', kategori: 'Imtihan & Ujian', tanggalMulai: '15 April 2027', tanggalSelesai: '22 April 2027', keterangan: 'Ujian kelulusan akhir bagi santri tingkat akhir.' },
  { id: 'thn-10', bulan: 'Mei', namaKegiatan: 'Ziarah Wali Songo & Ulama Nusantara', kategori: 'Ziarah', tanggalMulai: '10 Mei 2027', tanggalSelesai: '14 Mei 2027', keterangan: 'Rihlah ruhiyah santri Kelas 5 dan 6 menelusuri jejak para wali.' },
  { id: 'thn-11', bulan: 'Juni', namaKegiatan: 'Haflah Akhirussanah, Khotmil Qur\'an & Wisuda Kelulusan Ke-19', kategori: 'Haflah Akhirussanah', tanggalMulai: '20 Juni 2027', tanggalSelesai: '22 Juni 2027', keterangan: 'Puncak perayaan tahunan pelepasan santri mutakhorijin.' }
];

// =========================================================================
// 13. TATA TERTIB ASATIDZ & MURID
// =========================================================================
export const TATA_TERTIB_LIST: TataTertibPasal[] = [
  {
    id: 'tt-1',
    kategori: 'Murid',
    bab: 'BAB I : KEHADIRAN DAN WAKTU BELAJAR',
    pasal: 'Pasal 1 (Waktu Hadir & Presensi)',
    isi: [
      'Santri wajib hadir di madrasah paling lambat 10 menit sebelum bel masuk berbunyi (Pukul 13.50 WIB).',
      'Santri yang terlambat wajib melapor ke Bagian Keamanan / Piket Asatidz sebelum memasuki ruang kelas.',
      'Santri yang berhalangan hadir wajib mengirimkan surat izin tertulis dari orang tua/wali atau konfirmasi via WhatsApp resmi madrasah.'
    ],
    sanksi: [
      'Terlambat 1-2 kali: Peringatan lisan dan membaca istighfar 33x.',
      'Terlambat > 3 kali: Membaca surat Yasin di ruang piket sebelum masuk kelas.',
      'Alpha tanpa kabar 3 hari berturut-turut: Pemanggilan orang tua/wali santri.'
    ]
  },
  {
    id: 'tt-2',
    kategori: 'Murid',
    bab: 'BAB II : PAKAIAN, KETERTIBAN DAN ADAB',
    pasal: 'Pasal 2 (Seragam & Perlengkapan Belajar)',
    isi: [
      'Santri putra wajib memakai peci/kopyah hitam rapi, baju berkerah kancing lengkap, dan sarung/celana sesuai jadwal seragam harian.',
      'Santri putri wajib berbusana muslimah syar\'i (jilbab menutup dada, gamis/rok longgar tidak transparan).',
      'Setiap santri wajib membawa kitab pelajaran yang dijadwalkan, buku pegon, dan alat tulis sendiri.',
      'Dilarang keras membawa benda tajam, HP/Smartphone ke dalam kelas saat jam belajar tanpa izin guru.'
    ],
    sanksi: [
      'Pakaian tidak sesuai jadwal: Diberikan rompi teguran santri.',
      'Membawa HP tanpa izin saat pelajaran: HP disita dan diambil langsung oleh orang tua.'
    ]
  },
  {
    id: 'tt-3',
    kategori: 'Asatidz',
    bab: 'BAB I : TUGAS DAN KEWAJIBAN ASATIDZ',
    pasal: 'Pasal 1 (Kedisiplinan & Keteladanan)',
    isi: [
      'Asatidz wajib hadir di madrasah 15 menit sebelum kegiatan pembelajaran dimulai.',
      'Asatidz wajib mengisi jurnal mengajar, buku absensi santri, dan daftar nilai cawu.',
      'Memberikan keteladanan dalam berpakaian rapi, berbahasa santun, dan membimbing adab santri.',
      'Apabila berhalangan hadir mengajar, wajib memberitahu pimpinan madrasah minimal 1 hari sebelumnya dan menitipkan tugas mandiri untuk santri.'
    ]
  }
];

// =========================================================================
// 14. SYARAT PENDAFTARAN MURID BARU / LAMA
// =========================================================================
export const SYARAT_PENDAFTARAN_DATA = {
  judul: 'Penerimaan Santri Baru (PSB) & Daftar Ulang Madrasah Diniyah Al-Ikhlas 2026/2027',
  jalurPendaftaran: [
    { nama: 'Jalur Reguler (Santri Baru Kelas 1)', kuota: '80 Santri', periode: '01 Februari - 30 Juni 2026' },
    { nama: 'Jalur Pindahan / Mutasi (Santri Naik Kelas)', kuota: '20 Santri', periode: '01 Mei - 10 Juli 2026' },
    { nama: 'Jalur Beasiswa Yatim & Dhuafa', kuota: '25 Santri (Bebas Biaya 100%)', periode: '01 Februari - 30 Juni 2026' }
  ],
  syaratBerkas: [
    'Mengisi Formulir Pendaftaran Online / Offline dari kantor madrasah.',
    'Fotokopi Akta Kelahiran santri (3 lembar).',
    'Fotokopi Kartu Keluarga (KK) yang masih berlaku (3 lembar).',
    'Fotokopi KTP kedua orang tua / wali (2 lembar).',
    'Pas foto berwarna ukuran 3x4 (4 lembar) dengan background merah/biru berseragam rapi / peci.',
    'Bagi santri pindahan, melampirkan Surat Pindah dan Buku Raport dari madrasah asal.'
  ],
  rincianBiayaMasuk: [
    { item: 'Biaya Pendaftaran & Formulir PSB', nominal: 35000 },
    { item: 'Infaq Sarana Prasarana & Pembangunan (1x selama belajar)', nominal: 250000 },
    { item: 'Seragam Madrasah Lengkap 2 Setel + Peci Bordir', nominal: 220000 },
    { item: 'Paket Kitab Kuning Pegon Kelas 1 Lengkap', nominal: 110000 },
    { item: 'Syahriyah Cawu 1 (Bulan 1-4)', nominal: 150000 },
    { item: 'Kartu Tanda Santri Digital (KTA) & Buku Tabungan', nominal: 25000 }
  ],
  totalBiayaMasuk: 790000
};

// =========================================================================
// 15. FASILITAS LEMBAGA
// =========================================================================
export const FASILITAS_LIST: FasilitasItem[] = [
  {
    id: 'fas-1',
    nama: 'Ruang Kelas Belajar Ber-AC & Sound System',
    kategori: 'Ruang Belajar',
    jumlah: 12,
    kondisi: 'Sangat Baik',
    foto: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Dilengkapi meja kursi ukir santri, papan tulis ganda (Whiteboard & papan khat pegon), serta kipas angin/AC sejuk.'
  },
  {
    id: 'fas-2',
    nama: 'Masjid Jamie\' Al-Ikhlas (Dua Lantai)',
    kategori: 'Ibadah',
    jumlah: 1,
    kondisi: 'Sangat Baik',
    foto: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Pusat ibadah sholat berjamaah, mujahadah, khotmil Qur\'an, dan pengajian umum masyarakat berkapasitas 1.200 jamaah.'
  },
  {
    id: 'fas-3',
    nama: 'Perpustakaan Khusus Kitab Kuning & Turats Ulama',
    kategori: 'Penunjang',
    jumlah: 1,
    kondisi: 'Sangat Baik',
    foto: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Menyimpan lebih dari 1.500 judul kitab salaf lintas madzhab, kamus Bahasa Arab (Al-Munawwir, Lisanul Arab), dan kitab terjemahan.'
  },
  {
    id: 'fas-4',
    nama: 'Gedung Koperasi Santri (KOPAS) & Kantin Halal',
    kategori: 'Penunjang',
    jumlah: 1,
    kondisi: 'Baik',
    foto: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Menyediakan ATK pegon, seragam, kitab, makanan minuman higienis bebas MSG dan layanan tabungan santri.'
  },
  {
    id: 'fas-5',
    nama: 'Aula Pertemuan & Panggung Seni Santri',
    kategori: 'Penunjang',
    jumlah: 1,
    kondisi: 'Sangat Baik',
    foto: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Tempat wisuda haflah akhirussanah, latihan khitobah 3 bahasa, dan latihan rebana hadroh.'
  }
];

// =========================================================================
// 16. KEGIATAN EKSTRAKURIKULER
// =========================================================================
export const EKSTRAKURIKULER_LIST: EkstrakurikulerItem[] = [
  {
    id: 'eks-1',
    nama: 'Seni Hadroh Rebana & Sholawat El-Ikhlas',
    pembina: 'Ust. Ridwan Hakim, S.Ag.',
    jadwalLatihan: 'Setiap Malam Jum\'at (19.30 - 21.30 WIB)',
    tempat: 'Aula Utama Madrasah',
    foto: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Melatih pukulan terbang Banjari, Bas, Tam, dan vokal Qasidah Sholawat kontemporer.',
    jumlahAnggota: 45
  },
  {
    id: 'eks-2',
    nama: 'Pencak Silat Pagar Nusa (Nahdlatul Ulama)',
    pembina: 'Pendekar M. Syamsuri & Tim IPSI',
    jadwalLatihan: 'Ahad Pagi (06.30 - 08.30 WIB)',
    tempat: 'Halaman Olahraga Madrasah',
    foto: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Bela diri khas santri untuk kesehatan jasmani, mental tangguh, dan pertahanan diri Ahlussunnah Wal Jama\'ah.',
    jumlahAnggota: 60
  },
  {
    id: 'eks-3',
    nama: 'Khitobah & Muhadhoroh 3 Bahasa (Arab, Inggris, Jawa Kromo)',
    pembina: 'Ustzh. Siti Fatimah & Ust. Ahmad Mufid',
    jadwalLatihan: 'Kamis Siang (15.30 - 17.00 WIB)',
    tempat: 'Ruang Multimedia & Kelas',
    foto: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Melatih keberanian berbicara di depan publik, tata cara menjadi MC, khutbah Jum\'at, dan pidato keagamaan.',
    jumlahAnggota: 38
  },
  {
    id: 'eks-4',
    nama: 'Seni Kaligrafi Islam (Khat Naskhi, Riq\'ah & Tsuluts)',
    pembina: 'Ust. Ridwan Hakim, S.Ag.',
    jadwalLatihan: 'Selasa Sore (16.00 - 17.15 WIB)',
    tempat: 'Lab Seni Kaligrafi',
    foto: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Mengasah keindahan tulisan ayat suci Al-Qur\'an di atas kanvas dan kertas hias.',
    jumlahAnggota: 30
  },
  {
    id: 'eks-5',
    nama: 'Seni Tilawatil Qur\'an (Qiro\'ah Mujawwad)',
    pembina: 'Qari\' Nasional Ustadz H. Sholihin',
    jadwalLatihan: 'Sabtu Sore (16.00 - 17.30 WIB)',
    tempat: 'Masjid Jami\' Al-Ikhlas',
    foto: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500&auto=format&fit=crop&q=80',
    deskripsi: 'Mempelajari 7 lagu tilawah Al-Qur\'an (Bayati, Shoba, Hijaz, Nahawand, Rast, Sikah, Jiharkah).',
    jumlahAnggota: 28
  }
];

// =========================================================================
// 17. DAFTAR PRESTASI LEMBAGA
// =========================================================================
export const PRESTASI_LIST: PrestasiItem[] = [
  {
    id: 'prs-1',
    namaLomba: 'Musabaqah Qira\'atil Kutub (MQK) Kitab Fathul Qorib',
    kategori: 'Keagamaan / MTQ',
    tingkat: 'Provinsi',
    juara: 'Juara 1 Tingkat Jawa Tengah',
    namaPeserta: 'Fajar Shodiq Al-Hafidz',
    tahun: '2025',
    penyelenggara: 'Kantor Wilayah Kementerian Agama Jawa Tengah'
  },
  {
    id: 'prs-2',
    namaLomba: 'Pekan Olahraga dan Seni Diniyah (PORSADIN) Cabang Pidato Bahasa Arab',
    kategori: 'Akademik',
    tingkat: 'Kabupaten',
    juara: 'Juara 1 Kabupaten Kendal',
    namaPeserta: 'Rizqi Maulana Akbar',
    tahun: '2025',
    penyelenggara: 'Forum Komunikasi Diniyah Takmiliyah (FKDT) Kendal'
  },
  {
    id: 'prs-3',
    namaLomba: 'Festival Hadroh Banjari Tingkat Karesidenan Semarang',
    kategori: 'Seni & Olahraga',
    tingkat: 'Karesidenan / Wilayah',
    juara: 'Juara Umum & Best Vocal',
    namaPeserta: 'Grup Hadroh El-Ikhlas',
    tahun: '2025',
    penyelenggara: 'Lesbumi PCNU & Universitas Wahid Hasyim'
  },
  {
    id: 'prs-4',
    namaLomba: 'Lomba Cerdas Cermat Kitab Kuning & Aswaja',
    kategori: 'Akademik',
    tingkat: 'Kabupaten',
    juara: 'Juara 1 Tingkat Kabupaten',
    namaPeserta: 'Tim Santri Kelas 5 (Rayhan, Zaidan, Salma)',
    tahun: '2024',
    penyelenggara: 'RMI-NU & FKDT Kab. Kendal'
  },
  {
    id: 'prs-5',
    namaLomba: 'Kejuaraan Pencak Silat Pagar Nusa Cup Tingkat Pelajar',
    kategori: 'Seni & Olahraga',
    tingkat: 'Provinsi',
    juara: 'Juara 2 Tanding Kelas C Putra',
    namaPeserta: 'Muhammad Hilman Farisi',
    tahun: '2024',
    penyelenggara: 'Pimpinan Wilayah Pagar Nusa Jawa Tengah'
  }
];

// =========================================================================
// 18. ALAMAT LEMBAGA, CONTACT, GROUP WA, REKENING
// =========================================================================
export const KONTAK_REKENING_DATA = {
  namaLembaga: 'Madrasah Diniyah Takmiliyah Al-Ikhlas Kendal',
  alamatLengkap: 'Jl. Pesantren No. 09, Desa Magelung Kulon RT 03/RW 02, Kec. Kaliwungu Selatan, Kab. Kendal, Jawa Tengah 51372',
  patokan: '500 meter sebelah timur Makam Pahlawan / 10 menit dari Alun-Alun Kaliwungu Kendal',
  googleMapsUrl: 'https://maps.google.com/?q=Kaliwungu+Kendal+Jawa+Tengah',
  kontak: [
    { label: 'Kantor Tata Usaha Madrasah', noTelp: '(0294) 381234', icon: 'Phone' },
    { label: 'Hotline WhatsApp Resmi Madrasah', noTelp: '0812-3456-7890 (Ust. Zainuri)', icon: 'MessageCircle' },
    { label: 'Layanan Pembayaran Syahriyah & KOPAS', noTelp: '0813-9876-5432 (Ustzh. Nur Laili)', icon: 'Wallet' },
    { label: 'Konsultasi Pendaftaran Santri Baru (PSB)', noTelp: '0815-7766-5544 (Ustzh. Siti Fatimah)', icon: 'HelpCircle' }
  ],
  groupWhatsApp: [
    { namaGroup: 'Group WA Wali Santri Kelas 1 - 3', link: 'https://chat.whatsapp.com/sample-grup-wali-1-3', jumlahMember: '145 Anggota' },
    { namaGroup: 'Group WA Wali Santri Kelas 4 - 6', link: 'https://chat.whatsapp.com/sample-grup-wali-4-6', jumlahMember: '160 Anggota' },
    { namaGroup: 'Group Informasi & Pengumuman Resmi Madrasah', link: 'https://chat.whatsapp.com/sample-pengumuman-madrasah', jumlahMember: '450 Anggota' }
  ],
  rekeningBank: [
    {
      bank: 'Bank Syariah Indonesia (BSI)',
      nomorRekening: '719.8822.334',
      atasNama: 'YAYASAN AL-IKHLAS KENDAL / MADRASAH',
      kodeBank: '451',
      keterangan: 'Khusus Pembayaran Syahriyah, Infaq Pembangunan & Donasi'
    },
    {
      bank: 'Bank Rakyat Indonesia (BRI)',
      nomorRekening: '0034-01-002345-50-8',
      atasNama: 'MADRASAH DINIYAH AL IKHLAS',
      kodeBank: '002',
      keterangan: 'Operasional Madrasah & Koperasi Santri (KOPAS)'
    },
    {
      bank: 'Bank Jateng Syariah',
      nomorRekening: '502.300.8910',
      atasNama: 'YASMIN AL-IKHLAS KENDAL',
      kodeBank: '113',
      keterangan: 'Program Beasiswa Santri Yatim & Tahfidz'
    }
  ]
};
