'use client';

import { useState, useEffect } from 'react';

interface Payment {
  id: number;
  grantee: string;
  proposalId: number;
  proposalTitle: string;
  amount: number;
  type: 'milestone' | 'recurring' | 'one-time';
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  scheduledDate: number;
  completedDate?: number;
  milestone?: string;
  recurringInterval?: 'weekly' | 'monthly' | 'quarterly';
  nextPayment?: number;
  receiptsUrl?: string;
  batchId?: string;
  retryCount?: number;
}

interface PaymentBatch {
  id: string;
  payments: number[];
  totalAmount: number;
  scheduledDate: number;
  status: 'pending' | 'processing' | 'completed';
  gasOptimization: number;
}

export default function PayoutScheduler() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      grantee: 'SP1ABC...DEF',
      proposalId: 42,
      proposalTitle: 'DeFi Lending Protocol',
      amount: 25000,
      type: 'milestone',
      status: 'scheduled',
      scheduledDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
      milestone: 'Phase 1: Smart Contract Development'
    },
    {
      id: 2,
      grantee: 'SP2XYZ...GHI',
      proposalId: 28,
      proposalTitle: 'NFT Marketplace',
      amount: 15000,
      type: 'recurring',
      status: 'scheduled',
      scheduledDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
      recurringInterval: 'monthly',
      nextPayment: Date.now() + 35 * 24 * 60 * 60 * 1000
    },
    {
      id: 3,
      grantee: 'SP1ABC...DEF',
      proposalId: 42,
      proposalTitle: 'DeFi Lending Protocol',
      amount: 25000,
      type: 'milestone',
      status: 'completed',
      scheduledDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
      completedDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
      milestone: 'Phase 0: Planning & Design',
      receiptsUrl: '/receipts/payment-003.pdf'
    },
    {
      id: 4,
      grantee: 'SP3MNO...PQR',
      proposalId: 15,
      proposalTitle: 'DAO Governance Dashboard',
      amount: 10000,
      type: 'one-time',
      status: 'failed',
      scheduledDate: Date.now() - 2 * 24 * 60 * 60 * 1000,
      retryCount: 2
    }
  ]);

  const [batches, setBatches] = useState<PaymentBatch[]>([
    {
      id: 'BATCH-001',
      payments: [1, 2],
      totalAmount: 40000,
      scheduledDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
      status: 'pending',
      gasOptimization: 35
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | Payment['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Payment['type']>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const [newPayment, setNewPayment] = useState({
    grantee: '',
    proposalId: 0,
    proposalTitle: '',
    amount: 0,
    type: 'milestone' as Payment['type'],
    scheduledDate: new Date().toISOString().split('T')[0],
    milestone: '',
    recurringInterval: 'monthly' as 'weekly' | 'monthly' | 'quarterly'
  });

  const retryPayment = (paymentId: number) => {
    setPayments(payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'processing' as const, retryCount: (p.retryCount || 0) + 1 }
        : p
    ));

    // Simulate retry
    setTimeout(() => {
      setPayments(payments.map(p => 
        p.id === paymentId 
          ? { ...p, status: 'completed' as const, completedDate: Date.now() }
          : p
      ));
    }, 2000);
  };

  const schedulePayment = () => {
    const payment: Payment = {
      id: payments.length + 1,
      grantee: newPayment.grantee,
      proposalId: newPayment.proposalId,
      proposalTitle: newPayment.proposalTitle,
      amount: newPayment.amount,
      type: newPayment.type,
      status: 'scheduled',
      scheduledDate: new Date(newPayment.scheduledDate).getTime(),
      milestone: newPayment.type === 'milestone' ? newPayment.milestone : undefined,
      recurringInterval: newPayment.type === 'recurring' ? newPayment.recurringInterval : undefined,
      nextPayment: newPayment.type === 'recurring' 
        ? new Date(newPayment.scheduledDate).getTime() + 30 * 24 * 60 * 60 * 1000 
        : undefined
    };

    setPayments([...payments, payment]);
    setShowScheduleModal(false);
    setNewPayment({
      grantee: '',
      proposalId: 0,
      proposalTitle: '',
      amount: 0,
      type: 'milestone',
      scheduledDate: new Date().toISOString().split('T')[0],
      milestone: '',
      recurringInterval: 'monthly'
    });
  };

  const filteredPayments = payments.filter(p => {
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesStatus && matchesType;
  });

  const stats = {
    scheduled: payments.filter(p => p.status === 'scheduled').length,
    processing: payments.filter(p => p.status === 'processing').length,
    completed: payments.filter(p => p.status === 'completed').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalScheduled: payments.filter(p => p.status === 'scheduled').reduce((sum, p) => sum + p.amount, 0)
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'processing': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'failed': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    }
  };

  const getTypeIcon = (type: Payment['type']) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'recurring': return '🔄';
      case 'one-time': return '💰';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">📅 Payout Scheduler</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automate milestone-based and recurring payments
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBatchModal(true)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium 
                     hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            📦 View Batches
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Schedule Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
          <div className="text-xs text-gray-500 mt-1">
            {(stats.totalScheduled / 1000).toFixed(0)}K STX
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-2xl font-bold text-purple-600">{batches.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Batches</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="milestone">Milestone</option>
          <option value="recurring">Recurring</option>
          <option value="one-time">One-Time</option>
        </select>
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {filteredPayments.map(payment => (
          <div
            key={payment.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{getTypeIcon(payment.type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{payment.proposalTitle}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Proposal #{payment.proposalId} • {payment.grantee}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {(payment.amount / 1000).toFixed(0)}K STX
                    </span>
                  </div>
                </div>

                {payment.milestone && (
                  <div className="mb-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Milestone: </span>
                    <span className="font-medium">{payment.milestone}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Type</div>
                    <div className="font-medium capitalize">{payment.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Scheduled</div>
                    <div className="font-medium">
                      {new Date(payment.scheduledDate).toLocaleDateString()}
                    </div>
                  </div>
                  {payment.completedDate && (
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Completed</div>
                      <div className="font-medium">
                        {new Date(payment.completedDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {payment.nextPayment && (
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Next Payment</div>
                      <div className="font-medium">
                        {new Date(payment.nextPayment).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                  {payment.recurringInterval && (
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Frequency</div>
                      <div className="font-medium capitalize">{payment.recurringInterval}</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {payment.status === 'failed' && (
                    <button
                      onClick={() => retryPayment(payment.id)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700"
                    >
                      🔄 Retry Payment {payment.retryCount ? `(Attempt ${payment.retryCount + 1})` : ''}
                    </button>
                  )}
                  {payment.receiptsUrl && (
                    <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm 
                                     hover:bg-gray-50 dark:hover:bg-gray-700">
                      📄 View Receipt
                    </button>
                  )}
                  {payment.status === 'scheduled' && (
                    <>
                      <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm 
                                       hover:bg-gray-50 dark:hover:bg-gray-700">
                        ✏️ Edit
                      </button>
                      <button className="px-3 py-1 border border-red-300 dark:border-red-600 text-red-600 rounded text-sm 
                                       hover:bg-red-50 dark:hover:bg-red-900/20">
                        ✕ Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Payment Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Schedule New Payment</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Grantee Address</label>
                  <input
                    type="text"
                    value={newPayment.grantee}
                    onChange={(e) => setNewPayment({ ...newPayment, grantee: e.target.value })}
                    placeholder="SP1ABC...DEF"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Proposal ID</label>
                  <input
                    type="number"
                    value={newPayment.proposalId || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, proposalId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Proposal Title</label>
                <input
                  type="text"
                  value={newPayment.proposalTitle}
                  onChange={(e) => setNewPayment({ ...newPayment, proposalTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (STX)</label>
                  <input
                    type="number"
                    value={newPayment.amount || ''}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Type</label>
                  <select
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="milestone">Milestone</option>
                    <option value="recurring">Recurring</option>
                    <option value="one-time">One-Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={newPayment.scheduledDate}
                  onChange={(e) => setNewPayment({ ...newPayment, scheduledDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {newPayment.type === 'milestone' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Milestone Description</label>
                  <input
                    type="text"
                    value={newPayment.milestone}
                    onChange={(e) => setNewPayment({ ...newPayment, milestone: e.target.value })}
                    placeholder="e.g., Phase 1: Smart Contract Development"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {newPayment.type === 'recurring' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Recurring Interval</label>
                  <select
                    value={newPayment.recurringInterval}
                    onChange={(e) => setNewPayment({ ...newPayment, recurringInterval: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={schedulePayment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Schedule Payment
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
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
