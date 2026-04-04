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
  if (!proposal || typeof proposal !== 'object') return false;
  const p = proposal as Record<string, unknown>;
  return (
    typeof p.id === 'number' &&
    (p.id as number) > 0 &&
    typeof p.proposer === 'string' &&
    (p.proposer as string).length > 0 &&
    typeof p.amount === 'number' &&
    (p.amount as number) >= 0 &&
    typeof p.title === 'string' &&
    (p.title as string).length > 0 &&
    typeof p.description === 'string' &&
    typeof p.votesFor === 'number' &&
    (p.votesFor as number) >= 0 &&
    typeof p.votesAgainst === 'number' &&
    (p.votesAgainst as number) >= 0 &&
    typeof p.executed === 'boolean' &&
    typeof p.createdAt === 'number' &&
    (p.createdAt as number) > 0
  );
}

/**
 * Predicate: is this a valid ProposalPage?
 */
export function isValidProposalPage(page: unknown): page is ProposalPage {
  if (!page || typeof page !== 'object') return false;
  const p = page as Record<string, unknown>;
  return (
    Array.isArray(p.proposals) &&
    (p.proposals as unknown[]).every(isValidProposal) &&
    typeof p.totalCount === 'number' &&
    (p.totalCount as number) >= 0 &&
    typeof p.page === 'number' &&
    (p.page as number) >= 1 &&
    typeof p.pageSize === 'number' &&
    (p.pageSize as number) >= 1 &&
    typeof p.totalPages === 'number' &&
    (p.totalPages as number) >= 1
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
  return /^S[PT][A-Z0-9]{39}$/.test(address);
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
