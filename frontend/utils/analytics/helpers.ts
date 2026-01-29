import { ProposalMetrics } from './dataCollector';
import { startOfWeek, startOfMonth, startOfQuarter, startOfYear, subWeeks, subMonths, subQuarters, subYears, endOfDay } from 'date-fns';

export type MetricType = 'currency' | 'percentage' | 'number';
export type Period = 'week' | 'month' | 'quarter' | 'year';
export type Trend = 'increasing' | 'decreasing' | 'stable';

export interface DateRange {
  start: Date;
  end: Date;
}

const MICRO_STX = 1_000_000;

export function formatMetric(value: number, type: MetricType): string {
  if (isNaN(value) || !isFinite(value)) {
    return type === 'currency' ? '$0' : type === 'percentage' ? '0%' : '0';
  }

  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return formatPercentage(value);
    case 'number':
      return formatNumber(value);
    default:
      return String(value);
  }
}

function formatCurrency(microStx: number): string {
  const stx = microStx / MICRO_STX;
  
  if (stx === 0) return '0 STX';
  if (stx < 0.01) return '<0.01 STX';
  if (stx < 1) return `${stx.toFixed(2)} STX`;
  if (stx < 1000) return `${stx.toFixed(1)} STX`;
  if (stx < 1_000_000) return `${(stx / 1000).toFixed(1)}K STX`;
  if (stx < 1_000_000_000) return `${(stx / 1_000_000).toFixed(1)}M STX`;
  
  return `${(stx / 1_000_000_000).toFixed(1)}B STX`;
}

function formatPercentage(value: number): string {
  if (value === 0) return '0%';
  if (Math.abs(value) < 0.01) return '<0.01%';
  if (Math.abs(value) < 1) return `${value.toFixed(2)}%`;
  if (Math.abs(value) < 10) return `${value.toFixed(1)}%`;
  
  return `${Math.round(value)}%`;
}

function formatNumber(value: number): string {
  if (value === 0) return '0';
  if (Math.abs(value) < 1000) return Math.round(value).toString();
  if (Math.abs(value) < 1_000_000) return `${(value / 1000).toFixed(1)}K`;
  if (Math.abs(value) < 1_000_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  
  return `${(value / 1_000_000_000).toFixed(1)}B`;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  if (current === 0) return -100;
  
  const rate = ((current - previous) / Math.abs(previous)) * 100;
  
  if (!isFinite(rate)) return 0;
  
  return Math.max(-100, Math.min(rate, 1000));
}

export function generateDateRange(period: Period): DateRange {
  const end = endOfDay(new Date());
  let start: Date;

  switch (period) {
    case 'week':
      start = startOfWeek(subWeeks(end, 1));
      break;
    case 'month':
      start = startOfMonth(subMonths(end, 1));
      break;
    case 'quarter':
      start = startOfQuarter(subQuarters(end, 1));
      break;
    case 'year':
      start = startOfYear(subYears(end, 1));
      break;
    default:
      start = startOfMonth(subMonths(end, 1));
  }

  return { start, end };
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  development: ['dev', 'code', 'software', 'build', 'app', 'tool', 'api', 'library', 'framework'],
  marketing: ['market', 'promo', 'campaign', 'advertis', 'outreach', 'social', 'brand'],
  community: ['community', 'event', 'meetup', 'gathering', 'workshop', 'engagement'],
  infrastructure: ['infra', 'server', 'network', 'node', 'hosting', 'deploy'],
  education: ['educat', 'tutorial', 'learn', 'course', 'workshop', 'training', 'guide'],
  research: ['research', 'study', 'analys', 'paper', 'report', 'investigation'],
  design: ['design', 'ui', 'ux', 'graphics', 'visual', 'interface'],
  content: ['content', 'article', 'blog', 'video', 'podcast', 'documentation']
};

export function categorizeProposal(proposal: ProposalMetrics): string {
  if (proposal.category && proposal.category !== 'other') {
    return proposal.category;
  }

  const text = `${proposal.title} ${proposal.category}`.toLowerCase();
  
  const categoryScores: Record<string, number> = {};
  
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const score = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    if (score > 0) {
      categoryScores[category] = score;
    }
  });

  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1]);

  return sortedCategories.length > 0 ? sortedCategories[0][0] : 'other';
}

