/**
 * Common patterns and reusable utilities for type-safe operations.
 */

import type { Proposal, ProposalPage, StakeInfo, VoteRecord } from '../types';
import { isValidProposal, isValidProposalPage } from './type-guards';

/**
 * Safe operation result that either succeeds with data or fails with error.
 */
export type Result<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Create a success result.
 */
export function success<T>(data: T): Result<T> {
  return { success: true, data };
}

/**
 * Create an error result.
 */
export function error<T>(message: string): Result<T> {
  return { success: false, error: message };
}

/**
 * Extract data from result or throw.
 */
export function getOrThrow<T>(result: Result<T>): T {
  if (result.success) return result.data;
  throw new Error(result.error);
}

/**
 * Extract data from result or return default.
 */
export function getOrDefault<T>(result: Result<T>, defaultValue: T): T {
  return result.success ? result.data : defaultValue;
}

/**
 * Chain operations on results.
 */
export function chain<T, U>(
  result: Result<T>,
  next: (data: T) => Result<U>,
): Result<U> {
  return result.success ? next(result.data) : error(result.error);
}

/**
 * Convert array to result - success if all items pass predicate.
 */
export function validateAll<T>(
  items: T[],
  predicate: (item: T) => boolean,
  errorMessage: string,
): Result<T[]> {
  if (items.every(predicate)) {
    return success(items);
  }
  return error(errorMessage);
}

/**
 * Async result wrapper.
 */
export type AsyncResult<T> = Promise<Result<T>>;

/**
 * Create an async resolved result.
 */
export function asyncSuccess<T>(data: T): AsyncResult<T> {
  return Promise.resolve(success(data));
}

/**
 * Create an async error result.
 */
export function asyncError<T>(message: string): AsyncResult<T> {
  return Promise.resolve(error(message));
}

/**
 * Safe pagination handler.
 */
export class PaginationHelper {
  constructor(
    private totalCount: number,
    private pageSize: number = 10,
  ) {}

  getCurrentPage(requestedPage: number): number {
    const totalPages = this.getTotalPages();
    return Math.max(1, Math.min(requestedPage, totalPages));
  }

  getTotalPages(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  getOffset(page: number): number {
    return (page - 1) * this.pageSize;
  }

  getRange(page: number): [number, number] {
    const offset = this.getOffset(page);
    return [offset, offset + this.pageSize - 1];
  }

  isValidPage(page: number): boolean {
    return page >= 1 && page <= this.getTotalPages();
  }
}

/**
 * Memo cache for expensive type operations.
 */
export class TypeCache<K, V> {
  private cache = new Map<K, V>();

  get(key: K, compute: () => V): V {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    const value = compute();
    this.cache.set(key, value);
    return value;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): void {
    this.cache.delete(key);
  }
}
