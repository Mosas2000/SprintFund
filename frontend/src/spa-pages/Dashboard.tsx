import { useEffect, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useWalletAddress, useWalletConnected, useWalletConnect } from '../store/wallet-selectors';
import { getStake, getAllProposals, getProposalCount } from '../lib/stacks';
import { callStake, callWithdrawStake } from '../lib/stacks';
import { getStxBalance } from '../lib/api';
import { formatStx, stxToMicro, MIN_STAKE_STX } from '../config';
import { explorerAddressUrl, truncateAddress } from '../lib/api';
import { sanitizeText } from '../lib/sanitize';
import { useToast } from '../hooks/useToast';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useFocusOnMount } from '../hooks/useFocusOnMount';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { pollTxStatus } from '../lib/pollTxStatus';
import { useLoadComments } from '../store/comment-selectors';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { ErrorState } from '../components/ErrorState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toErrorMessage } from '../lib/errors';
import type { Proposal } from '../types';

/**
 * Dashboard provides user overview of stakes, balances, and proposals.
 * Users can stake/unstake tokens and manage their governance participation.
 */
export function DashboardPage(): JSX.Element {
  const connected = useWalletConnected();
  const address = useWalletAddress();
  const connect = useWalletConnect();
  const toast = useToast();
  const dialog = useConfirmDialog();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle('Dashboard');

  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [totalProposals, setTotalProposals] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [stakeInput, setStakeInput] = useState<string>('');
  const [withdrawInput, setWithdrawInput] = useState<string>('');
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const loadComments = useLoadComments();

  const fetchData = useCallback(async (): Promise<void> => {
    if (!address) return;
    setError(null);
    setLoading(true);
    try {
      const [stake, balance, allProposals, count] = await Promise.all([
        getStake(address),
        getStxBalance(address),
        getAllProposals(),
        getProposalCount(),
      ]);
      setStakeAmount(stake);
      setStxBalance(balance);
      setProposals(allProposals.filter((p) => p.proposer === address));
      setTotalProposals(count);
    } catch (err: unknown) {
      const msg = toErrorMessage(err);
      console.error('Dashboard fetch error:', err);
      setError(msg);
      toast.error('Failed to load dashboard', msg);
    } finally {
      setLoading(false);
    }
  }, [address, toast]);

  useEffect(() => {
    if (connected && address) fetchData();
    else setLoading(false);
  }, [connected, address, fetchData]);

  useEffect(() => {
    proposals.forEach((p) => loadComments(p.id));
  }, [proposals, loadComments]);

  const handleStake = useCallback((): void => {
    const stx = parseFloat(stakeInput);
    if (isNaN(stx) || stx <= 0) {
      toast.error('Invalid amount', 'Enter a valid STX amount to stake.');
      return;
    }

    dialog.open({
      title: `Stake ${stx} STX`,
      description: 'Staking STX locks your tokens in the DAO contract. You can withdraw them later.',
      variant: 'warning',
      confirmLabel: 'Confirm Stake',
      details: [
        { label: 'Amount', value: `${stx} STX` },
        { label: 'Current Stake', value: `${formatStx(stakeAmount)} STX` },
        { label: 'Wallet Balance', value: `${formatStx(stxBalance)} STX` },
      ],
      onConfirm: () => {
        toast.info('Opening wallet', 'Confirm the transaction in your wallet.');
        callStake(stxToMicro(stx), {
          onFinish: (txId: string) => {
            const toastId = toast.tx(`Pending: Stake ${stx} STX`, txId, 'Waiting for on-chain confirmation...');
            pollTxStatus(toastId, txId);
            setStakeInput('');
            setTxStatus(null);
          },
          onCancel: () => {
            toast.warning('Transaction cancelled', 'Stake was not submitted.');
            setTxStatus(null);
          },
        });
      },
    });
  }, [stakeInput, stakeAmount, stxBalance, toast, dialog]);

  const handleWithdraw = useCallback((): void => {
    const stx = parseFloat(withdrawInput);
    if (isNaN(stx) || stx <= 0) {
      toast.error('Invalid amount', 'Enter a valid STX amount to withdraw.');
      return;
    }

    dialog.open({
      title: `Withdraw ${stx} STX`,
      description: 'Withdrawing your stake reduces your voting power and may prevent you from creating proposals if your balance falls below the minimum.',
      variant: 'danger',
      confirmLabel: 'Confirm Withdrawal',
      details: [
        { label: 'Withdraw Amount', value: `${stx} STX` },
        { label: 'Current Stake', value: `${formatStx(stakeAmount)} STX` },
        { label: 'Remaining Stake', value: `${formatStx(stakeAmount - stxToMicro(stx))} STX` },
      ],
      onConfirm: () => {
        toast.info('Opening wallet', 'Confirm the withdrawal in your wallet.');
        callWithdrawStake(stxToMicro(stx), {
          onFinish: (txId: string) => {
            const toastId = toast.tx(`Pending: Withdraw ${stx} STX`, txId, 'Waiting for on-chain confirmation...');
            pollTxStatus(toastId, txId);
            setWithdrawInput('');
            setTxStatus(null);
          },
          onCancel: () => {
            toast.warning('Transaction cancelled', 'Withdrawal was not submitted.');
            setTxStatus(null);
          },
        });
      },
    });
  }, [withdrawInput, stakeAmount, toast, dialog]);

  /* -- Not connected ----------------------------- */
  if (!connected) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 ref={headingRef} tabIndex={-1} className="mb-4 text-xl sm:text-2xl font-bold text-text outline-none">Dashboard</h1>
        <p className="mb-6 text-sm text-muted">
          Connect your wallet to view your stake, balance, and proposals.
        </p>
        <button
          onClick={connect}
          className="w-full sm:w-auto rounded-lg bg-green px-6 py-3 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95 min-h-[44px]"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <ErrorState
          title="Failed to load dashboard"
          message={error}
          onRetry={fetchData}
        />
      </div>
    );
  }

  /* -- Connected --------------------------------- */
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-text outline-none">Dashboard</h1>
          <a
            href={explorerAddressUrl(address!)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View address ${truncateAddress(address!)} on Stacks Explorer (opens in new tab)`}
            className="text-xs font-mono text-green hover:underline"
          >
            {truncateAddress(address!)}
          </a>
        </div>
        <Link
          to="/proposals/create"
          className="w-full sm:w-auto rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark text-center transition-all hover:bg-green-dim active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          + New Proposal
        </Link>
      </div>

      {/* -- Stats row -------------------------------- */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="STX Balance" value={`${formatStx(stxBalance)} STX`} />
        <StatCard label="Your Stake" value={`${formatStx(stakeAmount)} STX`} />
        <StatCard label="Your Proposals" value={String(proposals.length)} />
        <StatCard label="Total Proposals" value={String(totalProposals)} />
      </div>

      {/* -- Profile link ------------------------------ */}
      <div className="mb-6">
        <Link
          to="/profile"
          className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-green/30 min-h-[44px]"
        >
          <span className="text-sm text-muted group-hover:text-text transition-colors">
            View your full activity history, voting record, and participation stats
          </span>
          <span className="ml-3 shrink-0 text-xs font-semibold text-green" aria-hidden="true">
            Profile →
          </span>
        </Link>
      </div>

      {/* -- TX Status -------------------------------- */}
      {txStatus && (
        <div className="mb-6 rounded-lg bg-green/5 border border-green/20 px-4 py-2.5 text-xs text-green" role="status" aria-live="polite">
          {txStatus}
        </div>
      )}

      {/* -- Stake / Withdraw -------------------------- */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Stake */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-text">Stake STX</h2>
          <p className="mb-3 text-xs text-muted">Min {MIN_STAKE_STX} STX required to create proposals</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="stake-amount" className="sr-only">Amount to stake in STX</label>
            <input
              id="stake-amount"
              type="number"
              step="0.01"
              min="0"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              placeholder="10"
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder-muted outline-none focus:border-green/40 min-h-[44px]"
            />
            <button
              onClick={handleStake}
              className="w-full sm:w-auto rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim active:scale-95 min-h-[44px]"
            >
              Stake
            </button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-text">Withdraw Stake</h2>
          <p className="mb-3 text-xs text-muted">Current stake: {formatStx(stakeAmount)} STX</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="withdraw-amount" className="sr-only">Amount to withdraw in STX</label>
            <input
              id="withdraw-amount"
              type="number"
              step="0.01"
              min="0"
              value={withdrawInput}
              onChange={(e) => setWithdrawInput(e.target.value)}
              placeholder="5"
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder-muted outline-none focus:border-green/40 min-h-[44px]"
            />
            <button
              onClick={handleWithdraw}
              className="w-full sm:w-auto rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-green/40 hover:text-green active:scale-95 min-h-[44px]"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* -- Your proposals ----------------------------- */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text">Your Proposals</h2>
        {proposals.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">You haven't created any proposals yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <Link
                key={p.id}
                to={`/proposals/${p.id}`}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-3 sm:p-4 transition-colors hover:border-green/30 min-h-[44px]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text truncate">{sanitizeText(p.title)}</p>
                  <p className="text-xs text-muted">
                    {formatStx(p.amount)} STX  {p.votesFor} for / {p.votesAgainst} against
                  </p>
                </div>
                <span
                  className={`self-start sm:self-center shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.executed ? 'bg-green/10 text-green' : 'bg-amber/10 text-amber'
                  }`}
                >
                  {p.executed ? 'Executed' : 'Active'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      <ConfirmDialog
        open={dialog.isOpen}
        action={dialog.pendingAction}
        onClose={dialog.close}
      />
    </div>
  );
}

/* -- Stat card helper ----------------------------- */

const StatCard = memo(function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted truncate">{label}</p>
      <p className="mt-1 text-lg font-bold text-text truncate">{value}</p>
    </div>
  );
});
