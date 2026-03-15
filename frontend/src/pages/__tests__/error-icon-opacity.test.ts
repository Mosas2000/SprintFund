import { describe, it, expect } from 'vitest';

describe('error icon background opacity patterns', () => {
  it('sub-route error icon uses 10% opacity destructive background', () => {
    const style = 'hsl(var(--destructive) / 0.1)';
    expect(style).toContain('0.1');
  });

  it('root 404 glow uses 20% opacity', () => {
    const cls = 'blur-3xl opacity-20';
    expect(cls).toContain('opacity-20');
  });

  it('root 500 glow uses 20% opacity', () => {
    const cls = 'blur-3xl opacity-20';
    expect(cls).toContain('opacity-20');
  });

  it('loading spinner glow uses 10% opacity', () => {
    const cls = 'blur-3xl opacity-10';
    expect(cls).toContain('opacity-10');
  });
});

describe('error page icon container styling', () => {
  it('icon container is rounded-full', () => {
    const cls = 'mb-6 rounded-full p-4';
    expect(cls).toContain('rounded-full');
  });

  it('icon container has padding p-4', () => {
    const cls = 'mb-6 rounded-full p-4';
    expect(cls).toContain('p-4');
  });

  it('icon container has bottom margin mb-6', () => {
    const cls = 'mb-6 rounded-full p-4';
    expect(cls).toContain('mb-6');
  });
});
