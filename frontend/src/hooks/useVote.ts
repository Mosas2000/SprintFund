import { useState, useEffect, useCallback } from 'react';
import { getVote } from '@/lib/stacks';
import type { VoteRecord } from '@/types';

/**
 * Custom hook to fetch and track a specific user's voting record for a proposal.
 * This is essential for managing the lifecycle of quadratic voting costs and 
 * verifying reclaim eligibility once a voting period has expired.
 * 
 * @param proposalId The unique identifier of the proposal
 * @param voterAddress The Stacks address of the voter (optional)
 * @returns Object containing the vote record, loading state, error, and refresh function
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
