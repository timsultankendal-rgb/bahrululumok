import React from 'react';
import { X, Calendar, User, Share2, Sparkles } from 'lucide-react';
import { PengumumanItem } from '../../types';
import { playTapSound } from '../../utils/audio';

interface PengumumanDetailModalProps {
  item: PengumumanItem;
  onClose: () => void;
}

export const PengumumanDetailModal: React.FC<PengumumanDetailModalProps> = ({
  item,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl text-slate-800 relative animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Cover Image if available */}
        {item.gambarUrl && (
          <div className="w-full h-40 relative shrink-0">
            <img
              src={item.gambarUrl}
              alt={item.judul}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-black/50" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!item.gambarUrl && (
          <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50">
            <span className="text-xs font-extrabold text-emerald-700">Pengumuman Resmi</span>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto hide-scrollbar text-xs bg-white">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {item.kategori}
            </span>
            <div className="flex items-center gap-1 font-medium text-slate-500">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{item.tanggal}</span>
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-slate-800 mb-3 leading-snug">{item.judul}</h3>

          <div className="text-slate-600 leading-relaxed space-y-2 mb-4 font-medium">
            <p>{item.isi}</p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold text-slate-700">{item.penulis}</span>
            </div>

            <button
              onClick={() => {
                playTapSound();
                alert('Tautan pengumuman siap dibagikan.');
              }}
              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
