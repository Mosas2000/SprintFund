/* ── Contract ─────────────────────────────────── */

export const CONTRACT_ADDRESS = 'SP31PKQVQZVZCK3FM3NH67CGD6G1FMR17VQVS2W5T';
export const CONTRACT_NAME = 'sprintfund-core-v3';
export const CONTRACT_PRINCIPAL = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;
export const NETWORK = 'mainnet' as const;

/* ── API ──────────────────────────────────────── */

export const API_URL = 'https://api.mainnet.hiro.so';
export const EXPLORER_URL = 'https://explorer.hiro.so';

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
