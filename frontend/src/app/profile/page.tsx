'use client';

import React from 'react';
import Header from '@/components/Header';
import BadgeGallery from '@/components/BadgeGallery';
import InterestProfiler from '@/components/InterestProfiler';
import DelegationStats from '@/components/DelegationStats';
import UserDashboard from '@/components/UserDashboard';
import { motion } from 'framer-motion';
import { Settings, LogOut, Wallet } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-transparent">
            <Header />

            <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                    <div className="flex items-center gap-8">
                        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl relative group">
                            SP
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px] border border-white/20" />
                        </div>
                        <div>
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2">Sprint Citizen</h2>
                            <div className="flex items-center gap-3">
                                <Wallet className="w-4 h-4 text-slate-500" />
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                    SP12...ABCD
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-slate-400 hover:text-white">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center gap-3 px-8 py-4 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                            <LogOut className="w-4 h-4" />
                            Disconnect
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1">
                        <DelegationStats />
                    </div>
                    <div className="lg:col-span-2">
                        <BadgeGallery />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <InterestProfiler />
                    <UserDashboard />
                </div>
            </main>
        </div>
    );
}
