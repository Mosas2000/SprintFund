'use client';

import React from 'react';
import Header from '@/components/Header';
import BadgeGallery from '@/components/common/BadgeGallery';
import InterestProfiler from '@/components/InterestProfiler';
import DelegationStats from '@/components/DelegationStats';
import UserDashboard from '@/components/dashboard/UserDashboard';
import { Settings, LogOut, Wallet } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-transparent">
            <Header />

            <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
                        <div className="relative group flex h-24 w-24 items-center justify-center rounded-[32px] bg-gradient-to-br from-orange-600 to-orange-500 text-3xl font-black text-white shadow-2xl sm:h-32 sm:w-32 sm:rounded-[40px] sm:text-4xl">
                            SP
                            <div className="absolute inset-0 rounded-[32px] border border-white/20 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100 sm:rounded-[40px]" />
                        </div>
                        <div>
                            <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-white sm:text-5xl">
                                Sprint Citizen
                            </h2>
                            <div className="flex items-center gap-3">
                                <Wallet className="w-4 h-4 text-slate-500" />
                                <p className="text-sm font-bold uppercase tracking-widest leading-relaxed text-slate-500">
                                    SP12...ABCD
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                        <button className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-400 transition-all hover:bg-white/10 hover:text-white">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button className="flex items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-600/10 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-600 hover:text-white sm:px-8">
                            <LogOut className="w-4 h-4" />
                            Disconnect
                        </button>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <DelegationStats />
                    </div>
                    <div className="lg:col-span-2">
                        <BadgeGallery />
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <InterestProfiler />
                    <UserDashboard />
                </div>
            </main>
        </div>
    );
}
