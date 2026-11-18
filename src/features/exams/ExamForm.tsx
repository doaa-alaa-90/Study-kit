import { useState, type FormEvent } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { btnPrimary, btnSecondary, inputClass, labelClass } from '@/lib/styles';
import SubjectInput from '@/components/ui/SubjectInput';
import type { Exam } from '@/types';

export type ExamDraft = Pick<Exam, 'name' | 'subject' | 'date' | 'time' | 'notes'>;

interface ExamFormProps {
  initial?: Exam;
  subjects: string[];
  onSubmit: (draft: ExamDraft) => void;
  onCancel: () => void;
}

export default function ExamForm({ initial, subjects, onSubmit, onCancel }: ExamFormProps) {
  const { t } = usePreferences();
  const [name, setName] = useState(initial?.name ?? '');
  const [subject, setSubject] = useState(initial?.subject ?? '');
  const [date, setDate] = useState(initial?.date ?? '');
  const [time, setTime] = useState(initial?.time ?? '09:00');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ name: name.trim(), subject: subject.trim(), date, time, notes: notes.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="exam-name" className={labelClass}>
          {t('exams.name')}
        </label>
        <input
          id="exam-name"
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder={t('exams.namePlaceholder')}
          required
          pattern=".*\S.*"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="exam-subject" className={labelClass}>
          {t('common.subject')}
        </label>
        <SubjectInput
          id="exam-subject"
          value={subject}
          onChange={setSubject}
          suggestions={subjects}
          placeholder={t('exams.subjectPlaceholder')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="exam-date" className={labelClass}>
            {t('common.date')}
          </label>
          <input
            id="exam-date"
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="exam-time" className={labelClass}>
            {t('common.time')}
          </label>
          <input
            id="exam-time"
            type="time"
            value={time}
            onChange={event => setTime(event.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="exam-notes" className={labelClass}>
          {t('common.notes')}
        </label>
        <textarea
          id="exam-notes"
          value={notes}
          onChange={event => setNotes(event.target.value)}
          rows={3}
          className={`${inputClass} resize-y`}
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
