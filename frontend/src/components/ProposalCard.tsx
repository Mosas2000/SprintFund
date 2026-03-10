import { Link } from 'react-router-dom';
import { formatStx } from '../config';
import { truncateAddress } from '../lib/api';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';
import type { Proposal } from '../types';

interface Props {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: Props) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;

  return (
    <Link
      to={`/proposals/${proposal.id}`}
      aria-label={`${proposal.title} - ${proposal.executed ? 'Executed' : 'Active'} - ${formatStx(proposal.amount)} STX`}
      className={`group block rounded-xl border border-border bg-card p-5 transition-all hover:border-green/30 hover:shadow-[0_0_20px_rgba(0,255,136,0.05)] ${FOCUS_RING_GREEN}`}
    >
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-text group-hover:text-green transition-colors line-clamp-1">
          {proposal.title}
        </h3>
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
      <p className="mb-4 text-sm text-muted line-clamp-2">
        {proposal.description}
      </p>

      {/* Vote bar */}
      <div className="mb-3" role="group" aria-label="Vote distribution">
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>For: {proposal.votesFor}</span>
          <span>Against: {proposal.votesAgainst}</span>
        </div>
        <div
          className="h-1.5 w-full rounded-full bg-border"
          role="progressbar"
          aria-valuenow={forPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${forPct}% votes in favor`}
        >
          <div
            className="h-full rounded-full bg-green transition-all"
            style={{ width: `${forPct}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-mono">{truncateAddress(proposal.proposer)}</span>
        <span className="font-semibold text-green">{formatStx(proposal.amount)} STX</span>
      </div>
    </Link>
  );
}
