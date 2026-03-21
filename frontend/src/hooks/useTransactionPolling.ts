import { useEffect, useCallback, useRef } from 'react';
import { useTransactionStore } from '../store/transactions';
import { stacksApi } from '../services/stacks-api';
import type { Transaction } from '../types/transaction';

const POLL_INTERVAL = 15000;
const MAX_POLL_TIME = 30 * 60 * 1000;

export function useTransactionPolling() {
  const { getPendingTransactions, updateTransaction } = useTransactionStore();
  const pollTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const startTimesRef = useRef<Record<string, number>>({});

  const pollTransaction = useCallback(
    async (tx: Transaction) => {
      const startTime = startTimesRef.current[tx.id] || Date.now();
      
      if (Date.now() - startTime > MAX_POLL_TIME) {
        updateTransaction(tx.id, {
          status: 'dropped',
          error: 'Transaction timed out',
        });
        return;
      }

      try {
        const result = await stacksApi.getTransactionStatus(tx.id);

        if (result.status !== tx.status) {
          updateTransaction(tx.id, {
            status: result.status,
            blockHeight: result.blockHeight,
            confirmations: result.confirmations,
            error: result.error,
          });

          if (result.status === 'confirmed' || result.status === 'failed' || result.status === 'dropped') {
            if (pollTimeoutsRef.current[tx.id]) {
              clearTimeout(pollTimeoutsRef.current[tx.id]);
              delete pollTimeoutsRef.current[tx.id];
              delete startTimesRef.current[tx.id];
            }
          }
        } else if (result.confirmations !== undefined) {
          updateTransaction(tx.id, {
            confirmations: result.confirmations,
          });
        }
      } catch (error) {
        console.error(`Failed to poll transaction ${tx.id}:`, error);
      }
    },
    [updateTransaction],
  );

  const startPolling = useCallback(
    (tx: Transaction) => {
      if (pollTimeoutsRef.current[tx.id]) {
        return;
      }

      if (!startTimesRef.current[tx.id]) {
        startTimesRef.current[tx.id] = Date.now();
      }

      const poll = async () => {
        await pollTransaction(tx);
        
        if (pollTimeoutsRef.current[tx.id]) {
          pollTimeoutsRef.current[tx.id] = setTimeout(poll, POLL_INTERVAL);
        }
      };

      poll();
    },
    [pollTransaction],
  );

  const stopPolling = useCallback((txId: string) => {
    if (pollTimeoutsRef.current[txId]) {
      clearTimeout(pollTimeoutsRef.current[txId]);
      delete pollTimeoutsRef.current[txId];
      delete startTimesRef.current[txId];
    }
  }, []);

  useEffect(() => {
    const pendingTransactions = getPendingTransactions();
    
    pendingTransactions.forEach((tx) => {
      startPolling(tx);
    });

    return () => {
      Object.keys(pollTimeoutsRef.current).forEach((txId) => {
        stopPolling(txId);
      });
    };
  }, [getPendingTransactions, startPolling, stopPolling]);

  return {
    startPolling,
    stopPolling,
  };
}
