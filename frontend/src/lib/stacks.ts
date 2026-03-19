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
import { blockchainCache } from './blockchain-cache';
import type { Proposal, ProposalPage } from '../types';
import type {
  ProposalCountResponse,
  ProposalResponse,
  StakeResponse,
  MinStakeResponse,
  TxCallbacks,
  RawProposal,
  RawStake,
} from '../types/contract';
import {
  validateRawProposal,
  rawProposalToProposal,
  validateProposalCount,
  validateStxAmount,
  validateRawStake,
  unwrapClarityValue,
} from './validators';

/* ═══════════════════════════════════════════════
   Read-only helpers
   ═══════════════════════════════════════════════ */

/**
 * Generic typed read-only function caller.
 * Handles Stacks SDK integration and error management.
 */
async function readOnly<T>(
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

type ProposalFetchOptions = {
  forceRefresh?: boolean;
  batchSize?: number;
};

type ProposalPageOptions = ProposalFetchOptions & {
  page?: number;
  pageSize?: number;
};

function chunk<T>(items: T[], size: number): T[][] {
  const safeSize = Math.max(1, size);
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += safeSize) {
    chunks.push(items.slice(i, i + safeSize));
  }
  return chunks;
}

async function fetchAndCacheProposalIds(ids: number[], options?: ProposalFetchOptions): Promise<void> {
  const forceRefresh = options?.forceRefresh ?? false;
  const batchSize = Math.max(1, options?.batchSize ?? 10);

  const idsToFetch = forceRefresh
    ? ids
    : ids.filter((proposalId) => blockchainCache.getProposal(proposalId) === null);

  if (idsToFetch.length === 0) {
    return;
  }

  for (const batch of chunk(idsToFetch, batchSize)) {
    const settled = await Promise.allSettled(batch.map((proposalId) => getProposal(proposalId)));
    settled.forEach((result, index) => {
      if (result.status !== 'fulfilled') {
        return;
      }
      const proposal = result.value;
      if (!proposal) {
        return;
      }
      blockchainCache.setProposal(batch[index], proposal);
    });
  }
}

/* ═══════════════════════════════════════════════
   Read-only API
   ═══════════════════════════════════════════════ */

export async function getProposalCount(options?: { forceRefresh?: boolean }): Promise<number> {
  const forceRefresh = options?.forceRefresh ?? false;
  if (!forceRefresh) {
    const cached = blockchainCache.getProposalCount();
    if (cached !== null) {
      return cached;
    }
  }

  const raw = await readOnly<ProposalCountResponse>('get-proposal-count', []);
  const value = validateProposalCount(raw) ?? 0;
  blockchainCache.setProposalCount(value);

  return value;
}

export async function getProposal(id: number): Promise<Proposal | null> {
  const raw = await readOnly<ProposalResponse>('get-proposal', [uintCV(id)]);
  if (!raw) return null;

  const validated = validateRawProposal(raw);
  if (!validated) return null;

  const rawTitle = unwrapClarityValue(validated.title as { value: string }) ?? '';
  const rawDescription = unwrapClarityValue(validated.description as { value: string }) ?? '';

  return {
    ...rawProposalToProposal(id, validated),
    title: sanitizeText(rawTitle),
    description: sanitizeMultilineText(rawDescription),
  };
}

export async function getAllProposals(options?: ProposalFetchOptions): Promise<Proposal[]> {
  const count = await getProposalCount({ forceRefresh: options?.forceRefresh });
  if (count === 0) return [];

  const idsDescending = Array.from({ length: count }, (_, i) => count - 1 - i);
  await fetchAndCacheProposalIds(idsDescending, options);
  return idsDescending
    .map((proposalId) => blockchainCache.getProposal(proposalId))
    .filter((proposal): proposal is Proposal => proposal !== null);
}

