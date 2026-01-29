'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Home, Sparkles, LayoutGrid } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Launchpad', icon: Home },
    { href: '/analytics', label: 'Ecosystem', icon: BarChart3 },
    { href: '/proposals', label: 'Governance', icon: LayoutGrid },
    { href: '/profile', label: 'Identity', icon: Sparkles },
  ];

  return (
    <nav className="flex items-center p-1 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl relative">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-100'
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl shadow-lg shadow-orange-900/40"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <div className="relative z-10 flex items-center gap-2">
              <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
