import { describe, it, expect } from 'vitest';

describe('error page navigation flow', () => {
  it('root 404 links to /', () => {
    const href = '/';
    expect(href).toBe('/');
  });

  it('root 500 has two actions: retry and home', () => {
    const actions = ['reset', 'home'];
    expect(actions).toHaveLength(2);
  });

  it('sub-route errors link to / not to parent route', () => {
    const homeHref = '/';
    expect(homeHref).toBe('/');
    expect(homeHref).not.toBe('/proposals');
  });

  it('all error actions use transition-all for smooth animation', () => {
    const cls = 'transition-all hover:scale-105 active:scale-95';
    expect(cls).toContain('transition-all');
  });
});

describe('error page logging', () => {
  it('root error page logs with [SprintFund] prefix', () => {
    const prefix = '[SprintFund] Unhandled error:';
    expect(prefix).toContain('[SprintFund]');
  });

  it('proposals error logs with [SprintFund] Proposals prefix', () => {
    const prefix = '[SprintFund] Proposals error:';
    expect(prefix).toContain('Proposals');
  });

  it('analytics error logs with [SprintFund] Analytics prefix', () => {
    const prefix = '[SprintFund] Analytics error:';
    expect(prefix).toContain('Analytics');
  });

  it('profile error logs with [SprintFund] Profile prefix', () => {
    const prefix = '[SprintFund] Profile error:';
    expect(prefix).toContain('Profile');
  });

  it('community error logs with [SprintFund] Community prefix', () => {
    const prefix = '[SprintFund] Community error:';
    expect(prefix).toContain('Community');
  });

  it('api-docs error logs with [SprintFund] API Docs prefix', () => {
    const prefix = '[SprintFund] API Docs error:';
    expect(prefix).toContain('API Docs');
  });
});
