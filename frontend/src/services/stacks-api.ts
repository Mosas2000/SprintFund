import { API_URL } from '../config';
import type { TransactionStatus } from '../types/transaction';

interface StacksTransaction {
  tx_id: string;
  tx_status: string;
  tx_result?: {
    repr: string;
  };
  tx_type: string;
  fee_rate: string;
  sender_address: string;
  sponsored: boolean;
  post_condition_mode: string;
  block_height?: number;
  burn_block_time?: number;
  canonical: boolean;
  is_unanchored: boolean;
}

interface BlockResponse {
  height: number;
  hash: string;
  burn_block_time: number;
}

const CACHE_DURATION = 30000;
const MAX_CACHE_SIZE = 100;

export class StacksApiService {
  private baseUrl: string;
  private txCache: Map<string, { data: StacksTransaction; timestamp: number }> = new Map();
  private blockHeightCache: { data: number; timestamp: number } | null = null;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private clearExpiredCache(): void {
    const now = Date.now();

    for (const [key, value] of this.txCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        this.txCache.delete(key);
      }
    }

    if (this.blockHeightCache && now - this.blockHeightCache.timestamp > CACHE_DURATION) {
      this.blockHeightCache = null;
    }
  }

  private limitCacheSize(): void {
    if (this.txCache.size > MAX_CACHE_SIZE) {
      const keys = Array.from(this.txCache.keys());
      const toDelete = keys.slice(0, this.txCache.size - MAX_CACHE_SIZE);
      toDelete.forEach((key) => this.txCache.delete(key));
    }
  }

  async fetchTransaction(txId: string): Promise<StacksTransaction> {
    this.clearExpiredCache();

    const cached = this.txCache.get(txId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await fetch(`${this.baseUrl}/extended/v1/tx/${txId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transaction: ${response.statusText}`);
    }

    const data = await response.json();
    this.txCache.set(txId, { data, timestamp: Date.now() });
    this.limitCacheSize();

    return data;
  }

  async getCurrentBlockHeight(): Promise<number> {
    this.clearExpiredCache();

    if (this.blockHeightCache && Date.now() - this.blockHeightCache.timestamp < CACHE_DURATION) {
      return this.blockHeightCache.data;
    }

    const response = await fetch(`${this.baseUrl}/extended/v1/block?limit=1`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch block height: ${response.statusText}`);
    }

    const data = await response.json();
    const height = data.results?.[0]?.height || 0;
    this.blockHeightCache = { data: height, timestamp: Date.now() };

    return height;
  }

  mapTxStatus(stacksStatus: string, txResult?: { repr: string }): TransactionStatus {
    switch (stacksStatus) {
      case 'success':
        return 'confirmed';
      case 'abort_by_response':
      case 'abort_by_post_condition':
        return 'failed';
      case 'pending':
        return 'pending';
      case 'dropped_replace_by_fee':
      case 'dropped_replace_across_fork':
      case 'dropped_too_expensive':
      case 'dropped_stale_garbage_collect':
        return 'dropped';
      default:
        if (txResult?.repr?.includes('err')) {
          return 'failed';
        }
        return 'pending';
    }
  }

  async getTransactionStatus(txId: string): Promise<{
    status: TransactionStatus;
    blockHeight?: number;
    confirmations?: number;
    error?: string;
  }> {
    try {
      const tx = await this.fetchTransaction(txId);
      const status = this.mapTxStatus(tx.tx_status, tx.tx_result);

      let confirmations: number | undefined;
      if (tx.block_height) {
        const currentHeight = await this.getCurrentBlockHeight();
        confirmations = Math.max(0, currentHeight - tx.block_height);
      }

      let error: string | undefined;
      if (status === 'failed' && tx.tx_result?.repr) {
        error = tx.tx_result.repr;
      }

      return {
        status,
        blockHeight: tx.block_height,
        confirmations,
        error,
      };
    } catch (err) {
      console.error('Error fetching transaction status:', err);
      throw err;
    }
  }

  estimateConfirmationTime(confirmations: number = 0): string {
    const blocksRemaining = Math.max(0, 3 - confirmations);
    
    if (blocksRemaining === 0) {
      return 'Confirmed';
    }

    const minutesRemaining = blocksRemaining * 10;
    
    if (minutesRemaining < 60) {
      return `~${minutesRemaining} min`;
    }

    const hours = Math.floor(minutesRemaining / 60);
    const mins = minutesRemaining % 60;
    
    if (mins === 0) {
      return `~${hours}h`;
    }
    
    return `~${hours}h ${mins}m`;
  }

  getExplorerUrl(txId: string): string {
    return `https://explorer.hiro.so/txid/${txId}?chain=mainnet`;
  }

  clearCache(): void {
    this.txCache.clear();
    this.blockHeightCache = null;
  }
}

export const stacksApi = new StacksApiService();
