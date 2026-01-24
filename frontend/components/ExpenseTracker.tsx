'use client';

import { useState } from 'react';

interface Expense {
  id: number;
  date: number;
  category: string;
  description: string;
  amount: number;
  type: 'grant_payout' | 'operational' | 'infrastructure' | 'marketing' | 'community' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedBy: string;
  approvedBy?: string;
  receipt?: string;
  receiptUrl?: string;
  recurring: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'quarterly';
  notes?: string;
  proposalId?: number;
}

interface ExpenseApproval {
  expenseId: number;
  approver: string;
  status: 'approved' | 'rejected';
  reason?: string;
  timestamp: number;
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      date: Date.now() - 2 * 24 * 60 * 60 * 1000,
      category: 'DeFi',
      description: 'Grant #42 - DeFi Protocol Development',
      amount: 75000,
      type: 'grant_payout',
      status: 'approved',
      submittedBy: 'SP9XYZ...123',
      approvedBy: 'SP8ABC...456',
      receipt: 'Receipt_75K_Grant42.pdf',
      receiptUrl: '#',
      recurring: false,
      proposalId: 42
    },
    {
      id: 2,
      date: Date.now() - 5 * 24 * 60 * 60 * 1000,
      category: 'Infrastructure',
      description: 'AWS Cloud Services',
      amount: 3500,
      type: 'infrastructure',
      status: 'approved',
      submittedBy: 'SP7DEF...789',
      approvedBy: 'SP9XYZ...123',
      receipt: 'AWS_Invoice_Jan2024.pdf',
      receiptUrl: '#',
      recurring: true,
      recurringPeriod: 'monthly',
      notes: 'Monthly recurring expense for cloud infrastructure'
    },
    {
      id: 3,
      date: Date.now() - 7 * 24 * 60 * 60 * 1000,
      category: 'Marketing',
      description: 'Social Media Campaign - Q1',
      amount: 8000,
      type: 'marketing',
      status: 'pending',
      submittedBy: 'SP6GHI...012',
      receipt: 'Marketing_Quote.pdf',
      receiptUrl: '#',
      recurring: false
    },
    {
      id: 4,
      date: Date.now() - 10 * 24 * 60 * 60 * 1000,
      category: 'Operational',
      description: 'Legal & Compliance Consulting',
      amount: 12000,
      type: 'operational',
      status: 'approved',
      submittedBy: 'SP5JKL...345',
      approvedBy: 'SP8ABC...456',
      receipt: 'Legal_Invoice_Q1.pdf',
      receiptUrl: '#',
      recurring: true,
      recurringPeriod: 'quarterly'
    },
    {
      id: 5,
      date: Date.now() - 1 * 24 * 60 * 60 * 1000,
      category: 'Community',
      description: 'Community Event Sponsorship',
      amount: 5000,
      type: 'community',
      status: 'pending',
      submittedBy: 'SP4MNO...678',
      receipt: 'Event_Proposal.pdf',
      receiptUrl: '#',
      recurring: false,
      notes: 'Blockchain conference in March'
    },
    {
      id: 6,
      date: Date.now() - 15 * 24 * 60 * 60 * 1000,
      category: 'NFT',
      description: 'Grant #38 - NFT Marketplace',
      amount: 45000,
      type: 'grant_payout',
      status: 'paid',
      submittedBy: 'SP9XYZ...123',
      approvedBy: 'SP7DEF...789',
      receipt: 'Receipt_45K_Grant38.pdf',
      receiptUrl: '#',
      recurring: false,
      proposalId: 38
    }
  ]);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Expense['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Expense['type']>('all');
  const [showRecurring, setShowRecurring] = useState(false);

  const currentUser = 'SP8ABC...456'; // Simulating approver

  const approveExpense = (expenseId: number) => {
    setExpenses(expenses.map(exp =>
      exp.id === expenseId
        ? { ...exp, status: 'approved' as const, approvedBy: currentUser }
        : exp
    ));
  };

  const rejectExpense = (expenseId: number, reason: string) => {
    setExpenses(expenses.map(exp =>
      exp.id === expenseId
        ? { ...exp, status: 'rejected' as const, notes: reason }
        : exp
    ));
  };

  const markAsPaid = (expenseId: number) => {
    setExpenses(expenses.map(exp =>
      exp.id === expenseId
        ? { ...exp, status: 'paid' as const }
        : exp
    ));
  };

  const filteredExpenses = expenses.filter(exp => {
    const statusMatch = filterStatus === 'all' || exp.status === filterStatus;
    const typeMatch = filterType === 'all' || exp.type === typeMatch;
    const recurringMatch = !showRecurring || exp.recurring;
    return statusMatch && typeMatch && recurringMatch;
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses.filter(exp => exp.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0);

  const recurringTotal = expenses.filter(exp => exp.recurring).reduce((sum, exp) => sum + exp.amount, 0);
  const recurringCount = expenses.filter(exp => exp.recurring).length;

  const categoryBreakdown = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: Expense['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'approved': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'paid': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'rejected': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    }
  };

  const getTypeIcon = (type: Expense['type']) => {
    switch (type) {
      case 'grant_payout': return '💰';
      case 'operational': return '⚙️';
      case 'infrastructure': return '🏗️';
      case 'marketing': return '📢';
      case 'community': return '👥';
      case 'other': return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">📊 Expense Tracker</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track and approve all treasury expenses
          </p>
        </div>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Submit Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 
                      rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Expenses</div>
          <div className="text-2xl font-bold text-blue-600">{(totalExpenses / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">{expenses.length} total transactions</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 
                      rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">{(pendingExpenses / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">
            {expenses.filter(e => e.status === 'pending').length} items
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 
                      rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Paid Out</div>
          <div className="text-2xl font-bold text-green-600">{(paidExpenses / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">
            {expenses.filter(e => e.status === 'paid').length} completed
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 
                      rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recurring Expenses</div>
          <div className="text-2xl font-bold text-purple-600">{(recurringTotal / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">{recurringCount} recurring items</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Expenses by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(categoryBreakdown).map(([category, amount]) => (
            <div key={category} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{category}</div>
              <div className="text-xl font-bold">{(amount / 1000).toFixed(0)}K</div>
              <div className="text-xs text-gray-500">
                {((amount / totalExpenses) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                   focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                   focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="grant_payout">Grant Payouts</option>
          <option value="operational">Operational</option>
          <option value="infrastructure">Infrastructure</option>
          <option value="marketing">Marketing</option>
          <option value="community">Community</option>
          <option value="other">Other</option>
        </select>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                        bg-white dark:bg-gray-700">
          <input
            type="checkbox"
            checked={showRecurring}
            onChange={(e) => setShowRecurring(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm">Recurring Only</span>
        </label>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map(expense => (
          <div
            key={expense.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{getTypeIcon(expense.type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{expense.description}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {expense.category} • {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {(expense.amount / 1000).toFixed(1)}K STX
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {expense.recurring && (
                  <div className="mb-2 inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/20 
                                rounded text-xs font-medium text-purple-600">
                    🔁 Recurring: {expense.recurringPeriod}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Submitted by:</span>
                    <div className="font-medium">{expense.submittedBy}</div>
                  </div>
                  {expense.approvedBy && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Approved by:</span>
                      <div className="font-medium">{expense.approvedBy}</div>
                    </div>
                  )}
                  {expense.proposalId && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Proposal:</span>
                      <div className="font-medium">#{expense.proposalId}</div>
                    </div>
                  )}
                  {expense.receipt && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Receipt:</span>
                      <button
                        onClick={() => {
                          setSelectedExpense(expense);
                          setShowReceiptModal(true);
                        }}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View Document
                      </button>
                    </div>
                  )}
                </div>

                {expense.notes && (
                  <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm">
                    <span className="font-medium">Notes: </span>
                    {expense.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {expense.status === 'pending' && (
                    <>
                      <button
                        onClick={() => approveExpense(expense.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) rejectExpense(expense.id, reason);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}
                  {expense.status === 'approved' && (
                    <button
                      onClick={() => markAsPaid(expense.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      💸 Mark as Paid
                    </button>
                  )}
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                             font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    📄 View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">Receipt / Documentation</h3>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Expense: {selectedExpense.description}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Amount: {(selectedExpense.amount / 1000).toFixed(1)}K STX
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed 
                            border-gray-300 dark:border-gray-600">
                <div className="text-6xl mb-4">📄</div>
                <div className="font-medium mb-2">{selectedExpense.receipt}</div>
                <button className="text-blue-600 hover:underline text-sm">
                  Download Document
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setShowReceiptModal(false);
                setSelectedExpense(null);
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
