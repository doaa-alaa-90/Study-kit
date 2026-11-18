import { useState } from 'react';
import { Languages, Menu, Moon, Sun, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { usePreferences } from '@/hooks/usePreferences';
import { pageHref, sectionHref } from '@/lib/routes';
import type { Route } from '@/hooks/useRoute';
import { btnIcon } from '@/lib/styles';
import type { TranslationKey } from '@/i18n';

interface NavLink {
  key: string;
  href: string;
  label: TranslationKey;
  active: boolean;
}

interface NavbarProps {
  route: Route;
}

export default function Navbar({ route }: NavbarProps) {
  const { t, lang, theme, toggleLang, toggleTheme } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);

  const links: NavLink[] = [
    {
      key: 'home',
      href: pageHref('home'),
      label: 'nav.home',
      active: route.page === 'home' && !route.anchor,
    },
    {
      key: 'tools',
      href: sectionHref('tools'),
      label: 'nav.tools',
      active: route.page === 'home' && route.anchor === 'tools',
    },
    {
      key: 'about',
      href: sectionHref('about'),
      label: 'nav.about',
      active: route.page === 'home' && route.anchor === 'about',
    },
  ];

  const linkClass = (active: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? 'bg-primary/10 font-bold text-primary dark:bg-aqua/15 dark:text-aqua' : 'text-muted hover:bg-canvas hover:text-ink'
    }`;

  return (
    <header className="sticky top-4 z-40 mx-3 rounded-[1.75rem] border border-white/70 bg-card/95 shadow-lift backdrop-blur-xl transition-colors duration-300 sm:mx-6 lg:mx-auto lg:max-w-[89rem]">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href={pageHref('home')} dir="ltr" className="flex h-11 w-32 shrink-0 flex-row items-center" aria-label="StudyKit">
          <Logo className="h-full w-full object-contain" />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.home')}>
          {links.map(link => (
            <a key={link.key} href={link.href} className={linkClass(link.active)} aria-current={link.active ? 'page' : undefined}>
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('nav.toggleLanguage')}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold text-ink transition hover:border-primary/50 hover:bg-canvas"
          >
            <Languages size={16} />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('nav.toggleTheme')}
            title={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
            className={`${btnIcon} h-10 w-10`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(open => !open)}
            aria-expanded={menuOpen}
            aria-label={t(menuOpen ? 'nav.closeMenu' : 'nav.openMenu')}
            className={`${btnIcon} h-10 w-10 md:hidden`}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="grid gap-1 border-t border-line px-4 py-3 animate-fade-in md:hidden" aria-label={t('nav.home')}>
          {links.map(link => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`${linkClass(link.active)} py-3`}
              aria-current={link.active ? 'page' : undefined}
            >
              {t(link.label)}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
