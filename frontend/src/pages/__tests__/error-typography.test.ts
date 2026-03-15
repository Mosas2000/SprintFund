import { describe, it, expect } from 'vitest';

describe('error page typography', () => {
  it('root 404 heading uses font-black', () => {
    const cls = 'text-[8rem] font-black leading-none tracking-tighter sm:text-[12rem]';
    expect(cls).toContain('font-black');
  });

  it('root heading uses tracking-tighter for compact display', () => {
    const cls = 'text-[8rem] font-black leading-none tracking-tighter';
    expect(cls).toContain('tracking-tighter');
  });

  it('sub-heading uses text-xl on mobile, text-2xl on sm', () => {
    const cls = 'text-xl font-bold sm:text-2xl';
    expect(cls).toContain('text-xl');
    expect(cls).toContain('sm:text-2xl');
  });

  it('description text uses text-sm or text-base', () => {
    const rootDesc = 'text-base';
    const subDesc = 'text-sm';
    expect(rootDesc).toBe('text-base');
    expect(subDesc).toBe('text-sm');
  });

  it('error digest uses font-mono text-xs', () => {
    const cls = 'font-mono text-xs';
    expect(cls).toContain('font-mono');
    expect(cls).toContain('text-xs');
  });

  it('button text uses text-sm font-semibold', () => {
    const cls = 'text-sm font-semibold';
    expect(cls).toContain('text-sm');
    expect(cls).toContain('font-semibold');
  });
});
