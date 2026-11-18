import { AlertTriangle, CalendarClock, ListChecks, NotebookPen, type LucideIcon } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { cardClass } from '@/lib/styles';

export interface HomeSnapshot {
  tasksToday: number;
  overdue: number;
  nextExam: { name: string; days: number } | null;
  notes: number;
}

interface SnapshotSectionProps {
  snapshot: HomeSnapshot;
}

interface StatItem {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}

export default function SnapshotSection({ snapshot }: SnapshotSectionProps) {
  const { t } = usePreferences();

  const stats: StatItem[] = [
    { label: t('home.tasksToday'), value: String(snapshot.tasksToday), icon: ListChecks },
    { label: t('home.tasksOverdue'), value: String(snapshot.overdue), icon: AlertTriangle },
    {
      label: t('home.nextExam'),
      value: snapshot.nextExam
        ? snapshot.nextExam.days === 0
          ? t('home.nextExamToday')
          : t('home.nextExamDays', { days: snapshot.nextExam.days })
        : t('home.noExams'),
      hint: snapshot.nextExam?.name,
      icon: CalendarClock,
    },
    { label: t('home.notesCount'), value: String(snapshot.notes), icon: NotebookPen },
  ];

  return (
    <section aria-labelledby="snapshot-title">
      <div className="mb-7 flex items-end justify-between gap-4">
        <h2 id="snapshot-title" className="text-xl font-bold text-ink sm:text-2xl">
          {t('home.snapshot')}
        </h2>
        <p className="mt-2 text-sm text-muted">{t('home.snapshotHint')}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className={`${cardClass} group p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-aqua/15 dark:text-aqua dark:group-hover:bg-aqua dark:group-hover:text-secondary">
              <stat.icon size={18} />
            </span>
            <p className="mt-4 text-2xl font-bold tabular-nums text-ink sm:text-3xl">{stat.value}</p>
            {stat.hint && <p className="mt-1 truncate text-sm font-medium text-ink">{stat.hint}</p>}
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
