/**
 * Runtime validation for Stacks contract data.
 *
 * These validators ensure that API responses match expected shapes
 * before they're used by the application.
 */

import type { RawProposal, RawStake, RawVote } from '../types/contract';
import type { Proposal, CreateProposalInput } from '../types/proposal';

/**
 * Validates that a value is a valid string.
 */
function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Validates that a value is a valid non-negative number.
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && isFinite(value);
}

/**
 * Validates that a value is a valid boolean.
 */
function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Validates that a value is a valid principal address.
 */
function isPrincipal(value: unknown): value is string {
  if (!isString(value)) return false;
  return /^(ST|SP)[A-Z0-9]{38}$/.test(value);
}

/**
 * Extracts the unwrapped value from a Clarity value that may be wrapped
 * in { value: T } or returned directly as T.
 */
export function unwrapClarityValue<T>(value: T | { value: T } | null | undefined): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object' && 'value' in value) {
    return (value as { value: T }).value;
  }
  return value as T;
}

/**
 * Validates and normalizes a raw proposal response from the contract.
 */
export function validateRawProposal(raw: unknown): RawProposal | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const proposer = unwrapClarityValue(obj.proposer);
  const amount = unwrapClarityValue(obj.amount);
  const title = unwrapClarityValue(obj.title);
  const description = unwrapClarityValue(obj.description);
  const votesFor = unwrapClarityValue(obj['votes-for']);
  const votesAgainst = unwrapClarityValue(obj['votes-against']);
  const executed = unwrapClarityValue(obj.executed);
  const createdAt = unwrapClarityValue(obj['created-at']);

  if (
    !isString(proposer) ||
    !isNumber(amount) ||
    !isString(title) ||
    !isString(description) ||
    !isNumber(votesFor) ||
    !isNumber(votesAgainst) ||
    !isBoolean(executed) ||
    !isNumber(createdAt)
  ) {
    return null;
  }

  return {
    proposer: { value: proposer },
    amount: { value: amount },
    title: { value: title },
    description: { value: description },
    'votes-for': { value: votesFor },
    'votes-against': { value: votesAgainst },
    executed: { value: executed },
    'created-at': { value: createdAt },
  };
}

/**
 * Converts a validated raw proposal to a normalized Proposal.
 * Note: createdAt is a block height (number), not a timestamp.
 * Use formatBlockHeight() utility to display it as human-readable format.
 */
export function rawProposalToProposal(id: number, raw: RawProposal): Proposal {
  return {
    id,
    proposer: unwrapClarityValue(raw.proposer) || '',
    amount: unwrapClarityValue(raw.amount) || 0,
    title: unwrapClarityValue(raw.title) || '',
    description: unwrapClarityValue(raw.description) || '',
    votesFor: unwrapClarityValue(raw['votes-for']) || 0,
    votesAgainst: unwrapClarityValue(raw['votes-against']) || 0,
    executed: unwrapClarityValue(raw.executed) || false,
    createdAt: unwrapClarityValue(raw['created-at']) || 0,
  };
}

/**
 * Validates and normalizes a raw stake response from the contract.
 */
export function validateRawStake(raw: unknown): RawStake | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const amount = unwrapClarityValue(obj.amount);

  if (!isNumber(amount)) return null;

  return {
    amount: { value: amount },
  };
}

/**
 * Validates and normalizes a raw vote response from the contract.
 */
export function validateRawVote(raw: unknown): RawVote | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const weight = unwrapClarityValue(obj.weight);
  const support = unwrapClarityValue(obj.support);

  if (!isNumber(weight) || !isBoolean(support)) return null;

  return {
    weight: { value: weight },
    support: { value: support },
  };
}

/**
 * Validates proposal creation input from form data.
 */
export function validateCreateProposalInput(input: unknown): CreateProposalInput | null {
  if (!input || typeof input !== 'object') return null;
  const obj = input as Record<string, unknown>;

  const title = obj.title;
  const description = obj.description;
  const amount = obj.amount;

  if (!isString(title) || !isString(description) || !isNumber(amount)) {
    return null;
  }

  if (title.length < 3 || title.length > 200) return null;
  if (description.length < 10 || description.length > 2000) return null;
  if (amount <= 0 || amount > Number.MAX_SAFE_INTEGER) return null;

  return { title, description, amount };
}

/**
 * Validates that a value is a valid proposal count response.
 */
export function validateProposalCount(raw: unknown): number | null {
  const count = unwrapClarityValue(raw);
  if (!isNumber(count)) return null;
  return count;
}

/**
 * Validates that a value is a valid STX amount.
 */
export function validateStxAmount(value: unknown): number | null {
  if (!isNumber(value)) return null;
  if (value > Number.MAX_SAFE_INTEGER) return null;
  return value;
}

/**
 * Type guard for checking if an object is a valid Proposal.
 */
export function isProposal(value: unknown): value is Proposal {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === 'number' &&
    typeof obj.proposer === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.votesFor === 'number' &&
    typeof obj.votesAgainst === 'number' &&
    typeof obj.executed === 'boolean' &&
    typeof obj.createdAt === 'number'
  );
}

/**
 * Type guard for checking if an array contains valid Proposals.
 */
export function isProposalArray(value: unknown): value is Proposal[] {
  return Array.isArray(value) && value.every(isProposal);
}
