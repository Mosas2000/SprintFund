'use client';

import { useEffect, useMemo, useState } from 'react';

interface ScheduledVoteItem {
  proposalId: number;
  voteType: 'yes' | 'no';
  executionTime: number;
  createdAt: number;
  status: 'pending' | 'executed' | 'cancelled';
}

interface ScheduledVoteProps {
  proposalId: number;
  onSchedule: (voteType: 'yes' | 'no', scheduledTime: number) => void;
}

export default function ScheduledVote({ proposalId, onSchedule }: ScheduledVoteProps) {
  const [voteType, setVoteType] = useState<'yes' | 'no'>('yes');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledVotes, setScheduledVotes] = useState<ScheduledVoteItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const votes: ScheduledVoteItem[] = JSON.parse(localStorage.getItem('scheduledVotes') || '[]');
    return votes;
  });
  const [tick, setTick] = useState(() => Date.now());

  const proposalVotes = useMemo(
    () => scheduledVotes.filter((vote) => vote.proposalId === proposalId),
    [proposalId, scheduledVotes]
  );

  const countdown = useMemo(() => {
    const nextCountdowns: Record<number, string> = {};

    proposalVotes.forEach((vote, index: number) => {
      const timeLeft = vote.executionTime - tick;
      if (timeLeft > 0) {
        const hours = Math.floor(timeLeft / 3600000);
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        nextCountdowns[index] = `${hours}h ${minutes}m`;
      } else {
        nextCountdowns[index] = 'Executing...';
      }
    });

    return nextCountdowns;
  }, [proposalVotes, tick]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSchedule = () => {
    if (!scheduledTime) return;

    const executionTime = new Date(scheduledTime).getTime();
    const vote: ScheduledVoteItem = {
      proposalId,
      voteType,
      executionTime,
      createdAt: Date.now(),
      status: 'pending'
    };

    const votes: ScheduledVoteItem[] = JSON.parse(localStorage.getItem('scheduledVotes') || '[]');
    votes.push(vote);
    localStorage.setItem('scheduledVotes', JSON.stringify(votes));

    onSchedule(voteType, executionTime);
    setScheduledVotes([...scheduledVotes, vote]);
    setScheduledTime('');
  };

  const cancelScheduled = (index: number) => {
    const votes: ScheduledVoteItem[] = JSON.parse(localStorage.getItem('scheduledVotes') || '[]');
    votes.splice(index, 1);
    localStorage.setItem('scheduledVotes', JSON.stringify(votes));
    setScheduledVotes(votes);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">⏰ Schedule Vote</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Vote Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setVoteType('yes')}
              className={`p-3 rounded-lg border-2 transition ${
                voteType === 'yes'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              ✓ Yes
            </button>
            <button
              onClick={() => setVoteType('no')}
              className={`p-3 rounded-lg border-2 transition ${
                voteType === 'no'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              ✗ No
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Execution Time</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full p-3 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        <button
          onClick={handleSchedule}
          disabled={!scheduledTime}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          Schedule Vote
        </button>
      </div>

      {/* Scheduled Votes List */}
          {proposalVotes.length > 0 && (
        <div>
          <h4 className="font-semibold mb-3">Scheduled Votes</h4>
          <div className="space-y-2">
            {proposalVotes.map((vote, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    {vote.voteType === 'yes' ? '✓ Yes' : '✗ No'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Executes in: {countdown[index] || 'Calculating...'}
                  </div>
                </div>
                <button
                  onClick={() => cancelScheduled(index)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
