/**
 * Local storage type-safe utilities.
 */

/**
 * Type-safe key-value storage with validation.
 */
export class TypedStorage {
  constructor(private storage: Storage = typeof window !== 'undefined' ? window.localStorage : createMockStorage()) {}

  /**
   * Set value with type safety.
   */
  set<T>(key: string, value: T, marshal?: (v: T) => string): void {
    try {
      const serialized = marshal ? marshal(value) : JSON.stringify(value);
      this.storage.setItem(key, serialized);
    } catch (err) {
      console.error(`Failed to store ${key}:`, err);
    }
  }

  /**
   * Get value with optional validation.
   */
  get<T>(key: string, unmarshal?: (s: string) => T): T | null {
    try {
      const item = this.storage.getItem(key);
      if (!item) return null;
      return unmarshal ? unmarshal(item) : JSON.parse(item);
    } catch (err) {
      console.error(`Failed to retrieve ${key}:`, err);
      return null;
    }
  }

  /**
   * Remove value.
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (err) {
      console.error(`Failed to remove ${key}:`, err);
    }
  }

  /**
   * Clear all values.
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  }

  /**
   * Check if key exists.
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }
}

/**
 * Mock storage for server-side rendering.
 */
function createMockStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

/**
 * Session storage alias using TypedStorage.
 */
export class SessionCache {
  private storage: TypedStorage;

  constructor() {
    this.storage =
      typeof window !== 'undefined'
        ? new TypedStorage(window.sessionStorage)
        : new TypedStorage(createMockStorage());
  }

  set<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  get<T>(key: string): T | null {
    return this.storage.get(key);
  }

  remove(key: string): void {
    this.storage.remove(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

/**
 * Persistent cache using local storage.
 */
export class PersistentCache {
  private storage: TypedStorage;

  constructor() {
    this.storage =
      typeof window !== 'undefined'
        ? new TypedStorage(window.localStorage)
        : new TypedStorage(createMockStorage());
  }

  set<T>(key: string, value: T, ttlSeconds?: number): void {
    const data = {
      value,
      expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null,
    };
    this.storage.set(key, data);
  }

  get<T>(key: string): T | null {
    const data = this.storage.get<{ value: T; expiresAt: number | null }>(key);
    if (!data) return null;

    if (data.expiresAt && Date.now() > data.expiresAt) {
      this.storage.remove(key);
      return null;
    }

    return data.value;
  }

  remove(key: string): void {
    this.storage.remove(key);
  }

  clear(): void {
    this.storage.clear();
  }

  isExpired(key: string): boolean {
    const data = this.storage.get<{ value: unknown; expiresAt: number | null }>(key);
    if (!data || !data.expiresAt) return false;
    return Date.now() > data.expiresAt;
  }
}
