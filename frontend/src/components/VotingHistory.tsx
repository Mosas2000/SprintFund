import { memo, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { VotingHistoryProps } from '../types/profile';
import type { VoteRecord } from '../types/profile';

type SortField = 'timestamp' | 'weight' | 'support';
type SortDir = 'asc' | 'desc';

/* ── Format date helper ───────────────────────── */

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ── Vote direction badge ─────────────────────── */

function VoteBadge({ support }: { support: boolean }) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
        support
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-red-500/20 text-red-400'
      }`}
    >
      {support ? 'For' : 'Against'}
    </span>
  );
}

/* ── Sort button ──────────────────────────────── */

function SortButton({
  field,
  label,
  activeField,
  direction,
  onSort,
}: {
  field: SortField;
  label: string;
  activeField: SortField;
  direction: SortDir;
  onSort: (field: SortField) => void;
}) {
  const isActive = activeField === field;
  const arrow = isActive ? (direction === 'asc' ? ' ^' : ' v') : '';

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`text-xs uppercase tracking-wider transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1 ${
        isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-300'
      }`}
      aria-label={`Sort by ${label}${isActive ? `, currently ${direction}ending` : ''}`}
    >
      {label}{arrow}
    </button>
  );
}

/* ── Empty state ──────────────────────────────── */

function EmptyVotes() {
  return (
    <div className="text-center py-10">
      <p className="text-zinc-400 text-sm">
        No votes recorded yet.
      </p>
      <p className="text-zinc-500 text-xs mt-2">
        Vote on proposals to see your history here.
      </p>
    </div>
  );
}

/* ── Sort logic ───────────────────────────────── */

function sortVotes(votes: VoteRecord[], field: SortField, dir: SortDir): VoteRecord[] {
  const sorted = [...votes];
  sorted.sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'timestamp':
        cmp = a.timestamp - b.timestamp;
        break;
      case 'weight':
        cmp = a.weight - b.weight;
        break;
      case 'support':
        cmp = (a.support ? 1 : 0) - (b.support ? 1 : 0);
        break;
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

/* ── Main component ───────────────────────────── */

function VotingHistoryBase({ votes }: VotingHistoryProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filter, setFilter] = useState<'all' | 'for' | 'against'>('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...votes];
    if (filter === 'for') {
      result = result.filter((v) => v.support);
    } else if (filter === 'against') {
      result = result.filter((v) => !v.support);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q));
    }
    return sortVotes(result, sortField, sortDir);
  }, [votes, sortField, sortDir, filter, search]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleShowMore = () => {
    setVisibleCount((c) => c + 10);
  };

  // Reset pagination on filter or search change
  useEffect(() => {
    setVisibleCount(10);
  }, [filter, search]);

  if (votes.length === 0) {
    return (
      <section aria-labelledby="voting-history-heading">
        <h2 id="voting-history-heading" className="text-lg font-semibold text-white mb-4">
          Voting History
        </h2>
        <EmptyVotes />
      </section>
    );
  }

  return (
    <section aria-labelledby="voting-history-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 id="voting-history-heading" className="text-lg font-black uppercase tracking-tight text-white">
            Governance Activity
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
            {filtered.length} total votes recorded
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/5 p-1 rounded-xl w-full sm:w-auto relative">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search proposals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-xs px-3 py-1.5 text-white placeholder-zinc-500 w-full sm:w-40 pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1">
            <select
              value={`${sortField}-${sortDir}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('-') as [SortField, SortDir];
                setSortField(field);
                setSortDir(dir);
              }}
              className="bg-transparent border-none focus:ring-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors"
            >
              <option value="timestamp-desc" className="bg-zinc-900 text-white">Latest</option>
              <option value="timestamp-asc" className="bg-zinc-900 text-white">Oldest</option>
              <option value="weight-desc" className="bg-zinc-900 text-white">Highest Weight</option>
              <option value="weight-asc" className="bg-zinc-900 text-white">Lowest Weight</option>
            </select>
            <div className="w-px h-4 bg-white/10 mx-1" />
            {(['all', 'for', 'against'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === f
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rows */}
      <ul className="space-y-2" role="list">
        {visible.map((vote) => (
          <li
            key={`vote-${vote.proposalId}-${vote.timestamp}`}
            className="group rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 hover:scale-[1.01] hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/proposals/${vote.proposalId}`}
                  className="text-sm font-black uppercase tracking-tight text-white hover:text-orange-400 transition-colors truncate block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                >
                  {vote.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {vote.executed && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Executed</span>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {formatDate(vote.timestamp)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-white/5 pt-3 sm:border-none sm:pt-0">
                <div className="flex flex-col items-start sm:items-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Direction</span>
                  <VoteBadge support={vote.support} />
                </div>
                <div className="flex flex-col items-start sm:items-center min-w-[60px]">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Weight</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-white">{vote.weight}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">({vote.weight ** 2} STX)</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={handleShowMore}
            className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-6 py-3 border border-indigo-500/20 bg-indigo-500/5"
          >
            Show more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}

const VotingHistory = memo(VotingHistoryBase);
VotingHistory.displayName = 'VotingHistory';
export default VotingHistory;
