import type { Proposal } from '../types/proposal';

export type ProposalStatus =
  | 'active'
  | 'passing'
  | 'failing'
  | 'executed'
  | 'expired'
  | 'executable';

export interface ProposalStatusInfo {
  status: ProposalStatus;
  label: string;
  description: string;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const VOTING_PERIOD_BLOCKS = 432;

export function getProposalStatus(
  proposal: Proposal,
  currentBlockHeight: number
): ProposalStatusInfo {
  if (proposal.executed) {
    return {
      status: 'executed',
      label: 'Executed',
      description: 'This proposal has been executed and funds have been distributed',
      variant: 'success',
    };
  }

  const votingEndsAt = proposal.votingEndsAt || proposal.createdAt + VOTING_PERIOD_BLOCKS;
  const votingEnded = currentBlockHeight > votingEndsAt;
  const hasVotes = proposal.votesFor > 0 || proposal.votesAgainst > 0;
  const isPassing = proposal.votesFor > proposal.votesAgainst;

  if (votingEnded) {
    const executionAllowedAt = proposal.executionAllowedAt || votingEndsAt;
    const canExecuteNow = currentBlockHeight >= executionAllowedAt;

    if (isPassing && hasVotes) {
      if (canExecuteNow) {
        return {
          status: 'executable',
          label: 'Executable',
          description: 'This proposal passed and is ready to be executed',
          variant: 'success',
        };
      } else {
        return {
          status: 'passing',
          label: 'Passed',
          description: 'This proposal passed but is in timelock period',
          variant: 'info',
        };
      }
    } else {
      return {
        status: 'expired',
        label: 'Expired',
        description: 'Voting period ended without passing',
        variant: 'neutral',
      };
    }
  }

  if (hasVotes) {
    if (isPassing) {
      return {
        status: 'passing',
        label: 'Passing',
        description: 'Currently has more votes for than against',
        variant: 'success',
      };
    } else {
      return {
        status: 'failing',
        label: 'Failing',
        description: 'Currently has more votes against than for',
        variant: 'warning',
      };
    }
  }

  return {
    status: 'active',
    label: 'Active',
    description: 'Open for voting',
    variant: 'info',
  };
}

export function isProposalActive(
  proposal: Proposal,
  currentBlockHeight: number
): boolean {
  if (proposal.executed) {
    return false;
  }

  const votingEndsAt = proposal.votingEndsAt || proposal.createdAt + VOTING_PERIOD_BLOCKS;
  return currentBlockHeight <= votingEndsAt;
}

export function isProposalExecutable(
  proposal: Proposal,
  currentBlockHeight: number
): boolean {
  if (proposal.executed) {
    return false;
  }

  const votingEndsAt = proposal.votingEndsAt || proposal.createdAt + VOTING_PERIOD_BLOCKS;
  const votingEnded = currentBlockHeight > votingEndsAt;
  const isPassing = proposal.votesFor > proposal.votesAgainst;
  const hasVotes = proposal.votesFor > 0 || proposal.votesAgainst > 0;

  if (!votingEnded || !isPassing || !hasVotes) {
    return false;
  }

  const executionAllowedAt = proposal.executionAllowedAt || votingEndsAt;
  return currentBlockHeight >= executionAllowedAt;
}

export function getTimeRemaining(
  proposal: Proposal,
  currentBlockHeight: number
): { blocks: number; days: number; hours: number } {
  const votingEndsAt = proposal.votingEndsAt || proposal.createdAt + VOTING_PERIOD_BLOCKS;
  const blocksRemaining = Math.max(0, votingEndsAt - currentBlockHeight);
  const minutesRemaining = blocksRemaining * 10;
  const hoursRemaining = Math.floor(minutesRemaining / 60);
  const daysRemaining = Math.floor(hoursRemaining / 24);

  return {
    blocks: blocksRemaining,
    days: daysRemaining,
    hours: hoursRemaining % 24,
  };
}

export function formatTimeRemaining(
  proposal: Proposal,
  currentBlockHeight: number
): string {
  const { days, hours } = getTimeRemaining(proposal, currentBlockHeight);

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h remaining`;
  } else {
    return 'Ending soon';
  }
}
