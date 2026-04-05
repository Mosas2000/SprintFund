/**
 * Re-export all types from the central barrel file.
 *
 * This allows simplified imports:
 * import { Proposal, validateRawProposal } from '@/lib';
 *
 * Instead of:
 * import { Proposal } from '@/types';
 * import { validateRawProposal } from '@/lib/validators';
 */

export * from './lib/all-types';
