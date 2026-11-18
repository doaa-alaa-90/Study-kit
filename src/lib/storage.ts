export const STORAGE_KEYS = {
  lang: 'studykit.lang',
  theme: 'studykit.theme',
  tasks: 'studykit.tasks',
  exams: 'studykit.exams',
  notes: 'studykit.notes',
} as const;

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; the in-memory state still works for this session.
  }
}

export function readChoice<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return allowed.find(option => option === raw) ?? fallback;
  } catch {
    return fallback;
  }
}
