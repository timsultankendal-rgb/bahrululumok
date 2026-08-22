import { 
  StudentProfile, 
  TeacherProfile, 
  PrayerTime, 
  JadwalItem, 
  TugasItem, 
  TahfidzRecord, 
  TagihanItem, 
  SurahItem, 
  DoaItem, 
  CBTExam, 
  MutabaahItem, 
  PengumumanItem,
  PresensiRecord 
} from '../types';

export const INITIAL_STUDENT: StudentProfile = {
  nisn: '0089241890',
  nis: '2324.09.042',
  name: 'Muhammad Rayhan Pratama',
  arabicName: 'مُحَمَّد رَيْحَان بَرَاتَامَا',
  madrasahName: 'MDT Ula NU 09 Bahrul Ulum Kendal',
  level: 'Kelas IX-A (Tahfidz & Sains)',
  academicYear: '2025/2026 Ganjil',
  photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80',
  gender: 'L',
  waliName: 'H. Bambang Setyawan, S.E.',
  phone: '0812-3456-7890',
  address: 'Jl. Raya Soekarno-Hatta No. 128, Kendal, Jawa Tengah',
  points: 98,
  tahfidzProgress: {
    juzMemorized: 4,
    targetJuz: 6,
    currentSurah: "An-Naba' (Juz 30)",
  }
};

export const INITIAL_TEACHER: TeacherProfile = {
  nip: '198504122010011008',
  name: 'Ustadz H. Ahmad Mufid, M.Pd.I.',
  title: 'Guru Fiqih & Pembina Tahfidz',
  subject: 'Fiqih & Ushul Fiqih',
  classTeacherOf: 'Wali Kelas IX-A',
  photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  madrasahName: 'MDT Ula NU 09 Bahrul Ulum Kendal',
  phone: '0813-9876-5432'
};

export const PRAYER_SCHEDULE: PrayerTime[] = [
  { name: 'Imsak', time: '04:18', arabicName: 'الإمساك' },
  { name: 'Subuh', time: '04:28', arabicName: 'الفجر' },
  { name: 'Terbit', time: '05:45', arabicName: 'الشروق' },
  { name: 'Dhuha', time: '06:15', arabicName: 'الضحى' },
  { name: 'Dzuhur', time: '11:47', arabicName: 'الظهر' },
  { name: 'Ashar', time: '15:08', arabicName: 'العصر', isNext: true },
  { name: 'Maghrib', time: '17:46', arabicName: 'المغرب' },
  { name: 'Isya', time: '18:56', arabicName: 'العشاء' },
];

