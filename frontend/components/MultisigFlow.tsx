'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, Clock, UserCheck, AlertTriangle } from 'lucide-react';

const signers = [
    { id: '1', name: 'Treasury Guardian', status: 'signed', address: 'SP12...ABCD' },
    { id: '2', name: 'Technical Auditor', status: 'signed', address: 'SP34...EFGH' },
    { id: '3', name: 'Community Liaison', status: 'pending', address: 'SP56...IJKL' },
];

export default function MultisigFlow() {
    const signedCount = signers.filter(s => s.status === 'signed').length;
    const isComplete = signedCount === signers.length;

    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Execution Guard</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">2/3 Multi-signature verification required</p>
                </div>
                <Shield className="w-8 h-8 text-orange-600" />
            </div>

            <div className="space-y-6 mb-10">
                {signers.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-4 group">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${s.status === 'signed' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-slate-950 border-white/5 text-slate-600'
                            }`}>
                            {s.status === 'signed' ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-xs font-black text-white uppercase">{s.name}</h4>
                                <span className={`text-[8px] font-black uppercase ${s.status === 'signed' ? 'text-green-500' : 'text-slate-600'}`}>{s.status}</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{s.address}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-orange-600/5 border border-orange-500/20 rounded-[28px]">
                <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-4 h-4 text-orange-500" />
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Awaiting Finalization</h5>
                </div>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-tighter">
                    Funding is currently locked in escrow. <span className="text-white font-black">1 additional signature</span> from the Community Liaison is required to release 450 STX.
                </p>
            </div>
        </div>
    );
}
