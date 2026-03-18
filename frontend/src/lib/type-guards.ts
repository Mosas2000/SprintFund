/**
 * Guards and predicates for type-safe operations.
 */

import type {
  Proposal,
  ProposalPage,
  StakeInfo,
  VoteRecord,
  RawProposal,
  Notification,
} from '../types';

/**
 * Predicate: is this a valid Proposal?
 */
export function isValidProposal(proposal: any): proposal is Proposal {
  return (
    proposal &&
    typeof proposal === 'object' &&
    typeof proposal.id === 'number' &&
    proposal.id > 0 &&
    typeof proposal.proposer === 'string' &&
    proposal.proposer.length > 0 &&
    typeof proposal.amount === 'number' &&
    proposal.amount >= 0 &&
    typeof proposal.title === 'string' &&
    proposal.title.length > 0 &&
    typeof proposal.description === 'string' &&
    typeof proposal.votesFor === 'number' &&
    proposal.votesFor >= 0 &&
    typeof proposal.votesAgainst === 'number' &&
    proposal.votesAgainst >= 0 &&
    typeof proposal.executed === 'boolean' &&
    typeof proposal.createdAt === 'number' &&
    proposal.createdAt > 0
  );
}

/**
 * Predicate: is this a valid ProposalPage?
 */
export function isValidProposalPage(page: any): page is ProposalPage {
  return (
    page &&
    typeof page === 'object' &&
    Array.isArray(page.proposals) &&
    page.proposals.every(isValidProposal) &&
    typeof page.totalCount === 'number' &&
    page.totalCount >= 0 &&
    typeof page.page === 'number' &&
    page.page >= 1 &&
    typeof page.pageSize === 'number' &&
    page.pageSize >= 1 &&
    typeof page.totalPages === 'number' &&
    page.totalPages >= 1
  );
}

/**
 * Predicate: is this a valid StakeInfo?
 */
export function isValidStakeInfo(stake: any): stake is StakeInfo {
  return (
    stake &&
    typeof stake === 'object' &&
    typeof stake.address === 'string' &&
    stake.address.length > 0 &&
    typeof stake.amount === 'number' &&
    stake.amount >= 0
  );
}

/**
 * Predicate: is this a valid VoteRecord?
 */
export function isValidVoteRecord(vote: any): vote is VoteRecord {
  return (
    vote &&
    typeof vote === 'object' &&
    typeof vote.proposalId === 'number' &&
    vote.proposalId > 0 &&
    typeof vote.voter === 'string' &&
    vote.voter.length > 0 &&
    typeof vote.support === 'boolean' &&
    typeof vote.weight === 'number' &&
    vote.weight > 0
  );
}

/**
 * Predicate: is this a valid principal address?
 */
export function isValidPrincipal(address: any): address is string {
  if (typeof address !== 'string') return false;
  return /^S[PT][A-Z0-9]{38}$/.test(address);
}

/**
 * Predicate: is this a valid transaction ID?
 */
export function isValidTxId(txId: any): txId is string {
  if (typeof txId !== 'string') return false;
  return txId.length === 64 && /^[a-f0-9]{64}$/.test(txId);
}

/**
 * Filter proposals to only include valid ones.
 */
export function filterValidProposals(proposals: any[]): Proposal[] {
  if (!Array.isArray(proposals)) return [];
  return proposals.filter(isValidProposal);
}

/**
 * Filter vote records to only include valid ones.
 */
export function filterValidVotes(votes: any[]): VoteRecord[] {
  if (!Array.isArray(votes)) return [];
  return votes.filter(isValidVoteRecord);
}

/**
 * Safely narrow unknown value to Proposal.
 */
export function narrowProposal(value: unknown): Proposal | null {
  return isValidProposal(value) ? value : null;
}

/**
 * Safely narrow unknown value to ProposalPage.
 */
export function narrowProposalPage(value: unknown): ProposalPage | null {
  return isValidProposalPage(value) ? value : null;
}

/**
 * Safely narrow unknown value to StakeInfo.
 */
export function narrowStakeInfo(value: unknown): StakeInfo | null {
  return isValidStakeInfo(value) ? value : null;
}
