Blockchain Caching API Reference

Core Modules
============

1. frontend/src/lib/blockchain-cache.ts
   Main in-memory cache manager

2. frontend/src/lib/persistent-cache.ts
   LocalStorage persistence layer

3. frontend/src/hooks/useCacheInvalidation.ts
   React hook for invalidation management

4. frontend/src/hooks/useMutationWithCache.ts
   Mutation helpers with auto-invalidation

5. frontend/src/hooks/useStaleWhileRevalidate.ts
   SWR pattern implementation

6. frontend/src/lib/stacks.ts
   Integrated API with cache support


BlockchainDataCache (blockchain-cache.ts)
==========================================

Constructor
  new BlockchainDataCache()

Properties
  proposals: Map<number, CacheEntry<Proposal>>
  proposalPages: Map<string, CacheEntry<ProposalPage>>
  proposalCounts: Map<string, CacheEntry<number>>
  stakes: Map<string, CacheEntry<number>>
  minStakeAmounts: Map<string, CacheEntry<number>>

Constants
  DEFAULT_TTL_MS = 10 * 60 * 1000 (600s)
  SHORT_TTL_MS = 30 * 1000 (30s)
  LONG_TTL_MS = 60 * 60 * 1000 (3600s)

Methods - Set

  setProposal(id: number, proposal: Proposal, ttl?: number): void
    Set proposal cache with optional TTL override

  setProposalPage(page: number, pageSize: number, data: ProposalPage, ttl?: number): void
    Cache proposal page by page number and size

  setProposalCount(count: number, ttl?: number): void
    Cache total proposal count

  setStake(address: string, amount: number, ttl?: number): void
    Cache stake amount for address

  setMinStakeAmount(amount: number, ttl?: number): void
    Cache min stake amount (uses LONG_TTL_MS by default)

Methods - Get

  getProposal(id: number): Proposal | null
    Retrieve proposal if cached and not expired

  getProposalPage(page: number, pageSize: number): ProposalPage | null
    Retrieve proposal page if cached and not expired

  getProposalCount(): number | null
    Get cached proposal count if not expired

  getStake(address: string): number | null
    Get cached stake for address if not expired

  getMinStakeAmount(): number | null
    Get cached min stake amount if not expired

Methods - Invalidate

  invalidateProposal(id: number): void
    Remove single proposal from cache

  invalidateProposalPages(): void
    Clear all proposal page caches

  invalidateProposalCount(): void
    Clear proposal count cache

  invalidateStake(address: string): void
    Remove stake cache for address

  invalidateAll(): void
    Clear entire in-memory cache

Methods - Utilities

  getStats(): CacheStats
    Returns: { hits: number, misses: number, hitRate: number, lastReset: number }
    Get cache performance statistics

  resetStats(): void
    Reset hit/miss counters

  getSize(): number
    Get total number of cached entries

  clear(): void
    Clear all cache and reset stats

Example Usage

  import { blockchainCache } from '../lib/blockchain-cache';

  // Get or fetch proposal
  let proposal = blockchainCache.getProposal(1);
  if (proposal === null) {
    proposal = await fetchProposalFromBlockchain(1);
    blockchainCache.setProposal(1, proposal);
  }

  // Check cache performance
  const stats = blockchainCache.getStats();
  console.log(`Cache hit rate: ${stats.hitRate}%`);

  // Invalidate after mutation
  blockchainCache.invalidateProposal(1);


LocalStorageCache (persistent-cache.ts)
=======================================

Constructor
  new LocalStorageCache()

Constants
  CACHE_KEY_PREFIX = 'sprintfund_cache_'
  CACHE_VERSION = 1

Methods - Set

  set<T>(key: string, value: T, ttl: number): void
    Store data in localStorage with TTL

  Example:
    localStorageCache.set('proposal:1', proposal, 10 * 60 * 1000);

Methods - Get

  get<T>(key: string): T | null
    Retrieve from localStorage if cached and not expired

  Example:
    const proposal = localStorageCache.get<Proposal>('proposal:1');

