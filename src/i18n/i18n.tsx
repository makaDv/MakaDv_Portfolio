import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import translations from './translations';

type Lang = 'en' | 'it';

type I18nContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string, fallback?: any) => any;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'makadv_portfolio_lang';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'it') return saved;
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(() => {
    return (path: string, fallback: any = undefined): any => {
      const parts = path.split('.');
      let cur: any = translations[lang as Lang] ?? {};
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) {
          cur = cur[p];
        } else {
          return typeof fallback !== 'undefined' ? fallback : path;
        }
      }
      return typeof cur === 'undefined' ? (typeof fallback !== 'undefined' ? fallback : path) : cur;
    };
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
