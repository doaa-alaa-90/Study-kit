import { createContext } from 'react';
import type { Lang, Theme } from '@/types';

export interface PreferencesContextValue {
  lang: Lang;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
