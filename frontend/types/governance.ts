/**
 * Governance-level TypeScript types used by AI analysis services
 * and governance-related UI components.
 *
 * These extend the base Proposal type with additional fields
 * needed for AI summarization, sentiment analysis, and
 * consensus risk evaluation.
 */

/**
 * Extended proposal type used by AI and governance analysis.
 * Includes category and optional metadata beyond the on-chain fields.
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
  category: string;
}

/**
 * Voting data structure passed to AI consensus analysis.
 * Contains aggregate voting metrics for a proposal or set of proposals.
 */
export interface VotingData {
  proposalId?: number;
  title?: string;
  category?: string;
  amount?: number;
  proposerReputation?: number;
  historicalSuccessRate?: number;
  communitySupport?: number;
  totalVotes: number;
  votesFor: number;
  votesAgainst: number;
  uniqueVoters: number;
  whaleVotePercentage: number;
  averageWeight: number;
  votingPeriodProgress: number;
}

/**
 * Result of AI sentiment analysis on proposal comments.
 */
export interface SentimentResult {
  score: number;
  verdict: string;
}

/**
 * Result of AI proposal summarization.
 */
export type ProposalSummary = string;

/**
 * Result of AI consensus risk analysis.
 */
export type ConsensusRisk = string;
