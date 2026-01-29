'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Shield, Heart, TrendingUp, Users } from 'lucide-react';

const badges = [
    { id: '1', title: 'Genesis Voter', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10', unlocked: true, desc: 'Participated in the first 100 votes.' },
    { id: '2', title: 'Power Proposer', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', unlocked: true, desc: 'Had 3+ proposals successfully funded.' },
    { id: '3', title: 'Guardian', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10', unlocked: false, desc: 'Successfully flagged 5 spam proposals.' },
    { id: '4', title: 'Trendsetter', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10', unlocked: true, desc: 'Voted on a proposal that grew 10x.' },
    { id: '5', title: 'Community Hero', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', unlocked: false, desc: 'Delegate for over 50 users.' },
];

export default function BadgeGallery() {
    return (
        <div className="p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">Impact Achievements</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Recognizing your contributions to the DAO</p>
                </div>
                <Award className="w-10 h-10 text-orange-500/50" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`p-6 rounded-[28px] border transition-all text-center group cursor-help ${badge.unlocked ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/20 border-white/5 opacity-40 grayscale'
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl ${badge.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                <Icon className={`w-7 h-7 ${badge.color}`} />
                            </div>
                            <h4 className="text-xs font-black text-white uppercase tracking-tighter mb-1">{badge.title}</h4>
                            <p className="text-[9px] font-medium text-slate-500 leading-tight">
                                {badge.desc}
                            </p>

                            {!badge.unlocked && (
                                <div className="mt-4 px-2 py-1 bg-black/40 rounded-lg">
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Locked</p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
