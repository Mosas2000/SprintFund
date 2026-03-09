interface FieldErrorMessageProps {
  /** The error message to display, or undefined/null if no error. */
  message: string | undefined;
  /** Whether the field has been interacted with. */
  touched: boolean | undefined;
  /** Optional id for aria-describedby linkage. */
  id?: string;
}

/**
 * Renders an inline validation error message beneath a form field.
 * Only visible when the field has been touched and has an error.
 * Includes role="alert" for screen reader announcements.
 */
export function FieldErrorMessage({ message, touched, id }: FieldErrorMessageProps) {
  if (!message || !touched) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-xs text-red animate-in fade-in slide-in-from-top-1 duration-200"
    >
      {message}
    </p>
  );
}
