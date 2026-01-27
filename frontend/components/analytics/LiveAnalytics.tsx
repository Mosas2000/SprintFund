'use client';

import { useState, useEffect, useRef } from 'react';
import { ProposalMetrics } from '../../utils/analytics/dataCollector';
import { formatMetric } from '../../utils/analytics/helpers';
import { Pause, Play, Activity, TrendingUp, Users, DollarSign } from 'lucide-react';

interface LiveAnalyticsProps {
  proposals: ProposalMetrics[];
  onRefresh?: () => void;
}

interface VoteActivity {
  id: string;
  address: string;
  proposalId: number;
  proposalTitle: string;
  support: boolean;
  weight: number;
  timestamp: number;
}

export default function LiveAnalytics({ proposals, onRefresh }: LiveAnalyticsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [updateFrequency, setUpdateFrequency] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [voteFeed, setVoteFeed] = useState<VoteActivity[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeProposals = proposals.filter(p => {
    const now = Date.now();
    const deadline = p.deadline * 10 * 60 * 1000;
    return !p.executed && deadline > now;
  });

  const votesLastHour = 127;
  const activeVoters = 43;
  const mostActiveProposal = activeProposals.length > 0 
    ? activeProposals.reduce((max, p) => p.voteVelocity > max.voteVelocity ? p : max)
    : null;
  
  const totalStxBeingVoted = activeProposals.reduce((sum, p) => sum + p.amount, 0);

  const last24HoursActivity = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    votes: Math.floor(Math.random() * 50) + 10
  }));

  const last7DaysProposals = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    count: Math.floor(Math.random() * 10) + 2
  }));

  const last30DaysFunding = Array.from({ length: 30 }, (_, i) => ({
    day: i,
    amount: Math.floor(Math.random() * 100000) + 50000
  }));

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setLastUpdate(Date.now());
        
        const newVote: VoteActivity = {
          id: Math.random().toString(36).substring(7),
          address: `SP${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          proposalId: Math.floor(Math.random() * 100),
          proposalTitle: 'Sample Proposal',
          support: Math.random() > 0.3,
          weight: Math.floor(Math.random() * 5) + 1,
          timestamp: Date.now()
        };

        setVoteFeed(prev => [newVote, ...prev].slice(0, 10));

        if (onRefresh) {
          onRefresh();
        }
      }, updateFrequency * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, updateFrequency, onRefresh]);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const timeSinceUpdate = Math.floor((Date.now() - lastUpdate) / 1000);

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
        >
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="font-medium">Live Analytics</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{votesLastHour}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Live Analytics</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${networkStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-gray-600 dark:text-gray-400">
              {networkStatus === 'online' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Updated {timeSinceUpdate}s ago
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-medium">Active Proposals</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeProposals.length}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Votes (1h)</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {votesLastHour}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Active Voters</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeVoters}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">STX Voting</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatMetric(totalStxBeingVoted, 'currency')}
            </div>
          </div>
        </div>

        {mostActiveProposal && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Most Active Proposal
            </div>
            <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
              #{mostActiveProposal.proposalId}: {mostActiveProposal.title}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Velocity: {mostActiveProposal.voteVelocity.toFixed(1)} votes/hour
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Live Vote Feed</h4>
            <span className="text-xs text-gray-500">{voteFeed.length} recent</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {voteFeed.map((vote) => (
              <div
                key={vote.id}
                className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs animate-fadeIn"
              >
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                  vote.support ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-gray-600 dark:text-gray-400">
                    {vote.address.slice(0, 8)}...
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {' '}voted{' '}
                  </span>
                  <span className={vote.support ? 'text-green-600' : 'text-red-600'}>
                    {vote.support ? 'YES' : 'NO'}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {' '}on #{vote.proposalId}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {' '}(weight {vote.weight})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">24h Votes</div>
            <div className="h-8 flex items-end gap-0.5">
              {last24HoursActivity.slice(-12).map((d, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${(d.votes / 60) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">7d Proposals</div>
            <div className="h-8 flex items-end gap-0.5">
              {last7DaysProposals.map((d, i) => (
                <div
                  key={i}
                  className="flex-1 bg-green-500 rounded-t"
                  style={{ height: `${(d.count / 12) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">30d Funding</div>
            <div className="h-8 flex items-end gap-0.5">
              {last30DaysFunding.slice(-12).map((d, i) => (
                <div
                  key={i}
                  className="flex-1 bg-purple-500 rounded-t"
                  style={{ height: `${(d.amount / 150000) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
            Update Frequency: {updateFrequency}s
          </label>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={updateFrequency}
            onChange={(e) => setUpdateFrequency(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
