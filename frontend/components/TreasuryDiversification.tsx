'use client';

import { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Asset {
  name: string;
  symbol: string;
  amount: number;
  value: number;
  percentage: number;
  risk: 'low' | 'medium' | 'high';
  apy?: number;
  protocol?: string;
}

interface DeFiPosition {
  protocol: string;
  type: 'staking' | 'liquidity' | 'lending' | 'yield';
  asset: string;
  amount: number;
  value: number;
  apy: number;
  duration: string;
  risk: 'low' | 'medium' | 'high';
}

interface RebalanceRecommendation {
  action: 'buy' | 'sell' | 'stake' | 'unstake';
  asset: string;
  amount: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export default function TreasuryDiversification() {
  const [assets, setAssets] = useState<Asset[]>([
    { name: 'STX', symbol: 'STX', amount: 1800000, value: 1800000, percentage: 72, risk: 'medium' },
    { name: 'BTC', symbol: 'BTC', amount: 2.5, value: 107500, percentage: 4.3, risk: 'low' },
    { name: 'USDC', symbol: 'USDC', amount: 300000, value: 300000, percentage: 12, risk: 'low' },
    { name: 'xBTC', symbol: 'xBTC', amount: 1.2, value: 51600, percentage: 2.1, risk: 'medium' },
    { name: 'aBTC', symbol: 'aBTC', amount: 0.8, value: 34400, percentage: 1.4, risk: 'medium' },
    { name: 'STX-USDC LP', symbol: 'LP', amount: 75000, value: 75000, percentage: 3, risk: 'high', apy: 45.2 },
    { name: 'Staked STX', symbol: 'stSTX', amount: 125000, value: 128750, percentage: 5.2, risk: 'low', apy: 8.5, protocol: 'StackingDAO' }
  ]);

  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([
    {
      protocol: 'StackingDAO',
      type: 'staking',
      asset: 'STX',
      amount: 125000,
      value: 128750,
      apy: 8.5,
      duration: 'Cycle 78',
      risk: 'low'
    },
    {
      protocol: 'ALEX',
      type: 'liquidity',
      asset: 'STX-USDC',
      amount: 75000,
      value: 75000,
      apy: 45.2,
      duration: 'Ongoing',
      risk: 'high'
    },
    {
      protocol: 'Arkadiko',
      type: 'lending',
      asset: 'USDC',
      amount: 50000,
      value: 50000,
      apy: 6.8,
      duration: 'Flexible',
      risk: 'low'
    },
    {
      protocol: 'Zest Protocol',
      type: 'yield',
      asset: 'BTC',
      amount: 0.5,
      value: 21500,
      apy: 12.3,
      duration: '6 months',
      risk: 'medium'
    }
  ]);

  const [recommendations, setRecommendations] = useState<RebalanceRecommendation[]>([
    {
      action: 'sell',
      asset: 'STX',
      amount: 300000,
      reason: 'STX concentration is 72%, target is 50-60%. Reduce exposure to manage risk.',
      priority: 'high'
    },
    {
      action: 'buy',
      asset: 'BTC',
      amount: 3,
      reason: 'BTC allocation is only 4.3%, target is 10-15%. Increase for stability.',
      priority: 'high'
    },
    {
      action: 'stake',
      asset: 'STX',
      amount: 200000,
      reason: 'Only 6.9% of STX is staked. Increase to 15% for passive income (8.5% APY).',
      priority: 'medium'
    },
    {
      action: 'buy',
      asset: 'USDC',
      amount: 100000,
      reason: 'USDC reserves at 12%, target 15-20% for liquidity buffer.',
      priority: 'medium'
    }
  ]);

  const [targetAllocation, setTargetAllocation] = useState({
    stx: 55,
    btc: 12,
    stablecoins: 18,
    defi: 10,
    other: 5
  });

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const defiTotalValue = defiPositions.reduce((sum, pos) => sum + pos.value, 0);
  const avgAPY = defiPositions.reduce((sum, pos) => sum + (pos.apy * pos.value), 0) / defiTotalValue;

  // Calculate diversification score (0-100)
  const calculateDiversificationScore = () => {
    const assetCount = assets.length;
    const maxConcentration = Math.max(...assets.map(a => a.percentage));
    const defiAllocation = (defiTotalValue / totalValue) * 100;
    
    let score = 100;
    
    // Penalize for high concentration
    if (maxConcentration > 70) score -= 30;
    else if (maxConcentration > 60) score -= 20;
    else if (maxConcentration > 50) score -= 10;
    
    // Reward for number of assets
    if (assetCount >= 7) score += 10;
    else if (assetCount >= 5) score += 5;
    
    // Reward for DeFi participation
    if (defiAllocation >= 8) score += 10;
    else if (defiAllocation >= 5) score += 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const diversificationScore = calculateDiversificationScore();

  // Risk breakdown
  const riskBreakdown = {
    low: assets.filter(a => a.risk === 'low').reduce((sum, a) => sum + a.value, 0),
    medium: assets.filter(a => a.risk === 'medium').reduce((sum, a) => sum + a.value, 0),
    high: assets.filter(a => a.risk === 'high').reduce((sum, a) => sum + a.value, 0)
  };

  const allocationChartData = {
    labels: assets.map(a => a.symbol),
    datasets: [{
      data: assets.map(a => a.percentage),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(234, 179, 8, 0.8)'
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2
    }]
  };

  const riskChartData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      label: 'Value (STX)',
      data: [riskBreakdown.low, riskBreakdown.medium, riskBreakdown.high],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }]
  };

  const getRiskColor = (risk: Asset['risk']) => {
    switch (risk) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
    }
  };

  const getPriorityColor = (priority: RebalanceRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
    }
  };

  const getActionIcon = (action: RebalanceRecommendation['action']) => {
    switch (action) {
      case 'buy': return '📈';
      case 'sell': return '📉';
      case 'stake': return '🔒';
      case 'unstake': return '🔓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">🎯 Treasury Diversification</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage asset allocation and minimize concentration risk
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          🔄 Execute Rebalancing
        </button>
      </div>

      {/* Diversification Score */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                    rounded-lg p-6 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Diversification Score</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Based on concentration, asset count, and DeFi participation
            </p>
          </div>
          <div className="text-5xl font-bold text-purple-600">{diversificationScore}</div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className={`h-4 rounded-full ${
              diversificationScore >= 80 ? 'bg-green-500' :
              diversificationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${diversificationScore}%` }}
          />
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Assets:</span>
            <span className="ml-2 font-semibold">{assets.length}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Max Concentration:</span>
            <span className="ml-2 font-semibold">{Math.max(...assets.map(a => a.percentage)).toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">DeFi Allocation:</span>
            <span className="ml-2 font-semibold">{((defiTotalValue / totalValue) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Treasury Value</div>
          <div className="text-2xl font-bold text-blue-600">{(totalValue / 1000000).toFixed(2)}M STX</div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">DeFi Positions</div>
          <div className="text-2xl font-bold text-green-600">{(defiTotalValue / 1000).toFixed(0)}K STX</div>
          <div className="text-xs text-gray-500 mt-1">Avg APY: {avgAPY.toFixed(1)}%</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Asset Types</div>
          <div className="text-2xl font-bold text-purple-600">{assets.length}</div>
          <div className="text-xs text-gray-500 mt-1">{defiPositions.length} DeFi positions</div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rebalance Actions</div>
          <div className="text-2xl font-bold text-yellow-600">{recommendations.length}</div>
          <div className="text-xs text-gray-500 mt-1">
            {recommendations.filter(r => r.priority === 'high').length} high priority
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Asset Allocation</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={allocationChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return `${label}: ${value.toFixed(1)}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">Risk Distribution</h3>
          <div className="h-64">
            <Bar
              data={riskChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed.y;
                        return `${(value / 1000).toFixed(0)}K STX`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${(Number(value) / 1000).toFixed(0)}K`
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Asset Holdings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">Asset Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value (STX)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Allocation</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Risk</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">APY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map(asset => (
                <tr key={asset.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-xs text-gray-500">{asset.symbol}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {asset.amount >= 1000 
                      ? `${(asset.amount / 1000).toFixed(1)}K` 
                      : asset.amount.toFixed(2)
                    }
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {(asset.value / 1000).toFixed(1)}K
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium">{asset.percentage.toFixed(1)}%</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(asset.percentage, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRiskColor(asset.risk)}`}>
                      {asset.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {asset.apy ? (
                      <span className="text-green-600 font-medium">{asset.apy.toFixed(1)}%</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DeFi Positions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">🌾 DeFi Protocol Integrations</h3>
        <div className="space-y-3">
          {defiPositions.map((position, idx) => (
            <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {position.protocol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{position.protocol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {position.type.charAt(0).toUpperCase() + position.type.slice(1)} • {position.asset}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{(position.value / 1000).toFixed(1)}K STX</div>
                  <div className="text-sm text-green-600 font-medium">{position.apy.toFixed(1)}% APY</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="ml-1 font-medium">{position.duration}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Risk:</span>
                  <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(position.risk)}`}>
                    {position.risk.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rebalancing Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">💡 Rebalancing Recommendations</h3>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{getActionIcon(rec.action)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-lg">
                      {rec.action.charAt(0).toUpperCase() + rec.action.slice(1)} {(rec.amount / 1000).toFixed(0)}K {rec.asset}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reason}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Execute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
