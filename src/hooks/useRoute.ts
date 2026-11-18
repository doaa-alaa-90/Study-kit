import { useEffect, useMemo, useState } from 'react';
import { getPageFromHash, type PageId } from '@/lib/routes';

export interface Route {
  page: PageId;
  anchor: string | null;
  hash: string;
}

function readRoute(hash: string): Route {
  const anchor = hash.split('#')[2] || null;
  return { page: getPageFromHash(hash), anchor, hash };
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return useMemo(() => readRoute(hash), [hash]);
}
