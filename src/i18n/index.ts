import type { Lang } from '@/types';
import { ar } from './ar';
import { en, type TranslationKey } from './en';

export type { TranslationKey };

const DICTIONARIES: Record<Lang, Record<TranslationKey, string>> = { en, ar };

export function translate(lang: Lang, key: TranslationKey, vars?: Record<string, string | number>): string {
  let text = DICTIONARIES[lang][key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}
