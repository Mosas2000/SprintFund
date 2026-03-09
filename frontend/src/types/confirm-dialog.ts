/**
 * Visual variant for the confirmation dialog.
 *
 * - `warning`  - amber styling, used for risky but recoverable actions (stake, vote)
 * - `danger`   - red styling, used for irreversible actions (execute, withdraw)
 * - `info`     - green styling, used for neutral confirmations (create proposal)
 */
export type DialogVariant = 'warning' | 'danger' | 'info';

/**
 * A single key-value detail row rendered inside the dialog body.
 * For example: { label: 'Amount', value: '50 STX' }
 */
export interface DetailItem {
  label: string;
  value: string;
}

/**
 * Describes a pending action that requires user confirmation before executing.
 * Passed to `useConfirmDialog.open()` so the dialog can display contextual
 * information about the action the user is about to perform.
 */
export interface ConfirmDialogAction {
  /** Short headline shown in the dialog, e.g. "Stake 50 STX" */
  title: string;
  /** Longer explanation shown beneath the title */
  description: string;
  /** Visual variant that determines icon colour and confirm-button style */
  variant: DialogVariant;
  /** Label text for the confirm button, e.g. "Confirm Stake" */
  confirmLabel: string;
  /** Optional label text for the cancel button (defaults to "Cancel") */
  cancelLabel?: string;
  /** Contextual key-value details displayed in the dialog body */
  details?: DetailItem[];
  /** Callback executed when the user confirms the action */
  onConfirm: () => void;
}

/**
 * Props accepted by the ConfirmDialog component.
 *
 * When `open` is false the component renders nothing (un-mounts from DOM).
 * When `open` is true a modal overlay with focus trap is rendered.
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is currently visible */
  open: boolean;
  /** The action that triggered this dialog, or null when closed */
  action: ConfirmDialogAction | null;
  /** Called when the user dismisses the dialog (Cancel, Escape, overlay click) */
  onClose: () => void;
}
