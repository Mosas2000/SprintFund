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
