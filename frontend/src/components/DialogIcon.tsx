import { memo } from 'react';
import type { DialogVariant } from '../types/confirm-dialog';
import { VARIANT_CONFIG } from '../lib/dialog-variants';

interface DialogIconProps {
  variant: DialogVariant;
}

/**
 * Renders a variant-coloured icon inside a rounded background.
 *
 * - warning: exclamation triangle (amber)
 * - danger: exclamation circle (red)
 * - info: information circle (green)
 */
export const DialogIcon = memo(function DialogIcon({ variant }: DialogIconProps) {
  const config = VARIANT_CONFIG[variant];

  return (
    <div
      className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
    >
      <svg
        className={`h-6 w-6 ${config.iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        {variant === 'warning' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        )}
        {variant === 'danger' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.375h.008v.008H12v-.008Z"
          />
        )}
        {variant === 'info' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        )}
      </svg>
    </div>
  );
});
