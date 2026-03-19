import { useEffect, useCallback, useRef } from 'react';
import {
  invalidateProposalCache,
  invalidateProposalPagesCache,
  invalidateProposalCountCache,
  invalidateStakeCache,
  invalidateAllBlockchainCache,
} from '../lib/stacks';

interface UseBlockchainCacheOptions {
  revalidateOnFocus?: boolean;
  revalidateOnVisibilityChange?: boolean;
}

export function useBlockchainCacheInvalidation(
  options: UseBlockchainCacheOptions = {
    revalidateOnFocus: true,
    revalidateOnVisibilityChange: true,
  },
): {
  invalidateProposal: (id: number) => void;
  invalidateProposals: () => void;
  invalidateStake: (address: string) => void;
  invalidateAll: () => void;
} {
  const hasListenerRef = useRef(false);

  const invalidateProposal = useCallback((id: number) => {
    invalidateProposalCache(id);
  }, []);

  const invalidateProposals = useCallback(() => {
    invalidateProposalPagesCache();
    invalidateProposalCountCache();
  }, []);

  const invalidateStake = useCallback((address: string) => {
    invalidateStakeCache(address);
  }, []);

  const invalidateAll = useCallback(() => {
    invalidateAllBlockchainCache();
  }, []);

  useEffect(() => {
    if (hasListenerRef.current) return;
    hasListenerRef.current = true;

    if (options.revalidateOnFocus) {
      const handleFocus = () => {
        invalidateAll();
      };

      window.addEventListener('focus', handleFocus);
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [options.revalidateOnFocus, invalidateAll]);

  useEffect(() => {
    if (options.revalidateOnVisibilityChange) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          invalidateAll();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [options.revalidateOnVisibilityChange, invalidateAll]);

  return {
    invalidateProposal,
    invalidateProposals,
    invalidateStake,
    invalidateAll,
  };
}
