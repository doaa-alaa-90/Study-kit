import { ArrowRight } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { TOOL_IDS, TOOLS } from '@/lib/tools';
import { pageHref } from '@/lib/routes';

export default function ToolsSection() {
  const { t } = usePreferences();

  return (
    <section id="tools" aria-labelledby="tools-title">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 id="tools-title" className="text-2xl font-bold text-ink sm:text-3xl">
          {t('home.tools')}
        </h2>
        <p className="mt-3 text-muted">{t('home.toolsSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {TOOL_IDS.map(id => {
          const tool = TOOLS[id];
          const Icon = tool.icon;
          return (
            <a
              key={id}
              href={pageHref(id)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-card transition duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                <img
                  src={tool.image}
                  alt={t(tool.altKey)}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute start-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-primary shadow-md backdrop-blur dark:bg-card/95 dark:text-aqua">
                  <Icon size={22} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-lg font-bold text-ink">{t(tool.nameKey)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{t(tool.descKey)}</p>
                <span className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition group-hover:-translate-y-0.5 group-hover:bg-primary-dark">
                  {t('home.openTool')}
                  <ArrowRight size={16} className="[[dir=rtl]_&]:rotate-180" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
