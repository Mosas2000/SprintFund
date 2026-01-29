'use client';

import { useState, useEffect } from 'react';

interface Comment {
    id: string;
    proposalId: number;
    author: string;
    text: string;
    timestamp: number;
}

interface CommentsProps {
    proposalId: number;
    userAddress?: string;
}

export default function Comments({ proposalId, userAddress }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [proposalId]);

    const loadComments = () => {
        const stored = localStorage.getItem(`comments-${proposalId}`);
        if (stored) {
            setComments(JSON.parse(stored));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newComment.trim() || !userAddress) return;

        setIsSubmitting(true);

        const comment: Comment = {
            id: Date.now().toString(),
            proposalId,
            author: userAddress,
            text: newComment.trim(),
            timestamp: Date.now(),
        };

        const updated = [...comments, comment];
        setComments(updated);
        localStorage.setItem(`comments-${proposalId}`, JSON.stringify(updated));
        setNewComment('');
        setIsSubmitting(false);
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="mt-12 pt-12 border-t border-white/10">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-600/10 flex items-center justify-center border border-orange-500/30">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-white leading-tight">Public Discourse</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{comments.length} Registered Opinions</p>
                    </div>
                </div>
            </div>

            {/* Comment Form */}
            {userAddress ? (
                <form onSubmit={handleSubmit} className="mb-12 relative group">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Contribute to the governance dialogue..."
                        className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-[24px] text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 transition-all resize-none font-medium text-sm leading-relaxed"
                        rows={4}
                        disabled={isSubmitting}
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-600 uppercase uppercase">{newComment.length}/500</span>
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all disabled:opacity-20 shadow-xl"
                        >
                            ENACT COMMENT
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-12 p-8 bg-orange-500/5 border border-dashed border-orange-500/20 rounded-[32px] text-center">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest">Connect Identity to Participate</p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <div className="py-20 text-center opacity-30">
                        <svg className="w-12 h-12 mx-auto mb-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No discourse recorded yet</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.08] transition-all group relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center text-xs font-black text-orange-500 uppercase">
                                        {comment.author.slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">
                                            {shortenAddress(comment.author)}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{formatTime(comment.timestamp)}</span>
                                            <span className="text-[8px] font-black text-slate-700">|</span>
                                            <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em]">Reputation 4.9+</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-xl text-slate-600 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                                </button>
                            </div>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic border-l-2 border-orange-500/30 pl-6">
                                "{comment.text}"
                            </p>

                            <div className="mt-6 flex items-center gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                <button className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 10h4.708c.83 0 1.258 1.05.672 1.636L12 19l-7.38-7.364C4.034 11.05 4.462 10 5.292 10H10V3h4v7z" /></svg>
                                    Endorse
                                </button>
                                <button className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                    Reply
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
