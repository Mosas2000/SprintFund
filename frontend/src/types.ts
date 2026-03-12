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

export interface StakeInfo {
  amount: number;
}

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
  VoteRecord,
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
