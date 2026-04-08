import { useEffect, useRef } from 'react';
import { useTransactionStore } from '../store/transactions';
import type { Transaction } from '../types/transaction';

export function useRefreshOnConfirmation(refreshCallback: () => void) {
  const { transactions } = useTransactionStore();
  const previousTransactionsRef = useRef<Record<string, Transaction>>({});

  useEffect(() => {
    const currentTransactions = transactions;
    const previousTransactions = previousTransactionsRef.current;

    Object.keys(currentTransactions).forEach((txId) => {
      const currentTx = currentTransactions[txId];
      const previousTx = previousTransactions[txId];

      if (
        previousTx &&
        previousTx.status === 'pending' &&
        currentTx.status === 'confirmed'
      ) {
        setTimeout(() => {
          refreshCallback();
        }, 2000);
      }
    });

    previousTransactionsRef.current = { ...currentTransactions };
  }, [transactions, refreshCallback]);
}
