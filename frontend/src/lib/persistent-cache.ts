const CACHE_KEY_PREFIX = 'sprintfund_cache_';
const CACHE_VERSION = 1;

interface PersistentCacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: number;
}

export class LocalStorageCache {
  private readonly prefix = CACHE_KEY_PREFIX;
  private readonly version = CACHE_VERSION;

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T, ttl: number): void {
    try {
      const entry: PersistentCacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        version: this.version,
      };
      localStorage.setItem(this.getKey(key), JSON.stringify(entry));
    } catch (err) {
      console.warn('Failed to set localStorage cache:', err);
    }
  }

  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;

      const entry: PersistentCacheEntry<T> = JSON.parse(stored);

      if (entry.version !== this.version) {
        this.remove(key);
        return null;
      }

      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      if (isExpired) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (err) {
      console.warn('Failed to get localStorage cache:', err);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (err) {
      console.warn('Failed to remove localStorage cache:', err);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.warn('Failed to clear localStorage cache:', err);
    }
  }

  getSize(): number {
    try {
      const keys = Object.keys(localStorage);
      return keys.filter((key) => key.startsWith(this.prefix)).length;
    } catch (err) {
      console.warn('Failed to get localStorage cache size:', err);
      return 0;
    }
  }
}

export const localStorageCache = new LocalStorageCache();
