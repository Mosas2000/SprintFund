'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ProposalLinkProps {
  proposalId: string;
  proposalTitle: string;
}

export function ProposalLink({ proposalId, proposalTitle }: ProposalLinkProps) {
  return (
    <Link
      href={`/proposals/${proposalId}`}
      className="inline-flex items-center gap-2 px-3 py-1 text-sm text-purple-400 hover:text-purple-300 border border-purple-400/30 hover:border-purple-400 rounded transition-colors"
    >
      {proposalTitle}
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}
