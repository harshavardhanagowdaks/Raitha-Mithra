import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Sprout, User } from 'lucide-react';

export default function Header({ onNavigate }) {
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Brand Title */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center space-x-3 cursor-pointer select-none"
        >
          <div className="bg-amber-400 text-emerald-950 p-2 rounded-2xl shadow-sm font-black">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white">
              Raitha Mithra <span className="text-xs font-bold text-amber-300 ml-1">(ರೈತ ಮಿತ್ರ)</span>
            </h1>
            <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
              Bilingual Smart Agriculture Platform
            </p>
          </div>
        </div>

        {/* Header Right Actions: Language Switcher & Profile */}
        <div className="flex items-center space-x-2">
          {/* Always-visible Language Switcher Toggle */}
          <div className="flex items-center bg-emerald-950 p-1 rounded-xl border border-emerald-700 text-xs font-bold shadow-inner">
            <button
              onClick={() => setLanguage('kn')}
              className={`px-3 py-1 rounded-lg transition-all ${
                language === 'kn'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              ಕನ್ನಡ
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Profile Shortcut */}
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 border border-emerald-700 text-amber-300 flex items-center justify-center transition-all shadow-sm"
            title="Profile & Settings"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
