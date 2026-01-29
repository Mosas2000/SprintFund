'use client';

import { useState } from 'react';

interface ImpactMetrics {
  treasuryImpact: number;
  costBenefit: number;
  riskScore: number;
  communitySentiment: number;
  timeToROI: number;
}

interface ImpactAssessmentProps {
  proposalAmount: number;
  treasuryBalance: number;
  category: string;
}

export default function ImpactAssessment({ proposalAmount, treasuryBalance, category }: ImpactAssessmentProps) {
  const [metrics, setMetrics] = useState<ImpactMetrics>({
    treasuryImpact: (proposalAmount / treasuryBalance) * 100,
    costBenefit: 0,
    riskScore: 0,
    communitySentiment: 0,
    timeToROI: 0
  });

  const [assumptions, setAssumptions] = useState({
    expectedRevenue: 0,
    timelineMonths: 6,
    teamSize: 3,
    riskFactors: [] as string[]
  });

  const calculateCostBenefit = () => {
    const benefit = assumptions.expectedRevenue;
    const cost = proposalAmount;
    return benefit > 0 ? ((benefit - cost) / cost) * 100 : 0;
  };

  const calculateRiskScore = () => {
    let baseRisk = 30;

    // Amount-based risk
    if (proposalAmount > treasuryBalance * 0.2) baseRisk += 30;
    else if (proposalAmount > treasuryBalance * 0.1) baseRisk += 20;
    else baseRisk += 10;

    // Timeline-based risk
    if (assumptions.timelineMonths > 12) baseRisk += 20;
    else if (assumptions.timelineMonths > 6) baseRisk += 10;

    // Category-based risk
    const highRiskCategories = ['defi', 'nft-gaming', 'infrastructure'];
    if (highRiskCategories.includes(category)) baseRisk += 15;

    // Risk factors
    baseRisk += assumptions.riskFactors.length * 5;

    return Math.min(baseRisk, 100);
  };

  const calculateTimeToROI = () => {
    if (assumptions.expectedRevenue <= proposalAmount) return null;
    return assumptions.timelineMonths;
  };

  const updateMetrics = () => {
    setMetrics({
      treasuryImpact: (proposalAmount / treasuryBalance) * 100,
      costBenefit: calculateCostBenefit(),
      riskScore: calculateRiskScore(),
      communitySentiment: Math.random() * 100, // Would be calculated from actual votes/comments
      timeToROI: calculateTimeToROI() || 0
    });
  };

  const getImpactLevel = (percentage: number) => {
    if (percentage < 5) return { level: 'Low', color: 'green' };
    if (percentage < 15) return { level: 'Medium', color: 'yellow' };
    return { level: 'High', color: 'red' };
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low Risk', color: 'green' };
    if (score < 60) return { level: 'Medium Risk', color: 'yellow' };
    return { level: 'High Risk', color: 'red' };
  };

  const getSentimentLevel = (score: number) => {
    if (score > 70) return { level: 'Positive', color: 'green' };
    if (score > 40) return { level: 'Neutral', color: 'yellow' };
    return { level: 'Negative', color: 'red' };
  };

  const impact = getImpactLevel(metrics.treasuryImpact);
  const risk = getRiskLevel(metrics.riskScore);
  const sentiment = getSentimentLevel(metrics.communitySentiment);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      red: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    };
    return colors[color];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-6">📊 Impact Assessment</h3>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg border-2 ${getColorClasses(impact.color)}`}>
          <div className="text-sm opacity-80 mb-1">Treasury Impact</div>
          <div className="text-2xl font-bold">{metrics.treasuryImpact.toFixed(1)}%</div>
          <div className="text-xs mt-1">{impact.level}</div>
        </div>

        <div className={`p-4 rounded-lg border-2 ${getColorClasses(risk.color)}`}>
          <div className="text-sm opacity-80 mb-1">Risk Score</div>
          <div className="text-2xl font-bold">{metrics.riskScore.toFixed(0)}</div>
          <div className="text-xs mt-1">{risk.level}</div>
        </div>

        <div className={`p-4 rounded-lg border-2 ${getColorClasses(sentiment.color)}`}>
          <div className="text-sm opacity-80 mb-1">Sentiment</div>
          <div className="text-2xl font-bold">{metrics.communitySentiment.toFixed(0)}%</div>
          <div className="text-xs mt-1">{sentiment.level}</div>
        </div>

        <div className="p-4 rounded-lg border-2 bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
          <div className="text-sm opacity-80 mb-1">Time to ROI</div>
          <div className="text-2xl font-bold">{metrics.timeToROI || '—'}</div>
          <div className="text-xs mt-1">{metrics.timeToROI ? 'months' : 'N/A'}</div>
        </div>
      </div>

      {/* Cost-Benefit Analysis */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="font-semibold mb-4">Cost-Benefit Analysis</h4>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Expected Revenue/Value (STX)</label>
            <input
              type="number"
              value={assumptions.expectedRevenue}
              onChange={(e) =>
                setAssumptions({ ...assumptions, expectedRevenue: parseInt(e.target.value) || 0 })
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Timeline (months)</label>
            <input
              type="number"
              value={assumptions.timelineMonths}
              onChange={(e) =>
                setAssumptions({ ...assumptions, timelineMonths: parseInt(e.target.value) || 6 })
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Team Size</label>
            <input
              type="number"
              value={assumptions.teamSize}
              onChange={(e) =>
                setAssumptions({ ...assumptions, teamSize: parseInt(e.target.value) || 1 })
              }
              className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <button
            onClick={updateMetrics}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Calculate Impact
          </button>
        </div>

        {metrics.costBenefit !== 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Cost-Benefit Ratio
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {metrics.costBenefit > 0 ? '+' : ''}
              {metrics.costBenefit.toFixed(1)}%
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {metrics.costBenefit > 0
                ? 'Expected positive return'
                : metrics.costBenefit < 0
                ? 'Expected loss'
                : 'Break even'}
            </div>
          </div>
        )}
      </div>

      {/* Risk Factors */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Risk Factors</h4>
        <div className="space-y-2">
          {['Technical Complexity', 'Market Volatility', 'Team Experience', 'Regulatory Uncertainty'].map(
            (factor) => (
              <label key={factor} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assumptions.riskFactors.includes(factor)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAssumptions({
                        ...assumptions,
                        riskFactors: [...assumptions.riskFactors, factor]
                      });
                    } else {
                      setAssumptions({
                        ...assumptions,
                        riskFactors: assumptions.riskFactors.filter((f) => f !== factor)
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{factor}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Impact Summary */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold mb-3">Overall Assessment</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Treasury Usage:</span>
            <span className="font-semibold">
              {proposalAmount.toLocaleString()} / {treasuryBalance.toLocaleString()} STX
            </span>
          </div>
          <div className="flex justify-between">
            <span>Expected Duration:</span>
            <span className="font-semibold">{assumptions.timelineMonths} months</span>
          </div>
          <div className="flex justify-between">
            <span>Risk-Adjusted Score:</span>
            <span className={`font-semibold ${risk.color === 'green' ? 'text-green-600' : risk.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
              {(100 - metrics.riskScore).toFixed(0)}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
