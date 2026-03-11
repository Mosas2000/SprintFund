import {
  fetchCallReadOnlyFunction,
  cvToValue,
  uintCV,
  principalCV,
  stringUtf8CV,
  boolCV,
} from '@stacks/transactions';
import { request } from '@stacks/connect';
import { CONTRACT_ADDRESS, CONTRACT_NAME, CONTRACT_PRINCIPAL, NETWORK } from '../config';
import { sanitizeText, sanitizeMultilineText } from './sanitize';
import type { Proposal } from '../types';

/* ═══════════════════════════════════════════════
   Read-only helpers
   ═══════════════════════════════════════════════ */

async function readOnly<T = unknown>(
  functionName: string,
  functionArgs: Parameters<typeof fetchCallReadOnlyFunction>[0]['functionArgs'],
): Promise<T | null> {
  try {
    const result = await fetchCallReadOnlyFunction({
      network: NETWORK,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      functionArgs,
      senderAddress: CONTRACT_ADDRESS,
    });
    return cvToValue(result) as T;
  } catch (err) {
    console.error(`readOnly(${functionName}) failed:`, err);
    return null;
  }
}

function extractVal(v: Record<string, unknown> | string | number | boolean | null | undefined): unknown {
  if (v === null || v === undefined) return v;
  if (typeof v === 'object' && 'value' in v) return v.value;
  return v;
}

/* ═══════════════════════════════════════════════
   Read-only API
   ═══════════════════════════════════════════════ */

export async function getProposalCount(): Promise<number> {
  const raw = await readOnly<{ value?: number } | number>('get-proposal-count', []);
  if (typeof raw === 'number') return raw;
  return (raw as { value?: number })?.value ?? 0;
}

export async function getProposal(id: number): Promise<Proposal | null> {
  const raw = await readOnly<Record<string, unknown>>('get-proposal', [uintCV(id)]);
  if (!raw) return null;

  const rawTitle = extractVal(raw.title as Record<string, unknown>) as string;
  const rawDescription = extractVal(raw.description as Record<string, unknown>) as string;

  return {
    id,
    proposer: extractVal(raw.proposer as Record<string, unknown>) as string,
    amount: parseInt(String(extractVal(raw.amount as Record<string, unknown>)), 10),
    title: sanitizeText(rawTitle ?? ''),
    description: sanitizeMultilineText(rawDescription ?? ''),
    votesFor: parseInt(String(extractVal(raw['votes-for'] as Record<string, unknown>)), 10),
    votesAgainst: parseInt(String(extractVal(raw['votes-against'] as Record<string, unknown>)), 10),
    executed: extractVal(raw.executed as Record<string, unknown>) as boolean,
    createdAt: parseInt(String(extractVal(raw['created-at'] as Record<string, unknown>)), 10),
  };
}

export async function getAllProposals(): Promise<Proposal[]> {
  const count = await getProposalCount();
  if (count === 0) return [];

  const promises = Array.from({ length: count }, (_, i) => getProposal(i));
  const results = await Promise.all(promises);
  return results.filter((p): p is Proposal => p !== null).reverse();
}

export async function getStake(address: string): Promise<number> {
  const raw = await readOnly<Record<string, unknown>>('get-stake', [principalCV(address)]);
  if (!raw) return 0;
  return parseInt(String(extractVal(raw.amount as Record<string, unknown>)), 10);
}

export async function getMinStakeAmount(): Promise<number> {
  const raw = await readOnly<{ value?: number } | number>('get-min-stake-amount', []);
  if (typeof raw === 'number') return raw;
  return (raw as { value?: number })?.value ?? 10_000_000;
}

/* ═══════════════════════════════════════════════
   Write (transaction) functions – using @stacks/connect v8 request() API
   ═══════════════════════════════════════════════ */

interface TxCallbacks {
  onFinish: (txId: string) => void;
  onCancel: () => void;
}

async function contractCall(opts: {
  functionName: string;
  functionArgs: unknown[];
  cb: TxCallbacks;
}) {
  try {
    console.log('[SprintFund] Calling contract:', {
      contract: CONTRACT_PRINCIPAL,
      functionName: opts.functionName,
      network: NETWORK,
    });
    const result = await request('stx_callContract', {
      contract: CONTRACT_PRINCIPAL as `${string}.${string}`,
      functionName: opts.functionName,
      functionArgs: opts.functionArgs as import('@stacks/transactions').ClarityValue[],
      network: NETWORK,
    });
    console.log('[SprintFund] TX result:', result);
    const txid = result?.txid || '';
    opts.cb.onFinish(txid);
  } catch (err) {
    console.error('[SprintFund] Contract call failed:', err);
    opts.cb.onCancel();
  }
}

export function callStake(amount: number, cb: TxCallbacks) {
  contractCall({ functionName: 'stake', functionArgs: [uintCV(amount)], cb });
}

export function callWithdrawStake(amount: number, cb: TxCallbacks) {
  contractCall({ functionName: 'withdraw-stake', functionArgs: [uintCV(amount)], cb });
}

export async function callCreateProposal(
  amount: number,
  title: string,
  description: string,
  cb: TxCallbacks,
) {
  return contractCall({
    functionName: 'create-proposal',
    functionArgs: [uintCV(amount), stringUtf8CV(title), stringUtf8CV(description)],
    cb,
  });
}

export function callVote(
  proposalId: number,
  support: boolean,
  weight: number,
  cb: TxCallbacks,
) {
  contractCall({
    functionName: 'vote',
    functionArgs: [uintCV(proposalId), boolCV(support), uintCV(weight)],
    cb,
  });
}

export function callExecuteProposal(proposalId: number, cb: TxCallbacks) {
  contractCall({
    functionName: 'execute-proposal',
    functionArgs: [uintCV(proposalId)],
    cb,
  });
}
