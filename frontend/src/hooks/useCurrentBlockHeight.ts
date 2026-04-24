'use client';

import { useState, useEffect, useCallback } from 'react';
import { stacksApi } from '@/services/stacks-api';

/**
 * Hook to track and periodically update the current Stacks block height.
 * Refreshes every 30 seconds to stay reasonably in sync with the blockchain.
 * 
 * Used for real-time governance countdowns and execution gating.
 * 
 * @returns {Object} { blockHeight, loading, error, refresh }
 *  - blockHeight: The latest block number (null if not yet loaded)
 *  - loading: True if the initial fetch is in progress
 *  - error: Any error during fetch
 *  - refresh: Manual trigger to update the height immediately
 */
import { normalizeError } from '@/lib/error-normalizer';
import type { NormalizedError } from '@/lib/error-normalizer';

export function useCurrentBlockHeight() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<NormalizedError | null>(null);

  const fetchHeight = useCallback(async () => {
    try {
      const height = await stacksApi.getCurrentBlockHeight();
      setBlockHeight(height);
      setError(null);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeight();

    const interval = setInterval(fetchHeight, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [fetchHeight]);

  return { blockHeight, loading, error, refresh: fetchHeight };
}