Methods - Remove

  remove(key: string): void
    Delete specific cache entry

  Example:
    localStorageCache.remove('proposal:1');

Methods - Utilities

  clear(): void
    Clear all sprintfund cache entries from localStorage

  getSize(): number
    Count of cache entries in localStorage

Error Handling
  All methods silently fail with console.warn
  Useful for quota errors or private browsing


useBlockchainCacheInvalidation (useCacheInvalidation.ts)
=========================================================

Hook Options
  interface UseBlockchainCacheOptions {
    revalidateOnFocus?: boolean;           // Default: true
    revalidateOnVisibilityChange?: boolean; // Default: true
  }

Return Value
  {
    invalidateProposal: (id: number) => void
    invalidateProposals: () => void        // pages + count
    invalidateStake: (address: string) => void
    invalidateAll: () => void
  }

Usage

  const cache = useBlockchainCacheInvalidation();

  cache.invalidateProposal(123);
  cache.invalidateProposals();
  cache.invalidateStake('SP123');
  cache.invalidateAll();

Behavior
  - On window focus: Invalidates all cache
  - On tab visibility change: Invalidates all cache
  - On component unmount: Cleans up listeners


useMutationWithCache (useMutationWithCache.ts)
==============================================

Return Value
  {
    isLoading: boolean
    error: Error | null
    createProposal: (callFn, options?) => Promise<string>
    vote: (id, callFn, options?) => Promise<string>
    executeProposal: (id, callFn, options?) => Promise<string>
    updateStake: (address, callFn, options?) => Promise<string>
  }

Options Format
  interface MutationOptions {
    onSuccess?: (txId: string) => void
    onError?: (error: Error) => void
  }

Methods

  createProposal(callFn, options?)
    Params: callFn: (cb: TxCallbacks) => Promise<void>
    Returns: Promise<string> (txId)
    Invalidates: ProposalPages, ProposalCount

  vote(id, callFn, options?)
    Params: id: number, callFn: (cb: TxCallbacks) => Promise<void>
    Returns: Promise<string> (txId)
    Invalidates: Proposal[id], ProposalPages

  executeProposal(id, callFn, options?)
    Params: id: number, callFn: (cb: TxCallbacks) => Promise<void>
    Returns: Promise<string> (txId)
    Invalidates: Proposal[id], ProposalPages

  updateStake(address, callFn, options?)
    Params: address: string, callFn: (cb: TxCallbacks) => Promise<void>
    Returns: Promise<string> (txId)
    Invalidates: Stake[address]

Usage

  function VoteButton({ proposalId }) {
    const { vote, isLoading, error } = useMutationWithCache();

    const handleVote = async () => {
      try {
        const txId = await vote(proposalId, callVote, {
          onSuccess: (txId) => {
            toast.success(`Vote submitted: ${txId}`);
          },
          onError: (err) => {
            toast.error(`Vote failed: ${err.message}`);
          }
        });
      } catch (err) {}
    };

    return (
      <>
        <button onClick={handleVote} disabled={isLoading}>
          {isLoading ? 'Voting...' : 'Vote'}
        </button>
        {error && <p>{error.message}</p>}
      </>
    );
  }


useStaleWhileRevalidate (useStaleWhileRevalidate.ts)
====================================================

Hook Options
  interface UseStaleWhileRevalidateOptions<T> {
    staleTime?: number;                    // Default: 10 min
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }

Return Value
  {
    data: T | null
    isLoading: boolean
    isStale: boolean
    error: Error | null
    revalidate: () => void
  }

Parameters
  fetchFn: () => Promise<T>  - Function that fetches data
  options?: UseStaleWhileRevalidateOptions<T>

