import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatStx } from '../config';
import { truncateAddress } from '../lib/api';
import { sanitizeText } from '../lib/sanitize';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';
import { VoteProgressBar } from './VoteProgressBar';
import type { Proposal } from '../types';

interface Props {
  proposal: Proposal;
}

export const ProposalCard = memo(function ProposalCard({ proposal }: Props) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;

  const safeTitle = sanitizeText(proposal.title);
  const safeDescription = sanitizeText(proposal.description);

  return (
    <Link
      to={`/proposals/${proposal.id}`}
      aria-label={`${safeTitle} - ${proposal.executed ? 'Executed' : 'Active'} - ${formatStx(proposal.amount)} STX`}
      className={`group block rounded-xl border border-border bg-card p-4 sm:p-5 transition-all hover:border-green/30 hover:shadow-[0_0_20px_rgba(0,255,136,0.05)] ${FOCUS_RING_GREEN}`}
    >
      {/* Header row */}
      <div className="mb-2 sm:mb-3 flex items-start justify-between gap-2 sm:gap-3">
        <h2 className="text-sm sm:text-base font-semibold text-text group-hover:text-green transition-colors line-clamp-2 sm:line-clamp-1">
          {safeTitle}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
            proposal.executed
              ? 'bg-green/10 text-green'
              : 'bg-amber/10 text-amber'
          }`}
        >
          {proposal.executed ? 'Executed' : 'Active'}
        </span>
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
        <span className="font-mono">{truncateAddress(proposal.proposer)}</span>
        <span className="font-semibold text-green">{formatStx(proposal.amount)} STX</span>
      </div>
    </Link>
  );
});
