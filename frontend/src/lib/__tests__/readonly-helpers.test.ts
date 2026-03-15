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
import { getProposal, getProposalCount } from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getProposalCount return types', () => {
  it('handles direct number return', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce(42);

    const count = await getProposalCount();
    expect(count).toBe(42);
  });

  it('handles wrapped value return', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce({ value: 10 });

    const count = await getProposalCount();
    expect(count).toBe(10);
  });

  it('returns 0 when value is missing', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce({});

    const count = await getProposalCount();
    expect(count).toBe(0);
  });
});

describe('getProposal field extraction', () => {
  it('extracts all fields correctly', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce({
      proposer: { value: 'SP1ADDR' },
      amount: { value: 5000 },
      title: { value: 'Test Title' },
      description: { value: 'Test Description' },
      'votes-for': { value: 100 },
      'votes-against': { value: 25 },
      executed: { value: true },
      'created-at': { value: 9999 },
    });

    const proposal = await getProposal(7);
    expect(proposal).not.toBeNull();
    expect(proposal!.id).toBe(7);
    expect(proposal!.proposer).toBe('SP1ADDR');
    expect(proposal!.amount).toBe(5000);
    expect(proposal!.title).toBe('Test Title');
    expect(proposal!.description).toBe('Test Description');
    expect(proposal!.votesFor).toBe(100);
    expect(proposal!.votesAgainst).toBe(25);
    expect(proposal!.executed).toBe(true);
    expect(proposal!.createdAt).toBe(9999);
  });

  it('assigns correct id from argument', async () => {
    mockFetchReadOnly.mockResolvedValueOnce({} as never);
    mockCvToValue.mockReturnValueOnce({
      proposer: { value: 'SP1' },
      amount: { value: 0 },
      title: { value: 'T' },
      description: { value: 'D' },
      'votes-for': { value: 0 },
      'votes-against': { value: 0 },
      executed: { value: false },
      'created-at': { value: 0 },
    });

    const p = await getProposal(42);
    expect(p!.id).toBe(42);
  });
});
