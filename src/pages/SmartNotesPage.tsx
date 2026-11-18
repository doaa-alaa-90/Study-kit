import { useMemo, useState } from 'react';
import { NotebookPen, Plus, Search } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import NoteCard from '@/features/notes/NoteCard';
import NoteForm, { type NoteDraft } from '@/features/notes/NoteForm';
import NoteViewer from '@/features/notes/NoteViewer';
import { usePreferences } from '@/hooks/usePreferences';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/useToast';
import { createId } from '@/lib/ids';
import { uniqueSubjects } from '@/lib/subjects';
import { STORAGE_KEYS } from '@/lib/storage';
import { btnPrimary, inputClass } from '@/lib/styles';
import type { Note } from '@/types';

export default function SmartNotesPage() {
  const { t } = usePreferences();
  const { notify } = useToast();
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.notes, []);
  const [formTarget, setFormTarget] = useState<Note | 'new' | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');

  const subjects = useMemo(() => uniqueSubjects(notes), [notes]);
  const viewing = notes.find(note => note.id === viewingId);
  const editingNote = formTarget && formTarget !== 'new' ? formTarget : undefined;

  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    return notes
      .filter(
        note =>
          (subject === 'all' || note.subject === subject) &&
          (!query || note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query))
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [notes, search, subject]);

  function saveNote(draft: NoteDraft) {
    const now = new Date().toISOString();
    if (editingNote) {
      setNotes(prev => prev.map(item => (item.id === editingNote.id ? { ...item, ...draft, updatedAt: now } : item)));
    } else {
      const note: Note = { ...draft, id: createId(), createdAt: now, updatedAt: now };
      setNotes(prev => [note, ...prev]);
    }
    setFormTarget(null);
    notify(t('notes.saved'), 'success');
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setNotes(prev => prev.filter(item => item.id !== id));
    setPendingDelete(null);
    setViewingId(null);
    notify(t('notes.deleted'), 'success');
  }

  return (
    <div>
      <PageHeader
        title={t('notes.title')}
        subtitle={t('notes.subtitle')}
        tool={TOOLS.notes}
        action={
          <button type="button" onClick={() => setFormTarget('new')} className={btnPrimary}>
            <Plus size={18} />
            {t('notes.add')}
          </button>
        }
      />

      {notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={t('notes.emptyTitle')}
          description={t('notes.emptyText')}
          action={
            <button type="button" onClick={() => setFormTarget('new')} className={btnPrimary}>
              <Plus size={18} />
              {t('notes.add')}
            </button>
          }
        />
      ) : (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_16rem]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder={t('notes.search')}
                aria-label={t('notes.search')}
                className={`${inputClass} ps-10`}
              />
            </div>
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

          {visibleNotes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">
              {t('notes.noMatch')}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onOpen={item => setViewingId(item.id)}
                  onEdit={item => setFormTarget(item)}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      <NoteViewer
        note={viewing}
        onClose={() => setViewingId(null)}
        onEdit={item => {
          setViewingId(null);
          setFormTarget(item);
        }}
        onDelete={setPendingDelete}
      />

      <Modal
        open={formTarget !== null}
        title={editingNote ? t('notes.editNote') : t('notes.add')}
        onClose={() => setFormTarget(null)}
        widthClass="sm:max-w-2xl"
      >
        {formTarget !== null && (
          <NoteForm
            key={editingNote?.id ?? 'new'}
            initial={editingNote}
            subjects={subjects}
            onSubmit={saveNote}
            onCancel={() => setFormTarget(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={pendingDelete !== null}
        message={t('notes.deleteConfirm')}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
