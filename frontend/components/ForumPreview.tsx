'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Clock, ArrowRight, TrendingUp } from 'lucide-react';

const threads = [
    { id: '1', title: 'Should we introduce a 1.5x matching multiplier for Education?', author: 'Mosa', replies: 45, activity: '2 mins ago' },
    { id: '2', title: 'Proposal: Standardizing Technical Spec requirements for Grants', author: 'Stark', replies: 28, activity: '15 mins ago' },
    { id: '3', title: 'Community Call #4: Roadmap for Q1 2024', author: 'Alice', replies: 12, activity: '1 hour ago' },
];

export default function ForumPreview() {
    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">Ecosystem Forum</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Debating the future of micro-grants</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/10 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Active</span>
                </div>
            </div>

            <div className="space-y-4">
                {threads.map((t, i) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 bg-white/5 border border-white/5 hover:border-white/10 rounded-3xl transition-all group cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xs font-black text-white uppercase tracking-tight leading-tight group-hover:text-orange-500 transition-colors flex-1 pr-4">
                                {t.title}
                            </h4>
                            <div className="flex items-center gap-2 shrink-0">
                                <MessageSquare className="w-3 h-3 text-slate-600" />
                                <span className="text-[10px] font-black text-slate-600">{t.replies}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-lg bg-orange-600/20 flex items-center justify-center text-[8px] font-black text-orange-500 uppercase">
                                    {t.author.charAt(0)}
                                </div>
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{t.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-slate-700" />
                                <span className="text-[9px] font-bold text-slate-700 uppercase">{t.activity}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all group border border-white/5">
                Contribute to Forum
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
