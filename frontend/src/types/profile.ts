import type { Proposal } from '../types';

/* ── Profile data types ───────────────────────── */

/**
 * Activity event types tracked on the user profile.
 */
export type ActivityEventType =
  | 'proposal_created'
  | 'vote_cast'
  | 'stake_deposited'
  | 'stake_withdrawn'
  | 'proposal_executed';

/**
 * A single activity event displayed on the profile timeline.
 */
export interface ActivityEvent {
  /** Unique identifier */
  id: string;
  /** The type of activity */
  type: ActivityEventType;
  /** Human-readable label for the event */
  label: string;
  /** Optional secondary description */
  description?: string;
  /** Unix timestamp of the event */
  timestamp: number;
  /** Optional proposal ID this event relates to */
  proposalId?: number;
  /** Optional STX amount involved */
  amount?: number;
  /** Optional transaction ID */
  txId?: string;
}

/**
 * Aggregate statistics for a user's participation.
 */
export interface ProfileStats {
  /** STX balance in micro-STX */
  stxBalance: number;
  /** Staked amount in micro-STX */
  stakedAmount: number;
  /** Number of proposals created by this user */
  proposalsCreated: number;
  /** Number of proposals that have been executed */
  proposalsExecuted: number;
  /** Total votes cast across all proposals */
  totalVotesCast: number;
  /** Total number of comments posted */
  totalComments: number;
  /** Total quadratic vote weight used */
  totalVoteWeight: number;
  /** Percentage of proposals user has voted on */
  votingParticipationRate: number;
}

/**
 * Voting record for a single proposal.
 */
export interface VoteRecord {
  /** Proposal ID */
  proposalId: number;
  /** Proposal title */
  title: string;
  /** Whether the vote was in support */
  support: boolean;
  /** Vote weight used */
  weight: number;
  /** Block height when voted (estimated from proposal data) */
  timestamp: number;
  /** Whether the proposal has been executed */
  executed: boolean;
}

/**
 * Complete profile data fetched and composed for display.
 */
export interface UserProfile {
  /** Stacks wallet address */
  address: string;
  /** Aggregate participation stats */
  stats: ProfileStats;
  /** Proposals created by this user */
  proposals: Proposal[];
  /** Voting history across proposals */
  votes: VoteRecord[];
  /** Chronological activity events */
  activity: ActivityEvent[];
}

/**
 * Loading state for profile data sections.
 */
export interface ProfileLoadingState {
  stats: boolean;
  proposals: boolean;
  votes: boolean;
  activity: boolean;
}

/**
 * Profile page tab options.
 */
export type ProfileTab = 'overview' | 'proposals' | 'votes' | 'activity';

/**
 * Props for the ProfileHeader component.
 */
export interface ProfileHeaderProps {
  address: string;
  stats: ProfileStats;
  loading: boolean;
}

/**
 * Props for the ProfileStats display component.
 */
export interface ProfileStatsGridProps {
  stats: ProfileStats;
  loading: boolean;
}

/**
 * Props for the UserProposals component.
 */
export interface UserProposalsProps {
  proposals: Proposal[];
  loading: boolean;
}

/**
 * Props for the VotingHistory component.
 */
export interface VotingHistoryProps {
  votes: VoteRecord[];
  loading: boolean;
}

/**
 * Props for the ActivityTimeline component.
 */
export interface ActivityTimelineProps {
  events: ActivityEvent[];
  loading: boolean;
}
