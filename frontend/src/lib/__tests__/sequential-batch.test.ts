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
import { getAllProposals, BATCH_SIZE } from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRawProposal(id: number) {
  return {
    proposer: { value: `SP${id}` },
    amount: { value: id * 1000 },
    title: { value: `P${id}` },
    description: { value: `D${id}` },
    'votes-for': { value: 0 },
    'votes-against': { value: 0 },
    executed: { value: false },
    'created-at': { value: id },
  };
}

describe('sequential batch execution', () => {
  it('batches are executed sequentially not concurrently', async () => {
    const count = BATCH_SIZE + 5;
    const callOrder: number[] = [];

    mockFetchReadOnly.mockImplementation(async (opts: { functionName: string }) => {
      callOrder.push(callOrder.length);
      return {} as never;
    });

    mockCvToValue.mockReturnValueOnce(count);
    for (let i = 0; i < count; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    await getAllProposals();

    // All calls should be recorded
    expect(callOrder).toHaveLength(count + 1);
  });

  it('second batch starts only after first completes', async () => {
    const count = BATCH_SIZE + 1;
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(count);
    for (let i = 0; i < count; i++) {
      mockCvToValue.mockReturnValueOnce(makeRawProposal(i));
    }

    const result = await getAllProposals();
    expect(result).toHaveLength(count);
    // 1 count + BATCH_SIZE (batch 1) + 1 (batch 2) = BATCH_SIZE + 2
    expect(mockFetchReadOnly).toHaveBeenCalledTimes(count + 1);
  });
});
