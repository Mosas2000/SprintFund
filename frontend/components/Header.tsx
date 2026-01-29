'use client';

import React from 'react';
import Link from 'next/link';
import Navigation from './Navigation';
import NotificationHub from './NotificationHub';
import DarkModeToggle from './DarkModeToggle';
import { Sparkles } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
            <div className="flex items-center gap-6 p-2 bg-white/5 dark:bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl pointer-events-auto">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 px-4 py-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-900/40 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-sm font-black uppercase tracking-tighter text-white">SprintFund</h1>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Micro-Grant DAO</p>
                    </div>
                </Link>

                <div className="h-8 w-[1px] bg-white/10" />

                {/* Navigation Section */}
                <Navigation />

                <div className="h-8 w-[1px] bg-white/10" />

                {/* Actions Section */}
                <div className="flex items-center gap-2 px-2">
                    <NotificationHub />
                    <DarkModeToggle />

                    <button className="ml-2 px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5">
                        Connect
                    </button>
                </div>
            </div>
        </header>
    );
}
