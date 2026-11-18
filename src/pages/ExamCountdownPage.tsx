import { useMemo, useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import ExamCard from '@/features/exams/ExamCard';
import ExamForm, { type ExamDraft } from '@/features/exams/ExamForm';
import { sortExams } from '@/features/exams/examUtils';
import { usePreferences } from '@/hooks/usePreferences';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNow } from '@/hooks/useNow';
import { useToast } from '@/hooks/useToast';
import { createId } from '@/lib/ids';
import { uniqueSubjects } from '@/lib/subjects';
import { STORAGE_KEYS } from '@/lib/storage';
import { btnPrimary } from '@/lib/styles';
import type { Exam } from '@/types';

export default function ExamCountdownPage() {
  const { t } = usePreferences();
  const { notify } = useToast();
  const [exams, setExams] = useLocalStorage<Exam[]>(STORAGE_KEYS.exams, []);
  const [formTarget, setFormTarget] = useState<Exam | 'new' | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Exam | null>(null);
  const now = useNow(1000);

  const { sorted, nearestId } = useMemo(() => sortExams(exams, now), [exams, now]);
  const subjects = useMemo(() => uniqueSubjects(exams), [exams]);
  const editingExam = formTarget && formTarget !== 'new' ? formTarget : undefined;

  function saveExam(draft: ExamDraft) {
    if (editingExam) {
      setExams(prev => prev.map(item => (item.id === editingExam.id ? { ...item, ...draft } : item)));
    } else {
      const exam: Exam = { ...draft, id: createId(), createdAt: new Date().toISOString() };
      setExams(prev => [...prev, exam]);
    }
    setFormTarget(null);
    notify(t('exams.saved'), 'success');
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setExams(prev => prev.filter(item => item.id !== id));
    setPendingDelete(null);
    notify(t('exams.deleted'), 'success');
  }

  return (
    <div>
      <PageHeader
        title={t('exams.title')}
        subtitle={t('exams.subtitle')}
        tool={TOOLS.exams}
        action={
          <button type="button" onClick={() => setFormTarget('new')} className={btnPrimary}>
            <Plus size={18} />
            {t('exams.add')}
          </button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={t('exams.emptyTitle')}
          description={t('exams.emptyText')}
          action={
            <button type="button" onClick={() => setFormTarget('new')} className={btnPrimary}>
              <Plus size={18} />
              {t('exams.add')}
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {sorted.map(exam => (
            <ExamCard
              key={exam.id}
              exam={exam}
              now={now}
              isNearest={exam.id === nearestId}
              onEdit={item => setFormTarget(item)}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={formTarget !== null}
        title={editingExam ? t('exams.editExam') : t('exams.newExam')}
        onClose={() => setFormTarget(null)}
      >
        {formTarget !== null && (
          <ExamForm
            key={editingExam?.id ?? 'new'}
            initial={editingExam}
            subjects={subjects}
            onSubmit={saveExam}
            onCancel={() => setFormTarget(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        message={t('exams.deleteConfirm')}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
