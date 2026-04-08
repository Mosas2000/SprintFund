'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Vote {
  type: 'approve' | 'reject';
  timestamp?: string;
  voterAddress?: string;
}

interface ProposalVotingAnalyticsProps {
  votes: Vote[];
}

export function ProposalVotingAnalytics({ votes }: ProposalVotingAnalyticsProps) {
  if (!votes || votes.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Voting Analytics</h3>
        <p className="text-white/60 text-center py-8">No votes yet</p>
      </div>
    );
  }

  const approveCount = votes.filter((v) => v.type === 'approve').length;
  const rejectCount = votes.filter((v) => v.type === 'reject').length;
  const total = votes.length;

  const data = [
    { name: 'Approve', value: approveCount, color: '#10b981' },
    { name: 'Reject', value: rejectCount, color: '#ef4444' },
  ];

  const topVoters = votes
    .slice()
    .sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''))
    .slice(0, 5);

  return (
    <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-6">
      <h3 className="text-lg font-bold text-white">Voting Analytics</h3>

      {approveCount + rejectCount > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <p className="text-sm text-green-400/70">Approve</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{approveCount}</p>
              <p className="text-xs text-green-400/60 mt-1">
                {((approveCount / total) * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
              <p className="text-sm text-red-400/70">Reject</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{rejectCount}</p>
              <p className="text-xs text-red-400/60 mt-1">
                {((rejectCount / total) * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
              <p className="text-sm text-purple-400/70">Total</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{total}</p>
              <p className="text-xs text-purple-400/60 mt-1">votes</p>
            </div>
          </div>

          {approveCount > 0 && rejectCount > 0 && (
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} votes`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {topVoters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Recent Votes</h4>
              <div className="space-y-2">
                {topVoters.map((vote, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          vote.type === 'approve'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {vote.type === 'approve' ? 'Approve' : 'Reject'}
                      </div>
                      <p className="text-xs text-white/60 truncate">
                        {vote.voterAddress?.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
