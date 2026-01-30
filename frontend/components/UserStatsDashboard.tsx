'use client';

import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface VotingData {
  date: string;
  votes: number;
  proposals: number;
}

interface CategoryData {
  category: string;
  votes: number;
  color: string;
}

interface UserStatsDashboardProps {
  userAddress: string;
}

export default function UserStatsDashboard({ userAddress }: UserStatsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [votingData] = useState<VotingData[]>([
    { date: '2024-01-01', votes: 5, proposals: 3 },
    { date: '2024-01-08', votes: 8, proposals: 5 },
    { date: '2024-01-15', votes: 12, proposals: 7 },
    { date: '2024-01-22', votes: 10, proposals: 6 },
    { date: '2024-01-29', votes: 15, proposals: 9 }
  ]);

  const [categoryData] = useState<CategoryData[]>([
    { category: 'DeFi', votes: 45, color: '#3B82F6' },
    { category: 'NFT', votes: 32, color: '#8B5CF6' },
    { category: 'Infrastructure', votes: 28, color: '#10B981' },
    { category: 'Community', votes: 18, color: '#F59E0B' },
    { category: 'Marketing', votes: 12, color: '#EC4899' }
  ]);

  const stats = {
    totalVotes: 135,
    totalProposals: 12,
    votingPower: 8500,
    avgParticipation: 78,
    successRate: 85,
    streak: 15
  };

  const votingTrendData = {
    labels: votingData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Votes Cast',
        data: votingData.map(d => d.votes),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Proposals Created',
        data: votingData.map(d => d.proposals),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categoryDistributionData = {
    labels: categoryData.map(c => c.category),
    datasets: [
      {
        data: categoryData.map(c => c.votes),
        backgroundColor: categoryData.map(c => c.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity Level',
        data: [12, 19, 15, 25, 22, 18, 14],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3B82F6',
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
        beginAtZero: true
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">📊 User Statistics Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comprehensive analytics and insights
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
          <div className="text-3xl font-bold">{stats.totalVotes}</div>
          <div className="text-sm opacity-90">Total Votes</div>
          <div className="text-xs opacity-75 mt-1">+12% this month</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white">
          <div className="text-3xl font-bold">{stats.totalProposals}</div>
          <div className="text-sm opacity-90">Proposals</div>
          <div className="text-xs opacity-75 mt-1">+3 new</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
          <div className="text-3xl font-bold">{stats.votingPower.toLocaleString()}</div>
          <div className="text-sm opacity-90">Voting Power</div>
          <div className="text-xs opacity-75 mt-1">Rank #42</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white">
          <div className="text-3xl font-bold">{stats.avgParticipation}%</div>
          <div className="text-sm opacity-90">Participation</div>
          <div className="text-xs opacity-75 mt-1">Above average</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="text-3xl font-bold">{stats.successRate}%</div>
          <div className="text-sm opacity-90">Success Rate</div>
          <div className="text-xs opacity-75 mt-1">Proposals approved</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="text-3xl font-bold">{stats.streak}🔥</div>
          <div className="text-sm opacity-90">Day Streak</div>
          <div className="text-xs opacity-75 mt-1">Keep it up!</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voting Trends */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">📈 Voting Trends</h3>
          <div className="h-64">
            <Line data={votingTrendData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">
                {votingData.reduce((sum, d) => sum + d.votes, 0)} Total Votes
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">in selected period</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-purple-600 dark:text-purple-400 font-semibold">
                {votingData.reduce((sum, d) => sum + d.proposals, 0)} Proposals
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">created</div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">🎯 Category Distribution</h3>
          <div className="h-64">
            <Doughnut data={categoryDistributionData} options={doughnutOptions} />
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.slice(0, 3).map(cat => (
              <div key={cat.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span>{cat.category}</span>
                </div>
                <span className="font-semibold">{cat.votes} votes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">📅 Weekly Performance</h3>
          <div className="h-64">
            <Bar data={performanceData} options={chartOptions} />
          </div>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-sm text-green-700 dark:text-green-300">
              🎉 Most active on <strong>Thursday</strong> with 25 interactions
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">💡 Engagement Metrics</h3>
          
          <div className="space-y-4">
            {/* Voting Accuracy */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Voting Accuracy</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Community Impact */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Community Impact</span>
                <span className="font-semibold">88%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            {/* Response Time */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Time</span>
                <span className="font-semibold">Fast (2.5h avg)</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            {/* Discussion Quality */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Discussion Quality</span>
                <span className="font-semibold">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">42</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Comments</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">28</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Collaborations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                    rounded-lg border border-blue-200 dark:border-blue-700 p-6">
        <h3 className="font-semibold mb-4">💡 Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-1 text-sm">Expand Categories</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              You're most active in DeFi. Try voting on Infrastructure proposals to diversify!
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">⏰</div>
            <h4 className="font-semibold mb-1 text-sm">Optimal Timing</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Your votes on Thursday receive 35% more engagement than other days.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">🏆</div>
            <h4 className="font-semibold mb-1 text-sm">Next Milestone</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              15 more votes to reach Gold tier and unlock enhanced voting power!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
