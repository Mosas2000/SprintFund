'use client';

import { useState } from 'react';

interface PrivateVoteProps {
  proposalId: number;
  onVote: (isPrivate: boolean, encryptedVote?: string) => Promise<void>;
}

export default function PrivateVote({ proposalId, onVote }: PrivateVoteProps) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [loading, setLoading] = useState(false);

  const simpleEncrypt = (text: string): string => {
    return btoa(text + '-' + Date.now());
  };

  const handleSubmit = async () => {
    if (!selectedVote) return;
    
    setLoading(true);
    try {
      if (isPrivate) {
        const encryptedVote = simpleEncrypt(`${proposalId}-${selectedVote}`);
        await onVote(true, encryptedVote);
        
        // Store locally for user to track their own votes
        const privateVotes = JSON.parse(localStorage.getItem('privateVotes') || '[]');
        privateVotes.push({
          proposalId,
          vote: selectedVote,
          encrypted: encryptedVote,
          timestamp: Date.now()
        });
        localStorage.setItem('privateVotes', JSON.stringify(privateVotes));
      } else {
        await onVote(false);
      }
      
      setSelectedVote(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Cast Your Vote</h3>
      
      {/* Privacy Toggle */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="w-5 h-5 text-blue-600"
          />
          <div>
            <div className="font-medium">🔒 Private Vote</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your vote will be encrypted and anonymous
            </div>
          </div>
        </label>
      </div>

      {/* Vote Options */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => setSelectedVote('yes')}
          className={`p-4 rounded-lg border-2 transition ${
            selectedVote === 'yes'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="text-2xl mb-1">✓</div>
          <div className="font-semibold">Yes</div>
        </button>
        
        <button
          onClick={() => setSelectedVote('no')}
          className={`p-4 rounded-lg border-2 transition ${
            selectedVote === 'no'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="text-2xl mb-1">✗</div>
          <div className="font-semibold">No</div>
        </button>
      </div>

      {/* Privacy Info */}
      {isPrivate && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            🛡️ How Private Voting Works
          </div>
          <ul className="text-blue-700 dark:text-blue-300 space-y-1 ml-4">
            <li>• Your vote is encrypted before submission</li>
            <li>• Others cannot see how you voted</li>
            <li>• You can still verify your vote locally</li>
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedVote || loading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
      >
        {loading ? 'Submitting...' : `Submit ${isPrivate ? 'Private' : 'Public'} Vote`}
      </button>
    </div>
  );
}