export const JADWAL_PELAJARAN: JadwalItem[] = [
  {
    id: 'jdw-1',
    hari: 'Senin',
    jamMulai: '07:00',
    jamSelesai: '08:20',
    mataPelajaran: "Al-Qur'an Hadits",
    guru: 'Drs. KH. Syamsul Huda',
    ruang: 'Lab Keagamaan 1',
    iconName: 'BookOpen',
    color: 'emerald'
  },
  {
    id: 'jdw-2',
    hari: 'Senin',
    jamMulai: '08:20',
    jamSelesai: '09:40',
    mataPelajaran: 'Fiqih Ibadah',
    guru: 'Ustadz Ahmad Mufid, M.Pd.I',
    ruang: 'Kelas IX-A',
    iconName: 'Sparkles',
    color: 'teal'
  },
  {
    id: 'jdw-3',
    hari: 'Senin',
    jamMulai: '10:00',
    jamSelesai: '11:20',
    mataPelajaran: 'Bahasa Arab',
    guru: 'Ustadzah Siti Fatimah, Lc.',
    ruang: 'Kelas IX-A',
    iconName: 'Languages',
    color: 'amber'
  },
  {
    id: 'jdw-4',
    hari: 'Senin',
    jamMulai: '12:30',
    jamSelesai: '14:00',
    mataPelajaran: 'Matematika Terapan',
    guru: 'Nurul Hidayah, S.Pd., M.Si.',
    ruang: 'Kelas IX-A',
    iconName: 'Calculator',
    color: 'blue'
  },
  {
    id: 'jdw-5',
    hari: 'Selasa',
    jamMulai: '07:00',
    jamSelesai: '08:30',
    mataPelajaran: 'Akidah Akhlak',
    guru: 'Ustadz Drs. H. Ridwan, M.Ag',
    ruang: 'Kelas IX-A',
    iconName: 'HeartHandshake',
    color: 'rose'
  },
  {
    id: 'jdw-6',
    hari: 'Selasa',
    jamMulai: '08:30',
    jamSelesai: '10:00',
    mataPelajaran: 'Sejarah Kebudayaan Islam (SKI)',
    guru: 'Zainal Abidin, S.Pd.I',
    ruang: 'Kelas IX-A',
    iconName: 'Landmark',
    color: 'indigo'
  },
  {
    id: 'jdw-7',
    hari: 'Selasa',
    jamMulai: '10:15',
    jamSelesai: '11:45',
    mataPelajaran: 'IPA Terpadu (Fisika & Biologi)',
    guru: 'Dr. Hendro Wibowo, M.Pd',
    ruang: 'Lab Sains MTs',
    iconName: 'Atom',
    color: 'cyan'
  },
  {
    id: 'jdw-8',
    hari: 'Rabu',
    jamMulai: '07:00',
    jamSelesai: '09:00',
    mataPelajaran: 'Halaqah Tahfidz & Tajwid',
    guru: 'Ustadz Hafidz Al-Mukarram',
    ruang: 'Masjid Madrasah',
    iconName: 'GraduationCap',
    color: 'emerald'
  },
  {
    id: 'jdw-9',
    hari: 'Rabu',
    jamMulai: '09:15',
    jamSelesai: '11:00',
    mataPelajaran: 'Bahasa Inggris',
    guru: 'Sarah Amalia, M.Hum.',
    ruang: 'Lab Bahasa',
    iconName: 'Globe',
    color: 'violet'
  },
  {
    id: 'jdw-10',
    hari: 'Kamis',
    jamMulai: '07:00',
    jamSelesai: '08:30',
    mataPelajaran: 'Nahwu Shorof & Kitab Kuning',
    guru: 'Ustadz M. Luqman Hakim',
    ruang: 'Kelas IX-A',
    iconName: 'Scroll',
    color: 'amber'
  },
  {
    id: 'jdw-11',
    hari: 'Kamis',
    jamMulai: '08:45',
    jamSelesai: '10:15',
    mataPelajaran: 'Imlak & Pegon Melayu',
    guru: 'Ust. Ridwan Hakim, S.Ag.',
    ruang: 'Kelas IX-A',
    iconName: 'BookOpen',
    color: 'teal'
  },
  {
    id: 'jdw-12',
    hari: 'Jumat',
    jamMulai: '06:30',
    jamSelesai: '08:00',
    mataPelajaran: 'Mujahadah & Khotmil Quran',
    guru: 'KH. Abdullah Syukri, Lc.',
    ruang: 'Masjid Utama',
    iconName: 'Sparkles',
    color: 'emerald'
  },
  {
    id: 'jdw-13',
    hari: 'Jumat',
    jamMulai: '08:00',
    jamSelesai: '09:30',
    mataPelajaran: 'Khotbah & Ibadah Sholat Jumat',
    guru: 'Drs. KH. Syamsul Huda',
    ruang: 'Masjid Utama',
    iconName: 'Landmark',
    color: 'indigo'
  },
  {
    id: 'jdw-14',
    hari: 'Sabtu',
    jamMulai: '14:00',
    jamSelesai: '15:00',
    mataPelajaran: 'Fiqih Ibadah (Safinatun Najah)',
    guru: 'Ust. Ahmad Mufid, M.Pd.I.',
    ruang: 'Kelas IX-A',
    iconName: 'BookOpen',
    color: 'emerald'
  },
  {
    id: 'jdw-15',
    hari: 'Sabtu',
    jamMulai: '15:15',
    jamSelesai: '16:15',
    mataPelajaran: 'Tauhid Aqidah (Aqidatul Awam)',
    guru: 'KH. Abdullah Syukri, Lc.',
    ruang: 'Kelas IX-A',
    iconName: 'Sparkles',
    color: 'teal'
  },
  {
    id: 'jdw-16',
    hari: 'Ahad',
    jamMulai: '14:00',
    jamSelesai: '15:00',
    mataPelajaran: "Al-Qur'an & Tajwid Praktis",
    guru: 'Ust. Ridwan Hakim, S.Ag.',
    ruang: 'Kelas IX-A',
    iconName: 'BookOpen',
    color: 'blue'
  },
  {
    id: 'jdw-17',
    hari: 'Ahad',
    jamMulai: '15:15',
    jamSelesai: '16:15',
    mataPelajaran: 'Ahlaqul Karimah (Ahlaqul Banin)',
    guru: 'Ust. Ahmad Mufid, M.Pd.I.',
    ruang: 'Kelas IX-A',
    iconName: 'HeartHandshake',
    color: 'rose'
  }
];

