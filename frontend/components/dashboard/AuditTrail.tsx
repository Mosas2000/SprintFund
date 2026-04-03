'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Info, AlertCircle, ExternalLink } from 'lucide-react';

const auditLogs = [
    { id: '1', action: 'CONTRACT_CALL', user: 'SP12...ABCD', detail: 'Vote submitted for Proposal #482', timestamp: '2 mins ago', severity: 'info' },
    { id: '2', action: 'EMERGENCY_PAUSE', user: 'DAO_MULTISIG', detail: 'Withdrawals paused for scheduled maintenance', timestamp: '1 hour ago', severity: 'warning' },
    { id: '3', action: 'TREASURY_TRANSFER', user: 'CONTRACT_AUTO', detail: '450 STX released to Milestone #1', timestamp: '4 hours ago', severity: 'success' },
    { id: '4', action: 'POLICY_UPDATE', user: 'DAO_VOTE_82', detail: 'Quadratic multiplier adjusted to 1.5x', timestamp: '1 day ago', severity: 'info' },
];

export default function AuditTrail() {
    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Audit Trail</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Verifiable log of platform-critical actions</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/30">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                </div>
            </div>

            <div className="space-y-4">
                {auditLogs.map((log, i) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors group cursor-crosshair"
                    >
                        <div className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${log.severity === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                log.severity === 'success' ? 'bg-green-500/10 text-green-500' :
                                    'bg-blue-500/10 text-blue-500'
                            }`}>
                            {log.severity === 'warning' ? <AlertCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white underline decoration-blue-500/50 underline-offset-4">{log.action}</span>
                                <span className="text-[9px] font-bold text-slate-600 uppercase">{log.timestamp}</span>
                            </div>
                            <p className="text-xs font-medium text-slate-400 mb-2 leading-relaxed">
                                {log.detail}
                            </p>
                            <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-slate-600" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{log.user}</span>
                                <ExternalLink className="w-2.5 h-2.5 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all rounded-2xl border border-white/5">
                LOAD HISTORICAL ARCHIVE (TX_EXPLORER)
            </button>
        </div>
    );
}
