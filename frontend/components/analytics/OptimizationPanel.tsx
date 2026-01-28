'use client';

import { useState } from 'react';
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
        <div className={`bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 transition shadow-sm ${isCompleted ? 'opacity-50 grayscale' : 'hover:border-blue-500'}`}>
            <div className="flex justify-between items-start mb-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">
                    +{suggestion.impact}% Impact
                </span>
                <div className="flex gap-0.5">
                    {[1, 2, 3].map((bar) => (
                        <div
                            key={bar}
                            className={`w-1.5 h-3 rounded-full ${bar <= suggestion.effort ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        />
                    ))}
                </div>
            </div>

            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{suggestion.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-snug">
                {suggestion.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="text-[10px] text-gray-400 font-medium">
                    EST. TIME: {suggestion.effort === 1 ? '5-10m' : suggestion.effort === 2 ? '1-2h' : '2-3d'}
                </div>
                {!isCompleted ? (
                    <button
                        onClick={handleComplete}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                    >
                        Take Action →
                    </button>
                ) : (
                    <span className="text-xs font-bold text-green-600">✓ Completed</span>
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
            title: 'Clarify Funding Milestones',
            description: 'Break down your 150 STX request into 3 clear deliverables (+15% success chance).',
            impact: 15,
            effort: 1,
            type: 'proposer',
            category: 'content'
        },
        {
            id: 'qw-2',
            title: 'Engage in Comments',
            description: 'Respond to at least 2 questions in the comment section within 4 hours of submission (+10% visibility).',
            impact: 10,
            effort: 1,
            type: 'proposer',
            category: 'engagement'
        },
        // Strategic
        {
            id: 'st-1',
            title: 'Network Outreach',
            description: 'Direct message 5 top-tier voters in the DeFi category to request a review of your tech stack.',
            impact: 25,
            effort: 2,
            type: 'proposer',
            category: 'strategy'
        },
        {
            id: 'st-2',
            title: 'A/B Test Title',
            description: 'Switch to a more action-oriented title like "Scaling DeFi Liquidity" vs "Liquidity Proposal".',
            impact: 12,
            effort: 2,
            type: 'proposer',
            category: 'content'
        },
        // Long-term
        {
            id: 'lt-1',
            title: 'Reputation Mining',
            description: 'Participate in 20+ successful votes this quarter to reach "Community Champion" status.',
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
        { title: '⚡ Quick Wins', items: mockSuggestions.filter(s => s.effort === 1) },
        { title: '🎯 Strategic Improvements', items: mockSuggestions.filter(s => s.effort === 2) },
        { title: '🏔️ Long-term Growth', items: mockSuggestions.filter(s => s.effort === 3) }
    ];

    return (
        <div className="space-y-8">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Optimization Hub</h2>
                        <p className="text-blue-100/80 font-medium">Fine-tune your strategy for maximum platform impact.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black">{completedCount}/{mockSuggestions.length}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Tasks Completed</div>
                    </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-white h-full transition-all duration-700 ease-out"
                        style={{ width: `${(completedCount / mockSuggestions.length) * 100}%` }}
                    />
                </div>
            </div>

            {sections.map((section) => (
                <section key={section.title}>
                    <div className="flex items-center gap-4 mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{section.title}</h3>
                        <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span>📚</span> Why these optimizations work
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">Behavioral Economics</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Voters are 40% more likely to approve proposals with clear milestones as it reduces perceived risk and mental load.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400">Social Proof</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Active engagement in comments builds trust. Proposers who respond within the first 6 hours see 2x more YES votes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
