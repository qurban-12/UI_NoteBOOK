import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                variant === 'danger'
                  ? 'bg-red-50 text-[#EF4444]'
                  : 'bg-indigo-50 text-[#6366F1]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="confirm-dialog-title"
                className="font-display text-base font-semibold text-[#1E293B]"
              >
                {title}
              </h2>
              <p className="mt-1.5 text-sm text-[#64748B] leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              variant === 'danger'
                ? 'bg-[#EF4444] hover:bg-red-600'
                : 'bg-[#6366F1] hover:bg-indigo-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
