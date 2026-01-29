'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertTriangle, Zap } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'governance';
    timestamp: Date;
    read: boolean;
}

export default function NotificationHub() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Proposal Funded',
            message: 'Your proposal "Stacks Wallet Integration" has reached the funding threshold!',
            type: 'success',
            timestamp: new Date(),
            read: false
        },
        {
            id: '2',
            title: 'New Governance Vote',
            message: 'A new platform-wide vote on Treasury Allocation is live.',
            type: 'governance',
            timestamp: new Date(Date.now() - 3600000),
            read: false
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const removeNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
                <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10, x: -10 }}
                            className="absolute right-0 mt-4 w-96 z-50 overflow-hidden bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white">Notifications</h3>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{unreadCount} Unread</span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <Zap className="w-8 h-8 text-slate-700 mx-auto mb-4" />
                                        <p className="text-xs font-bold text-slate-500 uppercase">All caught up!</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <motion.div
                                            key={n.id}
                                            initial={{ backgroundColor: 'transparent' }}
                                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                            className={`p-6 border-b border-white/5 transition-colors relative group ${!n.read ? 'bg-orange-600/5' : ''}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`mt-1 shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${n.type === 'success' ? 'bg-green-500/10 text-green-500' :
                                                        n.type === 'governance' ? 'bg-orange-500/10 text-orange-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {n.type === 'success' ? <Check className="w-4 h-4" /> :
                                                        n.type === 'governance' ? <Zap className="w-4 h-4" /> :
                                                            <Info className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-xs font-black text-white uppercase tracking-tight">{n.title}</h4>
                                                        <span className="text-[9px] font-bold text-slate-500 uppercase whitespace-nowrap">
                                                            {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-3">
                                                        {n.message}
                                                    </p>
                                                    <div className="flex gap-3">
                                                        {!n.read && (
                                                            <button
                                                                onClick={() => markAsRead(n.id)}
                                                                className="text-[9px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => removeNotification(n.id)}
                                                            className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && (
                                <button
                                    onClick={() => setNotifications([])}
                                    className="w-full p-4 bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors border-t border-white/5"
                                >
                                    Clear all notifications
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
