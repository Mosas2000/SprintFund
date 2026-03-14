import { describe, it, expect, vi } from 'vitest';
import {
  validateTitle,
  validateDescription,
  validateAmount,
  validateDuration,
  validateProposalForm,
  isFormValid,
  PROPOSAL_RULES,
} from '../../lib/validation';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

describe('CreateProposal form validation rules', () => {
  it('title is required with min 5 and max 100 characters', () => {
    expect(PROPOSAL_RULES.title.required).toBe(true);
    expect(PROPOSAL_RULES.title.minLength).toBe(5);
    expect(PROPOSAL_RULES.title.maxLength).toBe(100);
  });

  it('description is required with min 20 and max 500 characters', () => {
    expect(PROPOSAL_RULES.description.required).toBe(true);
    expect(PROPOSAL_RULES.description.minLength).toBe(20);
    expect(PROPOSAL_RULES.description.maxLength).toBe(500);
  });

  it('amount is required with min 1 and max 10000', () => {
    expect(PROPOSAL_RULES.amount.required).toBe(true);
    expect(PROPOSAL_RULES.amount.min).toBe(1);
    expect(PROPOSAL_RULES.amount.max).toBe(10000);
  });

  it('duration is required with min 1 and max 30', () => {
    expect(PROPOSAL_RULES.duration.required).toBe(true);
    expect(PROPOSAL_RULES.duration.min).toBe(1);
    expect(PROPOSAL_RULES.duration.max).toBe(30);
  });
});

describe('CreateProposal title validation', () => {
  it('returns error for empty title', () => {
    expect(validateTitle('')).toBe('Title is required');
  });

  it('returns error for whitespace-only title', () => {
    expect(validateTitle('   ')).toBe('Title is required');
  });

  it('returns error for title shorter than minimum', () => {
    expect(validateTitle('Hi')).toContain('at least');
  });

  it('returns null for valid title', () => {
    expect(validateTitle('Valid Proposal Title')).toBeNull();
  });

  it('returns error for title exceeding maximum length', () => {
    const longTitle = 'A'.repeat(101);
    expect(validateTitle(longTitle)).toContain('at most');
  });

  it('accepts title at exactly minimum length', () => {
    expect(validateTitle('Hello')).toBeNull();
  });

  it('accepts title at exactly maximum length', () => {
    const maxTitle = 'A'.repeat(100);
    expect(validateTitle(maxTitle)).toBeNull();
  });

  it('rejects title containing HTML tags', () => {
    expect(validateTitle('<script>alert(1)</script>')).toContain('HTML');
  });

  it('rejects title with img tag', () => {
    expect(validateTitle('Title <img src=x>')).toContain('HTML');
  });
});

describe('CreateProposal description validation', () => {
  it('returns error for empty description', () => {
    expect(validateDescription('')).toBe('Description is required');
  });

  it('returns error for description shorter than minimum', () => {
    expect(validateDescription('Too short')).toContain('at least');
  });

  it('returns null for valid description', () => {
    expect(validateDescription('This is a valid description with enough characters to pass validation')).toBeNull();
  });

  it('returns error for description exceeding maximum length', () => {
    const longDesc = 'A'.repeat(501);
    expect(validateDescription(longDesc)).toContain('at most');
  });

  it('accepts description at exactly minimum length', () => {
    const minDesc = 'A'.repeat(20);
    expect(validateDescription(minDesc)).toBeNull();
  });

  it('rejects description containing HTML', () => {
    const htmlDesc = '<div>This is a malicious description with HTML tags</div>';
    expect(validateDescription(htmlDesc)).toContain('HTML');
  });
});

