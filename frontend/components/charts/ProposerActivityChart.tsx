'use client';

import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

export default function ProposerActivityChart() {
  const { proposals, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Active vs Inactive Proposers</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  const proposerMap = new Map<string, number>();
  proposals.forEach((p) => {
    proposerMap.set(p.proposer, (proposerMap.get(p.proposer) || 0) + 1);
  });

  const activeProposers = Array.from(proposerMap.entries())
    .filter(([, count]) => count >= 3)
    .length;

  const moderateProposers = Array.from(proposerMap.entries())
    .filter(([, count]) => count === 2)
    .length;

  const inactiveProposers = Array.from(proposerMap.entries())
    .filter(([, count]) => count === 1)
    .length;

  const data = [
    { name: 'Active (3+)', count: activeProposers },
    { name: 'Moderate (2)', count: moderateProposers },
    { name: 'Inactive (1)', count: inactiveProposers },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Active vs Inactive Proposers</h3>
      <p className="text-sm text-white/60 mb-4">
        Total unique proposers: {proposerMap.size}
      </p>
      {proposerMap.size === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No proposer data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar dataKey="count" fill="#8b5cf6" name="Number of Proposers" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
