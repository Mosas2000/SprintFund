import type { Proposal } from '../types/proposal';
import { getProposalStatus, type ProposalStatus } from './proposal-status';

export function filterProposalsByStatus(
  proposals: Proposal[],
  statusFilter: ProposalStatus | 'all',
  currentBlockHeight: number
): Proposal[] {
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

export function filterProposalsByCategory(
  proposals: Proposal[],
  category: string
): Proposal[] {
  if (category === 'all') {
    return proposals;
  }

  return proposals.filter((proposal) => proposal.category === category);
}

export function searchProposals(
  proposals: Proposal[],
  searchQuery: string
): Proposal[] {
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
