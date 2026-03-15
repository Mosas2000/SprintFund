import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@stacks/transactions', () => ({
  fetchCallReadOnlyFunction: vi.fn(),
  cvToValue: vi.fn(),
  uintCV: vi.fn((n: number) => ({ type: 'uint', value: n })),
  principalCV: vi.fn((s: string) => ({ type: 'principal', value: s })),
  stringUtf8CV: vi.fn((s: string) => ({ type: 'string-utf8', value: s })),
  boolCV: vi.fn((b: boolean) => ({ type: 'bool', value: b })),
}));

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

vi.mock('../sanitize', () => ({
  sanitizeText: vi.fn((s: string) => s),
  sanitizeMultilineText: vi.fn((s: string) => s),
}));

import { fetchCallReadOnlyFunction, cvToValue } from '@stacks/transactions';
import { getStake, getMinStakeAmount } from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getStake with batch context', () => {
  it('returns stake amount for valid address', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce({ amount: { value: 50_000_000 } });

    const stake = await getStake('SP1TEST');
    expect(stake).toBe(50_000_000);
  });

  it('returns 0 when user has no stake', async () => {
    mockFetchReadOnly.mockRejectedValueOnce(new Error('not found'));

    const stake = await getStake('SP1NEW');
    expect(stake).toBe(0);
  });

  it('returns 0 when result is null', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce(null);

    const stake = await getStake('SP1EMPTY');
    expect(stake).toBe(0);
  });
});

describe('getMinStakeAmount', () => {
  it('returns numeric amount', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce(10_000_000);

    const min = await getMinStakeAmount();
    expect(min).toBe(10_000_000);
  });

  it('returns default on failure', async () => {
    mockFetchReadOnly.mockRejectedValueOnce(new Error('fail'));

    const min = await getMinStakeAmount();
    expect(min).toBe(10_000_000);
  });
});
