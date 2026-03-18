'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Shield, Zap, Copy, ArrowRight } from 'lucide-react';

const endpoints = [
    { method: 'GET', path: '/api/v1/proposals', desc: 'List all active micro-grants' },
    { method: 'GET', path: '/api/v1/stats', desc: 'Platform-wide treasury and voting metrics' },
    { method: 'GET', path: '/api/v1/users/:address', desc: 'Full reputation and history for a given wallet' },
    { method: 'POST', path: '/api/v1/simulate', desc: 'Dry-run a quadratic voting interaction' },
];

export default function ApiDocs() {
    return (
        <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                <div className="max-w-xl">
                    <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">Open Data Protocol</h2>
                    <p className="text-xl font-medium text-slate-400 uppercase tracking-tighter leading-relaxed">
                        SprintFund believes in radical transparency. Every interaction is indexed and available via our high-performance REST API.
                    </p>
                </div>
                <div className="p-8 bg-orange-600 rounded-[32px] text-white shadow-2xl shadow-orange-900/40">
                    <Zap className="w-10 h-10 mb-4 fill-current" />
                    <h3 className="text-xl font-black uppercase mb-1">Quick Start</h3>
                    <p className="text-[10px] font-bold uppercase opacity-80 mb-6">Authorize your terminal session</p>
                    <code className="block bg-black/20 p-4 rounded-xl font-mono text-xs mb-6">
                        curl -H "X-API-KEY: demo" https://api.sprintfund.xyz/v1/stats
                    </code>
                    <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all">
                        Generate Production Key
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {endpoints.map((e, i) => (
                    <motion.div
                        key={e.path}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] group transition-all hover:bg-slate-900/80"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${e.method === 'GET' ? 'bg-blue-600/10 text-blue-500' : 'bg-orange-600/10 text-orange-500'
                                    }`}>{e.method}</span>
                                <code className="text-xs font-black text-white">{e.path}</code>
                            </div>
                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm font-medium text-slate-400 mb-8 italic">
                            "{e.desc}"
                        </p>

                        <div className="p-6 bg-black/40 rounded-3xl border border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal className="w-3 h-3 text-slate-600" />
                                <span className="text-[9px] font-black text-slate-600 uppercase">Response Shape</span>
                            </div>
                            <pre className="text-[10px] font-mono text-slate-500 overflow-x-auto">
                                {`{
  "status": "success",
  "data": [...],
  "timestamp": ${Date.now()}
}`}
                            </pre>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
