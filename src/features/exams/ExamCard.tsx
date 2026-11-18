import { CalendarDays, Clock, Pencil, Trash2 } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { formatDateKey, formatTimeKey, getCountdown, examDateTime } from '@/lib/dates';
import { btnIcon } from '@/lib/styles';
import type { Exam } from '@/types';

interface ExamCardProps {
  exam: Exam;
  now: number;
  isNearest: boolean;
  onEdit: (exam: Exam) => void;
  onDelete: (exam: Exam) => void;
}

const pad = (value: number) => String(value).padStart(2, '0');

export default function ExamCard({ exam, now, isNearest, onEdit, onDelete }: ExamCardProps) {
  const { t, lang } = usePreferences();
  const countdown = getCountdown(examDateTime(exam.date, exam.time), now);
  const units = [
    { label: t('exams.days'), value: countdown.days },
    { label: t('exams.hours'), value: countdown.hours },
    { label: t('exams.minutes'), value: countdown.minutes },
    { label: t('exams.seconds'), value: countdown.seconds },
  ];

  return (
    <article
      className={`flex flex-col rounded-2xl border bg-card p-5 shadow-card transition duration-300 hover:-translate-y-0.5 sm:p-6 ${
        isNearest ? 'border-primary ring-4 ring-primary/10' : 'border-line'
      } ${countdown.passed ? 'opacity-80' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary dark:text-sky-300">{exam.subject}</p>
          <h3 className="mt-1 break-words text-xl font-bold text-ink">{exam.name}</h3>
        </div>
        {isNearest && (
          <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            {t('exams.nearest')}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} />
          {formatDateKey(exam.date, lang)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} />
          {formatTimeKey(exam.time, lang)}
        </span>
      </div>

      {countdown.passed ? (
        <div className="mt-5 rounded-xl bg-canvas px-4 py-4 text-center text-sm font-medium text-muted">
          {t('exams.passed')}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-4 gap-2">
          {units.map(unit => (
            <div key={unit.label} className="rounded-xl bg-primary/10 px-1 py-3 text-center">
              <p className="text-xl font-bold text-primary tabular-nums sm:text-2xl dark:text-sky-300">{pad(unit.value)}</p>
              <p className="mt-1 text-[11px] text-muted sm:text-xs">{unit.label}</p>
            </div>
          ))}
        </div>
      )}

      {exam.notes && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{exam.notes}</p>}

      <div className="mt-auto flex justify-end gap-1 pt-5">
        <button type="button" onClick={() => onEdit(exam)} aria-label={t('common.edit')} className={btnIcon}>
          <Pencil size={18} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(exam)}
          aria-label={t('common.delete')}
          className={`${btnIcon} hover:text-red-600 dark:hover:text-red-400`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}
