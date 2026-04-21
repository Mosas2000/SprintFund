'use client';

import { useState } from 'react';
import { DiscussionComment } from './DiscussionComment';
import { CommentInput } from './CommentInput';
import { useProposalDiscussion } from '@/hooks/useProposalDiscussion';
import { MessageCircle } from 'lucide-react';
import type { ProposalDiscussionComment } from '@/types/proposal-detail';

interface ProposalDiscussionSectionProps {
  proposalId: string;
}

export function ProposalDiscussionSection({ proposalId }: ProposalDiscussionSectionProps) {
  const { thread, addComment, addReply, deleteComment } = useProposalDiscussion(proposalId);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'likes'>('recent');

  const handleAddComment = async (content: string) => {
    setLoading(true);
    try {
      addComment(content);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (content: string) => {
    if (!replyingTo) return;
    setLoading(true);
    try {
      addReply(replyingTo, content);
      setReplyingTo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Delete this comment?')) {
      deleteComment(commentId);
    }
  };

  const sortComments = (comments: ProposalDiscussionComment[]): ProposalDiscussionComment[] => {
    const sorted = [...comments];
    switch (sortBy) {
      case 'oldest':
        return sorted.reverse();
      case 'likes':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'recent':
      default:
        return sorted;
    }
  };

  if (!thread) {
    return <div>Loading discussion...</div>;
  }

  const sortedComments = sortComments(thread.comments);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white sm:text-2xl">Discussion</h2>
        <span className="text-sm text-white/60">({thread.totalComments} comments)</span>
      </div>

      <CommentInput
        proposalId={proposalId}
        onSubmit={handleAddComment}
        loading={loading}
      />

      {sortedComments.length > 0 && (
        <>
          <div className="flex flex-col gap-3 border-b border-white/10 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-white/60">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              {(['recent', 'oldest', 'likes'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`rounded px-3 py-2 text-sm transition-colors ${
                    sortBy === option
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <div key={comment.id}>
                <DiscussionComment
                  comment={comment}
                  proposalId={proposalId}
                  onReplyClick={(commentId) => setReplyingTo(commentId)}
                  onDelete={handleDeleteComment}
                />

                {replyingTo === comment.id && (
                  <div className="mt-4 ml-3 space-y-3 sm:ml-6">
                    <CommentInput
                      proposalId={proposalId}
                      onSubmit={handleAddReply}
                      isReply
                      onCancel={() => setReplyingTo(null)}
                      loading={loading}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {sortedComments.length === 0 && (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <MessageCircle className="h-8 w-8 text-white/40 mx-auto mb-3" />
          <p className="text-white/60">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
