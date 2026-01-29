'use client';

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
    ZAxis,
    Cell,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie
} from 'recharts';
import {
    FileText,
    Filter,
    Search,
    Download,
    TrendingUp,
    Clock,
    DollarSign,
    Zap,
    MoreVertical,
    ChevronDown
} from 'lucide-react';

const COLORS = ['#EA580C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export default function ProposalsTab() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="p-8 space-y-12">
            {/* Section 1: Performance Matrix */}
            <section className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Proposal Performance Matrix</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase mt-1">Detailed analysis of all submitted micro-grants</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search proposals..."
                                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold focus:border-orange-500 outline-none w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700">
                            <Filter className="w-4 h-4" />
                            ADVANCED FILTERS
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/80">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Proposal</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Votes</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Success %</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {[
                                { id: 482, title: 'DeFi Dashboard Library', cat: 'DeFi', amt: '450', votes: 124, success: 92, status: 'Executed' },
                                { id: 481, title: 'Stacks Bridge Analysis', cat: 'Infrastructure', amt: '800', votes: 89, success: 75, status: 'Active' },
                                { id: 480, title: 'NFT Artist Grant', cat: 'Art', amt: '250', votes: 156, success: 98, status: 'Executed' },
                                { id: 479, title: 'Gaming Engine Plugin', cat: 'Gaming', amt: '600', votes: 45, success: 42, status: 'Failed' },
                                { id: 478, title: 'Community Docs v2', cat: 'Community', amt: '150', votes: 230, success: 99, status: 'Executed' },
                            ].map((row) => (
                                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-5 text-sm font-black text-slate-500">#{row.id}</td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold group-hover:text-orange-500 transition-colors">{row.title}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Submitted 2 days ago</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-[10px] font-black rounded-lg uppercase tracking-tight">
                                                {row.cat}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right text-sm font-black">{row.amt} STX</td>
                                    <td className="px-6 py-5 text-right text-sm font-black text-slate-400">{row.votes}</td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-600 rounded-full" style={{ width: `${row.success}%` }} />
                                            </div>
                                            <span className="text-sm font-black">{row.success}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${row.status === 'Executed' ? 'bg-green-500/10 text-green-500' :
                                                    row.status === 'Active' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-red-500/10 text-red-500'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-all text-slate-500">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-6 bg-slate-900/30 border-t border-slate-800 flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Showing 5 of 482 proposals</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-slate-800 rounded-md disabled:opacity-50" disabled>PREV</button>
                            <button className="px-3 py-1 bg-slate-800 rounded-md">NEXT</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 2: Success Factors Analysis */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Success Factor Correlation</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    type="number"
                                    dataKey="amount"
                                    name="Amount"
                                    unit=" STX"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="success"
                                    name="Success Rate"
                                    unit="%"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <ZAxis type="number" dataKey="votes" range={[60, 400]} name="Votes" />
                                <Tooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Scatter name="Proposals" data={[
                                    { amount: 100, success: 95, votes: 200 },
                                    { amount: 500, success: 82, votes: 150 },
                                    { amount: 1000, success: 45, votes: 300 },
                                    { amount: 250, success: 88, votes: 80 },
                                    { amount: 800, success: 60, votes: 120 },
                                    { amount: 400, success: 91, votes: 210 },
                                    { amount: 1500, success: 25, votes: 400 },
                                    { amount: 300, success: 85, votes: 110 },
                                ]} fill="#EA580C" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-4 text-center tracking-widest">
                        Correlation: Inverse relationship between amount requested and success probability.
                    </p>
                </div>

                {/* Section 3: Proposal Lifecycle Funnel */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Lifecycle Analysis</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Submitted', value: 1284, color: 'bg-slate-700' },
                            { label: 'Qualified (voted)', value: 1052, color: 'bg-blue-600' },
                            { label: 'Threshold Met', value: 843, color: 'bg-purple-600' },
                            { label: 'Funded / Executed', value: 692, color: 'bg-orange-600' },
                        ].map((step, i) => (
                            <div key={step.label} className="relative group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{step.label}</span>
                                    <span className="text-xs font-black text-white">{step.value} <span className="text-slate-500 ml-1">({Math.round(step.value / 1284 * 100)}%)</span></span>
                                </div>
                                <div className="h-4 bg-slate-950/50 rounded-full overflow-hidden border border-slate-800">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${step.value / 1284 * 100}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className={`h-full ${step.color} rounded-full flex items-center px-4`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Conversion</p>
                            <p className="text-2xl font-black text-white">53.9%</p>
                        </div>
                        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Avg Time to funded</p>
                            <p className="text-2xl font-black text-white">18.4h</p>
                        </div>
                    </div>
                </div>

                {/* Section 4: Amount Analysis */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Amount Distribution (STX)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { range: '0-100', count: 450 },
                                { range: '100-250', count: 320 },
                                { range: '250-500', count: 210 },
                                { range: '500-1k', count: 180 },
                                { range: '1k-2k', count: 95 },
                                { range: '2k+', count: 29 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="range"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 flex justify-center gap-8">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Optimal Range</p>
                            <p className="text-sm font-black text-green-500">100 - 250 STX</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Market Median</p>
                            <p className="text-sm font-black text-white">320 STX</p>
                        </div>
                    </div>
                </div>

                {/* Section 5: Timing Analysis */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 overflow-hidden">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Submission Hotspots</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                            <div key={day} className="text-[10px] font-black text-slate-600 text-center mb-2">{day}</div>
                        ))}
                        {Array.from({ length: 28 }).map((_, i) => {
                            const intensity = Math.random();
                            return (
                                <div
                                    key={i}
                                    className="aspect-square rounded-md transition-all hover:scale-110 cursor-pointer border border-white/5"
                                    style={{
                                        backgroundColor: intensity > 0.8 ? '#EA580C' :
                                            intensity > 0.5 ? '#9A3412' :
                                                intensity > 0.3 ? '#431407' :
                                                    '#0f172a'
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500">LOW</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-sm bg-slate-900" />
                                <div className="w-2 h-2 rounded-sm bg-orange-950" />
                                <div className="w-2 h-2 rounded-sm bg-orange-800" />
                                <div className="w-2 h-2 rounded-sm bg-orange-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">HIGH</span>
                        </div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                            Peak Success: Wednesdays 10:00 - 14:00 UTC
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 6: Quality Metrics Header */}
            <section className="bg-orange-600 p-12 rounded-[48px] text-white relative overflow-hidden group">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-4xl font-black mb-6 leading-none tracking-tight">Content Quality Impact</h3>
                        <p className="text-lg font-medium text-orange-100 mb-8 max-w-md">
                            Our AI analysis shows that proposal quality significantly correlates with funding speed and voter sentiment.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] font-black opacity-60 uppercase mb-2">Desc. Length Effect</p>
                                <p className="text-2xl font-black">+24%</p>
                                <p className="text-[10px] font-medium opacity-80 uppercase mt-1">Found in top 100</p>
                            </div>
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[10px] font-black opacity-60 uppercase mb-2">Technical Detail</p>
                                <p className="text-2xl font-black">+31%</p>
                                <p className="text-[10px] font-medium opacity-80 uppercase mt-1">Voter preference</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { keyword: 'Implementation', boost: '+42%', rank: 1 },
                            { keyword: 'Milestones', boost: '+38%', rank: 2 },
                            { keyword: 'Scalability', boost: '+22%', rank: 3 },
                            { keyword: 'Open Source', boost: '+15%', rank: 4 },
                        ].map((k) => (
                            <div key={k.keyword} className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all cursor-crosshair">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black opacity-40">0{k.rank}</span>
                                    <span className="text-sm font-black uppercase tracking-tight">{k.keyword}</span>
                                </div>
                                <span className="text-sm font-black text-orange-300">{k.boost} BOOST</span>
                            </div>
                        ))}
                    </div>
                </div>
                <TrendingUp className="absolute -bottom-10 -right-10 w-96 h-96 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
            </section>
        </div>
    );
}
