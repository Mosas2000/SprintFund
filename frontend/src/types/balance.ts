export interface WalletBalance {
  stx: number;
  stxLocked: number;
}

export interface WalletBalanceState {
  balance: WalletBalance | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}
