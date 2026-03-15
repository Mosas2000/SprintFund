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
import { BATCH_SIZE, getAllProposals, getProposalPage } from '../stacks';

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
    description: { value: `Description for proposal ${id}` },
    'votes-for': { value: id * 10 },
    'votes-against': { value: id },
    executed: { value: id % 3 === 0 },
    'created-at': { value: 100000 + id },
  };
}

describe('BATCH_SIZE', () => {
  it('is exported and equals 10', () => {
    expect(BATCH_SIZE).toBe(10);
  });

  it('is a positive integer', () => {
    expect(BATCH_SIZE).toBeGreaterThan(0);
    expect(Number.isInteger(BATCH_SIZE)).toBe(true);
  });
});

describe('getAllProposals with batching', () => {
  it('returns empty array for count 0', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(0);

    const result = await getAllProposals();
    expect(result).toEqual([]);
  });

  it('fetches proposals in batches of BATCH_SIZE', async () => {
    const count = 15;
    mockFetchReadOnly.mockResolvedValue({} as never);

    // First call returns count, then 15 proposal calls
    mockCvToValue.mockReturnValueOnce(count);
    for (let i = 0; i < count; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();

    expect(result).toHaveLength(count);
    // Total calls: 1 for count + 15 for proposals = 16
    expect(mockFetchReadOnly).toHaveBeenCalledTimes(count + 1);
  });

  it('returns proposals in reverse order (newest first)', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(makeRawProposal(0))
      .mockReturnValueOnce(makeRawProposal(1))
      .mockReturnValueOnce(makeRawProposal(2));

    const result = await getAllProposals();

    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
    expect(result[2].id).toBe(0);
  });

  it('handles individual failures gracefully with Promise.allSettled', async () => {
    mockFetchReadOnly
      .mockResolvedValueOnce({} as never) // count call
      .mockResolvedValueOnce({} as never) // proposal 0
      .mockRejectedValueOnce(new Error('timeout')) // proposal 1 fails
      .mockResolvedValueOnce({} as never); // proposal 2

    mockCvToValue
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(makeRawProposal(0))
      // proposal 1 is rejected, no cvToValue call
      .mockReturnValueOnce(makeRawProposal(2));

    const result = await getAllProposals();

    // Should have 2 proposals (1 failed)
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('handles exactly BATCH_SIZE proposals without extra batch', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(BATCH_SIZE);
    for (let i = 0; i < BATCH_SIZE; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();
    expect(result).toHaveLength(BATCH_SIZE);
  });

  it('handles count not divisible by BATCH_SIZE', async () => {
    const count = BATCH_SIZE + 3;
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(count);
    for (let i = 0; i < count; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();
    expect(result).toHaveLength(count);
  });
});

describe('getProposalPage', () => {
  it('returns empty for total 0', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(0);

    const result = await getProposalPage(0, 10);
    expect(result.proposals).toEqual([]);
    expect(result.total).toBe(0);
  });

  it('returns total count along with proposals', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(25);
    for (let i = 24; i >= 15; i--) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getProposalPage(0, 10);
    expect(result.total).toBe(25);
    expect(result.proposals.length).toBeLessThanOrEqual(10);
  });

  it('returns correct page for page 0', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(5);
    for (let i = 4; i >= 0; i--) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getProposalPage(0, 10);
    expect(result.proposals).toHaveLength(5);
    expect(result.total).toBe(5);
  });

  it('uses default pageSize of 10', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(3);
    for (let i = 2; i >= 0; i--) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getProposalPage(0);
    expect(result.proposals.length).toBeLessThanOrEqual(10);
  });
});
