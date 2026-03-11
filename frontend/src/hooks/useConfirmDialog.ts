import { useState, useCallback, useMemo } from 'react';
import type { ConfirmDialogAction } from '../types/confirm-dialog';

/**
 * Return type of useConfirmDialog.
 */
export interface UseConfirmDialogReturn {
  /** Whether the dialog is currently open */
  isOpen: boolean;
  /** The action pending confirmation, or null if closed */
  pendingAction: ConfirmDialogAction | null;
  /** Open the dialog with the given action */
  open: (action: ConfirmDialogAction) => void;
  /** Close the dialog without confirming */
  close: () => void;
  /** Execute the pending action's onConfirm callback and close the dialog */
  confirm: () => void;
}

/**
 * Manages the open/close lifecycle and pending action state for a
 * confirmation dialog.
 *
 * Usage:
 * ```tsx
 * const dialog = useConfirmDialog();
 *
 * // Trigger:
 * dialog.open({ title: 'Stake 50 STX', ... , onConfirm: handleStake });
 *
 * // Render:
 * <ConfirmDialog open={dialog.isOpen} action={dialog.pendingAction} onClose={dialog.close} />
 * ```
 */
export function useConfirmDialog(): UseConfirmDialogReturn {
  const [pendingAction, setPendingAction] = useState<ConfirmDialogAction | null>(null);

  const open = useCallback((action: ConfirmDialogAction) => {
    setPendingAction(action);
  }, []);

  const close = useCallback(() => {
    setPendingAction(null);
  }, []);

  const confirm = useCallback(() => {
    if (pendingAction) {
      pendingAction.onConfirm();
      setPendingAction(null);
    }
  }, [pendingAction]);

  return useMemo(() => ({
    isOpen: pendingAction !== null,
    pendingAction,
    open,
    close,
    confirm,
  }), [pendingAction, open, close, confirm]);
}
