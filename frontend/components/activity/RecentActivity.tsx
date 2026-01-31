import React from 'react';

interface Activity {
    id: string;
    type: 'proposal' | 'vote' | 'execution';
    user: string;
    action: string;
    target: string;
    timestamp: Date;
}

interface RecentActivityProps {
    activities: Activity[];
    maxItems?: number;
}

export default function RecentActivity({ activities, maxItems = 5 }: RecentActivityProps) {
    const displayedActivities = activities.slice(0, maxItems);

    const getActivityIcon = (type: Activity['type']) => {
        switch (type) {
            case 'proposal':
                return '📝';
            case 'vote':
                return '🗳️';
            case 'execution':
                return '✅';
            default:
                return '📋';
        }
    };

    const getActivityColor = (type: Activity['type']) => {
        switch (type) {
            case 'proposal':
                return 'text-blue-600 dark:text-blue-400';
            case 'vote':
                return 'text-purple-600 dark:text-purple-400';
            case 'execution':
                return 'text-green-600 dark:text-green-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    const formatTimestamp = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📊</span>
                Recent Activity
            </h3>

            {displayedActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-sm">No recent activity</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayedActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="text-2xl flex-shrink-0">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white">
                                    <span className="font-semibold">{activity.user}</span>{' '}
                                    <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{' '}
                                    <span className={`font-medium ${getActivityColor(activity.type)}`}>
                                        {activity.target}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formatTimestamp(activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
