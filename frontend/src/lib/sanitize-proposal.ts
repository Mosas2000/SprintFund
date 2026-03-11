import type { Proposal } from '../types';
import { sanitizeText, sanitizeMultilineText } from './sanitize';

/**
 * Sanitize all user-generated text fields in a Proposal object.
 *
 * This is a convenience wrapper for applying the appropriate
 * sanitization function to each field based on its content type.
 * Numeric and boolean fields are passed through unchanged.
 *
 * @param proposal - Raw proposal data from on-chain reads
 * @returns New Proposal object with sanitized text fields
 */
export function sanitizeProposal(proposal: Proposal): Proposal {
  return {
    ...proposal,
    title: sanitizeText(proposal.title ?? ''),
    description: sanitizeMultilineText(proposal.description ?? ''),
    proposer: proposal.proposer, // Address format, not user-generated text
  };
}

/**
 * Sanitize an array of proposals.
 *
 * @param proposals - Array of raw proposals
 * @returns New array with all text fields sanitized
 */
export function sanitizeProposals(proposals: Proposal[]): Proposal[] {
  return proposals.map(sanitizeProposal);
}
