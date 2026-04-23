/**
 * Utility functions for working with proposal data and calculations.
 */

import type { Proposal, ProposalWithStats } from '../types/proposal';
import { getBlockHeightDaysOld } from './block-height-utils';

/**
 * Calculates total votes for a proposal.
 */
export function calculateTotalVotes(proposal: Proposal): number {
  return proposal.votesFor + proposal.votesAgainst;
}

/**
 * Calculates percentage of votes for a proposal.
 */
export function calculateForPercentage(proposal: Proposal): number {
  const total = calculateTotalVotes(proposal);
  if (total === 0) return 0;
  return Math.round((proposal.votesFor / total) * 100);
}

/**
 * Calculates percentage of votes against a proposal.
 */
export function calculateAgainstPercentage(proposal: Proposal): number {
  const total = calculateTotalVotes(proposal);
  if (total === 0) return 0;
  return Math.round((proposal.votesAgainst / total) * 100);
}

/**
 * Determines if a proposal is currently active (not executed).
 */
export function isProposalActive(proposal: Proposal): boolean {
  return !proposal.executed;
}

/**
 * Calculates days since proposal creation using block height.
 */
export function calculateProposalAge(proposal: Proposal): number {
  return getBlockHeightDaysOld(proposal.createdAt) ?? 0;
}

/**
 * Converts Proposal to ProposalWithStats with all derived fields.
 */
export function enrichProposal(proposal: Proposal): ProposalWithStats {
  return {
    ...proposal,
    totalVotes: calculateTotalVotes(proposal),
    forPercentage: calculateForPercentage(proposal),
    againstPercentage: calculateAgainstPercentage(proposal),
    daysOld: calculateProposalAge(proposal),
    isActive: isProposalActive(proposal),
  };
}

/**
 * Filters proposals by status.
 */
export function filterProposalsByStatus(
  proposals: Proposal[],
  status: 'all' | 'active' | 'executed',
): Proposal[] {
  if (status === 'all') return proposals;
  if (status === 'active') return proposals.filter(isProposalActive);
  return proposals.filter((p) => !isProposalActive(p));
}

/**
 * Sorts proposals by various criteria.
 */
export function sortProposals(
  proposals: Proposal[],
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'most-votes' | 'ending-soon' = 'newest',
): Proposal[] {
  const sorted = [...proposals];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt - b.createdAt);
    case 'highest':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'lowest':
      return sorted.sort((a, b) => a.amount - b.amount);
    case 'most-votes':
      return sorted.sort((a, b) => calculateTotalVotes(b) - calculateTotalVotes(a));
    case 'ending-soon':
      return sorted.sort((a, b) => {
        if (a.executed !== b.executed) return a.executed ? 1 : -1;
        return a.votingEndsAt - b.votingEndsAt;
      });
    default:
      return sorted;
  }
}

/**
 * Finds a proposal by ID in an array.
 */
export function findProposal(proposals: Proposal[], id: number): Proposal | undefined {
  return proposals.find((p) => p.id === id);
}

/**
 * Checks if a proposal would pass based on vote counts.
 */
export function wouldProposalPass(proposal: Proposal): boolean {
  if (proposal.votesFor === 0 && proposal.votesAgainst === 0) return false;
  return proposal.votesFor > proposal.votesAgainst;
}

/**
 * Paginates an array of proposals.
 */
export function paginateProposals<T>(
  items: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
}

/**
 * Calculates blocks remaining until voting ends.
 */
export function getBlocksUntilVotingEnds(proposal: Proposal, currentBlockHeight: number): number {
  return Math.max(0, proposal.votingEndsAt - currentBlockHeight);
}

/**
 * Calculates blocks remaining until execution is allowed.
 */
export function getBlocksUntilExecutionAllowed(proposal: Proposal, currentBlockHeight: number): number {
  return Math.max(0, proposal.executionAllowedAt - currentBlockHeight);
}

/**
 * Formats a block difference as a human-readable estimated time string.
 * Uses 10 minutes per block as a standard Stacks block time estimate.
 */
export function formatBlockDuration(blocks: number): string {
  if (blocks <= 0) return '0m';
  
  const totalMinutes = blocks * 10;
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  if (totalHours < 24) {
    return remainingMinutes > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalHours}h`;
  }
  
  const totalDays = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  
  return remainingHours > 0 ? `${totalDays}d ${remainingHours}h` : `${totalDays}d`;
}

/**
 * Checks if a proposal is considered "high-value" based on the 100 STX threshold.
 * (100,000,000 microSTX)
 */
export function isHighValueProposal(proposal: Proposal): boolean {
  return proposal.amount >= 100_000_000;
}
