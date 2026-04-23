import { NextRequest, NextResponse } from 'next/server';
import { PaginationService } from '@/services/pagination';

const MOCK_PROPOSALS = Array.from({ length: 150 }, (_, i) => {
  const createdAt = 100000 - i * 144; // Spaced by ~1 day
  return {
    id: `prop_${i + 1}`,
    title: `Proposal ${i + 1}`,
    description: `This is proposal number ${i + 1}`,
    proposer: `SP${Math.random().toString(36).slice(2, 34)}`,
    createdAt,
    votingEndsAt: createdAt + 1000,
    executionAllowedAt: createdAt + 1144,
    status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
    requestedAmount: Math.floor(Math.random() * 20000000000),
    votes: Array(Math.floor(Math.random() * 50)),
  };
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSize = Math.max(5, Math.min(100, parseInt(searchParams.get('pageSize') || '15')));
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const status = searchParams.get('status');

    let proposals = [...MOCK_PROPOSALS];

    if (status) {
      proposals = proposals.filter((p) => p.status === status);
    }

    proposals.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    const paginated = PaginationService.paginate(proposals, page, pageSize);

    return NextResponse.json(paginated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
