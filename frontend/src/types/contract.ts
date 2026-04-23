/**
 * Contract-level TypeScript types that mirror the Clarity
 * sprintfund-core contract data structures and responses.
 *
 * These types represent the raw on-chain data shapes returned
 * by Stacks read-only function calls and transaction callbacks.
 */

/* ═══════════════════════════════════════════════
   Clarity value wrappers
   ═══════════════════════════════════════════════ */

/**
 * Clarity values often come wrapped in a { value: T } object
 * from the Stacks SDK cvToValue conversion.
 */
export interface ClarityWrappedValue<T> {
  value: T;
}

/**
 * Union representing a raw Clarity value that may or may not
 * be wrapped in the { value: T } envelope.
 */
export type ClarityValue<T> = T | ClarityWrappedValue<T>;

/* ═══════════════════════════════════════════════
   Raw contract map shapes
   ═══════════════════════════════════════════════ */

/**
 * Raw proposal tuple as stored on-chain in the `proposals` map.
 * Field names use Clarity kebab-case conventions.
 *
 * Map key: { proposal-id: uint }
 */
export interface RawProposal {
  proposer: ClarityValue<string>;
  amount: ClarityValue<number>;
  title: ClarityValue<string>;
  description: ClarityValue<string>;
  'votes-for': ClarityValue<number>;
  'votes-against': ClarityValue<number>;
  executed: ClarityValue<boolean>;
  'created-at': ClarityValue<number>;
  'voting-ends-at': ClarityValue<number>;
  'execution-allowed-at': ClarityValue<number>;
}

/**
 * Raw stake tuple as stored on-chain in the `stakes` map.
 *
 * Map key: { staker: principal }
 */
export interface RawStake {
  amount: ClarityValue<number>;
}

/**
 * Raw vote tuple as stored on-chain in the `votes` map.
 *
 * Map key: { proposal-id: uint, voter: principal }
 */
export interface RawVote {
  weight: ClarityValue<number>;
  support: ClarityValue<boolean>;
}

/* ═══════════════════════════════════════════════
   Read-only function return types
   ═══════════════════════════════════════════════ */

/**
 * Generic response wrapper for Clarity (ok ...) returns.
 * get-proposal-count returns (ok uint), get-min-stake-amount returns (ok uint).
 */
export interface ClarityOkResponse<T> {
  value: T;
}

/**
 * The result of calling a read-only function through the Stacks SDK.
 * The generic parameter T represents the expected deserialized shape.
 */
export type ReadOnlyResult<T> = T | null;

/**
 * Generic shape for read-only function responses from the Stacks API.
 * Some functions return wrapped values, others return unwrapped primitives.
 */
export type RawReadOnlyResponse<T> = T | { value: T } | null;

/* ═══════════════════════════════════════════════
   Transaction types
   ═══════════════════════════════════════════════ */

/**
 * Data received when a transaction finishes (from openContractCall or
 * the @stacks/connect request() API onFinish callback).
 */
export interface TxFinishData {
  txId: string;
}

/**
 * Callbacks passed to contract write functions (stake, vote, etc.).
 */
export interface TxCallbacks {
  onFinish: (txId: string) => void;
  onCancel: () => void;
}

/**
 * Options for building a contract call transaction.
 */
export interface ContractCallOptions {
  functionName: string;
  functionArgs: unknown[];
  cb: TxCallbacks;
}

/* ═══════════════════════════════════════════════
   Error types
   ═══════════════════════════════════════════════ */

/**
 * Known Clarity error codes from the sprintfund-core contract.
 * Maps uint error codes to their semantic meaning.
 */
export const CONTRACT_ERROR_CODES = {
  100: 'ERR-NOT-AUTHORIZED',
  101: 'ERR-PROPOSAL-NOT-FOUND',
  102: 'ERR-INSUFFICIENT-STAKE',
  103: 'ERR-ALREADY-EXECUTED',
  104: 'ERR-ALREADY-VOTED',
  105: 'ERR-VOTING-PERIOD-ENDED',
  106: 'ERR-VOTING-PERIOD-ACTIVE',
  107: 'ERR-QUORUM-NOT-MET',
  108: 'ERR-AMOUNT-TOO-LOW',
  109: 'ERR-AMOUNT-TOO-HIGH',
  110: 'ERR-ZERO-AMOUNT',
  111: 'ERR-INSUFFICIENT-BALANCE',
  112: 'ERR-PROPOSAL-EXPIRED',
} as const;

export type ContractErrorCode = keyof typeof CONTRACT_ERROR_CODES;
export type ContractErrorName = (typeof CONTRACT_ERROR_CODES)[ContractErrorCode];

/**
 * Structured contract error with optional code and message.
 * Used for narrowing caught errors in transaction handlers.
 */
export interface ContractError {
  message: string;
  code?: ContractErrorCode;
  name?: ContractErrorName;
}

/**
 * Network-level error from the Stacks blockchain.
 */
export interface NetworkError {
  message: string;
  status?: number;
  statusText?: string;
}

/**
 * Type guard to check if an unknown error has a message property.
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Extract an error message from an unknown caught value.
 * Falls back to a default message if the value is not an Error.
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
}

/**
 * Type guard to check if an error has an HTTP status property.
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number'
  );
}

/* ═══════════════════════════════════════════════
   API Response Types
   ═══════════════════════════════════════════════ */

/**
 * Generic wrapper for a successful read-only function response.
 * Represents the normalized form after cvToValue processing.
 */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  timestamp: number;
}

/**
 * Error response from API call.
 */
export interface ApiError {
  success: false;
  error: ContractError | NetworkError;
  timestamp: number;
}

/**
 * Union of success and error responses.
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Response from get-proposal-count read-only function.
 */
export type ProposalCountResponse = number;

/**
 * Response from get-proposal read-only function.
 */
export type ProposalResponse = RawProposal;

/**
 * Response from get-stake read-only function.
 */
export type StakeResponse = RawStake;

/**
 * Response from get-min-stake-amount read-only function.
 */
export type MinStakeResponse = number;

/**
 * Paginated list of proposals with metadata.
 */
export interface ProposalListResponse {
  proposals: RawProposal[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Stake information for a user.
 */
export interface StakeInfo {
  staker: string;
  amount: number;
  stakePercentage: number;
  stakedAt?: number;
}

/**
 * User portfolio of stakes across proposals.
 */
export interface UserStakePortfolio {
  address: string;
  totalStaked: number;
  stakes: Map<number, number>;
}

/**
 * Vote information for a specific proposal and voter.
 */
export interface VoteInfo {
  proposalId: number;
  voter: string;
  weight: number;
  support: boolean;
  votedAt: number;
}

/**
 * Contract state snapshot.
 */
export interface ContractState {
  proposalCount: number;
  minStakeAmount: number;
  lastUpdated: number;
}
