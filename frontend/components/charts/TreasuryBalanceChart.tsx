'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

export default function TreasuryBalanceChart() {
  const { proposals, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Treasury Balance History</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  const generateTreasuryData = () => {
    if (!proposals) return [];

    const sorted = [...proposals].sort(
      (a, b) => a.createdAt - b.createdAt
    );

    let cumulativeSpent = 0;
    return sorted.map((p) => {
      if (p.executed) {
        cumulativeSpent += (p.amount || 0) / 1_000_000;
      }
      return {
        date: new Date(p.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        spent: cumulativeSpent,
      };
    });
  };

  const data = generateTreasuryData();

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Treasury Distribution History</h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No treasury data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#a78bfa" />
            <YAxis stroke="#a78bfa" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => {
                const numValue = typeof value === 'number' ? value : Number(value);
                return `${numValue.toFixed(2)} STX`;
              }}
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#8b5cf6"
              fill="rgba(139, 92, 246, 0.2)"
              name="Total Distributed (STX)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
