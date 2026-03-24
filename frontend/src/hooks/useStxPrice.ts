import { useEffect, useCallback } from 'react';
import {
  useStxPrice,
  useStxPriceLoading,
  useStxPriceError,
  useFetchStxPrice,
} from '../store/price-selectors';

const REFRESH_INTERVAL_MS = 60000;

interface UseStxPriceReturn {
  price: number | null;
  change24h: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useStxPriceData(): UseStxPriceReturn {
  const priceData = useStxPrice();
  const loading = useStxPriceLoading();
  const error = useStxPriceError();
  const fetchPrice = useFetchStxPrice();

  useEffect(() => {
    fetchPrice();

    const interval = setInterval(() => {
      fetchPrice();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchPrice]);

  const refresh = useCallback(() => {
    fetchPrice();
  }, [fetchPrice]);

  return {
    price: priceData?.usd ?? null,
    change24h: priceData?.usdChange24h ?? null,
    loading,
    error,
    refresh,
  };
}
