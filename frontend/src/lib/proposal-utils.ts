/**
 * Utility functions for working with proposal data and calculations.
 */

import type { Proposal, ProposalWithStats } from '../types/proposal';

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
 * Calculates days since proposal creation.
 */
export function calculateProposalAge(proposal: Proposal, now: number = Date.now()): number {
  const ageMs = now - proposal.createdAt * 1000;
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
}

/**
 * Converts Proposal to ProposalWithStats with all derived fields.
 */
export function enrichProposal(proposal: Proposal, now?: number): ProposalWithStats {
  return {
    ...proposal,
    totalVotes: calculateTotalVotes(proposal),
    forPercentage: calculateForPercentage(proposal),
    againstPercentage: calculateAgainstPercentage(proposal),
    daysOld: calculateProposalAge(proposal, now),
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
        return a.createdAt - b.createdAt;
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
