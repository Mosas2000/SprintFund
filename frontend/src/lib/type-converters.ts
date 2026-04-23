/**
 * Type guard and conversion utilities.
 */

import type {
  Proposal,
  ProposalWithStats,
  ProposalPage,
  StakeInfo,
  VoteRecord,
  RawProposal,
  RawStake,
  RawVote,
} from '../types';
import { enrichProposal } from './proposal-utils';
import { unwrapClarityValue } from './validators';

/**
 * Converts RawProposal to Proposal type.
 */
export function convertRawToProposal(id: number, raw: RawProposal): Proposal {
  return {
    id,
    proposer: unwrapClarityValue(raw.proposer) ?? '',
    amount: unwrapClarityValue(raw.amount) ?? 0,
    title: unwrapClarityValue(raw.title) ?? '',
    description: unwrapClarityValue(raw.description) ?? '',
    votesFor: unwrapClarityValue(raw['votes-for']) ?? 0,
    votesAgainst: unwrapClarityValue(raw['votes-against']) ?? 0,
    executed: unwrapClarityValue(raw.executed) ?? false,
    createdAt: unwrapClarityValue(raw['created-at']) ?? 0,
    votingEndsAt: unwrapClarityValue(raw['voting-ends-at']) ?? 0,
    executionAllowedAt: unwrapClarityValue(raw['execution-allowed-at']) ?? 0,
  };
}

/**
 * Converts Proposal to ProposalWithStats.
 */
export function convertToProposalWithStats(proposal: Proposal): ProposalWithStats {
  return enrichProposal(proposal);
}

/**
 * Converts RawStake to StakeInfo.
 */
export function convertRawToStake(address: string, raw: RawStake): StakeInfo {
  return {
    address,
    amount: unwrapClarityValue(raw.amount) ?? 0,
  };
}

/**
 * Converts RawVote to VoteRecord.
 */
export function convertRawToVote(proposalId: number, voter: string, raw: RawVote): VoteRecord {
  return {
    proposalId,
    voter,
    support: unwrapClarityValue(raw.support) ?? false,
    weight: unwrapClarityValue(raw.weight) ?? 0,
    costPaid: unwrapClarityValue(raw['cost-paid']) ?? 0,
  };
}

/**
 * Converts array of Proposals to ProposalPage.
 */
export function createProposalPage(
  proposals: Proposal[],
  totalCount: number,
  page: number,
  pageSize: number,
): ProposalPage {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    proposals,
    totalCount,
    page: Math.min(page, totalPages),
    pageSize,
    totalPages,
  };
}

/**
 * Type assertion helper that narrows type with validation.
 */
export function assertProposal(value: unknown): asserts value is Proposal {
  if (!value || typeof value !== 'object') {
    throw new Error('Value is not a Proposal');
  }

  const obj = value as Record<string, unknown>;
  if (typeof obj.id !== 'number' || typeof obj.title !== 'string') {
    throw new Error('Value does not have required Proposal fields');
  }
}

/**
 * Type assertion for ProposalPage.
 */
export function assertProposalPage(value: unknown): asserts value is ProposalPage {
  if (!value || typeof value !== 'object') {
    throw new Error('Value is not a ProposalPage');
  }

  const obj = value as Record<string, unknown>;
  if (!Array.isArray(obj.proposals) || typeof obj.totalPages !== 'number') {
    throw new Error('Value does not have required ProposalPage fields');
  }
}

/**
 * Safely extracts Proposal from unknown value.
 */
export function safeProposal(value: unknown): Proposal | null {
  try {
    assertProposal(value);
    return value;
  } catch {
    return null;
  }
}

/**
 * Safely extracts ProposalPage from unknown value.
 */
export function safeProposalPage(value: unknown): ProposalPage | null {
  try {
    assertProposalPage(value);
    return value;
  } catch {
    return null;
  }
}
