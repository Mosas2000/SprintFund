interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = 300) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  set(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): {
    size: number;
    keys: string[];
    oldestEntry: { key: string; age: number } | null;
  } {
    const keys = Array.from(this.cache.keys());
    let oldestEntry: { key: string; age: number } | null = null;
    let maxAge = 0;

    this.cache.forEach((entry, key) => {
      const age = Date.now() - entry.timestamp;
      if (age > maxAge) {
        maxAge = age;
        oldestEntry = { key, age };
      }
    });

    return {
      size: this.cache.size,
      keys,
      oldestEntry,
    };
  }

  prune(): number {
    let removed = 0;
    const now = Date.now();

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removed += 1;
      }
    });

    return removed;
  }
}

export const analyticsCacheManager = new CacheManager<any>(300);
