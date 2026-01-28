'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function PerformanceTracker() {
    const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'learning'>('overview');

    const performanceData = [
        { month: 'Jan', rate: 45 },
        { month: 'Feb', rate: 52 },
        { month: 'Mar', rate: 48 },
        { month: 'Apr', rate: 65 },
        { month: 'May', rate: 72 },
        { month: 'Jun', rate: 85 },
    ];

    const milestones = [
        { title: 'First Proposal', icon: '🎉', date: 'Jan 12, 2024', status: 'completed' },
        { title: '5 Successful Proposals', icon: '🏆', date: 'Mar 05, 2024', status: 'completed' },
        { title: '100 STX Funded', icon: '💰', date: 'Apr 22, 2024', status: 'completed' },
        { title: 'Top 10% Success Rate', icon: '⭐', date: 'Expected Jun 2024', status: 'in-progress' },
        { title: 'Community Champion', icon: '🗳️', date: '50/100 votes', status: 'locked' }
    ];

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Proposals" value="12" trend="+3 vs last month" />
                <StatCard label="Success Rate" value="85%" trend="+12% trend" />
                <StatCard label="STX Received" value="450" trend="+80 this month" />
                <StatCard label="Reputation" value="4.8" trend="Rank #124" />
            </div>

            {/* Main Chart */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">Your Success Journey</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-400 font-medium'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'achievements' ? 'bg-blue-600 text-white' : 'text-gray-400 font-medium'}`}
                        >
                            Milestones
                        </button>
                    </div>
                </div>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }}
                                domain={[0, 100]}
                            />
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="rate"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRate)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Milestones */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold mb-6">Achievements</h3>
                    <div className="space-y-4">
                        {milestones.map((m) => (
                            <div key={m.title} className="flex items-center gap-4 group">
                                <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl ${m.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20' :
                                    m.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                        'bg-gray-50 dark:bg-gray-900/50 opacity-50'
                                    }`}>
                                    {m.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-bold ${m.status === 'locked' ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                        {m.title}
                                    </h4>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{m.date}</p>
                                </div>
                                {m.status === 'completed' && <span className="text-green-500 font-bold text-xs">✓</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Curve Analysis */}
                <div className="bg-blue-600 p-8 rounded-2xl text-white">
                    <h3 className="text-lg font-bold mb-4">Learning Curve Analysis</h3>
                    <p className="text-sm text-blue-100 mb-8 leading-relaxed">
                        Your success rate improved 35% after your first 3 proposals. This is 22% faster than the platform average improvement rate.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="opacity-80">Category Competency: DeFi</span>
                                <span>95%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[95%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="opacity-80">Engagement Momentum</span>
                                <span>78%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[78%]" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/10">
                        <p className="text-xs italic opacity-90">
                            "You are currently performing in the top 5% of active proposers this quarter. Keep focusing on technical documentation."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mb-2">{value}</div>
            <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{trend}</div>
        </div>
    );
}
