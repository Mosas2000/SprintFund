'use client';

import { useState } from 'react';

interface Signer {
  address: string;
  name: string;
  signed: boolean;
  timestamp?: number;
}

interface Transaction {
  id: number;
  type: 'withdrawal' | 'transfer' | 'budget_change' | 'emergency';
  description: string;
  amount: number;
  recipient?: string;
  initiator: string;
  requiredSignatures: number;
  currentSignatures: number;
  signers: Signer[];
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  createdAt: number;
  threshold: number;
  deadline: number;
}

interface MultiSigConfig {
  totalSigners: number;
  requiredSignatures: number;
  largeWithdrawalThreshold: number;
  emergencyPauseEnabled: boolean;
  timelock: number;
}

export default function MultiSigTreasury() {
  const [config, setConfig] = useState<MultiSigConfig>({
    totalSigners: 5,
    requiredSignatures: 3,
    largeWithdrawalThreshold: 50000,
    emergencyPauseEnabled: true,
    timelock: 48
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'withdrawal',
      description: 'Grant payout for Proposal #42',
      amount: 75000,
      recipient: 'SP1ABC...DEF',
      initiator: 'SP9XYZ...123',
      requiredSignatures: 3,
      currentSignatures: 2,
      signers: [
        { address: 'SP9XYZ...123', name: 'Alice (Treasury Manager)', signed: true, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
        { address: 'SP8ABC...456', name: 'Bob (Finance Lead)', signed: true, timestamp: Date.now() - 1 * 60 * 60 * 1000 },
        { address: 'SP7DEF...789', name: 'Carol (Admin)', signed: false },
        { address: 'SP6GHI...012', name: 'Dave (Auditor)', signed: false },
        { address: 'SP5JKL...345', name: 'Eve (Advisor)', signed: false }
      ],
      status: 'pending',
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      threshold: 75000,
      deadline: Date.now() + 45 * 60 * 60 * 1000
    },
    {
      id: 2,
      type: 'budget_change',
      description: 'Increase DeFi category budget to 250K',
      amount: 250000,
      initiator: 'SP8ABC...456',
      requiredSignatures: 4,
      currentSignatures: 1,
      signers: [
        { address: 'SP9XYZ...123', name: 'Alice (Treasury Manager)', signed: false },
        { address: 'SP8ABC...456', name: 'Bob (Finance Lead)', signed: true, timestamp: Date.now() - 12 * 60 * 60 * 1000 },
        { address: 'SP7DEF...789', name: 'Carol (Admin)', signed: false },
        { address: 'SP6GHI...012', name: 'Dave (Auditor)', signed: false },
        { address: 'SP5JKL...345', name: 'Eve (Advisor)', signed: false }
      ],
      status: 'pending',
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
      threshold: 50000,
      deadline: Date.now() + 24 * 60 * 60 * 1000
    },
    {
      id: 3,
      type: 'withdrawal',
      description: 'Operational expenses - Q1 2024',
      amount: 35000,
      recipient: 'SP2MNO...PQR',
      initiator: 'SP9XYZ...123',
      requiredSignatures: 3,
      currentSignatures: 3,
      signers: [
        { address: 'SP9XYZ...123', name: 'Alice (Treasury Manager)', signed: true, timestamp: Date.now() - 48 * 60 * 60 * 1000 },
        { address: 'SP8ABC...456', name: 'Bob (Finance Lead)', signed: true, timestamp: Date.now() - 46 * 60 * 60 * 1000 },
        { address: 'SP7DEF...789', name: 'Carol (Admin)', signed: true, timestamp: Date.now() - 45 * 60 * 60 * 1000 },
        { address: 'SP6GHI...012', name: 'Dave (Auditor)', signed: false },
        { address: 'SP5JKL...345', name: 'Eve (Advisor)', signed: false }
      ],
      status: 'executed',
      createdAt: Date.now() - 72 * 60 * 60 * 1000,
      threshold: 50000,
      deadline: Date.now() - 24 * 60 * 60 * 1000
    }
  ]);

  const [showNewTxModal, setShowNewTxModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | Transaction['status']>('all');

  const currentUser = 'SP7DEF...789'; // Simulating current user

  const signTransaction = (txId: number) => {
    setTransactions(transactions.map(tx => {
      if (tx.id === txId) {
        const updatedSigners = tx.signers.map(s => 
          s.address === currentUser && !s.signed
            ? { ...s, signed: true, timestamp: Date.now() }
            : s
        );
        const currentSigs = updatedSigners.filter(s => s.signed).length;
        const newStatus = currentSigs >= tx.requiredSignatures ? 'approved' : 'pending';
        
        return {
          ...tx,
          signers: updatedSigners,
          currentSignatures: currentSigs,
          status: newStatus as Transaction['status']
        };
      }
      return tx;
    }));
  };

  const executeTransaction = (txId: number) => {
    setTransactions(transactions.map(tx =>
      tx.id === txId ? { ...tx, status: 'executed' as const } : tx
    ));
  };

  const rejectTransaction = (txId: number) => {
    setTransactions(transactions.map(tx =>
      tx.id === txId ? { ...tx, status: 'rejected' as const } : tx
    ));
  };

  const emergencyPause = () => {
    if (confirm('Are you sure you want to pause all treasury operations? This requires multi-sig approval to reverse.')) {
      setIsPaused(true);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    filterStatus === 'all' || tx.status === filterStatus
  );

  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;
  const approvedCount = transactions.filter(tx => tx.status === 'approved').length;

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'approved': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'executed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'rejected': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'withdrawal': return '💰';
      case 'transfer': return '🔄';
      case 'budget_change': return '📊';
      case 'emergency': return '🚨';
    }
  };

  const formatTimeRemaining = (deadline: number) => {
    const diff = deadline - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d remaining`;
    if (hours > 0) return `${hours}h remaining`;
    return 'Expired';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">🔐 Multi-Sig Treasury</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Require {config.requiredSignatures} of {config.totalSigners} signatures for large withdrawals
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium 
                     hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ⚙️ Configure
          </button>
          {config.emergencyPauseEnabled && (
            <button
              onClick={emergencyPause}
              disabled={isPaused}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isPaused
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isPaused ? '⏸️ Paused' : '🚨 Emergency Pause'}
            </button>
          )}
          <button
            onClick={() => setShowNewTxModal(true)}
            disabled={isPaused}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            + New Transaction
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      {isPaused && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚨</div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 dark:text-red-300">Treasury Operations Paused</h3>
              <p className="text-sm text-red-700 dark:text-red-400">
                All treasury operations are temporarily suspended. Multi-sig approval required to resume.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              Request Resume
            </button>
          </div>
        </div>
      )}

      {/* Configuration Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Signature Requirement</div>
          <div className="text-2xl font-bold text-blue-600">
            {config.requiredSignatures} of {config.totalSigners}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Large Withdrawal</div>
          <div className="text-2xl font-bold text-purple-600">
            {(config.largeWithdrawalThreshold / 1000).toFixed(0)}K STX
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Approvals</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ready to Execute</div>
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'executed', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions Queue */}
      <div className="space-y-4">
        {filteredTransactions.map(tx => (
          <div
            key={tx.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{getTypeIcon(tx.type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{tx.description}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Initiated by {tx.initiator} • {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {(tx.amount / 1000).toFixed(0)}K STX
                    </span>
                  </div>
                </div>

                {/* Signature Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Signatures: {tx.currentSignatures} / {tx.requiredSignatures}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatTimeRemaining(tx.deadline)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        tx.currentSignatures >= tx.requiredSignatures
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${(tx.currentSignatures / tx.requiredSignatures) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Signers */}
                <div className="space-y-2 mb-4">
                  {tx.signers.map(signer => (
                    <div
                      key={signer.address}
                      className={`flex items-center justify-between p-2 rounded ${
                        signer.signed
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : 'bg-gray-50 dark:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          signer.signed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`} />
                        <span className="text-sm font-medium">{signer.name}</span>
                        <span className="text-xs text-gray-500">{signer.address}</span>
                      </div>
                      {signer.signed && signer.timestamp && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Signed {new Date(signer.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {tx.status === 'pending' && !tx.signers.find(s => s.address === currentUser)?.signed && (
                    <button
                      onClick={() => signTransaction(tx.id)}
                      disabled={isPaused}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 
                               disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      ✍️ Sign Transaction
                    </button>
                  )}
                  {tx.status === 'approved' && (
                    <button
                      onClick={() => executeTransaction(tx.id)}
                      disabled={isPaused}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 
                               disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      ✅ Execute
                    </button>
                  )}
                  {tx.status === 'pending' && (
                    <button
                      onClick={() => rejectTransaction(tx.id)}
                      className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 rounded-lg text-sm 
                               font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      ✕ Reject
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                                   font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                    📄 View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Multi-Sig Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Required Signatures ({config.requiredSignatures} of {config.totalSigners})
                </label>
                <input
                  type="range"
                  min="1"
                  max={config.totalSigners}
                  value={config.requiredSignatures}
                  onChange={(e) => setConfig({ ...config, requiredSignatures: Number(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Large Withdrawal Threshold (STX)
                </label>
                <input
                  type="number"
                  value={config.largeWithdrawalThreshold}
                  onChange={(e) => setConfig({ ...config, largeWithdrawalThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.emergencyPauseEnabled}
                    onChange={(e) => setConfig({ ...config, emergencyPauseEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Enable Emergency Pause Mechanism</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Timelock Period (hours)
                </label>
                <input
                  type="number"
                  value={config.timelock}
                  onChange={(e) => setConfig({ ...config, timelock: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Save Configuration
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium
                         hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
