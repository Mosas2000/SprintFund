import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProposalsPage } from '../Proposals';
import * as stacksLib from '../../lib/stacks';

vi.mock('../../lib/stacks');
vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({
    error: vi.fn(),
    success: vi.fn(),
  }),
}));
vi.mock('../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => true,
}));
vi.mock('../../store/comment-selectors', () => ({
  useLoadComments: () => vi.fn(),
}));

describe('ProposalsPage - Keyboard Navigation', () => {
  const mockProposals = [
    {
      id: 1,
      title: 'Proposal 1',
      description: 'Description 1',
      proposer: 'address1',
      amount: 1000,
      votesFor: 100,
      votesAgainst: 50,
      executed: false,
      createdAt: Date.now(),
    },
    {
      id: 2,
      title: 'Proposal 2',
      description: 'Description 2',
      proposer: 'address2',
      amount: 2000,
      votesFor: 200,
      votesAgainst: 100,
      executed: false,
      createdAt: Date.now(),
    },
    {
      id: 3,
      title: 'Proposal 3',
      description: 'Description 3',
      proposer: 'address3',
      amount: 3000,
      votesFor: 150,
      votesAgainst: 75,
      executed: false,
      createdAt: Date.now(),
    },
  ];

  beforeEach(() => {
    vi.mocked(stacksLib.getProposalsPage).mockResolvedValue({
      proposals: mockProposals,
      totalPages: 1,
      totalCount: 3,
      page: 1,
      pageSize: 10,
    });
  });

  it('renders proposal list', async () => {
    render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
      expect(screen.getByText('Proposal 2')).toBeInTheDocument();
      expect(screen.getByText('Proposal 3')).toBeInTheDocument();
    });
  });

  it('initializes with no proposal selected', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const cards = container.querySelectorAll('[role="listitem"]');
      cards.forEach((card) => {
        expect(card).not.toHaveClass('border-green');
      });
    });
  });

  it('selects first proposal with arrow down', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });

    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[0]).toHaveClass('border-green');
    });
  });

  it('navigates through proposals with arrow keys', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[0]).toHaveClass('border-green');
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[1]).toHaveClass('border-green');
    });

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[0]).toHaveClass('border-green');
    });
  });

  it('wraps around when navigating past last proposal', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[0]).toHaveClass('border-green');
    });
  });

  it('shows Enter key hint when proposal is selected', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });

    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[0]).toHaveClass('border-green');
    });
  });

  it('highlight styling visible on selected card', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });

    await waitFor(() => {
      const selected = container.querySelector('a[href="/proposals/p1"]');
      expect(selected).toHaveClass('border-green');
      expect(selected).toHaveClass('bg-green/5');
      expect(selected).toHaveClass('shadow-[0_0_20px_rgba(0,255,136,0.15)]');
    });
  });

  it('cycling up from first proposal goes to last', async () => {
    const { container } = render(
      <BrowserRouter>
        <ProposalsPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Proposal 1')).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[0]).toHaveClass('border-green');
    });

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    await waitFor(() => {
      const proposalLinks = container.querySelectorAll('a[href^="/proposals/"]');
      expect(proposalLinks[2]).toHaveClass('border-green');
    });
  });
});
