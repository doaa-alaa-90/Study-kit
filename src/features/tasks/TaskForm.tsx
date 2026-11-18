import { useState, type FormEvent } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { todayKey } from '@/lib/dates';
import { btnPrimary, btnSecondary, inputClass, labelClass } from '@/lib/styles';
import SubjectInput from '@/components/ui/SubjectInput';
import type { Priority, StudyTask } from '@/types';
import type { TaskDraft } from './taskUtils';

interface TaskFormProps {
  initial?: StudyTask;
  subjects: string[];
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
}

const PRIORITIES: Priority[] = ['high', 'medium', 'low'];

export default function TaskForm({ initial, subjects, onSubmit, onCancel }: TaskFormProps) {
  const { t } = usePreferences();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [subject, setSubject] = useState(initial?.subject ?? '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? todayKey());
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ title: title.trim(), subject: subject.trim(), dueDate, priority, notes: notes.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="task-title" className={labelClass}>
          {t('tasks.taskTitle')}
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder={t('tasks.taskTitlePlaceholder')}
          required
          pattern=".*\S.*"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="task-subject" className={labelClass}>
            {t('common.subject')}
          </label>
          <SubjectInput
            id="task-subject"
            value={subject}
            onChange={setSubject}
            suggestions={subjects}
            placeholder={t('tasks.subjectPlaceholder')}
          />
        </div>
        <div>
          <label htmlFor="task-due" className={labelClass}>
            {t('tasks.dueDate')}
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={event => setDueDate(event.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>{t('common.priority')}</legend>
        <div className="grid grid-cols-3 gap-2">
          {PRIORITIES.map(option => (
            <label
              key={option}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                priority === option
                  ? 'border-primary bg-primary text-white shadow-sm'
                  : 'border-line bg-field text-ink hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="task-priority"
                value={option}
                checked={priority === option}
                onChange={() => setPriority(option)}
                className="sr-only"
              />
              {t(`priority.${option}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="task-notes" className={labelClass}>
          {t('common.notes')}
        </label>
        <textarea
          id="task-notes"
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
