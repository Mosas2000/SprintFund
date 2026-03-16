import type { Proposal } from '../types';

/* ── Notification category ────────────────────── */

/**
 * Categories of governance notifications.
 *
 * - proposal_created:  A new proposal has been submitted
 * - proposal_executed: A proposal has been executed on-chain
 * - vote_milestone:    A proposal reached a significant vote threshold
 * - stake_change:      The connected user's stake has changed
 * - vote_received:     A vote was cast on one of the user's proposals
 */
export type NotificationType =
  | 'proposal_created'
  | 'proposal_executed'
  | 'vote_milestone'
  | 'stake_change'
  | 'vote_received'
  | 'quorum_reached';

/* ── Core notification model ──────────────────── */

/**
 * A single in-app notification.
 */
export interface Notification {
  /** Unique identifier */
  id: string;
  /** Notification category */
  type: NotificationType;
  /** Primary display text */
  title: string;
  /** Optional secondary text */
  description?: string;
  /** Unix timestamp (ms) when the notification was generated */
  createdAt: number;
  /** Whether the user has read the notification */
  read: boolean;
  /** Optional proposal ID this notification relates to */
  proposalId?: number;
  /** Optional transaction ID */
  txId?: string;
}

/* ── Store interface ──────────────────────────── */

/**
 * State shape for the notifications Zustand store.
 */
export interface NotificationsState {
  /** All notifications, newest first */
  notifications: Notification[];
  /** Add one or more notifications to the store */
  addNotifications: (items: Notification[]) => void;
  /** Mark a single notification as read */
  markAsRead: (id: string) => void;
  /** Mark all notifications as read */
  markAllAsRead: () => void;
  /** Remove a single notification */
  removeNotification: (id: string) => void;
  /** Clear all notifications */
  clearAll: () => void;
}

/* ── Notification generator types ─────────────── */

/**
 * Snapshot of the proposal set used by the notification generator to
 * determine which proposals are new or newly executed since the last
 * check.
 */
export interface ProposalSnapshot {
  /** Set of proposal IDs known from the previous fetch */
  knownIds: Set<number>;
  /** Set of proposal IDs that were already executed */
  executedIds: Set<number>;
  /** Map of proposal ID to total vote count (for + against) */
  voteTotals: Map<number, number>;
}

/**
 * Configuration for vote milestone thresholds that trigger
 * notifications.
 */
export interface MilestoneConfig {
  /** Vote count thresholds that trigger a milestone notification */
  thresholds: number[];
}

/** Default milestone thresholds */
export const DEFAULT_MILESTONES: MilestoneConfig = {
  thresholds: [5, 10, 25, 50, 100],
};

/* ── Component prop types ─────────────────────── */

/**
 * Props for the NotificationBell component displayed in the header.
 */
export interface NotificationBellProps {
  /** Number of unread notifications */
  unreadCount: number;
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** Toggle the dropdown */
  onToggle: () => void;
}

/**
 * Props for the NotificationDropdown panel.
 */
export interface NotificationDropdownProps {
  /** Notifications to display */
  notifications: Notification[];
  /** Callback when a notification is clicked */
  onNotificationClick: (notification: Notification) => void;
  /** Mark all as read */
  onMarkAllRead: () => void;
  /** Clear all notifications */
  onClearAll: () => void;
  /** Close the dropdown */
  onClose: () => void;
}

/**
 * Props for a single notification list item.
 */
export interface NotificationItemProps {
  /** The notification to render */
  notification: Notification;
  /** Callback when the item is clicked */
  onClick: (notification: Notification) => void;
}

/* ── WebSocket types ─────────────────────────── */

export type WsEventType =
  | 'transaction'
  | 'block'
  | 'microblock';

export interface WsMessage {
  event: WsEventType;
  payload: {
    tx_id?: string;
    tx_type?: string;
    contract_call?: {
      contract_id: string;
      function_name: string;
      function_args: Array<{ repr: string }>;
    };
    tx_status?: string;
  };
}

/* ── Push notification types ─────────────────── */

export type PushPermissionState = 'default' | 'granted' | 'denied';

export interface PushPreferences {
  enabled: boolean;
  permission: PushPermissionState;
}

/* ── Email notification types ────────────────── */

export interface EmailPreferences {
  enabled: boolean;
  address: string;
  digestMode: 'instant' | 'daily' | 'weekly';
}

/* ── Quorum configuration ────────────────────── */

export interface QuorumConfig {
  threshold: number;
}

export const DEFAULT_QUORUM: QuorumConfig = {
  threshold: 50,
};
