import { formatBlockHeight, formatBlockHeightShort, getBlockTimestampEstimate } from './block-height';

export function isValidBlockHeight(value: unknown): value is number {
  if (typeof value !== 'number') return false;
  if (!isFinite(value)) return false;
  if (value < 0) return false;
  return true;
}

export function validateBlockHeight(value: unknown, fieldName: string = 'blockHeight'): number {
  if (!isValidBlockHeight(value)) {
    throw new Error(`Invalid ${fieldName}: expected non-negative number, got ${typeof value}`);
  }
  return value;
}

export function assertBlockHeight(value: unknown, message?: string): asserts value is number {
  if (!isValidBlockHeight(value)) {
    throw new Error(message ?? 'Invalid block height');
  }
}

export function getBlockHeightAge(blockHeight: number | null | undefined): number | null {
  const timestamp = getBlockTimestampEstimate(blockHeight);
  if (!timestamp) return null;
  return Date.now() - timestamp;
}

export function getBlockHeightDaysOld(blockHeight: number | null | undefined): number | null {
  const ageMs = getBlockHeightAge(blockHeight);
  if (ageMs === null) return null;
  return Math.floor(ageMs / (24 * 60 * 60 * 1000));
}

export function isBlockHeightRecent(
  blockHeight: number | null | undefined,
  withinMs: number = 60 * 60 * 1000,
): boolean {
  const ageMs = getBlockHeightAge(blockHeight);
  if (ageMs === null) return false;
  return ageMs <= withinMs;
}

export function compareBlockHeights(a: number | null | undefined, b: number | null | undefined): number {
  const aVal = a ?? 0;
  const bVal = b ?? 0;
  return aVal - bVal;
}

export function sortBlockHeightsByNewest(
  blockHeights: (number | null | undefined)[],
): (number | null | undefined)[] {
  return [...blockHeights].sort((a, b) => compareBlockHeights(b, a));
}

export function sortBlockHeightsByOldest(
  blockHeights: (number | null | undefined)[],
): (number | null | undefined)[] {
  return [...blockHeights].sort((a, b) => compareBlockHeights(a, b));
}
