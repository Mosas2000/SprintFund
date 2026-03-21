import { NextRequest, NextResponse } from 'next/server';

const MOCK_PROPOSALS = [
  {
    id: 'prop_1',
    title: 'Increase Marketing Budget for Q2',
    description: 'Proposal to allocate additional resources for marketing initiatives in Q2 to boost community awareness and engagement.',
    proposer: 'SP123456789ABCDEFGHIJKLMNOPQRSTU123',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    votingEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    requestedAmount: 5000000000,
    status: 'pending',
    votes: [],
  },
  {
    id: 'prop_2',
    title: 'Fund Development of Mobile App',
    description: 'Allocate budget for developing a mobile application to improve user accessibility and engagement across iOS and Android platforms.',
    proposer: 'SP123456789ABCDEFGHIJKLMNOPQRSTU123',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    votingEnd: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    requestedAmount: 10000000000,
    status: 'approved',
    votes: [],
  },
  {
    id: 'prop_3',
    title: 'Community Education Program',
    description: 'Establish a comprehensive education program to onboard new community members and increase protocol knowledge.',
    proposer: 'SP987654321ABCDEFGHIJKLMNOPQRSTU987',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    votingEnd: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    requestedAmount: 3000000000,
    status: 'rejected',
    votes: [],
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const proposer = searchParams.get('proposer');

    let proposals = MOCK_PROPOSALS;

    if (proposer) {
      proposals = proposals.filter((p) => p.proposer === proposer);
    }

    return NextResponse.json(proposals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
