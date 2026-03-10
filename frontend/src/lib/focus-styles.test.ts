import { describe, it, expect } from 'vitest';
import { FOCUS_RING_GREEN, FOCUS_RING_RED, FOCUS_RING_MUTED, FOCUS_RING_INSET } from './focus-styles';

describe('FOCUS_RING_GREEN', () => {
  it('includes focus-visible:outline-none', () => {
    expect(FOCUS_RING_GREEN).toContain('focus-visible:outline-none');
  });

  it('includes focus-visible:ring-2', () => {
    expect(FOCUS_RING_GREEN).toContain('focus-visible:ring-2');
  });

  it('uses green ring color', () => {
    expect(FOCUS_RING_GREEN).toContain('focus-visible:ring-green');
  });

  it('includes dark offset background', () => {
    expect(FOCUS_RING_GREEN).toContain('focus-visible:ring-offset-dark');
  });
});

describe('FOCUS_RING_RED', () => {
  it('includes focus-visible:outline-none', () => {
    expect(FOCUS_RING_RED).toContain('focus-visible:outline-none');
  });

  it('uses red ring color', () => {
    expect(FOCUS_RING_RED).toContain('focus-visible:ring-red');
  });
});

describe('FOCUS_RING_MUTED', () => {
  it('includes focus-visible:outline-none', () => {
    expect(FOCUS_RING_MUTED).toContain('focus-visible:outline-none');
  });

  it('uses white/30 ring color', () => {
    expect(FOCUS_RING_MUTED).toContain('focus-visible:ring-white/30');
  });
});

describe('FOCUS_RING_INSET', () => {
  it('includes focus-visible:outline-none', () => {
    expect(FOCUS_RING_INSET).toContain('focus-visible:outline-none');
  });

  it('uses inset ring', () => {
    expect(FOCUS_RING_INSET).toContain('focus-visible:ring-inset');
  });

  it('uses green/50 ring color', () => {
    expect(FOCUS_RING_INSET).toContain('focus-visible:ring-green/50');
  });
});

describe('all focus ring constants', () => {
  it('are non-empty strings', () => {
    expect(FOCUS_RING_GREEN.length).toBeGreaterThan(0);
    expect(FOCUS_RING_RED.length).toBeGreaterThan(0);
    expect(FOCUS_RING_MUTED.length).toBeGreaterThan(0);
    expect(FOCUS_RING_INSET.length).toBeGreaterThan(0);
  });

  it('do not include mouse-only focus pseudo-class', () => {
    expect(FOCUS_RING_GREEN).not.toContain('focus:ring');
    expect(FOCUS_RING_RED).not.toContain('focus:ring');
    expect(FOCUS_RING_MUTED).not.toContain('focus:ring');
    expect(FOCUS_RING_INSET).not.toContain('focus:ring');
  });
});
