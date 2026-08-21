import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  FileDown, 
  Calendar, 
  Play, 
  Download, 
  ExternalLink, 
  Sparkles,
  FileText,
  Eye
} from 'lucide-react';
import { DOKUMENTASI_LIST } from '../../data/madrasahCompleteData';
import { DokumentasiItem, UserRole } from '../../types';
import { playTapSound } from '../../utils/audio';
import { useAccessPermission } from '../../hooks/useAccessPermission';

interface DokumentasiViewProps {
  activeRole?: UserRole;
  canEdit?: boolean;
}

export const DokumentasiView: React.FC<DokumentasiViewProps> = ({
  activeRole,
  canEdit: explicitCanEdit,
}) => {
  const { canEdit } = useAccessPermission('4_dokumentasi', activeRole, explicitCanEdit);
  const [activeFilter, setActiveFilter] = useState<'Semua' | 'Foto' | 'Video' | 'File Unduhan'>('Semua');
  const [selectedItem, setSelectedItem] = useState<DokumentasiItem | null>(null);

  const filteredList = DOKUMENTASI_LIST.filter(
    (d) => activeFilter === 'Semua' || d.kategori === activeFilter
  );

  return (
    <div className="p-3.5 sm:p-5 space-y-4 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-700 to-teal-700 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              MENU 4
            </span>
            <span className="text-purple-100 text-xs font-semibold">Galeri & Arsip Digital</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white">4. DOKUMENTASI KEGIATAN</h1>
          <p className="text-xs text-purple-100 mt-0.5">
            Koleksi Foto, Video Pembelajaran, & Berkas Unduhan Resmi Madrasah
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold backdrop-blur-xs">
          <Camera className="w-4 h-4 text-amber-300" />
          <span>{DOKUMENTASI_LIST.length} Arsip Media</span>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {(['Semua', 'Foto', 'Video', 'File Unduhan'] as const).map((k) => (
          <button
            key={k}
            onClick={() => {
              playTapSound();
              setActiveFilter(k);
            }}
            className={`px-4 py-2 rounded-2xl font-extrabold text-xs shrink-0 transition-all cursor-pointer ${
              activeFilter === k
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {k === 'Foto' && '📷 '}
            {k === 'Video' && '🎥 '}
            {k === 'File Unduhan' && '📁 '}
            {k}
          </button>
        ))}
      </div>

      {/* Grid of Documentation Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Media Thumbnail / Cover */}
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={item.thumbnail || item.url}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />

                {/* Badge Kategori */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl shadow-xs text-white ${
                    item.kategori === 'Foto'
                      ? 'bg-emerald-600'
                      : item.kategori === 'Video'
                      ? 'bg-rose-600'
                      : 'bg-indigo-600'
                  }`}>
                    {item.kategori}
                  </span>
                </div>

                {/* Video Play Button Overlay */}
                {item.kategori === 'Video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-rose-600 ml-0.5" />
                    </div>
                  </div>
                )}

                {/* File Download Icon Overlay */}
                {item.kategori === 'File Unduhan' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/40 backdrop-blur-2xs">
                    <div className="w-12 h-12 rounded-2xl bg-white/90 text-indigo-700 flex items-center justify-center shadow-lg">
                      <FileDown className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>{item.tanggal}</span>
                  {item.ukuranFile && <span>• {item.ukuranFile} ({item.tipeFile})</span>}
                </div>

                <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug">
                  {item.judul}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.keterangan}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 pt-0">
              <button
                onClick={() => {
                  playTapSound();
                  setSelectedItem(item);
                }}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-purple-50 text-purple-900 border border-slate-200 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {item.kategori === 'Foto' && <Eye className="w-4 h-4" />}
                {item.kategori === 'Video' && <Play className="w-4 h-4" />}
                {item.kategori === 'File Unduhan' && <Download className="w-4 h-4" />}
                <span>
                  {item.kategori === 'Foto' ? 'Lihat Foto Penuh' : item.kategori === 'Video' ? 'Tonton Video' : 'Unduh Dokumen'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail Media View */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-3.5 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-64 bg-slate-900">
              <img
                src={selectedItem.url}
                alt={selectedItem.judul}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 pt-0 space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                {selectedItem.kategori} • {selectedItem.tanggal}
              </span>
              <h3 className="font-extrabold text-base text-slate-800">{selectedItem.judul}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedItem.keterangan}</p>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
