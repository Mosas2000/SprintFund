'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface WithdrawVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  proposalTitle: string;
  currentVote: {
    direction: 'YES' | 'NO';
    weight: number;
    cost: number;
    timestamp: number;
  };
  proposalDeadline: number;
}

export default function WithdrawVoteModal({
  isOpen,
  onClose,
  proposalId,
  proposalTitle,
  currentVote,
  proposalDeadline
}: WithdrawVoteModalProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (!isOpen) return null;

  const calculateRefund = () => {
    const now = Date.now();
    const timeRemaining = proposalDeadline - now;
    const totalTime = proposalDeadline - currentVote.timestamp;
    const refundPercentage = Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100));
    
    return {
      percentage: refundPercentage,
      amount: (currentVote.cost * refundPercentage) / 100
    };
  };

  const refund = calculateRefund();

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    
    try {
      // Simulate withdrawal (in real implementation, this would call contract)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update vote in localStorage
      localStorage.removeItem(`vote-${proposalId}`);
      
      // Add to history with "withdrawn" status
      const withdrawal = {
        proposalId,
        proposalTitle,
        action: 'WITHDRAWN',
        originalVote: current Vote,
        refundAmount: refund.amount,
        timestamp: Date.now()
      };
      
      const history = JSON.parse(localStorage.getItem('vote-withdrawals') || '[]');
      history.push(withdrawal);
      localStorage.setItem('vote-withdrawals', JSON.stringify(history));
      
      toast.success(`Vote withdrawn! Refunded ${refund.amount.toFixed(2)} STX`);
      onClose();
    } catch (error) {
      toast.error('Failed to withdraw vote');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Withdraw Vote
        </h2>

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                Confirm Vote Withdrawal
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You are about to withdraw your vote from this proposal. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Current Vote Info */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Current Vote</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Proposal:</span>
              <span className="font-medium text-gray-900 dark:text-white">{proposalTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Direction:</span>
              <span className={`font-semibold ${
                currentVote.direction === 'YES' ? 'text-green-600' : 'text-red-600'
              }`}>
                {currentVote.direction}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Weight:</span>
              <span className="font-medium text-gray-900 dark:text-white">{currentVote.weight}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cost:</span>
              <span className="font-medium text-gray-900 dark:text-white">{currentVote.cost} STX</span>
            </div>
          </div>
        </div>

        {/* Refund Calculation */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-200">Refund Amount</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-700 dark:text-blue-300">Time Remaining</span>
                <span className="font-medium text-blue-900 dark:text-blue-100">{refund.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                  style={{ width: `${refund.percentage}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-blue-700 dark:text-blue-300">You'll receive:</span>
                <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {refund.amount.toFixed(2)} STX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-900/50 rounded text-sm text-gray-600 dark:text-gray-400">
          <p>💡 Refund decreases as the proposal deadline approaches. Withdraw early for maximum refund!</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isWithdrawing}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isWithdrawing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Withdrawing...
              </>
            ) : (
              'Withdraw Vote'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
