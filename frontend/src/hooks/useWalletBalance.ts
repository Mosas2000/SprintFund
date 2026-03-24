import { useEffect, useCallback } from 'react';
import { useWalletAddress, useWalletConnected } from '../store/wallet-selectors';
import {
  useWalletBalance,
  useWalletBalanceLoading,
  useWalletBalanceError,
  useFetchWalletBalance,
  useClearWalletBalance,
} from '../store/balance-selectors';
import { microToStx } from '../config';

const REFRESH_INTERVAL_MS = 30000;

interface UseWalletBalanceReturn {
  stxBalance: number | null;
  stxLocked: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useWalletBalanceData(): UseWalletBalanceReturn {
  const connected = useWalletConnected();
  const address = useWalletAddress();
  const balance = useWalletBalance();
  const loading = useWalletBalanceLoading();
  const error = useWalletBalanceError();
  const fetchBalance = useFetchWalletBalance();
  const clearBalance = useClearWalletBalance();

  useEffect(() => {
    if (!connected || !address) {
      clearBalance();
      return;
    }

    fetchBalance(address);

    const interval = setInterval(() => {
      fetchBalance(address);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [connected, address, fetchBalance, clearBalance]);

  const refresh = useCallback(() => {
    if (address) {
      fetchBalance(address);
    }
  }, [address, fetchBalance]);

  return {
    stxBalance: balance ? microToStx(balance.stx) : null,
    stxLocked: balance ? microToStx(balance.stxLocked) : null,
    loading,
    error,
    refresh,
  };
}
