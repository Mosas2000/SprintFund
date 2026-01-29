'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, AlertTriangle, ArrowLeft, Shield } from 'lucide-react';

export default function ProposalRevocation() {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Retraction Protocol</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Rescind proposal prior to block finalization</p>
                </div>
                <RotateCcw className={`w-8 h-8 text-red-600 ${isConfirming ? 'animate-spin' : ''}`} />
            </div>

            {!isConfirming ? (
                <>
                    <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-tighter">
                        You can revoke your proposal within 10 blocks of submission. This will return the gas deposit and remove the draft from the public index.
                    </p>
                    <button
                        onClick={() => setIsConfirming(true)}
                        className="w-full py-5 bg-red-600/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                    >
                        INITIATE REVOCATION
                    </button>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <div className="p-6 bg-red-600/5 border border-red-600/20 rounded-[28px] flex gap-4">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                        <p className="text-[11px] font-black text-red-600 uppercase tracking-tighter leading-relaxed">
                            CRITICAL: THIS ACTION IS IRREVERSIBLE. THE ATTACHED 2.5 STX DEPOSIT WILL BE RETURNED MINUS NETWORK FEES.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            className="flex-1 py-5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-950/40"
                        >
                            CONFIRM ABORT
                        </button>
                        <button
                            onClick={() => setIsConfirming(false)}
                            className="px-8 py-5 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
                        >
                            CANCEL
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
