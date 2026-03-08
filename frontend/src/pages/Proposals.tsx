import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProposals } from '../lib/stacks';
import { ProposalCard } from '../components/ProposalCard';
import type { Proposal } from '../types';

type Filter = 'all' | 'active' | 'executed';

export function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllProposals();
        setProposals(data);
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
        setError('Failed to load proposals. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
          <p className="text-sm text-muted">
            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} on-chain
          </p>
        </div>
        <Link
          to="/proposals/create"
          className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark text-center transition-all hover:bg-green-dim active:scale-95"
        >
          + New Proposal
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'executed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-green/10 text-green border border-green/30'
                : 'border border-border text-muted hover:text-text hover:border-green/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green border-t-transparent" />
          <p className="text-xs text-muted">Loading proposals from chain…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red/20 bg-red/5 p-6 text-center">
          <p className="text-sm text-red">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="mb-2 text-sm text-muted">No proposals found.</p>
          <Link to="/proposals/create" className="text-sm text-green hover:underline">
            Create one &rarr;
          </Link>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      )}
    </div>
  );
}
