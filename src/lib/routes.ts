export const PAGES = ['home', 'merge', 'tasks', 'exams', 'notes', 'compress', 'images', 'ocr'] as const;

export type PageId = (typeof PAGES)[number];

export function getPageFromHash(hash: string): PageId {
  const id = hash.replace(/^#\/?/, '');
  return (PAGES as readonly string[]).includes(id) ? (id as PageId) : 'home';
}

export function pageHref(page: PageId): string {
  return page === 'home' ? '#/' : `#/${page}`;
}

export function sectionHref(section: 'tools' | 'about'): string {
  return `#/#${section}`;
}
