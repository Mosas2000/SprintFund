'use client';

import { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, subMonths, subYears, startOfDay } from 'date-fns';
import { ProposalMetrics } from '../../utils/analytics/dataCollector';
import { calculateMovingAverage, formatMetric } from '../../utils/analytics/helpers';

type DateRangeOption = '7d' | '30d' | '90d' | '1y' | 'all';

interface SuccessRateDataPoint {
  date: string;
  timestamp: number;
  overallRate: number;
  proposalCount: number;
  [key: string]: string | number;
}

interface SuccessRateChartProps {
  proposals: ProposalMetrics[];
  height?: number;
}

const DATE_RANGE_OPTIONS: Array<{ value: DateRangeOption; label: string }> = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' }
];

const CATEGORY_COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899'
];

export default function SuccessRateChart({ proposals, height = 400 }: SuccessRateChartProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>('30d');
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const chartRef = useRef<HTMLDivElement>(null);

  const getFilteredProposals = (range: DateRangeOption): ProposalMetrics[] => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subYears(now, 1);
        break;
      case 'all':
        return proposals;
      default:
        startDate = subDays(now, 30);
    }

    return proposals.filter(p => {
      const proposalDate = new Date(p.createdAt * 10 * 60 * 1000);
      return proposalDate >= startDate;
    });
  };

  const chartData = useMemo(() => {
    const filteredProposals = getFilteredProposals(selectedRange);
    
    if (filteredProposals.length === 0) return [];

    const grouped = new Map<string, ProposalMetrics[]>();
    
    filteredProposals.forEach(proposal => {
      const date = startOfDay(new Date(proposal.createdAt * 10 * 60 * 1000));
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(proposal);
    });

    const sortedDates = Array.from(grouped.keys()).sort();
    const dataPoints: SuccessRateDataPoint[] = [];

    sortedDates.forEach(dateKey => {
      const dayProposals = grouped.get(dateKey)!;
      const successful = dayProposals.filter(p => p.executed).length;
      const overallRate = dayProposals.length > 0 ? (successful / dayProposals.length) * 100 : 0;

      const dataPoint: SuccessRateDataPoint = {
        date: dateKey,
        timestamp: new Date(dateKey).getTime(),
        overallRate,
        proposalCount: dayProposals.length
      };

      const categoryGroups = new Map<string, ProposalMetrics[]>();
      dayProposals.forEach(p => {
        if (!categoryGroups.has(p.category)) {
          categoryGroups.set(p.category, []);
        }
        categoryGroups.get(p.category)!.push(p);
      });

      categoryGroups.forEach((catProposals, category) => {
        const catSuccessful = catProposals.filter(p => p.executed).length;
        const catRate = catProposals.length > 0 ? (catSuccessful / catProposals.length) * 100 : 0;
        dataPoint[`${category}Rate`] = catRate;
      });

      dataPoints.push(dataPoint);
    });

    const overallRates = dataPoints.map(d => d.overallRate);
    const ma7 = calculateMovingAverage(overallRates, 7);
    const ma30 = calculateMovingAverage(overallRates, 30);

    dataPoints.forEach((point, index) => {
      point.ma7 = ma7[index];
      point.ma30 = ma30[index];
    });

    return dataPoints;
  }, [proposals, selectedRange]);

  const topCategories = useMemo(() => {
    const categoryCount = new Map<string, number>();
    
    proposals.forEach(p => {
      categoryCount.set(p.category, (categoryCount.get(p.category) || 0) + 1);
    });

    return Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category);
  }, [proposals]);

  const toggleSeries = (seriesKey: string) => {
    setHiddenSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seriesKey)) {
        newSet.delete(seriesKey);
      } else {
        newSet.add(seriesKey);
      }
      return newSet;
    });
  };

  const exportToPNG = () => {
    if (!chartRef.current) return;

    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `success-rate-chart-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Overall Rate', 'Proposal Count', 'MA7', 'MA30'];
    topCategories.forEach(cat => headers.push(`${cat} Rate`));

    const rows = chartData.map(point => {
      const row = [
        point.date,
        point.overallRate.toFixed(2),
        point.proposalCount.toString(),
        (point.ma7 || 0).toFixed(2),
        (point.ma30 || 0).toFixed(2)
      ];
      
      topCategories.forEach(cat => {
        row.push((point[`${cat}Rate`] || 0).toFixed(2));
      });
      
      return row;
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `success-rate-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const dataPoint = chartData.find(d => d.date === label);
    if (!dataPoint) return null;

    const currentIndex = chartData.indexOf(dataPoint);
    const previousPoint = currentIndex > 0 ? chartData[currentIndex - 1] : null;
    
    const trend = previousPoint 
      ? dataPoint.overallRate > previousPoint.overallRate ? '↑' 
        : dataPoint.overallRate < previousPoint.overallRate ? '↓' 
        : '→'
      : '→';

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {format(new Date(label), 'MMM dd, yyyy')}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">{entry.name}:</span>
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatMetric(entry.value, 'percentage')}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Proposals:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {dataPoint.proposalCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Trend:</span>
            <span className={`font-bold text-lg ${
              trend === '↑' ? 'text-green-500' : 
              trend === '↓' ? 'text-red-500' : 
              'text-gray-500'
            }`}>
              {trend}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <button
            key={index}
            onClick={() => toggleSeries(entry.dataKey)}
            className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all ${
              hiddenSeries.has(entry.dataKey)
                ? 'opacity-40 hover:opacity-60'
                : 'opacity-100 hover:opacity-80'
            }`}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No data available for the selected time range
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {DATE_RANGE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedRange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedRange === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportToPNG}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Export PNG
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div ref={chartRef} className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="overallGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend content={<CustomLegend />} />

            {!hiddenSeries.has('overallRate') && (
              <Line
                type="monotone"
                dataKey="overallRate"
                stroke="#10b981"
                strokeWidth={3}
                name="Overall Success Rate"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                fill="url(#overallGradient)"
              />
            )}

            {!hiddenSeries.has('ma7') && chartData.length >= 7 && (
              <Line
                type="monotone"
                dataKey="ma7"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="7-Day MA"
                dot={false}
              />
            )}

            {!hiddenSeries.has('ma30') && chartData.length >= 30 && (
              <Line
                type="monotone"
                dataKey="ma30"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="30-Day MA"
                dot={false}
              />
            )}

            {topCategories.map((category, index) => {
              const seriesKey = `${category}Rate`;
              if (hiddenSeries.has(seriesKey)) return null;

              return (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={seriesKey}
                  stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  strokeWidth={2}
                  name={`${category.charAt(0).toUpperCase() + category.slice(1)}`}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