export const TUGAS_LIST: TugasItem[] = [
  {
    id: 'tgs-1',
    mataPelajaran: 'Fiqih Ibadah',
    judul: 'Resume Bab Pembagian Harta Waris & Faraidh',
    deskripsi: 'Buat rangkuman pembagian ashabul furudh beserta contoh studi kasus perhitungan dalam 2 halaman.',
    deadline: 'Besok, 23:59 WIB',
    guru: 'Ustadz Ahmad Mufid, M.Pd.I',
    status: 'belum_selesai'
  },
  {
    id: 'tgs-2',
    mataPelajaran: "Al-Qur'an Hadits",
    judul: 'Hafalan Hadits Keutamaan Menuntut Ilmu',
    deskripsi: 'Rekam video hafalan hadits riwayat Ibnu Majah dengan makharijul huruf yang tepat.',
    deadline: '20 Agustus 2026',
    guru: 'Drs. KH. Syamsul Huda',
    status: 'dikirim',
    nilai: undefined
  },
  {
    id: 'tgs-3',
    mataPelajaran: 'Bahasa Arab',
    judul: 'Insya (Mengarang) Tentang Kegiatan di Pesantren',
    deskripsi: 'Menulis karangan Bahasa Arab minimal 100 kata dengan tema "Yaumiyyatuna fil Ma\'had".',
    deadline: '14 Agustus 2026',
    guru: 'Ustadzah Siti Fatimah, Lc.',
    status: 'dinilai',
    nilai: 95,
    catatanGuru: 'Mumtaz jiddan! Kaidah nahwu dan pemilihan kosa kata sangat baik.'
  }
];

export const TAHFIDZ_HISTORY: TahfidzRecord[] = [
  {
    id: 'thf-1',
    tanggal: '17 Agustus 2026',
    surat: "An-Naba'",
    ayat: 'Ayat 1 - 20',
    juz: 30,
    kategori: 'Ziyadah (Hafalan Baru)',
    nilai: 'Mumtaz (A)',
    ustadz: 'Ustadz Hafidz Al-Mukarram',
    catatan: 'Lancar, tajwid mad jaiz munfashil diperhatikan kembali'
  },
  {
    id: 'thf-2',
    tanggal: '15 Agustus 2026',
    surat: 'Al-Mulk',
    ayat: 'Ayat 1 - 30 (Khatam Surat)',
    juz: 29,
    kategori: 'Murajaah (Ulang Hafalan)',
    nilai: 'Mumtaz (A)',
    ustadz: 'Ustadz Hafidz Al-Mukarram',
    catatan: 'Sangat fasih, intonasi tartil bagus'
  },
  {
    id: 'thf-3',
    tanggal: '12 Agustus 2026',
    surat: 'Al-Waqi\'ah',
    ayat: 'Ayat 45 - 96',
    juz: 27,
    kategori: 'Murajaah (Ulang Hafalan)',
    nilai: 'Jayyid Jiddan (B+)',
    ustadz: 'Ustadz M. Luqman Hakim',
    catatan: 'Ada sedikit waqaf yang tertukar di ayat 70'
  },
  {
    id: 'thf-4',
    tanggal: '08 Agustus 2026',
    surat: 'Yasin',
    ayat: 'Ayat 1 - 83 (Khatam Surat)',
    juz: 22,
    kategori: 'Murajaah (Ulang Hafalan)',
    nilai: 'Mumtaz (A)',
    ustadz: 'Ustadz Hafidz Al-Mukarram',
    catatan: 'Alhamdulillah mutqin!'
  }
];

