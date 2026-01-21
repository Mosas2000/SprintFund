'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { category: 'Development', count: 28 },
    { category: 'Design', count: 18 },
    { category: 'Marketing', count: 15 },
    { category: 'Community', count: 22 },
    { category: 'Research', count: 12 },
    { category: 'Other', count: 8 },
];

export default function CategoryChart() {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="category" stroke="#a78bfa" angle={-45} textAnchor="end" height={80} />
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
                    <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
