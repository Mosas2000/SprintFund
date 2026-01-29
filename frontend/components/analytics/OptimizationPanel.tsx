'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target } from 'lucide-react';
import { Recommendation } from '@/utils/analytics/insightsGenerator';

interface SuggestionCardProps {
    suggestion: Recommendation;
    onComplete: (id: string) => void;
}

function SuggestionCard({ suggestion, onComplete }: SuggestionCardProps) {
    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = () => {
        setIsCompleted(true);
        onComplete(suggestion.id);
    };

    return (
        <div className={`bg-slate-900/50 p-6 rounded-3xl border border-slate-800 transition-all duration-500 shadow-xl ${isCompleted ? 'opacity-30 grayscale' : 'hover:border-orange-500/50 hover:bg-slate-900 group'}`}>
            <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-0.5 bg-orange-600/10 text-orange-500 text-[8px] font-black rounded uppercase tracking-[0.2em] border border-orange-500/20">
                    +{suggestion.impact}% Yield
                </span>
                <div className="flex gap-1">
                    {[1, 2, 3].map((bar) => (
                        <div
                            key={bar}
                            className={`w-1 h-3 rounded-full transition-colors ${bar <= suggestion.effort ? 'bg-orange-500' : 'bg-slate-800'}`}
                        />
                    ))}
                </div>
            </div>

            <h4 className="font-black text-white text-sm uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors">{suggestion.title}</h4>
            <p className="text-[10px] text-slate-500 mb-6 leading-relaxed font-medium uppercase tracking-tight">
                {suggestion.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="text-[8px] text-slate-600 font-black uppercase tracking-widest">
                    Complexity: {suggestion.effort === 1 ? 'LOW' : suggestion.effort === 2 ? 'MID' : 'HIGH'}
                </div>
                {!isCompleted ? (
                    <button
                        onClick={handleComplete}
                        className="text-[10px] font-black text-orange-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                        Execute <ArrowRight className="w-3 h-3" />
                    </button>
                ) : (
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified</span>
                )}
            </div>
        </div>
    );
}

export default function OptimizationPanel() {
    const [completedCount, setCompletedCount] = useState(0);

    const mockSuggestions: Recommendation[] = [
        // Quick Wins
        {
            id: 'qw-1',
            title: 'Milestone Granularity',
            description: 'Deconstruct your request into 3 verifiable phases for 15% higher resonance.',
            impact: 15,
            effort: 1,
            type: 'proposer',
            category: 'content'
        },
        {
            id: 'qw-2',
            title: 'Consensus Engagement',
            description: 'Respond to community queries within 4 hours to manifest 10% more trust.',
            impact: 10,
            effort: 1,
            type: 'proposer',
            category: 'engagement'
        },
        // Strategic
        {
            id: 'st-1',
            title: 'Advocate Outreach',
            description: 'Synchronize with 5 top-tier voters in your category to validate technical specs.',
            impact: 25,
            effort: 2,
            type: 'proposer',
            category: 'strategy'
        },
        {
            id: 'st-2',
            title: 'Syntactic Polish',
            description: 'Pivot to action-oriented titles to increase visibility by 12% in the live feed.',
            impact: 12,
            effort: 2,
            type: 'proposer',
            category: 'content'
        },
        // Long-term
        {
            id: 'lt-1',
            title: 'Reputation Mining',
            description: 'Accumulate 20+ successful votes to reach Sovereign status (+40% voting weight).',
            impact: 40,
            effort: 3,
            type: 'voter',
            category: 'engagement'
        }
    ];

    const handleComplete = () => {
        setCompletedCount(prev => prev + 1);
    };

    const sections = [
        { title: '⚡ Fast-Track Wins', items: mockSuggestions.filter(s => s.effort === 1) },
        { title: '🎯 Strategic Pivots', items: mockSuggestions.filter(s => s.effort === 2) },
        { title: '🏔️ Long-Term Sovereignty', items: mockSuggestions.filter(s => s.effort === 3) }
    ];

    return (
        <div className="space-y-12">
            {/* Progress Header */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Optimization Hub</h2>
                        <p className="text-orange-100/60 font-medium uppercase tracking-tight text-sm">Fine-tuning your trajectory for maximum platform resonance.</p>
                    </div>
                    <div className="text-center md:text-right">
                        <div className="text-6xl font-black tabular-nums">{completedCount}<span className="text-2xl text-orange-300/50">/{mockSuggestions.length}</span></div>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Tasks Manifested</div>
                    </div>
                </div>
                <div className="mt-8 w-full bg-black/20 rounded-full h-2 overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / mockSuggestions.length) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-white h-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    />
                </div>
            </div>

            {sections.map((section) => (
                <section key={section.title}>
                    <div className="flex items-center gap-6 mb-8">
                        <h3 className="text-lg font-black text-white uppercase tracking-widest">{section.title}</h3>
                        <div className="h-px flex-1 bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {section.items.map((suggestion) => (
                            <SuggestionCard
                                key={suggestion.id}
                                suggestion={suggestion}
                                onComplete={handleComplete}
                            />
                        ))}
                    </div>
                </section>
            ))}

            {/* Why This Helps */}
            <div className="p-10 bg-slate-900 border border-slate-800 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Zap className="w-32 h-32 text-orange-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
                    <Target className="w-5 h-5 text-orange-500" />
                    Sovereign Game Theory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h4 className="font-black text-[10px] text-orange-500 uppercase tracking-widest">Behavioral Dynamics</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                            Consensus reach increases by 40% when milestones are granular. Verification reduces perceived risk and mental load for the collective.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black text-[10px] text-orange-500 uppercase tracking-widest">Social Legitimacy</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                            Reactive engagement manifests trust. Rapid response cycles in the first 6 hours yield a 2x increase in affirmative voting velocity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
