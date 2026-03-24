import { useBalanceStore } from './balance';

export const useWalletBalance = () => useBalanceStore((s) => s.balance);

export const useWalletBalanceLoading = () => useBalanceStore((s) => s.loading);

export const useWalletBalanceError = () => useBalanceStore((s) => s.error);

export const useWalletBalanceLastUpdated = () => useBalanceStore((s) => s.lastUpdated);

export const useFetchWalletBalance = () => useBalanceStore((s) => s.fetchBalance);

export const useClearWalletBalance = () => useBalanceStore((s) => s.clearBalance);

export const useClearBalanceError = () => useBalanceStore((s) => s.clearError);
