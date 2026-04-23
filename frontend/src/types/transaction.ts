export type TransactionType = 'stake' | 'vote' | 'create-proposal' | 'execute' | 'unstake' | 'reclaim-vote';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'dropped';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: number;
  proposalId?: number;
  amount?: number;
  title?: string;
  metadata?: Record<string, unknown>;
  blockHeight?: number;
  confirmations?: number;
  error?: string;
}

export interface TransactionState {
  transactions: Record<string, Transaction>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  getTransaction: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByStatus: (status: TransactionStatus) => Transaction[];
  getPendingTransactions: () => Transaction[];
  clearOldTransactions: (olderThanDays: number) => void;
}
