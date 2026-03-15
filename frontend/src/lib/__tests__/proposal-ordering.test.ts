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

describe('proposal ordering after batch fetch', () => {
  it('preserves all proposal fields in correct order', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue
      .mockReturnValueOnce(2) // count
      .mockReturnValueOnce({
        proposer: { value: 'SP_FIRST' },
        amount: { value: 5000 },
        title: { value: 'First Created' },
        description: { value: 'First description' },
        'votes-for': { value: 100 },
        'votes-against': { value: 50 },
        executed: { value: false },
        'created-at': { value: 1000 },
      })
      .mockReturnValueOnce({
        proposer: { value: 'SP_SECOND' },
        amount: { value: 10000 },
        title: { value: 'Second Created' },
        description: { value: 'Second description' },
        'votes-for': { value: 200 },
        'votes-against': { value: 30 },
        executed: { value: true },
        'created-at': { value: 2000 },
      });

    const result = await getAllProposals();

    // Should be reversed (newest first)
    expect(result[0].title).toBe('Second Created');
    expect(result[0].proposer).toBe('SP_SECOND');
    expect(result[0].executed).toBe(true);
    expect(result[0].id).toBe(1);

    expect(result[1].title).toBe('First Created');
    expect(result[1].proposer).toBe('SP_FIRST');
    expect(result[1].executed).toBe(false);
    expect(result[1].id).toBe(0);
  });

  it('preserves vote counts through batch processing', async () => {
    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue
      .mockReturnValueOnce(1)
      .mockReturnValueOnce({
        proposer: { value: 'SP1' },
        amount: { value: 1000 },
        title: { value: 'Voting Test' },
        description: { value: 'Vote counting' },
        'votes-for': { value: 999 },
        'votes-against': { value: 111 },
        executed: { value: false },
        'created-at': { value: 500 },
      });

    const result = await getAllProposals();
    expect(result[0].votesFor).toBe(999);
    expect(result[0].votesAgainst).toBe(111);
  });

  it('sanitizes title and description through batch processing', async () => {
    const { sanitizeText, sanitizeMultilineText } = await import('../sanitize');

    mockFetchReadOnly.mockResolvedValue({} as never);
    mockCvToValue
      .mockReturnValueOnce(1)
      .mockReturnValueOnce({
        proposer: { value: 'SP1' },
        amount: { value: 1000 },
        title: { value: 'Test Title' },
        description: { value: 'Test Description' },
        'votes-for': { value: 0 },
        'votes-against': { value: 0 },
        executed: { value: false },
        'created-at': { value: 100 },
      });

    await getAllProposals();

    expect(sanitizeText).toHaveBeenCalledWith('Test Title');
    expect(sanitizeMultilineText).toHaveBeenCalledWith('Test Description');
  });
});
