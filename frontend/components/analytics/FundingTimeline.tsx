'use client';

import { useState, useMemo, useRef } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { format, startOfDay } from 'date-fns';
import { ProposalMetrics } from '../../utils/analytics/dataCollector';
import { formatMetric } from '../../utils/analytics/helpers';
import { Play, Pause, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface FundingTimelineProps {
  proposals: ProposalMetrics[];
}

interface TimelineDataPoint {
  x: number;
  y: number;
  z: number;
  proposal: ProposalMetrics;
  category: string;
  date: Date;
}

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

export default function FundingTimeline({ proposals }: FundingTimelineProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<[number, number]>([0, Infinity]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const executedProposals = useMemo(() => {
    return proposals.filter(p => p.executed && p.executedAt);
  }, [proposals]);

  const categories = useMemo(() => {
    return Array.from(new Set(proposals.map(p => p.category)));
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    return executedProposals.filter(p => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }
      if (p.amount < amountRange[0] || p.amount > amountRange[1]) {
        return false;
      }
      return true;
    });
  }, [executedProposals, selectedCategories, amountRange]);

  const timelineData = useMemo((): TimelineDataPoint[] => {
    const visibleProposals = isPlaying 
      ? filteredProposals.slice(0, playbackIndex + 1)
      : filteredProposals;

    return visibleProposals.map(proposal => ({
      x: proposal.executedAt || proposal.createdAt,
      y: proposal.amount,
      z: Math.sqrt(proposal.amount / 1000000) * 10,
      proposal,
      category: proposal.category,
      date: new Date((proposal.executedAt || proposal.createdAt) * 10 * 60 * 1000)
    }));
  }, [filteredProposals, isPlaying, playbackIndex]);

  const stats = useMemo(() => {
    const visible = timelineData;
    if (visible.length === 0) {
      return {
        totalFunded: 0,
        avgTimeBetween: 0,
        largestGrant: 0,
        count: 0
      };
    }

    const totalFunded = visible.reduce((sum, d) => sum + d.y, 0);
    
    const sortedByTime = [...visible].sort((a, b) => a.x - b.x);
    const timeDiffs = sortedByTime.slice(1).map((d, i) => 
      d.x - sortedByTime[i].x
    );
    const avgTimeBetween = timeDiffs.length > 0
      ? timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length
      : 0;

    const largestGrant = Math.max(...visible.map(d => d.y));

    return {
      totalFunded,
      avgTimeBetween: avgTimeBetween / 6,
      largestGrant,
      count: visible.length
    };
  }, [timelineData]);

  const cumulativeData = useMemo(() => {
    const sorted = [...timelineData].sort((a, b) => a.x - b.x);
    let cumulative = 0;
    
    return sorted.map(point => {
      cumulative += point.y;
      return {
        date: format(point.date, 'MMM dd'),
        cumulative: cumulative / 1_000_000
      };
    });
  }, [timelineData]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      if (direction === 'in') return Math.min(prev * 1.5, 5);
      return Math.max(prev / 1.5, 0.5);
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      setPlaybackIndex(0);
      
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackIndex(prev => {
          if (prev >= filteredProposals.length - 1) {
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
              playbackIntervalRef.current = null;
            }
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const data: TimelineDataPoint = payload[0].payload;
    const proposal = data.proposal;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="space-y-2">
          <p className="font-semibold text-gray-900 dark:text-white">
            {proposal.title}
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[proposal.category] }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {proposal.category}
            </span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatMetric(proposal.amount, 'currency')}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Funded:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {format(data.date, 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Time to Fund:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {proposal.timeToFunding?.toFixed(1) || 'N/A'}h
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Funding Timeline</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Visual timeline of all funded proposals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlayback}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={() => handleZoom('in')}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={resetZoom}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Funded</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatMetric(stats.totalFunded, 'currency')}
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-sm text-green-700 dark:text-green-300 mb-1">Avg Time Between</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.avgTimeBetween.toFixed(1)}h
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Largest Grant</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatMetric(stats.largestGrant, 'currency')}
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="text-sm text-orange-700 dark:text-orange-300 mb-1">Total Grants</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.count}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              selectedCategories.length === 0 || selectedCategories.includes(category)
                ? 'opacity-100'
                : 'opacity-40'
            }`}
            style={{
              backgroundColor: CATEGORY_COLORS[category] || CATEGORY_COLORS.other,
              color: 'white'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              type="number"
              dataKey="x"
              name="Time"
              domain={['auto', 'auto']}
              tickFormatter={(timestamp) => format(new Date(timestamp * 10 * 60 * 1000), 'MMM dd')}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Amount"
              tickFormatter={(value) => formatMetric(value, 'currency')}
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 500]} />
            <Tooltip content={<CustomTooltip />} />
            
            {categories.map(category => {
              const categoryData = timelineData.filter(d => d.category === category);
              if (selectedCategories.length > 0 && !selectedCategories.includes(category)) {
                return null;
              }
              
              return (
                <Scatter
                  key={category}
                  name={category}
                  data={categoryData}
                  fill={CATEGORY_COLORS[category] || CATEGORY_COLORS.other}
                  fillOpacity={0.7}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {cumulativeData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="font-semibold mb-4">Cumulative Funding</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis 
                  stroke="#9ca3af" 
                  style={{ fontSize: '10px' }}
                  tickFormatter={(value) => `${value.toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#fff'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)}M STX`, 'Cumulative']}
                />
                <Scatter data={cumulativeData} fill="#3b82f6" line={{ stroke: '#3b82f6', strokeWidth: 2 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
