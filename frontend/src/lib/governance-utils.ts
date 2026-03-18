/**
 * Domain-specific type utilities for governance operations.
 */

import type { Proposal, ProposalPage, StakeInfo, VoteRecord, VotingStats } from '../types';

/**
 * Proposal filtering and search result.
 */
export interface ProposalSearchResult {
  proposals: Proposal[];
  totalMatches: number;
  query: string;
}

/**
 * Search proposals by title or description.
 */
export function searchProposals(
  proposals: Proposal[],
  query: string,
): ProposalSearchResult {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return {
      proposals,
      totalMatches: proposals.length,
      query,
    };
  }

  const matches = proposals.filter((p) =>
    p.title.toLowerCase().includes(normalizedQuery) ||
    p.description.toLowerCase().includes(normalizedQuery) ||
    p.proposer.toLowerCase().includes(normalizedQuery),
  );

  return {
    proposals: matches,
    totalMatches: matches.length,
    query,
  };
}

/**
 * Proposal statistics aggregator.
 */
export interface ProposalStats {
  totalProposals: number;
  activeCount: number;
  executedCount: number;
  totalFunded: number;
  averageVotes: number;
}

/**
 * Calculate governance statistics from proposals.
 */
export function calculateProposalStats(proposals: Proposal[]): ProposalStats {
  const activeCount = proposals.filter((p) => !p.executed).length;
  const executedCount = proposals.filter((p) => p.executed).length;
  const totalFunded = proposals.reduce((sum, p) => sum + p.amount, 0);
  const totalVotes = proposals.reduce((sum, p) => sum + p.votesFor + p.votesAgainst, 0);
  const averageVotes = proposals.length > 0 ? totalVotes / proposals.length : 0;

  return {
    totalProposals: proposals.length,
    activeCount,
    executedCount,
    totalFunded,
    averageVotes,
  };
}

/**
 * Voter profile aggregated from voting history.
 */
export interface VoterProfile {
  address: string;
  voteCount: number;
  avgVoteWeight: number;
  preferredSupport: 'for' | 'against' | 'neutral';
  participationRate: number;
  recentActivity: VoteRecord[];
}

/**
 * Build voter profile from voting history.
 */
export function buildVoterProfile(
  address: string,
  votes: VoteRecord[],
  recentLimit: number = 10,
): VoterProfile {
  const forVotes = votes.filter((v) => v.support);
  const againstVotes = votes.filter((v) => !v.support);

  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
  const avgWeight = votes.length > 0 ? totalWeight / votes.length : 0;

  let preferredSupport: 'for' | 'against' | 'neutral' = 'neutral';
  if (forVotes.length > againstVotes.length * 1.2) {
    preferredSupport = 'for';
  } else if (againstVotes.length > forVotes.length * 1.2) {
    preferredSupport = 'against';
  }

  return {
    address,
    voteCount: votes.length,
    avgVoteWeight: avgWeight,
    preferredSupport,
    participationRate: 0, // would need total proposals to calculate
    recentActivity: votes.slice(-recentLimit),
  };
}

/**
 * Calculate voting power distribution.
 */
export interface PowerDistribution {
  topVoters: Array<{ address: string; totalWeight: number }>;
  concentration: number; // 0-100, higher = more concentrated
}

/**
 * Analyze voting power distribution.
 */
export function analyzeVotingPowerDistribution(votes: VoteRecord[]): PowerDistribution {
  const voterWeights = new Map<string, number>();

  votes.forEach((v) => {
    voterWeights.set(v.voter, (voterWeights.get(v.voter) ?? 0) + v.weight);
  });

  const sortedVoters = Array.from(voterWeights.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([addr, weight]) => ({ address: addr, totalWeight: weight }));

  const totalWeight = Array.from(voterWeights.values()).reduce((a, b) => a + b, 0);
  const topWeight = sortedVoters.reduce((sum, v) => sum + v.totalWeight, 0);
  const concentration = totalWeight > 0 ? Math.round((topWeight / totalWeight) * 100) : 0;

  return {
    topVoters: sortedVoters,
    concentration,
  };
}
