import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  BookOpen, 
  RotateCcw,
  HeartHandshake
} from 'lucide-react';
import { playTapSound, playSuccessSound } from '../../utils/audio';

interface Message {
  id: string;
  sender: 'user' | 'ustadz';
  text: string;
  arab?: string;
  dalil?: string;
  time: string;
}

interface TanyaUstadzModalProps {
  onClose: () => void;
}

export const TanyaUstadzModal: React.FC<TanyaUstadzModalProps> = ({ onClose }) => {
  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ustadz',
      text: "Assalamu'alaikum Warahmatullahi Wabarakatuh ananda santri yang dirahmati Allah. Saya Ustadz AI MadrasahKu, siap membantu menjawab pertanyaan seputar Fiqih ibadah, hafalan Al-Qur'an, adab thalabul 'ilmi, maupun bimbingan belajar madrasah. Ada yang bisa ustadz bantu?",
      time: '07:30'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const suggestedQuestions = [
    "Bagaimana hukum shalat jamak qashar saat bepergian?",
    "Tips agar mudah menghafal Al-Qur'an dan tidak mudah lupa?",
    "Doa mustajab sebelum menghadapi ujian CBT Madrasah?",
    "Apa saja syarat sah dan rukun wudhu?"
  ];

  const getUstadzResponse = (query: string): { text: string; arab?: string; dalil?: string } => {
    const q = query.toLowerCase();

    if (q.includes('jamak') || q.includes('qashar') || q.includes('bepergian') || q.includes('safar')) {
      return {
        text: "Shalat Jamak dan Qashar adalah rukhshah (keringanan) dari Allah bagi musafir yang menempuh jarak minimal 2 marhalah (sekitar 81-88 km) dengan perjalanan yang bukan maksiat. Shalat yang boleh diqashar adalah shalat 4 rakaat (Dzuhur, Ashar, dan Isya) diringkas menjadi 2 rakaat.",
        arab: "وَإِذَا ضَرَبْتُمْ فِي الْأَرْضِ فَلَيْسَ عَلَيْكُمْ جُنَاحٌ أَن تَقْصُرُوا مِنَ الصَّلَاةِ",
        dalil: "QS. An-Nisa: 101"
      };
    } else if (q.includes('hafal') || q.includes('tahfidz') || q.includes('qur') || q.includes('lupa')) {
      return {
        text: "Kunci utama menghafal Al-Qur'an mutqin adalah: 1) Ikhlas lillahi ta'ala dan menjauhi maksiat, 2) Menggunakan satu mushaf standar (seperti Mushaf Madinah/Kemenag), 3) Metode Tikrar (mengulang ayat minimal 20-40 kali sebelum pindah), 4) Membaca hafalan di dalam shalat fardhu dan sunnah Tahajjud.",
        arab: "تَعَاهَدُوا الْقُرْآنَ فَوَالَّذِي نَفْسِي بِيَدِهِ لَهُوَ أَشَدُّ تَفَصِّيًا مِنَ الإِبِلِ فِي عُقُلِهَا",
        dalil: "HR. Bukhari no. 5033: 'Jagalah Al-Qur'an, demi Dzat yang jiwaku berada di tangan-Nya, sungguh ia lebih cepat lepas daripada unta dari ikatannya.'"
      };
    } else if (q.includes('ujian') || q.includes('cbt') || q.includes('doa')) {
      return {
        text: "Sebelum memulai ujian CBT, bersihkan niat, bacalah Basmalah, dan panjatkan doa memohon kelapangan dada dan kemudahan lisan. Kerjakan dengan jujur dan tenang.",
        arab: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
        dalil: "QS. Thaha: 25-28"
      };
    } else if (q.includes('wudhu') || q.includes('rukun')) {
      return {
        text: "Rukun wudhu ada 6: 1) Niat saat membasuh muka, 2) Membasuh seluruh muka, 3) Membasuh kedua tangan sampai siku, 4) Mengusap sebagian kepala, 5) Membasuh kedua kaki sampai mata kaki, 6) Tertib (berurutan).",
        arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ",
        dalil: "QS. Al-Maidah: 6"
      };
    } else {
      return {
        text: `Pertanyaan yang sangat bagus ananda! Di madrasah, kita diajarkan untuk senantiasa menyeimbangkan 'ilmu amaliyah' dan 'amal ilmiah'. Teruslah bersemangat dalam thalabul 'ilmi dan amalkan ilmu yang didapat untuk kemaslahatan umat.`,
        arab: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",
        dalil: "HR. Ibnu Majah no. 224"
      };
    }
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;
    playTapSound();

    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = getUstadzResponse(textToSend);
      const ustadzMsg: Message = {
        id: 'msg-u-' + Date.now(),
        sender: 'ustadz',
        text: resp.text,
        arab: resp.arab,
        dalil: resp.dalil,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, ustadzMsg]);
      setIsTyping(false);
      playSuccessSound();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-extrabold text-white">Ustadz AI MadrasahKu</h3>
                <span className="text-[9px] bg-emerald-800/80 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-emerald-100 font-medium">Konsultasi Fiqih, Tahfidz & Studi Islam</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs hide-scrollbar bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-3xl ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {m.arab && (
                  <div className="text-right font-arabic text-base text-slate-900 mb-2 leading-relaxed pb-1 border-b border-slate-100">
                    {m.arab}
                  </div>
                )}
                <p className="leading-relaxed font-medium">{m.text}</p>

                {m.dalil && (
                  <div className="mt-2 text-[10px] text-emerald-800 font-bold italic bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    Dalil: {m.dalil}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1 font-medium">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-[11px] p-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              <span>Ustadz AI sedang menyusun jawaban...</span>
            </div>
          )}
        </div>

        {/* Suggested Pills */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto hide-scrollbar flex gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full whitespace-nowrap border border-emerald-200 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputQuery);
            }}
            placeholder="Ketik pertanyaan fiqih atau materi..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs font-medium"
          />
          <button
            id="btn-send-ustadz-ai"
            onClick={() => handleSendMessage(inputQuery)}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
