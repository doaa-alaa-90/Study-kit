import Logo from '@/components/layout/Logo';
import { usePreferences } from '@/hooks/usePreferences';
import { pageHref, sectionHref } from '@/lib/routes';
import { TOOL_IDS, TOOLS } from '@/lib/tools';

export default function Footer() {
  const { t } = usePreferences();

  return (
    <footer className="mt-10 border-t border-line bg-card/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <a href={pageHref('home')} dir="ltr" className="flex h-16 w-48 shrink-0 flex-row items-center rounded-2xl bg-canvas/60 px-3" aria-label="StudyKit">
            <Logo loading="lazy" className="h-full w-full object-contain" />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t('footer.description')}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">{t('footer.quickLinks')}</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            <li>
              <a href={pageHref('home')} className="transition hover:text-primary dark:hover:text-aqua">
                {t('nav.home')}
              </a>
            </li>
            <li>
              <a href={sectionHref('tools')} className="transition hover:text-primary dark:hover:text-aqua">
                {t('nav.tools')}
              </a>
            </li>
            <li>
              <a href={sectionHref('about')} className="transition hover:text-primary dark:hover:text-aqua">
                {t('nav.about')}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-ink">{t('footer.toolsLinks')}</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted">
            {TOOL_IDS.map(id => (
              <li key={id}>
                <a href={pageHref(id)} className="transition hover:text-primary dark:hover:text-aqua">
                  {t(TOOLS[id].nameKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-center text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between sm:text-start">
          <p>{t('storage.notice')}</p>
          <p className="shrink-0 font-medium">{t('footer.copyright', { year: String(new Date().getFullYear()) })}</p>
        </div>
      </div>
    </footer>
  );
}
