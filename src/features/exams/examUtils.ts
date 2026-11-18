import { examDateTime } from '@/lib/dates';
import type { Exam } from '@/types';

export function sortExams(exams: Exam[], now: number): { sorted: Exam[]; nearestId: string | null } {
  const timed = exams.map(exam => ({ exam, time: examDateTime(exam.date, exam.time).getTime() }));
  const upcoming = timed.filter(item => item.time > now).sort((a, b) => a.time - b.time);
  const passed = timed.filter(item => item.time <= now).sort((a, b) => b.time - a.time);
  return {
    sorted: [...upcoming, ...passed].map(item => item.exam),
    nearestId: upcoming[0]?.exam.id ?? null,
  };
}
