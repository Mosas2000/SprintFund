'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useGovernanceAnalytics } from '@/hooks/useGovernanceAnalytics';

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function SuccessRateChart() {
  const { proposalStats, loading } = useGovernanceAnalytics();

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Proposal Success Rate</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!proposalStats) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Proposal Success Rate</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No data available</p>
        </div>
      </div>
    );
  }

  const data = [
    { name: 'Approved', value: proposalStats.approved },
    { name: 'Rejected', value: proposalStats.rejected },
    { name: 'Pending', value: proposalStats.pending },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-4">Proposal Success Rate</h3>
      {data.every((d) => d.value === 0) ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/60">No proposals yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => {
                const pct = (percent ?? 0) * 100;
                return `${name} ${pct.toFixed(0)}%`;
              }}
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
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
