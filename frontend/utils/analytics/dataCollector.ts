import { fetchCallReadOnlyFunction, cvToValue } from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { retryTransaction } from '../retry';

const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
const CONTRACT_NAME = 'sprintfund-core';
const NETWORK = STACKS_MAINNET;
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_KEY_PREFIX = 'sprintfund_analytics_';
const PAGE_SIZE = 50;

export interface ProposalMetrics {
  proposalId: number;
  title: string;
  category: string;
  amount: number;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  uniqueVoters: number;
  voteVelocity: number;
  momentum: number;
  createdAt: number;
  deadline: number;
  executed: boolean;
  executedAt?: number;
  timeToFunding?: number;
}

export interface VoterMetrics {
  address: string;
  totalVotes: number;
  averageWeight: number;
  categories: string[];
  successRate: number;
  participationRate: number;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  stale: boolean;
}

interface RawProposalData {
  proposer: string;
  amount: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: number;
}

interface VoteData {
  weight: number;
  support: boolean;
  timestamp: number;
  voter: string;
}

function getCacheKey(key: string): string {
  return `${CACHE_KEY_PREFIX}${key}`;
}

function getCachedData<T>(key: string): CachedData<T> | null {
  try {
    const cached = localStorage.getItem(getCacheKey(key));
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    const stale = age > CACHE_TTL;

    return {
      data: parsed.data,
      timestamp: parsed.timestamp,
      stale,
    };
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(
      getCacheKey(key),
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn('Failed to cache data:', error);
  }
}

async function fetchWithRetry<T>(fn: () => Promise<T>, attempts: number = 3): Promise<T> {
  return retryTransaction(fn, attempts, 1000);
}

async function fetchProposalCount(): Promise<number> {
  const result = await fetchWithRetry(async () => {
    const response = await fetchCallReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'get-proposal-count',
      functionArgs: [],
      senderAddress: CONTRACT_ADDRESS,
    });

    const value = cvToValue(response);
    return typeof value === 'number' ? value : (value?.value || 0);
  });

  return result;
}

async function fetchRawProposal(proposalId: number): Promise<RawProposalData | null> {
  try {
    const result = await fetchWithRetry(async () => {
      const response = await fetchCallReadOnlyFunction({
        network: NETWORK,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'get-proposal',
        functionArgs: [{ type: 'uint', value: proposalId }],
        senderAddress: CONTRACT_ADDRESS,
      });

      return cvToValue(response);
    });

    if (!result) return null;

    return {
      proposer: result.proposer?.value || result.proposer,
      amount: parseInt(result.amount?.value || result.amount),
      title: result.title?.value || result.title,
      description: result.description?.value || result.description,
      votesFor: parseInt(result['votes-for']?.value || result['votes-for'] || 0),
      votesAgainst: parseInt(result['votes-against']?.value || result['votes-against'] || 0),
      executed: result.executed?.value ?? result.executed,
      createdAt: parseInt(result['created-at']?.value || result['created-at']),
    };
  } catch {
    return null;
  }
}

function extractCategory(description: string): string {
  const categories = ['development', 'marketing', 'community', 'infrastructure', 'education', 'research'];
  const lowerDesc = description.toLowerCase();

  for (const category of categories) {
    if (lowerDesc.includes(category)) {
      return category;
    }
  }

  return 'other';
}

function calculateVoteVelocity(votes: VoteData[], createdAt: number): number {
  if (votes.length === 0) return 0;

  const now = Date.now();
  const createdTime = createdAt * 10 * 60 * 1000;
  const hoursElapsed = (now - createdTime) / (1000 * 60 * 60);

  if (hoursElapsed === 0) return 0;

  return votes.length / hoursElapsed;
}

function calculateMomentum(votes: VoteData[]): number {
  if (votes.length < 2) return 0;

  const sortedVotes = [...votes].sort((a, b) => a.timestamp - b.timestamp);
  const midpoint = Math.floor(sortedVotes.length / 2);

  const firstHalf = sortedVotes.slice(0, midpoint);
  const secondHalf = sortedVotes.slice(midpoint);

  const firstHalfRate = firstHalf.length;
  const secondHalfRate = secondHalf.length;

  if (firstHalfRate === 0) return secondHalfRate;

  return (secondHalfRate - firstHalfRate) / firstHalfRate;
}

function getUniqueVoters(votes: VoteData[]): number {
  const uniqueAddresses = new Set(votes.map(v => v.voter));
  return uniqueAddresses.size;
}

async function fetchProposalVotes(proposalId: number): Promise<VoteData[]> {
  return [];
}

