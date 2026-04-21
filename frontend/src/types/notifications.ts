export interface NotificationPreference {
  proposalCreated: boolean;
  proposalVoting: boolean;
  proposalExecuted: boolean;
  proposalCancelled: boolean;
  delegationReceived: boolean;
}

export interface Notification {
  id: string;
  type: keyof NotificationPreference;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationEvent {
  proposalId?: string;
  proposalTitle?: string;
  amount?: string;
  delegatorAddress?: string;
  blockHeight?: number;
}
