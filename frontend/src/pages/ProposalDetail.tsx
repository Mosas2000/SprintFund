import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProposal } from '../lib/stacks';
import { callVote, callExecuteProposal } from '../lib/stacks';
import { formatStx } from '../config';
import { truncateAddress, explorerAddressUrl, explorerTxUrl } from '../lib/api';
import { useWalletStore } from '../store/wallet';
import { useToast } from '../hooks/useToast';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useFocusOnMount } from '../hooks/useFocusOnMount';
import { pollTxStatus } from '../lib/pollTxStatus';
import { ProposalDetailSkeleton } from '../components/ProposalDetailSkeleton';
import { ErrorState } from '../components/ErrorState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toErrorMessage } from '../lib/errors';
import type { Proposal } from '../types';

export function ProposalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const proposalId = Number(id);

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteWeight, setVoteWeight] = useState('1');
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const { connected, address } = useWalletStore();
  const toast = useToast();
  const dialog = useConfirmDialog();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  const fetchProposal = useCallback(() => {
    if (isNaN(proposalId)) {
      setError('Invalid proposal ID');
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    getProposal(proposalId)
      .then((p) => {
        if (!p) setError('Proposal not found');
        else setProposal(p);
      })
      .catch((err) => setError(toErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [proposalId]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const handleVote = (support: boolean) => {
    const weight = parseInt(voteWeight, 10);
    if (isNaN(weight) || weight < 1) {
      toast.error('Invalid vote weight', 'Enter a weight of at least 1.');
      return;
    }
    const direction = support ? 'For' : 'Against';

    dialog.open({
      title: `Vote ${direction}`,
      description: `You are about to cast a ${direction.toLowerCase()} vote on this proposal. This action is irreversible once confirmed on-chain.`,
      variant: support ? 'warning' : 'danger',
      confirmLabel: `Confirm Vote ${direction}`,
      details: [
        { label: 'Proposal', value: proposal?.title ?? `#${proposalId}` },
        { label: 'Direction', value: direction },
        { label: 'Weight', value: String(weight) },
        { label: 'Quadratic Cost', value: `${weight ** 2} stake weight` },
      ],
      onConfirm: () => {
        toast.info('Opening wallet', `Confirm your ${direction} vote in your wallet.`);
        setTxStatus('Opening wallet...');
        callVote(proposalId, support, weight, {
          onFinish: (txId) => {
            const toastId = toast.tx(`Pending: Vote ${direction} (weight ${weight})`, txId, 'Waiting for on-chain confirmation...');
            pollTxStatus(toastId, txId);
            setTxStatus(null);
          },
          onCancel: () => {
            toast.warning('Transaction cancelled', 'Vote was not submitted.');
            setTxStatus(null);
          },
        });
      },
    });
  };

  const handleExecute = () => {
    dialog.open({
      title: 'Execute Proposal',
      description: 'Executing this proposal will transfer the requested STX from the treasury. This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Confirm Execution',
      details: [
        { label: 'Proposal', value: proposal?.title ?? `#${proposalId}` },
        { label: 'Amount', value: `${formatStx(proposal?.amount ?? 0)} STX` },
        { label: 'Votes For', value: String(proposal?.votesFor ?? 0) },
        { label: 'Votes Against', value: String(proposal?.votesAgainst ?? 0) },
      ],
      onConfirm: () => {
        toast.info('Opening wallet', 'Confirm proposal execution in your wallet.');
        setTxStatus('Opening wallet...');
        callExecuteProposal(proposalId, {
          onFinish: (txId) => {
            const toastId = toast.tx(`Pending: Execute proposal #${proposalId}`, txId, 'Waiting for on-chain confirmation...');
            pollTxStatus(toastId, txId);
            setTxStatus(null);
          },
          onCancel: () => {
            toast.warning('Transaction cancelled', 'Execution was not submitted.');
            setTxStatus(null);
          },
        });
      },
    });
  };

  if (loading) {
    return <ProposalDetailSkeleton />;
  }

  if (error || !proposal) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <ErrorState
          title="Could not load proposal"
          message={error ?? 'Proposal not found'}
          onRetry={fetchProposal}
        />
        <div className="mt-4 text-center">
          <Link to="/proposals" className="text-sm text-green hover:underline">
            &larr; Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
  const passing = proposal.votesFor > proposal.votesAgainst;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Link to="/proposals" className="inline-block text-sm text-muted hover:text-green transition-colors">
          &larr; All Proposals
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* -- Main ----------------------------------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + status */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-text sm:text-2xl outline-none">{proposal.title}</h1>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  proposal.executed ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                }`}
              >
                {proposal.executed ? 'Executed' : 'Active'}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{proposal.description}</p>
          </div>

          {/* Vote bar */}
          <div className="rounded-xl border border-border bg-card p-6" aria-label="Vote results" role="region">
            <h2 className="mb-4 text-sm font-semibold text-text">Votes</h2>
            <div className="mb-2 flex justify-between text-sm" aria-live="polite">
              <span className="text-green">For: {proposal.votesFor}</span>
              <span className="text-red">Against: {proposal.votesAgainst}</span>
            </div>
            <div
              className="h-2 w-full rounded-full bg-border overflow-hidden"
              role="progressbar"
              aria-valuenow={forPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${forPct}% of votes in favor`}
            >
              <div
                className="h-full rounded-full bg-green transition-all"
                style={{ width: `${forPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted" aria-live="polite">
              {totalVotes === 0
                ? 'No votes yet'
                : `${totalVotes} total votes - ${passing ? 'Passing' : 'Not passing'}`}
            </p>
          </div>

          {/* Vote actions */}
          {connected && !proposal.executed && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-sm font-semibold text-text">Cast Your Vote</h2>
              <div className="mb-4">
                <label htmlFor="vote-weight" className="mb-1.5 block text-xs text-muted">Vote Weight (quadratic cost = weight squared)</label>
                <input
                  id="vote-weight"
                  type="number"
                  min="1"
                  value={voteWeight}
                  onChange={(e) => setVoteWeight(e.target.value)}
                  aria-describedby="vote-weight-cost"
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40"
                  placeholder="1"
                />
                <p id="vote-weight-cost" className="mt-1 text-xs text-muted">
                  Cost: {parseInt(voteWeight || '0', 10) ** 2} stake weight
                </p>
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
                  className="flex-1 rounded-lg border border-red/30 px-4 py-2 text-sm font-semibold text-red transition-all hover:bg-red/10 active:scale-95"
                >
                  Vote Against
                </button>
              </div>
              {txStatus && (
                <p className="mt-3 text-xs text-green" role="status" aria-live="polite">{txStatus}</p>
              )}
            </div>
          )}
        </div>

        {/* -- Sidebar -------------------------------- */}
        <aside aria-label="Proposal details" className="space-y-4">
          {/* Info card */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div>
              <p className="text-xs text-muted">Requested Amount</p>
              <p className="text-lg font-bold text-green">{formatStx(proposal.amount)} STX</p>
            </div>
            <div>
              <p className="text-xs text-muted">Proposer</p>
              <a
                href={explorerAddressUrl(proposal.proposer)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View proposer ${truncateAddress(proposal.proposer)} on Stacks Explorer (opens in new tab)`}
                className="font-mono text-xs text-green hover:underline"
              >
                {truncateAddress(proposal.proposer)}
              </a>
            </div>
            <div>
              <p className="text-xs text-muted">Proposal ID</p>
              <p className="font-mono text-xs text-text">#{proposal.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Created at Block</p>
              <p className="font-mono text-xs text-text">{proposal.createdAt.toLocaleString()}</p>
            </div>
          </div>

          {/* Execute */}
          {connected && !proposal.executed && passing && totalVotes > 0 && (
            <button
              onClick={handleExecute}
              className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95"
            >
              Execute Proposal
            </button>
          )}
        </aside>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={dialog.isOpen}
        action={dialog.pendingAction}
        onClose={dialog.close}
      />
    </div>
  );
}
