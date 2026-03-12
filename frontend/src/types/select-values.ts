/**
 * String literal union types for HTML select element values.
 *
 * Each type matches the <option> values of its corresponding select element
 * so form handlers and filters can stay aligned with component state.
 */

/* ═══════════════════════════════════════════════
   Budget and financial select values
   ═══════════════════════════════════════════════ */

export type BudgetPeriod = 'monthly' | 'quarterly';

export type ReportPeriod = 'monthly' | 'quarterly' | 'annual';

export type ExpenseStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'paid';

export type ExpenseType =
  | 'all'
  | 'grant_payout'
  | 'operational'
  | 'infrastructure'
  | 'marketing'
  | 'community'
  | 'other';

/* ═══════════════════════════════════════════════
   Payout scheduler select values
   ═══════════════════════════════════════════════ */

export type PaymentStatus = 'all' | 'scheduled' | 'processing' | 'completed' | 'failed';

export type PaymentType = 'all' | 'milestone' | 'recurring' | 'one-time';

export type PaymentEntityType = 'milestone' | 'recurring' | 'one-time';

export type RecurringInterval = 'weekly' | 'monthly' | 'quarterly';

/* ═══════════════════════════════════════════════
   Grant and proposal select values
   ═══════════════════════════════════════════════ */

export type GrantStatus = 'all' | 'active' | 'completed' | 'delayed' | 'cancelled';

export type DependencyType = 'requires' | 'blocks' | 'follows';

export type ContributorRole = 'author' | 'reviewer' | 'supporter';

/* ═══════════════════════════════════════════════
   Social and community select values
   ═══════════════════════════════════════════════ */

export type RelationshipFilter = 'all' | 'mutual' | 'following';

export type ReputationFilter = 'all' | 'high' | 'medium';

export type DigestMode = 'instant' | 'daily' | 'weekly';

/* ═══════════════════════════════════════════════
   Voting select values
   ═══════════════════════════════════════════════ */

export type VoteHistoryFilter = 'ALL' | 'YES' | 'NO';

/**
 * Vote history filter options as a const tuple.
 * Use for iteration while preserving literal types.
 */
export const VOTE_HISTORY_FILTERS: readonly VoteHistoryFilter[] = ['ALL', 'YES', 'NO'] as const;
