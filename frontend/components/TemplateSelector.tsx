'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layout, Palette, Terminal, Globe, Zap } from 'lucide-react';

const templates = [
    { id: 'tech', name: 'Open Source Tooling', icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'design', name: 'UI/UX Enhancement', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { id: 'infra', name: 'Network Infrastructure', icon: Terminal, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'community', name: 'Community Outreach', icon: Globe, color: 'text-green-500', bg: 'bg-green-500/10' },
];

interface TemplateSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedId === t.id;

                return (
                    <motion.button
                        key={t.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(t.id)}
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-3 h-full ${isSelected ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-900/40' : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20' : t.bg}`}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : t.color}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-[10px] font-black uppercase tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-slate-100'}`}>
                                {t.name}
                            </h4>
                            <p className={`text-[8px] font-bold uppercase mt-1 ${isSelected ? 'text-orange-200' : 'text-slate-500'}`}>
                                Standard Template
                            </p>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
