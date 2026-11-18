import Modal from './Modal';
import { usePreferences } from '@/hooks/usePreferences';
import { btnDanger, btnSecondary } from '@/lib/styles';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = usePreferences();

  return (
    <Modal open={open} title={t('common.confirmDeleteTitle')} onClose={onCancel} widthClass="sm:max-w-md">
      <p className="leading-relaxed text-muted">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={btnSecondary}>
          {t('common.cancel')}
        </button>
        <button type="button" onClick={onConfirm} className={btnDanger}>
          {t('common.delete')}
        </button>
      </div>
    </Modal>
  );
}
