import { BookOpen, CalendarClock, Circle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { formatDateKey } from '@/lib/dates';
import { btnIcon } from '@/lib/styles';
import type { Priority, StudyTask } from '@/types';

interface TaskItemProps {
  task: StudyTask;
  today: string;
  onToggle: (task: StudyTask) => void;
  onEdit: (task: StudyTask) => void;
  onDelete: (task: StudyTask) => void;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  high: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

export default function TaskItem({ task, today, onToggle, onEdit, onDelete }: TaskItemProps) {
  const { t, lang } = usePreferences();
  const overdue = !task.completed && task.dueDate < today;

  return (
    <li
      className={`flex items-start gap-4 rounded-2xl border border-line bg-card p-4 shadow-card transition duration-200 hover:-translate-y-0.5 sm:p-5 ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-label={t(task.completed ? 'tasks.markActive' : 'tasks.markDone')}
        className="mt-0.5 shrink-0 rounded-full text-primary transition active:scale-90 dark:text-sky-300"
      >
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-muted" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`break-words font-semibold ${task.completed ? 'text-muted line-through' : 'text-ink'}`}>
            {task.title}
          </h3>
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
            {t(`priority.${task.priority}`)}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={14} />
            {task.subject}
          </span>
          <span className={`inline-flex items-center gap-1.5 ${overdue ? 'font-medium text-red-600 dark:text-red-400' : ''}`}>
            <CalendarClock size={14} />
            {t('tasks.due', { date: formatDateKey(task.dueDate, lang) })}
          </span>
        </div>
        {task.notes && <p className="mt-2 line-clamp-2 whitespace-pre-line text-sm text-muted">{task.notes}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button type="button" onClick={() => onEdit(task)} aria-label={t('common.edit')} className={btnIcon}>
          <Pencil size={18} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={t('common.delete')}
          className={`${btnIcon} hover:text-red-600 dark:hover:text-red-400`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
