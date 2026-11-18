import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cardClass } from '@/lib/styles';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={`${cardClass} flex flex-col items-center px-6 py-14 text-center`}>
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-sky-300">
        <Icon size={30} />
      </span>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
