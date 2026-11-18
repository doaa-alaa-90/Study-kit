import type { Priority, StudyTask } from '@/types';

export type TaskDraft = Pick<StudyTask, 'title' | 'subject' | 'dueDate' | 'priority' | 'notes'>;

export interface TaskFilters {
  search: string;
  priority: Priority | 'all';
  subject: string;
}

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export function filterTasks(tasks: StudyTask[], filters: TaskFilters): StudyTask[] {
  const query = filters.search.trim().toLowerCase();
  return tasks.filter(
    task =>
      (filters.priority === 'all' || task.priority === filters.priority) &&
      (filters.subject === 'all' || task.subject === filters.subject) &&
      (!query ||
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query) ||
        task.notes.toLowerCase().includes(query))
  );
}

export function groupTasks(tasks: StudyTask[], today: string) {
  const active = tasks
    .filter(task => !task.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
  return {
    today: active.filter(task => task.dueDate === today),
    upcoming: active.filter(task => task.dueDate > today),
    overdue: active.filter(task => task.dueDate < today),
    completed: tasks.filter(task => task.completed).sort((a, b) => b.dueDate.localeCompare(a.dueDate)),
  };
}

export function getTaskStats(tasks: StudyTask[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  return {
    total,
    completed,
    remaining: total - completed,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
