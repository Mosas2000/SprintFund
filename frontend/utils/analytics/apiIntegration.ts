import { ProposalMetrics } from './dataCollector';

const STACKS_API_URL = 'https://api.hiro.so';
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const GITHUB_API_URL = 'https://api.github.com';

const CACHE_TTL = 60 * 60 * 1000;
const CACHE_PREFIX = 'api_cache_';

interface CachedResponse<T> {
  data: T;
  timestamp: number;
}

interface NetworkMetrics {
  blockHeight: number;
  avgBlockTime: number;
  avgFeeRate: number;
  pendingTransactions: number;
}

interface EnrichedProposal extends ProposalMetrics {
  usdValue?: number;
  githubData?: {
    stars: number;
    commits: number;
    contributors: number;
    lastUpdated: string;
  };
  networkContext?: {
    blockHeight: number;
    avgFee: number;
  };
}

class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastRequestTime = 0;
  private minInterval = 100;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }

    const fn = this.queue.shift();
    if (fn) {
      this.lastRequestTime = Date.now();
      await fn();
    }

    this.process();
  }
}

const rateLimiter = new RateLimiter();

function getCacheKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

function getCached<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(getCacheKey(key));
    if (!cached) return null;

    const parsed: CachedResponse<T> = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;

    if (age > CACHE_TTL) {
      localStorage.removeItem(getCacheKey(key));
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const cached: CachedResponse<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(getCacheKey(key), JSON.stringify(cached));
  } catch (error) {
    console.warn('Failed to cache API response:', error);
  }
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError!;
}

export async function fetchSTXPrice(timestamp?: number): Promise<number> {
  const cacheKey = timestamp 
    ? `stx_price_${timestamp}` 
    : 'stx_price_current';

  const cached = getCached<number>(cacheKey);
  if (cached !== null) return cached;

  try {
    let price: number;

    if (timestamp) {
      const date = new Date(timestamp);
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      
      const data = await rateLimiter.add(() =>
        fetchWithRetry<any>(
          `${COINGECKO_API_URL}/coins/blockstack/history?date=${formattedDate}`
        )
      );

      price = data.market_data?.current_price?.usd || 0;
    } else {
      const data = await rateLimiter.add(() =>
        fetchWithRetry<any>(
          `${COINGECKO_API_URL}/simple/price?ids=blockstack&vs_currencies=usd`
        )
      );

      price = data.blockstack?.usd || 0;
    }

    setCache(cacheKey, price);
    return price;
  } catch (error) {
    console.warn('Failed to fetch STX price:', error);
    return 0;
  }
}

export async function getNetworkMetrics(): Promise<NetworkMetrics> {
  const cacheKey = 'network_metrics';
  const cached = getCached<NetworkMetrics>(cacheKey);
  if (cached) return cached;

  try {
    const [blockInfo, mempoolInfo] = await Promise.all([
      rateLimiter.add(() =>
        fetchWithRetry<any>(`${STACKS_API_URL}/extended/v1/block?limit=10`)
      ),
      rateLimiter.add(() =>
        fetchWithRetry<any>(`${STACKS_API_URL}/extended/v1/tx/mempool?limit=1`)
      )
    ]);

    const blocks = blockInfo.results || [];
    const blockTimes = blocks
      .slice(0, -1)
      .map((block: any, i: number) => {
        const currentTime = new Date(block.burn_block_time_iso).getTime();
        const prevTime = new Date(blocks[i + 1].burn_block_time_iso).getTime();
        return currentTime - prevTime;
      });

    const avgBlockTime = blockTimes.length > 0
      ? blockTimes.reduce((a: number, b: number) => a + b, 0) / blockTimes.length / 1000
      : 600;

    const avgFeeRate = blocks.length > 0
      ? blocks.reduce((sum: number, b: any) => sum + (b.txs?.reduce((s: number, tx: any) => s + (tx.fee_rate || 0), 0) || 0), 0) / blocks.length
      : 0;

    const metrics: NetworkMetrics = {
      blockHeight: blocks[0]?.height || 0,
      avgBlockTime,
      avgFeeRate,
      pendingTransactions: mempoolInfo.total || 0
    };

    setCache(cacheKey, metrics);
    return metrics;
  } catch (error) {
    console.warn('Failed to fetch network metrics:', error);
    return {
      blockHeight: 0,
      avgBlockTime: 600,
      avgFeeRate: 0,
      pendingTransactions: 0
    };
  }
}

async function extractGithubUrl(text: string): Promise<string | null> {
  const githubPattern = /github\.com\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-_]+)/;
  const match = text.match(githubPattern);
  return match ? `${match[1]}/${match[2]}` : null;
}

async function fetchGithubData(repoPath: string): Promise<EnrichedProposal['githubData']> {
  const cacheKey = `github_${repoPath}`;
  const cached = getCached<EnrichedProposal['githubData']>(cacheKey);
  if (cached) return cached;

  try {
    const [repoData, commitsData, contributorsData] = await Promise.all([
      rateLimiter.add(() =>
        fetchWithRetry<any>(`${GITHUB_API_URL}/repos/${repoPath}`)
      ),
      rateLimiter.add(() =>
        fetchWithRetry<any>(`${GITHUB_API_URL}/repos/${repoPath}/commits?per_page=1`)
      ),
      rateLimiter.add(() =>
        fetchWithRetry<any>(`${GITHUB_API_URL}/repos/${repoPath}/contributors?per_page=100`)
      )
    ]);

    const data = {
      stars: repoData.stargazers_count || 0,
      commits: parseInt(commitsData[0]?.sha ? '1' : '0'),
      contributors: contributorsData.length || 0,
      lastUpdated: repoData.updated_at || new Date().toISOString()
    };

    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.warn(`Failed to fetch GitHub data for ${repoPath}:`, error);
    return undefined;
  }
}

export async function enrichProposalData(proposal: ProposalMetrics): Promise<EnrichedProposal> {
  const enriched: EnrichedProposal = { ...proposal };

  try {
    const [stxPrice, networkMetrics] = await Promise.all([
      fetchSTXPrice(proposal.createdAt * 10 * 60 * 1000),
      getNetworkMetrics()
    ]);

    if (stxPrice > 0) {
      enriched.usdValue = (proposal.amount / 1_000_000) * stxPrice;
    }

    enriched.networkContext = {
      blockHeight: networkMetrics.blockHeight,
      avgFee: networkMetrics.avgFeeRate
    };

    const githubUrl = await extractGithubUrl(proposal.title + ' ' + proposal.category);
    if (githubUrl) {
      enriched.githubData = await fetchGithubData(githubUrl);
    }
  } catch (error) {
    console.warn('Failed to enrich proposal data:', error);
  }

  return enriched;
}

export async function batchEnrichProposals(
  proposals: ProposalMetrics[],
  batchSize: number = 10
): Promise<EnrichedProposal[]> {
  const enriched: EnrichedProposal[] = [];

  for (let i = 0; i < proposals.length; i += batchSize) {
    const batch = proposals.slice(i, i + batchSize);
    const enrichedBatch = await Promise.all(
      batch.map(p => enrichProposalData(p))
    );
    enriched.push(...enrichedBatch);

    if (i + batchSize < proposals.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return enriched;
}

export function clearAPICache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear API cache:', error);
  }
}
