export interface ExecutionHistoryEntry {
  transactionId: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  blockHeight?: number;
  errorMessage?: string;
}

export class ProposalExecutionService {
  private storageKey = 'proposal_executions';

  getExecutionHistory(proposalId: string): ExecutionHistoryEntry[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.storageKey);
    const data = stored ? JSON.parse(stored) : {};
    return data[proposalId] || [];
  }

  addExecutionEntry(proposalId: string, entry: ExecutionHistoryEntry): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(this.storageKey);
    const data = stored ? JSON.parse(stored) : {};

    if (!data[proposalId]) {
      data[proposalId] = [];
    }

    data[proposalId].push(entry);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  updateExecutionStatus(
    proposalId: string,
    transactionId: string,
    status: 'confirmed' | 'failed',
    blockHeight?: number,
    errorMessage?: string
  ): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(this.storageKey);
    const data = stored ? JSON.parse(stored) : {};

    if (data[proposalId]) {
      const entry = data[proposalId].find((e: ExecutionHistoryEntry) => e.transactionId === transactionId);
      if (entry) {
        entry.status = status;
        entry.blockHeight = blockHeight;
        entry.errorMessage = errorMessage;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    }
  }

  getMostRecentExecution(proposalId: string): ExecutionHistoryEntry | null {
    const history = this.getExecutionHistory(proposalId);
    return history.length > 0 ? history[history.length - 1] : null;
  }

  getLatestConfirmedExecution(proposalId: string): ExecutionHistoryEntry | null {
    const history = this.getExecutionHistory(proposalId);
    return history.find((e) => e.status === 'confirmed') || null;
  }
}

export const proposalExecutionService = new ProposalExecutionService();
