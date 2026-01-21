'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Week 1', votes: 45, proposals: 12 },
    { name: 'Week 2', votes: 78, proposals: 18 },
    { name: 'Week 3', votes: 92, proposals: 15 },
    { name: 'Week 4', votes: 125, proposals: 22 },
    { name: 'Week 5', votes: 156, proposals: 28 },
    { name: 'Week 6', votes: 189, proposals: 31 },
];

export default function VotingTrendsChart() {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Voting Trends</h3>
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
                    <Line type="monotone" dataKey="votes" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="proposals" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
