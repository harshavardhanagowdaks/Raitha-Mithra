import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { fetchDistrictWeather } from '../services/weatherService';
import { speakText } from '../services/speechService';
import {
  CloudSun,
  Droplets,
  Wind,
  Camera,
  TrendingUp,
  Calculator,
  Bot,
  Landmark,
  BookOpen,
  Volume2,
  ChevronRight,
  Sun,
  Sparkles,
  CloudRain,
  MapPin
} from 'lucide-react';

export default function Home({ onNavigate }) {
  const { language, t } = useLanguage();
  const { profile } = useAuth();
  const district = profile?.district || 'Mandya';

  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    fetchDistrictWeather(district).then((w) => {
      setWeather(w);
      setLoadingWeather(false);
    });
  }, [district]);

  const speakWelcome = () => {
    const text = language === 'kn'
      ? `ನಮಸ್ಕಾರ ರೈತ ಬಂಧುವೇ! ರೈತ ಮಿತ್ರ ಆ್ಯಪ್‌ಗೆ ಸ್ವಾಗತ. ಇಂದಿನ ${district} ಜಿಲ್ಲೆಯ ತಾಪಮಾನ ${weather?.temperature || 28} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್ ಆಗಿದೆ.`
      : `Welcome Raitha! Today temperature in ${district} is ${weather?.temperature || 28} degree Celsius.`;
    speakText(text, language);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl"></div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-400/20 text-amber-200 px-3 py-1 rounded-full text-xs font-semibold mb-2 backdrop-blur-md border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('appName')}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {t('home.welcome')}
            </h2>
            <p className="text-xs text-emerald-200 mt-1 max-w-md leading-relaxed font-medium">
              {t('home.tagline')}
            </p>
          </div>
          <button
            onClick={speakWelcome}
            className="p-3 bg-white/10 hover:bg-white/20 text-amber-300 rounded-2xl backdrop-blur-md transition-all shadow-md border border-white/10"
            title="Listen Welcome"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Compact Negilu-Style Weather Widget with Rain Probability */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-800">
            <CloudSun className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-sm flex items-center space-x-1">
              <span>{t('home.weatherTitle')}</span>
              <span className="text-slate-400 font-normal">({district})</span>
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Open-Meteo Live
          </span>
        </div>

        {loadingWeather ? (
          <div className="grid grid-cols-4 gap-2 animate-pulse py-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-100 flex flex-col items-center text-center">
              <Sun className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-[10px] text-slate-500">{t('home.temp')}</span>
              <span className="text-sm font-bold text-slate-800">{weather?.temperature}°C</span>
            </div>

            <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
              <Droplets className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-[10px] text-slate-500">{t('home.humidity')}</span>
              <span className="text-sm font-bold text-slate-800">{weather?.humidity}%</span>
            </div>

            <div className="bg-cyan-50/80 p-3 rounded-2xl border border-cyan-100 flex flex-col items-center text-center">
              <CloudRain className="w-5 h-5 text-cyan-600 mb-1" />
              <span className="text-[10px] text-slate-500">{t('home.rainfall')}</span>
              <span className="text-sm font-bold text-slate-800">{weather?.precipitation || 0} mm</span>
            </div>

            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
              <Wind className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-[10px] text-slate-500">{t('home.wind')}</span>
              <span className="text-sm font-bold text-slate-800">{weather?.windSpeed} km/h</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Quick Action Cards */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-800 mb-3 px-1 uppercase tracking-wider">
          {t('home.quickActions')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Disease Scan */}
          <div
            onClick={() => onNavigate('diseaseScan')}
            className="bg-emerald-800 hover:bg-emerald-900 text-white p-5 rounded-3xl shadow-md cursor-pointer transition-all transform hover:-translate-y-0.5 flex flex-col justify-between h-36 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full group-hover:scale-110 transition-all"></div>
            <div className="bg-white/20 p-3 rounded-2xl w-fit backdrop-blur-sm">
              <Camera className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight">{t('home.scanCrop')}</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5 line-clamp-1">{t('home.scanDesc')}</p>
            </div>
          </div>

          {/* Live Market Rates */}
          <div
            onClick={() => onNavigate('market')}
            className="bg-white hover:bg-slate-50 text-slate-800 p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer transition-all transform hover:-translate-y-0.5 flex flex-col justify-between h-36"
          >
            <div className="bg-amber-100 p-3 rounded-2xl w-fit text-amber-800">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight">{t('home.marketPrices')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t('home.marketDesc')}</p>
            </div>
          </div>

          {/* Profit Calculator */}
          <div
            onClick={() => onNavigate('calculator')}
            className="bg-white hover:bg-slate-50 text-slate-800 p-5 rounded-3xl border border-slate-200 shadow-sm cursor-pointer transition-all transform hover:-translate-y-0.5 flex flex-col justify-between h-36"
          >
            <div className="bg-blue-100 p-3 rounded-2xl w-fit text-blue-800">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight">{t('home.calcProfit')}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t('home.calcDesc')}</p>
            </div>
          </div>

          {/* Open Gemini Assistant */}
          <div
            onClick={() => onNavigate('assistant')}
            className="bg-slate-900 hover:bg-slate-950 text-white p-5 rounded-3xl shadow-md cursor-pointer transition-all transform hover:-translate-y-0.5 flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="bg-white/10 p-3 rounded-2xl w-fit text-amber-300">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base leading-tight">{t('home.askAi')}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{t('home.askAiDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Quick Links */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('schemes')}
          className="bg-amber-50 hover:bg-amber-100 border border-amber-200 p-4 rounded-2xl flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center space-x-3">
            <Landmark className="w-6 h-6 text-amber-800 flex-shrink-0" />
            <span className="font-bold text-xs text-amber-950 leading-tight">
              {t('home.schemesBtn')}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-700" />
        </button>

        <button
          onClick={() => onNavigate('cropGuide')}
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-emerald-800 flex-shrink-0" />
            <span className="font-bold text-xs text-emerald-950 leading-tight">
              {t('home.cropGuidesBtn')}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700" />
        </button>
      </div>
    </div>
  );
}
