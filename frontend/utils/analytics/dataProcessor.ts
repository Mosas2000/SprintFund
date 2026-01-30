import { groupBy, meanBy, sumBy, orderBy, maxBy, minBy } from 'lodash';
import { 
  startOfDay, 
  startOfWeek, 
  startOfMonth, 
  format, 
  differenceInHours,
  getHours,
  getDay,
  parseISO,
  subDays,
  subWeeks,
  subMonths
} from 'date-fns';
import { 
  mean, 
  standardDeviation, 
  median, 
  quantile,
  linearRegression,
  linearRegressionLine
} from 'simple-statistics';
import { ProposalMetrics } from './dataCollector';

export interface VoteData {
  proposalId: number;
  voter: string;
  weight: number;
  support: boolean;
  timestamp: number;
}

export interface SuccessFactors {
  optimalAmountRange: { min: number; max: number; successRate: number };
  bestSubmissionTime: { dayOfWeek: number; hour: number; successRate: number };
  idealDescriptionLength: { min: number; max: number; successRate: number };
  categorySuccessRates: Array<{ category: string; successRate: number; avgAmount: number }>;
  voteVelocityThreshold: number;
}

export interface VotingPattern {
  clusterAnalysis: {
    whaleVoters: Array<{ address: string; totalWeight: number; influence: number }>;
    activeVoters: Array<{ address: string; voteCount: number }>;
    casualVoters: Array<{ address: string; voteCount: number }>;
  };
  timePatterns: {
    morningVoters: string[];
    eveningVoters: string[];
    nightOwls: string[];
  };
  categoryPreferences: Array<{
    voterSegment: string;
    preferredCategories: string[];
    avgWeight: number;
  }>;
}

export interface CategoryTrend {
  category: string;
  totalFunding: number;
  proposalCount: number;
  avgFunding: number;
  growthRate: number;
  saturationLevel: number;
  trend: 'emerging' | 'stable' | 'declining';
}

export interface Anomaly {
  type: 'voting_manipulation' | 'outlier_engagement' | 'timing_anomaly';
  proposalId: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  metrics: Record<string, number>;
}

export interface TimeSeriesDataPoint {
  timestamp: number;
  date: string;
  proposalCount: number;
  totalFunding: number;
  avgFunding: number;
  successRate: number;
  avgVoteVelocity: number;
  uniqueVoters: number;
}

export interface TimeSeriesData {
  data: TimeSeriesDataPoint[];
  movingAverages: {
    funding: number[];
    successRate: number[];
    velocity: number[];
  };
  trends: {
    fundingTrend: 'increasing' | 'stable' | 'decreasing';
    participationTrend: 'increasing' | 'stable' | 'decreasing';
    slope: number;
  };
  seasonality: {
    detected: boolean;
    pattern?: string;
  };
}

function calculateSuccessRate(proposals: ProposalMetrics[]): number {
  if (proposals.length === 0) return 0;
  const successful = proposals.filter(p => p.executed).length;
  return (successful / proposals.length) * 100;
}

