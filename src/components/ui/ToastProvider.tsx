import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastContext, type ToastTone } from '@/context/toast-context';
import { usePreferences } from '@/hooks/usePreferences';
import { btnIcon } from '@/lib/styles';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const TOAST_DURATION_MS = 3800;

const TONES: Record<ToastTone, { Icon: typeof Info; className: string }> = {
  success: { Icon: CheckCircle2, className: 'border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400' },
  error: { Icon: AlertCircle, className: 'border-red-300 text-red-600 dark:border-red-700 dark:text-red-400' },
  info: { Icon: Info, className: 'border-sky-300 text-primary dark:border-sky-700 dark:text-sky-300' },
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = usePreferences();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts(prev => [...prev, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:end-6 sm:items-end"
      >
        {toasts.map(toast => {
          const { Icon, className } = TONES[toast.tone];
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex w-full max-w-sm animate-scale-in items-start gap-3 rounded-xl border bg-card p-4 shadow-xl ${className}`}
            >
              <Icon size={20} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm font-medium text-ink">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={t('common.dismiss')}
                className={`${btnIcon} h-7 w-7`}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
