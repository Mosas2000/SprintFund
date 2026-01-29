'use client';

import { useState } from 'react';

export default function CommunityInsights() {
    const [reportType, setReportType] = useState<'engagement' | 'economic' | 'network' | 'quality'>('engagement');

    return (
        <div className="space-y-8">
            {/* Platform Health Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black mb-1">Community Vitality</h2>
                    <p className="text-sm text-gray-500 font-medium">Real-time health markers of the SprintFund ecosystem.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
                    {(['engagement', 'economic', 'network', 'quality'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setReportType(t)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${reportType === t ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricBox label="Active Voters" value="1,284" change="+12.4%" positive={true} />
                <MetricBox label="Daily Funding" value="45K STX" change="-5.2%" positive={false} />
                <MetricBox label="Avg. Participation" value="42%" change="+2.1%" positive={true} />
                <MetricBox label="Treasury Health" value="98/100" change="Stable" positive={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Insight Card */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-8">Ecosystem Composition</h3>
                    <div className="space-y-12">
                        <CategoryProgress label="Infrastructure & Tooling" value={45} color="bg-blue-500" />
                        <CategoryProgress label="DeFi & Liquidity" value={30} color="bg-purple-500" />
                        <CategoryProgress label="Community & Education" value={15} color="bg-green-500" />
                        <CategoryProgress label="Research & Development" value={10} color="bg-yellow-500" />
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Growth</div>
                            <div className="text-lg font-black text-green-500">+22%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Retention</div>
                            <div className="text-lg font-black text-blue-500">88%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Churn Rate</div>
                            <div className="text-lg font-black text-red-500">4.5%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">NPS</div>
                            <div className="text-lg font-black text-purple-500">72</div>
                        </div>
                    </div>
                </div>

                {/* Alerts & Notifications */}
                <div className="flex flex-col gap-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 p-6 rounded-[24px]">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">⚠️</span>
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-400">Attention Required</h4>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-200/70 mb-4 font-medium">
                            Voter engagement in the "Education" category has dropped 15% WoW. Platform reach is decreasing in this segment.
                        </p>
                        <button className="text-xs font-black text-yellow-800 dark:text-yellow-400 hover:underline">
                            VIEW MITIGATION STRATEGY →
                        </button>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 p-6 rounded-[24px]">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-xl">✅</span>
                            <h4 className="font-bold text-green-800 dark:text-green-400">Milestone Reached</h4>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-200/70 mb-4 font-medium">
                            Distributed 2M+ STX this month. We are 115% ahead of our quarterly target.
                        </p>
                        <button className="text-xs font-black text-green-800 dark:text-green-400 hover:underline">
                            SHARE PERFORMANCE REPORT →
                        </button>
                    </div>

                    <div className="flex-1 bg-gray-900 rounded-[24px] p-6 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black mb-2">Network Expansion</h4>
                            <p className="text-xs text-white/60 mb-8">Your platform score is increasing exponentially.</p>
                            <div className="text-4xl font-black mb-2">9.2k</div>
                            <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest">New Connections Today</div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:scale-110 transition">🌐</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricBox({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="flex items-end gap-3">
                <div className="text-2xl font-black text-gray-900 dark:text-white leading-none">{value}</div>
                <div className={`text-[10px] font-bold leading-none mb-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                </div>
            </div>
        </div>
    );
}

function CategoryProgress({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
                <span className="text-xs font-black text-gray-400">{value}%</span>
            </div>
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