async function parseProposal(proposalId: number, rawData: RawProposalData): Promise<ProposalMetrics> {
  const votes = await fetchProposalVotes(proposalId);
  const category = extractCategory(rawData.description);
  const totalVotes = rawData.votesFor + rawData.votesAgainst;
  const voteVelocity = calculateVoteVelocity(votes, rawData.createdAt);
  const momentum = calculateMomentum(votes);
  const uniqueVoters = getUniqueVoters(votes);

  const votingPeriod = 144 * 10;
  const deadline = rawData.createdAt + votingPeriod;

  let timeToFunding: number | undefined;
  if (rawData.executed) {
    const executedAt = deadline;
    timeToFunding = (executedAt - rawData.createdAt) / 6;
  }

  return {
    proposalId,
    title: rawData.title,
    category,
    amount: rawData.amount,
    votesFor: rawData.votesFor,
    votesAgainst: rawData.votesAgainst,
    totalVotes,
    uniqueVoters,
    voteVelocity,
    momentum,
    createdAt: rawData.createdAt,
    deadline,
    executed: rawData.executed,
    executedAt: rawData.executed ? deadline : undefined,
    timeToFunding,
  };
}

export async function fetchAllProposals(
  useCache: boolean = true,
  onProgress?: (current: number, total: number) => void
): Promise<ProposalMetrics[]> {
  const cacheKey = 'all_proposals';

  if (useCache) {
    const cached = getCachedData<ProposalMetrics[]>(cacheKey);
    if (cached && !cached.stale) {
      return cached.data;
    }
  }

  try {
    const totalCount = await fetchProposalCount();
    const proposals: ProposalMetrics[] = [];

    for (let page = 0; page < Math.ceil(totalCount / PAGE_SIZE); page++) {
      const start = page * PAGE_SIZE;
      const end = Math.min(start + PAGE_SIZE, totalCount);

      const pagePromises = [];
      for (let i = start; i < end; i++) {
        pagePromises.push(
          fetchRawProposal(i).then(async (rawData) => {
            if (rawData) {
              return await parseProposal(i, rawData);
            }
            return null;
          })
        );
      }

      const pageResults = await Promise.all(pagePromises);
      const validResults = pageResults.filter((p): p is ProposalMetrics => p !== null);
      proposals.push(...validResults);

      if (onProgress) {
        onProgress(proposals.length, totalCount);
      }
    }

    setCachedData(cacheKey, proposals);
    return proposals;
  } catch (error) {
    const cached = getCachedData<ProposalMetrics[]>(cacheKey);
    if (cached) {
      console.warn('Using stale cached data due to fetch error:', error);
      return cached.data;
    }
    throw error;
  }
}

export async function fetchVoterMetrics(proposals: ProposalMetrics[]): Promise<VoterMetrics[]> {
  const cacheKey = 'voter_metrics';

  const cached = getCachedData<VoterMetrics[]>(cacheKey);
  if (cached && !cached.stale) {
    return cached.data;
  }

  const voterMap = new Map<string, {
    totalVotes: number;
    totalWeight: number;
    categories: Set<string>;
    votedYesOn: number;
    votedYesPassed: number;
  }>();

  const totalProposals = proposals.length;

  proposals.forEach(proposal => {
    const votes = [];

    votes.forEach(vote => {
      const existing = voterMap.get(vote.voter) || {
        totalVotes: 0,
        totalWeight: 0,
        categories: new Set(),
        votedYesOn: 0,
        votedYesPassed: 0,
      };

      existing.totalVotes++;
      existing.totalWeight += vote.weight;
      existing.categories.add(proposal.category);

      if (vote.support) {
        existing.votedYesOn++;
        if (proposal.executed) {
          existing.votedYesPassed++;
        }
      }

      voterMap.set(vote.voter, existing);
    });
  });

  const voterMetrics: VoterMetrics[] = Array.from(voterMap.entries()).map(([address, data]) => ({
    address,
    totalVotes: data.totalVotes,
    averageWeight: data.totalWeight / data.totalVotes,
    categories: Array.from(data.categories),
    successRate: data.votedYesOn > 0 ? (data.votedYesPassed / data.votedYesOn) * 100 : 0,
    participationRate: (data.totalVotes / totalProposals) * 100,
  }));

  setCachedData(cacheKey, voterMetrics);
  return voterMetrics;
}

export function clearAnalyticsCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear analytics cache:', error);
  }
}

export function getCacheStatus(): { isCached: boolean; isStale: boolean; age: number } {
  const cached = getCachedData<any>('all_proposals');

  if (!cached) {
    return { isCached: false, isStale: false, age: 0 };
  }

  const age = Date.now() - cached.timestamp;
  return {
    isCached: true,
    isStale: cached.stale,
    age,
  };
}