export function calculatePercentile(value: number, dataset: number[]): number {
  if (dataset.length === 0) return 0;
  if (dataset.length === 1) return value >= dataset[0] ? 100 : 0;

  const sorted = [...dataset].sort((a, b) => a - b);
  
  let count = 0;
  for (const val of sorted) {
    if (val < value) count++;
    else if (val === value) count += 0.5;
  }

  return (count / sorted.length) * 100;
}

export function detectTrend(timeseries: number[]): Trend {
  if (timeseries.length < 2) return 'stable';

  const halfwayPoint = Math.floor(timeseries.length / 2);
  const firstHalf = timeseries.slice(0, halfwayPoint);
  const secondHalf = timeseries.slice(halfwayPoint);

  const avgFirst = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  if (avgFirst === 0) {
    return avgSecond > 0 ? 'increasing' : 'stable';
  }

  const changePercent = ((avgSecond - avgFirst) / Math.abs(avgFirst)) * 100;

  if (changePercent > 10) return 'increasing';
  if (changePercent < -10) return 'decreasing';
  
  return 'stable';
}

export function colorScaleGenerator(value: number, min: number, max: number): string {
  if (min === max) return 'bg-gray-500';
  
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  if (normalized < 0.2) return 'bg-red-500';
  if (normalized < 0.4) return 'bg-orange-500';
  if (normalized < 0.6) return 'bg-yellow-500';
  if (normalized < 0.8) return 'bg-lime-500';
  
  return 'bg-green-500';
}

export function colorScaleText(value: number, min: number, max: number): string {
  if (min === max) return 'text-gray-500';
  
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  if (normalized < 0.2) return 'text-red-500';
  if (normalized < 0.4) return 'text-orange-500';
  if (normalized < 0.6) return 'text-yellow-500';
  if (normalized < 0.8) return 'text-lime-500';
  
  return 'text-green-500';
}

export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(variance);
}

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  
  return sorted[mid];
}

export function normalizeValue(value: number, min: number, max: number): number {
  if (min === max) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export function isOutlier(value: number, dataset: number[], threshold: number = 2): boolean {
  if (dataset.length < 3) return false;
  
  const mean = dataset.reduce((sum, val) => sum + val, 0) / dataset.length;
  const stdDev = calculateStandardDeviation(dataset);
  
  if (stdDev === 0) return false;
  
  const zScore = Math.abs((value - mean) / stdDev);
  return zScore > threshold;
}

export function calculateMovingAverage(values: number[], windowSize: number): number[] {
  if (values.length < windowSize) return values;
  
  const result: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < windowSize - 1) {
      result.push(values[i]);
    } else {
      const window = values.slice(i - windowSize + 1, i + 1);
      const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
      result.push(avg);
    }
  }
  
  return result;
}

export function groupByTimeInterval(
  data: Array<{ timestamp: number; value: number }>,
  intervalMs: number
): Array<{ timestamp: number; values: number[]; avg: number }> {
  if (data.length === 0) return [];
  
  const grouped = new Map<number, number[]>();
  
  data.forEach(item => {
    const bucket = Math.floor(item.timestamp / intervalMs) * intervalMs;
    const existing = grouped.get(bucket) || [];
    existing.push(item.value);
    grouped.set(bucket, existing);
  });
  
  return Array.from(grouped.entries())
    .map(([timestamp, values]) => ({
      timestamp,
      values,
      avg: values.reduce((sum, val) => sum + val, 0) / values.length
    }))
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
