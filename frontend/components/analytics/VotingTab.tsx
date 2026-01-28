'use client';

import { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line,
    AreaChart,
    Area
} from 'recharts';
import {
    Vote,
    Users,
    TrendingUp,
    Zap,
    Activity,
    ChevronUp,
    ChevronDown,
    Shield,
    Target,
    Globe
} from 'lucide-react';
import { VotingHeatmap, VoterNetworkGraph } from './index';

const COLORS = ['#EA580C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const segmentationData = [
    { name: 'Whales', value: 5, color: '#EA580C' },
    { name: 'Regular', value: 25, color: '#3B82F6' },
    { name: 'Occasional', value: 40, color: '#10B981' },
    { name: 'One-time', value: 30, color: '#64748b' },
];

const weightDistribution = [
    { weight: '1-10', count: 850 },
    { weight: '10-50', count: 420 },
    { weight: '50-200', count: 180 },
    { weight: '200-1k', count: 65 },
    { weight: '1k-5k', count: 24 },
    { weight: '5k+', count: 8 },
];

const influenceRankings = [
    { rank: 1, user: 'mosas.btc', votes: 142, successRate: '92%', weight: 'High' },
    { rank: 2, user: 'stacks.stx', votes: 98, successRate: '88%', weight: 'Medium' },
    { rank: 3, user: 'alice.vibe', votes: 76, successRate: '95%', weight: 'Low' },
    { rank: 4, user: 'bob.btc', votes: 65, successRate: '82%', weight: 'High' },
    { rank: 5, user: 'charlie.stx', votes: 54, successRate: '78%', weight: 'Medium' },
];

export default function VotingTab() {
    const [liveVotes, setLiveVotes] = useState<any[]>([]);

    useEffect(() => {
        // Mock live voting feed
        const items = [
            { id: 1, user: 'mosas.btc', proposal: 'Stacks Wallet v3', type: 'YES', weight: 450, time: 'Now' },
            { id: 2, user: 'alice.stx', proposal: 'NFT Grant #42', type: 'YES', weight: 120, time: '2s ago' },
            { id: 3, user: 'bob.btc', proposal: 'Governance SIP-12', type: 'NO', weight: 800, time: '5s ago' },
            { id: 4, user: 'charlie.stx', proposal: 'Stacks Wallet v3', type: 'YES', weight: 25, time: '12s ago' },
        ];
        setLiveVotes(items);

        const interval = setInterval(() => {
            setLiveVotes(prev => {
                const newVote = {
                    id: Date.now(),
                    user: 'user_' + Math.floor(Math.random() * 1000) + '.stx',
                    proposal: 'Proposal #' + Math.floor(Math.random() * 500),
                    type: Math.random() > 0.3 ? 'YES' : 'NO',
                    weight: Math.floor(Math.random() * 1000),
                    time: 'Now'
                };
                return [newVote, ...prev.slice(0, 9)];
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-12 bg-slate-950/20">
            {/* Section 1: Voting Activity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard label="Total Votes Cast" value="42.8K" trend="+2.4k" trendUp={true} />
                <StatsCard label="Unique Voters" value="1,284" trend="+12" trendUp={true} />
                <StatsCard label="Votes Today" value="342" trend="-15%" trendUp={false} />
                <StatsCard label="Avg Vote Weight" value="145 STX" trend="Stable" trendUp={true} />
                <StatsCard label="QV Savings" value="12.4K STX" trend="+8% efficiency" trendUp={true} highlight={true} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Section 2: Voting Patterns (Time of Day) */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Voting Temporal Patterns</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { hour: '00', votes: 120 }, { hour: '04', votes: 80 }, { hour: '08', votes: 340 },
                                { hour: '12', votes: 680 }, { hour: '16', votes: 920 }, { hour: '20', votes: 540 },
                                { hour: '23', votes: 210 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                    label={{ value: 'HOUR (UTC)', position: 'bottom', offset: 0, fontSize: 8, fontWeight: 'black', fill: '#475569' }}
                                />
                                <YAxis hide />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="votes" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVotes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex justify-center gap-12">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Peak Activity</p>
                            <p className="text-sm font-black text-white">14:00 - 18:00 UTC</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Most Active Day</p>
                            <p className="text-sm font-black text-white">Thursdays</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Voter Segmentation */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 flex flex-col items-center">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8 self-start">Voter Segmentation</h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={segmentationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {segmentationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black">1.2k</span>
                            <span className="text-[10px] font-bold text-slate-500">TOTAL VOTERS</span>
                        </div>
                    </div>
                    <div className="w-full mt-6 space-y-3">
                        {segmentationData.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-all uppercase tracking-tight">{entry.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-300">{entry.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 4: Vote Distribution Analysis */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Power Distribution</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weightDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="weight"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                    label={{ value: 'VOTE WEIGHT (STX)', position: 'bottom', offset: 0, fontSize: 8, fontWeight: 'black', fill: '#475569' }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                                <Bar dataKey="count" fill="#EA580C" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex justify-between items-center p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Gini Coefficient</p>
                            <p className="text-2xl font-black text-white">0.42</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Decentralization Score</p>
                            <p className="text-2xl font-black text-green-500 flex items-center gap-2 justify-end">
                                <Shield className="w-5 h-5" />
                                HEALTHY
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 5: Voter Influence rankings */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Influence Ranking</h3>
                    <div className="space-y-4">
                        {influenceRankings.map((v) => (
                            <div key={v.user} className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800/50 rounded-2xl hover:border-orange-500/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-slate-500 group-hover:text-orange-500 transition-colors">
                                        #{v.rank}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{v.user}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{v.votes} total votes cast</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs font-black text-blue-500">{v.successRate}</p>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase">PRED. ACCURACY</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${v.weight === 'High' ? 'bg-orange-500/10 text-orange-500' :
                                                v.weight === 'Medium' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-slate-700/30 text-slate-500'
                                            }`}>
                                            {v.weight} IMPACT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                        VIEW FULL NETWORK GRAPH
                    </button>
                </div>
            </div>

            {/* Real-time Voting Feed */}
            <div className="bg-slate-900 overflow-hidden rounded-[32px] border border-slate-800">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="text-sm font-black uppercase tracking-widest">Live Voting Activity</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>244 Active Proposals</span>
                        <span>•</span>
                        <span className="text-orange-500">12,423 Connected Wallets</span>
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <div className="flex p-6 gap-6 min-w-max">
                        {liveVotes.map((vote) => (
                            <div key={vote.id} className="w-72 p-5 bg-slate-950/50 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{vote.user}</p>
                                        <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">{vote.proposal}</h4>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${vote.type === 'YES' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {vote.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-orange-500" />
                                        <span className="text-xs font-black">{vote.weight} STX</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase">{vote.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ label, value, trend, trendUp, highlight }: any) {
    return (
        <div className={`p-6 rounded-3xl border transition-all ${highlight
                ? 'bg-orange-600/10 border-orange-500/30'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline justify-between gap-2">
                <h4 className={`text-2xl font-black ${highlight ? 'text-orange-500' : 'text-white'}`}>{value}</h4>
                <div className={`flex items-center text-[10px] font-black ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {trendUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
        </div>
    );
}
