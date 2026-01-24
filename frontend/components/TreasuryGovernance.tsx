'use client';

import { useState } from 'react';

interface SpendingLimit {
  id: number;
  category: string;
  limitAmount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  currentSpend: number;
  requiresVote: boolean;
  threshold: number;
}

interface TreasuryParameter {
  id: number;
  name: string;
  description: string;
  currentValue: string | number;
  proposedValue?: string | number;
  lastUpdated: number;
  updatedBy: string;
  requiresVote: boolean;
}

interface AuditEntry {
  id: number;
  timestamp: number;
  action: string;
  actor: string;
  category: string;
  amount?: number;
  description: string;
  transactionHash?: string;
  voteId?: number;
}

interface EmergencyProcedure {
  id: number;
  name: string;
  description: string;
  threshold: number;
  signaturesRequired: number;
  cooldownPeriod: number;
  status: 'active' | 'inactive' | 'triggered';
  lastTriggered?: number;
}

export default function TreasuryGovernance() {
  const [spendingLimits, setSpendingLimits] = useState<SpendingLimit[]>([
    {
      id: 1,
      category: 'DeFi',
      limitAmount: 250000,
      period: 'monthly',
      currentSpend: 175000,
      requiresVote: true,
      threshold: 50000
    },
    {
      id: 2,
      category: 'NFT',
      limitAmount: 180000,
      period: 'monthly',
      currentSpend: 95000,
      requiresVote: true,
      threshold: 50000
    },
    {
      id: 3,
      category: 'Infrastructure',
      limitAmount: 200000,
      period: 'monthly',
      currentSpend: 145000,
      requiresVote: true,
      threshold: 50000
    },
    {
      id: 4,
      category: 'Operational',
      limitAmount: 50000,
      period: 'monthly',
      currentSpend: 28000,
      requiresVote: false,
      threshold: 10000
    }
  ]);

  const [parameters, setParameters] = useState<TreasuryParameter[]>([
    {
      id: 1,
      name: 'Min Proposal Threshold',
      description: 'Minimum STX required to create a funding proposal',
      currentValue: 10000,
      lastUpdated: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedBy: 'SP9XYZ...123',
      requiresVote: true
    },
    {
      id: 2,
      name: 'Vote Pass Percentage',
      description: 'Percentage of votes needed for proposal approval',
      currentValue: '60%',
      lastUpdated: Date.now() - 60 * 24 * 60 * 60 * 1000,
      updatedBy: 'SP8ABC...456',
      requiresVote: true
    },
    {
      id: 3,
      name: 'Treasury Manager Multi-Sig',
      description: 'Number of signatures required for large withdrawals',
      currentValue: '3 of 5',
      lastUpdated: Date.now() - 90 * 24 * 60 * 60 * 1000,
      updatedBy: 'SP7DEF...789',
      requiresVote: true
    },
    {
      id: 4,
      name: 'Emergency Pause Threshold',
      description: 'Amount that triggers emergency review',
      currentValue: 100000,
      lastUpdated: Date.now() - 45 * 24 * 60 * 60 * 1000,
      updatedBy: 'SP9XYZ...123',
      requiresVote: true
    }
  ]);

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: 1,
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      action: 'Grant Payout',
      actor: 'SP9XYZ...123',
      category: 'DeFi',
      amount: 75000,
      description: 'Proposal #42 - DeFi Protocol Development',
      transactionHash: '0xabc...def'
    },
    {
      id: 2,
      timestamp: Date.now() - 5 * 60 * 60 * 1000,
      action: 'Budget Increase',
      actor: 'SP8ABC...456',
      category: 'NFT',
      amount: 30000,
      description: 'Increased NFT category budget',
      voteId: 18
    },
    {
      id: 3,
      timestamp: Date.now() - 12 * 60 * 60 * 1000,
      action: 'Parameter Update',
      actor: 'SP7DEF...789',
      category: 'Governance',
      description: 'Updated vote pass percentage to 60%',
      voteId: 17
    },
    {
      id: 4,
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      action: 'Emergency Pause',
      actor: 'SP6GHI...012',
      category: 'Security',
      description: 'Suspicious activity detected - treasury paused',
      transactionHash: '0x123...456'
    },
    {
      id: 5,
      timestamp: Date.now() - 30 * 60 * 60 * 1000,
      action: 'Spending Limit Set',
      actor: 'SP9XYZ...123',
      category: 'DeFi',
      amount: 250000,
      description: 'Set monthly spending limit for DeFi category'
    }
  ]);

  const [emergencyProcedures, setEmergencyProcedures] = useState<EmergencyProcedure[]>([
    {
      id: 1,
      name: 'Treasury Freeze',
      description: 'Immediately freeze all treasury operations',
      threshold: 100000,
      signaturesRequired: 2,
      cooldownPeriod: 48,
      status: 'active',
      lastTriggered: Date.now() - 24 * 60 * 60 * 1000
    },
    {
      id: 2,
      name: 'Emergency Withdrawal',
      description: 'Allow emergency withdrawal to secure wallet',
      threshold: 500000,
      signaturesRequired: 4,
      cooldownPeriod: 72,
      status: 'active'
    },
    {
      id: 3,
      name: 'Contract Pause',
      description: 'Pause smart contract operations',
      threshold: 0,
      signaturesRequired: 3,
      cooldownPeriod: 24,
      status: 'active'
    }
  ]);

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showParameterModal, setShowParameterModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<TreasuryParameter | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredAuditLog = auditLog.filter(entry =>
    filterCategory === 'all' || entry.category === filterCategory
  );

  const totalMonthlyLimit = spendingLimits
    .filter(l => l.period === 'monthly')
    .reduce((sum, l) => sum + l.limitAmount, 0);
  
  const totalMonthlySpend = spendingLimits
    .filter(l => l.period === 'monthly')
    .reduce((sum, l) => sum + l.currentSpend, 0);

  const getUtilizationColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20';
  };

  const getActionColor = (action: string) => {
    if (action.includes('Emergency') || action.includes('Pause')) {
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    }
    if (action.includes('Update') || action.includes('Set')) {
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
    }
    if (action.includes('Payout') || action.includes('Withdrawal')) {
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
    }
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
  };

  const proposeParameterChange = (param: TreasuryParameter, newValue: string | number) => {
    setParameters(parameters.map(p =>
      p.id === param.id
        ? { ...p, proposedValue: newValue }
        : p
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">⚖️ Treasury Governance</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Spending limits, parameters, and community oversight
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          📊 Generate Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Limit</div>
          <div className="text-2xl font-bold text-blue-600">{(totalMonthlyLimit / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">{spendingLimits.length} categories</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Spend</div>
          <div className="text-2xl font-bold text-green-600">{(totalMonthlySpend / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">
            {((totalMonthlySpend / totalMonthlyLimit) * 100).toFixed(0)}% utilized
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Parameters</div>
          <div className="text-2xl font-bold text-purple-600">{parameters.length}</div>
          <div className="text-xs text-gray-500 mt-1">
            {parameters.filter(p => p.proposedValue).length} pending changes
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Audit Entries</div>
          <div className="text-2xl font-bold text-yellow-600">{auditLog.length}</div>
          <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
        </div>
      </div>

      {/* Spending Limits */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">💰 Spending Limits</h3>
          <button
            onClick={() => setShowLimitModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Add Limit
          </button>
        </div>

        <div className="space-y-3">
          {spendingLimits.map(limit => {
            const utilization = (limit.currentSpend / limit.limitAmount) * 100;
            
            return (
              <div key={limit.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">{limit.category}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {limit.period.charAt(0).toUpperCase() + limit.period.slice(1)} limit
                      {limit.requiresVote && ' • Requires governance vote above threshold'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {(limit.currentSpend / 1000).toFixed(0)}K / {(limit.limitAmount / 1000).toFixed(0)}K STX
                    </div>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      getUtilizationColor(limit.currentSpend, limit.limitAmount)
                    }`}>
                      {utilization.toFixed(0)}% USED
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        utilization >= 90 ? 'bg-red-500' :
                        utilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>

                {limit.requiresVote && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ⚠️ Spending above {(limit.threshold / 1000).toFixed(0)}K STX requires community vote
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Treasury Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">⚙️ Treasury Parameters</h3>
          <button
            onClick={() => setShowParameterModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            📝 Propose Change
          </button>
        </div>

        <div className="space-y-3">
          {parameters.map(param => (
            <div key={param.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{param.name}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{param.description}</p>
                  <div className="text-xs text-gray-500">
                    Last updated {new Date(param.lastUpdated).toLocaleDateString()} by {param.updatedBy}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{param.currentValue}</div>
                  {param.requiresVote && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">🗳️ Requires vote</div>
                  )}
                </div>
              </div>

              {param.proposedValue && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Proposed Change:
                      </span>
                      <span className="ml-2 font-bold text-yellow-900 dark:text-yellow-200">
                        {param.proposedValue}
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded text-xs font-medium hover:bg-yellow-700">
                      View Vote
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">🚨 Emergency Procedures</h3>
        
        <div className="space-y-3">
          {emergencyProcedures.map(procedure => (
            <div key={procedure.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{procedure.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      procedure.status === 'active' ? 'text-green-600 bg-green-100 dark:bg-green-900/20' :
                      procedure.status === 'triggered' ? 'text-red-600 bg-red-100 dark:bg-red-900/20' :
                      'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
                    }`}>
                      {procedure.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{procedure.description}</p>
                </div>
                {procedure.status === 'active' && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                    Trigger
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Threshold:</span>
                  <span className="ml-2 font-medium">
                    {procedure.threshold > 0 ? `${(procedure.threshold / 1000).toFixed(0)}K STX` : 'Any amount'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Signatures:</span>
                  <span className="ml-2 font-medium">{procedure.signaturesRequired} required</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Cooldown:</span>
                  <span className="ml-2 font-medium">{procedure.cooldownPeriod}h</span>
                </div>
              </div>

              {procedure.lastTriggered && (
                <div className="mt-3 text-xs text-gray-500">
                  Last triggered: {new Date(procedure.lastTriggered).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">📋 Treasury Audit Log</h3>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                     focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="DeFi">DeFi</option>
            <option value="NFT">NFT</option>
            <option value="Governance">Governance</option>
            <option value="Security">Security</option>
          </select>
        </div>

        <div className="space-y-2">
          {filteredAuditLog.map(entry => (
            <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(entry.action)}`}>
                    {entry.action}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{entry.category}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>

              <p className="text-sm mb-2">{entry.description}</p>

              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span>Actor:</span>
                  <span className="ml-1 font-medium">{entry.actor}</span>
                </div>
                {entry.amount && (
                  <div>
                    <span>Amount:</span>
                    <span className="ml-1 font-medium">{(entry.amount / 1000).toFixed(0)}K STX</span>
                  </div>
                )}
                {entry.transactionHash && (
                  <div>
                    <span>TX:</span>
                    <button className="ml-1 font-medium text-blue-600 hover:underline">
                      {entry.transactionHash.substring(0, 10)}...
                    </button>
                  </div>
                )}
                {entry.voteId && (
                  <div>
                    <button className="font-medium text-blue-600 hover:underline">
                      View Vote #{entry.voteId}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Oversight Dashboard */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                    rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="font-semibold mb-4">👥 Community Oversight</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Votes</div>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-xs text-gray-500 mt-1">Parameter changes</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Transparency Score</div>
            <div className="text-2xl font-bold text-green-600">95%</div>
            <div className="text-xs text-gray-500 mt-1">All actions logged</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Audit</div>
            <div className="text-2xl font-bold text-purple-600">7 days ago</div>
            <div className="text-xs text-gray-500 mt-1">External review</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            📊 View All Votes
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                           font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
            📋 Request Audit
          </button>
        </div>
      </div>
    </div>
  );
}
