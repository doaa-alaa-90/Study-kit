import { useEffect, useState } from 'react';
import { readStored, writeStored } from '@/lib/storage';

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStored(key, fallback));

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
