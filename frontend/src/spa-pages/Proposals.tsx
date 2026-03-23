import { useEffect, useState, useCallback, useMemo, RefObject } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProposalsPage } from '../lib/stacks';
import { ProposalCard } from '../components/ProposalCard';
import { ErrorState } from '../components/ErrorState';
import { toErrorMessage } from '../lib/errors';
import { useToast } from '../hooks/useToast';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useFocusOnMount } from '../hooks/useFocusOnMount';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useOnboardingAutoComplete } from '../hooks/useOnboardingAutoComplete';
import { useLoadComments } from '../store/comment-selectors';
import { ProposalListSkeleton } from '../components/ProposalListSkeleton';
import { useProposalUrlFilters } from '../hooks/useProposalUrlFilters';
import { useArrowKeys } from '../hooks/useArrowKeys';
import { useEnterKey } from '../hooks/useEnterKey';
import type { Proposal } from '../types';

/**
 * ProposalsPage displays all proposals with pagination and filters.
 * Users can browse, search, and vote on proposals.
 */
export function ProposalsPage(): JSX.Element {
  const PAGE_SIZE = 10;
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const toast = useToast();
  const online = useNetworkStatus();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const loadComments = useLoadComments();
  useDocumentTitle('Proposals');
  const { markProposalsPageViewed } = useOnboardingAutoComplete();

  useEffect(() => {
    markProposalsPageViewed();
  }, [markProposalsPageViewed]);

  const {
    params,
    setStatus,
    setPage,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useProposalUrlFilters();

  const filtered: Proposal[] = useMemo(() => proposals.filter((p) => {
    if (params.status === 'active') return !p.executed;
    if (params.status === 'executed') return p.executed;
    return true;
  }), [proposals, params.status]);

  const handleSelectUp = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null || prev === 0 ? filtered.length - 1 : prev - 1,
    );
  }, [filtered.length]);

  const handleSelectDown = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null || prev === filtered.length - 1 ? 0 : prev + 1,
    );
  }, [filtered.length]);

  const handleOpenSelected = useCallback(() => {
    if (selectedIndex !== null && filtered[selectedIndex]) {
      navigate(`/proposals/${filtered[selectedIndex].id}`);
    }
  }, [selectedIndex, filtered, navigate]);

  useArrowKeys(
    {
      onUp: handleSelectUp,
      onDown: handleSelectDown,
    },
    selectedIndex !== null,
  );

  useEnterKey(handleOpenSelected, selectedIndex !== null);

  const fetchProposals = useCallback((): void => {
    setError(null);
    setLoading(true);
    getProposalsPage({ page: params.page, pageSize: PAGE_SIZE })
      .then((result) => {
        setProposals(result.proposals);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
      })
      .catch((err: unknown) => {
        const msg = toErrorMessage(err);
        setError(msg);
        setRetryCount((c) => c + 1);
        toast.error('Failed to load proposals', msg);
      })
      .finally(() => setLoading(false));
  }, [params.page, toast]);

  useEffect(() => {
    const timeout = window.setTimeout(fetchProposals, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchProposals]);

  useEffect(() => {
    proposals.forEach((p) => loadComments(p.id));
  }, [proposals, loadComments]);

  useEffect(() => {
    if (online && error) {
      const timeout = window.setTimeout(fetchProposals, 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSelectedIndex(null);
  }, [params.status, params.page]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-text outline-none">Proposals</h1>
          <p className="text-sm text-muted">Browse and vote on community proposals</p>
        </div>
        <Link
          to="/proposals/create"
          className="w-full sm:w-auto rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95 text-center min-h-[44px] flex items-center justify-center"
        >
          + New Proposal
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter proposals">
        {(['all', 'active', 'executed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            aria-pressed={params.status === f}
            className={`rounded-md px-4 py-2 text-xs font-medium capitalize transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-dark ${
              params.status === f
                ? 'bg-green/10 text-green'
                : 'text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="rounded-md px-3 py-2 text-xs font-medium text-muted hover:text-text hover:bg-white/5 transition-colors min-h-[44px]"
            aria-label={`Clear ${activeFilterCount} active filter${activeFilterCount !== 1 ? 's' : ''}`}
          >
            Clear filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <ProposalListSkeleton />
      ) : error ? (
        <ErrorState
          title="Failed to load proposals"
          message={error}
          onRetry={fetchProposals}
          retryCount={retryCount}
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-lg text-muted">No proposals found</p>
          <p className="mt-1 text-sm text-muted">Be the first to create one!</p>
        </div>
      ) : (
        <>
          <div role="list" aria-label="Proposals" className="grid gap-4 sm:grid-cols-2">
            {filtered.map((p, idx) => (
              <div role="listitem" key={p.id}>
                <ProposalCard proposal={p} selected={selectedIndex === idx} />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted">
              Showing page {params.page} of {totalPages} ({totalCount} total proposals)
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, params.page - 1))}
                disabled={params.page <= 1}
                className="rounded-md border border-border px-3 py-2 text-xs font-medium text-text transition-colors hover:border-green/40 hover:text-green disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, params.page + 1))}
                disabled={params.page >= totalPages}
                className="rounded-md border border-border px-3 py-2 text-xs font-medium text-text transition-colors hover:border-green/40 hover:text-green disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
