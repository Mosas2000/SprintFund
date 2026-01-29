'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Server, Globe } from 'lucide-react';

export default function NetworkStatus() {
    const [latency, setLatency] = useState(42);
    const [gasPrice, setGasPrice] = useState(0.0015);
    const [status, setStatus] = useState<'optimal' | 'congested'>('optimal');

    useEffect(() => {
        const interval = setInterval(() => {
            setLatency(30 + Math.floor(Math.random() * 50));
            setGasPrice(0.001 + (Math.random() * 0.002));
            setStatus(Math.random() > 0.8 ? 'congested' : 'optimal');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-6 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${status === 'optimal' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-orange-500 animate-pulse animate-pulse'}`} />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Stacks Mainnet</span>
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <div className="flex items-center gap-2 group cursor-help">
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase leading-none mb-0.5">Gas Price</span>
                    <span className="text-[10px] font-black text-white leading-none">{gasPrice.toFixed(4)} STX</span>
                </div>
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-500 uppercase leading-none mb-0.5">Latency</span>
                    <span className="text-[10px] font-black text-white leading-none">{latency}ms</span>
                </div>
            </div>
        </div>
    );
}
