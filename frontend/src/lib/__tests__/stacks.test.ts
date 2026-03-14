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
import { request } from '@stacks/connect';
import {
  getProposalCount,
  getProposal,
  getAllProposals,
  getStake,
  getMinStakeAmount,
} from '../stacks';

const mockFetchReadOnly = vi.mocked(fetchCallReadOnlyFunction);
const mockCvToValue = vi.mocked(cvToValue);
const mockRequest = vi.mocked(request);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getProposalCount', () => {
  it('returns the proposal count when the result is a number', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(5);

    const count = await getProposalCount();
    expect(count).toBe(5);
  });

  it('unwraps a wrapped value object', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue({ value: 12 });

    const count = await getProposalCount();
    expect(count).toBe(12);
  });

  it('returns 0 when the read-only call fails', async () => {
    mockFetchReadOnly.mockRejectedValue(new Error('network error'));

    const count = await getProposalCount();
    expect(count).toBe(0);
  });

  it('returns 0 when result is null', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(null);

    const count = await getProposalCount();
    expect(count).toBe(0);
  });

  it('passes correct function name to the contract call', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(0);

    await getProposalCount();

    expect(mockFetchReadOnly).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'get-proposal-count' }),
    );
  });
});

describe('getProposal', () => {
  const rawProposal = {
    proposer: { value: 'SP1EXAMPLE' },
    amount: { value: 5000000 },
    title: { value: 'Test Proposal' },
    description: { value: 'A test proposal description' },
    'votes-for': { value: 100 },
    'votes-against': { value: 20 },
    executed: { value: false },
    'created-at': { value: 123456 },
  };

  it('returns a correctly mapped proposal object', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(rawProposal);

    const proposal = await getProposal(1);

    expect(proposal).toEqual({
      id: 1,
      proposer: 'SP1EXAMPLE',
      amount: 5000000,
      title: 'Test Proposal',
      description: 'A test proposal description',
      votesFor: 100,
      votesAgainst: 20,
      executed: false,
      createdAt: 123456,
    });
  });

  it('returns null when the read-only call fails', async () => {
    mockFetchReadOnly.mockRejectedValue(new Error('not found'));

    const proposal = await getProposal(999);
    expect(proposal).toBeNull();
  });

  it('passes the proposal id as a uint argument', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(rawProposal);

    await getProposal(7);

    expect(mockFetchReadOnly).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'get-proposal',
        functionArgs: [{ type: 'uint', value: 7 }],
      }),
    );
  });

  it('handles proposal with string values instead of wrapped objects', async () => {
    const flatProposal = {
      proposer: 'SP1FLAT',
      amount: 1000000,
      title: 'Flat Proposal',
      description: 'Flat description',
      'votes-for': 50,
      'votes-against': 10,
      executed: true,
      'created-at': 789000,
    };

    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(flatProposal);

    const proposal = await getProposal(2);

    expect(proposal).not.toBeNull();
    expect(proposal!.proposer).toBe('SP1FLAT');
    expect(proposal!.executed).toBe(true);
  });

  it('handles missing title gracefully', async () => {
    const missingTitle = { ...rawProposal, title: { value: undefined } };
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(missingTitle);

    const proposal = await getProposal(3);
    expect(proposal).not.toBeNull();
  });
});

describe('getAllProposals', () => {
  it('returns an empty array when proposal count is 0', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(0);

    const proposals = await getAllProposals();
    expect(proposals).toEqual([]);
  });

  it('fetches each proposal by index and returns them reversed', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);

    const makeProposal = (id: number) => ({
      proposer: { value: `SP${id}` },
      amount: { value: id * 1000 },
      title: { value: `Proposal ${id}` },
      description: { value: `Description ${id}` },
      'votes-for': { value: id * 10 },
      'votes-against': { value: id },
      executed: { value: false },
      'created-at': { value: 100000 + id },
    });

    mockCvToValue
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(makeProposal(0))
      .mockReturnValueOnce(makeProposal(1))
      .mockReturnValueOnce(makeProposal(2));

    const proposals = await getAllProposals();

    expect(proposals).toHaveLength(3);
    expect(proposals[0].id).toBe(2);
    expect(proposals[1].id).toBe(1);
    expect(proposals[2].id).toBe(0);
  });

  it('filters out null proposals from failed individual fetches', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);

    mockCvToValue
      .mockReturnValueOnce(2)
      .mockReturnValueOnce({
        proposer: { value: 'SP1' },
        amount: { value: 1000 },
        title: { value: 'Valid' },
        description: { value: 'Valid desc' },
        'votes-for': { value: 10 },
        'votes-against': { value: 0 },
        executed: { value: false },
        'created-at': { value: 100 },
      })
      .mockReturnValueOnce(null);

    const proposals = await getAllProposals();
    expect(proposals).toHaveLength(1);
    expect(proposals[0].title).toBe('Valid');
  });

  it('calls get-proposal-count first then get-proposal for each', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValueOnce(1).mockReturnValueOnce({
      proposer: { value: 'SP1' },
      amount: { value: 1000 },
      title: { value: 'Only' },
      description: { value: 'Only one' },
      'votes-for': { value: 1 },
      'votes-against': { value: 0 },
      executed: { value: false },
      'created-at': { value: 100 },
    });

    await getAllProposals();

    const calls = mockFetchReadOnly.mock.calls;
    expect(calls[0][0]).toEqual(expect.objectContaining({ functionName: 'get-proposal-count' }));
    expect(calls[1][0]).toEqual(expect.objectContaining({ functionName: 'get-proposal' }));
  });
});

describe('getStake', () => {
  it('returns the parsed stake amount', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue({ amount: { value: 5000000 } });

    const stake = await getStake('SP1EXAMPLE');
    expect(stake).toBe(5000000);
  });

  it('returns 0 when the read-only call fails', async () => {
    mockFetchReadOnly.mockRejectedValue(new Error('timeout'));

    const stake = await getStake('SP1EXAMPLE');
    expect(stake).toBe(0);
  });

  it('returns 0 when result is null', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(null);

    const stake = await getStake('SP1EXAMPLE');
    expect(stake).toBe(0);
  });

  it('passes the address as a principal argument', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue({ amount: { value: 0 } });

    await getStake('SP1ADDR');

    expect(mockFetchReadOnly).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'get-stake',
        functionArgs: [{ type: 'principal', value: 'SP1ADDR' }],
      }),
    );
  });
});

describe('getMinStakeAmount', () => {
  it('returns the min stake amount as a number', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(10000000);

    const min = await getMinStakeAmount();
    expect(min).toBe(10000000);
  });

  it('unwraps a wrapped value', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue({ value: 20000000 });

    const min = await getMinStakeAmount();
    expect(min).toBe(20000000);
  });

  it('returns default 10_000_000 when the call fails', async () => {
    mockFetchReadOnly.mockRejectedValue(new Error('fail'));

    const min = await getMinStakeAmount();
    expect(min).toBe(10000000);
  });

  it('returns default when result has no value', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue.mockReturnValue(null);

    const min = await getMinStakeAmount();
    expect(min).toBe(10000000);
  });
});
