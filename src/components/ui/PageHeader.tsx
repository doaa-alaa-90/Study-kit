import type { ReactNode } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import type { ToolDefinition } from '@/lib/tools';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  tool: ToolDefinition;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, tool, action }: PageHeaderProps) {
  const { t } = usePreferences();
  const Icon = tool.icon;

  return (
    <header className="mb-8 overflow-hidden rounded-[2rem] border border-line bg-card shadow-card md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,42%)]">
      <div className="flex flex-col justify-center gap-5 bg-gradient-to-br from-card to-canvas p-6 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm dark:bg-aqua/15 dark:text-aqua">
          <Icon size={24} />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">{subtitle}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="relative aspect-[16/9] overflow-hidden bg-canvas md:aspect-auto md:min-h-64">
        <img
          src={tool.image}
          alt={t(tool.altKey)}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary/30 to-transparent" />
      </div>
    </header>
  );
}
