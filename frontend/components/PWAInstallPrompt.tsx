'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Only show if the app isn't already installed (simulated check)
        const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
        const hasPrompted = localStorage.getItem('sprintfund_pwa_prompted');

        if (!isStandalone && !hasPrompted) {
            const timer = setTimeout(() => setShow(true), 5000); // Show after 5s
            return () => clearTimeout(timer);
        }
    }, []);

    const dismiss = () => {
        setShow(false);
        localStorage.setItem('sprintfund_pwa_prompted', 'true');
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
                >
                    <div className="p-6 bg-slate-900/90 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl shadow-orange-950/20 ring-1 ring-white/10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/40">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <button
                                onClick={dismiss}
                                className="p-2 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Install SprintFund</h3>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter leading-relaxed mb-6">
                            Access the DAO faster with zero browser chrome. Supports offline metrics and instant alerts.
                        </p>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-3 h-3" />
                                INSTALL NOW
                            </button>
                            <button
                                onClick={dismiss}
                                className="px-6 py-4 bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-all"
                            >
                                LATER
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">Certified PWA Compliant</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
