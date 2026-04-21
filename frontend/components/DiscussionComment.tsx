'use client';

import { useState } from 'react';
import { useConnect, UserSession } from '@stacks/connect-react';
import { useProposalDiscussion } from '@/hooks/useProposalDiscussion';
import { Heart, MessageCircle, MoreVertical } from 'lucide-react';
import { ProposalDiscussionComment } from '@/types/proposal-detail';

// Helper to safely get user address from UserSession
function getUserAddress(userSession: UserSession | null): string | null {
  if (!userSession) return null;
  try {
    const userData = userSession.loadUserData?.();
    return userData?.profile?.stxAddress?.mainnet || null;
  } catch {
    return null;
  }
}

interface DiscussionCommentProps {
  comment: ProposalDiscussionComment;
  proposalId: string;
  depth?: number;
  onReplyClick?: (commentId: string) => void;
  canDelete?: boolean;
  onDelete?: (commentId: string) => void;
}

export function DiscussionComment({
  comment,
  proposalId,
  depth = 0,
  onReplyClick,
  canDelete,
  onDelete,
}: DiscussionCommentProps) {
  const { userSession } = useConnect();
  const { likeComment } = useProposalDiscussion(proposalId);
  const [showMenu, setShowMenu] = useState(false);
  const [, setIsEditing] = useState(false);

  if (comment.isDeleted) {
    return (
      <div className="py-3 px-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-sm text-white/40 italic">[Comment deleted]</p>
      </div>
    );
  }

  const userAddress = getUserAddress(userSession);
  const isAuthor = userAddress === comment.authorAddress;
  const formatAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-3 sm:ml-6 mt-3' : ''}`}>
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-purple-500/30">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {comment.authorName || formatAddress(comment.authorAddress)}
            </p>
            <p className="break-words text-xs text-white/40">
              {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
              {comment.isEdited && <span className="ml-2">(edited)</span>}
            </p>
          </div>
          <div className="relative">
            {(isAuthor || canDelete) && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded p-2 transition-colors hover:bg-white/10"
              >
                <MoreVertical className="h-4 w-4 text-white/60" />
              </button>
            )}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-lg z-10">
                {isAuthor && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 first:rounded-t-lg"
                  >
                    Edit
                  </button>
                )}
                {(isAuthor || canDelete) && (
                  <button
                    onClick={() => {
                      onDelete?.(comment.id);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 last:rounded-b-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-white mb-4 break-words">{comment.content}</p>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-2">
          <button
            onClick={() => likeComment(comment.id)}
            className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-purple-400"
          >
            <Heart className="h-3 w-3" />
            <span>{comment.likes}</span>
          </button>
          {onReplyClick && depth < 2 && (
            <button
              onClick={() => onReplyClick(comment.id)}
              className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-purple-400"
            >
              <MessageCircle className="h-3 w-3" />
              <span>Reply</span>
            </button>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply: ProposalDiscussionComment) => (
            <DiscussionComment
              key={reply.id}
              comment={reply}
              proposalId={proposalId}
              depth={depth + 1}
              onReplyClick={onReplyClick}
              canDelete={canDelete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
