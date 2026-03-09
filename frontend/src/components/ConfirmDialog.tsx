import { createPortal } from 'react-dom';
import type { ConfirmDialogProps } from '../types/confirm-dialog';
import { VARIANT_CONFIG } from '../lib/dialog-variants';
import { DialogIcon } from './DialogIcon';
import { useFocusTrap } from '../hooks/useFocusTrap';

/**
 * A modal confirmation dialog rendered via React portal.
 *
 * When `open` is false the component renders nothing.
 * When `open` is true the dialog is portal-mounted to document.body
 * with a focus trap that cycles Tab/Shift+Tab between focusable elements.
 */
export function ConfirmDialog({ open, action, onClose }: ConfirmDialogProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  if (!open || !action) return null;

  const config = VARIANT_CONFIG[action.variant];

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    action.onConfirm();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Centering container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
        data-testid="confirm-dialog-overlay"
      >
        {/* Dialog panel */}
        <div
          ref={trapRef}
          className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
          data-testid="confirm-dialog-panel"
        >
          {/* Icon */}
          <DialogIcon variant={action.variant} />

          {/* Title */}
          <h2
            className="mt-4 text-center text-lg font-semibold text-text"
            id="confirm-dialog-title"
          >
            {action.title}
          </h2>

          {/* Description */}
          <p
            className="mt-2 text-center text-sm text-muted"
            id="confirm-dialog-description"
          >
            {action.description}
          </p>

          {/* Detail items */}
          {action.details && action.details.length > 0 && (
            <div className="mt-4 space-y-2 rounded-lg bg-surface p-3">
              {action.details.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted">{item.label}</span>
                  <span className="font-medium text-text">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface active:scale-[0.98]"
              data-testid="confirm-dialog-cancel"
            >
              {action.cancelLabel ?? 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${config.confirmButton}`}
              data-testid="confirm-dialog-confirm"
            >
              {action.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
