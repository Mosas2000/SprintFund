'use client';

import { useState, useMemo } from 'react';
import { ProposalMetrics, VoteData } from '../../utils/analytics/dataCollector';
import { startOfDay, format, getDay, getHours, subDays, isSameDay } from 'date-fns';

interface VotingHeatmapProps {
  proposals: ProposalMetrics[];
  votes: VoteData[];
}

type MetricType = 'voteCount' | 'uniqueVoters' | 'avgWeight' | 'successRate';

interface HeatmapCell {
  day: number;
  hour: number;
  voteCount: number;
  uniqueVoters: number;
  avgWeight: number;
  successRate: number;
  proposals: number[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function VotingHeatmap({ proposals, votes }: VotingHeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('voteCount');
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const heatmapData = useMemo((): HeatmapCell[][] => {
    const now = new Date();
    const ninetyDaysAgo = subDays(now, 90);

    const filteredVotes = votes.filter(vote => {
      const voteDate = new Date(vote.timestamp);
      return voteDate >= ninetyDaysAgo;
    });

    const grid: HeatmapCell[][] = Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        day,
        hour,
        voteCount: 0,
        uniqueVoters: 0,
        avgWeight: 0,
        successRate: 0,
        proposals: []
      }))
    );

    const voterSets: Map<string, Set<string>> = new Map();
    const weights: Map<string, number[]> = new Map();

    filteredVotes.forEach(vote => {
      const voteDate = new Date(vote.timestamp);
      const day = getDay(voteDate);
      const hour = getHours(voteDate);

      const cell = grid[day][hour];
      cell.voteCount++;

      if (!cell.proposals.includes(vote.proposalId)) {
        cell.proposals.push(vote.proposalId);
      }

      const key = `${day}-${hour}`;
      if (!voterSets.has(key)) {
        voterSets.set(key, new Set());
        weights.set(key, []);
      }
      voterSets.get(key)!.add(vote.voter);
      weights.get(key)!.push(vote.weight);
    });

    grid.forEach((dayRow, day) => {
      dayRow.forEach((cell, hour) => {
        const key = `${day}-${hour}`;
        cell.uniqueVoters = voterSets.get(key)?.size || 0;
        
        const cellWeights = weights.get(key) || [];
        cell.avgWeight = cellWeights.length > 0
          ? cellWeights.reduce((sum, w) => sum + w, 0) / cellWeights.length
          : 0;

        const cellProposals = cell.proposals.map(id => 
          proposals.find(p => p.proposalId === id)
        ).filter(Boolean) as ProposalMetrics[];

        cell.successRate = cellProposals.length > 0
          ? (cellProposals.filter(p => p.executed).length / cellProposals.length) * 100
          : 0;
      });
    });

