import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatStx } from '../config';
import { truncateAddress } from '../lib/api';
import { sanitizeText } from '../lib/sanitize';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';
import { VoteProgressBar } from './VoteProgressBar';
import { useCommentCount } from '../store/comment-selectors';
import { useCurrentBlockHeight } from '../hooks/useCurrentBlockHeight';
import { getProposalStatus } from '../lib/proposal-status';
import { ProposalStatusBadge } from './ProposalStatusBadge';
import type { Proposal } from '../types';

/**
 * Props for ProposalCard component.
 */
interface ProposalCardProps {
  proposal: Proposal;
  selected?: boolean;
}

/**
 * ProposalCard displays a proposal in list view with voting stats.
 * Shows title, description, vote distribution, and proposal status.
 */
export const ProposalCard = memo(function ProposalCard({ proposal, selected }: ProposalCardProps): React.JSX.Element {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
  const commentCount = useCommentCount(proposal.id);
  const { blockHeight } = useCurrentBlockHeight();

  const safeTitle = sanitizeText(proposal.title);
  const safeDescription = sanitizeText(proposal.description);

  const statusInfo = blockHeight ? getProposalStatus(proposal, blockHeight) : null;

  return (
    <Link
      to={`/proposals/${proposal.id}`}
      aria-label={`${safeTitle} - ${proposal.executed ? 'Executed' : 'Active'} - ${formatStx(proposal.amount)} STX`}
      className={`group block rounded-xl border transition-all ${
        selected
          ? 'border-green bg-green/5 shadow-[0_0_20px_rgba(0,255,136,0.15)]'
          : 'border-border bg-card hover:border-green/30 hover:shadow-[0_0_20px_rgba(0,255,136,0.05)]'
      } p-4 sm:p-5 ${FOCUS_RING_GREEN}`}
    >
      {/* Header row */}
      <div className="mb-2 sm:mb-3 flex items-start justify-between gap-2 sm:gap-3">
        <h2 className="text-sm sm:text-base font-semibold text-text group-hover:text-green transition-colors line-clamp-2 sm:line-clamp-1">
          {safeTitle}
        </h2>
        {statusInfo && <ProposalStatusBadge statusInfo={statusInfo} className="shrink-0" />}
      </div>

      {/* Description */}
      <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted line-clamp-2">
        {safeDescription}
      </p>

      {/* Vote bar */}
      <div className="mb-3" role="group" aria-label="Vote distribution">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>For: {proposal.votesFor}</span>
          <span>Against: {proposal.votesAgainst}</span>
        </div>
        <VoteProgressBar forPct={forPct} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          <span className="font-mono">{truncateAddress(proposal.proposer)}</span>
          {commentCount > 0 && (
            <span className="flex items-center gap-1 text-muted" aria-label={`${commentCount} comments`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span className="tabular-nums">{commentCount}</span>
            </span>
          )}
        </div>
        <span className="font-semibold text-green">{formatStx(proposal.amount)} STX</span>
      </div>
    </Link>
  );
});
