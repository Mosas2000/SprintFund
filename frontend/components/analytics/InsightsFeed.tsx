'use client';

import { useState, useEffect, useMemo } from 'react';
import { Insight, generateAllInsights } from '@/utils/analytics/insightsGenerator';
import { fetchAllProposals } from '@/utils/analytics/dataCollector';
import { generateTimeSeriesData } from '@/utils/analytics/dataProcessor';

export default function InsightsFeed() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | Insight['type']>('all');
    const [sortBy, setSortBy] = useState<'priority' | 'recency'>('priority');
    const [search, setSearch] = useState('');
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

    useEffect(() => {
        const loadInsights = async () => {
            try {
                const proposals = await fetchAllProposals();
                const timeseries = generateTimeSeriesData(proposals, 'week');
                // In a real app, userContext would come from a wallet provider or session
                const mockUserContext = {
                    role: 'proposer',
                    lastProposal: proposals[0],
                    history: proposals.slice(0, 5),
                    preferences: ['DeFi', 'Infrastructure']
                };

                const generated = generateAllInsights(proposals, timeseries, mockUserContext);
                setInsights(generated);

                // Load dismissed insights from localStorage
                const dismissed = JSON.parse(localStorage.getItem('dismissed_insights') || '[]');
                setDismissedIds(dismissed);
            } catch (error) {
                console.error('Failed to load insights:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInsights();

        // Refresh insights every 5 minutes
        const interval = setInterval(loadInsights, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDismiss = (id: string) => {
        const updated = [...dismissedIds, id];
        setDismissedIds(updated);
        localStorage.setItem('dismissed_insights', JSON.stringify(updated));
    };

    const filteredInsights = useMemo(() => {
        return insights
            .filter(i => !dismissedIds.includes(i.id))
            .filter(i => filter === 'all' || i.type === filter)
            .filter(i =>
                i.title.toLowerCase().includes(search.toLowerCase()) ||
                i.description.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'priority') {
                    const priorityMap = { high: 3, medium: 2, low: 1 };
                    return priorityMap[b.priority] - priorityMap[a.priority];
                }
                return b.timestamp - a.timestamp;
            });
    }, [insights, dismissedIds, filter, sortBy, search]);

    const getTypeIcon = (type: Insight['type']) => {
        switch (type) {
            case 'trend': return '🔍';
            case 'anomaly': return '⚠️';
            case 'comparative': return '📊';
            case 'predictive': return '🔮';
            default: return '💡';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search insights..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {(['all', 'trend', 'anomaly', 'comparative', 'predictive'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${filter === t
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed */}
            <div className="grid grid-cols-1 gap-4">
                {filteredInsights.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
                        No insights found for the current filters.
                    </div>
                ) : (
                    filteredInsights.map((insight) => (
                        <div
                            key={insight.id}
                            className={`bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition group relative ${insight.priority === 'high' ? 'border-l-4 border-l-red-500' :
                                    insight.priority === 'medium' ? 'border-l-4 border-l-yellow-500' : ''
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-4xl p-2 bg-gray-50 dark:bg-gray-900 rounded-lg group-hover:scale-110 transition">
                                    {getTypeIcon(insight.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${insight.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                                                    insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' :
                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                                                }`}>
                                                {insight.priority}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedInsight(insight)}
                                                className="text-xs text-blue-600 hover:underline font-medium"
                                            >
                                                Learn More
                                            </button>
                                            <button
                                                onClick={() => handleDismiss(insight.id)}
                                                className="text-gray-400 hover:text-red-500 transition"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                        {insight.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                        {insight.description}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setSelectedInsight(insight)}
                                            className="px-4 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-xs font-bold hover:opacity-90 transition"
                                        >
                                            View Details
                                        </button>
                                        <div className="flex gap-3">
                                            <button className="text-gray-400 hover:text-blue-500 text-sm">Save</button>
                                            <button className="text-gray-400 hover:text-blue-500 text-sm">Share</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Insight Modal */}
            {selectedInsight && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{getTypeIcon(selectedInsight.type)}</span>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedInsight.type.toUpperCase()} ANALYSIS</h2>
                                    <p className="text-xs text-gray-500">Insight generated via AI Engine</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedInsight(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold mb-4">{selectedInsight.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                                {selectedInsight.description}
                            </p>

                            {selectedInsight.recommendations && selectedInsight.recommendations.length > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 mb-8">
                                    <h4 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-4">
                                        💡 Actionable Recommendations
                                    </h4>
                                    <ul className="space-y-3">
                                        {selectedInsight.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 text-blue-800/80 dark:text-blue-200/80">
                                                <span className="text-blue-500 mt-1">●</span>
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Confidence Score</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">88%</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Priority Level</div>
                                    <div className={`text-2xl font-bold uppercase ${selectedInsight.priority === 'high' ? 'text-red-500' :
                                            selectedInsight.priority === 'medium' ? 'text-yellow-500' :
                                                'text-blue-500'
                                        }`}>
                                        {selectedInsight.priority}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50">
                            <button
                                onClick={() => setSelectedInsight(null)}
                                className="px-6 py-2 text-gray-600 dark:text-gray-400 font-bold hover:text-gray-900 transition"
                            >
                                Close
                            </button>
                            {selectedInsight.actionable && (
                                <button className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition">
                                    Apply Insight
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
