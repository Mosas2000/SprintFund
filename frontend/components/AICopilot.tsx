'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../utils/aiService';
import { Proposal } from '../types/governance';

interface AICopilotProps {
    proposal: Proposal;
}

export default function AICopilot({ proposal }: AICopilotProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const startAnalysis = async () => {
        setIsAnalyzing(true);
        const result = await aiService.summarizeProposal(proposal);
        setAnalysis(result);
        setIsAnalyzing(false);
    };

    return (
        <div className="p-6 rounded-xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">AI Governance Co-pilot</h3>
                        <p className="text-xs text-slate-400">Strategic Intelligence Layer</p>
                    </div>
                </div>
                <button
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                >
                    {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {analysis ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                            "{analysis}"
                        </p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Resonance</p>
                                <p className="text-lg font-bold text-green-400">92%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Complexity</p>
                                <p className="text-lg font-bold text-orange-400">Medium</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Risk</p>
                                <p className="text-lg font-bold text-slate-400">Low</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-24 flex items-center justify-center border border-dashed border-white/10 rounded-lg">
                        <p className="text-sm text-slate-500">Click to run strategic scan...</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