export const TAGIHAN_SPP: TagihanItem[] = [
  {
    id: 'inv-2026-08',
    judul: 'Syahriyah & ADM Santri - Agustus 2026',
    bulan: 'Agustus 2026',
    nominal: 450000,
    jatuhTempo: '10 Agustus 2026',
    status: 'lunas',
    metodePembayaran: 'QRIS Bank Syariah Indonesia',
    tanggalBayar: '05 Agustus 2026, 09:15 WIB',
    idTransaksi: 'TRX-BSI-88910248'
  },
  {
    id: 'inv-2026-09',
    judul: 'Syahriyah & ADM Santri - September 2026',
    bulan: 'September 2026',
    nominal: 450000,
    jatuhTempo: '10 September 2026',
    status: 'belum_selesai' as unknown as 'belum_lunas', // will normalize to belum_lunas
  },
  {
    id: 'inv-kegiatan-01',
    judul: 'Infaq Program Ekstrakurikuler & Robotik Robotika',
    bulan: 'Semester Ganjil 2026',
    nominal: 125000,
    jatuhTempo: '30 Agustus 2026',
    status: 'belum_lunas'
  }
];

export const SURAH_LIST: SurahItem[] = [
  {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    englishTranslation: 'The Opening',
    indonesianTranslation: 'Pembukaan',
    numberOfAyahs: 7,
    revelationType: 'Makkah',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillāhir-raḥmānir-raḥīm',
        translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.'
      },
      {
        numberInSurah: 2,
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Al-ḥamdu lillāhi rabbil-‘ālamīn',
        translation: 'Segala puji bagi Allah, Tuhan seluruh alam,'
      },
      {
        numberInSurah: 3,
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-raḥmānir-raḥīm',
        translation: 'Yang Maha Pengasih, Maha Penyayang,'
      },
      {
        numberInSurah: 4,
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Māliki yaumid-dīn',
        translation: 'Pemilik hari pembalasan.'
      },
      {
        numberInSurah: 5,
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyāka na‘budu wa iyyāka nasta‘īn',
        translation: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.'
      },
      {
        numberInSurah: 6,
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinaṣ-ṣirāṭal-mustaqīm',
        translation: 'Tunjukilah kami jalan yang lurus,'
      },
      {
        numberInSurah: 7,
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Ṣirāṭallażīna an‘amta ‘alaihim gairil-magḍūbi ‘alaihim wa laḍ-ḍāllīn',
        translation: '(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.'
      }
    ]
  },
  {
    number: 67,
    name: 'Al-Mulk',
    arabicName: 'الملك',
    englishTranslation: 'The Sovereignty',
    indonesianTranslation: 'Kerajaan',
    numberOfAyahs: 30,
    revelationType: 'Makkah',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Tabārakallażī biyadihil-mulku wa huwa ‘alā kulli syai\'in qadīr',
        translation: 'Mahasuci Allah yang di tangan-Nya lah segala kerajaan, dan Dia Mahakuasa atas segala sesuatu,'
      },
      {
        numberInSurah: 2,
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
        transliteration: 'Allażī khalaqal-mauta wal-ḥayāta liyabluwakum ayyukum aḥsanu ‘amalā, wa huwal-‘azīzul-gafūr',
        translation: 'Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Mahaperkasa, Maha Pengampun.'
      },
      {
        numberInSurah: 3,
        arabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ',
        transliteration: 'Allażī khalaqa sab‘a samāwātin ṭibāqā, mā tarā fī khalqir-raḥmāni min tafāwut',
        translation: 'Yang menciptakan tujuh langit berlapis-lapis. Tidak akan kamu lihat sesuatu yang tidak seimbang pada ciptaan Tuhan Yang Maha Pengasih.'
      }
    ]
  },
  {
    number: 78,
    name: "An-Naba'",
    arabicName: 'النبأ',
    englishTranslation: 'The Tidings',
    indonesianTranslation: 'Berita Besar',
    numberOfAyahs: 40,
    revelationType: 'Makkah',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'عَمَّ يَتَسَاءَلُونَ',
        transliteration: '‘Amma yatasā\'alūn',
        translation: 'Tentang apakah mereka saling bertanya-tanya?'
      },
      {
        numberInSurah: 2,
        arabic: 'عَنِ النَّبَإِ الْعَظِيمِ',
        transliteration: '‘Anin-naba\'il-‘aẓīm',
        translation: 'Tentang berita yang besar (hari berbangkit),'
      },
      {
        numberInSurah: 3,
        arabic: 'الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ',
        transliteration: 'Allażī hum fīhi mukhtalifūn',
        translation: 'yang dalam hal itu mereka berselisih.'
      },
      {
        numberInSurah: 4,
        arabic: 'كَلَّا سَيَعْلَمُونَ',
        transliteration: 'Kallā saya‘lamūn',
        translation: 'Tidak! Kelak mereka akan mengetahui,'
      },
      {
        numberInSurah: 5,
        arabic: 'ثُمَّ كَلَّا سَيَعْلَمُونَ',
        transliteration: 'Ṡumma kallā saya‘lamūn',
        translation: 'sekali lagi tidak! Kelak mereka akan mengetahui.'
      }
    ]
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الإخلاص',
    englishTranslation: 'Sincerity',
    indonesianTranslation: 'Kemurnian Keesaan Allah',
    numberOfAyahs: 4,
    revelationType: 'Makkah',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwallāhu aḥad',
        translation: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."'
      },
      {
        numberInSurah: 2,
        arabic: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allāhuṣ-ṣamad',
        translation: 'Allah tempat meminta segala sesuatu.'
      },
      {
        numberInSurah: 3,
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yūlad',
        translation: '(Allah) tidak beranak dan tidak pula diperanakkan,'
      },
      {
        numberInSurah: 4,
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakul lahū kufuwan aḥad',
        translation: 'dan tidak ada sesuatu yang setara dengan Dia.'
      }
    ]
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabicName: 'الفلق',
    englishTranslation: 'Daybreak',
    indonesianTranslation: 'Waktu Subuh',
    numberOfAyahs: 5,
    revelationType: 'Makkah',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: 'Qul a‘ūżu birabbil-falaq',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhan yang menguasai subuh (fajar),'
      },
      {
        numberInSurah: 2,
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min syarri mā khalaq',
        translation: 'dari kejahatan (makhluk yang) Dia ciptakan,'
      },
      {
        numberInSurah: 3,
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wa min syarri gāsiqin iżā waqab',
        translation: 'dan dari kejahatan malam apabila telah gelap gulita,'
      }
    ]
  },
  {
    number: 114,
    name: 'An-Nas',
    arabicName: 'الناس',
    englishTranslation: 'Mankind',
    indonesianTranslation: 'Manusia',
    numberOfAyahs: 6,
    revelationType: 'Makkah',
    ayahs: [
      {
        numberInSurah: 1,
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: 'Qul a‘ūżu birabbin-nās',
        translation: 'Katakanlah, "Aku berlindung kepada Tuhannya manusia,'
      },
      {
        numberInSurah: 2,
        arabic: 'مَلِكِ النَّاسِ',
        transliteration: 'Malikin-nās',
        translation: 'Raja manusia,'
      },
      {
        numberInSurah: 3,
        arabic: 'إِلَٰهِ النَّاسِ',
        transliteration: 'Ilāhin-nās',
        translation: 'Sembahan manusia,'
      }
    ]
  }
];

