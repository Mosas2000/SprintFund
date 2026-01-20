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
        <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-white font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments ({comments.length})
            </h4>

            {/* Comment Form */}
            {userAddress ? (
                <form onSubmit={handleSubmit} className="mb-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                        rows={3}
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="mt-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post Comment
                    </button>
                </form>
            ) : (
                <p className="text-purple-300 text-sm mb-4">Connect your wallet to comment</p>
            )}

            {/* Comments List */}
            <div className="space-y-3">
                {comments.length === 0 ? (
                    <p className="text-purple-300 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            {comment.author.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">{shortenAddress(comment.author)}</p>
                                        <p className="text-purple-300 text-xs">{formatTime(comment.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-purple-100 text-sm">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
