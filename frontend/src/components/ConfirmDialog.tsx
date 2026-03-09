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

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Content will be built up in subsequent commits */}
      <div data-testid="confirm-dialog-root" />
    </div>,
    document.body,
  );
}
