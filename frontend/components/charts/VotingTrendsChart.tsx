'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

export default function VotingTrendsChart() {
  const { timeline, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Voting Trends</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  const data = timeline.map((entry) => ({
    name: entry.date,
    created: entry.created,
    approved: entry.approved,
    rejected: entry.rejected,
  }));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Voting Trends</h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No voting data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#a78bfa" />
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
            <Line type="monotone" dataKey="created" stroke="#8b5cf6" strokeWidth={2} name="Created" />
            <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
            <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} name="Rejected" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
