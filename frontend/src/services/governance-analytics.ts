import {
  fetchCallReadOnlyFunction,
  cvToValue,
  uintCV,
  principalCV,
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core-v3';
const NETWORK = STACKS_MAINNET;

interface Proposal {
  id: number;
  proposer: string;
  amount: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: number;
  category?: string;
}

export class GovernanceAnalyticsService {
  async fetchAllProposals(): Promise<Proposal[]> {
    try {
      const countResult = await fetchCallReadOnlyFunction({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-proposal-count',
        functionArgs: [],
        senderAddress: CONTRACT_ADDRESS,
      });

      const countValue = cvToValue(countResult);
      const count = typeof countValue === 'number'
        ? countValue
        : countValue?.value || 0;

      if (count === 0) {
        return [];
      }

      const proposals: Proposal[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const result = await fetchCallReadOnlyFunction({
            network: NETWORK,
            contractAddress: CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            functionName: 'get-proposal',
            functionArgs: [uintCV(i)],
            senderAddress: CONTRACT_ADDRESS,
          });

          const proposalValue = cvToValue(result);
          if (proposalValue) {
            const proposal: Proposal = {
              id: i,
              proposer: proposalValue.proposer?.value || proposalValue.proposer,
              amount: parseInt(proposalValue.amount?.value || proposalValue.amount),
              title: proposalValue.title?.value || proposalValue.title,
              description: proposalValue.description?.value || proposalValue.description,
              votesFor: parseInt(proposalValue['votes-for']?.value || proposalValue['votes-for']),
              votesAgainst: parseInt(proposalValue['votes-against']?.value || proposalValue['votes-against']),
              executed: proposalValue.executed?.value ?? proposalValue.executed,
              createdAt: parseInt(proposalValue['created-at']?.value || proposalValue['created-at']),
            };
            proposals.push(proposal);
          }
        } catch (err) {
          console.error(`Error fetching proposal ${i}:`, err);
          continue;
        }
      }

      return proposals;
    } catch (err) {
      console.error('Error fetching proposals:', err);
      return [];
    }
  }

  async getUserStake(address: string): Promise<number> {
    try {
      const result = await fetchCallReadOnlyFunction({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-stake',
        functionArgs: [principalCV(address)],
        senderAddress: CONTRACT_ADDRESS,
      });

      const stakeValue = cvToValue(result);
      if (typeof stakeValue === 'number') {
        return stakeValue;
      }

      const amount = typeof stakeValue === 'object' && stakeValue !== null
        ? (stakeValue.amount as number | undefined)
        : undefined;

      return amount || 0;
    } catch (err) {
      console.error('Error fetching user stake:', err);
      return 0;
    }
  }

  async getAllUserStakes(): Promise<Map<string, number>> {
    const proposals = await this.fetchAllProposals();
    const stakes = new Map<string, number>();

    const uniqueUsers = new Set<string>();
    proposals.forEach((p) => {
      uniqueUsers.add(p.proposer);
    });

    for (const user of uniqueUsers) {
      const stake = await this.getUserStake(user);
      if (stake > 0) {
        stakes.set(user, stake);
      }
    }

    return stakes;
  }

  calculateProposalStats(proposals: Proposal[]) {
    if (proposals.length === 0) {
      return {
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        successRate: 0,
        totalAmount: 0,
        averageAmount: 0,
      };
    }

    const approved = proposals.filter((p) => p.votesFor > p.votesAgainst && p.executed).length;
    const rejected = proposals.filter((p) => p.votesAgainst >= p.votesFor && p.executed).length;
    const pending = proposals.filter((p) => !p.executed).length;

    const totalAmount = proposals.reduce((sum, p) => sum + p.amount, 0);
    const averageAmount = totalAmount / proposals.length;

    return {
      total: proposals.length,
      approved,
      rejected,
      pending,
      successRate: proposals.length > 0 ? (approved / (approved + rejected || 1)) * 100 : 0,
      totalAmount,
      averageAmount,
    };
  }

  calculateCategoryStats(proposals: Proposal[]) {
    const categoryMap = new Map<string, {
      count: number;
      approved: number;
      rejected: number;
      total: number;
    }>();

    proposals.forEach((p) => {
      const category = p.category || 'Other';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, approved: 0, rejected: 0, total: 0 });
      }

      const cat = categoryMap.get(category)!;
      cat.count += 1;
      cat.total += p.amount;

      if (p.executed) {
        if (p.votesFor > p.votesAgainst) {
          cat.approved += 1;
        } else {
          cat.rejected += 1;
        }
      }
    });

    return Array.from(categoryMap.entries()).map(([name, stats]) => ({
      category: name,
      proposals: stats.count,
      approved: stats.approved,
      rejected: stats.rejected,
      totalFunded: stats.total,
      successRate: stats.count > 0
        ? (stats.approved / (stats.approved + stats.rejected || 1)) * 100
        : 0,
    }));
  }

  calculateVoterStats(proposals: Proposal[]) {
    const voters = new Set<string>();
    const voterVotes = new Map<string, number>();
    let totalVotes = 0;

    proposals.forEach((p) => {
      voters.add(p.proposer);
      const votes = p.votesFor + p.votesAgainst;
      totalVotes += votes;

      if (votes > 0) {
        voterVotes.set(p.proposer, (voterVotes.get(p.proposer) || 0) + votes);
      }
    });

    const averageVotesPerVoter = voters.size > 0 ? totalVotes / voters.size : 0;

    return {
      totalVoters: voters.size,
      averageVotesPerVoter,
      totalVotes,
    };
  }

  calculateVotingPowerDistribution(stakes: Map<string, number>) {
    const totalStake = Array.from(stakes.values()).reduce((sum, v) => sum + v, 0);

    const voters = Array.from(stakes.entries())
      .map(([address, amount]) => ({
        address,
        amount,
        percentage: totalStake > 0 ? (amount / totalStake) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const top10 = voters.slice(0, 10);
    const top10Total = top10.reduce((sum, v) => sum + v.amount, 0);
    const whaleConcentration = totalStake > 0 ? (top10Total / totalStake) * 100 : 0;

    return {
      topVoters: top10,
      whaleConcentration,
      totalStake,
      uniqueStakers: stakes.size,
    };
  }

  generateProposalTimeline(proposals: Proposal[]) {
    const timelineMap = new Map<string, {
      created: number;
      approved: number;
      rejected: number;
    }>();

    proposals.forEach((p) => {
      const date = new Date(p.createdAt).toISOString().split('T')[0];
      if (!timelineMap.has(date)) {
        timelineMap.set(date, { created: 0, approved: 0, rejected: 0 });
      }

      const entry = timelineMap.get(date)!;
      entry.created += 1;

      if (p.executed) {
        if (p.votesFor > p.votesAgainst) {
          entry.approved += 1;
        } else {
          entry.rejected += 1;
        }
      }
    });

    return Array.from(timelineMap.entries())
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export const governanceAnalytics = new GovernanceAnalyticsService();
