'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoricalVote {
  type: 'approve' | 'reject';
  timestamp: string | number;
  voterAddress?: string;
}

interface VotingHistoryProps {
  votes: HistoricalVote[];
}

export function VotingHistory({ votes }: VotingHistoryProps) {
  if (!votes || votes.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60">No voting history available</p>
      </div>
    );
  }

  const approveCount = votes.filter((v) => v.type === 'approve').length;
  const rejectCount = votes.filter((v) => v.type === 'reject').length;
  const total = votes.length;

  const generateTrendData = () => {
    let runningApprove = 0;
    let runningReject = 0;

    return votes.map((vote) => {
      if (vote.type === 'approve') runningApprove += 1;
      else runningReject += 1;

      return {
        timestamp: new Date(vote.timestamp).toLocaleDateString(),
        approve: runningApprove,
        reject: runningReject,
      };
    });
  };

  const trendData = generateTrendData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
          <p className="text-sm text-green-400/70 mb-1">Approve</p>
          <p className="text-2xl font-bold text-green-400">{approveCount}</p>
          <p className="text-xs text-green-400/60 mt-1">
            {total > 0 ? ((approveCount / total) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <p className="text-sm text-red-400/70 mb-1">Reject</p>
          <p className="text-2xl font-bold text-red-400">{rejectCount}</p>
          <p className="text-xs text-red-400/60 mt-1">
            {total > 0 ? ((rejectCount / total) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <p className="text-sm text-purple-400/70 mb-1">Total Votes</p>
          <p className="text-2xl font-bold text-purple-400">{total}</p>
        </div>
      </div>

      {trendData.length > 1 && (
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">Voting Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="timestamp" stroke="#a78bfa" />
              <YAxis stroke="#a78bfa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="approve" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="reject" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4">Recent Votes</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {votes.slice().reverse().map((vote, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    vote.type === 'approve'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {vote.type === 'approve' ? 'Approve' : 'Reject'}
                </div>
                <p className="text-sm text-white/60 truncate">
                  {vote.voterAddress?.slice(0, 12)}...
                </p>
              </div>
              <p className="text-xs text-white/40 whitespace-nowrap ml-2">
                {new Date(vote.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
