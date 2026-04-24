import { useCallback, useState } from 'react';
import type { TxCallbacks } from '../types/contract';
import { normalizeError } from '../lib/error-normalizer';
import type { NormalizedError } from '../lib/error-normalizer';
import {
  invalidateProposalCache,
  invalidateProposalPagesCache,
  invalidateProposalCountCache,
  invalidateStakeCache,
} from '../lib/stacks';

interface MutationOptions {
  onSuccess?: (txId: string) => void;
  onError?: (error: NormalizedError) => void;
}

export function useMutationWithCacheInvalidation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<NormalizedError | null>(null);

  const createProposal = useCallback(
    async (
      callFn: (cb: TxCallbacks) => Promise<void>,
      options?: MutationOptions,
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setError(null);

        callFn({
          onFinish: (txId: string) => {
            invalidateProposalPagesCache();
            invalidateProposalCountCache();
            setIsLoading(false);
            options?.onSuccess?.(txId);
            resolve(txId);
          },
          onCancel: () => {
            const normalized = normalizeError(new Error('Transaction cancelled'));
            setError(normalized);
            setIsLoading(false);
            options?.onError?.(normalized);
            reject(normalized);
          },
        });
      });
    },
    [],
  );

  const vote = useCallback(
    async (
      proposalId: number,
      callFn: (cb: TxCallbacks) => Promise<void>,
      options?: MutationOptions,
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setError(null);

        callFn({
          onFinish: (txId: string) => {
            invalidateProposalCache(proposalId);
            invalidateProposalPagesCache();
            setIsLoading(false);
            options?.onSuccess?.(txId);
            resolve(txId);
          },
          onCancel: () => {
            const normalized = normalizeError(new Error('Transaction cancelled'));
            setError(normalized);
            setIsLoading(false);
            options?.onError?.(normalized);
            reject(normalized);
          },
        });
      });
    },
    [],
  );

  const executeProposal = useCallback(
    async (
      proposalId: number,
      callFn: (cb: TxCallbacks) => Promise<void>,
      options?: MutationOptions,
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setError(null);

        callFn({
          onFinish: (txId: string) => {
            invalidateProposalCache(proposalId);
            invalidateProposalPagesCache();
            setIsLoading(false);
            options?.onSuccess?.(txId);
            resolve(txId);
          },
          onCancel: () => {
            const normalized = normalizeError(new Error('Transaction cancelled'));
            setError(normalized);
            setIsLoading(false);
            options?.onError?.(normalized);
            reject(normalized);
          },
        });
      });
    },
    [],
  );

  const updateStake = useCallback(
    async (
      address: string,
      callFn: (cb: TxCallbacks) => Promise<void>,
      options?: MutationOptions,
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setError(null);

        callFn({
          onFinish: (txId: string) => {
            invalidateStakeCache(address);
            setIsLoading(false);
            options?.onSuccess?.(txId);
            resolve(txId);
          },
          onCancel: () => {
            const normalized = normalizeError(new Error('Transaction cancelled'));
            setError(normalized);
            setIsLoading(false);
            options?.onError?.(normalized);
            reject(normalized);
          },
        });
      });
    },
    [],
  );

  return {
    isLoading,
    error,
    createProposal,
    vote,
    executeProposal,
    updateStake,
  };
}
