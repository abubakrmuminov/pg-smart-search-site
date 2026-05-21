'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Locale, TranslationDict } from '../translations';

interface I18nContextType {
  locale: Locale;
  t: TranslationDict;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pg_portal_locale') as Locale;
    if (saved && (saved === 'en' || saved === 'ru')) {
      setLocaleState(saved);
    } else {
      // Default to browser language if available
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'ru') setLocaleState('ru');
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('pg_portal_locale', newLocale);
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
