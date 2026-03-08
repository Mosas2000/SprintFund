import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { callCreateProposal } from '../lib/stacks';
import { stxToMicro } from '../config';

export function CreateProposalPage() {
  const { connected, connect } = useWalletStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Title is required';
    else if (title.length > 100) next.title = 'Max 100 characters';
    if (!description.trim()) next.description = 'Description is required';
    else if (description.length > 500) next.description = 'Max 500 characters';
    const stx = parseFloat(amount);
    if (!amount || isNaN(stx) || stx <= 0) next.amount = 'Enter a valid STX amount';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const stx = parseFloat(amount);
    setTxStatus('Opening wallet…');
    callCreateProposal(stxToMicro(stx), title.trim(), description.trim(), {
      onFinish: (txId) => {
        setTxStatus(`Proposal submitted! TX: ${txId.slice(0, 12)}…`);
        setTimeout(() => navigate('/proposals'), 2000);
      },
      onCancel: () => setTxStatus(null),
    });
  };

  if (!connected) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-text">Create Proposal</h1>
        <p className="mb-6 text-sm text-muted">
          Connect your wallet to create a new funding proposal.
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

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Create Proposal</h1>

      <div className="space-y-5 rounded-xl border border-border bg-card p-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-1 block text-xs font-medium text-muted">
            Title
          </label>
          <input
            id="title"
            type="text"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short descriptive title"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40"
          />
          {errors.title && <p className="mt-1 text-xs text-red">{errors.title}</p>}
          <p className="mt-1 text-[10px] text-muted">{title.length}/100</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-1 block text-xs font-medium text-muted">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What will this funding achieve?"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40 resize-none"
          />
          {errors.description && <p className="mt-1 text-xs text-red">{errors.description}</p>}
          <p className="mt-1 text-[10px] text-muted">{description.length}/500</p>
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="mb-1 block text-xs font-medium text-muted">
            Funding Amount (STX)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder-muted outline-none focus:border-green/40"
          />
          {errors.amount && <p className="mt-1 text-xs text-red">{errors.amount}</p>}
        </div>

        {/* TX Status */}
        {txStatus && (
          <div className="rounded-lg bg-green/5 border border-green/20 px-4 py-2.5 text-xs text-green">
            {txStatus}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim active:scale-95"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  );
}
