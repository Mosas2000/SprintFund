'use client';

import { useState, useEffect, useCallback } from 'react';
import { stacksApi } from '@/services/stacks-api';

/**
 * Hook to track and periodically update the current Stacks block height.
 * Refreshes every 30 seconds to stay reasonably in sync with the blockchain.
 */
export function useCurrentBlockHeight() {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHeight = useCallback(async () => {
    try {
      const height = await stacksApi.getCurrentBlockHeight();
      setBlockHeight(height);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch block height'));
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
