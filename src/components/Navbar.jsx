import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Home,
  TrendingUp,
  Landmark,
  Camera,
  Bot,
  MoreHorizontal
} from 'lucide-react';

export default function Navbar({ activeTab, onNavigate }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'market', icon: TrendingUp, label: t('nav.market') },
    { id: 'schemes', icon: Landmark, label: t('nav.schemes') },
    { id: 'diseaseScan', icon: Camera, label: t('nav.diseaseScan'), highlight: true },
    { id: 'assistant', icon: Bot, label: t('nav.assistant') },
    { id: 'settings', icon: MoreHorizontal, label: t('nav.settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-xl px-2 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlight = item.highlight;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isHighlight
                  ? isActive
                    ? 'text-emerald-900 font-extrabold scale-105'
                    : 'text-emerald-700 font-semibold'
                  : isActive
                  ? 'text-emerald-900 font-extrabold bg-emerald-50'
                  : 'text-slate-500 hover:text-slate-800 font-normal'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isHighlight ? 'bg-emerald-800 text-amber-300 shadow-md ring-2 ring-emerald-200' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-1 text-center truncate max-w-[68px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
