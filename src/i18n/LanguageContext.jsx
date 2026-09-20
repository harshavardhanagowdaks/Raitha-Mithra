import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from './en.json';
import knTranslations from './kn.json';

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  kn: knTranslations,
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('raitha_lang') || 'kn';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'kn') {
      setLanguageState(lang);
      localStorage.setItem('raitha_lang', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Nested translation helper: t('home.welcome')
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if key missing in Kannada
        let enCurrent = translations['en'];
        for (const k of keys) {
          if (enCurrent && enCurrent[k] !== undefined) {
            enCurrent = enCurrent[k];
          } else {
            return fallback || path;
          }
        }
        return enCurrent;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
