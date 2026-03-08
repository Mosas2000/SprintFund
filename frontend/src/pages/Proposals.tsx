import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProposals } from '../lib/stacks';
import { ProposalCard } from '../components/ProposalCard';
import { useToast } from '../hooks/useToast';
import type { Proposal } from '../types';

export function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'executed'>('all');
  const toast = useToast();

  useEffect(() => {
    getAllProposals()
      .then(setProposals)
      .catch((err) => {
        setError(err.message);
        toast.error('Failed to load proposals', err.message);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <h1 className="text-2xl font-bold text-text">Proposals</h1>
          <p className="text-sm text-muted">Browse and vote on community proposals</p>
        </div>
        <Link
          to="/proposals/create"
          className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95 text-center"
        >
          + New Proposal
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'executed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
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
        <div className="py-20 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-green border-t-transparent" />
          <p className="mt-3 text-sm text-muted">Loading proposals from chain…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red/20 bg-red/5 p-6 text-center">
          <p className="text-sm text-red">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-lg text-muted">No proposals found</p>
          <p className="mt-1 text-sm text-muted">Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      )}
    </div>
  );
}
