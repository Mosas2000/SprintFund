'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Twitter, MessageCircle, Link, Download, Share2 } from 'lucide-react';

interface SocialShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposal: {
        title: string;
        category: string;
        amount: string;
    };
}

export default function SocialShareModal({ isOpen, onClose, proposal }: SocialShareModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] w-[calc(100%-2rem)] max-w-xl"
                    >
                        <div className="bg-slate-900 border border-white/20 rounded-[48px] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Share2 className="w-5 h-5 text-orange-500" />
                                    <h3 className="text-xl font-black uppercase tracking-tight text-white leading-tight">Amplify Proposal</h3>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-10">
                                {/* Meta Card Preview */}
                                <div className="aspect-[1.91/1] w-full rounded-[32px] bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 p-10 flex flex-col justify-between mb-10 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                        <Share2 className="w-64 h-64 text-orange-600" />
                                    </div>

                                    <div className="relative z-10 flex justify-between items-start">
                                        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                            <Share2 className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                                            <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest leading-none">SprintFund Verified</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
                                            {proposal.title}
                                        </h4>
                                        <div className="flex gap-4">
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{proposal.category}</span>
                                            <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.2em]">{proposal.amount} STX GRANT</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { name: 'Twitter', icon: Twitter, color: 'hover:bg-sky-500' },
                                        { name: 'Discord', icon: MessageCircle, color: 'hover:bg-indigo-500' },
                                        { name: 'Copy Link', icon: Link, color: 'hover:bg-slate-700' },
                                        { name: 'Download', icon: Download, color: 'hover:bg-orange-600' },
                                    ].map((item) => (
                                        <button
                                            key={item.name}
                                            className={`flex flex-col items-center gap-3 p-5 bg-white/5 border border-white/5 rounded-[24px] transition-all group ${item.color} hover:border-transparent hover:scale-105`}
                                        >
                                            <item.icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white transition-colors">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
