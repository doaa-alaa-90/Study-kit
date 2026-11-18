import { BadgeCheck, LayoutGrid, ShieldCheck, type LucideIcon } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import type { TranslationKey } from '@/i18n';

const BENEFITS: { icon: LucideIcon; title: TranslationKey; text: TranslationKey }[] = [
  { icon: BadgeCheck, title: 'home.benefit1Title', text: 'home.benefit1Text' },
  { icon: ShieldCheck, title: 'home.benefit2Title', text: 'home.benefit2Text' },
  { icon: LayoutGrid, title: 'home.benefit3Title', text: 'home.benefit3Text' },
];

export default function BenefitsSection() {
  const { t } = usePreferences();

  return (
    <section id="about" aria-labelledby="about-title">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 id="about-title" className="text-2xl font-bold text-ink sm:text-3xl">
          {t('home.benefitsTitle')}
        </h2>
        <p className="mt-3 text-muted">{t('home.benefitsSubtitle')}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-3xl border border-line bg-card p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
              <Icon size={22} />
            </span>
            <h3 className="mt-5 text-lg font-bold text-ink">{t(title)}</h3>
            <p className="mt-2 leading-relaxed text-muted">{t(text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
