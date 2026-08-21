import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  BookMarked, 
  ListChecks, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Check, 
  Copy, 
  Volume2,
  Bookmark,
  ChevronRight,
  Heart
} from 'lucide-react';
import { SurahItem, DoaItem, MutabaahItem } from '../../types';
import { SURAH_LIST, DOA_LIST } from '../../data/mockData';
import { playTapSound, playTasbihMilestone, playSuccessSound } from '../../utils/audio';

interface QuranIbadahTabProps {
  mutabaahList: MutabaahItem[];
  onToggleMutabaah: (id: string) => void;
}

export const QuranIbadahTab: React.FC<QuranIbadahTabProps> = ({
  mutabaahList,
  onToggleMutabaah,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quran' | 'tasbih' | 'doa' | 'mutabaah'>('quran');
  
  // Quran State
  const [selectedSurah, setSelectedSurah] = useState<SurahItem>(SURAH_LIST[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeAyahAudio, setActiveAyahAudio] = useState<number | null>(null);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([1]);

  // Tasbih State
  const [tasbihCount, setTasbihCount] = useState<number>(0);
  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [selectedDzikirIndex, setSelectedDzikirIndex] = useState<number>(0);
  const dzikirPresets = [
    { text: 'سُبْحَانَ اللَّهِ', latin: 'Subhanallah', meaning: 'Mahasuci Allah' },
    { text: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillah', meaning: 'Segala Puji Bagi Allah' },
    { text: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', meaning: 'Allah Mahabesar' },
    { text: 'أَسْتَغْفِرُ اللَّهَ', latin: 'Astaghfirullah', meaning: 'Aku memohon ampun kepada Allah' },
    { text: 'لَا إِلَهَ إِلَّا اللَّهُ', latin: 'Laa Ilaaha Illallah', meaning: 'Tiada Tuhan selain Allah' },
  ];

  // Doa State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [copiedDoaId, setCopiedDoaId] = useState<string | null>(null);

  const handleTasbihTap = () => {
    playTapSound();
    const next = tasbihCount + 1;
    setTasbihCount(next);

    if (next % tasbihTarget === 0) {
      playTasbihMilestone();
    }
  };

  const handleResetTasbih = () => {
    playTapSound();
    setTasbihCount(0);
  };

  const toggleBookmark = (ayahNumber: number) => {
    playTapSound();
    if (bookmarkedAyahs.includes(ayahNumber)) {
      setBookmarkedAyahs(bookmarkedAyahs.filter((a) => a !== ayahNumber));
    } else {
      setBookmarkedAyahs([...bookmarkedAyahs, ayahNumber]);
    }
  };

  const handlePlayAyah = (ayahNumber: number) => {
    playTapSound();
    if (activeAyahAudio === ayahNumber && isPlayingAudio) {
      setIsPlayingAudio(false);
      setActiveAyahAudio(null);
    } else {
      setActiveAyahAudio(ayahNumber);
      setIsPlayingAudio(true);
      // Simulate finish after 4 seconds
      setTimeout(() => {
        setIsPlayingAudio(false);
        setActiveAyahAudio(null);
      }, 4000);
    }
  };

  const handleCopyDoa = (doa: DoaItem) => {
    playTapSound();
    const text = `${doa.judul}\n\n${doa.arab}\n\nLatin: ${doa.latin}\nArtinya: ${doa.terjemah}\n(${doa.riwayat})`;
    navigator.clipboard.writeText(text);
    setCopiedDoaId(doa.id);
    setTimeout(() => setCopiedDoaId(null), 2000);
  };

  const filteredDoa = DOA_LIST.filter((d) => {
    const matchSearch =
      d.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.terjemah.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Semua' || d.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ['Semua', 'Pendidikan & Belajar', 'Keluarga', 'Ibadah', 'Dzikir Pagi & Petang'];

  return (
    <div className="flex flex-col gap-3 p-4 pb-8 bg-slate-50">
      {/* Sub Header Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs flex gap-1 text-xs">
        <button
          id="subtab-quran"
          onClick={() => {
            playTapSound();
            setActiveSubTab('quran');
          }}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'quran'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Al-Qur'an</span>
        </button>

        <button
          id="subtab-tasbih"
          onClick={() => {
            playTapSound();
            setActiveSubTab('tasbih');
          }}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'tasbih'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tasbih</span>
        </button>

        <button
          id="subtab-doa"
          onClick={() => {
            playTapSound();
            setActiveSubTab('doa');
          }}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'doa'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>Doa Harian</span>
        </button>

        <button
          id="subtab-mutabaah"
          onClick={() => {
            playTapSound();
            setActiveSubTab('mutabaah');
          }}
          className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'mutabaah'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          <span>Mutaba'ah</span>
        </button>
      </div>

      {/* ================= 1. AL-QUR'AN VIEW ================= */}
      {activeSubTab === 'quran' && (
        <div className="flex flex-col gap-3">
          {/* Surah Selector Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {SURAH_LIST.map((surah) => {
              const isSelected = selectedSurah.number === surah.number;
              return (
                <button
                  key={surah.number}
                  id={`surah-pill-${surah.number}`}
                  onClick={() => {
                    playTapSound();
                    setSelectedSurah(surah);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-extrabold">
                    {surah.number}
                  </span>
                  <span>{surah.name}</span>
                  <span className="font-arabic text-xs opacity-90">{surah.arabicName}</span>
                </button>
              );
            })}
          </div>

          {/* Active Surah Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 p-4 border border-emerald-500/40 shadow-md text-center relative overflow-hidden text-white">
            <div className="font-arabic text-3xl text-amber-300 font-bold mb-1">
              {selectedSurah.arabicName}
            </div>
            <h3 className="text-base font-extrabold text-white">{selectedSurah.name}</h3>
            <p className="text-xs text-emerald-100 font-medium">
              {selectedSurah.indonesianTranslation} • {selectedSurah.numberOfAyahs} Ayat • {selectedSurah.revelationType}
            </p>

            {/* Bismillah Header (except At-Taubah) */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="font-arabic text-xl text-emerald-50">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            </div>
          </div>

          {/* Ayah List */}
          <div className="flex flex-col gap-3">
            {selectedSurah.ayahs.map((ayah) => {
              const isPlaying = activeAyahAudio === ayah.numberInSurah && isPlayingAudio;
              const isBookmarked = bookmarkedAyahs.includes(ayah.numberInSurah);

              return (
                <div
                  key={ayah.numberInSurah}
                  className={`p-4 rounded-3xl bg-white border transition-all shadow-xs ${
                    isPlaying
                      ? 'border-emerald-500 ring-2 ring-emerald-400/40 bg-emerald-50/40'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar Ayah */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-slate-500 text-[11px] font-medium">
                        Surat {selectedSurah.name} : {ayah.numberInSurah}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        id={`btn-audio-ayah-${ayah.numberInSurah}`}
                        onClick={() => handlePlayAyah(ayah.numberInSurah)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          isPlaying
                            ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 shadow-2xs'
                        }`}
                        title="Dengarkan Qari Tartil"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        id={`btn-bookmark-ayah-${ayah.numberInSurah}`}
                        onClick={() => toggleBookmark(ayah.numberInSurah)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-2xs'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 shadow-2xs'
                        }`}
                        title="Tandai Terakhir Baca"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Arabic Text */}
                  <div className="text-right font-arabic text-2xl text-slate-800 mb-3 px-1">
                    {ayah.arabic}
                  </div>

                  {/* Transliteration (Latin) */}
                  <p className="text-xs text-emerald-700 font-semibold italic mb-1.5">
                    {ayah.transliteration}
                  </p>

                  {/* Indonesian Translation */}
                  <p className="text-xs text-slate-600 leading-relaxed">{ayah.translation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 2. TASBIH DIGITAL VIEW ================= */}
      {activeSubTab === 'tasbih' && (
        <div className="flex flex-col gap-4 items-center text-center">
          {/* Preset Dzikir Carousel */}
          <div className="w-full flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {dzikirPresets.map((dzikir, idx) => (
              <button
                key={idx}
                id={`dzikir-preset-${idx}`}
                onClick={() => {
                  playTapSound();
                  setSelectedDzikirIndex(idx);
                  setTasbihCount(0);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${
                  selectedDzikirIndex === idx
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {dzikir.latin}
              </button>
            ))}
          </div>

          {/* Dzikir Display Card */}
          <div className="w-full rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs">
            <div className="font-arabic text-3xl text-emerald-700 mb-2 font-bold">
              {dzikirPresets[selectedDzikirIndex].text}
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">
              {dzikirPresets[selectedDzikirIndex].latin}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              "{dzikirPresets[selectedDzikirIndex].meaning}"
            </p>
          </div>

          {/* Target Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Target Putaran:</span>
            {[33, 99, 100, 1000].map((t) => (
              <button
                key={t}
                onClick={() => {
                  playTapSound();
                  setTasbihTarget(t);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  tasbihTarget === t
                    ? 'bg-amber-400 text-emerald-950 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}x
              </button>
            ))}
          </div>

          {/* Giant Interactive Tap Button for Tasbih */}
          <div className="relative my-2">
            <button
              id="btn-tap-tasbih"
              onClick={handleTasbihTap}
              className="w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-lg hover:shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center border-4 border-emerald-400/40 select-none group cursor-pointer"
            >
              <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-xs">
                {tasbihCount}
              </span>
              <span className="text-xs font-bold text-emerald-100 mt-1 uppercase tracking-wider">
                Tap / Sentuh
              </span>
              <span className="text-[10px] text-emerald-200 mt-0.5 opacity-90 font-medium">
                Target: {tasbihTarget}
              </span>
            </button>
          </div>

          {/* Controls: Reset */}
          <div className="flex items-center gap-3">
            <button
              id="btn-reset-tasbih"
              onClick={handleResetTasbih}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Hitungan</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= 3. DOA HARIAN VIEW ================= */}
      {activeSubTab === 'doa' && (
        <div className="flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari doa belajar, orang tua, dsb..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  playTapSound();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Doa Cards */}
          <div className="flex flex-col gap-3">
            {filteredDoa.map((doa) => (
              <div
                key={doa.id}
                className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {doa.kategori}
                  </span>
                  <button
                    onClick={() => handleCopyDoa(doa)}
                    className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-700 font-bold transition-colors"
                    title="Salin Teks Doa"
                  >
                    {copiedDoaId === doa.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-2">{doa.judul}</h4>

                {/* Arabic */}
                <div className="text-right font-arabic text-xl text-slate-800 mb-2 leading-relaxed">
                  {doa.arab}
                </div>

                {/* Latin */}
                <p className="text-xs text-emerald-700 font-medium italic mb-1.5">{doa.latin}</p>

                {/* Meaning */}
                <p className="text-xs text-slate-600 leading-relaxed">{doa.terjemah}</p>

                <div className="mt-2 text-[10px] text-slate-400 font-medium">
                  Sumber: {doa.riwayat}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 4. MUTABA'AH YAUMIYAH FULL VIEW ================= */}
      {activeSubTab === 'mutabaah' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-900 border border-emerald-500/40 shadow-md text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black">Mutaba'ah Yaumiyah Santri</h3>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  Pantau kepatuhan ibadah fardhu, sunnah, dan amalan harian secara mandiri.
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-200">
                  {mutabaahList.length > 0 ? Math.round((mutabaahList.filter(m => m.isDone).length / mutabaahList.length) * 100) : 0}%
                </span>
                <div className="text-[10px] text-emerald-100/90 font-medium">
                  {mutabaahList.filter(m => m.isDone).length} / {mutabaahList.length} Selesai
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-emerald-950/40 rounded-full overflow-hidden mt-3 border border-emerald-500/30">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-300 rounded-full transition-all duration-500"
                style={{
                  width: `${mutabaahList.length > 0 ? Math.round((mutabaahList.filter(m => m.isDone).length / mutabaahList.length) * 100) : 0}%`
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {mutabaahList.map((item) => (
              <button
                key={item.id}
                id={`full-mutabaah-${item.id}`}
                onClick={() => {
                  onToggleMutabaah(item.id);
                  if (!item.isDone) playSuccessSound();
                  else playTapSound();
                }}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between shadow-2xs cursor-pointer active:scale-[0.99] gap-3 ${
                  item.isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-600'
                    : 'bg-white border-slate-200/80 text-slate-800 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                      item.isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                        : 'border-slate-300 bg-slate-50 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5
                      className={`text-xs font-bold truncate ${
                        item.isDone ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
                      }`}
                    >
                      {item.kegiatan}
                    </h5>
                    <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded-md font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {item.kategori}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-700 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {item.waktu}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
