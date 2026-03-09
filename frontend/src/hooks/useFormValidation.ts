import { useState, useCallback } from 'react';
import type { ProposalFormValues, FormErrors } from '../lib/validation';
import {
  validateTitle,
  validateDescription,
  validateAmount,
  validateDuration,
  validateProposalForm,
  isFormValid,
} from '../lib/validation';

/** Tracks which fields the user has interacted with (blurred). */
export type TouchedFields = Partial<Record<keyof ProposalFormValues, boolean>>;

/**
 * Custom hook that manages inline form validation state for the
 * Create Proposal form. Provides per-field validation on blur,
 * real-time validation on change after a field has been touched,
 * and a full-form validation pass on submit.
 */
export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitted, setSubmitted] = useState(false);

  /** Map each field name to its validator function. */
  const validators: Record<
    keyof ProposalFormValues,
    (value: string) => string | null
  > = {
    title: validateTitle,
    description: validateDescription,
    amount: validateAmount,
    duration: validateDuration,
  };

  /**
   * Validate a single field and update the errors state.
   * Called on blur and on change (when the field has been touched).
   */
  const validateField = useCallback(
    (field: keyof ProposalFormValues, value: string) => {
      const error = validators[field](value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
        return next;
      });
      return error;
    },
    [],
  );

  /**
   * Mark a field as touched and trigger validation.
   * Intended for the onBlur handler of each input.
   */
  const handleBlur = useCallback(
    (field: keyof ProposalFormValues, value: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, value);
    },
    [validateField],
  );

  /**
   * Validate on change only if the field has already been touched
   * or the form has been submitted once.
   */
  const handleChange = useCallback(
    (field: keyof ProposalFormValues, value: string) => {
      if (touched[field] || submitted) {
        validateField(field, value);
      }
    },
    [touched, submitted, validateField],
  );

  /**
   * Run full-form validation. Marks the form as submitted so that
   * all future changes trigger real-time feedback.
   * Returns true if the form is valid.
   */
  const validateAll = useCallback((values: ProposalFormValues): boolean => {
    setSubmitted(true);
    setTouched({ title: true, description: true, amount: true, duration: true });
    const formErrors = validateProposalForm(values);
    setErrors(formErrors);
    return isFormValid(formErrors);
  }, []);

  /** Reset all validation state back to initial values. */
  const resetValidation = useCallback(() => {
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, []);

  return {
    errors,
    touched,
    submitted,
    validateField,
    handleBlur,
    handleChange,
    validateAll,
    resetValidation,
  };
}
