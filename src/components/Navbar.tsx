import React from 'react';
import { Sun, Moon, Droplets, QrCode } from 'lucide-react';
import { StudentProfile } from '../types.ts';

interface NavbarProps {
  currentTab: 'station' | 'telemetry' | 'rewards' | 'architecture';
  onSelectTab: (tab: 'station' | 'telemetry' | 'rewards' | 'architecture') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  student: StudentProfile;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleTheme,
  student,
  isAuthenticated,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Single Wordmark Element */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5" />
          </div>
          <button
            onClick={() => onSelectTab('station')}
            className="text-left cursor-pointer group"
          >
            <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors whitespace-nowrap">
              LıkırLoop
            </div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block whitespace-nowrap">
              Döngüsel Akıllı Su Dolum İstasyonu
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4 Nav Links (Single line, text with underline/active state) */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onSelectTab('station')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'station'
                ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Dolum İstasyonu
          </button>

          <button
            onClick={() => onSelectTab('telemetry')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'telemetry'
                ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Kampüs Telemetrisi
          </button>

          <button
            onClick={() => onSelectTab('rewards')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'rewards'
                ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            LıkırPuan & Ödüller
          </button>

          <button
            onClick={() => onSelectTab('architecture')}
            className={`transition-colors whitespace-nowrap cursor-pointer py-1 ${
              currentTab === 'architecture'
                ? 'text-sky-600 dark:text-sky-400 font-bold border-b-2 border-sky-600 dark:border-sky-400'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Teknik Mimari
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Group (Theme Switcher + Student Tag) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick theme switcher button */}
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Gündüz Moduna Geç' : 'Gece Moduna Geç'}
            title={isDarkMode ? 'Gündüz Modu (Soft Sand & Slate)' : 'Gece Modu (Midnight Soft Slate)'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Student Status Badge */}
          {isAuthenticated ? (
            <button
              onClick={() => onSelectTab('rewards')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="hidden sm:inline font-semibold">{student.fullName}</span>
              <span className="hidden lg:inline text-[10px] text-slate-500 dark:text-slate-400 font-mono">({student.dormBlock})</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{student.points} P</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('station')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-sky-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-sky-500 transition-colors"
            >
              Giriş Yap
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => onSelectTab('station')}
          className={`px-2 py-1 rounded-md ${
            currentTab === 'station'
              ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/50'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          İstasyon
        </button>
        <button
          onClick={() => onSelectTab('telemetry')}
          className={`px-2 py-1 rounded-md ${
            currentTab === 'telemetry'
              ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/50'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Telemetri
        </button>
        <button
          onClick={() => onSelectTab('rewards')}
          className={`px-2 py-1 rounded-md ${
            currentTab === 'rewards'
              ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/50'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          LıkırPuan
        </button>
        <button
          onClick={() => onSelectTab('architecture')}
          className={`px-2 py-1 rounded-md ${
            currentTab === 'architecture'
              ? 'text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/50'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Mimari
        </button>
      </div>
    </header>
  );
};