export function calculateSuccessFactors(proposals: ProposalMetrics[]): SuccessFactors {
  const successfulProposals = proposals.filter(p => p.executed);
  const failedProposals = proposals.filter(p => !p.executed);

  const amountRanges = [
    { min: 0, max: 50000000 },
    { min: 50000000, max: 100000000 },
    { min: 100000000, max: 150000000 },
    { min: 150000000, max: 200000000 },
    { min: 200000000, max: Infinity }
  ];

  const amountAnalysis = amountRanges.map(range => {
    const inRange = proposals.filter(p => p.amount >= range.min && p.amount < range.max);
    return {
      ...range,
      successRate: calculateSuccessRate(inRange)
    };
  });

  const optimalAmountRange = maxBy(amountAnalysis, 'successRate') || amountRanges[0];

  const timeAnalysis: Array<{ dayOfWeek: number; hour: number; proposals: ProposalMetrics[] }> = [];
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const matchingProposals = proposals.filter(p => {
        const timestamp = p.createdAt * 10 * 60 * 1000;
        const date = new Date(timestamp);
        return getDay(date) === day && getHours(date) === hour;
      });
      
      if (matchingProposals.length > 0) {
        timeAnalysis.push({ dayOfWeek: day, hour, proposals: matchingProposals });
      }
    }
  }

  const bestTime = maxBy(
    timeAnalysis.map(t => ({
      dayOfWeek: t.dayOfWeek,
      hour: t.hour,
      successRate: calculateSuccessRate(t.proposals)
    })),
    'successRate'
  ) || { dayOfWeek: 1, hour: 9, successRate: 0 };

  const descriptionLengths = proposals.map(p => ({
    length: p.title.length + 100,
    executed: p.executed
  }));

  const lengthRanges = [
    { min: 0, max: 100 },
    { min: 100, max: 200 },
    { min: 200, max: 300 },
    { min: 300, max: 400 },
    { min: 400, max: Infinity }
  ];

  const lengthAnalysis = lengthRanges.map(range => {
    const inRange = descriptionLengths.filter(d => d.length >= range.min && d.length < range.max);
    const successful = inRange.filter(d => d.executed).length;
    return {
      ...range,
      successRate: inRange.length > 0 ? (successful / inRange.length) * 100 : 0
    };
  });

  const idealDescriptionLength = maxBy(lengthAnalysis, 'successRate') || lengthRanges[1];

  const categoryGroups = groupBy(proposals, 'category');
  const categorySuccessRates = Object.entries(categoryGroups).map(([category, props]) => ({
    category,
    successRate: calculateSuccessRate(props),
    avgAmount: meanBy(props, 'amount')
  }));

  const successfulVelocities = successfulProposals
    .map(p => p.voteVelocity)
    .filter(v => v > 0);

  const voteVelocityThreshold = successfulVelocities.length > 0
    ? quantile(successfulVelocities, 0.25)
    : 0;

  return {
    optimalAmountRange: {
      min: optimalAmountRange.min,
      max: optimalAmountRange.max,
      successRate: optimalAmountRange.successRate
    },
    bestSubmissionTime: bestTime,
    idealDescriptionLength: {
      min: idealDescriptionLength.min,
      max: idealDescriptionLength.max,
      successRate: idealDescriptionLength.successRate
    },
    categorySuccessRates: orderBy(categorySuccessRates, 'successRate', 'desc'),
    voteVelocityThreshold
  };
}

export function identifyVotingPatterns(votes: VoteData[]): VotingPattern {
  const voterStats = Object.entries(groupBy(votes, 'voter')).map(([address, voterVotes]) => ({
    address,
    voteCount: voterVotes.length,
    totalWeight: sumBy(voterVotes, 'weight'),
    avgWeight: meanBy(voterVotes, 'weight')
  }));

  const totalWeight = sumBy(voterStats, 'totalWeight');
  const whaleVoters = voterStats
    .filter(v => v.totalWeight > totalWeight * 0.05)
    .map(v => ({
      address: v.address,
      totalWeight: v.totalWeight,
      influence: (v.totalWeight / totalWeight) * 100
    }));

  const activeVoters = voterStats
    .filter(v => v.voteCount >= 10 && !whaleVoters.find(w => w.address === v.address))
    .map(v => ({ address: v.address, voteCount: v.voteCount }));

  const casualVoters = voterStats
    .filter(v => v.voteCount < 10 && !whaleVoters.find(w => w.address === v.address))
    .map(v => ({ address: v.address, voteCount: v.voteCount }));

  const voterTimePreferences = Object.entries(groupBy(votes, 'voter')).map(([address, voterVotes]) => {
    const hours = voterVotes.map(v => {
      const date = new Date(v.timestamp);
      return getHours(date);
    });
    const avgHour = mean(hours);
    return { address, avgHour };
  });

  const morningVoters = voterTimePreferences.filter(v => v.avgHour >= 6 && v.avgHour < 12).map(v => v.address);
  const eveningVoters = voterTimePreferences.filter(v => v.avgHour >= 18 && v.avgHour < 24).map(v => v.address);
  const nightOwls = voterTimePreferences.filter(v => v.avgHour >= 0 && v.avgHour < 6).map(v => v.address);

  const categoryPreferences: Array<{
    voterSegment: string;
    preferredCategories: string[];
    avgWeight: number;
  }> = [
    {
      voterSegment: 'whales',
      preferredCategories: [],
      avgWeight: meanBy(whaleVoters, 'totalWeight')
    },
    {
      voterSegment: 'active',
      preferredCategories: [],
      avgWeight: activeVoters.length > 0 ? mean(activeVoters.map(v => v.voteCount)) : 0
    },
    {
      voterSegment: 'casual',
      preferredCategories: [],
      avgWeight: casualVoters.length > 0 ? mean(casualVoters.map(v => v.voteCount)) : 0
    }
  ];

  return {
    clusterAnalysis: {
      whaleVoters: orderBy(whaleVoters, 'influence', 'desc').slice(0, 10),
      activeVoters: orderBy(activeVoters, 'voteCount', 'desc').slice(0, 20),
      casualVoters: casualVoters.slice(0, 50)
    },
    timePatterns: {
      morningVoters,
      eveningVoters,
      nightOwls
    },
    categoryPreferences
  };
}

