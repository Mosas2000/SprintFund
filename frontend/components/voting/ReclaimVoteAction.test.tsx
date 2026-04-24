import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReclaimVoteAction from './ReclaimVoteAction';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as hooks from '@/hooks';
import * as stacksLib from '@/lib/stacks';

vi.mock('@/hooks', () => ({
  useCurrentBlockHeight: vi.fn(),
  useVote: vi.fn(),
  useTransaction: vi.fn(),
}));

vi.mock('@/lib/stacks', () => ({
  callReclaimVoteCost: vi.fn(),
  invalidateStakeCache: vi.fn(),
}));

vi.mock('@/utils/formatSTX', () => ({
  formatSTX: (amount: number) => (amount / 1000000).toString(),
}));

describe('ReclaimVoteAction', () => {
  const mockProposal = {
    id: 1,
    title: 'Test Proposal',
    proposer: 'ST1234',
    amount: 1000,
    description: 'Test',
    votesFor: 0,
    votesAgainst: 0,
    executed: false,
    createdAt: 100,
    votingEndsAt: 200,
    executionAllowedAt: 300,
  };

  const mockVote = {
    proposalId: 1,
    voter: 'ST1234',
    support: true,
    weight: 100,
    costPaid: 10000000, // 10 STX
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null if user Address is not provided', () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 250, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: mockVote, loading: false, error: null, refresh: vi.fn() });
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: vi.fn(), isLoading: false, isError: false, isSuccess: false, isIdle: true, error: null, reset: vi.fn() });

    const { container } = render(<ReclaimVoteAction proposal={mockProposal} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null if vote is null or costPaid is 0', () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 250, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: null, loading: false, error: null, refresh: vi.fn() });
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: vi.fn(), isLoading: false, isError: false, isSuccess: false, isIdle: true, error: null, reset: vi.fn() });

    const { container } = render(<ReclaimVoteAction proposal={mockProposal} userAddress="ST1234" />);
    expect(container.firstChild).toBeNull();
  });

  it('shows loading skeleton when vote data is loading', () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 250, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: null, loading: true, error: null, refresh: vi.fn() });
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: vi.fn(), isLoading: false, isError: false, isSuccess: false, isIdle: true, error: null, reset: vi.fn() });

    const { container } = render(<ReclaimVoteAction proposal={mockProposal} userAddress="ST1234" />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('shows locked message if voting is still active', () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 150, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: mockVote, loading: false, error: null, refresh: vi.fn() });
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: vi.fn(), isLoading: false, isError: false, isSuccess: false, isIdle: true, error: null, reset: vi.fn() });

    render(<ReclaimVoteAction proposal={mockProposal} userAddress="ST1234" />);
    
    expect(screen.getByText(/You have 10 STX currently locked/i)).toBeTruthy();
    const button = screen.getByRole('button', { name: /Reclaim 10 STX/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('shows available message and enables button if voting has ended', () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 250, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: mockVote, loading: false, error: null, refresh: vi.fn() });
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: vi.fn(), isLoading: false, isError: false, isSuccess: false, isIdle: true, error: null, reset: vi.fn() });

    render(<ReclaimVoteAction proposal={mockProposal} userAddress="ST1234" />);
    
    expect(screen.getByText(/The voting period has ended/i)).toBeTruthy();
    expect(screen.getAllByText(/Available/i).length).toBeGreaterThan(0);
    
    const button = screen.getByRole('button', { name: /Reclaim 10 STX/i }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('calls execute function when button is clicked', async () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 250, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: mockVote, loading: false, error: null, refresh: vi.fn() });
    
    const mockExecute = vi.fn().mockImplementation((cb) => cb());
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: mockExecute, isLoading: false, isError: false, isSuccess: false, isIdle: true, error: null, reset: vi.fn() });

    render(<ReclaimVoteAction proposal={mockProposal} userAddress="ST1234" />);
    
    const button = screen.getByRole('button', { name: /Reclaim 10 STX/i });
    fireEvent.click(button);

    expect(mockExecute).toHaveBeenCalled();
  });

  it('shows loading state when transaction is executing', () => {
    vi.mocked(hooks.useCurrentBlockHeight).mockReturnValue({ blockHeight: 250, error: null, isLoading: false, refresh: vi.fn() });
    vi.mocked(hooks.useVote).mockReturnValue({ vote: mockVote, loading: false, error: null, refresh: vi.fn() });
    vi.mocked(hooks.useTransaction).mockReturnValue({ execute: vi.fn(), isLoading: true, isError: false, isSuccess: false, isIdle: false, error: null, reset: vi.fn() });

    render(<ReclaimVoteAction proposal={mockProposal} userAddress="ST1234" />);
    
    expect(screen.getByText(/Reclaiming STX.../i)).toBeTruthy();
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
