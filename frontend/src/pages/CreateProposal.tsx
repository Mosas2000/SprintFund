import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { callCreateProposal } from '../lib/stacks';
import { stxToMicro, MIN_STAKE_STX } from '../config';
import { useToast } from '../hooks/useToast';
import { useFormValidation } from '../hooks/useFormValidation';
import { CharacterCounter } from '../components/CharacterCounter';
import { pollTxStatus } from '../lib/pollTxStatus';

export function CreateProposalPage() {
  const { connected, connect } = useWalletStore();
  const navigate = useNavigate();
  const toast = useToast();
  const validation = useFormValidation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const isValid = validation.validateAll({ title, description, amount, duration });
    if (!isValid) return;

    const stx = parseFloat(amount);

    toast.info('Opening wallet', 'Confirm the proposal submission in your wallet.');
    setTxStatus('Opening wallet...');
    try {
      await callCreateProposal(stxToMicro(stx), title.trim(), description.trim(), {
        onFinish: (txId) => {
          const toastId = toast.tx(`Pending: Create proposal "${title.trim().slice(0, 30)}..."`, txId, 'Waiting for on-chain confirmation...');
          pollTxStatus(toastId, txId);
          setTxStatus(null);
          validation.resetValidation();
          setTimeout(() => navigate('/proposals'), 2000);
        },
        onCancel: () => {
          toast.warning('Transaction cancelled', 'Proposal was not submitted.');
          setTxStatus(null);
        },
      });
    } catch (err) {
      console.error('[SprintFund] Submit failed:', err);
      toast.error('Submission failed', String(err));
      setSubmitError(String(err));
      setTxStatus(null);
    }
  };

  if (!connected) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold text-text">Create Proposal</h1>
        <p className="mb-6 text-sm text-muted">
          Connect your wallet to create a proposal. You need at least {MIN_STAKE_STX} STX staked.
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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold text-text">Create Proposal</h1>
      <p className="mb-8 text-sm text-muted">
        Submit a funding request to the SprintFund DAO. Requires {MIN_STAKE_STX}+ STX staked.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
            <span>Title</span>
            <CharacterCounter current={title.length} field="title" />
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              validation.handleChange('title', e.target.value);
            }}
            onBlur={() => validation.handleBlur('title', title)}
            maxLength={100}
            placeholder="E.g. Fund Stacks Developer Workshop"
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors ${
              validation.errors.title && validation.touched.title
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          {validation.errors.title && validation.touched.title && (
            <p className="mt-1 text-xs text-red">{validation.errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
            <span>Description</span>
            <CharacterCounter current={description.length} field="description" />
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              validation.handleChange('description', e.target.value);
            }}
            onBlur={() => validation.handleBlur('description', description)}
            maxLength={500}
            rows={5}
            placeholder="Describe what you'll build, who benefits, and your delivery timeline..."
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors resize-none ${
              validation.errors.description && validation.touched.description
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          {validation.errors.description && validation.touched.description && (
            <p className="mt-1 text-xs text-red">{validation.errors.description}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Requested Amount (STX)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              validation.handleChange('amount', e.target.value);
            }}
            onBlur={() => validation.handleBlur('amount', amount)}
            placeholder="50"
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors ${
              validation.errors.amount && validation.touched.amount
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          {validation.errors.amount && validation.touched.amount ? (
            <p className="mt-1 text-xs text-red">{validation.errors.amount}</p>
          ) : (
            <p className="mt-1 text-xs text-muted">Recommended: 50-200 STX for micro-grants</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            Duration (days)
          </label>
          <input
            type="number"
            step="1"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              validation.handleChange('duration', e.target.value);
            }}
            onBlur={() => validation.handleBlur('duration', duration)}
            placeholder="14"
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors ${
              validation.errors.duration && validation.touched.duration
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          {validation.errors.duration && validation.touched.duration ? (
            <p className="mt-1 text-xs text-red">{validation.errors.duration}</p>
          ) : (
            <p className="mt-1 text-xs text-muted">How long the voting period should last (1-30 days)</p>
          )}
        </div>

        {/* Submit Error */}
        {submitError && (
          <p className="rounded-lg bg-red/5 border border-red/20 px-3 py-2 text-xs text-red">
            {submitError}
          </p>
        )}

        {/* TX Status */}
        {txStatus && (
          <p className="rounded-lg bg-green/5 border border-green/20 px-3 py-2 text-xs text-green">
            {txStatus}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!!txStatus}
          className="w-full rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          Submit Proposal
        </button>
      </form>
    </div>
  );
}
