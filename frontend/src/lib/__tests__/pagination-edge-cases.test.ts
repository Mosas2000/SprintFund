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
import { getProposalPage } from '../stacks';

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

describe('getProposalPage edge cases', () => {
  it('page 0 with total 1 returns the only proposal', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(makeRawProposal(0));

    const result = await getProposalPage(0, 10);
    expect(result.proposals).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('page 0 with custom pageSize 5', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(12);
    for (let i = 11; i >= 7; i--) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getProposalPage(0, 5);
    expect(result.proposals.length).toBeLessThanOrEqual(5);
    expect(result.total).toBe(12);
  });

  it('returns total even for empty page', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(0);

    const result = await getProposalPage(99, 10);
    expect(result.total).toBe(0);
    expect(result.proposals).toEqual([]);
  });
});
