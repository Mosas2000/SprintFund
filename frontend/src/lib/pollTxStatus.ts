import { getTxStatus } from './api';
import { useToastStore } from '../store/toast';

/* ── Configuration ────────────────────────────── */

const POLL_INTERVAL_MS = 10_000; // 10 seconds between polls
const MAX_ATTEMPTS = 60;         // give up after ~10 minutes

/**
 * Poll the Hiro API for a transaction's status and update the
 * corresponding toast when the transaction reaches a terminal state.
 *
 * The function runs in the background (fire-and-forget). It resolves
 * once the transaction succeeds, fails, or the maximum number of
 * polling attempts is reached.
 *
 * @param toastId  The id of the toast to update in the store.
 * @param txId     The on-chain transaction id to poll.
 */
export function pollTxStatus(toastId: string, txId: string): void {
  let attempts = 0;

  const poll = async () => {
    attempts += 1;

    try {
      const status = await getTxStatus(txId);

      if (status === 'success') {
        useToastStore.getState().updateTxStatus(toastId, 'success');
        useToastStore.getState().updateToast(toastId, {
          title: 'Transaction confirmed',
          duration: 6000,
        });
        return; // stop polling
      }

      if (status.includes('abort') || status === 'failed') {
        useToastStore.getState().updateTxStatus(toastId, 'failed');
        useToastStore.getState().updateToast(toastId, {
          title: 'Transaction failed',
          duration: 8000,
        });
        return; // stop polling
      }
    } catch {
      // Network errors are silently ignored; we will retry.
    }

    if (attempts < MAX_ATTEMPTS) {
      setTimeout(poll, POLL_INTERVAL_MS);
    } else {
      // Give up after max attempts -- mark as failed so the user knows.
      useToastStore.getState().updateTxStatus(toastId, 'failed');
      useToastStore.getState().updateToast(toastId, {
        title: 'Transaction status unknown',
        description: 'Polling timed out. Check the explorer for the latest status.',
        duration: 10000,
      });
    }
  };

  // Start the first poll after a short delay to let the mempool index the tx.
  setTimeout(poll, POLL_INTERVAL_MS);
}
