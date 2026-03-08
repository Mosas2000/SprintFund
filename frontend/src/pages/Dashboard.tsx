import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { getStake, getAllProposals, getProposalCount } from '../lib/stacks';
import { callStake, callWithdrawStake } from '../lib/stacks';
import { getStxBalance } from '../lib/api';
import { formatStx, stxToMicro, MIN_STAKE_STX } from '../config';
import { explorerAddressUrl, truncateAddress } from '../lib/api';
import type { Proposal } from '../types';

export function DashboardPage() {
  const { connected, address, connect } = useWalletStore();

  const [stakeAmount, setStakeAmount] = useState(0);
  const [stxBalance, setStxBalance] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [totalProposals, setTotalProposals] = useState(0);
  const [loading, setLoading] = useState(true);

  const [stakeInput, setStakeInput] = useState('');
  const [withdrawInput, setWithdrawInput] = useState('');
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!address) return;
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
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (connected && address) fetchData();
    else setLoading(false);
  }, [connected, address, fetchData]);

  const handleStake = () => {
    const stx = parseFloat(stakeInput);
    if (isNaN(stx) || stx <= 0) return;
    setTxStatus('Opening wallet…');
    callStake(stxToMicro(stx), {
      onFinish: (txId) => {
        setTxStatus(`Staked! TX: ${txId.slice(0, 12)}…`);
        setStakeInput('');
      },
      onCancel: () => setTxStatus(null),
    });
  };

  const handleWithdraw = () => {
    const stx = parseFloat(withdrawInput);
    if (isNaN(stx) || stx <= 0) return;
    setTxStatus('Opening wallet…');
    callWithdrawStake(stxToMicro(stx), {
      onFinish: (txId) => {
        setTxStatus(`Withdrawn! TX: ${txId.slice(0, 12)}…`);
        setWithdrawInput('');
      },
      onCancel: () => setTxStatus(null),
    });
  };

  /* ── Not connected ─────────────────── */
  if (!connected) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-text">Dashboard</h1>
        <p className="mb-6 text-sm text-muted">
          Connect your wallet to view your stake, balance, and proposals.
        </p>
        <button
          onClick={connect}
          className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-green border-t-transparent" />
      </div>
    );
  }

  /* ── Connected ─────────────────────── */
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <a
            href={explorerAddressUrl(address!)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-green hover:underline"
          >
            {truncateAddress(address!)}
          </a>
        </div>
        <Link
          to="/proposals/create"
          className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark text-center transition-all hover:bg-green-dim active:scale-95"
        >
          + New Proposal
        </Link>
      </div>

      {/* ── Stats row ────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="STX Balance" value={`${formatStx(stxBalance)} STX`} />
        <StatCard label="Your Stake" value={`${formatStx(stakeAmount)} STX`} />
        <StatCard label="Your Proposals" value={String(proposals.length)} />
        <StatCard label="Total Proposals" value={String(totalProposals)} />
      </div>

      {/* ── TX Status ────────────────────── */}
      {txStatus && (
        <div className="mb-6 rounded-lg bg-green/5 border border-green/20 px-4 py-2.5 text-xs text-green">
          {txStatus}
        </div>
      )}

      {/* ── Stake / Withdraw ─────────────── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Stake */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-text">Stake STX</h3>
          <p className="mb-3 text-xs text-muted">Min {MIN_STAKE_STX} STX required to create proposals</p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              placeholder="10"
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40"
            />
            <button
              onClick={handleStake}
              className="rounded-lg bg-green px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-green-dim active:scale-95"
            >
              Stake
            </button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-semibold text-text">Withdraw Stake</h3>
          <p className="mb-3 text-xs text-muted">Current stake: {formatStx(stakeAmount)} STX</p>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={withdrawInput}
              onChange={(e) => setWithdrawInput(e.target.value)}
              placeholder="5"
              className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40"
            />
            <button
              onClick={handleWithdraw}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:border-green/40 hover:text-green active:scale-95"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ── Your proposals ───────────────── */}
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
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-green/30"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text truncate">{p.title}</p>
                  <p className="text-xs text-muted">
                    {formatStx(p.amount)} STX · {p.votesFor} for / {p.votesAgainst} against
                  </p>
                </div>
                <span
                  className={`shrink-0 ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
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
    </div>
  );
}

/* ── Stat card helper ───────────────── */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-text">{value}</p>
    </div>
  );
}
