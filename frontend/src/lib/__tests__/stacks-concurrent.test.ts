import { describe, it, expect, vi } from 'vitest';

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
import { request } from '@stacks/connect';
import { getProposal, getAllProposals, getProposalCount } from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);
const mockRequest = vi.mocked(request);

beforeEach(() => {
  vi.clearAllMocks();
});

import { beforeEach } from 'vitest';

describe('stacks concurrent fetch behavior', () => {
  it('getAllProposals makes N+1 read-only calls for N proposals', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);

    const makeProposal = (id: number) => ({
      proposer: { value: `SP${id}` },
      amount: { value: id * 1000 },
      title: { value: `P${id}` },
      description: { value: `D${id}` },
      'votes-for': { value: 0 },
      'votes-against': { value: 0 },
      executed: { value: false },
      'created-at': { value: 100 },
    });

    mockCvToValue
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(makeProposal(0))
      .mockReturnValueOnce(makeProposal(1))
      .mockReturnValueOnce(makeProposal(2))
      .mockReturnValueOnce(makeProposal(3))
      .mockReturnValueOnce(makeProposal(4));

    await getAllProposals();

    // 1 call for count + 5 calls for proposals
    expect(mockFetchReadOnly).toHaveBeenCalledTimes(6);
  });

  it('getAllProposals returns proposals in reverse order', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);

    mockCvToValue
      .mockReturnValueOnce(2)
      .mockReturnValueOnce({
        proposer: { value: 'SP0' }, amount: { value: 100 },
        title: { value: 'First' }, description: { value: 'D' },
        'votes-for': { value: 0 }, 'votes-against': { value: 0 },
        executed: { value: false }, 'created-at': { value: 1 },
      })
      .mockReturnValueOnce({
        proposer: { value: 'SP1' }, amount: { value: 200 },
        title: { value: 'Second' }, description: { value: 'D' },
        'votes-for': { value: 0 }, 'votes-against': { value: 0 },
        executed: { value: false }, 'created-at': { value: 2 },
      });

    const proposals = await getAllProposals();
    expect(proposals[0].title).toBe('Second');
    expect(proposals[1].title).toBe('First');
  });
});

describe('stacks contract arguments', () => {
  it('getProposal passes correct contract address', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue({
      proposer: { value: 'SP1' }, amount: { value: 100 },
      title: { value: 'T' }, description: { value: 'D' },
      'votes-for': { value: 0 }, 'votes-against': { value: 0 },
      executed: { value: false }, 'created-at': { value: 1 },
    });

    await getProposal(0);

    expect(mockFetchReadOnly).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: expect.stringMatching(/^SP[A-Z0-9]+$/),
        contractName: expect.stringContaining('sprintfund'),
      }),
    );
  });

  it('getProposalCount passes no arguments', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(0);

    await getProposalCount();

    expect(mockFetchReadOnly).toHaveBeenCalledWith(
      expect.objectContaining({
        functionArgs: [],
      }),
    );
  });
});
