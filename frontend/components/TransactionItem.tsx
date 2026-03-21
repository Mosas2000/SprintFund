'use client';

import { ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import TransactionStatusBadge from './TransactionStatusBadge';
import { stacksApi } from '@/services/stacks-api';
import type { Transaction } from '@/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const [showDetails, setShowDetails] = useState(false);

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
    <div
      className="flex flex-col gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
      role="listitem"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{getTransactionLabel()}</p>
          {transaction.proposalId !== undefined && (
            <p className="text-xs text-white/60 mt-0.5">Proposal #{transaction.proposalId}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 whitespace-nowrap">
          <span className="text-xs text-white/50">
            {formatTimestamp(transaction.timestamp)}
          </span>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            aria-label={`View transaction ${transaction.id} on Explorer`}
          >
            View
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TransactionStatusBadge
          status={transaction.status}
          confirmations={transaction.confirmations}
        />
        {transaction.status === 'pending' && estimatedTime && (
          <span className="text-xs text-white/50">{estimatedTime}</span>
        )}
      </div>

      {(transaction.error || transaction.confirmations !== undefined) && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80 transition-colors"
          aria-expanded={showDetails}
          aria-label="Toggle transaction details"
        >
          <ChevronDown
            className="h-3 w-3 transition-transform"
            style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          />
          Details
        </button>
      )}

      {showDetails && (
        <div className="text-xs text-white/60 space-y-1 pt-2 border-t border-white/10">
          {transaction.confirmations !== undefined && (
            <p>
              Confirmations: <span className="text-white">{transaction.confirmations}</span>
            </p>
          )}
          {transaction.blockHeight && (
            <p>
              Block: <span className="text-white">{transaction.blockHeight}</span>
            </p>
          )}
          {transaction.error && (
            <p className="text-red-400">
              Error: <span className="break-all">{transaction.error}</span>
            </p>
          )}
          <p>
            ID: <span className="font-mono break-all text-white/70">{transaction.id}</span>
          </p>
        </div>
      )}
    </div>
  );
}
