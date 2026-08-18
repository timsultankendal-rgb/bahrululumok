import React from 'react';
import { Bell, X, CheckCheck, Clock, Award, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { playTapSound } from '../../utils/audio';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'academic' | 'spp' | 'tahfidz' | 'general';
  isUnread: boolean;
}

interface NotificationModalProps {
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  onClose,
  onClearAll,
}) => {
  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      title: 'Ujian CBT Fiqih Dimulai',
      message: 'Ujian Penilaian Tengah Semester (PTS) Ganjil sudah dibuka. Silakan masuk menu Akademik > CBT.',
      time: '10 menit lalu',
      type: 'academic',
      isUnread: true,
    },
    {
      id: 'notif-2',
      title: 'Validasi Setoran Tahfidz Surat An-Naba',
      message: 'Ustadz Hafidz Al-Mukarram telah memvalidasi hafalan Juz 30 dengan predikat Mumtaz (A).',
      time: '2 jam lalu',
      type: 'tahfidz',
      isUnread: true,
    },
    {
      id: 'notif-3',
      title: 'Pengingat Pembayaran SPP',
      message: 'Tagihan SPP & Uang Makan bulan September 2026 telah diterbitkan. Pembayaran via QRIS / BSI VA.',
      time: '1 hari lalu',
      type: 'spp',
      isUnread: false,
    },
    {
      id: 'notif-4',
      title: 'Surat Edaran Libur Hari Santri Nasional',
      message: 'Kegiatan apel akbar dan perlombaan hadroh se-Kabupaten Kendal.',
      time: '3 hari lalu',
      type: 'general',
      isUnread: false,
    }
  ];

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'academic':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'tahfidz':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'spp':
        return <Wallet className="w-4 h-4 text-blue-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white">Notifikasi Madrasah</h3>
              <span className="text-[10px] text-emerald-100 font-medium">Pemberitahuan Akademik & Ibadah</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs hide-scrollbar bg-slate-50">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-3xl border transition-all shadow-xs ${
                n.isUnread
                  ? 'bg-white border-emerald-300 ring-1 ring-emerald-200'
                  : 'bg-white border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 truncate">{n.title}</h4>
                    {n.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">{n.message}</p>
                  <span className="text-[9px] text-slate-400 mt-1.5 block font-bold">{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200">
          <button
            onClick={() => {
              playTapSound();
              onClearAll();
              onClose();
            }}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tandai Semua Sudah Dibaca</span>
          </button>
        </div>
      </div>
    </div>
  );
};
