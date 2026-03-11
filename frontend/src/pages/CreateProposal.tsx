import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../store/wallet';
import { callCreateProposal } from '../lib/stacks';
import { stxToMicro, MIN_STAKE_STX } from '../config';
import { useToast } from '../hooks/useToast';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import { useFormValidation } from '../hooks/useFormValidation';
import { useFocusOnMount } from '../hooks/useFocusOnMount';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { isFormValid, validateProposalForm } from '../lib/validation';
import { CharacterCounter } from '../components/CharacterCounter';
import { FieldErrorMessage } from '../components/FieldErrorMessage';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { pollTxStatus } from '../lib/pollTxStatus';

export function CreateProposalPage() {
  const { connected, connect } = useWalletStore();
  const navigate = useNavigate();
  const toast = useToast();
  const validation = useFormValidation();
  const dialog = useConfirmDialog();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  useDocumentTitle('Create Proposal');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /** Disable submit when a transaction is pending or any field has a known error. */
  const canSubmit = !txStatus && isFormValid(validateProposalForm({ title, description, amount, duration }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const isValid = validation.validateAll({ title, description, amount, duration });
    if (!isValid) return;

    const stx = parseFloat(amount);

    dialog.open({
      title: 'Submit Proposal',
      description: 'Your proposal will be submitted to the DAO for community voting. The requested STX will be held in the treasury until the proposal is executed.',
      variant: 'info',
      confirmLabel: 'Confirm Submission',
      details: [
        { label: 'Title', value: title.trim().slice(0, 40) + (title.trim().length > 40 ? '...' : '') },
        { label: 'Requested Amount', value: `${stx} STX` },
        { label: 'Duration', value: `${duration} days` },
      ],
      onConfirm: async () => {
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
      },
    });
  };

  if (!connected) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h1 ref={headingRef} tabIndex={-1} className="mb-4 text-xl sm:text-2xl font-bold text-text outline-none">Create Proposal</h1>
        <p className="mb-6 text-sm text-muted">
          Connect your wallet to create a proposal. You need at least {MIN_STAKE_STX} STX staked.
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

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <h1 ref={headingRef} tabIndex={-1} className="mb-2 text-2xl font-bold text-text outline-none">Create Proposal</h1>
      <p className="mb-8 text-sm text-muted">
        Submit a funding request to the SprintFund DAO. Requires {MIN_STAKE_STX}+ STX staked.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Title */}
        <div>
          <label htmlFor="proposal-title" className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
            <span>Title</span>
            <CharacterCounter current={title.length} field="title" />
          </label>
          <input
            id="proposal-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              validation.handleChange('title', e.target.value);
            }}
            onBlur={() => validation.handleBlur('title', title)}
            maxLength={100}
            placeholder="E.g. Fund Stacks Developer Workshop"
            aria-invalid={!!(validation.errors.title && validation.touched.title)}
            aria-describedby={validation.errors.title && validation.touched.title ? 'title-error' : undefined}
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors min-h-[44px] ${
              validation.errors.title && validation.touched.title
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          <FieldErrorMessage message={validation.errors.title} touched={validation.touched.title} id="title-error" />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="proposal-description" className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted">
            <span>Description</span>
            <CharacterCounter current={description.length} field="description" />
          </label>
          <textarea
            id="proposal-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              validation.handleChange('description', e.target.value);
            }}
            onBlur={() => validation.handleBlur('description', description)}
            maxLength={500}
            rows={5}
            placeholder="Describe what you'll build, who benefits, and your delivery timeline..."
            aria-invalid={!!(validation.errors.description && validation.touched.description)}
            aria-describedby={validation.errors.description && validation.touched.description ? 'description-error' : undefined}
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors resize-none min-h-[120px] ${
              validation.errors.description && validation.touched.description
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          <FieldErrorMessage message={validation.errors.description} touched={validation.touched.description} id="description-error" />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="proposal-amount" className="mb-1.5 block text-xs font-medium text-muted">
            Requested Amount (STX)
          </label>
          <input
            id="proposal-amount"
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
            aria-invalid={!!(validation.errors.amount && validation.touched.amount)}
            aria-describedby={validation.errors.amount && validation.touched.amount ? 'amount-error' : 'amount-hint'}
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors min-h-[44px] ${
              validation.errors.amount && validation.touched.amount
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          {validation.errors.amount && validation.touched.amount ? (
            <FieldErrorMessage message={validation.errors.amount} touched={validation.touched.amount} id="amount-error" />
          ) : (
            <p id="amount-hint" className="mt-1 text-xs text-muted">Recommended: 50-200 STX for micro-grants</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="proposal-duration" className="mb-1.5 block text-xs font-medium text-muted">
            Duration (days)
          </label>
          <input
            id="proposal-duration"
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
            aria-invalid={!!(validation.errors.duration && validation.touched.duration)}
            aria-describedby={validation.errors.duration && validation.touched.duration ? 'duration-error' : 'duration-hint'}
            className={`w-full rounded-lg border bg-card px-3 py-2.5 text-sm text-text placeholder-muted/50 outline-none transition-colors min-h-[44px] ${
              validation.errors.duration && validation.touched.duration
                ? 'border-red/60 focus:border-red/80'
                : 'border-border focus:border-green/40'
            }`}
          />
          {validation.errors.duration && validation.touched.duration ? (
            <FieldErrorMessage message={validation.errors.duration} touched={validation.touched.duration} id="duration-error" />
          ) : (
            <p id="duration-hint" className="mt-1 text-xs text-muted">How long the voting period should last (1-30 days)</p>
          )}
        </div>

        {/* Validation summary -- shown after a failed submit attempt */}
        {validation.submitted && Object.keys(validation.errors).length > 0 && (
          <div role="alert" aria-live="assertive" className="rounded-lg bg-red/5 border border-red/20 px-4 py-3">
            <p className="mb-1.5 text-xs font-medium text-red">
              Please fix the following before submitting:
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              {Object.values(validation.errors).map((msg, i) => (
                <li key={i} className="text-xs text-red/80">{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Error */}
        {submitError && (
          <p role="alert" aria-live="assertive" className="rounded-lg bg-red/5 border border-red/20 px-3 py-2 text-xs text-red">
            {submitError}
          </p>
        )}

        {/* TX Status */}
        {txStatus && (
          <p role="status" aria-live="polite" className="rounded-lg bg-green/5 border border-green/20 px-3 py-2 text-xs text-green">
            {txStatus}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-green px-4 py-3 text-sm font-semibold text-dark transition-all hover:bg-green-dim hover:shadow-[0_0_16px_rgba(0,255,136,0.3)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]"
        >
          Submit Proposal
        </button>
      </form>

      {/* Confirmation dialog */}
      <ConfirmDialog
        open={dialog.isOpen}
        action={dialog.pendingAction}
        onClose={dialog.close}
      />
    </div>
  );
}
