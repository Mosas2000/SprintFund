import type { DialogVariant } from '../types/confirm-dialog';

/**
 * Per-variant visual configuration consumed by the ConfirmDialog component.
 */
export interface VariantConfig {
  /** Tailwind classes applied to the icon wrapper */
  iconBg: string;
  /** Tailwind text colour class for the icon SVG */
  iconColor: string;
  /** Tailwind classes applied to the confirm button */
  confirmButton: string;
}

/**
 * Maps each `DialogVariant` to its visual styling tokens.
 * Centralises colour decisions so the ConfirmDialog component
 * remains free of conditional class logic.
 */
export const VARIANT_CONFIG: Record<DialogVariant, VariantConfig> = {
  warning: {
    iconBg: 'bg-amber/10',
    iconColor: 'text-amber',
    confirmButton:
      'bg-amber text-dark hover:bg-amber/90 focus-visible:ring-amber/40',
  },
  danger: {
    iconBg: 'bg-red/10',
    iconColor: 'text-red',
    confirmButton:
      'bg-red text-white hover:bg-red/90 focus-visible:ring-red/40',
  },
  info: {
    iconBg: 'bg-green/10',
    iconColor: 'text-green',
    confirmButton:
      'bg-green text-dark hover:bg-green-dim focus-visible:ring-green/40',
  },
};
