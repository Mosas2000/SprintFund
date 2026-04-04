import { describe, it, expect } from 'vitest';
import {
  detectTrendInsight,
  detectAnomalyInsight,
  generateRecommendations,
  prioritizeInsights,
  generateAllInsights,
} from './insightsGenerator';
import type { ProposalMetrics } from './dataCollector';
import type { TimeSeriesData } from './dataProcessor';

const createProposal = (overrides: Partial<ProposalMetrics> = {}): ProposalMetrics => ({
  proposalId: 1,
  title: 'Treasury Expansion',
  category: 'development',
  amount: 100_000_000,
  votesFor: 120,
  votesAgainst: 20,
  totalVotes: 140,
  uniqueVoters: 35,
  voteVelocity: 4.2,
  momentum: 1.1,
  createdAt: 100,
  deadline: 200,
  executed: true,
  executedAt: 180,
  timeToFunding: 12,
  ...overrides,
});

const baseTimeseries: TimeSeriesData = {
  data: [
    {
      timestamp: 1,
      date: '2026-03-01',
      proposalCount: 8,
      totalFunding: 300_000_000,
      avgFunding: 37_500_000,
      successRate: 72,
      avgVoteVelocity: 5,
      uniqueVoters: 25,
    },
    {
      timestamp: 2,
      date: '2026-03-08',
      proposalCount: 10,
      totalFunding: 320_000_000,
      avgFunding: 32_000_000,
      successRate: 68,
      avgVoteVelocity: 8,
      uniqueVoters: 28,
    },
    {
      timestamp: 3,
      date: '2026-03-15',
      proposalCount: 12,
      totalFunding: 360_000_000,
      avgFunding: 30_000_000,
      successRate: 65,
      avgVoteVelocity: 12,
      uniqueVoters: 32,
    },
    {
      timestamp: 4,
      date: '2026-03-22',
      proposalCount: 14,
      totalFunding: 400_000_000,
      avgFunding: 28_500_000,
      successRate: 61,
      avgVoteVelocity: 18,
      uniqueVoters: 40,
    },
  ],
  movingAverages: {
    funding: [300, 310, 326, 345],
    successRate: [72, 70, 68, 66],
    velocity: [5, 8, 12, 18],
  },
  trends: {
    fundingTrend: 'increasing',
    participationTrend: 'increasing',
    slope: 0.18,
  },
  seasonality: {
    detected: false,
  },
};

describe('insightsGenerator', () => {
  it('detects a significant funding velocity trend', () => {
    const insight = detectTrendInsight(baseTimeseries);

    expect(insight).not.toBeNull();
    expect(insight?.type).toBe('trend');
    expect(insight?.title).toContain('Funding velocity increased');
    expect(insight?.dataPoints).toEqual([12, 18]);
  });

  it('detects unusually high voting activity as an anomaly', () => {
    const proposals = [
      createProposal({ proposalId: 1, totalVotes: 40, createdAt: 1 }),
      createProposal({ proposalId: 2, totalVotes: 45, createdAt: 2 }),
      createProposal({ proposalId: 3, totalVotes: 35, createdAt: 3 }),
      createProposal({ proposalId: 4, totalVotes: 50, createdAt: 4 }),
      createProposal({ proposalId: 5, totalVotes: 300, createdAt: 5 }),
    ];

    const insight = detectAnomalyInsight(proposals);

    expect(insight).not.toBeNull();
    expect(insight?.type).toBe('anomaly');
    expect(insight?.title).toContain('Proposal #5');
  });

  it('generates proposer-focused recommendations', () => {
    const recommendations = generateRecommendations({
      role: 'proposer',
      history: [createProposal()],
      preferences: ['development'],
    });

    expect(recommendations).toHaveLength(2);
    expect(recommendations.map(item => item.category)).toEqual(['timing', 'strategy']);
  });

  it('prioritizes high-priority insights ahead of medium and low', () => {
    const ordered = prioritizeInsights([
      {
        id: 'low-newer',
        type: 'predictive',
        priority: 'low',
        title: 'Low',
        description: 'Low priority',
        dataPoints: [1],
        actionable: false,
        timestamp: 300,
      },
      {
        id: 'high-older',
        type: 'anomaly',
        priority: 'high',
        title: 'High',
        description: 'High priority',
        dataPoints: [2],
        actionable: true,
        timestamp: 100,
      },
      {
        id: 'medium-newer',
        type: 'trend',
        priority: 'medium',
        title: 'Medium',
        description: 'Medium priority',
        dataPoints: [3],
        actionable: true,
        timestamp: 200,
      },
    ]);

    expect(ordered.map(item => item.id)).toEqual(['high-older', 'medium-newer', 'low-newer']);
  });

  it('includes comparative insights when the user has a pending last proposal', () => {
    const allProposals = Array.from({ length: 10 }, (_, index) =>
      createProposal({
        proposalId: index + 1,
        executed: index < 8,
        totalVotes: 60 + index,
        createdAt: index + 1,
      })
    );

    const insights = generateAllInsights(allProposals, baseTimeseries, {
      role: 'proposer',
      history: allProposals.slice(0, 3),
      preferences: ['development', 'community'],
      lastProposal: createProposal({
        proposalId: 999,
        executed: false,
        totalVotes: 50,
      }),
    });

    expect(insights.some(insight => insight.type === 'comparative')).toBe(true);
  });
});
