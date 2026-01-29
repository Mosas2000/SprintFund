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
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Award, Activity, Sparkles, Shield } from 'lucide-react';
import { InsightsFeed } from './index';
import TreasuryTransparency from '../TreasuryTransparency';
import EcosystemBenchmarks from '../EcosystemBenchmarks';

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

            {/* Industrial Data Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TreasuryTransparency />
                <EcosystemBenchmarks />
            </div>

            {/* Tertiary Insights & Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* DAO Health Index */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Shield className="w-24 h-24 text-green-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold uppercase tracking-tight">Protocol Health</h3>
                            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <span className="text-[10px] font-black text-green-500 uppercase">A+ Rating</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-8">
                            <h4 className="text-4xl font-black text-white">94/100</h4>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">STABLE ECHELON</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Participation', val: '92%', ok: true },
                                { name: 'Capital Runway', val: '14mo', ok: true },
                                { name: 'Growth Vel.', val: 'Strong', ok: true },
                            ].map(m => (
                                <div key={m.name} className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-500 uppercase">{m.name}</span>
                                    <span className="text-xs font-black text-white">{m.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity (Moved into its own component style) */}
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
                    <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-orange-500/10 group-hover:scale-110 transition-transform" />
                </div>
            </div>
        </div>

            {/* AI Insights Engine Row */ }
    <section className="bg-slate-900/30 border border-slate-800 rounded-[48px] p-2">
        <div className="p-8 pb-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
                <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <div>
                <h3 className="text-xl font-black uppercase tracking-tight">AI Insights Feed</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase mt-1">Real-time analysis of platform dynamics and growth patterns</p>
            </div>
        </div>
        <InsightsFeed />
    </section>
        </div >
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
