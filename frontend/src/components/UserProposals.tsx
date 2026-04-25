import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatStx } from '../config';
import type { UserProposalsProps } from '../types/profile';
import type { Proposal } from '../types';

/* ── Status badge helper ──────────────────────── */

function statusBadge(proposal: Proposal): { label: string; className: string } {
  if (proposal.executed) {
    return {
      label: 'Executed',
      className: 'bg-emerald-500/20 text-emerald-400',
    };
  }
  return {
    label: 'Active',
    className: 'bg-indigo-500/20 text-indigo-400',
  };
}

/* ── Vote bar ─────────────────────────────────── */

function VoteBar({ votesFor, votesAgainst }: { votesFor: number; votesAgainst: number }) {
  const total = votesFor + votesAgainst;
  const forPct = total > 0 ? Math.round((votesFor / total) * 100) : 0;
  const againstPct = total > 0 ? 100 - forPct : 0;

  return (
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <div className="flex h-full w-full">
          {total > 0 ? (
            <>
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${forPct}%` }}
              />
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-500"
                style={{ width: `${againstPct}%` }}
              />
            </>
          ) : (
            <div className="h-full w-full bg-white/5" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 min-w-[80px] justify-end">
        <span className="text-emerald-400">{forPct}%</span>
        <span className="text-zinc-700">/</span>
        <span className="text-red-400">{againstPct}%</span>
      </div>
    </div>
  );
}

/* ── Proposal row ─────────────────────────────── */

function ProposalRow({ proposal }: { proposal: Proposal }) {
  const badge = statusBadge(proposal);
  const votesFor = proposal.votesFor || 0;
  const votesAgainst = proposal.votesAgainst || 0;

  return (
    <li className="group rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/8 hover:scale-[1.01] hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/proposals/${proposal.id}`}
              className="text-sm font-medium text-white hover:text-indigo-300 transition-colors truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              {proposal.title}
            </Link>
            <span
              className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Requesting {formatStx(proposal.amount)} STX
          </p>
        </div>

        <div className="sm:w-40">
          <VoteBar votesFor={proposal.votesFor} votesAgainst={proposal.votesAgainst} />
        </div>
      </div>
    </li>
  );
}

/* ── Empty state ──────────────────────────────── */

function EmptyProposals() {
  return (
    <div className="text-center py-10">
      <p className="text-zinc-400 text-sm">
        No proposals created yet.
      </p>
      <Link
        to="/proposals/create"
        className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
      >
        Create your first proposal
      </Link>
    </div>
  );
}

/* ── Main component ───────────────────────────── */

function UserProposalsBase({ proposals }: UserProposalsProps) {
  if (proposals.length === 0) {
    return (
      <section aria-labelledby="user-proposals-heading">
        <h2 id="user-proposals-heading" className="text-lg font-semibold text-white mb-4">
          Your Proposals
        </h2>
        <EmptyProposals />
      </section>
    );
  }

  // Sort by most recent first
  const sorted = [...proposals].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <section aria-labelledby="user-proposals-heading">
      <div className="flex items-center justify-between mb-4">
        <h2 id="user-proposals-heading" className="text-lg font-semibold text-white">
          Your Proposals ({proposals.length})
        </h2>
      </div>

      <ul className="space-y-3" role="list">
        {sorted.map((p) => (
          <ProposalRow key={p.id} proposal={p} />
        ))}
      </ul>
    </section>
  );
}

const UserProposals = memo(UserProposalsBase);
UserProposals.displayName = 'UserProposals';
export default UserProposals;
