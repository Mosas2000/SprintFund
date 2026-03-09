import { createPortal } from 'react-dom';
import type { ConfirmDialogProps } from '../types/confirm-dialog';

/**
 * A modal confirmation dialog rendered via React portal.
 *
 * When `open` is false the component renders nothing.
 * When `open` is true the dialog is portal-mounted to document.body.
 */
export function ConfirmDialog({ open, action, onClose }: ConfirmDialogProps) {
  if (!open || !action) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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
        {/* Dialog panel placeholder */}
        <div data-testid="confirm-dialog-root" />
      </div>
    </div>,
    document.body,
  );
}
