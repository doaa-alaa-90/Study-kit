import { useEffect, useRef, useState, type DragEvent } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Download, FileImage, Image as ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
import type { TranslationKey } from '@/i18n';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/useToast';
import { createId } from '@/lib/ids';
import { btnIcon, btnPrimary, btnSecondary, cardClass, chipClass, labelClass } from '@/lib/styles';
import { isImageFile, imagesToPdf, type PageSize, type Orientation } from '@/features/images/imagesToPdf';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface ConvertResult {
  url: string;
  pageCount: number;
}

const PAGE_SIZES: { value: PageSize; labelKey: TranslationKey }[] = [
  { value: 'a4', labelKey: 'images.pageSizeA4' },
  { value: 'original', labelKey: 'images.pageSizeOriginal' },
];

const ORIENTATIONS: { value: Orientation; labelKey: TranslationKey }[] = [
  { value: 'portrait', labelKey: 'images.orientationPortrait' },
  { value: 'landscape', labelKey: 'images.orientationLandscape' },
];

export default function ImagesToPdfPage() {
  const { t } = usePreferences();
  const { notify } = useToast();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [isChecking, setIsChecking] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      items.forEach(item => URL.revokeObjectURL(item.previewUrl));
      if (result) URL.revokeObjectURL(result.url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    setIsChecking(true);
    const accepted: ImageItem[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (!isImageFile(file)) {
        rejected.push(file.name);
        continue;
      }
      accepted.push({ id: createId(), file, previewUrl: URL.createObjectURL(file) });
    }
    setIsChecking(false);
    if (accepted.length > 0) {
      setItems(prev => [...prev, ...accepted]);
      setResult(null);
      notify(t('images.added', { count: accepted.length }), 'success');
    }
    if (rejected.length > 0) {
      notify(t('images.invalid', { names: rejected.join(', ') }), 'error');
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    void addFiles(event.dataTransfer.files);
  }

  function removeItem(id: string) {
    setItems(prev => {
      const found = prev.find(item => item.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter(item => item.id !== id);
    });
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

  function clearAll() {
    items.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setResult(null);
  }

  async function handleConvert() {
    if (items.length < 1) {
      notify(t('images.needOne'), 'error');
      return;
    }
    setIsConverting(true);
    try {
      const bytes = await imagesToPdf(items.map(item => item.file), pageSize, orientation);
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), pageCount: items.length });
      notify(t('images.successTitle'), 'success');
    } catch {
      notify(t('images.failed'), 'error');
    } finally {
      setIsConverting(false);
    }
  }

  const radioRow = 'flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-field px-3 py-2.5 text-sm font-medium text-ink transition hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5';

  return (
    <div>
      <PageHeader title={t('images.title')} subtitle={t('images.subtitle')} tool={TOOLS.images} />

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
                {isChecking ? t('images.checking') : t('images.dropTitle')}
              </span>
              {!isChecking && <span className="text-sm text-muted">{t('images.dropBrowse')}</span>}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
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
                <h2 className="font-semibold text-ink">{t('images.listTitle')}</h2>
                <p className="mt-1 text-sm text-muted">{t('images.listHint')}</p>
              </div>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="shrink-0 text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
                >
                  {t('images.clear')}
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="rounded-xl bg-canvas px-4 py-8 text-center text-sm text-muted">{t('images.empty')}</p>
            ) : (
              <ol className="grid gap-3 sm:grid-cols-2">
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-line bg-field p-3 transition hover:border-primary/40"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted">
                        <FileImage size={12} />
                        {item.file.type || 'image'}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveItem(index, -1)}
                        disabled={index === 0}
                        aria-label={t('images.moveUp')}
                        className={btnIcon}
                      >
                        <ArrowUp size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label={t('images.moveDown')}
                        className={btnIcon}
                      >
                        <ArrowDown size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={t('images.remove')}
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
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-aqua">
                <ImageIcon size={20} />
              </span>
              <span className={`${chipClass}`}>{items.length}</span>
            </div>

            <div>
              <span className={labelClass}>{t('images.pageSize')}</span>
              <div className="grid grid-cols-2 gap-2">
                {PAGE_SIZES.map(opt => (
                  <label key={opt.value} className={radioRow}>
                    <input
                      type="radio"
                      name="page-size"
                      value={opt.value}
                      checked={pageSize === opt.value}
                      onChange={() => setPageSize(opt.value)}
                      className="accent-primary"
                    />
                    {t(opt.labelKey)}
                  </label>
                ))}
              </div>
            </div>

            {pageSize === 'a4' && (
              <div>
                <span className={labelClass}>{t('images.orientation')}</span>
                <div className="grid grid-cols-2 gap-2">
                  {ORIENTATIONS.map(opt => (
                    <label key={opt.value} className={radioRow}>
                      <input
                        type="radio"
                        name="orientation"
                        value={opt.value}
                        checked={orientation === opt.value}
                        onChange={() => setOrientation(opt.value)}
                        className="accent-primary"
                      />
                      {t(opt.labelKey)}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleConvert}
              disabled={items.length < 1 || isConverting}
              className={`${btnPrimary} w-full`}
            >
              {isConverting ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
              {isConverting ? t('images.converting') : t('images.convertButton')}
            </button>
            {items.length < 1 && <p className="text-center text-sm text-muted">{t('images.needOne')}</p>}
          </section>

          {result && (
            <section className={`${cardClass} animate-scale-in space-y-4 border-emerald-300 p-6 dark:border-emerald-700`}>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h2 className="font-semibold text-ink">{t('images.successTitle')}</h2>
                  <p className="mt-1 text-sm text-muted">{t('images.successText', { pages: result.pageCount })}</p>
                </div>
              </div>
              <a href={result.url} download="StudyKit-images.pdf" className={`${btnSecondary} w-full`}>
                <Download size={18} />
                {t('images.download')}
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
