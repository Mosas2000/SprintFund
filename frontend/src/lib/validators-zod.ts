/**
 * Runtime validation schemas using Zod.
 * Validates all API responses and user inputs at runtime.
 */

import { z } from 'zod';
import type {
  RawProposal,
  RawStake,
  RawVote,
} from '../types/contract';
import type { Proposal } from '../types/proposal';

/**
 * Zod schema for Clarity wrapped values.
 */
const ClarityValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.object({ value: z.any() }).passthrough(),
]);

/**
 * Schema for raw proposal data from contract.
 */
export const RawProposalSchema = z.object({
  proposer: ClarityValueSchema,
  amount: ClarityValueSchema,
  title: ClarityValueSchema,
  description: ClarityValueSchema,
  'votes-for': ClarityValueSchema,
  'votes-against': ClarityValueSchema,
  executed: ClarityValueSchema,
  'created-at': ClarityValueSchema,
});

/**
 * Schema for raw stake data from contract.
 */
export const RawStakeSchema = z.object({
  amount: ClarityValueSchema,
});

/**
 * Schema for raw vote data from contract.
 */
export const RawVoteSchema = z.object({
  weight: ClarityValueSchema,
  support: ClarityValueSchema,
});

/**
 * Schema for normalized proposal.
 */
export const ProposalSchema = z.object({
  id: z.number().int().nonnegative(),
  proposer: z.string(),
  amount: z.number().nonnegative(),
  title: z.string().min(1),
  description: z.string().min(1),
  votesFor: z.number().int().nonnegative(),
  votesAgainst: z.number().int().nonnegative(),
  executed: z.boolean(),
  createdAt: z.number().int().nonnegative(),
}) satisfies z.ZodType<Proposal>;

/**
 * Schema for proposal creation input.
 */
export const CreateProposalInputSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  amount: z.number().positive().max(Number.MAX_SAFE_INTEGER),
});

/**
 * Schema for stake amount.
 */
export const StakeAmountSchema = z.number().nonnegative().max(Number.MAX_SAFE_INTEGER);

/**
 * Schema for proposal count.
 */
export const ProposalCountSchema = z.number().int().nonnegative();

/**
 * Validate raw proposal data.
 */
export function validateRawProposalZod(data: unknown): RawProposal | null {
  try {
    return RawProposalSchema.parse(data) as RawProposal;
  } catch (err) {
    console.error('Raw proposal validation error:', err);
    return null;
  }
}

/**
 * Validate normalized proposal.
 */
export function validateProposalZod(data: unknown): Proposal | null {
  try {
    return ProposalSchema.parse(data);
  } catch (err) {
    console.error('Proposal validation error:', err);
    return null;
  }
}

/**
 * Validate raw stake data.
 */
export function validateRawStakeZod(data: unknown): RawStake | null {
  try {
    return RawStakeSchema.parse(data);
  } catch (err) {
    console.error('Raw stake validation error:', err);
    return null;
  }
}

/**
 * Validate raw vote data.
 */
export function validateRawVoteZod(data: unknown): RawVote | null {
  try {
    return RawVoteSchema.parse(data);
  } catch (err) {
    console.error('Raw vote validation error:', err);
    return null;
  }
}

/**
 * Validate proposal creation input.
 */
export function validateCreateProposalInputZod(data: unknown) {
  try {
    return CreateProposalInputSchema.parse(data);
  } catch (err) {
    console.error('Create proposal input validation error:', err);
    return null;
  }
}

/**
 * Validate stake amount.
 */
export function validateStakeAmountZod(value: unknown): number | null {
  try {
    return StakeAmountSchema.parse(value);
  } catch (err) {
    console.error('Stake amount validation error:', err);
    return null;
  }
}

/**
 * Validate proposal count.
 */
export function validateProposalCountZod(value: unknown): number | null {
  try {
    return ProposalCountSchema.parse(value);
  } catch (err) {
    console.error('Proposal count validation error:', err);
    return null;
  }
}
