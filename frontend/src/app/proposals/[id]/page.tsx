'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';
import Link from 'next/link';
import { ProposalDiscussionSection } from '@/components/ProposalDiscussionSection';
import { SocialSharing } from '@/components/SocialSharing';
import { ExecutionStatus } from '@/components/ExecutionStatus';
import { VotingHistory } from '@/components/VotingHistory';
import { RelatedProposals } from '@/components/RelatedProposals';
import { proposalExecutionService, type ExecutionHistoryEntry } from '@/services/proposal-execution';
import type { Proposal } from '@/types';

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [relatedProposals, setRelatedProposals] = useState<Proposal[]>([]);
  const [executionStatus, setExecutionStatus] = useState<ExecutionHistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposalData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/proposals/${proposalId}`);
        if (response.ok) {
          const data = await response.json();
          setProposal(data);

          const execution = proposalExecutionService.getMostRecentExecution(proposalId);
          setExecutionStatus(execution);

          if (data.proposer) {
            const relatedResponse = await fetch(`/api/proposals?proposer=${data.proposer}`);
            if (relatedResponse.ok) {
              const relatedData = await relatedResponse.json();
              setRelatedProposals(relatedData);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (proposalId) {
      fetchProposalData();
    }
  }, [proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white/60">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">Proposal not found</h1>
        <Link href="/proposals" className="text-purple-400 hover:text-purple-300">
          Back to proposals
        </Link>
      </div>
    );
  }

  const statusColor = {
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    executed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  // Derive status from proposal data
  const proposalStatus = proposal.executed ? 'executed' : 'pending';

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <Link
          href="/proposals"
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to proposals
        </Link>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">{proposal.title}</h1>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      statusColor[proposalStatus as keyof typeof statusColor]
                    }`}
                  >
                    {proposalStatus.charAt(0).toUpperCase() + proposalStatus.slice(1)}
                  </span>

                  <span className="text-sm text-white/60">
                    Created {new Date(proposal.createdAt).toLocaleDateString()}
                  </span>

                  <span className="text-sm text-white/60">
                    by {proposal.proposer?.slice(0, 12)}...
                  </span>
                </div>
              </div>
            </div>

            <p className="text-white/70 text-lg leading-relaxed">{proposal.description}</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Requested Amount</p>
                <p className="text-2xl font-bold text-white">
                  {((proposal.amount || 0) / 1_000_000).toFixed(2)}
                </p>
                <p className="text-xs text-white/40 mt-1">STX</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Total Votes</p>
                <p className="text-2xl font-bold text-white">{proposal.votesFor + proposal.votesAgainst}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-white/60 text-sm mb-2">Votes For / Against</p>
                <p className="text-2xl font-bold text-white">
                  {proposal.votesFor} / {proposal.votesAgainst}
                </p>
                <p className="text-xs text-white/40 mt-1">for / against</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {executionStatus && (
              <ExecutionStatus
                status={executionStatus.status === 'confirmed' ? 'completed' : executionStatus.status}
                transactionId={executionStatus.transactionId}
                blockHeight={executionStatus.blockHeight}
                executedAt={executionStatus.timestamp}
                errorMessage={executionStatus.errorMessage}
              />
            )}

            <VotingHistory votes={[]} />

            <ProposalDiscussionSection proposalId={proposalId} />
          </div>

          <div className="space-y-6">
            <SocialSharing proposalId={proposalId} proposalTitle={proposal.title} />

            {relatedProposals.length > 0 && (
              <RelatedProposals proposals={relatedProposals} currentProposalId={proposalId} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
