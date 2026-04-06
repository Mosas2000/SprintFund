'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

export default function STXDistributionChart() {
  const { votingPower, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">STX Stake Distribution</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!votingPower || votingPower.topVoters.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">STX Stake Distribution</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No staking data available</p>
        </div>
      </div>
    );
  }

  const data = votingPower.topVoters.slice(0, 10).map((voter, index) => ({
    address: `Staker ${index + 1}`,
    amount: voter.amount / 1_000_000,
    percentage: voter.percentage.toFixed(2),
  }));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Top Stakers (STX)</h3>
      <p className="text-sm text-white/60 mb-4">Top 10 stakers by amount</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="address" stroke="#a78bfa" />
          <YAxis stroke="#a78bfa" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : String(value), 'STX']}
          />
          <Bar dataKey="amount" fill="#8b5cf6" name="Amount (STX)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
