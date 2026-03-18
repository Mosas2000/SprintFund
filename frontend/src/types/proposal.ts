/**
 * Application-level proposal types.
 *
 * Proposal represents the normalized, application-ready version of proposal data.
 * It is derived from contract data through parsing and validation.
 */

/**
 * Normalized proposal data ready for use throughout the application.
 * All fields are validated and in their canonical form.
 */
export interface Proposal {
  id: number;
  proposer: string;
  amount: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: number;
}

/**
 * Proposal with additional derived fields useful for display and analysis.
 */
export interface ProposalWithStats extends Proposal {
  totalVotes: number;
  forPercentage: number;
  againstPercentage: number;
  daysOld: number;
  isActive: boolean;
}

/**
 * Proposal creation parameters from form input.
 */
export interface CreateProposalInput {
  title: string;
  description: string;
  amount: number;
}

/**
 * Result of proposal creation transaction.
 */
export interface CreateProposalResult {
  txId: string;
  proposalId?: number;
}

/**
 * Paginated proposal response.
 */
export interface ProposalPage {
  proposals: Proposal[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Proposal query filters for fetching.
 */
export interface ProposalQueryOptions {
  status?: 'all' | 'active' | 'executed';
  category?: string;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'most-votes' | 'highest-amount';
  page?: number;
  pageSize?: number;
  forceRefresh?: boolean;
}

/**
 * Cached proposal entry.
 */
export interface ProposalCacheEntry {
  proposal: Proposal;
  fetchedAt: number;
}

/**
 * Proposal count with metadata.
 */
export interface ProposalCountResult {
  count: number;
  fetchedAt: number;
}
