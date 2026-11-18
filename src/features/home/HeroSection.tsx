import { ArrowRight, CalendarClock } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { pageHref } from '@/lib/routes';

interface HeroSectionProps {
  nextExam: { name: string; days: number } | null;
}

export default function HeroSection({ nextExam }: HeroSectionProps) {
  const { t } = usePreferences();

  return (
    <section className="relative grid items-center gap-10 overflow-hidden rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white via-white/90 to-blue-50/80 px-5 py-8 shadow-card backdrop-blur-sm sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-12 lg:py-12 dark:from-card dark:via-card dark:to-secondary/80">
      <div className="pointer-events-none absolute -start-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 end-1/3 h-80 w-80 rounded-full bg-aqua/10 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full border-[3rem] border-accent/10 blur-sm" />
      <div className="relative text-center lg:text-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:bg-card/80 dark:text-aqua">
          <span className="h-2 w-2 rounded-full bg-gold" />
          {t('home.badge')}
        </span>
        <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          {t('home.headline')}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-[1.6] text-muted sm:text-lg lg:mx-0">
          {t('home.description')}
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
          <a
            href={pageHref('tasks')}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-white shadow-lg shadow-primary/30 transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
          >
            {t('home.ctaStart')}
            <ArrowRight size={18} className="transition [[dir=rtl]_&]:rotate-180" />
          </a>
          <a
            href="#/#tools"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-line bg-card px-7 text-base font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary dark:hover:text-aqua"
          >
            {t('home.ctaExplore')}
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-center lg:max-w-none">
        <img
          src="/study_kit_small_(1) copy.png"
          alt={t('home.heroAlt')}
          width={1074}
          height={976}
          decoding="async"
          className="mx-auto block h-auto w-full max-w-[38rem] object-contain transition duration-700 hover:scale-[1.015]"
        />
        {nextExam && (
          <div className="absolute -bottom-5 start-4 flex items-center gap-3 rounded-2xl border border-line bg-card/95 px-4 py-3 shadow-card backdrop-blur animate-float-soft sm:start-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/25 text-secondary dark:text-gold">
              <CalendarClock size={20} />
            </span>
            <div className="text-start">
              <p className="text-xs font-medium text-muted">{t('home.nextExam')}</p>
              <p className="max-w-[10rem] truncate text-sm font-bold text-ink">{nextExam.name}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
