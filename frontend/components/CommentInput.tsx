'use client';

import { useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { Send } from 'lucide-react';

interface CommentInputProps {
  proposalId: string;
  onSubmit: (content: string) => void;
  isReply?: boolean;
  onCancel?: () => void;
  loading?: boolean;
}

export function CommentInput({
  onSubmit,
  isReply = false,
  onCancel,
  loading = false,
}: CommentInputProps) {
  const { userSession } = useConnect();
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
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/60">Please connect your wallet to participate in discussions</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError(null);
        }}
        placeholder="Share your thoughts..."
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
        rows={3}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/40">{content.length} / 5000</p>

        <div className="flex flex-col gap-2 sm:flex-row">
          {isReply && (
            <button
              onClick={onCancel}
              className="rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:py-2"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || content.trim().length === 0}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50 sm:py-2"
          >
            <Send className="h-4 w-4" />
            {isReply ? 'Reply' : 'Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}
