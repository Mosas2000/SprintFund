/**
 * Validation rules and utilities for the Create Proposal form.
 *
 * Each field has a dedicated validator that returns either an error
 * message string or null when the value is valid.
 */

export interface ValidationRule {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export const PROPOSAL_RULES = {
  title: {
    required: true,
    minLength: 5,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 500,
  },
  amount: {
    required: true,
    min: 1,
    max: 10_000,
  },
  duration: {
    required: true,
    min: 1,
    max: 30,
  },
} as const;

/* ── Individual field validators ─────────────── */

export function validateTitle(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Title is required';
  if (trimmed.length < PROPOSAL_RULES.title.minLength) {
    return `Title must be at least ${PROPOSAL_RULES.title.minLength} characters`;
  }
  if (trimmed.length > PROPOSAL_RULES.title.maxLength) {
    return `Title must be at most ${PROPOSAL_RULES.title.maxLength} characters`;
  }
  return null;
}

export function validateDescription(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Description is required';
  if (trimmed.length < PROPOSAL_RULES.description.minLength) {
    return `Description must be at least ${PROPOSAL_RULES.description.minLength} characters`;
  }
  if (trimmed.length > PROPOSAL_RULES.description.maxLength) {
    return `Description must be at most ${PROPOSAL_RULES.description.maxLength} characters`;
  }
  return null;
}

export function validateAmount(value: string): string | null {
  if (!value.trim()) return 'Amount is required';
  const num = parseFloat(value);
  if (isNaN(num)) return 'Amount must be a valid number';
  if (num < PROPOSAL_RULES.amount.min) {
    return `Amount must be at least ${PROPOSAL_RULES.amount.min} STX`;
  }
  if (num > PROPOSAL_RULES.amount.max) {
    return `Amount must be at most ${PROPOSAL_RULES.amount.max.toLocaleString()} STX`;
  }
  return null;
}

export function validateDuration(value: string): string | null {
  if (!value.trim()) return 'Duration is required';
  const num = parseInt(value, 10);
  if (isNaN(num)) return 'Duration must be a whole number';
  if (num < PROPOSAL_RULES.duration.min) {
    return `Duration must be at least ${PROPOSAL_RULES.duration.min} day`;
  }
  if (num > PROPOSAL_RULES.duration.max) {
    return `Duration must be at most ${PROPOSAL_RULES.duration.max} days`;
  }
  return null;
}

/* ── Aggregate form validator ────────────────── */

export interface ProposalFormValues {
  title: string;
  description: string;
  amount: string;
  duration: string;
}

export type FormErrors = Partial<Record<keyof ProposalFormValues, string>>;

/**
 * Validate all proposal form fields at once.
 * Returns an object mapping field names to error messages.
 * An empty object means the form is valid.
 */
export function validateProposalForm(values: ProposalFormValues): FormErrors {
  const errors: FormErrors = {};

  const titleError = validateTitle(values.title);
  if (titleError) errors.title = titleError;

  const descriptionError = validateDescription(values.description);
  if (descriptionError) errors.description = descriptionError;

  const amountError = validateAmount(values.amount);
  if (amountError) errors.amount = amountError;

  const durationError = validateDuration(values.duration);
  if (durationError) errors.duration = durationError;

  return errors;
}

/**
 * Check whether a FormErrors object represents a fully valid form.
 */
export function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0;
}
