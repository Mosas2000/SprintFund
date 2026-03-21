'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface RelatedProposalsProps {
  proposals: any[];
  currentProposalId: string;
}

export function RelatedProposals({ proposals, currentProposalId }: RelatedProposalsProps) {
  if (!proposals || proposals.length === 0) {
    return null;
  }

  const filtered = proposals.filter((p) => p.id !== currentProposalId).slice(0, 3);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-4">Related Proposals</h3>

      <div className="space-y-3">
        {filtered.map((proposal) => (
          <Link
            key={proposal.id}
            href={`/proposals/${proposal.id}`}
            className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors truncate">
                  {proposal.title}
                </p>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">
                  {proposal.description}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-purple-400 transition-colors flex-shrink-0" />
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  proposal.status === 'approved'
                    ? 'bg-green-500/20 text-green-400'
                    : proposal.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {proposal.status}
              </span>

              <span className="text-xs text-white/60">
                {proposal.votes?.length || 0} votes
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
