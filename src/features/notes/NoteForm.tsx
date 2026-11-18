import { useState, type FormEvent } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { btnPrimary, btnSecondary, inputClass, labelClass } from '@/lib/styles';
import SubjectInput from '@/components/ui/SubjectInput';
import type { Note } from '@/types';

export type NoteDraft = Pick<Note, 'title' | 'subject' | 'content'>;

interface NoteFormProps {
  initial?: Note;
  subjects: string[];
  onSubmit: (draft: NoteDraft) => void;
  onCancel: () => void;
}

export default function NoteForm({ initial, subjects, onSubmit, onCancel }: NoteFormProps) {
  const { t } = usePreferences();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [subject, setSubject] = useState(initial?.subject ?? '');
  const [content, setContent] = useState(initial?.content ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ title: title.trim(), subject: subject.trim(), content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="note-title" className={labelClass}>
            {t('notes.noteTitle')}
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder={t('notes.noteTitlePlaceholder')}
            required
            pattern=".*\S.*"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="note-subject" className={labelClass}>
            {t('common.subject')}
          </label>
          <SubjectInput
            id="note-subject"
            value={subject}
            onChange={setSubject}
            suggestions={subjects}
            placeholder={t('notes.subjectPlaceholder')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="note-content" className={labelClass}>
          {t('notes.content')}
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={event => setContent(event.target.value)}
          placeholder={t('notes.contentPlaceholder')}
          rows={12}
          className={`${inputClass} min-h-[16rem] resize-y text-base leading-relaxed`}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={btnSecondary}>
          {t('common.cancel')}
        </button>
        <button type="submit" className={btnPrimary}>
          {t('common.save')}
        </button>
      </div>
    </form>
  );
}
