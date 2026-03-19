Caching Integration Guide

Getting Started
===============

The caching system is already integrated into the API layer (stacks.ts).
Most components don't need any changes - they automatically benefit from caching.

For components that need cache control:

1. Automatic Cache Invalidation After Mutations
2. Manual Cache Control
3. Background Revalidation
4. Debugging and Monitoring

Quick Start Examples
====================

Example 1: Using Mutation with Automatic Invalidation

  import { useMutationWithCache } from '../hooks/useMutationWithCache';
  import { callVote } from '../lib/stacks';

  export function VoteButtons({ proposalId }) {
    const { vote, isLoading, error } = useMutationWithCache();

    const handleVoteFor = async () => {
      try {
        const txId = await vote(proposalId, (cb) =>
          callVote(proposalId, true, weight, cb)
        );
        console.log('Voted:', txId);
      } catch (err) {
        console.error('Vote failed:', err);
      }
    };

    return (
      <button onClick={handleVoteFor} disabled={isLoading}>
        Vote For
      </button>
    );
  }

Example 2: Using SWR Pattern for Better UX

  import { useStaleWhileRevalidate } from '../hooks/useStaleWhileRevalidate';
  import { getProposalsPage } from '../lib/stacks';

  export function ProposalList() {
    const { data, isStale, error } = useStaleWhileRevalidate(
      () => getProposalsPage({ page: 1, pageSize: 10 })
    );

    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>Loading...</p>;

    return (
      <div>
        {isStale && <p>Updating...</p>}
        {data.proposals.map(p => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
      </div>
    );
  }

Example 3: Manual Cache Invalidation on Window Focus

  import { useBlockchainCacheInvalidation } from '../hooks/useCacheInvalidation';

  export function Dashboard() {
    const cache = useBlockchainCacheInvalidation();

    // Cache is auto-invalidated on window focus
    // Returns immediately on init

    return <div>{/* Content */}</div>;
  }

Example 4: Manual Invalidation When Needed

  import { useBlockchainCacheInvalidation } from '../hooks/useCacheInvalidation';

  export function AdminPanel() {
    const { invalidateAll } = useBlockchainCacheInvalidation();

    const handleDataRefresh = () => {
      invalidateAll();
      // Refetch data on next component update
    };

    return <button onClick={handleDataRefresh}>Refresh All</button>;
  }

Component Integration Patterns
==============================

Pattern 1: List View with Automatic Refresh

  export function ProposalListPage() {
    const [page, setPage] = useState(1);

    const { data: pageData } = useStaleWhileRevalidate(
      () => getProposalsPage({ page, pageSize: 10 }),
      { staleTime: 10 * 60 * 1000 }
    );

    return (
      <div>
        {pageData?.proposals.map(p => (
          <ProposalCard key={p.id} proposal={p} />
        ))}
        <Pagination page={page} onPageChange={setPage} />
      </div>
    );
  }

Pattern 2: Detail View with Voting

  export function ProposalDetail({ proposalId }) {
    const [proposal, setProposal] = useState(null);
    const { vote, isLoading } = useMutationWithCache();

    useEffect(() => {
      getProposal(proposalId).then(setProposal);
    }, [proposalId]);

    const handleVote = (support) => {
      vote(proposalId, (cb) =>
        callVote(proposalId, support, weight, cb)
      );
    };

    return (
      <div>
        <h1>{proposal?.title}</h1>
        <button onClick={() => handleVote(true)}>Vote For</button>
        <button onClick={() => handleVote(false)}>Vote Against</button>
      </div>
    );
  }

Pattern 3: Create Form with Invalidation

  export function CreateProposalForm() {
    const { createProposal, isLoading } = useMutationWithCache();

    const handleSubmit = async (formData) => {
      try {
        const txId = await createProposal(
          (cb) => callCreateProposal(
            formData.amount,
            formData.title,
            formData.description,
            cb
          ),
          {
            onSuccess: () => {
              toast.success('Proposal created!');
              navigate('/proposals');
            }
          }
        );
      } catch (err) {
        toast.error(`Failed: ${err.message}`);
      }
    };

    return (
      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit(new FormData(e.target));
      }}>
        {/* Form fields */}
        <button disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>
    );
  }

