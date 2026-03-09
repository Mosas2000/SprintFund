/**
 * Centralized error message constants.
 *
 * Keeps user-facing copy in one place so every page displays
 * consistent wording and the text is easy to update globally.
 */

export const ERROR_MESSAGES = {
  NETWORK:
    'Unable to reach the Stacks network. Check your connection and try again.',
  PROPOSALS_LOAD:
    'Failed to load proposals. The API may be temporarily unavailable.',
  PROPOSAL_NOT_FOUND:
    'This proposal could not be found. It may have been removed or the ID is invalid.',
  PROPOSAL_LOAD:
    'Failed to load proposal details. Please try again.',
  DASHBOARD_LOAD:
    'Could not fetch your dashboard data. The network may be congested.',
  UNKNOWN:
    'An unexpected error occurred. Please try again later.',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

/**
 * Given an unknown caught value, return a safe string representation.
 */
export function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return ERROR_MESSAGES.UNKNOWN;
}
