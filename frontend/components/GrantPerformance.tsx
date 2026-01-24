'use client';

import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface Grant {
  id: number;
  proposalId: number;
  title: string;
  category: string;
  grantee: string;
  fundingAmount: number;
  disbursedAmount: number;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'delayed' | 'cancelled';
  startDate: number;
  expectedCompletion: number;
  actualCompletion?: number;
  roi: number;
  roiStatus: 'excellent' | 'good' | 'average' | 'poor';
  deliveryTime: number;
  successRate: number;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  dueDate: number;
  completedDate?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  payoutAmount: number;
  deliverables: string[];
  actualDeliverables?: string[];
}

interface CategoryPerformance {
  category: string;
  totalFunding: number;
  grantsCount: number;
  avgROI: number;
  avgSuccessRate: number;
  avgDeliveryTime: number;
}

export default function GrantPerformance() {
  const [grants, setGrants] = useState<Grant[]>([
    {
      id: 1,
      proposalId: 42,
      title: 'DeFi Protocol Development',
      category: 'DeFi',
      grantee: 'SP1ABC...DEF',
      fundingAmount: 75000,
      disbursedAmount: 50000,
      milestones: [
        {
          id: 1,
          title: 'Smart Contract Development',
          description: 'Core protocol contracts',
          dueDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
          completedDate: Date.now() - 35 * 24 * 60 * 60 * 1000,
          status: 'completed',
          payoutAmount: 25000,
          deliverables: ['Smart contracts', 'Test suite', 'Documentation'],
          actualDeliverables: ['Smart contracts', 'Test suite', 'Documentation']
        },
        {
          id: 2,
          title: 'Frontend Development',
          description: 'User interface and integration',
          dueDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
          status: 'in_progress',
          payoutAmount: 25000,
          deliverables: ['Web interface', 'API integration', 'User docs']
        },
        {
          id: 3,
          title: 'Security Audit',
          description: 'Third-party security review',
          dueDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
          status: 'pending',
          payoutAmount: 25000,
          deliverables: ['Audit report', 'Fixes implementation']
        }
      ],
      status: 'active',
      startDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
      expectedCompletion: Date.now() + 60 * 24 * 60 * 60 * 1000,
      roi: 3.2,
      roiStatus: 'excellent',
      deliveryTime: 45,
      successRate: 85
    },
    {
      id: 2,
      proposalId: 38,
      title: 'NFT Marketplace',
      category: 'NFT',
      grantee: 'SP2XYZ...GHI',
      fundingAmount: 45000,
      disbursedAmount: 45000,
      milestones: [
        {
          id: 1,
          title: 'Marketplace Core',
          description: 'NFT minting and trading',
          dueDate: Date.now() - 90 * 24 * 60 * 60 * 1000,
          completedDate: Date.now() - 85 * 24 * 60 * 60 * 1000,
          status: 'completed',
          payoutAmount: 20000,
          deliverables: ['Minting contract', 'Marketplace contract', 'Frontend'],
          actualDeliverables: ['Minting contract', 'Marketplace contract', 'Frontend']
        },
        {
          id: 2,
          title: 'Launch & Marketing',
          description: 'Public launch and promotion',
          dueDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
          completedDate: Date.now() - 58 * 24 * 60 * 60 * 1000,
          status: 'completed',
          payoutAmount: 25000,
          deliverables: ['Marketing campaign', 'Community outreach', 'Launch event'],
          actualDeliverables: ['Marketing campaign', 'Community outreach', 'Launch event']
        }
      ],
      status: 'completed',
      startDate: Date.now() - 120 * 24 * 60 * 60 * 1000,
      expectedCompletion: Date.now() - 50 * 24 * 60 * 60 * 1000,
      actualCompletion: Date.now() - 55 * 24 * 60 * 60 * 1000,
      roi: 2.1,
      roiStatus: 'good',
      deliveryTime: 65,
      successRate: 92
    },
    {
      id: 3,
      proposalId: 35,
      title: 'Community Education Platform',
      category: 'Community',
      grantee: 'SP3JKL...MNO',
      fundingAmount: 30000,
      disbursedAmount: 15000,
      milestones: [
        {
          id: 1,
          title: 'Content Creation',
          description: 'Educational content and tutorials',
          dueDate: Date.now() - 20 * 24 * 60 * 60 * 1000,
          completedDate: Date.now() - 10 * 24 * 60 * 60 * 1000,
          status: 'completed',
          payoutAmount: 15000,
          deliverables: ['10 video tutorials', '5 written guides', 'Quiz system'],
          actualDeliverables: ['8 video tutorials', '5 written guides']
        },
        {
          id: 2,
          title: 'Platform Launch',
          description: 'Website and community features',
          dueDate: Date.now() + 10 * 24 * 60 * 60 * 1000,
          status: 'delayed',
          payoutAmount: 15000,
          deliverables: ['Website', 'Forum', 'Certificate system']
        }
      ],
      status: 'delayed',
      startDate: Date.now() - 50 * 24 * 60 * 60 * 1000,
      expectedCompletion: Date.now() + 20 * 24 * 60 * 60 * 1000,
      roi: 1.4,
      roiStatus: 'average',
      deliveryTime: 30,
      successRate: 65
    }
  ]);

  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Grant['status']>('all');

  // Calculate category performance
  const categoryPerformance: CategoryPerformance[] = Array.from(
    new Set(grants.map(g => g.category))
  ).map(category => {
    const categoryGrants = grants.filter(g => g.category === category);
    return {
      category,
      totalFunding: categoryGrants.reduce((sum, g) => sum + g.fundingAmount, 0),
      grantsCount: categoryGrants.length,
      avgROI: categoryGrants.reduce((sum, g) => sum + g.roi, 0) / categoryGrants.length,
      avgSuccessRate: categoryGrants.reduce((sum, g) => sum + g.successRate, 0) / categoryGrants.length,
      avgDeliveryTime: categoryGrants.reduce((sum, g) => sum + g.deliveryTime, 0) / categoryGrants.length
    };
  });

  const filteredGrants = grants.filter(grant => {
    const categoryMatch = filterCategory === 'all' || grant.category === filterCategory;
    const statusMatch = filterStatus === 'all' || grant.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const totalFunding = grants.reduce((sum, g) => sum + g.fundingAmount, 0);
  const avgROI = grants.reduce((sum, g) => sum + g.roi, 0) / grants.length;
  const avgSuccessRate = grants.reduce((sum, g) => sum + g.successRate, 0) / grants.length;
  const activeGrants = grants.filter(g => g.status === 'active').length;

  const getStatusColor = (status: Grant['status'] | Milestone['status']) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'delayed':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'pending':
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getROIColor = (status: Grant['roiStatus']) => {
    switch (status) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'average': return 'text-yellow-600 dark:text-yellow-400';
      case 'poor': return 'text-red-600 dark:text-red-400';
    }
  };

  // Category comparison chart
  const categoryChartData = {
    labels: categoryPerformance.map(cp => cp.category),
    datasets: [
      {
        label: 'Avg ROI',
        data: categoryPerformance.map(cp => cp.avgROI),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      },
      {
        label: 'Success Rate (%)',
        data: categoryPerformance.map(cp => cp.avgSuccessRate),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }
    ]
  };

  // ROI trend chart
  const roiTrendData = {
    labels: grants.map(g => `Proposal #${g.proposalId}`),
    datasets: [{
      label: 'ROI Multiplier',
      data: grants.map(g => g.roi),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">📊 Grant Performance Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track deliverables, ROI, and grantee success rates
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          📈 Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Funding</div>
          <div className="text-2xl font-bold text-blue-600">{(totalFunding / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">{grants.length} total grants</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average ROI</div>
          <div className="text-2xl font-bold text-green-600">{avgROI.toFixed(1)}x</div>
          <div className="text-xs text-gray-500 mt-1">Return on investment</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-purple-600">{avgSuccessRate.toFixed(0)}%</div>
          <div className="text-xs text-gray-500 mt-1">Average milestone completion</div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Grants</div>
          <div className="text-2xl font-bold text-yellow-600">{activeGrants}</div>
          <div className="text-xs text-gray-500 mt-1">Currently in progress</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Category Performance Comparison</h3>
          <div className="h-64">
            <Bar
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">ROI Trend Analysis</h3>
          <div className="h-64">
            <Line
              data={roiTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'ROI Multiplier' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Performance by Category</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Funding</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grants</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg ROI</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoryPerformance.map(cat => (
                <tr key={cat.category} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 font-medium">{cat.category}</td>
                  <td className="px-4 py-3 text-right">{(cat.totalFunding / 1000).toFixed(0)}K STX</td>
                  <td className="px-4 py-3 text-center">{cat.grantsCount}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{cat.avgROI.toFixed(1)}x</td>
                  <td className="px-4 py-3 text-right">{cat.avgSuccessRate.toFixed(0)}%</td>
                  <td className="px-4 py-3 text-right">{cat.avgDeliveryTime.toFixed(0)} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                   focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Array.from(new Set(grants.map(g => g.category))).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700
                   focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grants List */}
      <div className="space-y-4">
        {filteredGrants.map(grant => {
          const completedMilestones = grant.milestones.filter(m => m.status === 'completed').length;
          const totalMilestones = grant.milestones.length;
          const progress = (completedMilestones / totalMilestones) * 100;

          return (
            <div
              key={grant.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{grant.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(grant.status)}`}>
                      {grant.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Proposal #{grant.proposalId} • {grant.category} • {grant.grantee}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {(grant.fundingAmount / 1000).toFixed(0)}K STX
                  </div>
                  <div className="text-xs text-gray-500">
                    {(grant.disbursedAmount / 1000).toFixed(0)}K disbursed
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">ROI</div>
                  <div className={`text-xl font-bold ${getROIColor(grant.roiStatus)}`}>
                    {grant.roi.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-500">{grant.roiStatus}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Success Rate</div>
                  <div className="text-xl font-bold">{grant.successRate}%</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Delivery Time</div>
                  <div className="text-xl font-bold">{grant.deliveryTime} days</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Milestones</div>
                  <div className="text-xl font-bold">{completedMilestones}/{totalMilestones}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      progress === 100 ? 'bg-green-500' : progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2 mb-4">
                {grant.milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{milestone.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        {milestone.completedDate && ` • Completed: ${new Date(milestone.completedDate).toLocaleDateString()}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{(milestone.payoutAmount / 1000).toFixed(0)}K STX</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedGrant(grant);
                    setShowMilestoneModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  📋 View Deliverables
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                                 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                  📊 Detailed Analytics
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Details Modal */}
      {showMilestoneModal && selectedGrant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Milestone Deliverables</h3>
            
            <div className="mb-4">
              <div className="font-medium mb-2">{selectedGrant.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Proposal #{selectedGrant.proposalId} • {selectedGrant.grantee}
              </div>
            </div>

            <div className="space-y-4">
              {selectedGrant.milestones.map(milestone => (
                <div key={milestone.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">{milestone.title}</div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{milestone.description}</p>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-2">Expected Deliverables:</div>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {milestone.deliverables.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {milestone.actualDeliverables && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                      <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                        ✓ Actual Deliverables:
                      </div>
                      <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400 space-y-1">
                        {milestone.actualDeliverables.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowMilestoneModal(false);
                setSelectedGrant(null);
              }}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
