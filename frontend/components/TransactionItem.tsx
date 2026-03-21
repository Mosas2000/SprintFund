'use client';

import { ExternalLink } from 'lucide-react';
import TransactionStatusBadge from './TransactionStatusBadge';
import { stacksApi } from '@/services/stacks-api';
import type { Transaction } from '@/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    }

    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionLabel = () => {
    switch (transaction.type) {
      case 'stake':
        return `Stake ${transaction.amount ? (transaction.amount / 1_000_000).toFixed(2) : ''} STX`;
      case 'unstake':
        return 'Unstake STX';
      case 'vote':
        return transaction.title ? `Vote on "${transaction.title}"` : 'Vote on Proposal';
      case 'create-proposal':
        return transaction.title ? `Create "${transaction.title}"` : 'Create Proposal';
      case 'execute':
        return transaction.title ? `Execute "${transaction.title}"` : 'Execute Proposal';
      default:
        return 'Unknown Transaction';
    }
  };

  const explorerUrl = stacksApi.getExplorerUrl(transaction.id);
  const estimatedTime = transaction.confirmations !== undefined
    ? stacksApi.estimateConfirmationTime(transaction.confirmations)
    : null;

  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-white truncate">{getTransactionLabel()}</p>
            {transaction.proposalId !== undefined && (
              <p className="text-xs text-white/60 mt-0.5">Proposal #{transaction.proposalId}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <TransactionStatusBadge
                status={transaction.status}
                confirmations={transaction.confirmations}
              />
              {transaction.status === 'pending' && estimatedTime && (
                <span className="text-xs text-white/50">{estimatedTime}</span>
              )}
            </div>
            {transaction.error && (
              <p className="text-xs text-red-400 mt-1 truncate">{transaction.error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-white/50 whitespace-nowrap">
          {formatTimestamp(transaction.timestamp)}
        </span>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
