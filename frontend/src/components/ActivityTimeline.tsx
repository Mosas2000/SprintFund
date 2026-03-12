import { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ActivityTimelineProps } from '../types/profile';
import type { ActivityEvent, ActivityEventType } from '../types/profile';

/* ── Event icon / color map ───────────────────── */

const EVENT_META: Record<ActivityEventType, { icon: string; color: string }> = {
  proposal_created: { icon: 'P', color: 'bg-indigo-500' },
  vote_cast: { icon: 'V', color: 'bg-purple-500' },
  stake_deposited: { icon: 'S', color: 'bg-emerald-500' },
  stake_withdrawn: { icon: 'W', color: 'bg-amber-500' },
  proposal_executed: { icon: 'E', color: 'bg-teal-500' },
};

/* ── Format relative time ─────────────────────── */

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

/* ── Filter buttons ───────────────────────────── */

const FILTER_OPTIONS: { label: string; value: ActivityEventType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Proposals', value: 'proposal_created' },
  { label: 'Votes', value: 'vote_cast' },
  { label: 'Executed', value: 'proposal_executed' },
];

/* ── Items per page ───────────────────────────── */

const PAGE_SIZE = 10;

/* ── Empty state ──────────────────────────────── */

function EmptyActivity() {
  return (
    <div className="text-center py-10">
      <p className="text-zinc-400 text-sm">
        No activity recorded yet.
      </p>
      <p className="text-zinc-500 text-xs mt-2">
        Create proposals or vote to see your activity here.
      </p>
    </div>
  );
}

/* ── Event row ────────────────────────────────── */

function EventRow({ event }: { event: ActivityEvent }) {
  const meta = EVENT_META[event.type];

  return (
    <li className="flex gap-3">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full ${meta.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
          aria-hidden="true"
        >
          {meta.icon}
        </div>
        <div className="flex-1 w-px bg-white/10" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {event.proposalId !== undefined ? (
              <Link
                to={`/proposals/${event.proposalId}`}
                className="text-sm font-medium text-white hover:text-indigo-300 transition-colors truncate block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                {event.label}
              </Link>
            ) : (
              <p className="text-sm font-medium text-white truncate">
                {event.label}
              </p>
            )}
            {event.description && (
              <p className="text-xs text-zinc-400 mt-0.5">{event.description}</p>
            )}
          </div>
          <time
            className="text-xs text-zinc-500 shrink-0 mt-0.5"
            dateTime={new Date(event.timestamp).toISOString()}
          >
            {formatRelativeTime(event.timestamp)}
          </time>
        </div>
      </div>
    </li>
  );
}

/* ── Main component ───────────────────────────── */

function ActivityTimelineBase({ activity }: ActivityTimelineProps) {
  const [filter, setFilter] = useState<ActivityEventType | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (filter === 'all') return activity;
    return activity.filter((e) => e.type === filter);
  }, [activity, filter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleShowMore = () => {
    setVisibleCount((c) => c + PAGE_SIZE);
  };

  if (activity.length === 0) {
    return (
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-lg font-semibold text-white mb-4">
          Activity
        </h2>
        <EmptyActivity />
      </section>
    );
  }

  return (
    <section aria-labelledby="activity-heading">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 id="activity-heading" className="text-lg font-semibold text-white">
          Activity ({filtered.length})
        </h2>

        {/* Filter pills */}
        <div className="flex gap-2" role="group" aria-label="Filter activity">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setFilter(opt.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`text-xs px-3 py-1 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filter === opt.value
                  ? 'bg-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              aria-pressed={filter === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-400 text-sm text-center py-6">
          No {filter.replace('_', ' ')} events found.
        </p>
      ) : (
        <>
          <ul className="space-y-0" role="list">
            {visible.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </ul>

          {hasMore && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleShowMore}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-4 py-2"
              >
                Show more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

const ActivityTimeline = memo(ActivityTimelineBase);
ActivityTimeline.displayName = 'ActivityTimeline';
export default ActivityTimeline;
