import { create } from 'zustand';
import type { Toast, ToastVariant, TxStatus } from '../types';

/* ── Constants ────────────────────────────────── */

const MAX_TOASTS = 5;
const DEFAULT_DURATION_MS = 5000;
const TX_TOAST_DURATION_MS = 0; // tx toasts persist until dismissed or resolved

/* ── Store interface ──────────────────────────── */

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'createdAt'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  updateTxStatus: (id: string, txStatus: TxStatus) => void;
}

/* ── ID generator ─────────────────────────────── */

let idCounter = 0;

function generateId(): string {
  idCounter += 1;
  return `toast-${Date.now()}-${idCounter}`;
}

/* ── Store ────────────────────────────────────── */

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
      dismissible: toast.dismissible ?? true,
      duration: toast.duration ?? (toast.variant === 'tx' ? TX_TOAST_DURATION_MS : DEFAULT_DURATION_MS),
    };

    set((state) => {
      const updated = [newToast, ...state.toasts];
      // Enforce max toasts by removing oldest beyond the limit
      if (updated.length > MAX_TOASTS) {
        return { toasts: updated.slice(0, MAX_TOASTS) };
      }
      return { toasts: updated };
    });

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },

  updateToast: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      ),
    }));
  },

  updateTxStatus: (id, txStatus) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, txStatus } : t,
      ),
    }));
  },
}));
