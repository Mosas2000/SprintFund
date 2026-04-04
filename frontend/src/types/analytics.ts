/**
 * TypeScript types for the analytics subsystem.
 *
 * Defines shared payloads for insight generation, chart components,
 * API integration, and analytics data collection.
 */

/* ═══════════════════════════════════════════════
   Insight data point types
   ═══════════════════════════════════════════════ */

/**
 * A single data point rendered within an insight visualization.
 * Used by the dataPoints array in the Insight interface.
 */
export interface InsightDataPoint {
  label: string;
  value: number;
  timestamp?: number;
  category?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Chart data attached to an insight for inline visualization.
 */
export interface InsightChartData {
  labels: string[];
  datasets: InsightChartDataset[];
}

export interface InsightChartDataset {
  label: string;
  data: number[];
  color?: string;
  type?: 'line' | 'bar' | 'area';
}

/* ═══════════════════════════════════════════════
   User context for insight generation
   ═══════════════════════════════════════════════ */

/**
 * Context about the current user passed to generateAllInsights.
 * Used when analytics features tailor insights to a connected user.
 */
export interface InsightUserContext {
  address?: string;
  lastProposal?: {
    id: number;
    title: string;
    category: string;
    amount: number;
    votesFor: number;
    votesAgainst: number;
    executed: boolean;
  };
  stakeAmount?: number;
  voteCount?: number;
}

/* ═══════════════════════════════════════════════
   Chart callback types (Recharts / Chart.js)
   ═══════════════════════════════════════════════ */

/**
 * Value type for Recharts tick formatter and label callbacks.
 * Recharts passes string | number values to axis tick formatters.
 */
export type ChartTickValue = string | number;

/**
 * Payload entry in a Recharts tooltip.
 */
export interface RechartsTooltipEntry {
  name: string;
  value: number;
  dataKey: string;
  color: string;
  payload: Record<string, unknown>;
}

/**
 * Props passed to a custom Recharts tooltip component.
 */
export interface RechartsTooltipProps {
  active?: boolean;
  payload?: RechartsTooltipEntry[];
  label?: string;
}

/**
 * Legend payload entry in Recharts.
 */
export interface RechartsLegendEntry {
  value: string;
  dataKey: string;
  color: string;
  type?: string;
}

/**
 * Props passed to a custom Recharts legend component.
 */
export interface RechartsLegendProps {
  payload?: RechartsLegendEntry[];
}

/* ═══════════════════════════════════════════════
   Chart.js callback types
   ═══════════════════════════════════════════════ */

/**
 * Value type for Chart.js scale tick callbacks.
 * Chart.js passes string | number to ticks.callback.
 */
export type ChartJsTickValue = string | number;

/* ═══════════════════════════════════════════════
   API response types (external APIs)
   ═══════════════════════════════════════════════ */

/**
 * CoinGecko simple price response.
 */
export interface CoinGeckoPriceResponse {
  blockstack?: {
    usd?: number;
  };
}

/**
 * CoinGecko historical price response.
 */
export interface CoinGeckoHistoryResponse {
  market_data?: {
    current_price?: {
      usd?: number;
    };
  };
}

/**
 * Hiro Stacks API block list response.
 */
export interface HiroBlockListResponse {
  results: HiroBlock[];
  total: number;
}

export interface HiroBlock {
  height: number;
  burn_block_time_iso: string;
  txs?: HiroBlockTransaction[];
}

export interface HiroBlockTransaction {
  fee_rate?: number;
  tx_id?: string;
}

/**
 * Hiro Stacks API mempool response.
 */
export interface HiroMempoolResponse {
  total: number;
}

/**
 * GitHub repository API response (subset of fields used).
 */
export interface GitHubRepoResponse {
  stargazers_count: number;
  updated_at: string;
}

/**
 * GitHub commit list response entry.
 */
export interface GitHubCommitResponse {
  sha: string;
}

/**
 * GitHub contributors list response entry.
 */
export interface GitHubContributorResponse {
  login: string;
  contributions: number;
}

/* ═══════════════════════════════════════════════
   Proposal with block data
   ═══════════════════════════════════════════════ */

/**
 * Proposal extended with block height information.
 * Used by calculateAvgFundingTime for timing calculations.
 */
export interface ProposalWithBlocks {
  id: number;
  proposer: string;
  amount: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: number;
  executionBlock?: number;
  creationBlock?: number;
}

/* ═══════════════════════════════════════════════
   Scheduled vote types
   ═══════════════════════════════════════════════ */

/**
 * A scheduled vote stored in localStorage.
 * Used by the scheduled voting workflow in the governance UI.
 */
export interface ScheduledVoteItem {
  proposalId: number;
  voteType: 'yes' | 'no';
  executionTime: number;
  createdAt: number;
  status: 'pending' | 'executed' | 'cancelled';
}

/* ═══════════════════════════════════════════════
   AI recommendation metadata
   ═══════════════════════════════════════════════ */

/**
 * Metadata attached to an AI recommendation.
 * Used by insight and recommendation surfaces that attach optional context.
 */
export interface AIRecommendationMetadata {
  relatedProposalId?: number;
  historicalAccuracy?: number;
  confidenceInterval?: [number, number];
  dataSource?: string;
  lastUpdated?: number;
}

/* ═══════════════════════════════════════════════
   User session data
   ═══════════════════════════════════════════════ */

/**
 * Stacks Connect user session data shape.
 * Used for strongly typed wallet session state in the frontend.
 */
export interface StacksUserData {
  appPrivateKey: string;
  hubUrl: string;
  username?: string;
  profile: {
    stxAddress: {
      mainnet: string;
      testnet: string;
    };
    btcAddress?: string;
    [key: string]: unknown;
  };
  identityAddress?: string;
  decentralizedID?: string;
}

/* ═══════════════════════════════════════════════
   Velocity chart data point
   ═══════════════════════════════════════════════ */

/**
 * Data point for the proposal comparison velocity chart.
 * Supports dynamic proposal series keys alongside the shared `hour` axis.
 */
export interface VelocityDataPoint {
  hour: number;
  [proposalKey: string]: number;
}

/* ═══════════════════════════════════════════════
   Component prop types for analytics sub-components
   ═══════════════════════════════════════════════ */

/**
 * Props for the KPICard component in OverviewTab.
 */
export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend: string;
  positive: boolean;
  sparkData: number[];
}

