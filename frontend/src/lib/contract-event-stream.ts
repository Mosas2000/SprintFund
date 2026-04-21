import { CONTRACT_PRINCIPAL, API_URL, formatStx } from '@/config';
import { explorerTxUrl, truncateAddress } from './api';
import { encodePathSegment } from './sanitize-url';

export type ContractEventCategory =
  | 'stake'
  | 'proposal'
  | 'vote'
  | 'cancel'
  | 'execute'
  | 'treasury'
  | 'other';

export type ContractEventStatus = 'confirmed' | 'pending' | 'failed';

export interface ContractCallArg {
  name?: string;
  type?: string;
  repr: string;
}

export interface ContractCallPayload {
  contract_id: string;
  function_name: string;
  function_args?: ContractCallArg[];
}

export interface ContractTransaction {
  tx_id: string;
  tx_type: string;
  tx_status: string;
  sender_address: string;
  block_time?: number;
  block_time_iso?: string;
  event_count?: number;
  tx_result?: {
    repr?: string;
  };
  contract_call?: ContractCallPayload;
}

export interface ContractEventRecord {
  id: string;
  txId: string;
  category: ContractEventCategory;
  title: string;
  summary: string;
  senderAddress: string;
  senderLabel: string;
  timestamp: number;
  status: ContractEventStatus;
  functionName: string;
  eventCount: number;
  explorerUrl: string;
  proposalId?: number;
  amount?: number;
  weight?: number;
  support?: boolean;
  errorMessage?: string;
}

export interface ContractEventStreamOptions {
  baseUrl?: string;
  contractPrincipal?: string;
  limit?: number;
  offset?: number;
}

interface AddressTransactionsResponse {
  results?: ContractTransaction[];
}

const EVENT_FUNCTIONS = new Set([
  'stake',
  'withdraw-stake',
  'create-proposal',
  'vote',
  'cancel-proposal',
  'execute-proposal',
  'deposit-treasury',
]);

function normalizeClarityRepr(repr: string): string {
  const stringMatch = repr.match(/^u?"(.*)"$/);
  if (stringMatch) {
    return stringMatch[1];
  }

  if (/^u\d+$/.test(repr)) {
    return repr.slice(1);
  }

  return repr;
}

function parseNumberArg(arg?: ContractCallArg): number | undefined {
  if (!arg) return undefined;

  const value = Number(normalizeClarityRepr(arg.repr));
  return Number.isFinite(value) ? value : undefined;
}

function parseBooleanArg(arg?: ContractCallArg): boolean | undefined {
  if (!arg) return undefined;
  if (arg.repr === 'true') return true;
  if (arg.repr === 'false') return false;
  return undefined;
}

function getCategory(functionName: string): ContractEventCategory {
  switch (functionName) {
    case 'stake':
    case 'withdraw-stake':
      return 'stake';
    case 'create-proposal':
      return 'proposal';
    case 'vote':
      return 'vote';
    case 'cancel-proposal':
      return 'cancel';
    case 'execute-proposal':
      return 'execute';
    case 'deposit-treasury':
      return 'treasury';
    default:
      return 'other';
  }
}

