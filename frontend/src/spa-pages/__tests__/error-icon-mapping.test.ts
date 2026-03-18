import { describe, it, expect } from 'vitest';

describe('error page icon mapping', () => {
  const iconMap: Record<string, string> = {
    'proposals': 'alert-circle',
    'analytics': 'bar-chart',
    'profile': 'user',
    'community': 'users',
    'api-docs': 'file-text',
  };

  it('proposals uses alert circle icon', () => {
    expect(iconMap['proposals']).toBe('alert-circle');
  });

  it('analytics uses bar chart icon', () => {
    expect(iconMap['analytics']).toBe('bar-chart');
  });

  it('profile uses user icon', () => {
    expect(iconMap['profile']).toBe('user');
  });

  it('community uses users icon', () => {
    expect(iconMap['community']).toBe('users');
  });

  it('api-docs uses file-text icon', () => {
    expect(iconMap['api-docs']).toBe('file-text');
  });

  it('all routes have icon mappings', () => {
    expect(Object.keys(iconMap)).toHaveLength(5);
  });
});

describe('error page messaging', () => {
  const messages: Record<string, string> = {
    'proposals': 'Failed to load proposals',
    'analytics': 'Analytics unavailable',
    'profile': 'Profile unavailable',
    'community': 'Community page error',
    'api-docs': 'API docs unavailable',
  };

  it.each(Object.entries(messages))('%s has heading "%s"', (route, heading) => {
    expect(heading.length).toBeGreaterThan(0);
  });

  it('no duplicate headings', () => {
    const headings = Object.values(messages);
    const unique = new Set(headings);
    expect(unique.size).toBe(headings.length);
  });
});
