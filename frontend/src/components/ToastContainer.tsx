import { useToastStore } from '../store/toast';
import { Toast } from './Toast';

/**
 * Fixed-position overlay that renders all active toasts in a stack.
 *
 * Mounted once in Layout.tsx so every route benefits from toast
 * notifications without additional wiring.
 */
export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end gap-2 p-4 sm:p-6"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
}