export const DOA_LIST: DoaItem[] = [
  {
    id: 'doa-1',
    judul: 'Doa Sebelum Belajar (Menuntut Ilmu)',
    kategori: 'Pendidikan & Belajar',
    arab: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا وَاجْعَلْنِي مِنَ الصَّالِحِينَ',
    latin: 'Robbi zidnii \'ilman warzuqnii fahman waj\'alnii minash-shoolihiin.',
    terjemah: 'Ya Allah, tambahkanlah ilmuku dan karuniakanlah kepadaku pemahaman yang baik, serta jadikanlah aku termasuk golongan orang-orang yang shaleh.',
    riwayat: 'HR. At-Tirmidzi'
  },
  {
    id: 'doa-2',
    judul: 'Doa Untuk Kedua Orang Tua (Birrul Walidain)',
    kategori: 'Keluarga',
    arab: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbighfir lii waliwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa.',
    terjemah: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka berdua sebagaimana mereka telah mendidikku di waktu kecil.',
    riwayat: 'QS. Al-Isra: 24'
  },
  {
    id: 'doa-3',
    judul: 'Sayyidul Istighfar (Rajanya Istighfar)',
    kategori: 'Dzikir Pagi & Petang',
    arab: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: 'Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa \'abduka, wa anaa \'alaa \'ahdika wa wa\'dika mastatha\'tu, a\'uudzu bika min syarri maa shana\'tu, abuu-u laka bini\'matika \'alayya, wa abuu-u bidzanbii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illaa anta.',
    terjemah: 'Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan selain Engkau. Engkau yang menciptakan aku dan aku adalah hamba-Mu...',
    riwayat: 'HR. Bukhari no. 6306'
  },
  {
    id: 'doa-4',
    judul: 'Doa Masuk Masjid',
    kategori: 'Ibadah',
    arab: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allahummaf-tah lii abwaaba rahmatik.',
    terjemah: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    riwayat: 'HR. Muslim'
  },
  {
    id: 'doa-5',
    judul: 'Doa Kebaikan Dunia & Akhirat (Sapu Jagad)',
    kategori: 'Doa Umum',
    arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbanaa aatinaa fiddunyaa hasanah wa fil aakhirati hasanah wa qinaa \'adzaaban-naar.',
    terjemah: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa neraka.',
    riwayat: 'QS. Al-Baqarah: 201'
  }
];

