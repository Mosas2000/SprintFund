import { useEffect, useState, useCallback } from 'react';
import { governanceAnalytics } from '../services/governance-analytics';

// Internal Proposal type from governance analytics service
interface AnalyticsProposal {
  id: number;
  proposer: string;
  amount: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: number;
  category?: string;
}

interface ProposalStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  successRate: number;
  totalAmount: number;
  averageAmount: number;
}

interface CategoryStat {
  category: string;
  proposals: number;
  approved: number;
  rejected: number;
  totalFunded: number;
  successRate: number;
}

interface VoterStat {
  totalVoters: number;
  averageVotesPerVoter: number;
  totalVotes: number;
}

interface VotingPowerStat {
  topVoters: Array<{
    address: string;
    amount: number;
    percentage: number;
  }>;
  whaleConcentration: number;
  totalStake: number;
  uniqueStakers: number;
}

interface TimelineEntry {
  date: string;
  created: number;
  approved: number;
  rejected: number;
}

export function useGovernanceAnalytics() {
  const [proposals, setProposals] = useState<AnalyticsProposal[]>([]);
  const [proposalStats, setProposalStats] = useState<ProposalStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [voterStats, setVoterStats] = useState<VoterStat | null>(null);
  const [votingPower, setVotingPower] = useState<VotingPowerStat | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedProposals = await governanceAnalytics.fetchAllProposals();
      setProposals(fetchedProposals);

      const stats = governanceAnalytics.calculateProposalStats(fetchedProposals);
      setProposalStats(stats);

      const categories = governanceAnalytics.calculateCategoryStats(fetchedProposals);
      setCategoryStats(categories);

      const voters = governanceAnalytics.calculateVoterStats(fetchedProposals);
      setVoterStats(voters);

      const stakes = await governanceAnalytics.getAllUserStakes();
      const power = governanceAnalytics.calculateVotingPowerDistribution(stakes);
      setVotingPower(power);

      const timelineData = governanceAnalytics.generateProposalTimeline(fetchedProposals);
      setTimeline(timelineData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(errorMessage);
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return {
    proposals,
    proposalStats,
    categoryStats,
    voterStats,
    votingPower,
    timeline,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
