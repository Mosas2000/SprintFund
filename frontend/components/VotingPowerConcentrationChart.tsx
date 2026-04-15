'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];

export default function VotingPowerConcentrationChart() {
  const { votingPower, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Voting Power Concentration</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!votingPower) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Voting Power Concentration</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No data available</p>
        </div>
      </div>
    );
  }

  const top10Total = votingPower.topVoters.reduce((sum, v) => sum + v.amount, 0);
  const others = Math.max(0, votingPower.totalStake - top10Total);

  const data = [
    { name: 'Top 10 Stakers', value: top10Total / 1_000_000 },
    { name: 'Others', value: others / 1_000_000 },
  ];

  const whalePercentage = (votingPower.whaleConcentration || 0).toFixed(1);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-2">Voting Power Concentration</h3>
      <p className="text-sm text-white/60 mb-4">
        Top 10 Stakers: {whalePercentage}% of total stake
      </p>
      {votingPower.uniqueStakers === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No staking data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(2)} STX`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : String(value), 'STX']}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
