import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { getProposal, getStake, callVote, callExecuteProposal } from '../lib/stacks';
import { formatStx } from '../config';
import { explorerTxUrl, truncateAddress, explorerAddressUrl } from '../lib/api';
import { ProposalDetailSkeleton } from '../components/ProposalDetailSkeleton';
import type { Proposal } from '../types';

export function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { connected, address } = useWalletStore();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [userStake, setUserStake] = useState(0);
  const [voteWeight, setVoteWeight] = useState('1');
  const [txStatus, setTxStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const proposalId = parseInt(id ?? '0', 10);
        const p = await getProposal(proposalId);
        setProposal(p);
        if (address) {
          const stake = await getStake(address);
          setUserStake(stake);
        }
      } catch (err) {
        console.error('Failed to load proposal:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, address]);

  const handleVote = (support: boolean) => {
    if (!proposal) return;
    const weight = parseInt(voteWeight, 10);
    if (isNaN(weight) || weight <= 0) return;
    setTxStatus('Opening wallet…');
    callVote(proposal.id, support, weight, {
      onFinish: (txId) => {
        setTxStatus(`Vote submitted! TX: ${txId.slice(0, 12)}…`);
      },
      onCancel: () => setTxStatus(null),
    });
  };

  const handleExecute = () => {
    if (!proposal) return;
    setTxStatus('Opening wallet…');
    callExecuteProposal(proposal.id, {
      onFinish: (txId) => {
        setTxStatus(`Execution submitted! TX: ${txId.slice(0, 12)}…`);
      },
      onCancel: () => setTxStatus(null),
    });
  };

  if (loading) {
    return <ProposalDetailSkeleton />;
  }

  if (!proposal) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 text-center">
        <h1 className="mb-2 text-xl font-bold text-text">Proposal Not Found</h1>
        <p className="mb-4 text-sm text-muted">Could not load proposal #{id}</p>
        <Link to="/proposals" className="text-sm text-green hover:underline">
          &larr; Back to proposals
        </Link>
      </div>
    );
  }

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        to="/proposals"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted hover:text-green transition-colors"
      >
        &larr; All proposals
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  proposal.executed ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                }`}
              >
                {proposal.executed ? 'Executed' : 'Active'}
              </span>
              <span className="text-xs text-muted">#{proposal.id}</span>
            </div>
            <h1 className="mb-3 text-xl font-bold text-text">{proposal.title}</h1>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
              {proposal.description}
            </p>
          </div>

          {/* Vote bar */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-text">Voting</h2>
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span>For: {proposal.votesFor}</span>
              <span>Against: {proposal.votesAgainst}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-green transition-all"
                style={{ width: `${forPct}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted">
              {totalVotes} total vote{totalVotes !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Vote actions */}
          {connected && !proposal.executed && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-semibold text-text">Cast Your Vote</h2>
              <div className="mb-4">
                <label className="mb-1 block text-xs text-muted">Weight</label>
                <input
                  type="number"
                  min="1"
                  value={voteWeight}
                  onChange={(e) => setVoteWeight(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40"
                />
                <p className="mt-1 text-[10px] text-muted">Your stake: {formatStx(userStake)} STX</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVote(true)}
                  className="flex-1 rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-green-dim active:scale-95"
                >
                  Vote For
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className="flex-1 rounded-lg border border-red/30 px-4 py-2 text-sm font-semibold text-red transition-colors hover:bg-red/5 active:scale-95"
                >
                  Vote Against
                </button>
              </div>
            </div>
          )}

          {/* Execute button */}
          {connected && !proposal.executed && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-2 text-sm font-semibold text-text">Execute Proposal</h2>
              <p className="mb-4 text-xs text-muted">
                Execute this proposal to transfer {formatStx(proposal.amount)} STX to the proposer.
              </p>
              <button
                onClick={handleExecute}
                className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim active:scale-95"
              >
                Execute
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-xs font-semibold text-muted uppercase tracking-wider">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Proposer</dt>
                <dd>
                  <a
                    href={explorerAddressUrl(proposal.proposer)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-green hover:underline"
                  >
                    {truncateAddress(proposal.proposer)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Amount</dt>
                <dd className="font-semibold text-text">{formatStx(proposal.amount)} STX</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Created at block</dt>
                <dd className="text-text">{proposal.createdAt.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* TX Status */}
      {txStatus && (
        <div className="mt-6 rounded-lg bg-green/5 border border-green/20 px-4 py-2.5 text-xs text-green">
          {txStatus}
        </div>
      )}
    </div>
  );
}