/**
 * Props for the StatsCard component in VotingTab.
 */
export interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}

/**
 * Props for the HealthScore component in CommunityTab.
 */
export interface HealthScoreProps {
  title: string;
  score: number;
  status: string;
  color: string;
}

/* ═══════════════════════════════════════════════
   Analytics data container types
   ═══════════════════════════════════════════════ */

/**
 * Proposal data shape used by analytics-utils.
 */
export interface AnalyticsProposal {
  id: number;
  title: string;
  status: string;
  category?: string;
  createdAt: string | number;
  updatedAt?: string | number;
  requestedAmount?: number;
  votes?: Array<{ voter: string; support: boolean }>;
}

/**
 * Timeline entry for analytics data.
 */
export interface AnalyticsTimelineEntry {
  date: string;
  proposals: number;
  votes: number;
}

/**
 * Statistics for a single category.
 */
export interface CategoryStats {
  name: string;
  count: number;
  percentage: number;
  approved: number;
  rejected: number;
  pending: number;
  totalAmount: number;
}

/**
 * Proposal statistics summary.
 */
export interface ProposalStats {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
  successRate: number;
  totalAmount: number;
  averageAmount: number;
}

/**
 * Voter statistics summary.
 */
export interface VoterStats {
  totalVoters: number;
  totalVotes: number;
  averageVotesPerVoter: number;
  participationRate: number;
}

/**
 * Voting power distribution.
 */
export interface VotingPowerStats {
  distribution: Array<{ range: string; count: number }>;
  gini: number;
  topHoldersPercentage: number;
}

/**
 * Complete analytics data container.
 * Used by analytics-utils for filtering, export, and display.
 */
export interface AnalyticsData {
  proposals: AnalyticsProposal[];
  proposalStats: ProposalStats;
  categoryStats: CategoryStats[];
  voterStats: VoterStats;
  votingPower: VotingPowerStats;
  timeline: AnalyticsTimelineEntry[];
}
