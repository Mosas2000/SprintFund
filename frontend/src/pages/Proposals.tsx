import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllProposals } from '../lib/stacks';
import { ProposalCard } from '../components/ProposalCard';
import { ErrorState } from '../components/ErrorState';
import { ERROR_MESSAGES, toErrorMessage } from '../lib/errors';
import { useToast } from '../hooks/useToast';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useFocusOnMount } from '../hooks/useFocusOnMount';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ProposalListSkeleton } from '../components/ProposalListSkeleton';
import type { Proposal } from '../types';

export function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'executed'>('all');
  const toast = useToast();
  const online = useNetworkStatus();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle('Proposals');

  const fetchProposals = useCallback(() => {
    setError(null);
    setLoading(true);
    getAllProposals()
      .then(setProposals)
      .catch((err) => {
        const msg = toErrorMessage(err);
        setError(msg);
        setRetryCount((c) => c + 1);
        toast.error('Failed to load proposals', msg);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  /* Auto-retry when coming back online after a failure */
  useEffect(() => {
    if (online && error) {
      fetchProposals();
    }
  }, [online]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = proposals.filter((p) => {
    if (filter === 'active') return !p.executed;
    if (filter === 'executed') return p.executed;
    return true;
  });

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
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter proposals">
        {(['all', 'active', 'executed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-md px-4 py-2 text-xs font-medium capitalize transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-dark ${
              filter === f
                ? 'bg-green/10 text-green'
                : 'text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            {f}
          </button>
        ))}
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
        <div role="list" aria-label="Proposals" className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <div role="listitem" key={p.id}>
              <ProposalCard proposal={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
