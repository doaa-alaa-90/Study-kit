import { useMemo, useState } from 'react';
import { Plus, Search, ListChecks } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import TaskForm from '@/features/tasks/TaskForm';
import TaskItem from '@/features/tasks/TaskItem';
import { filterTasks, getTaskStats, groupTasks, type TaskDraft } from '@/features/tasks/taskUtils';
import { usePreferences } from '@/hooks/usePreferences';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/useToast';
import { createId } from '@/lib/ids';
import { todayKey } from '@/lib/dates';
import { uniqueSubjects } from '@/lib/subjects';
import { STORAGE_KEYS } from '@/lib/storage';
import { btnPrimary, cardClass, inputClass } from '@/lib/styles';
import type { Priority, StudyTask } from '@/types';
import type { TranslationKey } from '@/i18n';

type FormTarget = StudyTask | 'new' | null;

const SECTION_ORDER = ['today', 'upcoming', 'overdue', 'completed'] as const;
const SECTION_TITLES: Record<(typeof SECTION_ORDER)[number], TranslationKey> = {
  today: 'tasks.sectionToday',
  upcoming: 'tasks.sectionUpcoming',
  overdue: 'tasks.sectionOverdue',
  completed: 'tasks.sectionCompleted',
};

export default function StudyTasksPage() {
  const { t } = usePreferences();
  const { notify } = useToast();
  const [tasks, setTasks] = useLocalStorage<StudyTask[]>(STORAGE_KEYS.tasks, []);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [pendingDelete, setPendingDelete] = useState<StudyTask | null>(null);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<Priority | 'all'>('all');
  const [subject, setSubject] = useState('all');

  const today = todayKey();
  const subjects = useMemo(() => uniqueSubjects(tasks), [tasks]);
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const sections = useMemo(
    () => groupTasks(filterTasks(tasks, { search, priority, subject }), today),
    [tasks, search, priority, subject, today]
  );
  const hasVisibleTasks = SECTION_ORDER.some(key => sections[key].length > 0);

  function saveTask(draft: TaskDraft) {
    if (formTarget === 'new' || formTarget === null) {
      const task: StudyTask = { ...draft, id: createId(), completed: false, createdAt: new Date().toISOString() };
      setTasks(prev => [task, ...prev]);
    } else {
      setTasks(prev => prev.map(item => (item.id === formTarget.id ? { ...item, ...draft } : item)));
    }
    setFormTarget(null);
    notify(t('tasks.saved'), 'success');
  }

  function toggleTask(task: StudyTask) {
    setTasks(prev => prev.map(item => (item.id === task.id ? { ...item, completed: !item.completed } : item)));
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setTasks(prev => prev.filter(item => item.id !== id));
    setPendingDelete(null);
    notify(t('tasks.deleted'), 'success');
  }

  const editingTask = formTarget && formTarget !== 'new' ? formTarget : undefined;

  return (
    <div>
      <PageHeader
        title={t('tasks.title')}
        subtitle={t('tasks.subtitle')}
        tool={TOOLS.tasks}
        action={
          <button type="button" onClick={() => setFormTarget('new')} className={btnPrimary}>
            <Plus size={18} />
            {t('tasks.add')}
          </button>
        }
      />

      <section className={`${cardClass} mb-8 p-5 sm:p-6`}>
        <h2 className="mb-5 font-semibold text-ink">{t('tasks.progress')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: t('tasks.total'), value: stats.total },
            { label: t('tasks.completed'), value: stats.completed },
            { label: t('tasks.remaining'), value: stats.remaining },
            { label: t('tasks.percent'), value: `${stats.percent}%` },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-canvas p-4">
              <p className="text-2xl font-bold text-ink tabular-nums">{item.value}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-5 h-2.5 overflow-hidden rounded-full bg-canvas"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.percent}
        >
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${stats.percent}%` }} />
        </div>
      </section>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={t('tasks.emptyAll')}
          description={t('tasks.emptyAll')}
          action={
            <button type="button" onClick={() => setFormTarget('new')} className={btnPrimary}>
              <Plus size={18} />
              {t('tasks.add')}
            </button>
          }
        />
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="relative sm:col-span-1">
              <Search size={18} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder={t('tasks.search')}
                aria-label={t('tasks.search')}
                className={`${inputClass} ps-10`}
              />
            </div>
            <select
              value={priority}
              onChange={event => setPriority(event.target.value as Priority | 'all')}
              aria-label={t('common.priority')}
              className={inputClass}
            >
              <option value="all">{t('common.allPriorities')}</option>
              <option value="high">{t('priority.high')}</option>
              <option value="medium">{t('priority.medium')}</option>
              <option value="low">{t('priority.low')}</option>
            </select>
            <select
              value={subject}
              onChange={event => setSubject(event.target.value)}
              aria-label={t('common.subject')}
              className={inputClass}
            >
              <option value="all">{t('common.allSubjects')}</option>
              {subjects.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {!hasVisibleTasks ? (
            <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">
              {t('tasks.noMatch')}
            </p>
          ) : (
            <div className="space-y-8">
              {SECTION_ORDER.map(key =>
                sections[key].length === 0 ? null : (
                  <section key={key} aria-labelledby={`section-${key}`}>
                    <h2 id={`section-${key}`} className="mb-3 flex items-center gap-2 text-lg font-semibold text-ink">
                      {t(SECTION_TITLES[key])}
                      <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-medium text-muted tabular-nums">
                        {sections[key].length}
                      </span>
                    </h2>
                    <ul className="space-y-3">
                      {sections[key].map(task => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          today={today}
                          onToggle={toggleTask}
                          onEdit={item => setFormTarget(item)}
                          onDelete={setPendingDelete}
                        />
                      ))}
                    </ul>
                  </section>
                )
              )}
            </div>
          )}
        </>
      )}

      <Modal
        open={formTarget !== null}
        title={editingTask ? t('tasks.editTask') : t('tasks.newTask')}
        onClose={() => setFormTarget(null)}
      >
        {formTarget !== null && (
          <TaskForm
            key={editingTask?.id ?? 'new'}
            initial={editingTask}
            subjects={subjects}
            onSubmit={saveTask}
            onCancel={() => setFormTarget(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        message={t('tasks.deleteConfirm')}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