export function calculateCategoryTrends(proposals: ProposalMetrics[]): CategoryTrend[] {
  const categoryGroups = groupBy(proposals, 'category');
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

  return Object.entries(categoryGroups).map(([category, props]) => {
    const totalFunding = sumBy(props.filter(p => p.executed), 'amount');
    const proposalCount = props.length;
    const avgFunding = proposalCount > 0 ? totalFunding / proposalCount : 0;

    const recentProps = props.filter(p => {
      const timestamp = p.createdAt * 10 * 60 * 1000;
      return timestamp > thirtyDaysAgo;
    });

    const oldProps = props.filter(p => {
      const timestamp = p.createdAt * 10 * 60 * 1000;
      return timestamp <= thirtyDaysAgo;
    });

    const recentCount = recentProps.length;
    const oldCount = oldProps.length;

    const growthRate = oldCount > 0 
      ? ((recentCount - oldCount) / oldCount) * 100 
      : recentCount > 0 ? 100 : 0;

    const maxProposalsPerCategory = 50;
    const saturationLevel = (proposalCount / maxProposalsPerCategory) * 100;

    let trend: 'emerging' | 'stable' | 'declining';
    if (growthRate > 20) {
      trend = 'emerging';
    } else if (growthRate < -20) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    return {
      category,
      totalFunding,
      proposalCount,
      avgFunding,
      growthRate,
      saturationLevel: Math.min(saturationLevel, 100),
      trend
    };
  });
}

