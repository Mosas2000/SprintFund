import { getBlockHeightDaysOld } from './block-height-utils';

export interface BlockHeightRange {
  label: string;
  description: string;
  minBlocks: number;
  maxBlocks: number;
  minAge: number;
  maxAge: number;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;
const ONE_MONTH_MS = 30 * ONE_DAY_MS;
const ONE_YEAR_MS = 365 * ONE_DAY_MS;

const BLOCKS_PER_DAY = (24 * 60 * 60 * 1000) / (10 * 60 * 1000);
const BLOCKS_PER_WEEK = BLOCKS_PER_DAY * 7;
const BLOCKS_PER_MONTH = BLOCKS_PER_DAY * 30;
const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365;

export const BLOCK_HEIGHT_RANGES: Record<string, BlockHeightRange> = {
  today: {
    label: 'Today',
    description: 'Last 24 hours',
    minBlocks: 0,
    maxBlocks: BLOCKS_PER_DAY,
    minAge: 0,
    maxAge: ONE_DAY_MS,
  },
  lastWeek: {
    label: 'Last Week',
    description: 'Last 7 days',
    minBlocks: BLOCKS_PER_DAY,
    maxBlocks: BLOCKS_PER_WEEK,
    minAge: ONE_DAY_MS,
    maxAge: ONE_WEEK_MS,
  },
  lastMonth: {
    label: 'Last Month',
    description: 'Last 30 days',
    minBlocks: BLOCKS_PER_WEEK,
    maxBlocks: BLOCKS_PER_MONTH,
    minAge: ONE_WEEK_MS,
    maxAge: ONE_MONTH_MS,
  },
  lastYear: {
    label: 'Last Year',
    description: 'Last 365 days',
    minBlocks: BLOCKS_PER_MONTH,
    maxBlocks: BLOCKS_PER_YEAR,
    minAge: ONE_MONTH_MS,
    maxAge: ONE_YEAR_MS,
  },
  older: {
    label: 'Older',
    description: 'More than 1 year ago',
    minBlocks: BLOCKS_PER_YEAR,
    maxBlocks: Infinity,
    minAge: ONE_YEAR_MS,
    maxAge: Infinity,
  },
};

export function getBlockHeightRange(blockHeight: number | null | undefined): string | null {
  const daysOld = getBlockHeightDaysOld(blockHeight);
  if (daysOld === null) return null;

  for (const [key, range] of Object.entries(BLOCK_HEIGHT_RANGES)) {
    if (daysOld * ONE_DAY_MS >= range.minAge && daysOld * ONE_DAY_MS < range.maxAge) {
      return key;
    }
  }

  return 'older';
}

export function blockHeightsBetween(
  blockHeights: (number | null | undefined)[],
  minAge: number,
  maxAge: number,
): (number | null | undefined)[] {
  return blockHeights.filter((bh) => {
    const daysOld = getBlockHeightDaysOld(bh);
    if (daysOld === null) return false;
    const ageMs = daysOld * ONE_DAY_MS;
    return ageMs >= minAge && ageMs <= maxAge;
  });
}

export function blockHeightsSince(blockHeights: (number | null | undefined)[], ageMs: number) {
  return blockHeightsBetween(blockHeights, 0, ageMs);
}

export function blockHeightsAfter(blockHeights: (number | null | undefined)[], ageMs: number) {
  return blockHeightsBetween(blockHeights, ageMs, Infinity);
}

export function getBlockHeightIntervals(count: number): BlockHeightRange[] {
  const ranges = Object.values(BLOCK_HEIGHT_RANGES);
  if (count >= ranges.length) return ranges;
  return ranges.slice(0, count);
}
