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
import { BATCH_SIZE, getAllProposals } from '../stacks';

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

describe('batch chunking behavior', () => {
  it('fetches 1 proposal in 1 batch', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(1).mockReturnValueOnce(makeRawProposal(0));

    const result = await getAllProposals();
    // 1 for count + 1 for proposal = 2
    expect(mockFetchReadOnly).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(1);
  });

  it('fetches BATCH_SIZE proposals in exactly 1 batch', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(BATCH_SIZE);
    for (let i = 0; i < BATCH_SIZE; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();
    expect(mockFetchReadOnly).toHaveBeenCalledTimes(BATCH_SIZE + 1);
    expect(result).toHaveLength(BATCH_SIZE);
  });

  it('fetches BATCH_SIZE+1 proposals in 2 batches', async () => {
    const count = BATCH_SIZE + 1;
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(count);
    for (let i = 0; i < count; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();
    expect(mockFetchReadOnly).toHaveBeenCalledTimes(count + 1);
    expect(result).toHaveLength(count);
  });

  it('fetches 2*BATCH_SIZE proposals in 2 batches', async () => {
    const count = BATCH_SIZE * 2;
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(count);
    for (let i = 0; i < count; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();
    expect(result).toHaveLength(count);
  });

  it('handles single proposal correctly', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(makeRawProposal(0));

    const result = await getAllProposals();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Proposal 0');
  });
});
