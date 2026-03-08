import { useEffect, useRef, useState } from 'react';
import type { Toast as ToastType } from '../types';
import { explorerTxUrl } from '../lib/api';

/* ── Variant configuration ────────────────────── */

const VARIANT_STYLES: Record<ToastType['variant'], { border: string; icon: string; iconColor: string }> = {
  success: {
    border: 'border-green/30',
    icon: 'M5 13l4 4L19 7',
    iconColor: 'text-green',
  },
  error: {
    border: 'border-red/30',
    icon: 'M6 18L18 6M6 6l12 12',
    iconColor: 'text-red',
  },
  warning: {
    border: 'border-amber/30',
    icon: 'M12 9v4m0 4h.01M12 3L2 21h20L12 3z',
    iconColor: 'text-amber',
  },
  info: {
    border: 'border-blue-400/30',
    icon: 'M13 16h-1v-4h-1m1-4h.01',
    iconColor: 'text-blue-400',
  },
  tx: {
    border: 'border-green/30',
    icon: '',
    iconColor: 'text-green',
  },
};

/* ── Props ────────────────────────────────────── */

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

/* ── Component ────────────────────────────────── */

export function Toast({ toast, onDismiss }: ToastProps) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const style = VARIANT_STYLES[toast.variant];

  // Auto-dismiss timer
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      timerRef.current = setTimeout(() => {
        setExiting(true);
      }, toast.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.duration]);

  // Remove from store after exit animation completes
  useEffect(() => {
    if (exiting) {
      const exitTimer = setTimeout(() => {
        onDismiss(toast.id);
      }, 300);
      return () => clearTimeout(exitTimer);
    }
  }, [exiting, onDismiss, toast.id]);

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExiting(true);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`
        pointer-events-auto w-full max-w-sm rounded-lg border bg-card px-4 py-3 shadow-lg
        ${style.border}
        ${exiting ? 'toast-exit' : 'toast-enter'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        {toast.variant !== 'tx' && (
          <div className={`mt-0.5 shrink-0 ${style.iconColor}`}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={style.icon} />
            </svg>
          </div>
        )}

        {/* TX spinner icon */}
        {toast.variant === 'tx' && (
          <div className="mt-0.5 shrink-0">
            {toast.txStatus === 'pending' && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green border-t-transparent" />
            )}
            {toast.txStatus === 'success' && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.txStatus === 'failed' && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">{toast.title}</p>
          {toast.description && (
            <p className="mt-0.5 text-xs text-muted">{toast.description}</p>
          )}
          {toast.txId && (
            <a
              href={explorerTxUrl(toast.txId)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-xs text-green hover:underline"
            >
              View on Explorer
            </a>
          )}
        </div>

        {/* Dismiss button */}
        {toast.dismissible && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 rounded p-0.5 text-muted transition-colors hover:text-text"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress bar for auto-dismiss toasts */}
      {toast.duration && toast.duration > 0 && !exiting && (
        <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-green/40 toast-progress"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}
