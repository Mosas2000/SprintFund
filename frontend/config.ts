/* ── Contract ─────────────────────────────────── */

export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK || 'mainnet') as 'mainnet' | 'testnet';
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SP1W6XQZ6XVYGTVW32SJW2ZG48ZJBW9BATRD19N60';
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || 'sprintfund-core-v4-minimal';
export const CONTRACT_PRINCIPAL = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;

/* ── API ──────────────────────────────────────── */

const API_URLS = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
} as const;

const EXPLORER_URLS = {
  mainnet: 'https://explorer.hiro.so',
  testnet: 'https://explorer.hiro.so', 
} as const;

export const API_URL = process.env.NEXT_PUBLIC_STACKS_API_URL || API_URLS[NETWORK];
export const EXPLORER_URL = EXPLORER_URLS[NETWORK];

/* ── STX conversions ──────────────────────────── */

const MICRO = 1_000_000;

export function microToStx(micro: number): number {
  return micro / MICRO;
}

export function stxToMicro(stx: number): number {
  return Math.floor(stx * MICRO);
}

export function formatStx(micro: number, decimals = 2): string {
  return microToStx(micro).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ── Site metadata ────────────────────────────── */

export const SITE = {
  name: 'SprintFund',
  tagline: 'Fund Ideas. Ship Fast. Govern Together.',
  description:
    'A lightning-fast micro-grants DAO on Stacks. Stake STX, propose ideas, vote with quadratic power.',
} as const;

/* ── Minimum stake ────────────────────────────── */

export const MIN_STAKE_STX = 10;
export const MIN_STAKE_MICRO = MIN_STAKE_STX * MICRO;
