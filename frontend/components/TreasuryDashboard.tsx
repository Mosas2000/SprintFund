'use client';

import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TreasuryBalance {
  date: string;
  balance: number;
  inflow: number;
  outflow: number;
}

interface TreasuryStats {
  totalLocked: number;
  totalDistributed: number;
  availableBalance: number;
  pendingPayouts: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  healthScore: number;
}

export default function TreasuryDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [stats, setStats] = useState<TreasuryStats>({
    totalLocked: 2500000,
    totalDistributed: 1850000,
    availableBalance: 650000,
    pendingPayouts: 125000,
    monthlyInflow: 180000,
    monthlyOutflow: 145000,
    healthScore: 87
  });

  const [balanceHistory, setBalanceHistory] = useState<TreasuryBalance[]>([
    { date: '2024-01-01', balance: 2400000, inflow: 50000, outflow: 30000 },
    { date: '2024-01-08', balance: 2450000, inflow: 60000, outflow: 35000 },
    { date: '2024-01-15', balance: 2500000, inflow: 55000, outflow: 40000 },
    { date: '2024-01-22', balance: 2520000, inflow: 70000, outflow: 50000 },
    { date: '2024-01-29', balance: 2650000, inflow: 180000, outflow: 50000 }
  ]);

  const [flowBreakdown] = useState({
    inflow: [
      { category: 'Treasury Deposits', amount: 100000, percentage: 55.5 },
      { category: 'Grant Returns', amount: 45000, percentage: 25 },
      { category: 'Protocol Revenue', amount: 25000, percentage: 13.9 },
      { category: 'Other', amount: 10000, percentage: 5.6 }
    ],
    outflow: [
      { category: 'Grant Payouts', amount: 85000, percentage: 58.6 },
      { category: 'Operational Costs', amount: 35000, percentage: 24.1 },
      { category: 'Community Rewards', amount: 20000, percentage: 13.8 },
      { category: 'Other', amount: 5000, percentage: 3.5 }
    ]
  });

  useEffect(() => {
    // Simulate real-time balance updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        availableBalance: prev.availableBalance + Math.floor(Math.random() * 100 - 50)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const balanceChartData = {
    labels: balanceHistory.map(b => new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Treasury Balance',
        data: balanceHistory.map(b => b.balance),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const flowChartData = {
    labels: balanceHistory.map(b => new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Inflow',
        data: balanceHistory.map(b => b.inflow),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Outflow',
        data: balanceHistory.map(b => b.outflow),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const inflowDoughnutData = {
    labels: flowBreakdown.inflow.map(f => f.category),
    datasets: [
      {
        data: flowBreakdown.inflow.map(f => f.amount),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const outflowDoughnutData = {
    labels: flowBreakdown.outflow.map(f => f.category),
    datasets: [
      {
        data: flowBreakdown.outflow.map(f => f.amount),
        backgroundColor: ['#EF4444', '#F59E0B', '#EC4899', '#6B7280'],
        borderWidth: 2,
        borderColor: '#fff'
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

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">💰 Treasury Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time treasury balance and financial overview
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Locked</div>
          <div className="text-3xl font-bold">{(stats.totalLocked / 1000000).toFixed(2)}M</div>
          <div className="text-sm opacity-75 mt-2">STX</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Available Balance</div>
          <div className="text-3xl font-bold">{(stats.availableBalance / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-75 mt-2">
            {((stats.availableBalance / stats.totalLocked) * 100).toFixed(1)}% of total
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Distributed</div>
          <div className="text-3xl font-bold">{(stats.totalDistributed / 1000000).toFixed(2)}M</div>
          <div className="text-sm opacity-75 mt-2">Across {42} grants</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="text-sm opacity-90 mb-1">Pending Payouts</div>
          <div className="text-3xl font-bold">{(stats.pendingPayouts / 1000).toFixed(0)}K</div>
          <div className="text-sm opacity-75 mt-2">8 scheduled payments</div>
        </div>
      </div>

      {/* Treasury Health Score */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">Treasury Health Score</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Overall financial stability indicator
            </p>
          </div>
          <div className={`text-4xl font-bold ${getHealthColor(stats.healthScore)}`}>
            {stats.healthScore}%
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${getHealthBgColor(stats.healthScore)}`}
            style={{ width: `${stats.healthScore}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-green-700 dark:text-green-300 font-semibold">Excellent</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Inflow > Outflow</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-700 dark:text-blue-300 font-semibold">Stable</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">6+ month runway</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-purple-700 dark:text-purple-300 font-semibold">Diversified</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Multiple sources</div>
          </div>
        </div>
      </div>

      {/* Balance History Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Historical Balance</h3>
        <div className="h-64">
          <Line data={balanceChartData} options={chartOptions} />
        </div>
      </div>

      {/* Inflow/Outflow Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Cash Flow</h3>
        <div className="h-64 mb-4">
          <Line data={flowChartData} options={chartOptions} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                Monthly Inflow
              </span>
              <span className="text-lg font-bold text-green-600">
                {(stats.monthlyInflow / 1000).toFixed(0)}K STX
              </span>
            </div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                Monthly Outflow
              </span>
              <span className="text-lg font-bold text-red-600">
                {(stats.monthlyOutflow / 1000).toFixed(0)}K STX
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inflow Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4 text-green-600">💰 Inflow Breakdown</h3>
          <div className="h-64 mb-4">
            <Doughnut data={inflowDoughnutData} options={doughnutOptions} />
          </div>
          <div className="space-y-2">
            {flowBreakdown.inflow.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{(item.amount / 1000).toFixed(0)}K</span>
                  <span className="text-gray-500">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outflow Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4 text-red-600">📤 Outflow Breakdown</h3>
          <div className="h-64 mb-4">
            <Doughnut data={outflowDoughnutData} options={doughnutOptions} />
          </div>
          <div className="space-y-2">
            {flowBreakdown.outflow.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{(item.amount / 1000).toFixed(0)}K</span>
                  <span className="text-gray-500">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Recent Treasury Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'outflow', description: 'Grant payout to Proposal #42', amount: -75000, time: '2 hours ago' },
            { type: 'inflow', description: 'Treasury deposit from protocol revenue', amount: 50000, time: '5 hours ago' },
            { type: 'outflow', description: 'Operational expenses payment', amount: -12500, time: '1 day ago' },
            { type: 'inflow', description: 'Grant return from completed project', amount: 15000, time: '2 days ago' }
          ].map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${tx.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <div className="text-sm font-medium">{tx.description}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{tx.time}</div>
                </div>
              </div>
              <div className={`font-semibold ${tx.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}{(tx.amount / 1000).toFixed(1)}K STX
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
