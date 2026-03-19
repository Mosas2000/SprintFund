import { blockchainCache } from './blockchain-cache';
import type { Proposal } from '../types';

interface BenchmarkResult {
  operation: string;
  duration: number;
  itemCount: number;
  avgTimePerItem: number;
  status: 'pass' | 'fail';
}

export class CacheBenchmark {
  private results: BenchmarkResult[] = [];

  async benchmarkCacheWrites(itemCount: number = 1000): Promise<BenchmarkResult> {
    const mockProposal: Proposal = {
      id: 0,
      title: 'Test',
      description: 'Test proposal',
      amount: 1000000,
      proposer: 'SP123',
      votesFor: 0,
      votesAgainst: 0,
      executed: false,
      createdAt: 0,
    };

    const start = performance.now();

    for (let i = 0; i < itemCount; i++) {
      blockchainCache.setProposal(i, { ...mockProposal, id: i });
    }

    const duration = performance.now() - start;

    const result: BenchmarkResult = {
      operation: `Write ${itemCount} proposals`,
      duration: Math.round(duration),
      itemCount,
      avgTimePerItem: Math.round(duration / itemCount * 1000) / 1000,
      status: duration < 5000 ? 'pass' : 'fail',
    };

    this.results.push(result);
    return result;
  }

  async benchmarkCacheReads(itemCount: number = 1000): Promise<BenchmarkResult> {
    const start = performance.now();

    for (let i = 0; i < itemCount; i++) {
      blockchainCache.getProposal(i);
    }

    const duration = performance.now() - start;

    const result: BenchmarkResult = {
      operation: `Read ${itemCount} proposals`,
      duration: Math.round(duration),
      itemCount,
      avgTimePerItem: Math.round(duration / itemCount * 1000000) / 1000,
      status: duration < 50 ? 'pass' : 'fail',
    };

    this.results.push(result);
    return result;
  }

  async benchmarkCacheMiss(itemCount: number = 1000): Promise<BenchmarkResult> {
    blockchainCache.clear();

    const start = performance.now();

    for (let i = 10000; i < 10000 + itemCount; i++) {
      blockchainCache.getProposal(i);
    }

    const duration = performance.now() - start;

    const result: BenchmarkResult = {
      operation: `Cache miss for ${itemCount} items`,
      duration: Math.round(duration),
      itemCount,
      avgTimePerItem: Math.round(duration / itemCount * 1000000) / 1000,
      status: duration < 50 ? 'pass' : 'fail',
    };

    this.results.push(result);
    return result;
  }

  async runFullBenchmark(): Promise<BenchmarkResult[]> {
    console.log('Starting cache benchmarks...');

    blockchainCache.clear();

    const writeResult = await this.benchmarkCacheWrites(1000);
    console.log(`Write benchmark: ${writeResult.avgTimePerItem}ms per item`);

    const readResult = await this.benchmarkCacheReads(1000);
    console.log(`Read benchmark: ${readResult.avgTimePerItem}µs per item`);

    const missResult = await this.benchmarkCacheMiss(1000);
    console.log(`Cache miss benchmark: ${missResult.avgTimePerItem}µs per item`);

    return this.results;
  }

  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  getSummary(): string {
    const passCount = this.results.filter((r) => r.status === 'pass').length;
    const failCount = this.results.filter((r) => r.status === 'fail').length;

    return `
Benchmark Results:
  Operations: ${this.results.length}
  Passed: ${passCount}
  Failed: ${failCount}
  Total Time: ${this.results.reduce((sum, r) => sum + r.duration, 0)}ms
    `;
  }

  clearResults(): void {
    this.results = [];
  }
}

export const cacheBenchmark = new CacheBenchmark();
