'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: number;
  vote: 'yes' | 'no' | 'abstain';
  replies: Comment[];
}

interface VoteCommentProps {
  proposalId: number;
  userAddress: string;
}

export default function VoteComment({ proposalId, userAddress }: VoteCommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no' | 'abstain'>('yes');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`proposal-${proposalId}-comments`);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [proposalId]);

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`proposal-${proposalId}-comments`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: userAddress.slice(0, 8) + '...' + userAddress.slice(-4),
      text: newComment,
      timestamp: Date.now(),
      vote: voteChoice,
      replies: []
    };

    saveComments([...comments, comment]);
    setNewComment('');
  };

  const addReply = (commentId: number) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: Date.now(),
      author: userAddress.slice(0, 8) + '...' + userAddress.slice(-4),
      text: replyText,
      timestamp: Date.now(),
      vote: 'abstain',
      replies: []
    };

    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    });

    saveComments(updatedComments);
    setReplyText('');
    setReplyTo(null);
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'yes': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'no': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">💬 Vote Discussion</h3>

      {/* Add Comment */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex gap-2 mb-3">
          {(['yes', 'no', 'abstain'] as const).map(choice => (
            <button
              key={choice}
              onClick={() => setVoteChoice(choice)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                voteChoice === choice
                  ? getVoteColor(choice)
                  : 'text-gray-600 bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {choice === 'yes' && '✓ Yes'}
              {choice === 'no' && '✗ No'}
              {choice === 'abstain' && '○ Abstain'}
            </button>
          ))}
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your reasoning for this vote..."
          className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 mb-3"
          rows={3}
        />

        <button
          onClick={addComment}
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Post Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border-l-4 border-gray-200 dark:border-gray-700 pl-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getVoteColor(comment.vote)}`}>
                      {comment.vote === 'yes' && '✓ Yes'}
                      {comment.vote === 'no' && '✗ No'}
                      {comment.vote === 'abstain' && '○ Abstain'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                </div>
              </div>

              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reply
              </button>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="mt-3 ml-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 mb-2"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addReply(comment.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => setReplyTo(null)}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-3 ml-4 space-y-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{reply.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
