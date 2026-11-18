import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { formatTimestamp } from '@/lib/dates';
import { btnIcon, chipClass } from '@/lib/styles';
import type { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  onOpen: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export default function NoteCard({ note, onOpen, onEdit, onDelete }: NoteCardProps) {
  const { t, lang } = usePreferences();

  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <button type="button" onClick={() => onOpen(note)} className="flex flex-1 flex-col p-5 text-start sm:p-6">
        <span className={`${chipClass} w-fit`}>{note.subject}</span>
        <h3 className="mt-3 break-words text-lg font-semibold text-ink">{note.title}</h3>
        <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-line text-sm leading-relaxed text-muted">
          {note.content || t('notes.noContent')}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted">
          <CalendarDays size={13} />
          {t('notes.created', { date: formatTimestamp(note.createdAt, lang) })}
        </span>
      </button>
      <div className="flex justify-end gap-1 border-t border-line px-3 py-2">
        <button type="button" onClick={() => onEdit(note)} aria-label={t('common.edit')} className={btnIcon}>
          <Pencil size={17} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(note)}
          aria-label={t('common.delete')}
          className={`${btnIcon} hover:text-red-600 dark:hover:text-red-400`}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
