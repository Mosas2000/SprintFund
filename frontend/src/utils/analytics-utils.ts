import { AnalyticsData, CategoryStats, AnalyticsProposal } from '@/types/analytics';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function filterAnalyticsByDateRange(
  data: AnalyticsData,
  dateRange: DateRange
): AnalyticsData {
  const filtered = {
    ...data,
    proposals: data.proposals.filter((p: AnalyticsProposal) => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= dateRange.startDate && createdAt <= dateRange.endDate;
    }),
  };

  return {
    ...filtered,
    proposalStats: recalculateStats(filtered.proposals),
    categoryStats: recalculateCategoryStats(filtered.proposals),
    voterStats: recalculateVoterStats(filtered.proposals),
    votingPower: recalculateVotingPower(filtered.proposals),
    timeline: data.timeline.filter(
      (t) =>
        new Date(t.date) >= dateRange.startDate &&
        new Date(t.date) <= dateRange.endDate
    ),
  };
}

function recalculateStats(proposals: AnalyticsProposal[]) {
  const total = proposals.length;
  const approved = proposals.filter((p) => p.status === 'approved').length;
  const rejected = proposals.filter((p) => p.status === 'rejected').length;
  const pending = proposals.filter((p) => p.status === 'pending').length;

  const totalAmount = proposals
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + (p.requestedAmount || 0), 0);

  return {
    total,
    approved,
    rejected,
    pending,
    successRate: total > 0 ? (approved / total) * 100 : 0,
    totalAmount,
  };
}

interface CategoryAccumulator {
  category: string;
  proposals: number;
  approved: number;
  rejected: number;
  pending: number;
  totalFunded: number;
}

function recalculateCategoryStats(proposals: AnalyticsProposal[]): CategoryStats[] {
  const categoryMap = new Map<string, CategoryAccumulator>();

  proposals.forEach((p: AnalyticsProposal) => {
    const cat = p.category || 'Other';
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, {
        category: cat,
        proposals: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        totalFunded: 0,
      });
    }

    const stats = categoryMap.get(cat);
    stats.proposals += 1;

    if (p.status === 'approved') {
      stats.approved += 1;
      stats.totalFunded += p.requestedAmount || 0;
    } else if (p.status === 'rejected') {
      stats.rejected += 1;
    } else {
      stats.pending += 1;
    }
  });

  return Array.from(categoryMap.values())
    .map((stats) => ({
      ...stats,
      successRate:
        stats.proposals > 0 ? (stats.approved / stats.proposals) * 100 : 0,
    }))
    .sort((a, b) => b.proposals - a.proposals);
}

function recalculateVoterStats(proposals: any[]) {
  const voterMap = new Map<string, number>();

  proposals.forEach((p) => {
    if (p.votes && Array.isArray(p.votes)) {
      p.votes.forEach((vote: any) => {
        voterMap.set(vote.voter, (voterMap.get(vote.voter) || 0) + 1);
      });
    }
  });

  const totalVoters = voterMap.size;
  const totalVotes = Array.from(voterMap.values()).reduce((a, b) => a + b, 0);

  return {
    totalVoters,
    totalVotes,
    averageVotesPerVoter:
      totalVoters > 0 ? totalVotes / totalVoters : 0,
    uniqueVoters: Array.from(voterMap.keys()),
  };
}

function recalculateVotingPower(proposals: any[]) {
  const stakeMap = new Map<string, number>();

  proposals.forEach((p) => {
    if (p.votes && Array.isArray(p.votes)) {
      p.votes.forEach((vote: any) => {
        const stake = vote.amount || 0;
        stakeMap.set(vote.voter, (stakeMap.get(vote.voter) || 0) + stake);
      });
    }
  });

  const stakes = Array.from(stakeMap.values()).sort((a, b) => b - a);
  const totalStake = stakes.reduce((a, b) => a + b, 0);
  const top10Stake = stakes.slice(0, 10).reduce((a, b) => a + b, 0);

  return {
    totalStake,
    uniqueStakers: stakeMap.size,
    top10Stake,
    whaleConcentration:
      totalStake > 0 ? (top10Stake / totalStake) * 100 : 0,
    distribution: stakes,
  };
}

export function exportAnalyticsToCSV(
  data: AnalyticsData,
  filename: string = 'governance-analytics.csv'
) {
  const headers = [
    'Proposal ID',
    'Title',
    'Status',
    'Category',
    'Created At',
    'Updated At',
    'Requested Amount (STX)',
    'Votes',
    'Voters',
  ];

  const rows = data.proposals.map((p) => [
    p.id,
    p.title,
    p.status,
    p.category || 'Other',
    p.createdAt,
    p.updatedAt,
    ((p.requestedAmount || 0) / 1_000_000).toFixed(2),
    p.votes?.length || 0,
    new Set(p.votes?.map((v: any) => v.voter) || []).size,
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((r) => r.map((v) => `"${v}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAnalyticsToJSON(
  data: AnalyticsData,
  filename: string = 'governance-analytics.json'
) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
