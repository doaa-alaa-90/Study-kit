import { useEffect, useRef, useState, type DragEvent } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Download, FileText, Layers, Loader2, Trash2, Upload, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/useToast';
import { createId } from '@/lib/ids';
import { formatBytes } from '@/lib/format';
import { btnIcon, btnPrimary, btnSecondary, cardClass, chipClass } from '@/lib/styles';
import { isPdfFile, mergePdfFiles, readPdfPageCount } from '@/features/merge/mergePdfFiles';

interface PdfItem {
  id: string;
  file: File;
  pageCount: number;
}

interface MergeResult {
  url: string;
  pageCount: number;
}

export default function MergePdfPage() {
  const { t } = usePreferences();
  const { notify } = useToast();
  const [items, setItems] = useState<PdfItem[]>([]);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!result) return;
    return () => URL.revokeObjectURL(result.url);
  }, [result]);

  const totalPages = items.reduce((sum, item) => sum + item.pageCount, 0);
  const totalBytes = items.reduce((sum, item) => sum + item.file.size, 0);

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setIsChecking(true);
    const accepted: PdfItem[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (!isPdfFile(file)) {
        rejected.push(file.name);
        continue;
      }
      try {
        const pageCount = await readPdfPageCount(file);
        accepted.push({ id: createId(), file, pageCount });
      } catch {
        rejected.push(file.name);
      }
    }
    setIsChecking(false);
    if (accepted.length > 0) {
      setItems(prev => [...prev, ...accepted]);
      setResult(null);
      notify(t('merge.added', { count: accepted.length }), 'success');
    }
    if (rejected.length > 0) {
      notify(t('merge.invalid', { names: rejected.join(', ') }), 'error');
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(item => item.id !== id));
    setResult(null);
  }

  function moveItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    setItems(prev => {
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }

  async function handleMerge() {
    if (items.length < 2) {
      notify(t('merge.needTwo'), 'error');
      return;
    }
    setIsMerging(true);
    try {
      const { bytes, pageCount } = await mergePdfFiles(items.map(item => item.file));
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), pageCount });
      notify(t('merge.successTitle'), 'success');
    } catch {
      notify(t('merge.failed'), 'error');
    } finally {
      setIsMerging(false);
    }
  }

  return (
    <div>
      <PageHeader title={t('merge.title')} subtitle={t('merge.subtitle')} tool={TOOLS.merge} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div
            onDragOver={event => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-10 ${
              isDragging ? 'border-primary bg-primary/5' : 'border-line bg-card hover:border-primary/50'
            }`}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isChecking}
              className="group flex w-full flex-col items-center gap-3 disabled:cursor-wait"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md transition group-hover:scale-105">
                {isChecking ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
              </span>
              <span className="text-lg font-semibold text-ink">
                {isChecking ? t('merge.checking') : t('merge.dropTitle')}
              </span>
              {!isChecking && <span className="text-sm text-muted">{t('merge.dropBrowse')}</span>}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              multiple
              className="hidden"
              onChange={event => {
                void addFiles(event.target.files ?? []);
                event.target.value = '';
              }}
            />
          </div>

          <section className={`${cardClass} p-5 sm:p-6`}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-ink">{t('merge.listTitle')}</h2>
                <p className="mt-1 text-sm text-muted">{t('merge.listHint')}</p>
              </div>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setItems([]);
                    setResult(null);
                  }}
                  className="shrink-0 text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
                >
                  {t('merge.clear')}
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="rounded-xl bg-canvas px-4 py-8 text-center text-sm text-muted">{t('merge.empty')}</p>
            ) : (
              <ol className="space-y-3">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-line bg-field p-3 transition hover:border-primary/40 sm:p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:text-sky-300">
                      <FileText size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <p className="text-sm text-muted">
                        {formatBytes(item.file.size)} · {t('merge.pages', { count: item.pageCount })}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label={t('merge.moveUp')}
                        className={btnIcon}
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label={t('merge.moveDown')}
                        className={btnIcon}
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={t('merge.remove')}
                        className={`${btnIcon} hover:text-red-600 dark:hover:text-red-400`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-2">
          <section className={`${cardClass} space-y-5 p-6`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-sky-300">
                <Layers size={20} />
              </span>
              <div>
                <p className="text-sm text-muted">{t('merge.totalSummary', { files: items.length, pages: totalPages })}</p>
                {items.length > 0 && <span className={`${chipClass} mt-1`}>{formatBytes(totalBytes)}</span>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleMerge}
              disabled={items.length < 2 || isMerging}
              className={`${btnPrimary} w-full`}
            >
              {isMerging ? <Loader2 size={18} className="animate-spin" /> : <Layers size={18} />}
              {isMerging ? t('merge.merging') : t('merge.mergeButton')}
            </button>
            {items.length < 2 && <p className="text-center text-sm text-muted">{t('merge.needTwo')}</p>}
          </section>

          {result && (
            <section className={`${cardClass} animate-scale-in space-y-4 border-emerald-300 p-6 dark:border-emerald-700`}>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h2 className="font-semibold text-ink">{t('merge.successTitle')}</h2>
                  <p className="mt-1 text-sm text-muted">{t('merge.successText', { pages: result.pageCount })}</p>
                </div>
              </div>
              <a href={result.url} download="StudyKit-merged.pdf" className={`${btnSecondary} w-full`}>
                <Download size={18} />
                {t('merge.download')}
              </a>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="flex w-full items-center justify-center gap-1.5 text-sm text-muted hover:text-ink"
              >
                <X size={14} />
                {t('common.dismiss')}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
