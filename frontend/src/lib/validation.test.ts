import { describe, it, expect } from 'vitest';
import {
  validateTitle,
  validateDescription,
  validateAmount,
  validateAmountAgainstTreasury,
  validateDuration,
  validateProposalForm,
  isFormValid,
  PROPOSAL_RULES,
} from './validation';

/* ────────────────────────────────────────────── */
/*  validateTitle                                 */
/* ────────────────────────────────────────────── */
describe('validateTitle', () => {
  it('returns error when title is empty', () => {
    expect(validateTitle('')).toBe('Title is required');
  });

  it('returns error when title is only whitespace', () => {
    expect(validateTitle('   ')).toBe('Title is required');
  });

  it('returns error when title is too short', () => {
    expect(validateTitle('ab')).toContain('at least');
  });

  it('returns null for valid title', () => {
    expect(validateTitle('Fund Stacks Developer Workshop')).toBeNull();
  });

  it('returns null for title at minimum length', () => {
    const minTitle = 'a'.repeat(PROPOSAL_RULES.title.minLength);
    expect(validateTitle(minTitle)).toBeNull();
  });

  it('returns null for title at maximum length', () => {
    const maxTitle = 'a'.repeat(PROPOSAL_RULES.title.maxLength);
    expect(validateTitle(maxTitle)).toBeNull();
  });

  it('returns error when title exceeds maximum length', () => {
    const overMax = 'a'.repeat(PROPOSAL_RULES.title.maxLength + 1);
    expect(validateTitle(overMax)).toContain('at most');
  });
});

/* ────────────────────────────────────────────── */
/*  validateDescription                           */
/* ────────────────────────────────────────────── */
describe('validateDescription', () => {
  it('returns error when description is empty', () => {
    expect(validateDescription('')).toBe('Description is required');
  });

  it('returns error when description is too short', () => {
    expect(validateDescription('Short')).toContain('at least');
  });

  it('returns null for valid description', () => {
    const valid = 'a'.repeat(PROPOSAL_RULES.description.minLength);
    expect(validateDescription(valid)).toBeNull();
  });

  it('returns error when description exceeds maximum length', () => {
    const overMax = 'a'.repeat(PROPOSAL_RULES.description.maxLength + 1);
    expect(validateDescription(overMax)).toContain('at most');
  });
});

/* ────────────────────────────────────────────── */
/*  validateAmount                                */
/* ────────────────────────────────────────────── */
describe('validateAmount', () => {
  it('returns error when amount is empty', () => {
    expect(validateAmount('')).toBe('Amount is required');
  });

  it('returns error for non-numeric input', () => {
    expect(validateAmount('abc')).toBe('Amount must be a valid number');
  });

  it('returns error when amount is below minimum', () => {
    expect(validateAmount('0')).toContain('at least');
  });

  it('returns error when amount exceeds maximum', () => {
    expect(validateAmount('99999')).toContain('at most');
  });

  it('returns null for valid amount', () => {
    expect(validateAmount('100')).toBeNull();
  });

  it('returns null for amount at boundaries', () => {
    expect(validateAmount(String(PROPOSAL_RULES.amount.min))).toBeNull();
    expect(validateAmount(String(PROPOSAL_RULES.amount.max))).toBeNull();
  });
});

/* ────────────────────────────────────────────── */
/*  validateDuration                              */
/* ────────────────────────────────────────────── */
describe('validateDuration', () => {
  it('returns error when duration is empty', () => {
    expect(validateDuration('')).toBe('Duration is required');
  });

  it('returns error for non-numeric input', () => {
    expect(validateDuration('two')).toBe('Duration must be a whole number');
  });

  it('returns error when duration is below minimum', () => {
    expect(validateDuration('0')).toContain('at least');
  });

  it('returns error when duration exceeds maximum', () => {
    expect(validateDuration('31')).toContain('at most');
  });

  it('returns null for valid duration', () => {
    expect(validateDuration('14')).toBeNull();
  });

  it('returns null for duration at boundaries', () => {
    expect(validateDuration(String(PROPOSAL_RULES.duration.min))).toBeNull();
    expect(validateDuration(String(PROPOSAL_RULES.duration.max))).toBeNull();
  });
});

/* ────────────────────────────────────────────── */
/*  validateProposalForm                          */
/* ────────────────────────────────────────────── */
describe('validateProposalForm', () => {
  const validForm = {
    title: 'Fund Stacks Developer Workshop',
    description: 'A detailed description that is long enough to pass the minimum length requirement.',
    amount: '100',
    duration: '14',
  };

  it('returns empty errors object for a valid form', () => {
    const errors = validateProposalForm(validForm);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns errors for all empty fields', () => {
    const errors = validateProposalForm({
      title: '',
      description: '',
      amount: '',
      duration: '',
    });
    expect(errors.title).toBeDefined();
    expect(errors.description).toBeDefined();
    expect(errors.amount).toBeDefined();
    expect(errors.duration).toBeDefined();
  });

  it('returns error only for the invalid field', () => {
    const errors = validateProposalForm({
      ...validForm,
      title: '',
    });
    expect(errors.title).toBeDefined();
    expect(errors.description).toBeUndefined();
    expect(errors.amount).toBeUndefined();
    expect(errors.duration).toBeUndefined();
  });
});

/* ────────────────────────────────────────────── */
/*  isFormValid                                   */
/* ────────────────────────────────────────────── */
describe('isFormValid', () => {
  it('returns true when errors object is empty', () => {
    expect(isFormValid({})).toBe(true);
  });

  it('returns false when errors object has entries', () => {
    expect(isFormValid({ title: 'Title is required' })).toBe(false);
  });
});

/* ────────────────────────────────────────────── */
/*  validateAmountAgainstTreasury                 */
/* ────────────────────────────────────────────── */
describe('validateAmountAgainstTreasury', () => {
  it('returns basic validation error when amount is invalid', () => {
    expect(validateAmountAgainstTreasury('', 100)).toBe('Amount is required');
    expect(validateAmountAgainstTreasury('abc', 100)).toContain('valid number');
    expect(validateAmountAgainstTreasury('0', 100)).toContain('at least');
  });

  it('returns null when amount is valid and within treasury balance', () => {
    expect(validateAmountAgainstTreasury('50', 100)).toBeNull();
    expect(validateAmountAgainstTreasury('100', 100)).toBeNull();
  });

  it('returns error when amount exceeds treasury balance', () => {
    const error = validateAmountAgainstTreasury('150', 100);
    expect(error).toContain('exceeds treasury balance');
    expect(error).toContain('100.00 STX available');
  });

  it('handles null treasury balance gracefully', () => {
    expect(validateAmountAgainstTreasury('50', null)).toBeNull();
  });

  it('validates against treasury balance with decimals', () => {
    expect(validateAmountAgainstTreasury('50.5', 50.25)).toContain('exceeds treasury balance');
    expect(validateAmountAgainstTreasury('50.25', 50.25)).toBeNull();
  });
});
