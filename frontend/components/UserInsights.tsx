'use client';

import { useState, useEffect } from 'react';

interface AIRecommendation {
  id: number;
  type: 'proposal' | 'voting' | 'collaboration' | 'timing' | 'strategy';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  metadata?: any;
}

interface PerformanceReport {
  period: string;
  votingAccuracy: number;
  proposalSuccessRate: number;
  communityEngagement: number;
  treasuryContribution: number;
  strengths: string[];
  improvements: string[];
}

interface OptimalStrategy {
  category: string;
  bestTimeToVote: string;
  successfulPatterns: string[];
  recommendedActions: string[];
}

interface UserInsightsProps {
  userAddress: string;
}

export default function UserInsights({ userAddress }: UserInsightsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [performanceReport, setPerformanceReport] = useState<PerformanceReport | null>(null);
  const [strategies, setStrategies] = useState<OptimalStrategy[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'performance' | 'strategies'>('recommendations');
  const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'medium'>('all');

  useEffect(() => {
    // Load AI-powered insights
    const mockRecommendations: AIRecommendation[] = [
      {
        id: 1,
        type: 'proposal',
        title: 'High-Potential Proposal Detected',
        description: 'Proposal #47 "DeFi Integration Layer" matches 92% of your successful voting patterns. Early voting recommended.',
        confidence: 92,
        impact: 'high',
        actionable: true,
        metadata: { proposalId: 47 }
      },
      {
        id: 2,
        type: 'timing',
        title: 'Optimal Voting Window',
        description: 'Historical data shows your votes cast on Thursday between 2-4 PM receive 38% more engagement.',
        confidence: 87,
        impact: 'high',
        actionable: true
      },
      {
        id: 3,
        type: 'collaboration',
        title: 'Collaboration Opportunity',
        description: 'User @alice_dao has 89% alignment with your voting patterns. Consider collaboration on DeFi proposals.',
        confidence: 89,
        impact: 'medium',
        actionable: true,
        metadata: { userAddress: 'SP1ABC...DEF' }
      },
      {
        id: 4,
        type: 'voting',
        title: 'Voting Power Optimization',
        description: 'Delegating 20% of your voting power to high-reputation users could increase your overall impact by 15%.',
        confidence: 78,
        impact: 'medium',
        actionable: true
      },
      {
        id: 5,
        type: 'strategy',
        title: 'Category Diversification',
        description: 'Your voting is concentrated in DeFi (78%). Exploring Infrastructure proposals could improve reputation by 12%.',
        confidence: 82,
        impact: 'medium',
        actionable: true
      },
      {
        id: 6,
        type: 'proposal',
        title: 'Proposal Creation Timing',
        description: 'Monday mornings show 45% higher approval rates for proposals similar to yours.',
        confidence: 85,
        impact: 'high',
        actionable: true
      }
    ];

    const mockPerformance: PerformanceReport = {
      period: 'Last 30 Days',
      votingAccuracy: 88,
      proposalSuccessRate: 92,
      communityEngagement: 76,
      treasuryContribution: 85,
      strengths: [
        'Consistent voting participation (94% of proposals)',
        'High-quality proposal submissions',
        'Strong community engagement in comments',
        'Effective voting delegation strategy'
      ],
      improvements: [
        'Consider diversifying proposal categories',
        'Increase early-stage proposal participation',
        'Engage more with community discussions',
        'Optimize voting timing for maximum impact'
      ]
    };

    const mockStrategies: OptimalStrategy[] = [
      {
        category: 'DeFi',
        bestTimeToVote: 'Thursday 2-4 PM',
        successfulPatterns: [
          'Early voting (within 24h)',
          'Detailed comment participation',
          'Supporting proposals with >1000 STX budget'
        ],
        recommendedActions: [
          'Focus on lending protocol proposals',
          'Collaborate with @alice_dao',
          'Vote during peak engagement times'
        ]
      },
      {
        category: 'Infrastructure',
        bestTimeToVote: 'Tuesday 10 AM - 12 PM',
        successfulPatterns: [
          'Technical analysis in comments',
          'Supporting open-source projects',
          'Mid-range budget proposals (30-50K STX)'
        ],
        recommendedActions: [
          'Review developer documentation proposals',
          'Engage with technical community',
          'Consider co-authoring proposals'
        ]
      }
    ];

    setRecommendations(mockRecommendations);
    setPerformanceReport(mockPerformance);
    setStrategies(mockStrategies);
  }, [userAddress]);

  const filteredRecommendations = recommendations.filter(rec => {
    if (filterImpact === 'all') return true;
    return rec.impact === filterImpact;
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      proposal: '📝',
      voting: '🗳️',
      collaboration: '🤝',
      timing: '⏰',
      strategy: '🎯'
    };
    return icons[type as keyof typeof icons] || '💡';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">🧠 User Insights</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered recommendations and performance analysis
          </p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium">
          ✨ AI-Powered
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'recommendations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          💡 Recommendations ({recommendations.length})
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'performance'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📊 Performance Report
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'strategies'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          🎯 Optimal Strategies
        </button>
      </div>

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterImpact('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterImpact === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterImpact('high')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterImpact === 'high'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              High Impact
            </button>
            <button
              onClick={() => setFilterImpact('medium')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterImpact === 'medium'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Medium Impact
            </button>
          </div>

          {/* Recommendations List */}
          <div className="space-y-3">
            {filteredRecommendations.map(rec => (
              <div
                key={rec.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getTypeIcon(rec.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{rec.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(rec.impact)}`}>
                          {rec.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 
                                     rounded text-xs font-medium">
                          {rec.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {rec.description}
                    </p>

                    {rec.actionable && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium 
                                       hover:bg-blue-700 transition">
                        Take Action →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Report Tab */}
      {activeTab === 'performance' && performanceReport && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 
                        rounded-lg border border-blue-200 dark:border-blue-700 p-6">
            <h3 className="font-semibold mb-1">Performance Period</h3>
            <p className="text-2xl font-bold text-blue-600">{performanceReport.period}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Voting Accuracy</div>
              <div className="text-3xl font-bold text-green-600">{performanceReport.votingAccuracy}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${performanceReport.votingAccuracy}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Proposal Success</div>
              <div className="text-3xl font-bold text-blue-600">{performanceReport.proposalSuccessRate}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${performanceReport.proposalSuccessRate}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Community Engagement</div>
              <div className="text-3xl font-bold text-purple-600">{performanceReport.communityEngagement}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${performanceReport.communityEngagement}%` }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Treasury Impact</div>
              <div className="text-3xl font-bold text-yellow-600">{performanceReport.treasuryContribution}%</div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${performanceReport.treasuryContribution}%` }}
                />
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-green-600">✓</span> Key Strengths
              </h3>
              <ul className="space-y-3">
                {performanceReport.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">●</span>
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <span className="text-blue-600">→</span> Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {performanceReport.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">●</span>
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Optimal Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className="space-y-6">
          {strategies.map((strategy, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{strategy.category}</h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 
                               rounded-lg text-sm font-medium">
                  ⏰ {strategy.bestTimeToVote}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">✓ Successful Patterns</h4>
                  <ul className="space-y-2">
                    {strategy.successfulPatterns.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">●</span>
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">→ Recommended Actions</h4>
                  <ul className="space-y-2">
                    {strategy.recommendedActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500">●</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
