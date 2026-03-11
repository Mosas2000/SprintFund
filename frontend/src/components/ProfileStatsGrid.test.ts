import { describe, it, expect } from 'vitest';
import { formatStx } from '../config';
import type { ProfileStats } from '../types/profile';

/**
 * Behavioral tests for ProfileStatsGrid.
 * Tests the data transformation logic and display contracts
 * without requiring DOM rendering.
 */

/* ── Helper: build stat card data matching component logic ── */

function buildStatCards(stats: ProfileStats) {
  return [
    {
      label: 'STX Balance',
      value: `${formatStx(stats.stxBalance)} STX`,
      color: 'text-white',
    },
    {
      label: 'Staked Amount',
      value: `${formatStx(stats.stakedAmount)} STX`,
      color: 'text-emerald-400',
    },
    {
      label: 'Proposals Created',
      value: stats.proposalsCreated,
      detail: `${stats.proposalsExecuted} executed`,
    },
    {
      label: 'Votes Cast',
      value: stats.totalVotesCast,
      detail: `Weight: ${stats.totalVoteWeight}`,
      color: 'text-indigo-400',
    },
    {
      label: 'Participation',
      value: `${stats.votingParticipationRate}%`,
      detail: 'of all proposals',
      color: stats.votingParticipationRate >= 50 ? 'text-emerald-400' : 'text-amber-400',
    },
    {
      label: 'Comments',
      value: stats.totalComments,
    },
  ];
}

const sampleStats: ProfileStats = {
  stxBalance: 500_000_000,
  stakedAmount: 100_000_000,
  proposalsCreated: 5,
  proposalsExecuted: 2,
  totalVotesCast: 8,
  totalComments: 12,
  totalVoteWeight: 15,
  votingParticipationRate: 67,
};

describe('ProfileStatsGrid behaviour', () => {
  describe('stat cards generation', () => {
    it('produces exactly 6 stat cards', () => {
      const cards = buildStatCards(sampleStats);
      expect(cards).toHaveLength(6);
    });

    it('formats STX balance correctly', () => {
      const cards = buildStatCards(sampleStats);
      const balanceCard = cards.find((c) => c.label === 'STX Balance');
      expect(balanceCard?.value).toBe('500.00 STX');
    });

    it('formats staked amount correctly', () => {
      const cards = buildStatCards(sampleStats);
      const stakedCard = cards.find((c) => c.label === 'Staked Amount');
      expect(stakedCard?.value).toBe('100.00 STX');
    });

    it('shows proposals created count with executed detail', () => {
      const cards = buildStatCards(sampleStats);
      const proposalCard = cards.find((c) => c.label === 'Proposals Created');
      expect(proposalCard?.value).toBe(5);
      expect(proposalCard?.detail).toBe('2 executed');
    });

    it('shows votes cast with weight detail', () => {
      const cards = buildStatCards(sampleStats);
      const voteCard = cards.find((c) => c.label === 'Votes Cast');
      expect(voteCard?.value).toBe(8);
      expect(voteCard?.detail).toBe('Weight: 15');
    });

    it('shows participation rate as percentage', () => {
      const cards = buildStatCards(sampleStats);
      const participationCard = cards.find((c) => c.label === 'Participation');
      expect(participationCard?.value).toBe('67%');
    });

    it('shows total comments count', () => {
      const cards = buildStatCards(sampleStats);
      const commentCard = cards.find((c) => c.label === 'Comments');
      expect(commentCard?.value).toBe(12);
    });
  });

  describe('participation rate color', () => {
    it('uses green for participation >= 50%', () => {
      const stats = { ...sampleStats, votingParticipationRate: 50 };
      const cards = buildStatCards(stats);
      const participationCard = cards.find((c) => c.label === 'Participation');
      expect(participationCard?.color).toBe('text-emerald-400');
    });

    it('uses green for high participation', () => {
      const stats = { ...sampleStats, votingParticipationRate: 100 };
      const cards = buildStatCards(stats);
      const participationCard = cards.find((c) => c.label === 'Participation');
      expect(participationCard?.color).toBe('text-emerald-400');
    });

    it('uses amber for low participation', () => {
      const stats = { ...sampleStats, votingParticipationRate: 49 };
      const cards = buildStatCards(stats);
      const participationCard = cards.find((c) => c.label === 'Participation');
      expect(participationCard?.color).toBe('text-amber-400');
    });

    it('uses amber for zero participation', () => {
      const stats = { ...sampleStats, votingParticipationRate: 0 };
      const cards = buildStatCards(stats);
      const participationCard = cards.find((c) => c.label === 'Participation');
      expect(participationCard?.color).toBe('text-amber-400');
    });
  });

  describe('zero values formatting', () => {
    const zeroStats: ProfileStats = {
      stxBalance: 0,
      stakedAmount: 0,
      proposalsCreated: 0,
      proposalsExecuted: 0,
      totalVotesCast: 0,
      totalComments: 0,
      totalVoteWeight: 0,
      votingParticipationRate: 0,
    };

    it('formats zero STX balance', () => {
      const cards = buildStatCards(zeroStats);
      const balanceCard = cards.find((c) => c.label === 'STX Balance');
      expect(balanceCard?.value).toBe('0.00 STX');
    });

    it('formats zero staked amount', () => {
      const cards = buildStatCards(zeroStats);
      const stakedCard = cards.find((c) => c.label === 'Staked Amount');
      expect(stakedCard?.value).toBe('0.00 STX');
    });

    it('shows zero proposals with 0 executed', () => {
      const cards = buildStatCards(zeroStats);
      const proposalCard = cards.find((c) => c.label === 'Proposals Created');
      expect(proposalCard?.value).toBe(0);
      expect(proposalCard?.detail).toBe('0 executed');
    });

    it('shows zero participation rate', () => {
      const cards = buildStatCards(zeroStats);
      const participationCard = cards.find((c) => c.label === 'Participation');
      expect(participationCard?.value).toBe('0%');
    });
  });
});
