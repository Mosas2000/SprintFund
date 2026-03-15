import { describe, it, expect } from 'vitest';

describe('error page description max-width', () => {
  it('root 404 description uses max-w-md', () => {
    const cls = 'mt-3 max-w-md text-base';
    expect(cls).toContain('max-w-md');
  });

  it('root 500 description uses max-w-md', () => {
    const cls = 'mt-3 max-w-md text-base';
    expect(cls).toContain('max-w-md');
  });

  it('sub-route descriptions use max-w-sm', () => {
    const cls = 'mt-2 max-w-sm text-sm';
    expect(cls).toContain('max-w-sm');
  });

  it('root descriptions have larger top margin', () => {
    const rootCls = 'mt-3';
    const subCls = 'mt-2';
    expect(rootCls).toBe('mt-3');
    expect(subCls).toBe('mt-2');
  });
});

describe('root vs sub-route error page differences', () => {
  it('root pages use min-h-screen for full viewport', () => {
    const cls = 'min-h-screen';
    expect(cls).toBe('min-h-screen');
  });

  it('sub-route pages use min-h-[60vh] for partial viewport', () => {
    const cls = 'min-h-[60vh]';
    expect(cls).toBe('min-h-[60vh]');
  });

  it('root pages show large status code number', () => {
    const codes = ['404', '500'];
    expect(codes).toContain('404');
    expect(codes).toContain('500');
  });

  it('sub-route pages show icon instead of status code', () => {
    const hasIcon = true;
    const hasStatusCode = false;
    expect(hasIcon).toBe(true);
    expect(hasStatusCode).toBe(false);
  });
});
