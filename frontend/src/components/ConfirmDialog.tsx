import { createPortal } from 'react-dom';
import { useEffect, useCallback, useState } from 'react';
import type { ConfirmDialogProps } from '../types/confirm-dialog';
import { VARIANT_CONFIG } from '../lib/dialog-variants';
import { DialogIcon } from './DialogIcon';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useScrollLock } from '../hooks/useScrollLock';

/**
 * A modal confirmation dialog rendered via React portal.
 *
 * When `open` is false the component renders nothing.
 * When `open` is true the dialog is portal-mounted to document.body
 * with a focus trap that cycles Tab/Shift+Tab between focusable elements
 * and a scroll lock that prevents the background page from scrolling.
 */
export function ConfirmDialog({ open, action, onClose }: ConfirmDialogProps) {
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  useScrollLock(open);

  /** Close on Escape key press */
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, handleEscape]);

  /** Drive enter animation: set visible to true on next frame after mount */
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      // Delay by one frame so the initial opacity-0/scale-95 is painted first
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [open]);

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
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
          className={`w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl transition-all duration-200 ${
            visible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-2'
          }`}
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
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              data-testid="confirm-dialog-cancel"
            >
              {action.cancelLabel ?? 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card ${config.confirmButton}`}
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
