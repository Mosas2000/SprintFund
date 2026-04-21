export interface ContractEvent {
  id: string;
  txId: string;
  timestamp: number;
  sender: string;
  category: 'stake' | 'proposal' | 'vote' | 'cancel' | 'execute' | 'treasury';
  status: 'success' | 'failed';
  description: string;
  amount?: string;
  weight?: number;
  proposalId?: string;
}

export interface EventFilter {
  categories: ContractEvent['category'][];
  includeFailures: boolean;
}

export interface ContractEventStreamState {
  events: ContractEvent[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: number | null;
}