export const CBT_EXAM_DATA: CBTExam = {
  id: 'cbt-fiqih-01',
  mataPelajaran: 'Fiqih & Ibadah Praktis',
  judul: 'Ujian Penilaian Tengah Semester (PTS) Ganjil MTs',
  durasiMenit: 15,
  jumlahSoal: 5,
  guru: 'Ustadz Ahmad Mufid, M.Pd.I',
  status: 'siap',
  soalList: [
    {
      id: 1,
      pertanyaan: 'Rukun shalat yang pertama dan wajib dilakukan dalam keadaan berdiri bagi yang mampu adalah...',
      pilihan: [
        'Membaca Surat Al-Fatihah',
        'Niat dan Takbiratul Ihram',
        'Rukuk dengan thuma\'ninah',
        'Sujud dua kali'
      ],
      kunciJawaban: 1,
      pembahasan: 'Niat berbarengan dengan Takbiratul Ihram merupakan rukun qalbiy dan qauly pertama dalam shalat fardhu.'
    },
    {
      id: 2,
      pertanyaan: 'Berapakah nisab zakat mal emas murni menurut ketetapan syariat Islam?',
      arab: 'نِصَابُ الذَّهَبِ فِي الزَّكَاةِ',
      pilihan: [
        '50 gram',
        '85 gram murni',
        '100 gram',
        '200 dirham'
      ],
      kunciJawaban: 1,
      pembahasan: 'Nisab zakat emas adalah 20 Dinar atau setara dengan 85 gram emas murni dengan kadar zakat 2,5%.'
    },
    {
      id: 3,
      pertanyaan: 'Shalat sunnah yang dilakukan untuk memohon petunjuk di antara dua pilihan yang baik disebut...',
      pilihan: [
        'Shalat Hajat',
        'Shalat Tasbih',
        'Shalat Istikharah',
        'Shalat Kusuf'
      ],
      kunciJawaban: 2,
      pembahasan: 'Shalat Istikharah 2 rakaat disunnahkan bagi seorang muslim yang bimbang dalam menentukan pilihan yang mubah.'
    },
    {
      id: 4,
      pertanyaan: 'Air yang suci namun tidak dapat digunakan untuk bersuci (mensucikan yang lain) disebut air...',
      pilihan: [
        'Mutlak (Thohir Muthahhir)',
        'Musyammas (terkena panas matahari)',
        'Musta\'mal / Mutaghayyir (telah berubah sifatnya)',
        'Mutanajjis (terkena najis)'
      ],
      kunciJawaban: 2,
      pembahasan: 'Air musta\'mal atau air suci yang berubah sifat rasa/warna/baunya dengan benda suci lain (seperti air teh/kopi) berstatus Thohir Ghoiru Muthahhir.'
    },
    {
      id: 5,
      pertanyaan: 'Hukum membaca doa Qunut pada shalat Subuh menurut Mazhab Imam Syafi\'i adalah...',
      pilihan: [
        'Wajib ' ,
        'Sunnah Ab\'adh (bila lupa disunnahkan sujud sahwi)',
        'Sunnah Hai\'at',
        'Makruh'
      ],
      kunciJawaban: 1,
      pembahasan: 'Dalam Mazhab Syafi\'i, doa Qunut Subuh adalah Sunnah Ab\'adh yang dianjurkan sujud sahwi bila ditinggalkan.'
    }
  ]
};

