import type { Proposal } from '../types/proposal';
import { getProposalStatus, type ProposalStatus } from './proposal-status';

/**
 * Filters proposals by their current status
 * @param proposals - Array of proposals to filter
 * @param statusFilter - Status to filter by or 'all' for no filtering
 * @param currentBlockHeight - Current blockchain height for status calculation
 * @returns Filtered array of proposals
 */
export function filterProposalsByStatus(
  proposals: Proposal[],
  statusFilter: ProposalStatus | 'all',
  currentBlockHeight: number
): Proposal[] {
  if (!proposals || proposals.length === 0) {
    return [];
  }

  if (statusFilter === 'all') {
    return proposals;
  }

  return proposals.filter((proposal) => {
    const statusInfo = getProposalStatus(proposal, currentBlockHeight);
    
    if (statusFilter === 'active') {
      return ['active', 'passing', 'failing'].includes(statusInfo.status);
    }
    
    return statusInfo.status === statusFilter;
  });
}

/**
 * Filters proposals by category
 * @param proposals - Array of proposals to filter
 * @param category - Category to filter by or 'all' for no filtering
 * @returns Filtered array of proposals
 */
export function filterProposalsByCategory(
  proposals: Proposal[],
  category: string
): Proposal[] {
  if (!proposals || proposals.length === 0) {
    return [];
  }

  if (category === 'all') {
    return proposals;
  }

  return proposals.filter((proposal) => proposal.category === category);
}

/**
 * Searches proposals by title and description
 * @param proposals - Array of proposals to search
 * @param searchQuery - Search query string
 * @returns Filtered array of proposals matching the search query
 */
export function searchProposals(
  proposals: Proposal[],
  searchQuery: string
): Proposal[] {
  if (!proposals || proposals.length === 0) {
    return [];
  }

  if (!searchQuery.trim()) {
    return proposals;
  }

  const query = searchQuery.toLowerCase();
  return proposals.filter(
    (proposal) =>
      proposal.title.toLowerCase().includes(query) ||
      proposal.description.toLowerCase().includes(query)
  );
}
