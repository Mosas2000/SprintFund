'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ContractEvent, EventFilter } from '../../src/types/contract-events';
import { fetchContractEventStream } from '../../src/lib/contract-events';
import { normalizeError } from '../../src/lib/error-normalizer';
import { Activity, AlertCircle, Check, X } from 'lucide-react';

interface ContractEventStreamProps {
  contractPrincipal: string;
  apiUrl?: string;
  pollInterval?: number;
}

const categoryIcons: Record<ContractEvent['category'], typeof Activity> = {
  stake: Activity,
  proposal: Activity,
  vote: Activity,
  cancel: AlertCircle,
  execute: Check,
  treasury: Activity,
};

const categoryColors: Record<ContractEvent['category'], string> = {
  stake: 'bg-blue-100 text-blue-800',
  proposal: 'bg-purple-100 text-purple-800',
  vote: 'bg-green-100 text-green-800',
  cancel: 'bg-red-100 text-red-800',
  execute: 'bg-emerald-100 text-emerald-800',
  treasury: 'bg-amber-100 text-amber-800',
};

export const ContractEventStream: React.FC<ContractEventStreamProps> = ({
  contractPrincipal,
  apiUrl = 'https://api.mainnet.hiro.so',
  pollInterval = 20000,
}) => {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [filter, setFilter] = useState<EventFilter>({
    categories: ['stake', 'proposal', 'vote', 'cancel', 'execute', 'treasury'],
    includeFailures: false,
  });

  const loadEvents = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      setError(null);

      try {
        const fetchedEvents = await fetchContractEventStream(contractPrincipal, apiUrl);
        setEvents(fetchedEvents);
        setLastUpdated(Date.now());
      } catch (err) {
        console.error('Error fetching contract events:', err);
        const normalized = normalizeError(err);
        setError(new Error(normalized.suggestion 
          ? `${normalized.message} Tip: ${normalized.suggestion}` 
          : normalized.message));
      } finally {
        setIsLoading(false);
      }
    },
    [contractPrincipal, apiUrl]
  );

  useEffect(() => {
    loadEvents();

    const interval = setInterval(() => {
      loadEvents(true);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [loadEvents, pollInterval]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const categoryMatch = filter.categories.includes(event.category);
      const statusMatch = filter.includeFailures || event.status === 'success';
      return categoryMatch && statusMatch;
    });
  }, [events, filter]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-4)}`;
  };

  const toggleCategory = (category: ContractEvent['category']) => {
    setFilter(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Contract Events</h2>
          <div className="text-sm text-gray-500">
            {lastUpdated && (
              <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['stake', 'proposal', 'vote', 'cancel', 'execute', 'treasury'] as const).map(
            category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors sm:py-1 ${
                  filter.categories.includes(category)
                    ? categoryColors[category]
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            )
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={filter.includeFailures}
              onChange={e =>
                setFilter(prev => ({
                  ...prev,
                  includeFailures: e.target.checked,
                }))
              }
              className="rounded"
            />
            Show failed transactions
          </label>
          <button
            onClick={() => loadEvents()}
            disabled={isLoading}
            className="w-full rounded bg-blue-500 px-4 py-3 text-sm text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300 sm:ml-auto sm:w-auto sm:py-2"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
        {error && (
          <div className="bg-red-50 p-4 text-sm text-red-700">
            {error.message}
          </div>
        )}

        {filteredEvents.length === 0 && !isLoading && (
          <div className="p-8 text-center text-gray-500">
            {events.length === 0 ? 'No events found' : 'No events match your filters'}
          </div>
        )}

        {filteredEvents.map(event => {
          const Icon = categoryIcons[event.category];
          return (
            <div key={event.id} className="p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${categoryColors[event.category]} flex-shrink-0`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{event.description}</span>
                    {event.status === 'failed' && (
                      <span className="flex items-center gap-1 text-red-600 text-xs">
                        <X size={14} />
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>From: {formatAddress(event.sender)}</div>
                    <div>{formatTime(event.timestamp)}</div>
                    {event.amount && <div>Amount: {event.amount}</div>}
                    {event.proposalId && <div>Proposal #{event.proposalId}</div>}
                  </div>
                  <a
                    href={`https://explorer.stacks.co/txid/${event.txId}?chain=mainnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                  >
                    View on Explorer →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContractEventStream;