Usage

  function ProposalList() {
    const { data, isStale, error, revalidate } = useStaleWhileRevalidate(
      () => getProposalsPage({ page: 1, pageSize: 10 }),
      { staleTime: 10 * 60 * 1000 }
    );

    if (error) return <div>Error: {error.message}</div>;
    if (!data) return <div>Loading...</div>;

    return (
      <>
        <p>{isStale ? 'Updating...' : 'Fresh data'}</p>
        {data.proposals.map(p => (
          <ProposalItem key={p.id} proposal={p} />
        ))}
        <button onClick={revalidate}>Manual refresh</button>
      </>
    );
  }

Behavior
  - Shows cached data immediately (0ms wait)
  - Fetches fresh data in background after staleTime
  - isStale = true during background fetch
  - Prevents multiple concurrent fetches
  - onSuccess/onError callbacks fire on completion


stacks.ts Integration
=====================

Cache-aware API functions:

  getProposal(id: number): Promise<Proposal | null>
    - Checks cache first
    - Fetches if not cached or forceRefresh
    - Stores result in cache

  getProposalCount(options?: { forceRefresh?: boolean }): Promise<number>
    - Checks cache first (unless forceRefresh)
    - Returns cached value if available
    - Stores result in cache

  getProposalsPage(options?: ProposalPageOptions): Promise<ProposalPage>
    - Caches per page/pageSize
    - Returns cached page if available
    - Caches empty pages too

  getStake(address: string): Promise<number>
    - Checks cache per address
    - Caches successful fetches

  getMinStakeAmount(): Promise<number>
    - Checks cache once (long TTL)
    - Very stable data, caches long

Cache Invalidation Exports:

  invalidateProposalCache(id: number): void
  invalidateProposalPagesCache(): void
  invalidateProposalCountCache(): void
  invalidateStakeCache(address: string): void
  invalidateAllBlockchainCache(): void

Usage in Components

  import { callVote, invalidateProposalCache } from '../lib/stacks';

  function handleVote() {
    callVote(proposalId, true, weight, {
      onFinish: (txId) => {
        invalidateProposalCache(proposalId);
        toast.success(`Vote submitted!`);
      }
    });
  }


Performance Metrics
===================

Measuring Cache Effectiveness

  const stats = blockchainCache.getStats();
  console.log(`
    Hits: ${stats.hits}
    Misses: ${stats.misses}
    Hit Rate: ${stats.hitRate}%
  `);

Target Hit Rates
  First load: 0% (no cache)
  Normal usage: 60-80% (good)
  Heavy caching: 80%+ (excellent)

Expected Performance Gains
  Single proposal load: 500ms → 5ms (100x faster)
  Proposal list: 500ms → 5ms (100x faster)
  Background revalidation: Invisible to user
  Tab switch: 500ms + network → 0ms visible wait


Debugging Commands
==================

Run in browser console:

  // Get cache stats
  blockchainCache.getStats()

  // Get cache size
  blockchainCache.getSize()

  // Clear all cache
  blockchainCache.clear()

  // Clear localStorage cache
  localStorageCache.clear()

  // Get single proposal from cache
  blockchainCache.getProposal(1)

  // Manually invalidate proposal
  blockchainCache.invalidateProposal(1)

  // Export stats to JSON
  JSON.stringify(blockchainCache.getStats())


Troubleshooting
===============

Issue: Cache not working?
  Solution: Check browser console for errors
  Verify: blockchainCache.getSize() > 0

Issue: Data seems stale?
  Solution: Decrease TTL in cache manager
  Or: Force refresh with forceRefresh: true

Issue: localStorage full?
  Solution: Clear old entries with localStorageCache.clear()
  Monitor: Check localStorage size regularly

Issue: Cache invalidation not working?
  Solution: Verify invalidation function called
  Debug: Add console.log before invalidation
  Check: Verify exact cache key matches

Integration Checklist
====================

[ ] Import blockchainCache in stacks.ts
[ ] Replace old cache with new implementation
[ ] Test cache is-working with stats()
[ ] Add invalidation after mutations
[ ] Use useCacheInvalidation in components
[ ] Test window focus invalidation
[ ] Monitor cache performance
[ ] Document custom TTLs if modified
[ ] Test localStorage persistence
[ ] Verify offline functionality
