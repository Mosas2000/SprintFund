'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Ban,
  CheckCircle2,
  ExternalLink,
  FileText,
  Filter,
  Landmark,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Vote,
} from 'lucide-react';
import type { ElementType } from 'react';
import { fetchContractEventStream, type ContractEventCategory, type ContractEventRecord } from '@/lib/contract-event-stream';
import { formatTimeAgo } from '@/lib/notification-time';
import { truncateAddress } from '@/lib/api';

type FilterValue = ContractEventCategory | 'all';

const FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'all', label: 'All events' },
  { value: 'stake', label: 'Stake' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'vote', label: 'Vote' },
  { value: 'cancel', label: 'Cancel' },
  { value: 'execute', label: 'Execute' },
  { value: 'treasury', label: 'Treasury' },
];

const EVENT_META: Record<ContractEventCategory, { label: string; icon: ElementType; tone: string }> = {
  stake: { label: 'Stake', icon: ShieldCheck, tone: 'text-emerald-300' },
  proposal: { label: 'Proposal', icon: FileText, tone: 'text-sky-300' },
  vote: { label: 'Vote', icon: Vote, tone: 'text-violet-300' },
  cancel: { label: 'Cancel', icon: Ban, tone: 'text-rose-300' },
  execute: { label: 'Execute', icon: CheckCircle2, tone: 'text-orange-300' },
  treasury: { label: 'Treasury', icon: Landmark, tone: 'text-amber-300' },
  other: { label: 'Other', icon: Activity, tone: 'text-slate-300' },
};

const INITIAL_LIMIT = 12;
const REFRESH_INTERVAL = 20_000;

export default function ContractEventStream() {
  const [events, setEvents] = useState<ContractEventRecord[]>([]);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const loadEvents = useCallback(async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const nextEvents = await fetchContractEventStream({ limit: INITIAL_LIMIT });
      setEvents(nextEvents);
      setError(null);
      setLastUpdated(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contract activity.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents(false);
    const interval = window.setInterval(() => {
      void loadEvents(true);
    }, REFRESH_INTERVAL);

    return () => window.clearInterval(interval);
  }, [loadEvents]);

  const filteredEvents = useMemo(
    () => (filter === 'all' ? events : events.filter((event) => event.category === filter)),
    [events, filter],
  );

  const eventCountLabel = `${events.length} event${events.length === 1 ? '' : 's'}`;
  const updatedLabel = lastUpdated ? formatTimeAgo(lastUpdated) : 'waiting for first sync';

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="flex flex-col gap-4 border-b border-white/10 p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live contract activity
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Contract event stream</h2>
            <p className="mt-1 max-w-2xl text-sm text-white/60">
              Recent stake, proposal, vote, cancellation, execution, and treasury transactions from the active SprintFund contract.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/60">
            <div className="font-medium text-white">{eventCountLabel}</div>
            <div className="mt-1">Updated {updatedLabel}</div>
          </div>
          <button
            type="button"
            onClick={() => void loadEvents(false)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
        <Filter className="h-4 w-4 text-white/50" />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === item.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-white/60">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading contract activity
          </div>
        ) : error && events.length === 0 ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
            <p className="font-medium text-white">Unable to load contract activity</p>
            <p className="mt-1 text-white/70">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black/20 p-8 text-center">
            <Activity className="mx-auto h-10 w-10 text-white/20" />
            <p className="mt-3 text-sm font-medium text-white">No matching events</p>
            <p className="mt-1 text-sm text-white/50">
              Try a different filter or wait for the next contract update.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const meta = EVENT_META[event.category];
              const Icon = meta.icon;
              const statusClasses =
                event.status === 'confirmed'
                  ? 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20'
                  : event.status === 'failed'
                    ? 'bg-rose-500/10 text-rose-200 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-200 border-amber-500/20';

              return (
                <article
                  key={event.id}
                  className="rounded-xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-white/20"
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 rounded-xl bg-white/5 p-3 ${meta.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] ${statusClasses}`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-white/70">{event.summary}</p>
                        </div>

                        <a
                          href={event.explorerUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-white/60 transition-colors hover:text-white"
                        >
                          View transaction
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/50">
                        <span className="font-mono">{truncateAddress(event.senderAddress)}</span>
                        <span>{formatTimeAgo(event.timestamp)}</span>
                        <span>{meta.label}</span>
                        {event.eventCount > 0 && <span>{event.eventCount} on-chain events</span>}
                        {event.errorMessage && event.status === 'failed' && (
                          <span className="text-rose-200">{event.errorMessage}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
