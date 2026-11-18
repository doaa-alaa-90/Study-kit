import { useEffect, useRef, useState, type DragEvent } from 'react';
import { CheckCircle2, Copy, Eraser, Loader2, ScanText, Trash2, Upload, X } from 'lucide-react';
import type { TranslationKey } from '@/i18n';
import PageHeader from '@/components/ui/PageHeader';
import { TOOLS } from '@/lib/tools';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/useToast';
import { btnIcon, btnPrimary, btnSecondary, cardClass } from '@/lib/styles';
import { extractText, isImageFile, type OcrLanguage } from '@/features/ocr/extractText';

const LANGUAGES: { value: OcrLanguage; labelKey: TranslationKey }[] = [
  { value: 'ara', labelKey: 'ocr.langAr' },
  { value: 'eng', labelKey: 'ocr.langEn' },
  { value: 'ara+eng', labelKey: 'ocr.langBoth' },
];

export default function ImageToTextPage() {
  const { t, lang } = usePreferences();
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<OcrLanguage>(lang === 'ar' ? 'ara' : 'eng');
  const [isChecking, setIsChecking] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [hasResult, setHasResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function selectFile(selected: File | undefined) {
    if (!selected) return;
    setIsChecking(true);
    if (!isImageFile(selected)) {
      setIsChecking(false);
      notify(t('ocr.invalid'), 'error');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setExtractedText('');
    setHasResult(false);
    setIsChecking(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files[0]);
  }

  function clearAll() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setHasResult(false);
    setProgress(0);
  }

  async function handleExtract() {
    if (!file) {
      notify(t('ocr.needImage'), 'error');
      return;
    }
    setIsExtracting(true);
    setProgress(0);
    setProgressStatus('loading');
    setExtractedText('');
    setHasResult(false);
    try {
      const text = await extractText(file, language, p => {
        setProgress(Math.round(p.progress * 100));
        setProgressStatus(p.status);
      });
      setExtractedText(text || '');
      setHasResult(true);
      if (!text) {
        notify(t('ocr.failed'), 'info');
      }
    } catch {
      notify(t('ocr.failed'), 'error');
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleCopy() {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      notify(t('ocr.copied'), 'success');
    } catch {
      notify(t('ocr.copyFailed'), 'error');
    }
  }

  const isLoadingEngine = isExtracting && progressStatus === 'loading';

  return (
    <div>
      <PageHeader title={t('ocr.title')} subtitle={t('ocr.subtitle')} tool={TOOLS.ocr} />

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
              disabled={isChecking || isExtracting}
              className="group flex w-full flex-col items-center gap-3 disabled:cursor-wait"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md transition group-hover:scale-105">
                {isChecking ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
              </span>
              <span className="text-lg font-semibold text-ink">
                {isChecking ? t('ocr.checking') : t('ocr.dropTitle')}
              </span>
              {!isChecking && <span className="text-sm text-muted">{t('ocr.dropBrowse')}</span>}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
              className="hidden"
              onChange={event => {
                selectFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </div>

          {previewUrl && file && (
            <section className={`${cardClass} p-5 sm:p-6`}>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="font-semibold text-ink">{t('ocr.imageLabel')}</h2>
                <button
                  type="button"
                  onClick={clearAll}
                  aria-label={t('ocr.remove')}
                  className={`${btnIcon} hover:text-red-600 dark:hover:text-red-400`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-line bg-canvas">
                <img
                  src={previewUrl}
                  alt={file.name}
                  decoding="async"
                  className="mx-auto max-h-80 w-full object-contain"
                />
              </div>
            </section>
          )}

          {hasResult && (
            <section className={`${cardClass} p-5 sm:p-6`}>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="font-semibold text-ink">{t('ocr.resultLabel')}</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!extractedText}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium text-ink transition hover:bg-canvas disabled:opacity-40"
                  >
                    <Copy size={16} />
                    {t('ocr.copy')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExtractedText('')}
                    disabled={!extractedText}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium text-ink transition hover:bg-canvas disabled:opacity-40"
                  >
                    <Eraser size={16} />
                    {t('ocr.clear')}
                  </button>
                </div>
              </div>
              <textarea
                value={extractedText}
                onChange={event => setExtractedText(event.target.value)}
                placeholder={t('ocr.resultPlaceholder')}
                dir="auto"
                rows={10}
                className="w-full rounded-xl border border-line bg-field px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-muted transition focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
              />
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:col-span-2">
          <section className={`${cardClass} space-y-5 p-6`}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-aqua">
                <ScanText size={20} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{t('ocr.language')}</p>
              </div>
            </div>

            <div className="grid gap-2">
              {LANGUAGES.map(opt => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    language === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-line bg-field hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="ocr-language"
                    value={opt.value}
                    checked={language === opt.value}
                    onChange={() => setLanguage(opt.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm font-semibold text-ink">{t(opt.labelKey)}</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExtract}
              disabled={!file || isExtracting}
              className={`${btnPrimary} w-full`}
            >
              {isExtracting ? <Loader2 size={18} className="animate-spin" /> : <ScanText size={18} />}
              {isExtracting ? t('ocr.extracting') : t('ocr.extractButton')}
            </button>
            {!file && <p className="text-center text-sm text-muted">{t('ocr.needImage')}</p>}
          </section>

          {isExtracting && (
            <section className={`${cardClass} animate-scale-in space-y-4 p-6`}>
              {isLoadingEngine ? (
                <div className="flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-primary dark:text-aqua" />
                  <span className="text-sm text-muted">{t('ocr.loadingEngine')}</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{t('ocr.extracting')}</span>
                    <span className="tabular-nums text-muted">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canvas">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </section>
          )}

          {hasResult && (
            <section className={`${cardClass} animate-scale-in space-y-3 border-emerald-300 p-6 dark:border-emerald-700`}>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm text-muted">{t('ocr.hint')}</p>
              </div>
              <button
                type="button"
                onClick={clearAll}
                className={`${btnSecondary} w-full`}
              >
                <X size={16} />
                {t('ocr.startOver')}
              </button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
