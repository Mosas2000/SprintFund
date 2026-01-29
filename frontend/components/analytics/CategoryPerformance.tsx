'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProposalMetrics } from '../../utils/analytics/dataCollector';
import { formatMetric, calculateGrowthRate } from '../../utils/analytics/helpers';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface CategoryPerformanceProps {
  proposals: ProposalMetrics[];
  onCategoryClick?: (category: string) => void;
}

interface CategoryStats {
  category: string;
  totalProposals: number;
  successRate: number;
  avgTimeToFunding: number;
  totalDistributed: number;
  avgAmount: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

type SortKey = keyof CategoryStats;
type SortDirection = 'asc' | 'desc';

const CATEGORY_COLORS: Record<string, string> = {
  development: '#10b981',
  marketing: '#3b82f6',
  community: '#f59e0b',
  infrastructure: '#8b5cf6',
  education: '#ec4899',
  research: '#6366f1',
  design: '#14b8a6',
  content: '#f97316',
  other: '#6b7280'
};

export default function CategoryPerformance({ proposals, onCategoryClick }: CategoryPerformanceProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalDistributed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const categoryStats = useMemo((): CategoryStats[] => {
    const grouped = proposals.reduce((acc, proposal) => {
      if (!acc[proposal.category]) {
        acc[proposal.category] = [];
      }
      acc[proposal.category].push(proposal);
      return acc;
    }, {} as Record<string, ProposalMetrics[]>);

    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    return Object.entries(grouped).map(([category, categoryProposals]) => {
      const successful = categoryProposals.filter(p => p.executed);
      const successRate = categoryProposals.length > 0 
        ? (successful.length / categoryProposals.length) * 100 
        : 0;

      const proposalsWithTime = successful.filter(p => p.timeToFunding !== undefined);
      const avgTimeToFunding = proposalsWithTime.length > 0
        ? proposalsWithTime.reduce((sum, p) => sum + (p.timeToFunding || 0), 0) / proposalsWithTime.length
        : 0;

      const totalDistributed = successful.reduce((sum, p) => sum + p.amount, 0);
      const avgAmount = successful.length > 0 ? totalDistributed / successful.length : 0;

      const recentProposals = categoryProposals.filter(p => {
        const timestamp = p.createdAt * 10 * 60 * 1000;
        return timestamp > thirtyDaysAgo;
      });

      const oldProposals = categoryProposals.filter(p => {
        const timestamp = p.createdAt * 10 * 60 * 1000;
        return timestamp <= thirtyDaysAgo;
      });

      const trendValue = calculateGrowthRate(recentProposals.length, oldProposals.length);
      
      let trend: 'up' | 'down' | 'stable';
      if (trendValue > 10) trend = 'up';
      else if (trendValue < -10) trend = 'down';
      else trend = 'stable';

      return {
        category,
        totalProposals: categoryProposals.length,
        successRate,
        avgTimeToFunding,
        totalDistributed,
        avgAmount,
        trend,
        trendValue
      };
    });
  }, [proposals]);

  const sortedStats = useMemo(() => {
    return [...categoryStats].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }, [categoryStats, sortKey, sortDirection]);

  const topCategory = useMemo(() => {
    return categoryStats.reduce((max, cat) => 
      cat.successRate > max.successRate ? cat : max
    , categoryStats[0]);
  }, [categoryStats]);

  const decliningCategory = useMemo(() => {
    return categoryStats.find(cat => cat.trend === 'down' && cat.trendValue < -10);
  }, [categoryStats]);

  const fastestCategory = useMemo(() => {
    const withTime = categoryStats.filter(cat => cat.avgTimeToFunding > 0);
    if (withTime.length === 0) return null;
    return withTime.reduce((min, cat) => 
      cat.avgTimeToFunding < min.avgTimeToFunding ? cat : min
    );
  }, [categoryStats]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const getSuccessColor = (rate: number): string => {
    if (rate > 70) return 'text-green-600 dark:text-green-400';
    if (rate >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSuccessBgColor = (rate: number): string => {
    if (rate > 70) return CATEGORY_COLORS.development;
    if (rate >= 40) return CATEGORY_COLORS.community;
    return '#ef4444';
  };

  const barChartData = sortedStats.map(stat => ({
    category: stat.category,
    amount: stat.totalDistributed / 1_000_000,
    fill: CATEGORY_COLORS[stat.category] || CATEGORY_COLORS.other
  }));

  const pieChartData = sortedStats.map(stat => ({
    name: stat.category,
    value: stat.totalProposals
  }));

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-4">Total Funding by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={80}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff'
                }}
                formatter={(value: number) => [`${value.toFixed(2)}M STX`, 'Total Funded']}
              />
              <Bar 
                dataKey="amount" 
                radius={[8, 8, 0, 0]}
                onClick={(data) => onCategoryClick?.(data.category)}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-lg mb-4">Proposal Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => onCategoryClick?.(data.name)}
                cursor="pointer"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.other} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {(topCategory || decliningCategory || fastestCategory) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 p-6">
          <h3 className="font-semibold text-lg mb-4">Key Insights</h3>
          <div className="space-y-3">
            {topCategory && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Top performing category:</span> {topCategory.category} ({topCategory.successRate.toFixed(1)}% success rate)
                </p>
              </div>
            )}
            {decliningCategory && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Warning:</span> {decliningCategory.category} proposals declining ({decliningCategory.trendValue.toFixed(0)}%)
                </p>
              </div>
            )}
            {fastestCategory && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Tip:</span> {fastestCategory.category} category has fastest funding (avg {fastestCategory.avgTimeToFunding.toFixed(1)} hours)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  { key: 'category' as SortKey, label: 'Category' },
                  { key: 'totalProposals' as SortKey, label: 'Proposals' },
                  { key: 'successRate' as SortKey, label: 'Success Rate' },
                  { key: 'avgTimeToFunding' as SortKey, label: 'Avg Time to Funding' },
                  { key: 'totalDistributed' as SortKey, label: 'Total Distributed' },
                  { key: 'avgAmount' as SortKey, label: 'Avg Amount' },
                  { key: 'trend' as SortKey, label: 'Trend' }
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {label}
                      {sortKey === key && (
                        <span className="text-blue-500">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedStats.map((stat) => (
                <tr
                  key={stat.category}
                  onClick={() => onCategoryClick?.(stat.category)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[stat.category] || CATEGORY_COLORS.other }}
                      />
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {stat.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {stat.totalProposals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${getSuccessColor(stat.successRate)}`}>
                      {formatMetric(stat.successRate, 'percentage')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {stat.avgTimeToFunding > 0 ? `${stat.avgTimeToFunding.toFixed(1)}h` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatMetric(stat.totalDistributed, 'currency')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatMetric(stat.avgAmount, 'currency')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={stat.trend} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.trendValue !== 0 && `${stat.trendValue > 0 ? '+' : ''}${stat.trendValue.toFixed(0)}%`}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
