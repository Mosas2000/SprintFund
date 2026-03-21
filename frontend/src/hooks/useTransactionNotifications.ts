import { useEffect, useRef } from 'react';
import { useTransactionStore } from '../store/transactions';
import toast from 'react-hot-toast';
import type { Transaction } from '../types/transaction';

export function useTransactionNotifications() {
  const { transactions } = useTransactionStore();
  const previousTransactionsRef = useRef<Record<string, Transaction>>({});

  useEffect(() => {
    const currentTransactions = transactions;
    const previousTransactions = previousTransactionsRef.current;

    Object.keys(currentTransactions).forEach((txId) => {
      const currentTx = currentTransactions[txId];
      const previousTx = previousTransactions[txId];

      if (previousTx && previousTx.status !== currentTx.status) {
        const txLabel = getTransactionLabel(currentTx);

        switch (currentTx.status) {
          case 'confirmed':
            toast.success(`${txLabel} confirmed!`, {
              duration: 4000,
            });
            break;
          case 'failed':
            toast.error(`${txLabel} failed`, {
              duration: 5000,
            });
            break;
          case 'dropped':
            toast.error(`${txLabel} dropped`, {
              duration: 5000,
            });
            break;
        }
      }
    });

    previousTransactionsRef.current = { ...currentTransactions };
  }, [transactions]);
}

function getTransactionLabel(tx: Transaction): string {
  switch (tx.type) {
    case 'stake':
      return 'Stake transaction';
    case 'unstake':
      return 'Unstake transaction';
    case 'vote':
      return 'Vote';
    case 'create-proposal':
      return tx.title ? `"${tx.title}"` : 'Proposal';
    case 'execute':
      return 'Proposal execution';
    default:
      return 'Transaction';
  }
}
