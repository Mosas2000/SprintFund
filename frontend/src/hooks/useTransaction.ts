/**
 * Loading state integration for transaction operations.
 */

import { useState, useCallback } from 'react';
import type { LoadingState } from '../lib/loading-state';
import { createLoadingState, updateLoadingState } from '../lib/loading-state';
import { useTransactionStore } from '../store/transactions';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';

interface UseTransactionOptions {
  onSuccess?: (txId: string) => void;
  onError?: (error: NormalizedError) => void;
  onFinal?: () => void;
  type?: TransactionType;
  proposalId?: number;
  amount?: number;
  title?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Hook for managing transaction loading state.
 */
export function useTransaction(options?: UseTransactionOptions) {
  const [loadingState, setLoadingState] = useState<LoadingState>(createLoadingState('idle'));
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<NormalizedError | null>(null);
  const { addTransaction } = useTransactionStore();

  const execute = useCallback(
    async (transaction: () => Promise<string>) => {
      try {
        setLoadingState(updateLoadingState(loadingState, 'loading'));
        setError(null);

        const id = await transaction();
        setTxId(id);
        setLoadingState(updateLoadingState(loadingState, 'success'));

        if (options?.type) {
          addTransaction({
            id,
            type: options.type,
            status: 'pending',
            timestamp: Date.now(),
            proposalId: options.proposalId,
            amount: options.amount,
            title: options.title,
            metadata: options.metadata,
          });
        }

        options?.onSuccess?.(id);

        return id;
      } catch (err) {
        const normalized = normalizeError(err);
        setError(normalized);
        setLoadingState(updateLoadingState(loadingState, 'error'));
        options?.onError?.(normalized);
        throw err;
      } finally {
        options?.onFinal?.();
      }
    },
    [loadingState, options, addTransaction],
  );

  const reset = useCallback(() => {
    setLoadingState(createLoadingState('idle'));
    setTxId(null);
    setError(null);
  }, []);

  return {
    ...loadingState,
    txId,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for managing multiple transaction operations.
 */
export function useTransactionBatch() {
  const [states, setStates] = useState<Record<string, LoadingState>>({});
  const [errors, setErrors] = useState<Record<string, Error | null>>({});
  const [txIds, setTxIds] = useState<Record<string, string | null>>({});

  const execute = useCallback(
    async (key: string, transaction: () => Promise<string>) => {
      try {
        setStates((prev) => ({
          ...prev,
          [key]: updateLoadingState(prev[key] || createLoadingState(), 'loading'),
        }));
        setErrors((prev) => ({ ...prev, [key]: null }));

        const id = await transaction();
        setTxIds((prev) => ({ ...prev, [key]: id }));
        setStates((prev) => ({
          ...prev,
          [key]: updateLoadingState(prev[key] || createLoadingState(), 'success'),
        }));

        return id;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setErrors((prev) => ({ ...prev, [key]: error }));
        setStates((prev) => ({
          ...prev,
          [key]: updateLoadingState(prev[key] || createLoadingState(), 'error'),
        }));
        throw error;
      }
    },
    [],
  );

  const reset = useCallback((key: string) => {
    setStates((prev) => ({ ...prev, [key]: createLoadingState('idle') }));
    setErrors((prev) => ({ ...prev, [key]: null }));
    setTxIds((prev) => ({ ...prev, [key]: null }));
  }, []);

  return { states, errors, txIds, execute, reset };
}
