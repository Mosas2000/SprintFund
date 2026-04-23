import { NextRequest, NextResponse } from 'next/server';

interface MockVote {
  id: string;
  voterAddress: string;
  type: 'approve' | 'reject';
  timestamp: string;
}

interface MockProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  createdAt: string;
  votingEnd: string;
  requestedAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  votes: MockVote[];
}

const MOCK_PROPOSALS: Record<string, MockProposal> = {
  'prop_1': {
    id: 'prop_1',
    title: 'Increase Marketing Budget for Q2',
    description: 'Proposal to allocate additional resources for marketing initiatives in Q2 to boost community awareness and engagement.',
    proposer: 'SP123456789ABCDEFGHIJKLMNOPQRSTU123',
    createdAt: 100000,
    votingEndsAt: 100432,
    executionAllowedAt: 100576,
    requestedAmount: 5000000000,
    status: 'pending',
    votes: [
      { id: 'v1', voterAddress: 'SP234567890ABCDEFGHIJKLMNOPQRSTU', type: 'approve', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'v2', voterAddress: 'SP345678901ABCDEFGHIJKLMNOPQRSTU', type: 'approve', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'v3', voterAddress: 'SP456789012ABCDEFGHIJKLMNOPQRSTU', type: 'reject', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  'prop_2': {
    id: 'prop_2',
    title: 'Fund Development of Mobile App',
    description: 'Allocate budget for developing a mobile application to improve user accessibility and engagement across iOS and Android platforms.',
    proposer: 'SP123456789ABCDEFGHIJKLMNOPQRSTU123',
    createdAt: 99000,
    votingEndsAt: 99432,
    executionAllowedAt: 99432,
    requestedAmount: 10000000000,
    status: 'approved',
    votes: [
      { id: 'v1', voterAddress: 'SP234567890ABCDEFGHIJKLMNOPQRSTU', type: 'approve', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'v2', voterAddress: 'SP345678901ABCDEFGHIJKLMNOPQRSTU', type: 'approve', timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'v3', voterAddress: 'SP456789012ABCDEFGHIJKLMNOPQRSTU', type: 'approve', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: proposalId } = await params;
    const proposal = MOCK_PROPOSALS[proposalId];

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}
