import { usePriceStore } from './price';

export const useStxPrice = () => usePriceStore((s) => s.price);

export const useStxPriceLoading = () => usePriceStore((s) => s.loading);

export const useStxPriceError = () => usePriceStore((s) => s.error);

export const useFetchStxPrice = () => usePriceStore((s) => s.fetchPrice);

export const useClearPriceError = () => usePriceStore((s) => s.clearError);
