import type { ContractErrorCode, ContractErrorName } from '../types/contract';
import { CONTRACT_ERROR_CODES } from '../types/contract';
import type { ErrorSeverity } from './error-normalizer';

export interface ContractErrorEntry {
  code: ContractErrorCode;
  name: ContractErrorName;
  message: string;
  suggestion: string;
  retryable: boolean;
  severity: ErrorSeverity;
}

const CONTRACT_ERROR_MAP: Record<ContractErrorCode, Omit<ContractErrorEntry, 'code' | 'name'>> = {
  100: {
    message: 'You are not authorized to perform this action.',
    suggestion: 'Make sure you are the proposal creator or have the required permissions.',
    retryable: false,
    severity: 'high',
  },
  101: {
    message: 'The proposal you are looking for does not exist.',
    suggestion: 'Double-check the proposal ID or return to the proposals list.',
    retryable: false,
    severity: 'medium',
  },
  102: {
    message: 'Your staked amount is not enough for this operation.',
    suggestion: 'Stake additional STX before trying again.',
    retryable: false,
    severity: 'medium',
  },
  103: {
    message: 'This proposal has already been executed.',
    suggestion: 'No further action is needed for this proposal.',
    retryable: false,
    severity: 'low',
  },
  104: {
    message: 'You have already voted on this proposal.',
    suggestion: 'Each address can only vote once per proposal.',
    retryable: false,
    severity: 'low',
  },
  105: {
    message: 'The voting period for this proposal has ended.',
    suggestion: 'Voting is no longer accepted. Check the results instead.',
    retryable: false,
    severity: 'medium',
  },
  106: {
    message: 'The voting period is still active.',
    suggestion: 'Wait until voting closes before executing or reclaiming.',
    retryable: true,
    severity: 'medium',
  },
  107: {
    message: 'The proposal did not reach the required quorum.',
    suggestion: 'More votes are needed before execution is allowed.',
    retryable: false,
    severity: 'medium',
  },
  108: {
    message: 'The amount you entered is below the minimum.',
    suggestion: 'Increase the amount to meet the minimum requirement.',
    retryable: false,
    severity: 'medium',
  },
  109: {
    message: 'The amount you entered exceeds the maximum allowed.',
    suggestion: 'Lower the amount and try again.',
    retryable: false,
    severity: 'medium',
  },
  110: {
    message: 'The amount cannot be zero.',
    suggestion: 'Enter a value greater than zero.',
    retryable: false,
    severity: 'low',
  },
  111: {
    message: 'Your account does not have enough STX for this transaction.',
    suggestion: 'Add more STX to your wallet or reduce the amount.',
    retryable: false,
    severity: 'high',
  },
  112: {
    message: 'This proposal has expired and can no longer be acted on.',
    suggestion: 'Consider creating a new proposal if the goal is still relevant.',
    retryable: false,
    severity: 'medium',
  },
  113: {
    message: 'This proposal was cancelled by its creator.',
    suggestion: 'No further action can be taken on a cancelled proposal.',
    retryable: false,
    severity: 'low',
  },
  114: {
    message: 'Your stake is currently locked.',
    suggestion: 'Wait until the lock period ends before withdrawing.',
    retryable: true,
    severity: 'medium',
  },
  115: {
    message: 'A timelock is active on this operation.',
    suggestion: 'The required waiting period has not passed yet. Try again later.',
    retryable: true,
    severity: 'medium',
  },
};

export function getContractErrorByCode(code: number): ContractErrorEntry | null {
  if (!(code in CONTRACT_ERROR_MAP)) {
    return null;
  }
  const numericCode = code as ContractErrorCode;
  const entry = CONTRACT_ERROR_MAP[numericCode];
  return {
    ...entry,
    code: numericCode,
    name: CONTRACT_ERROR_CODES[numericCode],
  };
}

export function getContractErrorByName(name: string): ContractErrorEntry | null {
  const match = Object.entries(CONTRACT_ERROR_CODES).find(
    ([, errorName]) => errorName === name,
  );
  if (!match) {
    return null;
  }
  const numericCode = Number(match[0]) as ContractErrorCode;
  return getContractErrorByCode(numericCode);
}

export function isKnownContractError(code: number): boolean {
  return code in CONTRACT_ERROR_MAP;
}

export function isRetryableContractError(code: number): boolean {
  const entry = getContractErrorByCode(code);
  return entry !== null && entry.retryable;
}
