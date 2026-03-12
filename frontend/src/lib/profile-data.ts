import { getAllProposals, getStake } from './stacks';
import { getStxBalance } from './api';
import type { Proposal } from '../types';
import type {
  ProfileStats,
  VoteRecord,
  ActivityEvent,
  UserProfile,
} from '../types/profile';

/* ── Activity event ID generator ──────────────── */

let eventCounter = 0;

function generateEventId(): string {
  eventCounter += 1;
  return `activity-${Date.now()}-${eventCounter}`;
}

/* ── Build activity events from proposals ─────── */

function buildActivityFromProposals(
  proposals: Proposal[],
  address: string,
): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const p of proposals) {
    // If user created this proposal
    if (p.proposer === address) {
      events.push({
        id: generateEventId(),
        type: 'proposal_created',
        label: `Created proposal: ${p.title}`,
        description: `Requested ${formatMicroStx(p.amount)} STX`,
        timestamp: p.createdAt,
        proposalId: p.id,
        amount: p.amount,
      });

      if (p.executed) {
        events.push({
          id: generateEventId(),
          type: 'proposal_executed',
          label: `Proposal executed: ${p.title}`,
          description: `${formatMicroStx(p.amount)} STX transferred`,
          timestamp: p.createdAt + 1, // Slightly after creation for ordering
          proposalId: p.id,
          amount: p.amount,
        });
      }
    }
  }

  return events;
}

/* ── Build vote records from proposals ────────── */

/**
 * Derive voting history from proposal data.
 * Note: Since the contract does not expose individual vote records,
 * we track votes locally via localStorage as a best-effort approach.
 */
export function getLocalVoteHistory(address: string): VoteRecord[] {
  try {
    const raw = localStorage.getItem(`sprintfund-votes-${address}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Save a vote record to localStorage.
 */
export function saveVoteRecord(address: string, record: VoteRecord): void {
  try {
    const existing = getLocalVoteHistory(address);
    // Avoid duplicates
    const isDuplicate = existing.some(
      (v) => v.proposalId === record.proposalId,
    );
    if (isDuplicate) return;

    const updated = [...existing, record];
    localStorage.setItem(`sprintfund-votes-${address}`, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Build activity events from vote records.
 */
function buildActivityFromVotes(votes: VoteRecord[]): ActivityEvent[] {
  return votes.map((v) => ({
    id: generateEventId(),
    type: 'vote_cast' as const,
    label: `Voted ${v.support ? 'For' : 'Against'}: ${v.title}`,
    description: `Weight: ${v.weight} (cost: ${v.weight ** 2})`,
    timestamp: v.timestamp,
    proposalId: v.proposalId,
  }));
}

/* ── Compute participation stats ──────────────── */

function computeStats(
  stxBalance: number,
  stakedAmount: number,
  userProposals: Proposal[],
  allProposals: Proposal[],
  votes: VoteRecord[],
  commentCount: number,
): ProfileStats {
  const proposalsExecuted = userProposals.filter((p) => p.executed).length;
  const totalVoteWeight = votes.reduce((sum, v) => sum + v.weight, 0);
  const participationRate = allProposals.length > 0
    ? Math.round((votes.length / allProposals.length) * 100)
    : 0;

  return {
    stxBalance,
    stakedAmount,
    proposalsCreated: userProposals.length,
    proposalsExecuted,
    totalVotesCast: votes.length,
    totalComments: commentCount,
    totalVoteWeight,
    votingParticipationRate: Math.min(participationRate, 100),
  };
}

/* ── Format micro-STX for display in events ───── */

function formatMicroStx(micro: number): string {
  return (micro / 1_000_000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ── Main profile data fetcher ────────────────── */

/**
 * Fetch all data needed for the user profile page.
 * Composes on-chain data with local vote/comment history.
 */
export async function fetchUserProfile(
  address: string,
  commentCount: number = 0,
): Promise<UserProfile> {
  const [stxBalance, stakedAmount, allProposals] = await Promise.all([
    getStxBalance(address),
    getStake(address),
    getAllProposals(),
  ]);

  const userProposals = allProposals.filter((p) => p.proposer === address);
  const votes = getLocalVoteHistory(address);

  const stats = computeStats(
    stxBalance,
    stakedAmount,
    userProposals,
    allProposals,
    votes,
    commentCount,
  );

  // Build activity timeline from all sources
  const proposalActivity = buildActivityFromProposals(allProposals, address);
  const voteActivity = buildActivityFromVotes(votes);

  const activity = [...proposalActivity, ...voteActivity]
    .sort((a, b) => b.timestamp - a.timestamp);

  return {
    address,
    stats,
    proposals: userProposals,
    votes,
    activity,
  };
}
