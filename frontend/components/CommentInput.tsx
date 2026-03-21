'use client';

import { useState } from 'react';
import { useWallet } from '@stacks/connect-react';
import { Send } from 'lucide-react';

interface CommentInputProps {
  proposalId: string;
  onSubmit: (content: string) => void;
  isReply?: boolean;
  onCancel?: () => void;
  loading?: boolean;
}

export function CommentInput({
  proposalId,
  onSubmit,
  isReply = false,
  onCancel,
  loading = false,
}: CommentInputProps) {
  const { userSession } = useWallet();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!userSession) {
      setError('Please connect your wallet to comment');
      return;
    }

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 5000) {
      setError('Comment is too long (max 5000 characters)');
      return;
    }

    onSubmit(content);
    setContent('');
    setError(null);
  };

  if (!userSession) {
    return (
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <p className="text-sm text-white/60">Please connect your wallet to participate in discussions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError(null);
        }}
        placeholder="Share your thoughts..."
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 resize-none"
        rows={3}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">{content.length} / 5000</p>

        <div className="flex gap-2">
          {isReply && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || content.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Send className="h-4 w-4" />
            {isReply ? 'Reply' : 'Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}
