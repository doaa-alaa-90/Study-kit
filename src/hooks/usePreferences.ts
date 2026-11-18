import { useCallback, useContext } from 'react';
import { PreferencesContext } from '@/context/preferences-context';
import { translate, type TranslationKey } from '@/i18n';

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider');
  const { lang } = ctx;
  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );
  return { ...ctx, lang, t };
}
