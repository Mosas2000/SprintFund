'use client';

import { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Award, Activity } from 'lucide-react';

const COLORS = ['#EA580C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const fundingData = [
    { name: 'Jan 1', total: 4000, proposals: 24 },
    { name: 'Jan 5', total: 3000, proposals: 13 },
    { name: 'Jan 10', total: 2000, proposals: 98 },
    { name: 'Jan 15', total: 2780, proposals: 39 },
    { name: 'Jan 20', total: 1890, proposals: 48 },
    { name: 'Jan 25', total: 2390, proposals: 38 },
    { name: 'Jan 28', total: 3490, proposals: 43 },
];

const categoryData = [
    { name: 'DeFi', value: 45 },
    { name: 'Infrastructure', value: 25 },
    { name: 'Community', value: 15 },
    { name: 'Education', value: 10 },
    { name: 'Others', value: 5 },
];

const recentActivity = [
    { id: 1, type: 'funded', title: 'Stacks Wallet Integration', user: 'mosas.btc', time: '2m ago', amount: '250 STX' },
    { id: 2, type: 'milestone', title: '1,000 Total Proposals Reached', user: 'SprintFund', time: '1h ago' },
    { id: 3, type: 'funded', title: 'Starknet Bridge Research', user: 'alice.stx', time: '3h ago', amount: '450 STX' },
    { id: 4, type: 'proposal', title: 'New DAO Governance Model', user: 'bob.btc', time: '5h ago' },
    { id: 5, type: 'funded', title: 'Education Portal UI', user: 'charlie.stx', time: '8h ago', amount: '120 STX' },
];

export default function OverviewTab() {
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshCount(prev => prev + 1);
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Proposals"
                    value="1,284"
                    trend="+12.4%"
                    positive={true}
                    sparkData={[30, 45, 32, 50, 40, 60, 55]}
                />
                <KPICard
                    title="Success Rate"
                    value="68.2%"
                    trend="+5.1%"
                    positive={true}
                    sparkData={[60, 62, 58, 65, 63, 67, 68]}
                />
                <KPICard
                    title="Total Funded"
                    value="452K STX"
                    subtitle="≈ $1.2M USD"
                    trend="-2.4%"
                    positive={false}
                    sparkData={[80, 75, 85, 70, 78, 72, 70]}
                />
                <KPICard
                    title="Avg Time to Funding"
                    value="18.4 hrs"
                    trend="-3.2 hrs"
                    positive={true}
                    sparkData={[24, 22, 20, 19, 21, 18, 18]}
                />
            </div>

            {/* Primary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">Funding Velocity</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Cumulative funding & proposal volume</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-600" />
                                <span className="text-[10px] font-bold text-slate-400">FUNDED (STX)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <span className="text-[10px] font-bold text-slate-400">PROPOSALS</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={fundingData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#EA580C"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-8">Ecosystem Share</h3>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-black">{categoryData.length}</span>
                            <span className="text-[10px] font-bold text-slate-500">CATEGORIES</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {categoryData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{entry.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-600 group-hover:text-slate-300">{entry.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Secondary Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Top Proposers */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold uppercase tracking-tight">Top Performance</h3>
                        <Award className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { name: 'mosas.btc', success: '94%', count: 12 },
                            { name: 'alice.stx', success: '88%', count: 8 },
                            { name: 'bob.btc', success: '85%', count: 15 },
                            { name: 'charlie.stx', success: '82%', count: 9 },
                            { name: 'dan.btc', success: '78%', count: 20 },
                        ].map((user, i) => (
                            <div key={user.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-500 group-hover:border-orange-500 group-hover:text-orange-500 transition-all">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold group-hover:text-orange-500 transition-colors">{user.name}</p>
                                        <p className="text-[10px] font-bold text-slate-500">{user.count} proposals executed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-green-500">{user.success}</p>
                                    <p className="text-[10px] font-bold text-slate-500">SUCCESS</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold uppercase tracking-tight">Live Activity</h3>
                        <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex gap-4 group cursor-pointer">
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${item.type === 'funded' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                        item.type === 'milestone' ? 'bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.5)]' :
                                            'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-1">{item.title}</h4>
                                        <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap ml-2">{item.time}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500">
                                        {item.user} {item.amount && <span className="text-slate-300 ml-1">• {item.amount}</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                        VIEW ALL ACTIVITY
                    </button>
                </div>

                {/* Trending Topics */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm overflow-hidden">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-8">Trending Topics</h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { text: 'DeFi', size: 'text-2xl', count: '45' },
                            { text: 'Stacks v2.1', size: 'text-lg', count: '32' },
                            { text: 'Gaming', size: 'text-xl', count: '28' },
                            { text: 'DAOs', size: 'text-sm', count: '15' },
                            { text: 'Wallet', size: 'text-lg', count: '22' },
                            { text: 'Infrastructure', size: 'text-2xl', count: '40' },
                            { text: 'Education', size: 'text-md', count: '18' },
                            { text: 'Research', size: 'text-sm', count: '12' },
                            { text: 'Art', size: 'text-xl', count: '25' },
                            { text: 'Mobile', size: 'text-md', count: '20' },
                            { text: 'Liquidity', size: 'text-lg', count: '21' },
                            { text: 'Bridges', size: 'text-sm', count: '9' },
                        ].map((topic) => (
                            <button
                                key={topic.text}
                                className={`${topic.size} font-black uppercase tracking-tight transition-all hover:scale-110 hover:text-orange-500 ${parseInt(topic.count) > 30 ? 'text-slate-100' :
                                        parseInt(topic.count) > 20 ? 'text-slate-400' :
                                            'text-slate-600'
                                    }`}
                            >
                                {topic.text}
                            </button>
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-orange-600/10 border border-orange-500/20 rounded-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">Platform Insight</h4>
                            <p className="text-xs font-bold text-slate-300 leading-relaxed italic">
                                "Submissions related to 'Infrastructure' have higher success rates but require 12% more time for technical review."
                            </p>
                        </div>
                        <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-orange-500/10 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, subtitle, trend, positive, sparkData }: any) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-3xl font-black text-white">{value}</h4>
                    <div className={`flex items-center text-[10px] font-black ${positive ? 'text-green-500' : 'text-red-500'}`}>
                        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trend}
                    </div>
                </div>
                {subtitle && <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{subtitle}</p>}
            </div>

            {/* Sparkline */}
            <div className="absolute bottom-0 left-0 right-0 h-12 opacity-50 group-hover:opacity-80 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData.map((v: any, i: any) => ({ v, i }))}>
                        <Line
                            type="monotone"
                            dataKey="v"
                            stroke={positive ? '#10B981' : '#EF4444'}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