function getTimestamp(tx: ContractTransaction): number {
  if (tx.block_time_iso) {
    const parsed = Date.parse(tx.block_time_iso);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  if (typeof tx.block_time === 'number') {
    return tx.block_time * 1000;
  }

  return Date.now();
}

function buildSummary(tx: ContractTransaction): Omit<ContractEventRecord, 'id' | 'txId' | 'senderAddress' | 'senderLabel' | 'timestamp' | 'status' | 'functionName' | 'eventCount' | 'explorerUrl'> {
  const functionName = tx.contract_call?.function_name ?? 'contract-call';
  const category = getCategory(functionName);
  const args = tx.contract_call?.function_args ?? [];
  const amountArg = parseNumberArg(args[0]);
  const titleArg = args[1] ? normalizeClarityRepr(args[1].repr) : undefined;
  const proposalIdArg = parseNumberArg(args[0]);
  const weightArg = parseNumberArg(args[2]);
  const supportArg = parseBooleanArg(args[1]);
  const status = mapStatus(tx.tx_status);
  const isConfirmed = status === 'confirmed';
  const errorMessage = tx.tx_result?.repr;

  switch (category) {
    case 'stake':
      return {
        category,
        title: isConfirmed ? (functionName === 'withdraw-stake' ? 'Stake withdrawn' : 'Stake confirmed') : 'Stake transaction failed',
        summary: amountArg !== undefined
          ? `${functionName === 'withdraw-stake' ? 'Withdrew' : 'Staked'} ${formatStx(amountArg)} STX`
          : `${functionName === 'withdraw-stake' ? 'Stake withdrawal' : 'Stake'} submitted`,
        amount: amountArg,
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
    case 'proposal':
      return {
        category,
        title: isConfirmed ? 'Proposal created' : 'Proposal creation failed',
        summary: amountArg !== undefined
          ? `Submitted "${titleArg || 'Untitled proposal'}" for ${formatStx(amountArg)} STX`
          : `Submitted "${titleArg || 'Untitled proposal'}"`,
        amount: amountArg,
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
    case 'vote':
      return {
        category,
        title: isConfirmed ? 'Vote recorded' : 'Vote transaction failed',
        summary: [
          `Voted ${supportArg === false ? 'no' : 'yes'}`,
          weightArg !== undefined ? `with weight ${weightArg}` : null,
          proposalIdArg !== undefined ? `on proposal #${proposalIdArg}` : null,
        ].filter(Boolean).join(' '),
        proposalId: proposalIdArg,
        weight: weightArg,
        support: supportArg,
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
    case 'cancel':
      return {
        category,
        title: isConfirmed ? 'Proposal cancelled' : 'Cancellation failed',
        summary: proposalIdArg !== undefined ? `Cancelled proposal #${proposalIdArg}` : 'Cancelled a proposal',
        proposalId: proposalIdArg,
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
    case 'execute':
      return {
        category,
        title: isConfirmed ? 'Proposal executed' : 'Execution failed',
        summary: proposalIdArg !== undefined ? `Executed proposal #${proposalIdArg}` : 'Executed a proposal',
        proposalId: proposalIdArg,
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
    case 'treasury':
      return {
        category,
        title: isConfirmed ? 'Treasury funded' : 'Treasury deposit failed',
        summary: amountArg !== undefined
          ? `Deposited ${formatStx(amountArg)} STX into the treasury`
          : 'Deposited funds into the treasury',
        amount: amountArg,
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
    default:
      return {
        category: 'other',
        title: isConfirmed ? 'Contract interaction' : 'Contract interaction failed',
        summary: functionName.replace(/-/g, ' '),
        errorMessage: status === 'failed' ? errorMessage : undefined,
      };
  }
}

function mapStatus(txStatus: string): ContractEventStatus {
  switch (txStatus) {
    case 'success':
      return 'confirmed';
    case 'pending':
      return 'pending';
    default:
      return 'failed';
  }
}

export function normalizeContractTransaction(
  tx: ContractTransaction,
  contractPrincipal: string = CONTRACT_PRINCIPAL,
): ContractEventRecord | null {
  if (tx.tx_type !== 'contract_call') {
    return null;
  }

  const contractId = tx.contract_call?.contract_id;
  const functionName = tx.contract_call?.function_name;

  if (!contractId || !functionName || !EVENT_FUNCTIONS.has(functionName)) {
    return null;
  }

  if (contractId !== contractPrincipal) {
    return null;
  }

  const status = mapStatus(tx.tx_status);
  const summary = buildSummary(tx);
  const timestamp = getTimestamp(tx);

  return {
    id: tx.tx_id,
    txId: tx.tx_id,
    senderAddress: tx.sender_address,
    senderLabel: truncateAddress(tx.sender_address),
    timestamp,
    status,
    functionName,
    eventCount: tx.event_count ?? 0,
    explorerUrl: explorerTxUrl(tx.tx_id),
    ...summary,
  };
}

export async function fetchContractEventStream(
  options: ContractEventStreamOptions = {},
): Promise<ContractEventRecord[]> {
  const baseUrl = options.baseUrl ?? API_URL;
  const contractPrincipal = options.contractPrincipal ?? CONTRACT_PRINCIPAL;
  const limit = Math.max(1, options.limit ?? 12);
  const offset = Math.max(0, options.offset ?? 0);

  const response = await fetch(
    `${baseUrl}/extended/v1/address/${encodePathSegment(contractPrincipal)}/transactions?limit=${limit}&offset=${offset}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch contract activity: ${response.statusText}`);
  }

  const data = (await response.json()) as AddressTransactionsResponse;
  const results = data.results ?? [];

  return results
    .map((tx) => normalizeContractTransaction(tx, contractPrincipal))
    .filter((event): event is ContractEventRecord => event !== null)
    .sort((a, b) => b.timestamp - a.timestamp);
}