When to Use Each Pattern
=========================

Use SWR (useStaleWhileRevalidate) When:
  ✓ You want instant UI updates with background refresh
  ✓ User is on slow network (more noticeable improvement)
  ✓ Data is cached but might be stale
  ✓ Can show "Updating..." indicator

Use Manual Invalidation When:
  ✓ You know exactly what changed
  ✓ Smart cache invalidation is needed
  ✓ Multiple related caches need clearing
  ✓ Want precise control

Use Mutation Cache When:
  ✓ Making write operations (create, vote, execute)
  ✓ Must invalidate cache on success
  ✓ Don't want to manually manage cache
  ✓ Standard transaction flow

Use Focus Revalidation When:
  ✓ User might switch tabs (multi-window work)
  ✓ Want always-fresh data on return
  ✓ Data changes are pushed or external
  ✓ Default behavior is desired

Cache Invalidation in Different Scenarios
==========================================

Scenario: User votes on proposal

  Old way:
    ✗ Vote succeeds
    ✗ But old vote count still displayed
    ✗ User confused

  New way with cache invalidation:
    ✓ Vote succeeds
    ✓ Proposal cache cleared
    ✓ Next access fetches fresh data
    ✓ Vote count shows immediately

Scenario: User creates proposal

  Old way:
    ✗ Proposal created
    ✗ User navigates to list
    ✗ New proposal not in list (waiting for cache expiration)

  New way:
    ✓ Proposal created
    ✓ Proposal pages + count caches cleared
    ✓ Next access fetches fresh list
    ✓ New proposal immediately visible

Scenario: Data requires immediate freshness

  Old way:
    ✗ Forced to disable caching entirely
    ✗ Every click hits API
    ✗ Slow performance

  New way:
    ✓ Use short TTL (e.g., 30 seconds)
    ✓ Or manual invalidation on specific events
    ✓ Balance between performance and freshness

Performance Monitoring
======================

Check cache effectiveness in development:

  // In browser console
  blockchainCache.getStats()
  // Output: { hits: 47, misses: 12, hitRate: 79.66 }

Good cache hit rate indicators:
  - First load: 0%
  - Navigation within 10 min: 70%+
  - After voting: 60%+ (some items invalidated)
  - Normal browsing: 70-85%

Identify slow components:

  // In component
  useEffect(() => {
    const start = performance.now();
    getProposal(id).then(() => {
      const time = performance.now() - start;
      console.log(`Proposal fetch took ${time}ms`);
    });
  }, [id]);

  // Cache hit: ~5ms
  // Cache miss: ~500ms
  // Ratio indicates cache effectiveness

Optimization Tips
=================

Tip 1: Group Related Invalidations

  Before (multiple calls):
    invalidateProposal(1);
    invalidateProposal(2);
    invalidateProposalPages();
    invalidateProposalCount();

  After (single call):
    invalidateAll();

Tip 2: Use Specific Invalidation

  Before:
    invalidateAll();  // Clears everything

  After:
    invalidateProposal(proposalId);  // Only what changed
    // Preserves other cached data

Tip 3: Leverage TTL Defaults

  Don't override TTL unless necessary:
    // Good: Uses default 10 min
    blockchainCache.setProposal(id, proposal);

    // Only when needed:
    blockchainCache.setProposal(id, proposal, 30 * 1000);

Tip 4: Batch Updates

  Before:
    vote(id1, cb1).then(() => vote(id2, cb2));  // Sequential

  After:
    Promise.all([
      vote(id1, cb1),
      vote(id2, cb2)   // Parallel
    ]);

Testing with Caching
====================

Unit Test with Cache Mocking:

  import { blockchainCache } from '../lib/blockchain-cache';

  describe('VoteButton', () => {
    beforeEach(() => {
      blockchainCache.clear();
    });

    it('should invalidate cache after voting', () => {
      const proposal = mockProposal();
      blockchainCache.setProposal(1, proposal);

      renderHook(() => {
        const { vote } = useMutationWithCache();
        vote(1, mockCallVote);
      });

      expect(blockchainCache.getProposal(1)).toBeNull();
    });
  });

