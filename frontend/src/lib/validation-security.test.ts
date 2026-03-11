import { describe, it, expect } from 'vitest';
import {
  validateTitle,
  validateDescription,
  validateAmount,
  validateDuration,
  validateProposalForm,
  isFormValid,
  PROPOSAL_RULES,
} from './validation';

/* ── validateTitle ─────────────────────────────── */

describe('validateTitle', () => {
  it('returns null for valid title', () => {
    expect(validateTitle('Fund community grants')).toBeNull();
  });

  it('rejects empty title', () => {
    expect(validateTitle('')).toBe('Title is required');
  });

  it('rejects whitespace-only title', () => {
    expect(validateTitle('   ')).toBe('Title is required');
  });

  it('rejects title shorter than minimum', () => {
    expect(validateTitle('Hi')).toContain('at least');
  });

  it('rejects title longer than maximum', () => {
    const long = 'a'.repeat(PROPOSAL_RULES.title.maxLength + 1);
    expect(validateTitle(long)).toContain('at most');
  });

  it('rejects title containing HTML tags', () => {
    expect(validateTitle('<script>alert(1)</script>Title')).toBe(
      'Title must not contain HTML tags',
    );
  });

  it('rejects title with img tag', () => {
    expect(validateTitle('<img src=x onerror=alert(1)>Click me')).toBe(
      'Title must not contain HTML tags',
    );
  });

  it('accepts title at minimum length', () => {
    const min = 'a'.repeat(PROPOSAL_RULES.title.minLength);
    expect(validateTitle(min)).toBeNull();
  });

  it('accepts title at maximum length', () => {
    const max = 'a'.repeat(PROPOSAL_RULES.title.maxLength);
    expect(validateTitle(max)).toBeNull();
  });
});

/* ── validateDescription ──────────────────────── */

describe('validateDescription', () => {
  it('returns null for valid description', () => {
    expect(validateDescription('This is a valid proposal description with enough characters.')).toBeNull();
  });

  it('rejects empty description', () => {
    expect(validateDescription('')).toBe('Description is required');
  });

  it('rejects description shorter than minimum', () => {
    expect(validateDescription('Too short')).toContain('at least');
  });

  it('rejects description longer than maximum', () => {
    const long = 'a'.repeat(PROPOSAL_RULES.description.maxLength + 1);
    expect(validateDescription(long)).toContain('at most');
  });

  it('rejects description containing HTML tags', () => {
    expect(validateDescription('<b>Bold</b> description with enough chars to pass length check.')).toBe(
      'Description must not contain HTML tags',
    );
  });

  it('rejects description with script injection', () => {
    expect(
      validateDescription('<script>document.cookie</script> some text that is long enough now'),
    ).toBe('Description must not contain HTML tags');
  });
});

/* ── validateAmount ──────────────────────────── */

describe('validateAmount', () => {
  it('returns null for valid amount', () => {
    expect(validateAmount('100')).toBeNull();
  });

  it('rejects empty amount', () => {
    expect(validateAmount('')).toBe('Amount is required');
  });

  it('rejects non-numeric amount', () => {
    expect(validateAmount('abc')).toBe('Amount must be a valid number');
  });

  it('rejects amount below minimum', () => {
    expect(validateAmount('0')).toContain('at least');
  });

  it('rejects amount above maximum', () => {
    expect(validateAmount('99999')).toContain('at most');
  });
});

/* ── validateDuration ────────────────────────── */

describe('validateDuration', () => {
  it('returns null for valid duration', () => {
    expect(validateDuration('7')).toBeNull();
  });

  it('rejects empty duration', () => {
    expect(validateDuration('')).toBe('Duration is required');
  });

  it('rejects non-numeric duration', () => {
    expect(validateDuration('abc')).toBe('Duration must be a whole number');
  });

  it('rejects duration below minimum', () => {
    expect(validateDuration('0')).toContain('at least');
  });

  it('rejects duration above maximum', () => {
    expect(validateDuration('31')).toContain('at most');
  });
});

/* ── validateProposalForm ────────────────────── */

describe('validateProposalForm', () => {
  it('returns empty object for valid form', () => {
    const errors = validateProposalForm({
      title: 'Fund community meetups',
      description: 'This proposal allocates funds for monthly community meetups in the ecosystem.',
      amount: '100',
      duration: '7',
    });
    expect(errors).toEqual({});
  });

  it('returns errors for all invalid fields', () => {
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

  it('flags HTML in title but accepts valid description', () => {
    const errors = validateProposalForm({
      title: '<b>Bad title</b>',
      description: 'A valid long enough description here for the proposal.',
      amount: '50',
      duration: '5',
    });
    expect(errors.title).toBe('Title must not contain HTML tags');
    expect(errors.description).toBeUndefined();
  });
});

/* ── isFormValid ─────────────────────────────── */

describe('isFormValid', () => {
  it('returns true for empty errors object', () => {
    expect(isFormValid({})).toBe(true);
  });

  it('returns false when errors exist', () => {
    expect(isFormValid({ title: 'Required' })).toBe(false);
  });
});
