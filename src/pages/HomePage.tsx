import { useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNow } from '@/hooks/useNow';
import { STORAGE_KEYS } from '@/lib/storage';
import { examDateTime, getCountdown, todayKey } from '@/lib/dates';
import type { Exam, Note, StudyTask } from '@/types';
import HeroSection from '@/features/home/HeroSection';
import SnapshotSection, { type HomeSnapshot } from '@/features/home/SnapshotSection';
import ToolsSection from '@/features/home/ToolsSection';
import BenefitsSection from '@/features/home/BenefitsSection';
import EncourageSection from '@/features/home/EncourageSection';

export default function HomePage() {
  const [tasks] = useLocalStorage<StudyTask[]>(STORAGE_KEYS.tasks, []);
  const [exams] = useLocalStorage<Exam[]>(STORAGE_KEYS.exams, []);
  const [notes] = useLocalStorage<Note[]>(STORAGE_KEYS.notes, []);
  const now = useNow(60_000);

  const snapshot = useMemo<HomeSnapshot>(() => {
    const today = todayKey();
    const active = tasks.filter(task => !task.completed);
    const nextExam = exams
      .map(exam => ({ exam, target: examDateTime(exam.date, exam.time) }))
      .filter(item => item.target.getTime() > now)
      .sort((a, b) => a.target.getTime() - b.target.getTime())[0];
    return {
      tasksToday: active.filter(task => task.dueDate === today).length,
      overdue: active.filter(task => task.dueDate < today).length,
      nextExam: nextExam ? { name: nextExam.exam.name, days: getCountdown(nextExam.target, now).days } : null,
      notes: notes.length,
    };
  }, [tasks, exams, notes, now]);

  return (
    <div className="space-y-24 sm:space-y-28">
      <HeroSection nextExam={snapshot.nextExam} />
      <SnapshotSection snapshot={snapshot} />
      <ToolsSection />
      <BenefitsSection />
      <EncourageSection />
    </div>
  );
}
