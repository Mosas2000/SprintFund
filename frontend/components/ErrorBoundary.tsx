'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 selection:bg-orange-500/30">
                    <div className="bg-slate-900 border border-white/10 rounded-[48px] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <svg className="w-64 h-64 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.3L19.5 20H4.5L12 5.3zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" /></svg>
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-red-600/10 border border-red-500/30 rounded-3xl flex items-center justify-center mb-8">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-4">System Anomaly</h2>
                            <p className="text-lg font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-tighter">
                                An unhandled exception was captured. The automated protocol suggests a manual terminal restart.
                            </p>

                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 mb-10 font-mono">
                                <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-3">Diagnostic Log</p>
                                <p className="text-xs text-red-400 break-all leading-loose">
                                    {this.state.error?.name}: {this.state.error?.message}
                                </p>
                                <p className="text-[9px] text-slate-700 mt-4 uppercase">Capture Time: {new Date().toISOString()}</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-xl shadow-white/5"
                                >
                                    RESTART SESSION
                                </button>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-8 py-5 bg-white/5 text-slate-300 text-xs font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white/10 transition-all border border-white/10"
                                >
                                    ABORT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
