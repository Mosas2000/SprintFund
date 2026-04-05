/* Re-export proposal types for convenience */
export type {
  Proposal,
  ProposalWithStats,
  CreateProposalInput,
  CreateProposalResult,
  ProposalPage,
  ProposalQueryOptions,
  ProposalCacheEntry,
  ProposalCountResult,
} from './types/proposal';

/* Re-export stake types for convenience */
export type {
  StakeInfo,
  StakeInput,
  WithdrawStakeInput,
  MinStakeInfo,
  StakeTransactionResult,
  StakeHistoryEntry,
} from './types/stake';

/* Re-export voting types for convenience */
export type {
  VoteInput,
  VoteRecord,
  UserVotingHistory,
  VoteWithProposal,
  VotingStats,
} from './types/voting';

/* Re-export API types for convenience */
export type {
  FetchProposalsRequest,
  FetchProposalsResponse,
  CreateProposalRequest,
  CreateProposalResponse,
  VoteRequest,
  VoteResponse,
  StakeRequest,
  StakeResponse,
  FetchStakeRequest,
  FetchStakeResponse,
  FetchVotingHistoryRequest,
  FetchVotingHistoryResponse,
  ErrorResponse,
} from './types/api';

export { isErrorResponse, isSuccessResponse } from './types/api';

/* Re-export real-time types for convenience */
export type {
  WsEventType,
  WsTransactionEvent,
  WsBlockEvent,
  WsMessage,
  ProposalUpdate,
  VoteUpdate,
  StakeUpdate,
  SubscriptionFilters,
  ConnectionState,
  ConnectionStateUpdate,
} from './types/realtime';

/* Re-export config types for convenience */
export type {
  AppEnvironment,
  NetworkConfig,
  ContractConfig,
  AppConfig,
  CacheConfig,
  FeatureFlags,
  ValidationConfig,
} from './types/config';

export {
  getAppEnvironment,
  isDevelopment,
  isProduction,
} from './types/config';

export type TxStatus = 'pending' | 'success' | 'failed';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning' | 'tx';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
  dismissible?: boolean;
  createdAt: number;
  txId?: string;
  txStatus?: TxStatus;
}

export interface TxToast {
  id: string;
  txId: string;
  label: string;
  status: TxStatus;
}

/* Re-export confirmation dialog types for convenience */
export type {
  DialogVariant,
  DetailItem,
  ConfirmDialogAction,
  ConfirmDialogProps,
} from './types/confirm-dialog';

/* Re-export comment types for convenience */
export type {
  Comment,
  CommentReaction,
  CommentSortOrder,
  ReactionType,
  NewCommentInput,
  EditCommentInput,
  CommentRules,
  CommentValidationError,
  CommentFormProps,
  CommentItemProps,
  CommentListProps,
  CommentSortToggleProps,
  CommentSectionProps,
} from './types/comment';

export { COMMENT_RULES } from './types/comment';

/* Re-export profile types for convenience */
export type {
  ActivityEventType,
  ActivityEvent,
  ProfileStats,
  VoteRecord as ProfileVoteRecord,
  UserProfile,
  ProfileLoadingState,
  ProfileTab,
  ProfileHeaderProps,
  ProfileStatsGridProps,
  UserProposalsProps,
  VotingHistoryProps,
  ActivityTimelineProps,
} from './types/profile';

/* Re-export notification types for convenience */
export type {
  NotificationType,
  Notification,
  NotificationsState,
  ProposalSnapshot,
  MilestoneConfig,
  NotificationBellProps,
  NotificationDropdownProps,
  NotificationItemProps,
} from './types/notification';

export { DEFAULT_MILESTONES } from './types/notification';

/* Re-export SEO types for convenience */
export type {
  OpenGraphMeta,
  OpenGraphImage,
  TwitterCardMeta,
  PageSeoConfig,
  JsonLdOrganization,
  JsonLdWebSite,
  JsonLdWebPage,
  SeoMetadata,
  SitemapEntry,
} from './types/seo';

export {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_LOCALE,
  SITE_THEME_COLOR,
  OG_IMAGE_WIDTH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_ALT,
  TWITTER_HANDLE,
  TWITTER_CARD_TYPE,
  PAGE_SEO_CONFIGS,
} from './types/seo';

/* Re-export contract types for convenience */
export type {
  ClarityWrappedValue,
  ClarityValue,
  RawProposal,
  RawStake,
  RawVote,
  ClarityOkResponse,
  ReadOnlyResult,
  RawReadOnlyResponse,
  TxFinishData,
  TxCallbacks as ContractTxCallbacks,
  ContractCallOptions,
  ContractErrorCode,
  ContractErrorName,
  ContractError,
  NetworkError,
} from './types/contract';

export {
  CONTRACT_ERROR_CODES,
  isErrorWithMessage,
  getErrorMessage,
  isNetworkError,
} from './types/contract';

/* Re-export analytics types for convenience */
export type {
  InsightDataPoint,
  InsightChartData,
  InsightChartDataset,
  InsightUserContext,
  ChartTickValue,
  RechartsTooltipEntry,
  RechartsTooltipProps,
  RechartsLegendEntry,
  RechartsLegendProps,
  ChartJsTickValue,
  CoinGeckoPriceResponse,
  CoinGeckoHistoryResponse,
  HiroBlockListResponse,
  HiroBlock,
  HiroBlockTransaction,
  HiroMempoolResponse,
  GitHubRepoResponse,
  GitHubCommitResponse,
  GitHubContributorResponse,
  ProposalWithBlocks,
  ScheduledVoteItem,
  AIRecommendationMetadata,
  StacksUserData,
  VelocityDataPoint,
  KPICardProps,
  StatsCardProps,
  HealthScoreProps,
} from './types/analytics';

/* Re-export select value types for convenience */
export type {
  BudgetPeriod,
  ReportPeriod,
  ExpenseStatus,
  ExpenseType,
  PaymentStatus,
  PaymentType,
  PaymentEntityType,
  RecurringInterval,
  GrantStatus,
  DependencyType,
  ContributorRole,
  RelationshipFilter,
  ReputationFilter,
  DigestMode,
  VoteHistoryFilter,
} from './types/select-values';

export { VOTE_HISTORY_FILTERS } from './types/select-values';

/* Re-export price types for convenience */
export type {
  PriceData,
  PriceState,
  CoinGeckoResponse,
} from './types/price';

/* Re-export balance types for convenience */
export type {
  WalletBalance,
  WalletBalanceState,
} from './types/balance';
