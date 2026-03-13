import { describe, it, expect } from 'vitest';
import * as VoteProgressBarModule from './VoteProgressBar';

/**
 * Tests for the VoteProgressBar memoized component.
 *
 * Without @testing-library/react we verify the module's public API
 * and React.memo wrapping at the export level.
 */

describe('VoteProgressBar module', () => {
  it('exports a component named VoteProgressBar', () => {
    expect(typeof VoteProgressBarModule.VoteProgressBar).toBe('object');
  });

  it('is wrapped in React.memo (has $$typeof or compare property)', () => {
    const component = VoteProgressBarModule.VoteProgressBar as unknown as {
      $$typeof: symbol;
      type?: { name: string };
      compare: unknown;
    };

    // React.memo components are objects with $$typeof = Symbol(react.memo)
    expect(component.$$typeof).toBeDefined();
    expect(component.$$typeof.toString()).toContain('memo');
  });

  it('inner component is named VoteProgressBar', () => {
    const component = VoteProgressBarModule.VoteProgressBar as unknown as {
      type: { name: string };
    };
    expect(component.type.name).toMatch(/^VoteProgressBar/);
  });
});

describe('VoteProgressBar props contract', () => {
  it('module exports exactly one named export', () => {
    const names = Object.keys(VoteProgressBarModule);
    expect(names).toEqual(['VoteProgressBar']);
  });
});
