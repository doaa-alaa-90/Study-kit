import { useEffect, useRef, useState, type DragEvent } from 'react';
import { CheckCircle2, Download, FileText, Loader2, Shrink, Trash2, Upload, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/useToast';
import { formatBytes } from '@/lib/format';
import { btnPrimary, btnSecondary, btnIcon, cardClass, labelClass } from '@/lib/styles';
import { compressPdf, isPdfFile, type CompressionLevel } from '@/features/compress/compressPdf';
import type { TranslationKey } from '@/i18n';

interface CompressResult {
  url: string;
  originalSize: number;
  compressedSize: number;
}

const LEVELS: { value: CompressionLevel; labelKey: TranslationKey; hintKey: TranslationKey }[] = [
  { value: 'low', labelKey: 'compress.levelLow', hintKey: 'compress.levelLowHint' },
  { value: 'medium', labelKey: 'compress.levelMedium', hintKey: 'compress.levelMediumHint' },
  { value: 'high', labelKey: 'compress.levelHigh', hintKey: 'compress.levelHighHint' },
];

export default function PdfCompressorPage() {
  const { t } = usePreferences();
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('medium');
  const [isChecking, setIsChecking] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!result) return;
    return () => URL.revokeObjectURL(result.url);
  }, [result]);

  function selectFile(selected: File | undefined) {
    if (!selected) return;
    setIsChecking(true);
    if (!isPdfFile(selected)) {
      setIsChecking(false);
      notify(t('compress.invalid'), 'error');
      return;
    }
    setFile(selected);
    setResult(null);
    setIsChecking(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  function clearFile() {
    setFile(null);
    setResult(null);
  }

  async function handleCompress() {
    if (!file) {
      notify(t('compress.needFile'), 'error');
      return;
    }
    setIsCompressing(true);
    try {
      const bytes = await compressPdf(file, level);
      const compressedSize = bytes.byteLength;
      if (compressedSize >= file.size) {
        notify(t('compress.increased'), 'info');
        setResult(null);
      } else {
        const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        setResult({ url: URL.createObjectURL(blob), originalSize: file.size, compressedSize });
        notify(t('compress.successTitle'), 'success');
      }
    } catch {
      notify(t('compress.failed'), 'error');
    } finally {
      setIsCompressing(false);
    }
  }

  const savedPercent = result
    ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
    : 0;

  return (
    <div>
      <PageHeader title={t('compress.title')} subtitle={t('compress.subtitle')} tool={TOOLS.compress} />

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
              disabled={isChecking || isCompressing}
              className="group flex w-full flex-col items-center gap-3 disabled:cursor-wait"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md transition group-hover:scale-105">
                {isChecking ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
              </span>
              <span className="text-lg font-semibold text-ink">
                {isChecking ? t('compress.checking') : t('compress.dropTitle')}
              </span>
              {!isChecking && <span className="text-sm text-muted">{t('compress.dropBrowse')}</span>}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={event => {
                selectFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </div>

          {file && (
            <section className={`${cardClass} p-5 sm:p-6`}>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-aqua">
                  <FileText size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-sm text-muted">
                    {t('compress.originalSize')}: {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  aria-label={t('compress.remove')}
                  className={`${btnIcon} hover:text-red-600 dark:hover:text-red-400`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-2">
          <section className={`${cardClass} space-y-5 p-6`}>
            <div>
              <span className={labelClass}>{t('compress.level')}</span>
              <div className="grid gap-2">
                {LEVELS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      level === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-line bg-field hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compression-level"
                      value={opt.value}
                      checked={level === opt.value}
                      onChange={() => setLevel(opt.value)}
                      className="mt-1 accent-primary"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">{t(opt.labelKey)}</span>
                      <span className="block text-xs text-muted">{t(opt.hintKey)}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompress}
              disabled={!file || isCompressing}
              className={`${btnPrimary} w-full`}
            >
              {isCompressing ? <Loader2 size={18} className="animate-spin" /> : <Shrink size={18} />}
              {isCompressing ? t('compress.compressing') : t('compress.compressButton')}
            </button>
            {!file && <p className="text-center text-sm text-muted">{t('compress.needFile')}</p>}
          </section>

          {result && (
            <section className={`${cardClass} animate-scale-in space-y-4 border-emerald-300 p-6 dark:border-emerald-700`}>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h2 className="font-semibold text-ink">{t('compress.successTitle')}</h2>
                  <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {t('compress.saved', { percent: String(savedPercent) })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-canvas p-3 text-center">
                  <p className="text-xs text-muted">{t('compress.originalLabel')}</p>
                  <p className="mt-1 text-sm font-bold text-ink">{formatBytes(result.originalSize)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3 text-center dark:bg-emerald-900/20">
                  <p className="text-xs text-muted">{t('compress.compressedLabel')}</p>
                  <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {formatBytes(result.compressedSize)}
                  </p>
                </div>
              </div>
              <a href={result.url} download="StudyKit-compressed.pdf" className={`${btnSecondary} w-full`}>
                <Download size={18} />
                {t('compress.download')}
              </a>
              <button
                type="button"
                onClick={clearFile}
                className="flex w-full items-center justify-center gap-1.5 text-sm text-muted hover:text-ink"
              >
                <X size={14} />
                {t('compress.startOver')}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