export async function getProposalsPage(options?: ProposalPageOptions): Promise<ProposalPage> {
  const pageSize = Math.max(1, options?.pageSize ?? 10);
  const requestedPage = Math.max(1, options?.page ?? 1);
  const forceRefresh = options?.forceRefresh ?? false;

  if (!forceRefresh) {
    const cached = blockchainCache.getProposalPage(requestedPage, pageSize);
    if (cached !== null) {
      return cached;
    }
  }

  const totalCount = await getProposalCount({ forceRefresh });

  if (totalCount === 0) {
    const emptyPage: ProposalPage = {
      proposals: [],
      totalCount: 0,
      page: 1,
      pageSize,
      totalPages: 1,
    };
    blockchainCache.setProposalPage(1, pageSize, emptyPage);
    return emptyPage;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const startOffset = (page - 1) * pageSize;
  const firstId = totalCount - 1 - startOffset;
  const ids: number[] = [];
  for (let id = firstId; id >= 0 && ids.length < pageSize; id -= 1) {
    ids.push(id);
  }

  await fetchAndCacheProposalIds(ids, options);

  const proposalPage: ProposalPage = {
    proposals: ids
      .map((proposalId) => blockchainCache.getProposal(proposalId))
      .filter((proposal): proposal is Proposal => proposal !== null),
    totalCount,
    page,
    pageSize,
    totalPages,
  };

  blockchainCache.setProposalPage(page, pageSize, proposalPage);
  return proposalPage;
}

export async function getStake(address: string): Promise<number> {
  const cached = blockchainCache.getStake(address);
  if (cached !== null) {
    return cached;
  }

  const raw = await readOnly<StakeResponse>('get-stake', [principalCV(address)]);
  if (!raw) return 0;

  const validated = validateRawStake(raw);
  if (!validated) return 0;

  const amount = unwrapClarityValue(validated.amount) ?? 0;
  const validatedAmount = validateStxAmount(amount) ?? 0;
  blockchainCache.setStake(address, validatedAmount);
  return validatedAmount;
}

export async function getMinStakeAmount(): Promise<number> {
  const cached = blockchainCache.getMinStakeAmount();
  if (cached !== null) {
    return cached;
  }

  const raw = await readOnly<MinStakeResponse>('get-min-stake-amount', []);
  const amount = validateStxAmount(raw) ?? 10_000_000;
  blockchainCache.setMinStakeAmount(amount);
  return amount;
}

/* ═══════════════════════════════════════════════
   Write (transaction) functions – using @stacks/connect v8 request() API
   ═══════════════════════════════════════════════ */

/**
 * Execute a contract call with callbacks for completion or cancellation.
 */
async function contractCall(opts: {
  functionName: string;
  functionArgs: unknown[];
  cb: TxCallbacks;
}): Promise<void> {
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

/**
 * Submit a stake transaction.
 * @param amount Amount to stake in microSTX
 * @param cb Callbacks for transaction completion or cancellation
 */
export function callStake(amount: number, cb: TxCallbacks): void {
  contractCall({ functionName: 'stake', functionArgs: [uintCV(amount)], cb });
}

/**
 * Submit a stake withdrawal transaction.
 * @param amount Amount to withdraw in microSTX
 * @param cb Callbacks for transaction completion or cancellation
 */
export function callWithdrawStake(amount: number, cb: TxCallbacks): void {
  contractCall({ functionName: 'withdraw-stake', functionArgs: [uintCV(amount)], cb });
}

/**
 * Submit a proposal creation transaction.
 * @param amount Requested funding amount in microSTX
 * @param title Proposal title
 * @param description Proposal description
 * @param cb Callbacks for transaction completion or cancellation
 */
export async function callCreateProposal(
  amount: number,
  title: string,
  description: string,
  cb: TxCallbacks,
): Promise<void> {
  return contractCall({
    functionName: 'create-proposal',
    functionArgs: [uintCV(amount), stringUtf8CV(title), stringUtf8CV(description)],
    cb,
  });
}

/**
 * Submit a vote transaction.
 * @param proposalId ID of the proposal to vote on
 * @param support True for yes vote, false for no vote
 * @param weight Number of STX to use as voting weight
 * @param cb Callbacks for transaction completion or cancellation
 */
export function callVote(
  proposalId: number,
  support: boolean,
  weight: number,
  cb: TxCallbacks,
): void {
  contractCall({
    functionName: 'vote',
    functionArgs: [uintCV(proposalId), boolCV(support), uintCV(weight)],
    cb,
  });
}

/**
 * Submit a proposal execution transaction.
 * @param proposalId ID of the proposal to execute
 * @param cb Callbacks for transaction completion or cancellation
 */
export function callExecuteProposal(proposalId: number, cb: TxCallbacks): void {
  contractCall({
    functionName: 'execute-proposal',
    functionArgs: [uintCV(proposalId)],
    cb,
  });
}

export function invalidateProposalCache(proposalId: number): void {
  blockchainCache.invalidateProposal(proposalId);
}

export function invalidateProposalPagesCache(): void {
  blockchainCache.invalidateProposalPages();
}

export function invalidateProposalCountCache(): void {
  blockchainCache.invalidateProposalCount();
}

export function invalidateStakeCache(address: string): void {
  blockchainCache.invalidateStake(address);
}

export function invalidateAllBlockchainCache(): void {
  blockchainCache.invalidateAll();
}
