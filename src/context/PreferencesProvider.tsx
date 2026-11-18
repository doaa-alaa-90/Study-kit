import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang, Theme } from '@/types';
import { readChoice, STORAGE_KEYS, writeStored } from '@/lib/storage';
import { PreferencesContext } from './preferences-context';

const LANGS = ['ar', 'en'] as const;
const THEMES = ['light', 'dark'] as const;

export default function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => readChoice(STORAGE_KEYS.lang, LANGS, 'ar'));
  const [theme, setTheme] = useState<Theme>(() => readChoice(STORAGE_KEYS.theme, THEMES, 'light'));

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    writeStored(STORAGE_KEYS.lang, lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const favicon = document.getElementById('app-favicon');
    if (favicon) {
      favicon.setAttribute('href', theme === 'dark' ? '/studykit-favicon-dark.png' : '/studykit-favicon.png');
    }
    writeStored(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      lang,
      theme,
      toggleLang: () => setLang(current => (current === 'ar' ? 'en' : 'ar')),
      toggleTheme: () => setTheme(current => (current === 'light' ? 'dark' : 'light')),
    }),
    [lang, theme]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
