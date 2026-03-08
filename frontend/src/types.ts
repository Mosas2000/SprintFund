/* ── Proposal ─────────────────────────────────── */

export interface Proposal {
  id: number;
  proposer: string;
  amount: number;       // micro-STX
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: number;    // block height
}

/* ── Stake ────────────────────────────────────── */

export interface StakeInfo {
  staked: number;       // micro-STX
  blockHeight: number;
}

/* ── Transaction ──────────────────────────────── */

export type TxStatus = 'pending' | 'success' | 'abort_by_response' | 'abort_by_post_condition';

export interface TxToast {
  txId: string;
  label: string;
}
