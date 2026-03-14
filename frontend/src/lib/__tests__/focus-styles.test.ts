import { describe, it, expect } from 'vitest';
import { FOCUS_RING_GREEN, FOCUS_RING_RED, FOCUS_RING_MUTED, FOCUS_RING_INSET } from '../../lib/focus-styles';

describe('focus style constants', () => {
  it('exports FOCUS_RING_GREEN', () => {
    expect(typeof FOCUS_RING_GREEN).toBe('string');
    expect(FOCUS_RING_GREEN.length).toBeGreaterThan(0);
  });

  it('exports FOCUS_RING_RED', () => {
    expect(typeof FOCUS_RING_RED).toBe('string');
    expect(FOCUS_RING_RED.length).toBeGreaterThan(0);
  });

  it('exports FOCUS_RING_MUTED', () => {
    expect(typeof FOCUS_RING_MUTED).toBe('string');
    expect(FOCUS_RING_MUTED.length).toBeGreaterThan(0);
  });

  it('exports FOCUS_RING_INSET', () => {
    expect(typeof FOCUS_RING_INSET).toBe('string');
    expect(FOCUS_RING_INSET.length).toBeGreaterThan(0);
  });
});

describe('focus ring class structure', () => {
  it('FOCUS_RING_GREEN includes focus-visible:outline-none', () => {
    expect(FOCUS_RING_GREEN).toContain('focus-visible:outline-none');
  });

  it('FOCUS_RING_GREEN includes ring-2', () => {
    expect(FOCUS_RING_GREEN).toContain('ring-2');
  });

  it('FOCUS_RING_GREEN uses green color', () => {
    expect(FOCUS_RING_GREEN).toContain('green');
  });

  it('FOCUS_RING_RED uses red color', () => {
    expect(FOCUS_RING_RED).toContain('red');
  });

  it('FOCUS_RING_MUTED uses white opacity', () => {
    expect(FOCUS_RING_MUTED).toContain('white');
  });

  it('FOCUS_RING_INSET uses ring-inset', () => {
    expect(FOCUS_RING_INSET).toContain('ring-inset');
  });

  it('all constants include focus-visible prefix', () => {
    [FOCUS_RING_GREEN, FOCUS_RING_RED, FOCUS_RING_MUTED, FOCUS_RING_INSET].forEach(cls => {
      expect(cls).toContain('focus-visible:');
    });
  });

  it('offset variants use ring-offset-dark', () => {
    expect(FOCUS_RING_GREEN).toContain('ring-offset-dark');
    expect(FOCUS_RING_RED).toContain('ring-offset-dark');
    expect(FOCUS_RING_MUTED).toContain('ring-offset-dark');
  });

  it('inset variant does not use ring-offset', () => {
    expect(FOCUS_RING_INSET).not.toContain('ring-offset-dark');
  });
});
