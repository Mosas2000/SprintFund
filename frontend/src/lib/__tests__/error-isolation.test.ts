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
import { getAllProposals } from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRawProposal(id: number) {
  return {
    proposer: { value: `SP${id}` },
    amount: { value: id * 1000 },
    title: { value: `Proposal ${id}` },
    description: { value: `Description ${id}` },
    'votes-for': { value: id * 10 },
    'votes-against': { value: id },
    executed: { value: false },
    'created-at': { value: 100000 + id },
  };
}

describe('error isolation in batch fetching', () => {
  it('returns successful proposals even when some fail', async () => {
    // Set up: 3 proposals, middle one fails
    mockFetchReadOnly
      .mockResolvedValueOnce({} as never) // count
      .mockResolvedValueOnce({} as never) // proposal 0
      .mockRejectedValueOnce(new Error('network timeout')) // proposal 1 fails
      .mockResolvedValueOnce({} as never); // proposal 2

    mockCvToValue
      .mockReturnValueOnce(3) // count = 3
      .mockReturnValueOnce(makeRawProposal(0))
      .mockReturnValueOnce(makeRawProposal(2));

    const result = await getAllProposals();

    // Should have at least the successful ones
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('returns empty array when all proposals fail', async () => {
    mockFetchReadOnly
      .mockResolvedValueOnce({} as never); // count

    mockCvToValue.mockReturnValueOnce(2);

    // Both proposal fetches fail
    mockFetchReadOnly
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'));

    const result = await getAllProposals();

    expect(result).toEqual([]);
  });

  it('does not throw when individual fetches reject', async () => {
    mockFetchReadOnly
      .mockResolvedValueOnce({} as never); // count

    mockCvToValue.mockReturnValueOnce(1);
    mockFetchReadOnly.mockRejectedValueOnce(new Error('timeout'));

    await expect(getAllProposals()).resolves.not.toThrow();
  });
});
