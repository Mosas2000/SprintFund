Blockchain Data Caching Strategy

Overview
========
Comprehensive multi-layer caching system to eliminate redundant blockchain
API calls and improve perceived performance.

Architecture
============

Layer 1: In-Memory Cache (blockchain-cache.ts)
  - Fast, in-process memory cache
  - Configurable TTL per data type
  - Used for proposal, stake, and count data
  - Cleared on page refresh
  - Default TTLs:
    * Proposals: 10 minutes
    * Proposal pages: 10 minutes
    * Proposal counts: 10 minutes
    * Stakes: 10 minutes
    * Min stake: 60 minutes (unlikely to change)

Layer 2: localStorage Persistence (persistent-cache.ts)
  - Survives page reloads and browser restarts
  - TTL-based expiration in localStorage
  - Useful for initialization data and constants
  - Can store large result sets if needed
  - Gracefully handles quota errors

Layer 3: HTTP Caching (Browser)
  - Browser's built-in HTTP caching
  - Controlled by response headers
  - Automatic by browser, no code needed

Cache Invalidation Strategy
===========================

Automatic Invalidation
  - Time-based: Configured TTL per data type
  - Window focus: Full cache invalidation when user returns to tab
  - Visibility change: Invalidate when browser tab becomes visible

Manual Invalidation
  - After successful mutations (create, vote, execute)
  - Component-driven with useCacheInvalidation hook
  - Specific to changed resources

Data Types and TTLs
===================

Proposal (single)
  TTL: 10 minutes (600 seconds)
  Cached by: ID
  Invalidated on: Vote, Execute
  Mutation impact: High (contents change)

Proposal Pages
  TTL: 10 minutes (600 seconds)
  Cached by: Page number + Page size
  Invalidated on: New proposal, Proposal change
  Mutation impact: Medium (structure changes)

Proposal Count
  TTL: 10 minutes (600 seconds)
  Cached by: Global
  Invalidated on: Create proposal
  Mutation impact: High

Stake (per address)
  TTL: 10 minutes (600 seconds)
  Cached by: Address
  Invalidated on: Stake/Withdraw transaction
  Mutation impact: High (value changes)

Min Stake Amount
  TTL: 60 minutes (3600 seconds)
  Cached by: Global
  Invalidated on: Never (contract constant)
  Mutation impact: None (immutable)

Cache Keys
==========

In-Memory Cache Keys
  proposal:<id>                    "proposal:1"
  proposal-page:<page>:<size>     "proposal-page:1:10"
  proposal-count:global           "proposal-count:global"
  stake:<address>                 "stake:SP123..."
  min-stake:global                "min-stake:global"

LocalStorage Keys
  sprintfund_cache_<key>          "sprintfund_cache_proposal:1"

Implementation Patterns
=======================

Pattern 1: Simple Cache Check (in stacks.ts)
  const cached = blockchainCache.getProposal(id);
  if (cached !== null) return cached;

  const result = await fetchFromBlockchain();
  blockchainCache.setProposal(id, result);
  return result;

Pattern 2: Background Revalidation (useStaleWhileRevalidate)
  const { data, isStale } = useStaleWhileRevalidate(fetchFn);
  return <Component data={data} isStale={isStale} />;

Pattern 3: Mutation with Cache Invalidation
  const { vote, isLoading } = useMutationWithCache();
  await vote(proposalId, callVote);
  // Cache automatically invalidated on success

Pattern 4: Manual Invalidation
  const { invalidateProposal } = useBlockchainCacheInvalidation();
  invalidateProposal(proposalId);

Cache Hit Scenarios
===================

Scenario 1: User browses proposals
  1. User loads /proposals
  2. getProposalsPage() fetches from blockchain
  3. Result cached in memory (10 min TTL)
  4. User clicks page 2
  5. New fetch if not cached
  6. Both pages cached independently
  7. User returns to page 1 within 10 min
  8. Served from cache → instant load

Scenario 2: User tabs away and returns
  1. User browses proposals (cached)
  2. User switches browser tab (away for 5 min)
  3. User returns to tab
  4. Window focus event fires
  5. Cache invalidated
  6. Fresh fetch on next interaction → accurate data

