'use client';

import { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CategorySpending {
  category: string;
  spent: number;
  percentage: number;
  grants: number;
  avgROI: number;
  color: string;
}

interface GranteeAnalytics {
  address: string;
  name: string;
  totalReceived: number;
  proposals: number;
  successRate: number;
  avgDeliveryTime: number;
}

interface ROIAnalysis {
  proposalId: number;
  title: string;
  investment: number;
  returns: number;
  roi: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

export default function FinancialReports() {
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [reportMonth] = useState('January 2024');

  const [categorySpending] = useState<CategorySpending[]>([
    { category: 'DeFi', spent: 285000, percentage: 41.5, grants: 8, avgROI: 2.8, color: '#3B82F6' },
    { category: 'NFT', spent: 165000, percentage: 24, grants: 5, avgROI: 1.9, color: '#8B5CF6' },
    { category: 'Infrastructure', spent: 142000, percentage: 20.6, grants: 6, avgROI: 3.2, color: '#10B981' },
    { category: 'Community', spent: 68000, percentage: 9.9, grants: 4, avgROI: 1.5, color: '#F59E0B' },
    { category: 'Marketing', spent: 28000, percentage: 4, grants: 2, avgROI: 1.2, color: '#EC4899' }
  ]);

  const [grantees] = useState<GranteeAnalytics[]>([
    { address: 'SP1ABC...DEF', name: 'alice_dao', totalReceived: 125000, proposals: 3, successRate: 100, avgDeliveryTime: 45 },
    { address: 'SP2XYZ...GHI', name: 'bob_builder', totalReceived: 98000, proposals: 2, successRate: 100, avgDeliveryTime: 38 },
    { address: 'SP3MNO...PQR', name: 'carol_artist', totalReceived: 75000, proposals: 2, successRate: 50, avgDeliveryTime: 52 },
    { address: 'SP4STU...VWX', name: 'dave_investor', totalReceived: 62000, proposals: 1, successRate: 100, avgDeliveryTime: 30 }
  ]);

  const [roiAnalysis] = useState<ROIAnalysis[]>([
    { proposalId: 42, title: 'DeFi Lending Protocol', investment: 75000, returns: 210000, roi: 2.8, status: 'excellent' },
    { proposalId: 28, title: 'NFT Marketplace', investment: 50000, returns: 95000, roi: 1.9, status: 'good' },
    { proposalId: 15, title: 'DAO Governance Dashboard', investment: 35000, returns: 112000, roi: 3.2, status: 'excellent' },
    { proposalId: 8, title: 'Community Events', investment: 25000, returns: 30000, roi: 1.2, status: 'average' }
  ]);

  const totalSpent = categorySpending.reduce((sum, c) => sum + c.spent, 0);
  const totalGrants = categorySpending.reduce((sum, c) => sum + c.grants, 0);
  const avgROI = categorySpending.reduce((sum, c) => sum + c.avgROI * c.spent, 0) / totalSpent;

  const categorySpendingChartData = {
    labels: categorySpending.map(c => c.category),
    datasets: [
      {
        label: 'Spending (STX)',
        data: categorySpending.map(c => c.spent),
        backgroundColor: categorySpending.map(c => c.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const categoryDoughnutData = {
    labels: categorySpending.map(c => c.category),
    datasets: [
      {
        data: categorySpending.map(c => c.spent),
        backgroundColor: categorySpending.map(c => c.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const roiChartData = {
    labels: roiAnalysis.map(r => `#${r.proposalId}`),
    datasets: [
      {
        label: 'Investment',
        data: roiAnalysis.map(r => r.investment),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#EF4444',
        borderWidth: 2
      },
      {
        label: 'Returns',
        data: roiAnalysis.map(r => r.returns),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10B981',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${(value / 1000).toFixed(0)}K`
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const
      }
    }
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    alert(`Exporting report as ${format.toUpperCase()}...`);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 2.5) return 'text-green-600 dark:text-green-400';
    if (roi >= 1.5) return 'text-blue-600 dark:text-blue-400';
    if (roi >= 1.0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getROIStatus = (status: ROIAnalysis['status']) => {
    const colors = {
      excellent: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
      good: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      average: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      poor: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">📊 Financial Reports</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive spending analysis and ROI calculations
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          <button
            onClick={() => exportReport('pdf')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium 
                     hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            📄 Export PDF
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Financial Report: {reportMonth}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <div className="text-sm opacity-90">Total Spent</div>
            <div className="text-2xl font-bold">{(totalSpent / 1000).toFixed(0)}K STX</div>
          </div>
          <div>
            <div className="text-sm opacity-90">Grants Funded</div>
            <div className="text-2xl font-bold">{totalGrants}</div>
          </div>
          <div>
            <div className="text-sm opacity-90">Avg ROI</div>
            <div className="text-2xl font-bold">{avgROI.toFixed(1)}x</div>
          </div>
          <div>
            <div className="text-sm opacity-90">Grantees</div>
            <div className="text-2xl font-bold">{grantees.length}</div>
          </div>
        </div>
      </div>

      {/* Category Spending Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">💰 Spending by Category</h3>
        <div className="h-64 mb-6">
          <Bar data={categorySpendingChartData} options={chartOptions} />
        </div>
        <div className="space-y-3">
          {categorySpending.map(cat => (
            <div key={cat.category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }} />
                <div>
                  <div className="font-semibold">{cat.category}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {cat.grants} grants • {cat.avgROI.toFixed(1)}x avg ROI
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{(cat.spent / 1000).toFixed(0)}K STX</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{cat.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">📈 Spending Distribution</h3>
          <div className="h-64">
            <Doughnut data={categoryDoughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">🎯 ROI Comparison</h3>
          <div className="h-64">
            <Bar data={roiChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Grantee Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">👥 Grantee Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 text-sm font-semibold">Grantee</th>
                <th className="text-right p-3 text-sm font-semibold">Total Received</th>
                <th className="text-center p-3 text-sm font-semibold">Proposals</th>
                <th className="text-center p-3 text-sm font-semibold">Success Rate</th>
                <th className="text-center p-3 text-sm font-semibold">Avg Delivery</th>
              </tr>
            </thead>
            <tbody>
              {grantees.map(grantee => (
                <tr key={grantee.address} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="p-3">
                    <div className="font-medium">{grantee.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{grantee.address}</div>
                  </td>
                  <td className="p-3 text-right font-semibold">
                    {(grantee.totalReceived / 1000).toFixed(0)}K STX
                  </td>
                  <td className="p-3 text-center">{grantee.proposals}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      grantee.successRate === 100 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                      grantee.successRate >= 75 ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                      'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {grantee.successRate}%
                    </span>
                  </td>
                  <td className="p-3 text-center">{grantee.avgDeliveryTime} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">💡 ROI Analysis by Proposal</h3>
        <div className="space-y-3">
          {roiAnalysis.map(roi => (
            <div key={roi.proposalId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">Proposal #{roi.proposalId}: {roi.title}</h4>
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getROIStatus(roi.status)}`}>
                    {roi.status.toUpperCase()}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${getROIColor(roi.roi)}`}>
                  {roi.roi.toFixed(1)}x ROI
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Investment</div>
                  <div className="font-semibold text-red-600">{(roi.investment / 1000).toFixed(0)}K STX</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Returns</div>
                  <div className="font-semibold text-green-600">{(roi.returns / 1000).toFixed(0)}K STX</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Net Gain</div>
                  <div className="font-semibold text-blue-600">
                    +{((roi.returns - roi.investment) / 1000).toFixed(0)}K STX
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((roi.returns / (roi.investment * 4)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary & Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                    rounded-lg border border-blue-200 dark:border-blue-700 p-6">
        <h3 className="font-semibold mb-4">📝 Executive Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">✅</div>
            <h4 className="font-semibold mb-2">Key Achievements</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• {totalGrants} grants successfully funded</li>
              <li>• Average ROI of {avgROI.toFixed(1)}x across all categories</li>
              <li>• 100% on-time payment delivery</li>
              <li>• {grantees.filter(g => g.successRate === 100).length} grantees with perfect track record</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold mb-2">Key Metrics</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Total spending: {(totalSpent / 1000).toFixed(0)}K STX</li>
              <li>• Top category: {categorySpending[0].category} ({categorySpending[0].percentage.toFixed(1)}%)</li>
              <li>• Best ROI: Infrastructure ({categorySpending.find(c => c.category === 'Infrastructure')?.avgROI.toFixed(1)}x)</li>
              <li>• Avg delivery time: {(grantees.reduce((sum, g) => sum + g.avgDeliveryTime, 0) / grantees.length).toFixed(0)} days</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">⚠️</div>
            <h4 className="font-semibold mb-2">Areas for Improvement</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Marketing ROI below target (1.2x)</li>
              <li>• Consider diversifying into new categories</li>
              <li>• Monitor underperforming grantees</li>
              <li>• Optimize payment schedules</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Increase Infrastructure allocation</li>
              <li>• Implement milestone-based payouts</li>
              <li>• Review Marketing grant effectiveness</li>
              <li>• Reward high-performing grantees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
