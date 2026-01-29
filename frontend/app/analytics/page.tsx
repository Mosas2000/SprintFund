'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3,
    Filter,
    Download,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Users,
    Vote,
    FileText,
    User,
    Zap,
    Calendar,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    OverviewTab,
    ProposalsTab,
    VotingTab,
    CommunityTab,
    PersonalTab,
    InsightsFeed,
    PredictionsTab
} from '@/components/analytics';

type TabType = 'overview' | 'proposals' | 'voting' | 'community' | 'personal' | 'insights' | 'predictions';

export default function AnalyticsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate data fetch
        await new Promise(r => setTimeout(r, 1000));
        setLastUpdated(new Date());
        setIsRefreshing(false);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'proposals', label: 'Proposals', icon: FileText },
        { id: 'voting', label: 'Voting', icon: Vote },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'insights', label: 'Insights', icon: Zap },
        { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
            {/* Sidebar - Collapsible */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col"
                    >
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg tracking-tight uppercase">Filters</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 hover:bg-slate-800 rounded-md transition-colors lg:hidden"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Category Filter */}
                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Categories</h4>
                                <div className="space-y-3">
                                    {['DeFi', 'Infrastructure', 'Gaming', 'Art & NFTs', 'Education'].map((cat) => (
                                        <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                            <div className="w-4 h-4 rounded border border-slate-700 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                                                <input type="checkbox" className="hidden" />
                                                <div className="w-2 h-2 rounded-sm bg-orange-500 opacity-0 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Range */}
                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Amount Range (STX)</h4>
                                <input type="range" className="w-full accent-orange-600" min="0" max="10000" />
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2">
                                    <span>0 STX</span>
                                    <span>10k+ STX</span>
                                </div>
                            </div>

                            {/* Status checkboxes */}
                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Status</h4>
                                <div className="space-y-3">
                                    {['Active', 'Executed', 'Pending', 'Failed'].map((status) => (
                                        <label key={status} className="flex items-center gap-3 group cursor-pointer">
                                            <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                                                <input type="radio" name="status" className="hidden" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 transition-opacity" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{status}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Date Presets */}
                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Time Period</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {['7d', '30d', '90d', '1y', 'All'].map(p => (
                                        <button key={p} className="py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-md transition-colors uppercase tracking-widest">
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-800 bg-slate-900/80">
                            <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700/50 flex items-center justify-center gap-2">
                                <RefreshCw className="w-3 h-3" />
                                RESET ALL FILTERS
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-slate-800 bg-slate-950 flex items-center px-8 justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-800"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black tracking-tight uppercase leading-none mb-1">Analytics Dashboard</h1>
                            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Data-driven insights for better decisions</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
                            <Calendar className="w-4 h-4 text-slate-500 ml-2" />
                            <span className="text-xs font-bold text-slate-300 px-2">Jan 01 - Jan 28, 2026</span>
                        </div>
                        <button className="p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-800 group relative">
                            <Download className="w-5 h-5" />
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity">EXPORT PDF/CSV</span>
                        </button>
                        <button
                            onClick={handleRefresh}
                            className={`p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all border border-slate-800 ${isRefreshing ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Tab Navigation */}
                <nav className="border-b border-slate-800 bg-slate-900/20 px-8 py-3 flex gap-2 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all font-bold text-sm whitespace-nowrap ${isActive
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20 active:scale-95'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`} />
                                <span className="uppercase tracking-widest">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Dynamic Content Area */}
                <div className="flex-1 overflow-y-auto bg-slate-950/50">
                    <div className="max-w-[1600px] mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && <OverviewTab />}
                                {activeTab === 'proposals' && <ProposalsTab />}
                                {activeTab === 'voting' && <VotingTab />}
                                {activeTab === 'community' && <CommunityTab />}
                                {activeTab === 'personal' && <PersonalTab />}
                                {activeTab === 'insights' && <InsightsFeed />}
                                {activeTab === 'predictions' && <PredictionsTab />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <footer className="h-10 border-t border-slate-800 bg-slate-950/80 px-8 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>API: STACKS-MAINNET (v2.1)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>DATA: REAL-TIME ENGINE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                        <a href="#" className="hover:text-white transition-colors text-orange-500">Need Help?</a>
                    </div>
                </footer>
            </main>

            {/* Mobile Filter Overlay */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden md:block lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
