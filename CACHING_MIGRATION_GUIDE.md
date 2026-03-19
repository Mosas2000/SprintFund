Cache Migration Guide

Moving from Manual Caching to New System
========================================

Overview
  Old Code:
    - Manual cache management in components
    - Re-fetches on every component mount
    - No cache invalidation strategy
    - Performance issues on navigation

  New Code:
    - Automatic caching in API layer
    - Transparent to most components
    - Smart invalidation on mutations
    - Significant performance improvement

Step 1: Update Components Using getProposal()
==============================================

BEFORE (old, no caching):
  useEffect(() => {
    getProposal(id).then(setProposal);
  }, [id]);

AFTER (automatic cache):
  useEffect(() => {
    getProposal(id).then(setProposal);
  }, [id]);
  // Cache automatic, no code change needed!

BETTER (SWR pattern):
  const { data: proposal } = useStaleWhileRevalidate(
    () => getProposal(id)
  );

Step 2: Update Components Using getProposalsPage()
===================================================

BEFORE:
  const [proposals, setProposals] = useState([]);
  useEffect(() => {
    getProposalsPage({ page }).then(p => setProposals(p.proposals));
  }, [page]);

AFTER (with SWR):
  const { data } = useStaleWhileRevalidate(
    () => getProposalsPage({ page })
  );
  const proposals = data?.proposals || [];

Step 3: Update Mutation Components
===================================

BEFORE (manual re-fetch):
  const handleVote = async () => {
    await callVote(proposalId, support, weight, {
      onFinish: () => {
        setProposal(await getProposal(proposalId));
      }
    });
  };

AFTER (automatic cache invalidation):
  const { vote } = useMutationWithCache();
  const handleVote = async () => {
    await vote(proposalId, (cb) =>
      callVote(proposalId, support, weight, cb)
    );
    // Cache auto-invalidated!
    setProposal(await getProposal(proposalId));
    // Now serves fresh data
  };

Step 4: Enable Window Focus Revalidation
========================================

Add to App.tsx root component:

  import { useBlockchainCacheInvalidation } from './hooks/useCacheInvalidation';

  function App() {
    // This will auto-invalidate cache on window focus
    useBlockchainCacheInvalidation();

    return (
      // Your app...
    );
  }

Step 5: Add Cache Preloading (Optional)
======================================

In App.tsx useEffect:

  import { initializeCacheOnAppStart } from './lib/cache-preloader';

  useEffect(() => {
    initializeCacheOnAppStart();
  }, []);

Step 6: Enable Debugging (Development Only)
==========================================

In development, enable cache debugging:

  if (process.env.NODE_ENV === 'development') {
    import('./lib/cache-debugger').then(m => {
      m.enableCacheDebugMode();
    });
  }

  Then in browser console:
    window.__CACHE_DEBUG__.status()
    window.__CACHE_DEBUG__.info()
    window.__CACHE_DEBUG__.metrics()

Checklist for Migration
======================

Component Updates:
  [ ] Replace manual cache with useStaleWhileRevalidate
  [ ] Update mutation components to use useMutationWithCache
  [ ] Remove manual re-fetch logic after mutations
  [ ] Test cache invalidation works

App-Level Setup:
  [ ] Add useBlockchainCacheInvalidation to App root
  [ ] Add cache preloading on startup
  [ ] Enable debug mode in development
  [ ] Test window focus revalidation

Testing:
  [ ] Verify cache hit rate with browser tools
  [ ] Test tab switching triggers refresh
  [ ] Test mutations invalidate correct caches
  [ ] Benchmark performance improvement

Deployme nt:
  [ ] All components migrated
  [ ] Tests passing
  [ ] Performance verified
  [ ] Rolling out to production

Common Migration Patterns
========================

Pattern 1: List Component Migration

OLD:
  function ProposalList() {
    const [data, setData] = useState(null);
    useEffect(() => {
      getProposalsPage({ page: 1 }).then(setData);
    }, []);
    return <div>{data?.proposals}</div>;
  }

NEW:
  function ProposalList() {
    const { data } = useStaleWhileRevalidate(
      () => getProposalsPage({ page: 1 })
    );
    return <div>{data?.proposals}</div>;
  }

Pattern 2: Detail Component with Voting

OLD:
  function ProposalDetail({ id }) {
    const [proposal, setProposal] = useState(null);

    useEffect(() => {
      getProposal(id).then(setProposal);
    }, [id]);

    const handleVote = async () => {
      await callVote(id, true, weight, {
        onFinish: async () => {
          const updated = await getProposal(id);
          setProposal(updated);
        }
      });
    };

    return <div onClick={handleVote}>{proposal?.title}</div>;
  }

NEW:
  function ProposalDetail({ id }) {
    const [proposal, setProposal] = useState(null);
    const { vote } = useMutationWithCache();

    useEffect(() => {
      getProposal(id).then(setProposal);
    }, [id]);

    const handleVote = async () => {
      await vote(id, (cb) => callVote(id, true, weight, cb));
      const updated = await getProposal(id);
      setProposal(updated);
    };

    return <div onClick={handleVote}>{proposal?.title}</div>;
  }

Pattern 3: Conditional Re-fetching

OLD:
  function Dashboard() {
    const [data, setData] = useState(null);

    const refresh = async () => {
      const fresh = await getProposalCount();
      setData(fresh);
    };

    return <button onClick={refresh}>Refresh</button>;
  }

NEW:
  function Dashboard() {
    const { invalidateProposals } = useBlockchainCacheInvalidation();

    const refresh = () => {
      invalidateProposals();
      // Next getProposalsPage() will fetch fresh
    };

    return <button onClick={refresh}>Refresh</button>;
  }

Performance Migration Metrics
============================

Track these metrics before and after:

Before Migration:
  - Time to load proposal list: ~500ms
  - Time to load proposal detail: ~500ms
  - Total page navigation time: ~2000ms

After Migration:
  - Time to load proposal list: ~50ms (cached)
  - Time to load proposal detail: ~50ms (cached)
  - Total page navigation time: ~50ms (from cache)

Expected Results:
  - 90% faster second visits
  - 99% faster tab switching
  - Reduced API load
  - Better user experience

Breaking Changes: NONE
=====================

The new caching system is:
  ✓ Fully backward compatible
  ✓ No API changes to stacks.ts
  ✓ Optional hook usage
  ✓ Transparent to existing code

Rollback Plan
=============

If issues found, rollback is simple:

  1. Revert cache integration in stacks.ts
  2. Remove cache invalidation on mutations
  3. Remove useBlockchainCacheInvalidation from App
  4. Keep other utilities for later use

This can be done with a single revert commit.

Support and Questions
====================

For questions about migration:
  1. Check CACHING_INTEGRATION_GUIDE.md
  2. Review CACHING_API_REFERENCE.md
  3. See examples in component patterns
  4. Enable debug mode: window.__CACHE_DEBUG__

Phase Rollout Recommendation
===========================

Phase 1 (Week 1):
  - Enable caching in API layer
  - Deploy with optional hooks
  - Monitor cache hit rate
  - No required component changes

Phase 2 (Week 2):
  - Update mutation components
  - Add useMutationWithCache
  - Test cache invalidation

Phase 3 (Week 3):
  - Update list/detail views
  - Implement SWR pattern
  - Measure performance gains

Phase 4 (Week 4):
  - App-level optimizations
  - Tune TTLs based on metrics
  - Full production deployment
