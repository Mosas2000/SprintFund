import { useState, useEffect, useCallback } from 'react';
import { getVote } from '@/lib/stacks';
import type { VoteRecord } from '@/types';

/**
 * Hook to fetch and track a user's vote on a specific proposal.
 * Useful for checking eligibility for reclaim operations.
 * 
 * @param proposalId The ID of the proposal to check
 * @param voterAddress The Stacks address of the voter
 */
export function useVote(proposalId: number, voterAddress?: string) {
  const [vote, setVote] = useState<VoteRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVote = useCallback(async () => {
    if (!voterAddress) {
      setVote(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getVote(proposalId, voterAddress);
      setVote(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch vote'));
    } finally {
      setLoading(false);
    }
  }, [proposalId, voterAddress]);

  useEffect(() => {
    fetchVote();
  }, [fetchVote]);

  return { vote, loading, error, refresh: fetchVote };
}
