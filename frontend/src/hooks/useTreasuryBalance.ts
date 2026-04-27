import { useState, useEffect } from 'react';
import { API_URL, CONTRACT_ADDRESS, CONTRACT_NAME, microToStx } from '../config';
import { normalizeError } from '../lib/error-normalizer';

interface TreasuryBalanceState {
  balance: number | null;
  balanceInStx: number | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTreasuryBalance(): TreasuryBalanceState {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTreasuryBalance = async () => {
    setLoading(true);
    setError(null);

    try {
      const contractAddress = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;
      const url = `${API_URL}/extended/v1/address/${contractAddress}/stx`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch treasury balance: ${response.statusText}`);
      }

      const data = await response.json();
      setBalance(Number(data.balance) || 0);
    } catch (err) {
      const normalized = normalizeError(err);
      setError(normalized.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreasuryBalance();
    const interval = setInterval(fetchTreasuryBalance, 60000);
    return () => clearInterval(interval);
  }, []);

  return {
    balance,
    balanceInStx: balance !== null ? microToStx(balance) : null,
    loading,
    error,
    refetch: fetchTreasuryBalance,
  };
}