export const MUTABAAH_ITEMS: MutabaahItem[] = [
  { id: 'm-1', kegiatan: 'Sholat Shubuh Berjamaah di Masjid', kategori: 'Sholat Wajib', waktu: '04:35 WIB', isDone: true },
  { id: 'm-2', kegiatan: 'Dzikir Pagi & Ratib Al-Haddad', kategori: 'Tilawah & Dzikir', waktu: '05:15 WIB', isDone: true },
  { id: 'm-3', kegiatan: 'Sholat Dhuha (2 / 4 Rakaat)', kategori: 'Sholat Sunnah', waktu: '07:15 WIB', isDone: true },
  { id: 'm-4', kegiatan: 'Tadarus Al-Qur\'an & Ziyadah Tahfidz', kategori: 'Tilawah & Dzikir', waktu: '11:30 WIB', isDone: false },
  { id: 'm-5', kegiatan: 'Sholat Dzuhur Berjamaah di Masjid', kategori: 'Sholat Wajib', waktu: '12:00 WIB', isDone: false },
  { id: 'm-6', kegiatan: 'Sholat Ashar Berjamaah & Wirid', kategori: 'Sholat Wajib', waktu: '15:15 WIB', isDone: false },
  { id: 'm-7', kegiatan: 'Dzikir Petang & Surat Al-Waqi\'ah', kategori: 'Tilawah & Dzikir', waktu: '16:30 WIB', isDone: false },
  { id: 'm-8', kegiatan: 'Sholat Maghrib Berjamaah & Rawatib', kategori: 'Sholat Wajib', waktu: '18:00 WIB', isDone: false },
  { id: 'm-9', kegiatan: 'Muthala\'ah Kitab Kuning / Belajar Malam', kategori: 'Adab & Akhlak', waktu: '19:00 WIB', isDone: false },
  { id: 'm-10', kegiatan: 'Sholat Isya Berjamaah & Sholat Witir', kategori: 'Sholat Wajib', waktu: '19:30 WIB', isDone: false },
  { id: 'm-11', kegiatan: 'Sholat Qiyamul Lail / Tahajjud', kategori: 'Sholat Sunnah', waktu: '03:15 WIB', isDone: false },
  { id: 'm-12', kegiatan: 'Sedekah Subuh / Infaq Yaumiyah', kategori: 'Adab & Akhlak', waktu: '05:00 WIB', isDone: false }
];

