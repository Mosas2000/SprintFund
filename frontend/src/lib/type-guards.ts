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
export function isValidProposal(proposal: unknown): proposal is Proposal {
  return (
    proposal &&
    typeof proposal === 'object' &&
    typeof (proposal as Record<string, unknown>).id === 'number' &&
    (proposal as Record<string, unknown>).id > 0 &&
    typeof (proposal as Record<string, unknown>).proposer === 'string' &&
    (proposal as Record<string, unknown>).proposer.length > 0 &&
    typeof (proposal as Record<string, unknown>).amount === 'number' &&
    (proposal as Record<string, unknown>).amount >= 0 &&
    typeof (proposal as Record<string, unknown>).title === 'string' &&
    (proposal as Record<string, unknown>).title.length > 0 &&
    typeof (proposal as Record<string, unknown>).description === 'string' &&
    typeof (proposal as Record<string, unknown>).votesFor === 'number' &&
    (proposal as Record<string, unknown>).votesFor >= 0 &&
    typeof (proposal as Record<string, unknown>).votesAgainst === 'number' &&
    (proposal as Record<string, unknown>).votesAgainst >= 0 &&
    typeof (proposal as Record<string, unknown>).executed === 'boolean' &&
    typeof (proposal as Record<string, unknown>).createdAt === 'number' &&
    (proposal as Record<string, unknown>).createdAt > 0
  );
}

/**
 * Predicate: is this a valid ProposalPage?
 */
export function isValidProposalPage(page: unknown): page is ProposalPage {
  return (
    page &&
    typeof page === 'object' &&
    Array.isArray((page as Record<string, unknown>).proposals) &&
    ((page as Record<string, unknown>).proposals as unknown[]).every(isValidProposal) &&
    typeof (page as Record<string, unknown>).totalCount === 'number' &&
    (page as Record<string, unknown>).totalCount >= 0 &&
    typeof (page as Record<string, unknown>).page === 'number' &&
    (page as Record<string, unknown>).page >= 1 &&
    typeof (page as Record<string, unknown>).pageSize === 'number' &&
    (page as Record<string, unknown>).pageSize >= 1 &&
    typeof (page as Record<string, unknown>).totalPages === 'number' &&
    (page as Record<string, unknown>).totalPages >= 1
  );
}

/**
 * Predicate: is this a valid StakeInfo?
 */
export function isValidStakeInfo(stake: unknown): stake is StakeInfo {
  return (
    stake &&
    typeof stake === 'object' &&
    typeof (stake as Record<string, unknown>).address === 'string' &&
    (stake as Record<string, unknown>).address.length > 0 &&
    typeof (stake as Record<string, unknown>).amount === 'number' &&
    (stake as Record<string, unknown>).amount >= 0
  );
}

/**
 * Predicate: is this a valid VoteRecord?
 */
export function isValidVoteRecord(vote: unknown): vote is VoteRecord {
  return (
    vote &&
    typeof vote === 'object' &&
    typeof (vote as Record<string, unknown>).proposalId === 'number' &&
    (vote as Record<string, unknown>).proposalId > 0 &&
    typeof (vote as Record<string, unknown>).voter === 'string' &&
    (vote as Record<string, unknown>).voter.length > 0 &&
    typeof (vote as Record<string, unknown>).support === 'boolean' &&
    typeof (vote as Record<string, unknown>).weight === 'number' &&
    (vote as Record<string, unknown>).weight > 0
  );
}

/**
 * Predicate: is this a valid principal address?
 */
export function isValidPrincipal(address: unknown): address is string {
  if (typeof address !== 'string') return false;
  return /^S[PT][A-Z0-9]{38}$/.test(address);
}

/**
 * Predicate: is this a valid transaction ID?
 */
export function isValidTxId(txId: unknown): txId is string {
  if (typeof txId !== 'string') return false;
  return txId.length === 64 && /^[a-f0-9]{64}$/.test(txId);
}

/**
 * Filter proposals to only include valid ones.
 */
export function filterValidProposals(proposals: unknown[]): Proposal[] {
  if (!Array.isArray(proposals)) return [];
  return proposals.filter(isValidProposal);
}

/**
 * Filter vote records to only include valid ones.
 */
export function filterValidVotes(votes: unknown[]): VoteRecord[] {
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