Integration Test:

  it('should show updated vote count after voting', async () => {
    // Setup initial state with cache
    blockchainCache.setProposal(1, {
      ...mockProposal,
      votesFor: 10
    });

    render(<ProposalDetail proposalId={1} />);
    expect(screen.getByText('Votes For: 10')).toBeInTheDocument();

    // User votes (triggers invalidation)
    fireEvent.click(screen.getByText('Vote For'));
    await waitFor(() => {
      expect(screen.getByText('Votes For: 11')).toBeInTheDocument();
    });
  });

Performance Test:

  it('should serve cached data instantly', async () => {
    const proposal = mockProposal();
    blockchainCache.setProposal(1, proposal);

    const start = performance.now();
    const result = blockchainCache.getProposal(1);
    const time = performance.now() - start;

    expect(result).toEqual(proposal);
    expect(time).toBeLessThan(5);  // Should be < 5ms
  });

Debugging Caching Issues
=========================

Issue: Data not updating after mutation

  Debug steps:
    1. Check if invalidation was called
    2. Verify cache key format matches
    3. Check if TTL was modified
    4. Look for console errors

  Solution:
    blockchainCache.invalidateProposal(proposalId);
    // Force reload
    setProposal(await getProposal(proposalId));

Issue: Cache not persisting across tabs

  Note:
    In-memory cache doesn't persist across tabs
    Use localStorage via localStorageCache for persistence

  Solution:
    localStorageCache.set('proposal:1', proposal, 10 * 60 * 1000);

Issue: High miss rate

  Debug:
    const stats = blockchainCache.getStats();
    if (stats.hitRate < 50) {
      // Issue: not hitting cache enough
      console.log(stats.misses, 'cache misses');
    }

  Solutions:
    - Increase TTL if data is stable
    - Check if forceRefresh is set unnecessarily
    - Verify cache keys match exactly

Advanced Usage
==============

Custom TTL for Volatile Data:

  // Proposals voting active every minute
  blockchainCache.setProposal(
    proposalId,
    proposal,
    60 * 1000  // 1 minute instead of 10
  );

Hybrid Caching Strategy:

  // Memory cache for speed
  let proposal = blockchainCache.getProposal(id);

  // If not found, try localStorage
  if (!proposal) {
    proposal = localStorageCache.get(`proposal:${id}`);
  }

  // If still not found, fetch from blockchain
  if (!proposal) {
    proposal = await getProposal(id);
    blockchainCache.setProposal(id, proposal);
    localStorageCache.set(`proposal:${id}`, proposal, 60 * 60 * 1000);
  }

Cache Warming on App Start:

  // Preload common data
  useEffect(() => {
    const warmCache = async () => {
      const count = await getProposalCount();
      const page1 = await getProposalsPage({ page: 1, pageSize: 10 });
      // Data now cached for instant access
    };
    warmCache();
  }, []);

Migration from Old to New Caching
=================================

Old Code (without new caching):
  export function ProposalList() {
    const [proposals, setProposals] = useState([]);
    useEffect(() => {
      getProposalsPage().then(setProposals);
    }, []);
    return <ul>{proposals}</ul>;
  }

New Code (with SWR):
  export function ProposalList() {
    const { data: { proposals } } = useStaleWhileRevalidate(
      () => getProposalsPage()
    );
    return <ul>{proposals}</ul>;
  }

Old Code (mutation without cache awareness):
  async function vote() {
    await callVote(...);
    // Manual refetch
    const updated = await getProposal(proposalId);
    setProposal(updated);
  }

New Code (automatic cache management):
  function vote() {
    const { vote } = useMutationWithCache();
    return vote(proposalId, callVote);
    // Cache auto-invalidated
  }

Best Practices Summary
======================

DO:
  ✓ Use SWR pattern for lists
  ✓ Invalidate on mutations
  ✓ Monitor cache hit rate
  ✓ Test with cache
  ✓ Use appropriate TTLs
  ✓ Leverage automatic caching

DON'T:
  ✗ Override TTL unnecessarily
  ✗ Force refresh for no reason
  ✗ Ignore cache invalidation after mutations
  ✗ Mix multiple caching strategies inconsistently
  ✗ Disable caching for performance problems
  ✗ Store sensitive data in localStorage
