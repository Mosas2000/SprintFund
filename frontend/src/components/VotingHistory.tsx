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
      <div className="flex items-center justify-between mb-4">
        <h2 id="voting-history-heading" className="text-lg font-semibold text-white">
          Voting History ({votes.length})
        </h2>
      </div>

      {/* Sortable table header */}
      <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-zinc-400 border-b border-white/10 mb-2">
        <div className="flex-1">Proposal</div>
        <div className="w-20 text-center">
          <SortButton
            field="support"
            label="Vote"
            activeField={sortField}
            direction={sortDir}
            onSort={handleSort}
          />
        </div>
        <div className="w-20 text-center">
          <SortButton
            field="weight"
            label="Weight"
            activeField={sortField}
            direction={sortDir}
            onSort={handleSort}
          />
        </div>
        <div className="w-28 text-right">
          <SortButton
            field="timestamp"
            label="Date"
            activeField={sortField}
            direction={sortDir}
            onSort={handleSort}
          />
        </div>
      </div>

      {/* Rows */}
      <ul className="space-y-2" role="list">
        {sorted.map((vote) => (
          <li
            key={`vote-${vote.proposalId}-${vote.timestamp}`}
            className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/proposals/${vote.proposalId}`}
                  className="text-sm font-medium text-white hover:text-indigo-300 transition-colors truncate block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  {vote.title}
                </Link>
                {vote.executed && (
                  <span className="text-[10px] text-zinc-500">Executed</span>
                )}
              </div>
              <div className="flex items-center gap-4 sm:gap-0">
                <div className="sm:w-20 sm:text-center">
                  <VoteBadge support={vote.support} />
                </div>
                <div className="sm:w-20 text-center">
                  <span className="text-sm text-zinc-300">{vote.weight}</span>
                  <span className="text-[10px] text-zinc-500 ml-1 sm:hidden">weight</span>
                </div>
                <div className="sm:w-28 sm:text-right">
                  <span className="text-xs text-zinc-400">
                    {formatDate(vote.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

const VotingHistory = memo(VotingHistoryBase);
VotingHistory.displayName = 'VotingHistory';
export default VotingHistory;
