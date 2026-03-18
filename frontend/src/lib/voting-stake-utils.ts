/**
 * Utility functions for voting and stake operations.
 */

import type { Proposal, StakeInfo, VoteRecord, VotingStats } from '../types';

/**
 * Calculates voting power based on stake amount.
 */
export function calculateVotingPower(stakeAmount: number): number {
  if (stakeAmount <= 0) return 0;
  return Math.floor(Math.sqrt(stakeAmount));
}

/**
 * Determines if a user can vote on a proposal.
 */
export function canUserVote(proposal: Proposal, userStake: number): boolean {
  return !proposal.executed && userStake > 0;
}

/**
 * Calculates quorum percentage from votes.
 */
export function calculateQuorumPercentage(votesFor: number, totalStaked: number): number {
  if (totalStaked === 0) return 0;
  return Math.round((votesFor / totalStaked) * 100);
}

/**
 * Determines if quorum is reached.
 */
export function isQuorumReached(votesFor: number, totalStaked: number, threshold: number): boolean {
  return calculateQuorumPercentage(votesFor, totalStaked) >= threshold;
}

/**
 * Calculates total staked across multiple users.
 */
export function calculateTotalStaked(stakes: StakeInfo[]): number {
  return stakes.reduce((total, stake) => total + stake.amount, 0);
}

/**
 * Calculates weighted vote strength.
 */
export function calculateWeightedVote(support: boolean, weight: number): number {
  return support ? weight : -weight;
}

/**
 * Aggregates voting statistics from vote records.
 */
export function aggregateVotingStats(votes: VoteRecord[]): VotingStats {
  const totalVoters = new Set(votes.map((v) => v.voter)).size;

  const totalVotesFor = votes.filter((v) => v.support).reduce((sum, v) => sum + v.weight, 0);
  const totalVotesAgainst = votes
    .filter((v) => !v.support)
    .reduce((sum, v) => sum + v.weight, 0);

  const totalVotes = totalVotesFor + totalVotesAgainst;
  const participationRate = totalVotes > 0 ? 100 : 0;

  return {
    totalVoters,
    totalVotesFor,
    totalVotesAgainst,
    participationRate,
  };
}

/**
 * Checks if a user has already voted on a proposal.
 */
export function hasUserVoted(votes: VoteRecord[], voter: string, proposalId: number): boolean {
  return votes.some((v) => v.voter === voter && v.proposalId === proposalId);
}

/**
 * Finds user's vote on a specific proposal.
 */
export function findUserVote(
  votes: VoteRecord[],
  voter: string,
  proposalId: number,
): VoteRecord | undefined {
  return votes.find((v) => v.voter === voter && v.proposalId === proposalId);
}

/**
 * Calculates expected minimum stake needed to have voting power of X.
 */
export function calculateStakeForVotingPower(desiredPower: number): number {
  if (desiredPower <= 0) return 0;
  return Math.ceil(desiredPower ** 2);
}

/**
 * Formats STX amount for display with proper unit.
 */
export function formatStxAmount(microStx: number): string {
  const stx = microStx / 1_000_000;

  if (stx >= 1_000_000) {
    return `${(stx / 1_000_000).toFixed(2)}M STX`;
  }
  if (stx >= 1_000) {
    return `${(stx / 1_000).toFixed(2)}K STX`;
  }

  return `${stx.toFixed(2)} STX`;
}

/**
 * Validates a vote weight is within reasonable bounds.
 */
export function isValidVoteWeight(weight: number): boolean {
  return weight > 0 && weight <= Number.MAX_SAFE_INTEGER;
}

/**
 * Calculates vote margin of victory/defeat.
 */
export function calculateVoteMargin(votesFor: number, votesAgainst: number): number {
  return votesFor - votesAgainst;
}
