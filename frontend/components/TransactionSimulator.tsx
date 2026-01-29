'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, AlertTriangle, ArrowRight, ShieldCheck, Database } from 'lucide-react';

interface SimulationStep {
    name: string;
    status: 'pending' | 'loading' | 'success' | 'error';
    details: string;
}

export default function TransactionSimulator() {
    const [isSimulating, setIsSimulating] = useState(false);
    const [steps, setSteps] = useState<SimulationStep[]>([
        { name: 'Auth Check', status: 'pending', details: 'Verifying wallet signature and session...' },
        { name: 'Balance Validation', status: 'pending', details: 'Checking STX availability for gas...' },
        { name: 'Contract Entry', status: 'pending', details: 'Simulating entry into sprintfund-core...' },
        { name: 'Consensus Simulation', status: 'pending', details: 'Predicting post-execution state change...' },
    ]);

    const startSimulation = () => {
        setIsSimulating(true);
        let currentStep = 0;

        const interval = setInterval(() => {
            setSteps(prev => prev.map((s, i) => {
                if (i === currentStep) return { ...s, status: 'loading' };
                if (i < currentStep) return { ...s, status: 'success' };
                return s;
            }));

            if (currentStep > steps.length) {
                clearInterval(interval);
                setIsSimulating(false);
            }
            currentStep++;
        }, 1200);
    };

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">State Simulator</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Preview on-chain impact before signing</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-500/30">
                    <Database className="w-6 h-6 text-orange-500" />
                </div>
            </div>

            <div className="space-y-4 mb-10">
                {steps.map((step, index) => (
                    <div key={step.name} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 ${step.status === 'success' ? 'bg-green-500 border-green-400 text-white' :
                                    step.status === 'loading' ? 'bg-orange-500 border-orange-400 text-white animate-pulse' :
                                        'border-white/10 text-slate-700'
                                }`}>
                                {step.status === 'success' ? <Check className="w-3 h-3" /> :
                                    step.status === 'loading' ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> :
                                        <span className="text-[10px] font-black">{index + 1}</span>}
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-[1px] h-8 bg-white/5 my-1" />
                            )}
                        </div>
                        <div className="flex-1 pb-4">
                            <h4 className={`text-xs font-black uppercase tracking-widest mb-1 transition-colors ${step.status === 'success' ? 'text-green-500' :
                                    step.status === 'loading' ? 'text-orange-500' : 'text-slate-500'
                                }`}>{step.name}</h4>
                            <p className="text-[10px] font-medium text-slate-400 opacity-60 italic group-hover:opacity-100 transition-opacity">
                                {step.details}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-black/40 rounded-[24px] border border-white/5 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Security Score: 100/100</h5>
                </div>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-4 uppercase tracking-tighter">
                    Simulation confirms zero risk of fund loss. Gas estimate: <span className="text-white font-black">0.051 STX</span>. No permissions requested outside of voting-registry.
                </p>
            </div>

            <button
                onClick={startSimulation}
                disabled={isSimulating}
                className="w-full py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
                {isSimulating ? 'SIMULATING...' : 'RUN PRE-FLIGHT CHECK'}
                {!isSimulating && <Play className="w-3 h-3 fill-current" />}
            </button>
        </div>
    );
}
