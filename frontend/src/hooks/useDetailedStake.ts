import { useState, useEffect } from 'react';
import { getStake, getAllProposals, getVote } from '../lib/stacks';
import type { DetailedStakeInfo, VoteCostInfo } from '../types/stake';

interface UseDetailedStakeOptions {
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

export function useDetailedStake(
  address: string | undefined,
  options: UseDetailedStakeOptions = {}
) {
  const [stakeInfo, setStakeInfo] = useState<DetailedStakeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setStakeInfo(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function fetchDetailedStake() {
      try {
        setLoading(true);
        setError(null);

        const totalStake = await getStake(address);
        
        const proposals = await getAllProposals();
        const voteCosts: VoteCostInfo[] = [];
        let totalLockedStake = 0;

        for (const proposal of proposals) {
          if (proposal.executed) continue;

          const vote = await getVote(proposal.id, address);
          if (vote) {
            const cost = vote.weight * vote.weight;
            voteCosts.push({
              proposalId: proposal.id,
              cost,
              weight: vote.weight,
            });
            totalLockedStake += cost;
          }
        }

        if (!mounted) return;

        const info: DetailedStakeInfo = {
          totalStake,
          lockedStake: totalLockedStake,
          availableStake: Math.max(0, totalStake - totalLockedStake),
          isLocked: totalLockedStake > 0,
          voteCosts,
          activeVotes: voteCosts.length,
        };

        setStakeInfo(info);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching detailed stake:', err);
        const error = err instanceof Error ? err : new Error('Failed to fetch stake information');
        setError(error.message);
        if (options.onError) {
          options.onError(error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchDetailedStake();

    return () => {
      mounted = false;
    };
  }, [address, options]);

  return { stakeInfo, loading, error };
}
