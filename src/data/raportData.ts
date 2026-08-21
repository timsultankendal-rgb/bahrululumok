import { RaportSantri, RaportNilaiItem } from '../types';
import { BIODATA_MURID_LIST } from './madrasahCompleteData';

export const MAPEL_DINIYAH_11 = [
  { id: 'm1', namaMapel: 'Fiqih Ibadah', kitab: 'Safinatun Najah / Fathul Qorib', kkm: 70 },
  { id: 'm2', namaMapel: 'Tauhid Aqidah', kitab: 'Aqidatul Awam / Jawahirul Kalamiyah', kkm: 70 },
  { id: 'm3', namaMapel: 'Ahlaqul Karimah', kitab: 'Ahlaqul Banin / Taisirul Kholaq', kkm: 75 },
  { id: 'm4', namaMapel: 'Al-Qur\'an & Tajwid', kitab: 'Tuhfatul Athfal & Yanbu\'a', kkm: 75 },
  { id: 'm5', namaMapel: 'Bahasa Arab', kitab: 'Durusullughoh Al-Arobiyyah', kkm: 65 },
  { id: 'm6', namaMapel: 'Nahwu Dasar', kitab: 'Matan Al-Jurumiyyah', kkm: 65 },
  { id: 'm7', namaMapel: 'Sorof', kitab: 'Al-Amtsilah At-Tashrifiyyah', kkm: 65 },
  { id: 'm8', namaMapel: 'Tarikh Islam', kitab: 'Khulashoh Nurul Yaqin', kkm: 70 },
  { id: 'm9', namaMapel: 'Ke-NU-an & Aswaja', kitab: 'Risalah Ahlussunnah Wal Jama\'ah', kkm: 70 },
  { id: 'm10', namaMapel: 'Hadits Pilihan', kitab: 'Matan Arba\'in An-Nawawiyyah', kkm: 70 },
  { id: 'm11', namaMapel: 'Imlak & Tulis Pegon', kitab: 'Khat Riq\'ah & Naskhi Pegon', kkm: 70 },
];

export function angkaKeHuruf(n: number): string {
  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (n < 12) return satuan[n];
  if (n < 20) return `${satuan[n - 10]} Belas`;
  if (n < 100) {
    const puluhan = Math.floor(n / 10);
    const sisa = n % 10;
    return `${satuan[puluhan]} Puluh${sisa > 0 ? ' ' + satuan[sisa] : ''}`;
  }
  if (n === 100) return 'Seratus';
  return String(n);
}

export function hitungPredikat(nilai: number): string {
  if (nilai >= 90) return 'A (Mumtaz)';
  if (nilai >= 80) return 'B+ (Jayyid Jiddan)';
  if (nilai >= 75) return 'B (Jayyid)';
  if (nilai >= 65) return 'C (Maqbul)';
  return 'D (Rosib / Kurang)';
}

export function getKeteranganCapaian(mapel: string, nilai: number): string {
  if (nilai >= 90) {
    return `Sangat menguasai seluruh materi dan praktik ${mapel} dengan tuntas & mutqin.`;
  }
  if (nilai >= 80) {
    return `Mampu memahami konsep utama dan mempraktikkan materi ${mapel} dengan baik.`;
  }
  if (nilai >= 70) {
    return `Cukup menguasai materi ${mapel}, perlu peningkatan pengulangan/muroja'ah.`;
  }
  return `Belum tuntas KKM, membutuhkan bimbingan intensif dan remidial materi ${mapel}.`;
}

/**
 * Generate default realistic Raport Santri for any student and cawu
 */