export const PENGUMUMAN_LIST: PengumumanItem[] = [
  {
    id: 'ann-1',
    judul: 'Pelaksanaan Penilaian Akhir Semester (PAS) Berbasis CBT Android',
    kategori: 'Akademik',
    tanggal: '17 Agustus 2026',
    isImportant: true,
    ringkasan: 'Seluruh santri wajib membawa tablet/smartphone dengan baterai terisi penuh dan aplikasi MadrasahKu terinstall.',
    isi: 'Assalamu\'alaikum Wr. Wb. Diberitahukan kepada seluruh santriwan/santriwati kelas VII, VIII, dan IX bahwa PAS Semester Ganjil akan dimulai tanggal 1 September 2026 menggunakan sistem Computer Based Test (CBT) pada aplikasi MadrasahKu. Pastikan akun dan jaringan internet siap.',
    penulis: 'Kepala Madrasah MTs Al-Ikhlas',
    gambarUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ann-2',
    judul: 'Juara 1 Lomba Robotik & Madrasah Young Researchers (MYRES) Tingkat Provinsi',
    kategori: 'Prestasi',
    tanggal: '14 Agustus 2026',
    isImportant: false,
    ringkasan: 'Selamat kepada tim robotik MTs Al-Ikhlas atas prestasi membanggakan merebut Juara 1 Tingkat Jawa Tengah.',
    isi: 'Alhamdulillahirabbil \'alamin, kontingen MTs Al-Ikhlas berhasil meraih predikat Juara 1 Kategori IoT & Smart Madrasah pada ajang bergengsi MYRES Kemenag Provinsi. Semoga menjadi inspirasi bagi santri lainnya.',
    penulis: 'Waka Kesiswaan & Prestasi',
    gambarUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ann-3',
    judul: 'Sosialisasi Program Tabungan Umroh & Beasiswa Tahfidz 30 Juz',
    kategori: 'Pondok',
    tanggal: '10 Agustus 2026',
    isImportant: false,
    ringkasan: 'Kerjasama dengan Bank Syariah Indonesia untuk pembukaan tabungan umroh santri berprestasi.',
    isi: 'Yayasan Al-Ikhlas membuka pendaftaran program beasiswa kuliah ke Universitas Al-Azhar Kairo bagi santri yang menyelesaikan hafalan 30 juz mutqin sebelum kelulusan.',
    penulis: 'Pengasuh Pesantren Al-Ikhlas',
    gambarUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=500&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_PRESENSI: PresensiRecord[] = [
  {
    id: 'pres-today',
    tanggal: 'Hari Ini, 18 Agustus 2026',
    jamMasuk: '06:42 WIB',
    status: 'Hadir',
    lokasi: 'Gerbang Utama Madrasah (Radius 12m Valid)',
  },
  {
    id: 'pres-1',
    tanggal: '17 Agustus 2026',
    jamMasuk: '06:35 WIB',
    jamPulang: '14:30 WIB',
    status: 'Hadir',
    lokasi: 'Gerbang Utama Madrasah (Radius 8m Valid)',
  },
  {
    id: 'pres-2',
    tanggal: '16 Agustus 2026',
    jamMasuk: '06:40 WIB',
    jamPulang: '14:28 WIB',
    status: 'Hadir',
    lokasi: 'Gerbang Utama Madrasah (Radius 15m Valid)',
  }
];
