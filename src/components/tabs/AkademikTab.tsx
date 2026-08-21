import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileText, 
  Award, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Play, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  HelpCircle,
  Download,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  JadwalItem, 
  TugasItem, 
  TahfidzRecord, 
  CBTExam, 
  StudentProfile, 
  TeacherProfile,
  UserRole 
} from '../../types';
import { JADWAL_PELAJARAN, TAHFIDZ_HISTORY, CBT_EXAM_DATA } from '../../data/mockData';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface AkademikTabProps {
  student: StudentProfile;
  teacher: TeacherProfile;
  activeRole: UserRole;
  tugasList: TugasItem[];
  onSubmitTugas: (tugasId: string) => void;
  onOpenNewTahfidzModal: () => void;
}

export const AkademikTab: React.FC<AkademikTabProps> = ({
  student,
  teacher,
  activeRole,
  tugasList,
  onSubmitTugas,
  onOpenNewTahfidzModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'jadwal' | 'tugas' | 'raport' | 'tahfidz' | 'cbt'>('jadwal');
  
  // Jadwal Day Filter
  const [selectedDay, setSelectedDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Ahad'>('Senin');

  // CBT Exam State
  const [cbtState, setCbtState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [cbtTimeLeft, setCbtTimeLeft] = useState<number>(900); // 15 mins in seconds

  // Upload dialog simulation
  const [uploadingTugasId, setUploadingTugasId] = useState<string | null>(null);

  // CBT Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cbtState === 'running' && cbtTimeLeft > 0) {
      timer = setInterval(() => {
        setCbtTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishCBT();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cbtState, cbtTimeLeft]);

  const handleStartCBT = () => {
    playTapSound();
    setCbtState('running');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setCbtTimeLeft(900);
  };

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    playTapSound();
    setUserAnswers({ ...userAnswers, [qId]: optionIdx });
  };

  const handleFinishCBT = () => {
    setCbtState('finished');
    playSuccessSound();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Calculate score
  const calculateCBTScore = () => {
    let correct = 0;
    CBT_EXAM_DATA.soalList.forEach((q) => {
      if (userAnswers[q.id] === q.kunciJawaban) {
        correct++;
      }
    });
    return {
      correct,
      total: CBT_EXAM_DATA.soalList.length,
      score: Math.round((correct / CBT_EXAM_DATA.soalList.length) * 100)
    };
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredJadwal = JADWAL_PELAJARAN.filter((j) => j.hari === selectedDay);

  const days: ('Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Ahad')[] = [
    'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'
  ];

  return (
    <div className="flex flex-col gap-3 p-4 pb-8 bg-slate-50">
      {/* Sub Header Navigation Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs flex overflow-x-auto hide-scrollbar gap-1 text-xs">
        <button
          id="subtab-akademik-jadwal"
          onClick={() => {
            playTapSound();
            setActiveSubTab('jadwal');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeSubTab === 'jadwal'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Jadwal</span>
        </button>

        <button
          id="subtab-akademik-tugas"
          onClick={() => {
            playTapSound();
            setActiveSubTab('tugas');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeSubTab === 'tugas'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>E-Tugas</span>
        </button>

        <button
          id="subtab-akademik-cbt"
          onClick={() => {
            playTapSound();
            setActiveSubTab('cbt');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeSubTab === 'cbt'
              ? 'bg-amber-500 text-slate-900 shadow-xs font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Ujian CBT</span>
        </button>

        <button
          id="subtab-akademik-tahfidz"
          onClick={() => {
            playTapSound();
            setActiveSubTab('tahfidz');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeSubTab === 'tahfidz'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Tahfidz</span>
        </button>

        <button
          id="subtab-akademik-raport"
          onClick={() => {
            playTapSound();
            setActiveSubTab('raport');
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
            activeSubTab === 'raport'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>E-Raport</span>
        </button>
      </div>

      {/* ================= 1. JADWAL PELAJARAN VIEW ================= */}
      {activeSubTab === 'jadwal' && (
        <div className="flex flex-col gap-3">
          {/* Day Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
            {days.map((day) => (
              <button
                key={day}
                id={`day-btn-${day}`}
                onClick={() => {
                  playTapSound();
                  setSelectedDay(day);
                }}
                className={`flex-1 min-w-[55px] py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDay === day
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Schedule List */}
          <div className="flex flex-col gap-2.5">
            {filteredJadwal.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white border border-slate-200/80 text-slate-500 text-xs shadow-xs">
                Tidak ada jadwal pelajaran pada hari {selectedDay} (Hari Libur / Ekstrakurikuler).
              </div>
            ) : (
              filteredJadwal.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-xs shrink-0 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{item.mataPelajaran}</h4>
                        <p className="text-[11px] text-emerald-600 font-semibold">{item.guru}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">{item.ruang}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                        {item.jamMulai} - {item.jamSelesai}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= 2. E-TUGAS VIEW ================= */}
      {activeSubTab === 'tugas' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Tugas Madrasah
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              {tugasList.filter((t) => t.status === 'belum_selesai').length} Perlu Dikerjakan
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {tugasList.map((tugas) => {
              const isSubmitted = tugas.status === 'dikirim' || tugas.status === 'dinilai';
              const isGraded = tugas.status === 'dinilai';

              return (
                <div
                  key={tugas.id}
                  className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                      {tugas.mataPelajaran}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isGraded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isSubmitted
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      }`}
                    >
                      {isGraded ? `Nilai: ${tugas.nilai}` : isSubmitted ? 'Terkirim' : 'Belum Selesai'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 mb-1">{tugas.judul}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2.5">{tugas.deskripsi}</p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
                    <div>
                      <span className="font-medium">Guru: {tugas.guru}</span>
                      <div className="text-[10px] text-amber-700 font-bold mt-0.5">Deadline: {tugas.deadline}</div>
                    </div>

                    {!isSubmitted ? (
                      <button
                        id={`btn-submit-tugas-${tugas.id}`}
                        onClick={() => {
                          playTapSound();
                          onSubmitTugas(tugas.id);
                          playSuccessSound();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Kirim Tugas</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Selesai</span>
                      </div>
                    )}
                  </div>

                  {tugas.catatanGuru && (
                    <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                      <span className="font-bold">Catatan Guru: </span>
                      {tugas.catatanGuru}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 3. CBT UJIAN ONLINE VIEW ================= */}
      {activeSubTab === 'cbt' && (
        <div className="flex flex-col gap-3">
          {cbtState === 'idle' && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 mx-auto flex items-center justify-center mb-3 shadow-2xs">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">{CBT_EXAM_DATA.judul}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Mata Pelajaran: <span className="text-emerald-700 font-bold">{CBT_EXAM_DATA.mataPelajaran}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 my-4 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="text-slate-400 text-[10px] font-medium">Durasi Ujian</div>
                  <div className="font-bold text-slate-800 mt-0.5">{CBT_EXAM_DATA.durasiMenit} Menit</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="text-slate-400 text-[10px] font-medium">Jumlah Soal</div>
                  <div className="font-bold text-slate-800 mt-0.5">{CBT_EXAM_DATA.jumlahSoal} Butir Pilihan Ganda</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-900 mb-4">
                <span className="font-bold block mb-1">Tata Tertib Ujian CBT:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                  <li>Dilarang membuka tab lain atau aplikasi contekan.</li>
                  <li>Kerjakan dengan jujur mengharap ridho Allah SWT.</li>
                  <li>Waktu akan otomatis berjalan saat tombol Mulai ditekan.</li>
                </ul>
              </div>

              <button
                id="btn-start-cbt-exam"
                onClick={handleStartCBT}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Play className="w-4 h-4" />
                <span>Mulai Kerjakan Ujian Sekarang</span>
              </button>
            </div>
          )}

          {cbtState === 'running' && (
            <div className="flex flex-col gap-3">
              {/* CBT Top Bar: Timer & Progress */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Soal No:</span>
                  <span className="text-xs font-bold text-slate-800">
                    {currentQuestionIndex + 1} dari {CBT_EXAM_DATA.soalList.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 font-mono text-xs font-bold shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{formatTimer(cbtTimeLeft)}</span>
                </div>
              </div>

              {/* Question Card */}
              {(() => {
                const q = CBT_EXAM_DATA.soalList[currentQuestionIndex];
                const selectedAns = userAnswers[q.id];

                return (
                  <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
                    {q.arab && (
                      <div className="text-right font-arabic text-xl text-emerald-800 mb-2">
                        {q.arab}
                      </div>
                    )}
                    <h4 className="text-xs font-bold text-slate-800 leading-relaxed mb-4">
                      {q.pertanyaan}
                    </h4>

                    {/* Options */}
                    <div className="flex flex-col gap-2">
                      {q.pilihan.map((opt, optIdx) => {
                        const isChosen = selectedAns === optIdx;
                        const optionLabels = ['A', 'B', 'C', 'D'];

                        return (
                          <button
                            key={optIdx}
                            id={`option-btn-${q.id}-${optIdx}`}
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-3 ${
                              isChosen
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg font-bold text-[11px] flex items-center justify-center shrink-0 ${
                                isChosen
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {optionLabels[optIdx]}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Question Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  id="btn-prev-question"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => {
                    playTapSound();
                    setCurrentQuestionIndex((prev) => prev - 1);
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs"
                >
                  Sebelumnya
                </button>

                {currentQuestionIndex < CBT_EXAM_DATA.soalList.length - 1 ? (
                  <button
                    id="btn-next-question"
                    onClick={() => {
                      playTapSound();
                      setCurrentQuestionIndex((prev) => prev + 1);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span>Berikutnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    id="btn-finish-cbt"
                    onClick={handleFinishCBT}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md"
                  >
                    Selesai & Kumpulkan
                  </button>
                )}
              </div>
            </div>
          )}

          {cbtState === 'finished' && (() => {
            const result = calculateCBTScore();

            return (
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 text-center shadow-md">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <h3 className="text-base font-extrabold text-slate-800">Alhamdulillah, Ujian Selesai!</h3>
                <p className="text-xs text-slate-500 mt-0.5">Hasil Evaluasi CBT Online Santri</p>

                {/* Big Score Display */}
                <div className="my-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-4xl font-extrabold text-emerald-700 font-mono">
                    {result.score} <span className="text-lg text-slate-500">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-semibold">
                    Benar: {result.correct} dari {result.total} Butir Soal
                  </p>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-emerald-600 text-white rounded-full text-[11px] font-bold shadow-2xs">
                    Predikat: {result.score >= 85 ? 'Mumtaz (Sangat Baik)' : result.score >= 70 ? 'Jayyid (Baik)' : 'Perlu Bimbingan'}
                  </span>
                </div>

                <button
                  id="btn-cbt-restart"
                  onClick={() => setCbtState('idle')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembali ke Beranda CBT</span>
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* ================= 4. SETORAN TAHFIDZ VIEW ================= */}
      {activeSubTab === 'tahfidz' && (
        <div className="flex flex-col gap-3">
          {/* Progress Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-500/50 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs text-emerald-100 font-medium">Capaian Tahfidz Santri</span>
                <h3 className="text-lg font-extrabold">{student.tahfidzProgress.juzMemorized} / {student.tahfidzProgress.targetJuz} Juz Mutqin</h3>
              </div>
              <button
                id="btn-tambah-setoran-tahfidz"
                onClick={onOpenNewTahfidzModal}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Setor Hafalan</span>
              </button>
            </div>

            <div className="w-full h-2.5 bg-emerald-950/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-amber-400 rounded-full"
                style={{ width: `${(student.tahfidzProgress.juzMemorized / student.tahfidzProgress.targetJuz) * 100}%` }}
              />
            </div>
          </div>

          {/* History List */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Riwayat Setoran (Buku Kendali)
            </span>

            {TAHFIDZ_HISTORY.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    {rec.kategori}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">{rec.tanggal}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      Surat {rec.surat} ({rec.ayat})
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-bold">Juz {rec.juz}</p>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200">
                    {rec.nilai}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Penguji: </span>
                  {rec.ustadz}
                  <p className="text-[10px] text-slate-500 italic mt-0.5">"{rec.catatan}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 5. E-RAPORT VIEW ================= */}
      {activeSubTab === 'raport' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-slate-500 font-medium">Rapor Hasil Belajar</span>
                <h4 className="text-xs font-bold text-slate-800">Semester Ganjil 2025/2026</h4>
              </div>
              <button
                onClick={() => {
                  playTapSound();
                  alert('Mengunduh E-Raport Resmi Format PDF Kemenag RI...');
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-emerald-700 rounded-xl text-xs font-bold border border-slate-200 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF</span>
              </button>
            </div>

            {/* Subject Grade Table */}
            <div className="flex flex-col gap-2">
              {[
                { mapel: "Al-Qur'an Hadits", kkm: 75, nilai: 94, predikat: 'A (Mumtaz)' },
                { mapel: 'Fiqih Ibadah', kkm: 75, nilai: 96, predikat: 'A (Mumtaz)' },
                { mapel: 'Akidah Akhlak', kkm: 75, nilai: 92, predikat: 'A (Mumtaz)' },
                { mapel: 'Bahasa Arab', kkm: 75, nilai: 88, predikat: 'B+ (Jayyid Jiddan)' },
                { mapel: 'Matematika Terapan', kkm: 70, nilai: 85, predikat: 'B (Jayyid)' },
                { mapel: 'IPA Terpadu', kkm: 70, nilai: 90, predikat: 'A (Mumtaz)' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-800">{m.mapel}</h5>
                    <span className="text-[10px] text-slate-500 font-medium">KKM: {m.kkm}</span>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-700 font-mono text-sm">{m.nilai}</div>
                    <span className="text-[10px] text-emerald-800 font-semibold">{m.predikat}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sikap & Wali Note */}
            <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-800 block mb-1">Catatan Wali Kelas:</span>
              <p className="text-[11px] text-slate-700 leading-relaxed italic">
                "Ananda Rayhan menunjukkan kemajuan luar biasa dalam adab, disiplin shalat berjamaah, dan hafalan tahfidz Juz 30. Pertahankan prestasi dan terus istiqomah."
              </p>
              <div className="text-right mt-1 text-[10px] text-emerald-700 font-bold">
                — Ustadz Ahmad Mufid, M.Pd.I
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
