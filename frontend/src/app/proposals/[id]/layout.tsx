import type { Metadata } from 'next';

interface ProposalDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/proposals/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'Proposal',
        description: 'View proposal details',
      };
    }

    const proposal = await response.json();

    return {
      title: proposal.title,
      description: proposal.description?.substring(0, 160),
      openGraph: {
        title: proposal.title,
        description: proposal.description?.substring(0, 160),
        type: 'article',
      },
    };
  } catch {
    return {
      title: 'Proposal',
      description: 'View proposal details',
    };
  }
}

export default async function ProposalDetailLayout({ children, params }: ProposalDetailLayoutProps) {
  return children;
}
