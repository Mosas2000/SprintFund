'use client';

import { useState, useEffect } from 'react';

interface ProposalStats {
  category: string;
  total: number;
  approved: number;
  rejected: number;
  avgAmount: number;
  avgTimeToExecution: number;
}

interface TimeMetrics {
  month: string;
  proposals: number;
  funding: number;
}

export default function ProposalAnalytics() {
  const [categoryStats] = useState<ProposalStats[]>([
    { category: 'DeFi', total: 45, approved: 32, rejected: 8, avgAmount: 62000, avgTimeToExecution: 21 },
    { category: 'NFT', total: 32, approved: 24, rejected: 5, avgAmount: 38000, avgTimeToExecution: 18 },
    { category: 'Infrastructure', total: 28, approved: 22, rejected: 4, avgAmount: 85000, avgTimeToExecution: 28 },
    { category: 'Governance', total: 19, approved: 16, rejected: 2, avgAmount: 25000, avgTimeToExecution: 14 },
    { category: 'Community', total: 24, approved: 20, rejected: 3, avgAmount: 15000, avgTimeToExecution: 12 }
  ]);

  const [timeMetrics] = useState<TimeMetrics[]>([
    { month: 'Jan', proposals: 12, funding: 450000 },
    { month: 'Feb', proposals: 18, funding: 620000 },
    { month: 'Mar', proposals: 15, funding: 580000 },
    { month: 'Apr', proposals: 22, funding: 780000 },
    { month: 'May', proposals: 19, funding: 690000 },
    { month: 'Jun', proposals: 25, funding: 920000 }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');

  const calculateSuccessRate = (stat: ProposalStats) => {
    return ((stat.approved / stat.total) * 100).toFixed(1);
  };

  const predictSuccess = (category: string, amount: number, timeline: number) => {
    const stat = categoryStats.find((s) => s.category === category);
    if (!stat) return 50;

    let score = parseFloat(calculateSuccessRate(stat));

    // Adjust based on amount
    if (amount > stat.avgAmount * 1.5) score -= 15;
    else if (amount < stat.avgAmount * 0.5) score += 10;

    // Adjust based on timeline
    if (timeline > stat.avgTimeToExecution * 1.5) score -= 10;
    else if (timeline < stat.avgTimeToExecution * 0.8) score += 5;

    return Math.max(0, Math.min(100, score));
  };

  const totalProposals = categoryStats.reduce((sum, s) => sum + s.total, 0);
  const totalApproved = categoryStats.reduce((sum, s) => sum + s.approved, 0);
  const overallSuccessRate = ((totalApproved / totalProposals) * 100).toFixed(1);
  const avgExecutionTime = (
    categoryStats.reduce((sum, s) => sum + s.avgTimeToExecution, 0) / categoryStats.length
  ).toFixed(1);
  const totalFunding = timeMetrics.reduce((sum, m) => sum + m.funding, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📈 Proposal Analytics</h2>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Overall Success Rate</div>
          <div className="text-4xl font-bold mb-2">{overallSuccessRate}%</div>
          <div className="text-xs opacity-80">{totalApproved}/{totalProposals} approved</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Avg Time to Execution</div>
          <div className="text-4xl font-bold mb-2">{avgExecutionTime}</div>
          <div className="text-xs opacity-80">days</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Funding</div>
          <div className="text-4xl font-bold mb-2">{(totalFunding / 1000000).toFixed(1)}M</div>
          <div className="text-xs opacity-80">STX distributed</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Funding Velocity</div>
          <div className="text-4xl font-bold mb-2">{(totalFunding / timeMetrics.length / 1000).toFixed(0)}K</div>
          <div className="text-xs opacity-80">STX per month</div>
        </div>
      </div>

      {/* Success Rate by Category */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Success Rate by Category</h3>
        <div className="space-y-4">
          {categoryStats.map((stat) => {
            const successRate = parseFloat(calculateSuccessRate(stat));
            return (
              <div key={stat.category}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{stat.category}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({stat.total} proposals)
                    </span>
                  </div>
                  <span className="font-bold text-green-600">{successRate}%</span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="absolute top-0 left-0 h-3 bg-green-500 rounded-full transition-all"
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                  <span>Avg: {stat.avgAmount.toLocaleString()} STX</span>
                  <span>Time: {stat.avgTimeToExecution} days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funding Velocity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Proposal Density & Funding Velocity</h3>
        <div className="grid grid-cols-6 gap-2">
          {timeMetrics.map((metric) => {
            const maxFunding = Math.max(...timeMetrics.map((m) => m.funding));
            const height = (metric.funding / maxFunding) * 200;
            const maxProposals = Math.max(...timeMetrics.map((m) => m.proposals));
            const intensity = (metric.proposals / maxProposals) * 100;

            return (
              <div key={metric.month} className="flex flex-col items-center">
                <div className="w-full mb-2" style={{ height: '200px', display: 'flex', alignItems: 'flex-end' }}>
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${height}px`,
                      background: `linear-gradient(to top, rgba(59, 130, 246, ${intensity / 100}), rgba(147, 51, 234, ${intensity / 100}))`
                    }}
                  />
                </div>
                <div className="text-xs font-medium mb-1">{metric.month}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{metric.proposals}</div>
                <div className="text-xs text-gray-500">{(metric.funding / 1000).toFixed(0)}K</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Predictive Success Scoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">🔮 Predictive Success Scoring</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Based on historical data, predict the success probability of a proposal
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700">
              {categoryStats.map((stat) => (
                <option key={stat.category} value={stat.category}>
                  {stat.category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Requested Amount (STX)</label>
            <input
              type="number"
              placeholder="50000"
              className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timeline (days)</label>
            <input
              type="number"
              placeholder="30"
              className="w-full p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Predicted Success Rate</span>
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">75%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div className="h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '75%' }} />
          </div>
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
            <div className="font-medium mb-1">Factors:</div>
            <ul className="space-y-1 text-xs">
              <li>✓ Amount within category average</li>
              <li>✓ Realistic timeline</li>
              <li>✓ High category success rate</li>
              <li>⚠ Consider adding more details to improve chances</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top Performing Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">🏆 Top Performing Categories</h3>
        <div className="space-y-3">
          {[...categoryStats]
            .sort((a, b) => parseFloat(calculateSuccessRate(b)) - parseFloat(calculateSuccessRate(a)))
            .slice(0, 3)
            .map((stat, index) => (
              <div
                key={stat.category}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 
                         dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">#{index + 1}</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{stat.category}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{calculateSuccessRate(stat)}% success</span>
                    <span>{stat.avgAmount.toLocaleString()} STX avg</span>
                    <span>{stat.avgTimeToExecution} days avg</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
