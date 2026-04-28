import type { Proposal } from '../types/proposal';

export type ProposalStatus =
  | 'active'
  | 'passing'
  | 'failing'
  | 'executed'
  | 'expired'
  | 'executable';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface ProposalStatusInfo {
  status: ProposalStatus;
  label: string;
  description: string;
  variant: StatusVariant;
}

const VOTING_PERIOD_BLOCKS = 432;

/**
 * Determines the current status of a proposal based on voting state and block height
 * @param proposal - The proposal to evaluate
 * @param currentBlockHeight - Current blockchain height
 * @returns Status information including label, description, and variant
 */
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

/**
 * Checks if a proposal is currently in its active voting period
 * @param proposal - The proposal to check
 * @param currentBlockHeight - Current blockchain height
 * @returns True if voting is still active
 */
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

/**
 * Checks if a proposal has passed and is ready for execution
 * @param proposal - The proposal to check
 * @param currentBlockHeight - Current blockchain height
 * @returns True if the proposal can be executed
 */
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

/**
 * Calculates the time remaining in a proposal's voting period
 * @param proposal - The proposal to evaluate
 * @param currentBlockHeight - Current blockchain height
 * @returns Object containing remaining blocks, days, and hours
 */
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

/**
 * Formats the remaining time into a human-readable string
 * @param proposal - The proposal to evaluate
 * @param currentBlockHeight - Current blockchain height
 * @returns Formatted time string
 */
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


/**
 * Returns Tailwind CSS classes for styling a status badge
 * @param status - The proposal status
 * @returns CSS class string for the status
 */
export function getStatusColorClasses(status: ProposalStatus): string {
  const colorMap: Record<ProposalStatus, string> = {
    active: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    passing: 'bg-green-500/10 text-green-500 border-green-500/20',
    failing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    executed: 'bg-green-500/10 text-green-500 border-green-500/20',
    expired: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    executable: 'bg-green-500/10 text-green-500 border-green-500/20',
  };
  return colorMap[status];
}

/**
 * Returns an emoji icon representing the proposal status
 * @param status - The proposal status
 * @returns Emoji string for the status
 */
export function getStatusIcon(status: ProposalStatus): string {
  const iconMap: Record<ProposalStatus, string> = {
    active: '🗳️',
    passing: '✅',
    failing: '⚠️',
    executed: '✓',
    expired: '⏱️',
    executable: '▶️',
  };
  return iconMap[status];
}
