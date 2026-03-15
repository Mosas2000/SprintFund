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
import { getProposalCount, getProposal } from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('readOnly helper error handling', () => {
  it('getProposalCount returns 0 on network error', async () => {
    mockFetchReadOnly.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    const count = await getProposalCount();
    expect(count).toBe(0);
  });

  it('getProposal returns null on network error', async () => {
    mockFetchReadOnly.mockRejectedValueOnce(new Error('timeout'));

    const proposal = await getProposal(0);
    expect(proposal).toBeNull();
  });

  it('getProposalCount handles undefined result', async () => {
    mockFetchReadOnly.mockResolvedValueOnce(undefined as never);
    mockCvToValue.mockReturnValueOnce(undefined);

    const count = await getProposalCount();
    expect(count).toBe(0);
  });

  it('getProposal handles null result from readOnly', async () => {
    mockFetchReadOnly.mockRejectedValueOnce(new Error('not found'));

    const proposal = await getProposal(999);
    expect(proposal).toBeNull();
  });
});
