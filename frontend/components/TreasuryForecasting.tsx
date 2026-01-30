'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ForecastScenario {
  name: 'optimistic' | 'realistic' | 'pessimistic';
  monthlyInflow: number;
  monthlyOutflow: number;
  growthRate: number;
  runway: number;
  endingBalance: number;
}

interface SustainabilityMetric {
  metric: string;
  current: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}

export default function TreasuryForecasting() {
  const [currentBalance] = useState(650000);
  const [selectedScenario, setSelectedScenario] = useState<'optimistic' | 'realistic' | 'pessimistic'>('realistic');
  
  const [scenarios] = useState<ForecastScenario[]>([
    {
      name: 'optimistic',
      monthlyInflow: 220000,
      monthlyOutflow: 120000,
      growthRate: 15,
      runway: 18,
      endingBalance: 1450000
    },
    {
      name: 'realistic',
      monthlyInflow: 180000,
      monthlyOutflow: 145000,
      growthRate: 5,
      runway: 12,
      endingBalance: 850000
    },
    {
      name: 'pessimistic',
      monthlyInflow: 140000,
      monthlyOutflow: 170000,
      growthRate: -5,
      runway: 6,
      endingBalance: 450000
    }
  ]);

  const [sustainabilityMetrics] = useState<SustainabilityMetric[]>([
    { metric: 'Runway (months)', current: 12, target: 18, status: 'warning' },
    { metric: 'Burn Rate Ratio', current: 0.81, target: 0.70, status: 'warning' },
    { metric: 'Reserve Coverage', current: 4.5, target: 6, status: 'warning' },
    { metric: 'Diversification Score', current: 72, target: 80, status: 'good' },
    { metric: 'Liquidity Ratio', current: 0.65, target: 0.75, status: 'warning' }
  ]);

  const [alerts] = useState([
    { severity: 'warning', message: 'Treasury runway below 18-month target', action: 'Increase revenue or reduce spending' },
    { severity: 'info', message: 'Current burn rate sustainable for 12 months', action: 'Monitor closely' },
    { severity: 'critical', message: 'Pessimistic scenario shows 6-month runway', action: 'Prepare contingency plan' }
  ]);

  // Generate forecast data for selected scenario
  const generateForecastData = (scenario: ForecastScenario) => {
    const months = 12;
    const data = [];
    let balance = currentBalance;

    for (let i = 0; i <= months; i++) {
      data.push({
        month: i,
        balance: balance,
        inflow: scenario.monthlyInflow * (1 + (scenario.growthRate / 100) * (i / 12)),
        outflow: scenario.monthlyOutflow * (1 + (scenario.growthRate / 100) * (i / 12))
      });
      balance += (scenario.monthlyInflow - scenario.monthlyOutflow) * (1 + (scenario.growthRate / 100) * (i / 12));
    }

    return data;
  };

  const selectedScenarioData = scenarios.find(s => s.name === selectedScenario)!;
  const forecastData = generateForecastData(selectedScenarioData);

  const allScenariosChartData = {
    labels: forecastData.map((_, i) => `Month ${i}`),
    datasets: scenarios.map(scenario => {
      const data = generateForecastData(scenario);
      const colors = {
        optimistic: { border: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
        realistic: { border: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
        pessimistic: { border: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
      };
      return {
        label: scenario.name.charAt(0).toUpperCase() + scenario.name.slice(1),
        data: data.map(d => d.balance),
        borderColor: colors[scenario.name].border,
        backgroundColor: colors[scenario.name].bg,
        fill: false,
        tension: 0.4
      };
    })
  };

  const cashFlowChartData = {
    labels: forecastData.map((_, i) => `Month ${i}`),
    datasets: [
      {
        label: 'Projected Inflow',
        data: forecastData.map(d => d.inflow),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Projected Outflow',
        data: forecastData.map(d => d.outflow),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${(context.parsed.y / 1000).toFixed(0)}K STX`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${(value / 1000).toFixed(0)}K`
        }
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'critical': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-1">🔮 Treasury Forecasting</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Predict treasury runway and sustainability metrics
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{alert.message}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Action:</strong> {alert.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scenario Selection */}
      <div className="flex gap-3">
        {scenarios.map(scenario => (
          <button
            key={scenario.name}
            onClick={() => setSelectedScenario(scenario.name)}
            className={`flex-1 p-4 rounded-lg border-2 transition ${
              selectedScenario === scenario.name
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="text-lg font-semibold capitalize mb-2">{scenario.name}</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Runway:</span>
                <span className="font-semibold">{scenario.runway} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Growth:</span>
                <span className={`font-semibold ${scenario.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {scenario.growthRate > 0 ? '+' : ''}{scenario.growthRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">End Balance:</span>
                <span className="font-semibold">{(scenario.endingBalance / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Scenario Comparison Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">📈 All Scenarios Comparison</h3>
        <div className="h-80">
          <Line data={allScenariosChartData} options={chartOptions} />
        </div>
      </div>

      {/* Selected Scenario Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Projection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">💰 Cash Flow Projection ({selectedScenario})</h3>
          <div className="h-64 mb-4">
            <Line data={cashFlowChartData} options={chartOptions} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Inflow</div>
              <div className="text-xl font-bold text-green-600">
                {(selectedScenarioData.monthlyInflow / 1000).toFixed(0)}K
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Monthly Outflow</div>
              <div className="text-xl font-bold text-red-600">
                {(selectedScenarioData.monthlyOutflow / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>

        {/* Runway Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold mb-4">⏰ Runway Analysis</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                          rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Runway</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {selectedScenarioData.runway} months
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Treasury depletes by {new Date(Date.now() + selectedScenarioData.runway * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current Balance:</span>
                <span className="font-semibold">{(currentBalance / 1000).toFixed(0)}K STX</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Net Monthly Flow:</span>
                <span className={`font-semibold ${
                  selectedScenarioData.monthlyInflow >= selectedScenarioData.monthlyOutflow
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {selectedScenarioData.monthlyInflow >= selectedScenarioData.monthlyOutflow ? '+' : ''}
                  {((selectedScenarioData.monthlyInflow - selectedScenarioData.monthlyOutflow) / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Projected Balance (12mo):</span>
                <span className="font-semibold">{(selectedScenarioData.endingBalance / 1000).toFixed(0)}K STX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold mb-4">📊 Sustainability Metrics</h3>
        <div className="space-y-4">
          {sustainabilityMetrics.map((metric, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{metric.metric}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBg(metric.status)} ${getStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current: {metric.current}</span>
                <span className="text-gray-600 dark:text-gray-400">Target: {metric.target}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 
                    rounded-lg border border-purple-200 dark:border-purple-700 p-6">
        <h3 className="font-semibold mb-4">💡 Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">📈</div>
            <h4 className="font-semibold mb-2">Increase Revenue</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Explore additional funding sources</li>
              <li>• Increase protocol revenue streams</li>
              <li>• Consider grant return mechanisms</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">📉</div>
            <h4 className="font-semibold mb-2">Optimize Spending</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Review high-cost categories</li>
              <li>• Implement milestone-based payouts</li>
              <li>• Reduce operational overhead</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">🛡️</div>
            <h4 className="font-semibold mb-2">Build Reserves</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Maintain 18-month runway minimum</li>
              <li>• Diversify treasury holdings</li>
              <li>• Create emergency fund</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-2">Monitor Closely</h4>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
              <li>• Track metrics weekly</li>
              <li>• Review scenarios monthly</li>
              <li>• Adjust strategy quarterly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
