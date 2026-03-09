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
