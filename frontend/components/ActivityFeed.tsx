'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: 'proposal' | 'vote' | 'comment' | 'execution' | 'collaboration' | 'achievement';
  title: string;
  description: string;
  timestamp: number;
  metadata?: {
    proposalId?: number;
    amount?: number;
    voteType?: 'yes' | 'no';
    achievementIcon?: string;
  };
}

interface ActivityFeedProps {
  userAddress: string;
}

export default function ActivityFeed({ userAddress }: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [userAddress, filter]);

  const loadActivities = () => {
    // Simulate activity data
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'proposal',
        title: 'Created New Proposal',
        description: 'DeFi Lending Protocol Development',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        metadata: { proposalId: 42, amount: 50000 }
      },
      {
        id: '2',
        type: 'vote',
        title: 'Voted on Proposal',
        description: 'NFT Marketplace Infrastructure (#38)',
        timestamp: Date.now() - 5 * 60 * 60 * 1000,
        metadata: { proposalId: 38, voteType: 'yes' }
      },
      {
        id: '3',
        type: 'comment',
        title: 'Commented on Proposal',
        description: 'Added feedback to Community Event Planning (#35)',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        metadata: { proposalId: 35 }
      },
      {
        id: '4',
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: 'Earned "Active Voter" badge',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        metadata: { achievementIcon: '⭐' }
      },
      {
        id: '5',
        type: 'execution',
        title: 'Proposal Executed',
        description: 'Your proposal "Smart Contract Upgrade" was successfully executed',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        metadata: { proposalId: 28, amount: 75000 }
      },
      {
        id: '6',
        type: 'collaboration',
        title: 'Collaboration Invite',
        description: 'Added as co-author to "DAO Treasury Diversification"',
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
        metadata: { proposalId: 40 }
      },
      {
        id: '7',
        type: 'vote',
        title: 'Voted on Proposal',
        description: 'Marketing Campaign Q1 2026 (#36)',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        metadata: { proposalId: 36, voteType: 'no' }
      },
      {
        id: '8',
        type: 'comment',
        title: 'Commented on Proposal',
        description: 'Shared thoughts on Developer Tools Enhancement (#33)',
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
        metadata: { proposalId: 33 }
      }
    ];

    const filtered = filter === 'all' 
      ? mockActivities 
      : mockActivities.filter(a => a.type === filter);

    setActivities(filtered);
    setHasMore(filtered.length >= 8);
  };

  const loadMore = () => {
    setPage(page + 1);
    // Would load more activities in real implementation
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal': return '📝';
      case 'vote': return '🗳️';
      case 'comment': return '💬';
      case 'execution': return '✅';
      case 'collaboration': return '🤝';
      case 'achievement': return '🏆';
      default: return '📌';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'proposal': return 'blue';
      case 'vote': return 'green';
      case 'comment': return 'purple';
      case 'execution': return 'emerald';
      case 'collaboration': return 'orange';
      case 'achievement': return 'yellow';
      default: return 'gray';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const exportActivities = () => {
    const csv = [
      ['Type', 'Title', 'Description', 'Date'].join(','),
      ...activities.map(a => [
        a.type,
        `"${a.title}"`,
        `"${a.description}"`,
        new Date(a.timestamp).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-log-${Date.now()}.csv`;
    a.click();
  };

  const shareHighlights = () => {
    const highlights = activities.slice(0, 5);
    const text = `My recent DAO activity:\n${highlights.map(h => `• ${h.title}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Activity highlights copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📊 Activity Feed</h2>
        <div className="flex gap-2">
          <button
            onClick={shareHighlights}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            📤 Share
          </button>
          <button
            onClick={exportActivities}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'proposal', 'vote', 'comment', 'execution', 'collaboration', 'achievement'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {getActivityIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const color = getActivityColor(activity.type);
          const icon = activity.metadata?.achievementIcon || getActivityIcon(activity.type);

          return (
            <div key={activity.id} className="relative">
              {/* Timeline Line */}
              {index < activities.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}

              {/* Activity Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 
                            hover:border-blue-300 dark:hover:border-blue-700 transition ml-0 relative">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full bg-${color}-100 dark:bg-${color}-900/20 flex items-center justify-center text-2xl flex-shrink-0`}>
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold">{activity.title}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {activity.description}
                    </p>

                    {/* Metadata */}
                    {activity.metadata && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {activity.metadata.proposalId && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            Proposal #{activity.metadata.proposalId}
                          </span>
                        )}
                        {activity.metadata.amount && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                            {activity.metadata.amount.toLocaleString()} STX
                          </span>
                        )}
                        {activity.metadata.voteType && (
                          <span className={`px-2 py-1 rounded ${
                            activity.metadata.voteType === 'yes'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          }`}>
                            Voted {activity.metadata.voteType.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Load More Activities
        </button>
      )}

      {activities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No activities yet. Start participating in the DAO!</p>
        </div>
      )}
    </div>
  );
}
