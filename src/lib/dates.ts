import type { Lang } from '@/types';

const LOCALES: Record<Lang, string> = { ar: 'ar-EG', en: 'en-US' };

export interface Countdown {
  passed: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function examDateTime(date: string, time: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function getCountdown(target: Date, now: number): Countdown {
  const diff = target.getTime() - now;
  if (diff <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const total = Math.floor(diff / 1000);
  return {
    passed: false,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function formatDateKey(key: string, lang: Lang): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(LOCALES[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeKey(time: string, lang: Lang): string {
  const [hh, mm] = time.split(':').map(Number);
  return new Date(2000, 0, 1, hh, mm).toLocaleTimeString(LOCALES[lang], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimestamp(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleString(LOCALES[lang], { dateStyle: 'medium', timeStyle: 'short' });
}
