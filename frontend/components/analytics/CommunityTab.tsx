'use client';

import { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    TrendingUp,
    ShieldCheck,
    Activity,
    Globe,
    Heart,
    ChevronRight,
    Zap,
    Star
} from 'lucide-react';
import { CommunityInsights } from './index';

const COLORS = ['#EA580C', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export default function CommunityTab() {
    return (
        <div className="p-8 space-y-12 bg-slate-950/20">
            {/* Existing Community Insights Engine */}
            <section className="bg-slate-900/30 border border-slate-800 rounded-[40px] p-2">
                <CommunityInsights />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Section 1: Member Growth & Cohorts */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Growth & Retention Curves</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { month: 'Jul', active: 400, retained: 320 },
                                { month: 'Aug', active: 520, retained: 410 },
                                { month: 'Sep', active: 680, retained: 520 },
                                { month: 'Oct', active: 850, retained: 640 },
                                { month: 'Nov', active: 1100, retained: 880 },
                                { month: 'Dec', active: 1284, retained: 980 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                                <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 4 }} />
                                <Line type="monotone" dataKey="retained" stroke="#10B981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Growth rate</p>
                            <p className="text-lg font-black text-green-500">22.4% MoM</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Retention</p>
                            <p className="text-lg font-black text-blue-500">76% / 90d</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Churn</p>
                            <p className="text-lg font-black text-red-500">4.2%</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Engagement Funnel */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Contributor Pipeline</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Visitors', value: '14.2K', width: '100%', color: 'from-slate-700 to-slate-800' },
                            { label: 'Connected', value: '8.4K', width: '75%', color: 'from-blue-600 to-blue-700' },
                            { label: 'Active Voters', value: '1.2K', width: '45%', color: 'from-green-600 to-green-700' },
                            { label: 'Proposers', value: '482', width: '25%', color: 'from-orange-600 to-orange-700' },
                            { label: 'Power Users', value: '124', width: '12%', color: 'from-purple-600 to-purple-700' },
                        ].map((step, i) => (
                            <div key={step.label} className="relative">
                                <div className="flex justify-between items-center mb-1.5 px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.label}</span>
                                    <span className="text-xs font-black text-white">{step.value}</span>
                                </div>
                                <div className="h-6 w-full bg-slate-950/50 rounded-lg overflow-hidden border border-slate-800/50">
                                    <div className={`h-full bg-gradient-to-r ${step.color} transition-all duration-1000`} style={{ width: step.width }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Visitor → Contributor</p>
                        <p className="text-3xl font-black text-white">8.4% <span className="text-xs text-green-500 ml-1">+1.2%</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Section 3: Contributor Leaderboard */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tight mb-8">Top Vitality Drivers</h3>
                    <div className="space-y-4">
                        {[
                            { user: 'mosas.btc', contribution: 'Governance Lead', impact: 98, role: 'Mentor' },
                            { user: 'alice.vibe', contribution: 'UI Expert', impact: 95, role: 'Contributor' },
                            { user: 'bob.stx', contribution: 'API Support', impact: 92, role: 'Voter' },
                            { user: 'dao_master.btc', contribution: 'Treasury Admin', impact: 88, role: 'Mentor' },
                        ].map((item) => (
                            <div key={item.user} className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800/50 hover:border-orange-500/50 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                        {item.user.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">{item.user}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.contribution}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-slate-800 rounded text-[8px] font-black uppercase text-slate-400 group-hover:text-orange-500 transition-colors">{item.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                        VIEW ALL CONTRIBUTORS
                    </button>
                </div>

                {/* Section 4: Network & Social Health */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-8">Network Dynamics</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reach</span>
                                </div>
                                <p className="text-xl font-black">94 countries</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sentiment</span>
                                </div>
                                <p className="text-xl font-black">Positive (4.8/5)</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Velocity</span>
                                </div>
                                <p className="text-xl font-black">1.4 prop/user</p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Collaborative</span>
                                </div>
                                <p className="text-xl font-black">68% multiprop</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-8 bg-blue-600 rounded-3xl text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-sm font-black uppercase tracking-widest mb-2 opacity-80">Network Strength</h4>
                            <div className="text-4xl font-black mb-4 tracking-tighter">8.4x</div>
                            <p className="text-xs font-bold text-blue-100 leading-relaxed uppercase tracking-tight">
                                Average connections per active participant increase 22% this quarter.
                            </p>
                        </div>
                        <Activity className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 group-hover:scale-125 transition-transform duration-1000" />
                    </div>
                </div>

                {/* Section 5: Community Directory Preview */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black uppercase tracking-tight">Ecosystem Directory</h3>
                        <div className="px-3 py-1 bg-orange-600/10 text-orange-500 text-[10px] font-black rounded-full uppercase">12.4K Total</div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Kanoa.stx', rep: 4.9, tags: ['Developer', 'Voter'], xp: '1.2k' },
                            { name: 'Satoshi.btc', rep: 4.8, tags: ['Investor'], xp: '800' },
                            { name: 'StacksGirl', rep: 5.0, tags: ['Community'], xp: '2.5k' },
                            { name: 'Mosas.btc', rep: 4.7, tags: ['Governance'], xp: '1.1k' },
                        ].map((m) => (
                            <div key={m.name} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800/50 rounded-2xl hover:border-orange-500/30 transition-all group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-orange-500 group-hover:bg-orange-600/10 transition-all">
                                        {m.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{m.name}</p>
                                        <div className="flex gap-1.5 mt-0.5">
                                            {m.tags.slice(0, 1).map(t => (
                                                <span key={t} className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-orange-500">{m.rep}★</p>
                                    <p className="text-[8px] font-bold text-slate-600">REP</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-800 mt-8">
                        <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2">
                            VIEW FULL DIRECTORY
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Platform Echelon Summary */}
            <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-[48px] p-12 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-2xl shadow-orange-900/40">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Sovereign <br /> Health Index</h3>
                        </div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-tighter max-w-sm">
                            Comprehensive vitality score based on participation, capital velocity, and network consensus.
                        </p>
                    </div>

                    <div className="flex items-center gap-20">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Sentiment</p>
                            <p className="text-4xl font-black text-white">4.8</p>
                            <div className="flex gap-1 mt-2 justify-center">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />)}
                            </div>
                        </div>
                        <div className="h-20 w-[1px] bg-slate-800" />
                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Index Score</p>
                            <div className="w-24 h-24 relative">
                                <svg className="w-24 h-24 -rotate-90">
                                    <circle cx="48" cy="48" r="42" fill="none" stroke="#1e293b" strokeWidth="6" />
                                    <circle cx="48" cy="48" r="42" fill="none" stroke="#EA580C" strokeWidth="6" strokeDasharray="264" strokeDashoffset="40" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-black text-white">84</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HealthScore({ title, score, status, color }: any) {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</span>
                <span className={`text-[10px] font-black ${status === 'OK' ? 'text-green-500' : 'text-orange-500'} uppercase`}>{score} / 100</span>
            </div>
            <div className="h-1.5 w-full bg-slate-950/50 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5 }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}
