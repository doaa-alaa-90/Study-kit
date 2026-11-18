import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { usePreferences } from '@/hooks/usePreferences';
import { formatTimestamp } from '@/lib/dates';
import { btnDanger, btnPrimary, chipClass } from '@/lib/styles';
import type { Note } from '@/types';

interface NoteViewerProps {
  note: Note | undefined;
  onClose: () => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export default function NoteViewer({ note, onClose, onEdit, onDelete }: NoteViewerProps) {
  const { t, lang } = usePreferences();

  return (
    <Modal open={note !== undefined} title={note?.title ?? ''} onClose={onClose} widthClass="sm:max-w-2xl">
      {note && (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className={chipClass}>{note.subject}</span>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} />
                {t('notes.created', { date: formatTimestamp(note.createdAt, lang) })}
              </span>
              {note.updatedAt !== note.createdAt && (
                <span>{t('notes.updated', { date: formatTimestamp(note.updatedAt, lang) })}</span>
              )}
            </p>
          </div>

          <div className="min-h-[8rem] whitespace-pre-wrap break-words text-base leading-relaxed text-ink">
            {note.content || <span className="text-muted">{t('notes.noContent')}</span>}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => onDelete(note)} className={btnDanger}>
              <Trash2 size={18} />
              {t('common.delete')}
            </button>
            <button type="button" onClick={() => onEdit(note)} className={btnPrimary}>
              <Pencil size={18} />
              {t('common.edit')}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
