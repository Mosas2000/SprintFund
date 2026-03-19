import { useCallback, useState } from 'react';
import type { TxCallbacks } from '../types/contract';
import {
  invalidateProposalCache,
  invalidateProposalPagesCache,
  invalidateProposalCountCache,
  invalidateStakeCache,
} from '../lib/stacks';

interface MutationOptions {
  onSuccess?: (txId: string) => void;
  onError?: (error: Error) => void;
}

export function useMutationWithCacheInvalidation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
            const cancelError = new Error('Transaction cancelled');
            setError(cancelError);
            setIsLoading(false);
            options?.onError?.(cancelError);
            reject(cancelError);
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
            const cancelError = new Error('Transaction cancelled');
            setError(cancelError);
            setIsLoading(false);
            options?.onError?.(cancelError);
            reject(cancelError);
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
            const cancelError = new Error('Transaction cancelled');
            setError(cancelError);
            setIsLoading(false);
            options?.onError?.(cancelError);
            reject(cancelError);
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
            const cancelError = new Error('Transaction cancelled');
            setError(cancelError);
            setIsLoading(false);
            options?.onError?.(cancelError);
            reject(cancelError);
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
