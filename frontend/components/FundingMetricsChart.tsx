'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

export default function FundingMetricsChart() {
  const { categoryStats, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Funding by Category</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  const data = categoryStats.map((cat) => ({
    category: cat.category,
    funded: cat.totalFunded / 1_000_000,
    approved: cat.approved,
  }));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Total Funding by Category</h3>
      {data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No funding data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="category" stroke="#a78bfa" />
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
            <Bar dataKey="funded" fill="#8b5cf6" name="Total Funded (STX)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
