import { describe, it, expect } from 'vitest';
import type {
  Proposal,
  VotingData,
  SentimentResult,
  ProposalSummary,
  ConsensusRisk,
} from '../../types/governance';

describe('Governance types', () => {
  it('captures proposal metadata including category', () => {
    const proposal: Proposal = {
      id: 42,
      proposer: 'SP123PROPOSER',
      amount: 125_000_000,
      title: 'Protocol tooling grant',
      description: 'Fund contributor tooling for governance workflows.',
      category: 'development',
      votesFor: 180,
      votesAgainst: 24,
      executed: false,
      createdAt: 1_710_000_000,
    };

    expect(proposal.category).toBe('development');
    expect(proposal.executed).toBe(false);
  });

  it('types AI voting input payloads', () => {
    const votingData: VotingData = {
      proposalId: 42,
      title: 'Protocol tooling grant',
      category: 'development',
      amount: 125_000_000,
      proposerReputation: 91,
      historicalSuccessRate: 72,
      communitySupport: 84,
      totalVotes: 204,
      votesFor: 180,
      votesAgainst: 24,
      uniqueVoters: 150,
      whaleVotePercentage: 15,
      averageWeight: 1.36,
      votingPeriodProgress: 0.75,
    };

    expect(votingData.proposalId).toBe(42);
    expect(votingData.communitySupport).toBeGreaterThan(80);
  });

  it('supports sentiment and consensus summaries', () => {
    const sentiment: SentimentResult = {
      score: 0.78,
      label: 'positive',
      confidence: 0.91,
    };

    const summary: ProposalSummary = {
      proposalId: 42,
      totalVotes: 204,
      approvalRate: 88.24,
      participationRate: 63.1,
    };

    const risk: ConsensusRisk = {
      level: 'low',
      reason: 'Broad support across large and small holders.',
      concentrationIndex: 0.22,
    };

    expect(sentiment.label).toBe('positive');
    expect(summary.totalVotes).toBe(204);
    expect(risk.level).toBe('low');
  });
});
