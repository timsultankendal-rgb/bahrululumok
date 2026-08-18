import React from 'react';
import { 
  Home, 
  UserCheck, 
  Users, 
  ShoppingBag, 
  GraduationCap, 
  Grid 
} from 'lucide-react';
import { TabType } from '../types';
import { playTapSound } from '../utils/audio';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onToggleSidebar?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  onToggleSidebar,
}) => {
  const primaryTabs = [
    {
      id: 'home' as TabType,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: '1_daftar_hadir' as TabType,
      label: '1. Hadir',
      icon: UserCheck,
      badge: 'Absen',
    },
    {
      id: '2_biodata' as TabType,
      label: '2. Biodata',
      icon: Users,
    },
    {
      id: '3_kopas' as TabType,
      label: '3. Kopas',
      icon: ShoppingBag,
    },
    {
      id: '5_raport' as TabType,
      label: '5. Raport',
      icon: GraduationCap,
    },
  ];

  const handleTabClick = (tabId: TabType) => {
    playTapSound();
    onChangeTab(tabId);
  };

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 text-slate-500 px-1 sm:px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2.5 rounded-xl transition-all duration-200 cursor-pointer min-w-0 ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <div className="absolute top-0.5 inset-x-0.5 h-8 bg-emerald-50 rounded-xl -z-10 border border-emerald-200 shadow-2xs" />
              )}

              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isActive ? 'scale-110 text-emerald-700' : 'text-slate-400'}`} />

                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2.5 bg-emerald-100 text-emerald-800 text-[7px] sm:text-[8px] font-bold px-1 rounded-full border border-emerald-200 shadow-2xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-[54px] sm:max-w-none ${isActive ? 'text-emerald-800 font-extrabold' : 'text-slate-500 font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Menu Sisi Kiri Drawer Button */}
        {onToggleSidebar && (
          <button
            onClick={() => {
              playTapSound();
              onToggleSidebar();
            }}
            className="relative flex flex-col items-center justify-center py-1 px-1.5 sm:px-2.5 rounded-xl text-teal-800 hover:text-teal-950 transition-all cursor-pointer min-w-0"
            title="Buka 18 Menu Sisi Kiri"
          >
            <div className="p-0.5 sm:p-1 rounded-lg bg-teal-50 border border-teal-200">
              <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-700" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-extrabold text-teal-800 truncate">
              18 Menu
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