Scenario 3: User votes on proposal
  1. User on ProposalDetail page (cached)
  2. User submits vote
  3. useMutationWithCache handles vote transaction
  4. On success, proposal cache invalidated
  5. Vote count reflects immediately on refresh
  6. Proposal pages cache also invalidated
  7. Data re-fetched on next access

Scenario 4: User creates new proposal
  1. User submits CreateProposal form
  2. Transaction succeeds
  3. Both proposal pages and count invalidated
  4. User navigates to proposal list
  5. Fresh fetch gets new proposal count
  6. New pagination reflects immediately

Performance Impact
===================

Typical User Flow Without Caching
  Load proposals: 500ms (API call)
  Switch tab: 500ms (API call on return)
  Vote: 2000ms (API call + tx)
  Back to list: 500ms (API call)
  Total: 3500ms

Typical User Flow With Caching
  Load proposals: 500ms (API call)
  Switch tab: 0ms (cache + bg fetch)
  Vote: 2000ms (API call + tx)
  Back to list: 0ms (cache, bg fetch)
  Total: 2500ms

Reduction: 1000ms (29% faster)
Plus: Offline-capable, smoother UX

Cache Statistics Monitoring
===========================

Access blockchainCache stats:
  const stats = blockchainCache.getStats();
  console.log(stats.hits);       // Number of cache hits
  console.log(stats.misses);     // Number of cache misses
  console.log(stats.hitRate);    // Hit rate percentage

Example Output:
  {
    hits: 47,
    misses: 12,
    hitRate: 79.66,
    lastReset: 1611234567890
  }

Reset stats: blockchainCache.resetStats()

Cache Debugging
===============

Enable verbose logging:
  // In browser console
  const cache = window.__CACHE_DEBUG__ = blockchainCache;
  cache.getStats();
  cache.getSize();

Clear all cache:
  blockchainCache.clear();

Invalidate specific proposal:
  blockchainCache.invalidateProposal(123);

Clear localStorage cache:
  localStorageCache.clear();

Best Practices
==============

1. Use forceRefresh when necessary
   getProposalCount({ forceRefresh: true })

2. Let TTL expire naturally (don't over-invalidate)
   More invalidation = more api calls

3. Invalidate on mutations automatically
   Use useMutationWithCache hook

4. Use SWR pattern for better UX
   useStaleWhileRevalidate shows cached data immediately

5. Monitor cache hit rate in development
   Compare before/after caching implementation

6. Set appropriate TTLs based on data volatility
   Stable data: longer TTL
   Volatile data: shorter TTL

7. Consider user bandwidth and network latency
   Caching more important on slow connections

Cache Invalidation Timing
=========================

Immediate (on transaction success)
  - Affected proposal
  - Affected proposal page(s)
  - Proposal count

Delayed (on window focus)
  - All cached data
  - Intended to capture multiple changes

Time-based (TTL expiration)
  - All entries naturally expire
  - Prevents stale data indefinitely

Network Status Considerations
=============================

Online after offline:
  - Cache still valid if TTL not expired
  - Network becomes available: fresh fetch in background
  - Window focus: triggers revalidation

Slow connection:
  - Cached data serves immediately
  - Better UX than waiting for slow API
  - Background fetch queued

No network connection:
  - Cached data served
  - App remains functional
  - Graceful degradation

API Error Recovery
===================

If API call fails:
  - Keep existing cache intact
  - Don't invalidate on error
  - Retry with exponential backoff possible

If cache is corrupted:
  - TTL expiration removes eventually
  - Manual clear() available
  - localStorage errors handled gracefully

Compatibility Notes
===================

Browser Requirements:
  - ES6+ JavaScript (all modern browsers)
  - localStorage support for persistence
  - AbortController for request cancellation

Polyfills probably not needed:
  - All target browsers have required features
  - Graceful degradation without localStorage

React Versions:
  - Works with React 16.8+ (hooks)
  - Compatible with React 18+
  - No breaking changes

Future Optimizations
====================

Possible enhancements:
  - IndexedDB for larger caches
  - Service Worker for offline support
  - Compression for localStorage entries
  - LRU eviction for memory management
  - Cache warming on app start
  - Analytics on cache behavior
  - Differential caching per network speed