describe('CreateProposal amount validation', () => {
  it('returns error for empty amount', () => {
    expect(validateAmount('')).toBe('Amount is required');
  });

  it('returns error for non-numeric amount', () => {
    expect(validateAmount('abc')).toContain('valid number');
  });

  it('returns error for amount below minimum', () => {
    expect(validateAmount('0')).toContain('at least');
  });

  it('returns null for valid amount', () => {
    expect(validateAmount('50')).toBeNull();
  });

  it('returns error for amount exceeding maximum', () => {
    expect(validateAmount('10001')).toContain('at most');
  });

  it('accepts decimal amounts', () => {
    expect(validateAmount('50.5')).toBeNull();
  });

  it('accepts amount at minimum', () => {
    expect(validateAmount('1')).toBeNull();
  });

  it('accepts amount at maximum', () => {
    expect(validateAmount('10000')).toBeNull();
  });

  it('rejects negative amounts', () => {
    expect(validateAmount('-5')).toContain('at least');
  });
});

describe('CreateProposal duration validation', () => {
  it('returns error for empty duration', () => {
    expect(validateDuration('')).toBe('Duration is required');
  });

  it('returns error for non-numeric duration', () => {
    expect(validateDuration('abc')).toContain('whole number');
  });

  it('returns error for duration below minimum', () => {
    expect(validateDuration('0')).toContain('at least');
  });

  it('returns null for valid duration', () => {
    expect(validateDuration('14')).toBeNull();
  });

  it('returns error for duration exceeding maximum', () => {
    expect(validateDuration('31')).toContain('at most');
  });

  it('accepts duration at minimum', () => {
    expect(validateDuration('1')).toBeNull();
  });

  it('accepts duration at maximum', () => {
    expect(validateDuration('30')).toBeNull();
  });

  it('rejects negative duration', () => {
    expect(validateDuration('-1')).toContain('at least');
  });
});

describe('CreateProposal form-level validation', () => {
  it('returns empty errors object for fully valid form', () => {
    const errors = validateProposalForm({
      title: 'Valid Title Here',
      description: 'This is a valid description that is long enough to pass the minimum requirement',
      amount: '50',
      duration: '14',
    });

    expect(errors).toEqual({});
    expect(isFormValid(errors)).toBe(true);
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
    expect(isFormValid(errors)).toBe(false);
  });

  it('returns error only for invalid fields', () => {
    const errors = validateProposalForm({
      title: 'Valid Title Here',
      description: 'This is a valid description that is long enough to pass the minimum requirement',
      amount: '',
      duration: '14',
    });

    expect(errors.title).toBeUndefined();
    expect(errors.description).toBeUndefined();
    expect(errors.amount).toBeDefined();
    expect(errors.duration).toBeUndefined();
    expect(isFormValid(errors)).toBe(false);
  });

  it('validates each field independently', () => {
    const errors = validateProposalForm({
      title: 'Hi',
      description: 'Short',
      amount: '0',
      duration: '50',
    });

    expect(Object.keys(errors)).toHaveLength(4);
  });
});

describe('isFormValid', () => {
  it('returns true for empty errors object', () => {
    expect(isFormValid({})).toBe(true);
  });

  it('returns false when any error is present', () => {
    expect(isFormValid({ title: 'Title is required' })).toBe(false);
  });

  it('returns false when multiple errors are present', () => {
    expect(isFormValid({ title: 'error', amount: 'error' })).toBe(false);
  });
});

describe('CreateProposal submit conditions', () => {
  it('canSubmit is true when no txStatus and form is valid', () => {
    const txStatus = null;
    const errors = validateProposalForm({
      title: 'Valid Title',
      description: 'Valid description that meets the minimum character requirement for the proposal form',
      amount: '50',
      duration: '14',
    });
    const canSubmit = !txStatus && isFormValid(errors);
    expect(canSubmit).toBe(true);
  });

  it('canSubmit is false when txStatus is pending', () => {
    const txStatus = 'Opening wallet...';
    const errors = validateProposalForm({
      title: 'Valid Title',
      description: 'Valid description that meets the minimum character requirement for the proposal form',
      amount: '50',
      duration: '14',
    });
    const canSubmit = !txStatus && isFormValid(errors);
    expect(canSubmit).toBe(false);
  });

  it('canSubmit is false when form has validation errors', () => {
    const txStatus = null;
    const errors = validateProposalForm({
      title: '',
      description: '',
      amount: '',
      duration: '',
    });
    const canSubmit = !txStatus && isFormValid(errors);
    expect(canSubmit).toBe(false);
  });
});
