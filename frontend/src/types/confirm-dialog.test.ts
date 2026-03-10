import { describe, it, expect } from 'vitest';
import type {
  DialogVariant,
  DetailItem,
  ConfirmDialogAction,
  ConfirmDialogProps,
} from './confirm-dialog';

/**
 * Type-level tests: these verify that the interfaces compile
 * with the expected shapes. Runtime assertions confirm structural
 * expectations beyond what TypeScript's type system alone checks.
 */

describe('DialogVariant type', () => {
  it('accepts all three valid string values', () => {
    const variants: DialogVariant[] = ['warning', 'danger', 'info'];
    expect(variants).toHaveLength(3);
    expect(variants).toContain('warning');
    expect(variants).toContain('danger');
    expect(variants).toContain('info');
  });
});

describe('DetailItem interface', () => {
  it('requires label and value strings', () => {
    const item: DetailItem = { label: 'Amount', value: '50 STX' };
    expect(item.label).toBe('Amount');
    expect(item.value).toBe('50 STX');
  });
});

describe('ConfirmDialogAction interface', () => {
  it('requires title, description, variant, confirmLabel, and onConfirm', () => {
    const onConfirm = () => {};
    const action: ConfirmDialogAction = {
      title: 'Stake 50 STX',
      description: 'This will lock your tokens.',
      variant: 'warning',
      confirmLabel: 'Confirm Stake',
      onConfirm,
    };
    expect(action.title).toBe('Stake 50 STX');
    expect(action.description).toBe('This will lock your tokens.');
    expect(action.variant).toBe('warning');
    expect(action.confirmLabel).toBe('Confirm Stake');
    expect(action.onConfirm).toBe(onConfirm);
  });

  it('allows optional cancelLabel', () => {
    const action: ConfirmDialogAction = {
      title: 'Test',
      description: 'Test desc',
      variant: 'info',
      confirmLabel: 'OK',
      cancelLabel: 'Dismiss',
      onConfirm: () => {},
    };
    expect(action.cancelLabel).toBe('Dismiss');
  });

  it('allows optional details array', () => {
    const action: ConfirmDialogAction = {
      title: 'Test',
      description: 'Test desc',
      variant: 'danger',
      confirmLabel: 'Delete',
      details: [
        { label: 'Item', value: 'Value' },
        { label: 'Other', value: '123' },
      ],
      onConfirm: () => {},
    };
    expect(action.details).toHaveLength(2);
    expect(action.details![0].label).toBe('Item');
  });
});

describe('ConfirmDialogProps interface', () => {
  it('requires open, action, and onClose', () => {
    const onClose = () => {};
    const props: ConfirmDialogProps = {
      open: true,
      action: {
        title: 'Test',
        description: 'desc',
        variant: 'info',
        confirmLabel: 'OK',
        onConfirm: () => {},
      },
      onClose,
    };
    expect(props.open).toBe(true);
    expect(props.action).not.toBeNull();
    expect(props.onClose).toBe(onClose);
  });

  it('allows action to be null when dialog is closed', () => {
    const props: ConfirmDialogProps = {
      open: false,
      action: null,
      onClose: () => {},
    };
    expect(props.open).toBe(false);
    expect(props.action).toBeNull();
  });
});
