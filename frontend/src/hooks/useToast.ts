import { useCallback, useMemo } from 'react';
import { useToastStore } from '../store/toast';
import type { ToastVariant, TxStatus } from '../types';

/**
 * Convenience hook that wraps the toast store with ergonomic helper methods.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Stake submitted');
 *   toast.error('Transaction failed', 'Insufficient balance');
 *   const id = toast.tx('Staking 10 STX...', txId);
 *   toast.updateTxStatus(id, 'success');
 */
export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  const removeToast = useToastStore((s) => s.removeToast);
  const clearAll = useToastStore((s) => s.clearAll);
  const updateTxStatus = useToastStore((s) => s.updateTxStatus);

  const show = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      return addToast({ variant, title, description });
    },
    [addToast],
  );

  const success = useCallback(
    (title: string, description?: string) => show('success', title, description),
    [show],
  );

  const error = useCallback(
    (title: string, description?: string) => show('error', title, description),
    [show],
  );

  const warning = useCallback(
    (title: string, description?: string) => show('warning', title, description),
    [show],
  );

  const info = useCallback(
    (title: string, description?: string) => show('info', title, description),
    [show],
  );

  const tx = useCallback(
    (title: string, txId: string, description?: string) => {
      return addToast({
        variant: 'tx',
        title,
        description,
        txId,
        txStatus: 'pending',
        duration: 0,
      });
    },
    [addToast],
  );

  const dismiss = useCallback(
    (id: string) => removeToast(id),
    [removeToast],
  );

  const updateStatus = useCallback(
    (id: string, status: TxStatus) => updateTxStatus(id, status),
    [updateTxStatus],
  );

  return useMemo(() => ({
    show,
    success,
    error,
    warning,
    info,
    tx,
    dismiss,
    dismissAll: clearAll,
    updateTxStatus: updateStatus,
  }), [show, success, error, warning, info, tx, dismiss, clearAll, updateStatus]);
}