export function generateDefaultRaport(santriId: string, cawu: string = 'Cawu 1'): RaportSantri {
  const student = BIODATA_MURID_LIST.find((m) => m.id === santriId) || BIODATA_MURID_LIST[3];
  
  // Deterministic seed based on student ID and cawu
  const charCodeSum = (student.nama + cawu).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  
  const baseOffsets: Record<string, number> = {
    'mrd-1': 88,
    'mrd-2': 82,
    'mrd-3': 85,
    'mrd-4': 89,
    'mrd-5': 84,
    'mrd-6': 91,
    'mrd-7': 86,
    'mrd-8': 87,
  };
  
  const cawuOffset = cawu === 'Cawu 2' ? 2 : cawu === 'Cawu 3' ? 4 : 0;
  const baseScore = (baseOffsets[student.id] || 82) + cawuOffset;

  const nilaiList: RaportNilaiItem[] = MAPEL_DINIYAH_11.map((m, idx) => {
    // Variation per subject
    const variation = ((charCodeSum + idx * 7) % 13) - 6; // -6 to +6
    const nilaiTugas = Math.min(98, Math.max(65, baseScore + variation + 2));
    const nilaiUjian = Math.min(98, Math.max(60, baseScore + variation - 1));
    const finalScore = Math.round(nilaiTugas * 0.4 + nilaiUjian * 0.6);

    return {
      id: m.id,
      namaMapel: m.namaMapel,
      kitab: m.kitab,
      kkm: m.kkm,
      nilaiTugas,
      nilaiUjian,
      nilaiAngka: finalScore,
      nilaiHuruf: angkaKeHuruf(finalScore),
      predikat: hitungPredikat(finalScore),
      keterangan: getKeteranganCapaian(m.namaMapel, finalScore),
    };
  });

  const totalNilai = nilaiList.reduce((acc, n) => acc + n.nilaiAngka, 0);
  const rataRata = Number((totalNilai / nilaiList.length).toFixed(2));

  // Determine ranking
  const rank = Math.max(1, Math.min(32, Math.floor(35 - (rataRata - 60) * 0.8)));

  const tahfidzMap: Record<string, string> = {
    'Kelas 1': 'Juz 30 (Surat An-Nas s/d Adh-Dhuha) & Doa Harian',
    'Kelas 2': 'Juz 30 (Lengkap Mutqin) & Doa Qunut & Wirid Sholat',
    'Kelas 3': 'Juz 30 (Mutqin) & Surat Yasin, Al-Waqi\'ah',
    'Kelas 4': 'Juz 30 & Juz 1 (Surat Al-Baqarah 1-141) & Al-Mulk',
    'Kelas 5': 'Juz 30, Juz 1, Juz 2 & Nadhom Matan Jurumiyyah',
    'Kelas 6': 'Juz 30, Juz 1 s/d 3 (Mutqin) & Nadhom Imrithi & Arba\'in',
  };

  return {
    id: `rap_${student.id}_${cawu.replace(/\s+/g, '').toLowerCase()}`,
    santriId: student.id,
    noInduk: student.noInduk,
    nisn: student.nisn,
    nama: student.nama,
    namaSantri: student.nama,
    kelas: student.kelas,
    cawu: cawu as any,
    tahunAjaran: '2025/2026',
    semester: `${cawu} - Tahun Ajaran 2025/2026`,
    totalNilai,
    rataRata,
    peringkat: rank,
    totalSiswa: 32,
    sikapDanAkhlak: 'Sangat Baik (A). Disiplin sholat berjamaah 5 waktu, istiqomah tadarus, dan santun takdzim kepada para Asatidz.',
    hafalanJuz: tahfidzMap[student.kelas] || 'Juz 30 (Lulus Ujian Munaqosyah Mutqin)',
    catatanGuru: `Alhamdulillah ananda ${student.nama} menunjukkan perkembangan yang sangat positif dalam pemahaman ilmu diniyah dan kelancaran membaca kitab kuning berharakat/makna pegon. Pertahankan semangat belajar dan istiqomah dalam muroja'ah.`,
    namaWaliKelas: 'Ust. Ahmad Mufid, M.Pd.I.',
    namaKepalaMadrasah: 'KH. Abdullah Syukri, Lc.',
    tanggalRaport: cawu === 'Cawu 1' ? '28 November 2025' : cawu === 'Cawu 2' ? '28 Maret 2026' : '20 Juni 2026',
    kehadiran: {
      sakit: (charCodeSum % 3),
      izin: ((charCodeSum + 1) % 2),
      alpa: 0,
      ijin: ((charCodeSum + 1) % 2),
      alpha: 0,
    },
    ekskul: [
      { kegiatan: 'Khitobah / Muhadharah Santri', nilai: 'A (Sangat Baik)', keterangan: 'Percaya diri dan fasih dalam berpidato bahasa Arab & Indonesia' },
      { kegiatan: 'Seni Hadroh & Sholawat', nilai: 'A (Sangat Baik)', keterangan: 'Menguasai pukulan rebana terbang dan vokal kasidah' },
      { kegiatan: 'Pramuka Santri & Kepanduan', nilai: 'B+ (Baik)', keterangan: 'Aktif dalam baris-berbaris dan bakti sosial madrasah' },
    ],
    keputusan: cawu === 'Cawu 3' 
      ? `Berdasarkan hasil evaluasi Cawu 1, 2, dan 3, santri dinyatakan NAIK KE KELAS BERIKUTNYA.` 
      : `Berdasarkan hasil belajar ${cawu}, santri dinyatakan TUNTAS dan Berhak melanjutkan ke tahap cawu berikutnya.`,
    nilaiList,
  };
}

/**
 * Initial dataset of raports for all students
 */
export const INITIAL_RAPORT_COLLECTION: RaportSantri[] = BIODATA_MURID_LIST.flatMap((s) => [
  generateDefaultRaport(s.id, 'Cawu 1'),
  generateDefaultRaport(s.id, 'Cawu 2'),
  generateDefaultRaport(s.id, 'Cawu 3'),
]);