    return grid;
  }, [proposals, votes]);

  const { maxValue, insights } = useMemo(() => {
    let maxVal = 0;
    let peakDay = 0;
    let peakHour = 0;
    let peakValue = 0;

    const dayTotals = Array(7).fill(0);
    const hourTotals = Array(24).fill(0);

    heatmapData.forEach((dayRow, day) => {
      dayRow.forEach((cell, hour) => {
        const value = cell[selectedMetric];
        maxVal = Math.max(maxVal, value);

        if (value > peakValue) {
          peakValue = value;
          peakDay = day;
          peakHour = hour;
        }

        dayTotals[day] += cell.voteCount;
        hourTotals[hour] += cell.voteCount;
      });
    });

    const weekdayAvg = dayTotals.slice(1, 6).reduce((a, b) => a + b, 0) / 5;
    const weekendAvg = (dayTotals[0] + dayTotals[6]) / 2;
    const weekendDrop = weekdayAvg > 0 ? ((weekendAvg - weekdayAvg) / weekdayAvg) * 100 : 0;

    const lateNightHours = [23, 0, 1, 2, 3];
    const lateNightCells = heatmapData.flatMap((dayRow, day) =>
      dayRow.filter((_, hour) => lateNightHours.includes(hour))
    );
    const lateNightSuccess = lateNightCells.length > 0
      ? lateNightCells.reduce((sum, cell) => sum + cell.successRate, 0) / lateNightCells.length
      : 0;

    const regularCells = heatmapData.flatMap((dayRow, day) =>
      dayRow.filter((_, hour) => !lateNightHours.includes(hour))
    );
    const regularSuccess = regularCells.length > 0
      ? regularCells.reduce((sum, cell) => sum + cell.successRate, 0) / regularCells.length
      : 0;

    return {
      maxValue: maxVal,
      insights: {
        peakTime: `${DAYS[peakDay]}s ${peakHour}:00-${peakHour + 1}:00 UTC`,
        weekendDrop: Math.abs(weekendDrop),
        lateNightPenalty: regularSuccess - lateNightSuccess
      }
    };
  }, [heatmapData, selectedMetric]);

  const getColorIntensity = (value: number): string => {
    if (maxValue === 0) return 'bg-gray-100 dark:bg-gray-800';
    
    const intensity = value / maxValue;
    
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity < 0.2) return 'bg-blue-200 dark:bg-blue-900';
    if (intensity < 0.4) return 'bg-blue-300 dark:bg-blue-800';
    if (intensity < 0.6) return 'bg-blue-400 dark:bg-blue-700';
    if (intensity < 0.8) return 'bg-blue-500 dark:bg-blue-600';
    return 'bg-blue-600 dark:bg-blue-500';
  };

  const handleCellHover = (cell: HeatmapCell, event: React.MouseEvent) => {
    setHoveredCell(cell);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCellClick = (cell: HeatmapCell) => {
    console.log('Proposals voted on:', cell.proposals);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Voting Activity Heatmap</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Past 90 days of voting patterns by day and hour
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { value: 'voteCount' as MetricType, label: 'Vote Count' },
            { value: 'uniqueVoters' as MetricType, label: 'Unique Voters' },
            { value: 'avgWeight' as MetricType, label: 'Avg Weight' },
            { value: 'successRate' as MetricType, label: 'Success Rate' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedMetric(option.value)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600 p-6">
        <h4 className="font-semibold mb-3">Key Insights</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Peak voting time:</span> {insights.peakTime}
            </p>
          </div>
          {insights.weekendDrop > 0 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Weekends see</span> {insights.weekendDrop.toFixed(0)}% less activity
              </p>
            </div>
          )}
          {insights.lateNightPenalty > 0 && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Late night proposals</span> (11PM-3AM) have {insights.lateNightPenalty.toFixed(0)}% lower success rate
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-4">
            <div className="flex flex-col justify-between py-8">
              {DAYS.map(day => (
                <div key={day} className="h-8 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
              ))}
            </div>

            <div className="flex-1">
              <div className="flex gap-1 mb-2">
                {HOURS.map(hour => (
                  <div key={hour} className="w-8 text-center text-xs text-gray-600 dark:text-gray-400">
                    {hour % 6 === 0 ? `${hour}h` : ''}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                {heatmapData.map((dayRow, dayIndex) => (
                  <div key={dayIndex} className="flex gap-1">
                    {dayRow.map((cell, hourIndex) => (
                      <div
                        key={`${dayIndex}-${hourIndex}`}
                        className={`w-8 h-8 rounded ${getColorIntensity(cell[selectedMetric])} cursor-pointer transition-all hover:ring-2 hover:ring-blue-500`}
                        onMouseEnter={(e) => handleCellHover(cell, e)}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => handleCellClick(cell)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-900" />
            <div className="w-4 h-4 rounded bg-blue-400 dark:bg-blue-700" />
            <div className="w-4 h-4 rounded bg-blue-600 dark:bg-blue-500" />
          </div>
          <span>More</span>
        </div>
      </div>

      {hoveredCell && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y + 10}px`
          }}
        >
          <div className="text-sm space-y-1">
            <div className="font-semibold text-gray-900 dark:text-white">
              {DAYS[hoveredCell.day]} {hoveredCell.hour}:00-{hoveredCell.hour + 1}:00
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Votes: {hoveredCell.voteCount}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Unique Voters: {hoveredCell.uniqueVoters}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Avg Weight: {hoveredCell.avgWeight.toFixed(2)}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Success Rate: {hoveredCell.successRate.toFixed(1)}%
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              Proposals: {hoveredCell.proposals.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
