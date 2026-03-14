import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { sanitizeProposal } from '../../lib/sanitize-proposal';

describe('sanitizeProposal', () => {
  it('sanitizes title in proposal object', () => {
    const result = sanitizeProposal({
      title: '<script>alert(1)</script>Valid Title',
      description: 'Valid description text',
    });
    expect(result.title).not.toContain('<script>');
  });

  it('sanitizes description in proposal object', () => {
    const result = sanitizeProposal({
      title: 'Valid Title',
      description: '<img src=x onerror=alert(1)>Valid description',
    });
    expect(result.description).not.toContain('<img');
  });

  it('preserves clean text unchanged', () => {
    const input = {
      title: 'Clean Title',
      description: 'Clean description text',
    };
    const result = sanitizeProposal(input);
    expect(result.title).toBe('Clean Title');
    expect(result.description).toBe('Clean description text');
  });

  it('handles empty strings', () => {
    const result = sanitizeProposal({ title: '', description: '' });
    expect(result.title).toBe('');
    expect(result.description).toBe('');
  });

  it('returns an object with title and description', () => {
    const result = sanitizeProposal({ title: 'T', description: 'D' });
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('description');
  });
});
