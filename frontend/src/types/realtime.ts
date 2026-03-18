/**
 * Types for real-time and WebSocket communication.
 */

import type { Proposal, VoteRecord, StakeInfo } from './proposal';

/**
 * WebSocket message types from Stacks API.
 */
export type WsEventType = 'tx' | 'block' | 'mempool' | 'microblock';

/**
 * WebSocket transaction event.
 */
export interface WsTransactionEvent {
  type: 'tx';
  data: {
    tx_id: string;
    tx_type: string;
    tx_status: 'success' | 'pending' | 'failed';
    contract_call?: {
      contract_id: string;
      function_name: string;
      function_args: Array<{ repr: string }>;
    };
  };
}

/**
 * WebSocket block event.
 */
export interface WsBlockEvent {
  type: 'block';
  data: {
    height: number;
    hash: string;
    burn_block_time: number;
  };
}

/**
 * WebSocket message union.
 */
export type WsMessage = WsTransactionEvent | WsBlockEvent;

/**
 * Real-time proposal update.
 */
export interface ProposalUpdate {
  proposalId: number;
  status: 'created' | 'voted' | 'executed' | 'failed';
  timestamp: number;
  data?: Partial<Proposal>;
}

/**
 * Real-time vote update.
 */
export interface VoteUpdate {
  proposalId: number;
  voter: string;
  support: boolean;
  weight: number;
  timestamp: number;
}

/**
 * Real-time stake update.
 */
export interface StakeUpdate {
  address: string;
  previousAmount: number;
  newAmount: number;
  change: number;
  type: 'deposit' | 'withdraw';
  timestamp: number;
}

/**
 * Subscription filters for real-time updates.
 */
export interface SubscriptionFilters {
  proposalIds?: number[];
  voters?: string[];
  stakers?: string[];
  eventTypes?: WsEventType[];
}

/**
 * Real-time connection state.
 */
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

/**
 * Connection state update.
 */
export interface ConnectionStateUpdate {
  state: ConnectionState;
  error?: string;
  timestamp: number;
  attemptNumber?: number;
}
