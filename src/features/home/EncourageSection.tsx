import { ArrowRight, Sparkles } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { pageHref } from '@/lib/routes';

export default function EncourageSection() {
  const { t } = usePreferences();

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-secondary via-primary-dark to-primary px-6 py-16 text-center text-white shadow-lift sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute -start-20 -top-20 h-72 w-72 rounded-full bg-aqua/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -end-16 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
      <div className="relative mx-auto max-w-2xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-gold shadow-inner shadow-white/10">
          <Sparkles size={24} />
        </span>
        <h2 className="mt-6 text-2xl font-bold sm:text-3xl">{t('home.ctaTitle')}</h2>
        <p className="mt-4 leading-relaxed text-white/90">{t('home.ctaText')}</p>
        <a
          href={pageHref('tasks')}
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gold px-7 text-base font-semibold text-secondary shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
        >
          {t('home.ctaButton')}
          <ArrowRight size={18} className="[[dir=rtl]_&]:rotate-180" />
        </a>
      </div>
    </section>
  );
}