export function detectAnomalies(proposals: ProposalMetrics[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  if (proposals.length === 0) return anomalies;

  const voteVelocities = proposals.map(p => p.voteVelocity).filter(v => v > 0);
  const velocityMean = mean(voteVelocities);
  const velocityStdDev = standardDeviation(voteVelocities);

  proposals.forEach(proposal => {
    if (proposal.voteVelocity > velocityMean + (3 * velocityStdDev)) {
      anomalies.push({
        type: 'voting_manipulation',
        proposalId: proposal.proposalId,
        severity: 'high',
        description: 'Unusually high vote velocity detected, potential coordinated voting',
        metrics: {
          voteVelocity: proposal.voteVelocity,
          threshold: velocityMean + (3 * velocityStdDev),
          deviation: (proposal.voteVelocity - velocityMean) / velocityStdDev
        }
      });
    }

    const avgUniqueVoters = mean(proposals.map(p => p.uniqueVoters));
    if (proposal.uniqueVoters > avgUniqueVoters * 3) {
      anomalies.push({
        type: 'outlier_engagement',
        proposalId: proposal.proposalId,
        severity: 'medium',
        description: 'Exceptionally high voter engagement',
        metrics: {
          uniqueVoters: proposal.uniqueVoters,
          average: avgUniqueVoters,
          ratio: proposal.uniqueVoters / avgUniqueVoters
        }
      });
    }

    if (proposal.uniqueVoters < avgUniqueVoters * 0.2 && proposal.totalVotes > 0) {
      anomalies.push({
        type: 'outlier_engagement',
        proposalId: proposal.proposalId,
        severity: 'low',
        description: 'Unusually low voter engagement',
        metrics: {
          uniqueVoters: proposal.uniqueVoters,
          average: avgUniqueVoters,
          ratio: proposal.uniqueVoters / avgUniqueVoters
        }
      });
    }

    const momentum = proposal.momentum;
    if (Math.abs(momentum) > 5) {
      anomalies.push({
        type: 'timing_anomaly',
        proposalId: proposal.proposalId,
        severity: momentum > 0 ? 'medium' : 'low',
        description: momentum > 0 
          ? 'Rapid acceleration in voting activity'
          : 'Rapid deceleration in voting activity',
        metrics: {
          momentum: momentum,
          voteVelocity: proposal.voteVelocity
        }
      });
    }
  });

  return orderBy(anomalies, ['severity', 'proposalId'], ['desc', 'asc']);
}

export function generateTimeSeriesData(
  proposals: ProposalMetrics[],
  interval: 'day' | 'week' | 'month'
): TimeSeriesData {
  if (proposals.length === 0) {
    return {
      data: [],
      movingAverages: { funding: [], successRate: [], velocity: [] },
      trends: { fundingTrend: 'stable', participationTrend: 'stable', slope: 0 },
      seasonality: { detected: false }
    };
  }

  const getIntervalStart = (timestamp: number): Date => {
    const date = new Date(timestamp);
    switch (interval) {
      case 'day':
        return startOfDay(date);
      case 'week':
        return startOfWeek(date);
      case 'month':
        return startOfMonth(date);
    }
  };

  const proposalsWithDates = proposals.map(p => ({
    ...p,
    intervalDate: getIntervalStart(p.createdAt * 10 * 60 * 1000)
  }));

  const grouped = groupBy(proposalsWithDates, p => p.intervalDate.getTime());

  const dataPoints: TimeSeriesDataPoint[] = Object.entries(grouped)
    .map(([timestamp, props]) => {
      const ts = parseInt(timestamp);
      const executed = props.filter(p => p.executed);
      
      return {
        timestamp: ts,
        date: format(new Date(ts), 'yyyy-MM-dd'),
        proposalCount: props.length,
        totalFunding: sumBy(executed, 'amount'),
        avgFunding: meanBy(executed, 'amount') || 0,
        successRate: calculateSuccessRate(props),
        avgVoteVelocity: meanBy(props, 'voteVelocity'),
        uniqueVoters: props.reduce((sum, p) => sum + p.uniqueVoters, 0)
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  const calculateMovingAverage = (values: number[], window: number = 3): number[] => {
    if (values.length < window) return values;
    
    const result: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (i < window - 1) {
        result.push(values[i]);
      } else {
        const slice = values.slice(i - window + 1, i + 1);
        result.push(mean(slice));
      }
    }
    return result;
  };

  const fundingValues = dataPoints.map(d => d.totalFunding);
  const successRateValues = dataPoints.map(d => d.successRate);
  const velocityValues = dataPoints.map(d => d.avgVoteVelocity);

  const movingAverages = {
    funding: calculateMovingAverage(fundingValues),
    successRate: calculateMovingAverage(successRateValues),
    velocity: calculateMovingAverage(velocityValues)
  };

  let fundingTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  let participationTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  let slope = 0;

  if (dataPoints.length >= 3) {
    const xValues = dataPoints.map((_, i) => i);
    const yValues = fundingValues;

    try {
      const regression = linearRegression(xValues.map((x, i) => [x, yValues[i]]));
      slope = regression.m;

      if (slope > 0.1) {
        fundingTrend = 'increasing';
      } else if (slope < -0.1) {
        fundingTrend = 'decreasing';
      }

      const participationValues = dataPoints.map(d => d.uniqueVoters);
      const participationRegression = linearRegression(xValues.map((x, i) => [x, participationValues[i]]));
      
      if (participationRegression.m > 0.1) {
        participationTrend = 'increasing';
      } else if (participationRegression.m < -0.1) {
        participationTrend = 'decreasing';
      }
    } catch (error) {
      console.warn('Failed to calculate regression:', error);
    }
  }

  const seasonality = {
    detected: false,
    pattern: undefined as string | undefined
  };

  if (dataPoints.length >= 12 && interval === 'month') {
    const monthlyValues = dataPoints.map(d => d.proposalCount);
    const monthlyMean = mean(monthlyValues);
    const monthlyStdDev = standardDeviation(monthlyValues);
    
    const hasSeasonality = monthlyValues.some(v => 
      Math.abs(v - monthlyMean) > monthlyStdDev * 1.5
    );
    
    if (hasSeasonality) {
      seasonality.detected = true;
      seasonality.pattern = 'Cyclical pattern detected in proposal submissions';
    }
  }

  return {
    data: dataPoints,
    movingAverages,
    trends: {
      fundingTrend,
      participationTrend,
      slope
    },
    seasonality
  };
}
