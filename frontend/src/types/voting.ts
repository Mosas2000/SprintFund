/**
 * Types for voting operations and voting state.
 */

/**
 * Vote input from user selecting yes or no on a proposal.
 */
export interface VoteInput {
  proposalId: number;
  support: boolean;
  weight: number;
}

/**
 * Vote record from the contract.
 */
export interface VoteRecord {
  proposalId: number;
  voter: string;
  support: boolean;
  weight: number;
  costPaid: number;
}

/**
 * Voting history for a user.
 */
export interface UserVotingHistory {
  address: string;
  totalVotes: number;
  votes: VoteRecord[];
}

/**
 * Vote with proposal context.
 */
export interface VoteWithProposal extends VoteRecord {
  proposalTitle?: string;
}

/**
 * Voting statistics.
 */
export interface VotingStats {
  totalVoters: number;
  totalVotesFor: number;
  totalVotesAgainst: number;
  participationRate: number;
}
