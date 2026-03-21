'use client';

import { useState, useEffect } from 'react';
import { useTransactionStore } from '@/store/transactions';
import { useTransactionPolling } from '@/hooks/useTransactionPolling';
import TransactionItem from './TransactionItem';
import { History, Filter, X } from 'lucide-react';
import type { TransactionStatus, TransactionType } from '@/types/transaction';

export default function TransactionHistory() {
  const { transactions } = useTransactionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  useTransactionPolling();

  const transactionList = Object.values(transactions).sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  const filteredTransactions = transactionList.filter((tx) => {
    if (filterStatus !== 'all' && tx.status !== filterStatus) return false;
    if (filterType !== 'all' && tx.type !== filterType) return false;
    return true;
  });

  const pendingCount = transactionList.filter((tx) => tx.status === 'pending').length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 't') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        aria-label="Transaction History"
      >
        <History className="h-5 w-5" />
        <span className="font-medium">Transactions</span>
        {pendingCount > 0 && (
          <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-yellow-500 text-white text-xs font-bold rounded-full">
            {pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                <p className="text-sm text-white/60 mt-1">
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TransactionStatus | 'all')}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="failed">Failed</option>
                <option value="dropped">Dropped</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="stake">Stake</option>
                <option value="unstake">Unstake</option>
                <option value="vote">Vote</option>
                <option value="create-proposal">Create Proposal</option>
                <option value="execute">Execute</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="h-12 w-12 text-white/20 mb-4" />
                  <p className="text-white/60">No transactions found</p>
                  <p className="text-sm text-white/40 mt-1">
                    Your transaction history will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((tx) => (
                    <TransactionItem key={tx.id} transaction={tx} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
