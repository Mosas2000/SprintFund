import { describe, it, expect, vi } from 'vitest';

vi.mock('@stacks/connect', () => ({
  request: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  getLocalStorage: vi.fn(() => null),
}));

import { sanitizeText, sanitizeMultilineText, stripHtmlTags } from '../../lib/sanitize';

describe('stripHtmlTags', () => {
  it('removes basic HTML tags', () => {
    expect(stripHtmlTags('<b>bold</b>')).toBe('bold');
  });

  it('removes script tags', () => {
    expect(stripHtmlTags('<script>alert(1)</script>')).toBe('alert(1)');
  });

  it('removes nested tags', () => {
    expect(stripHtmlTags('<div><span>text</span></div>')).toBe('text');
  });

  it('returns plain text unchanged', () => {
    expect(stripHtmlTags('no tags here')).toBe('no tags here');
  });

  it('removes self-closing tags', () => {
    expect(stripHtmlTags('text<br/>more')).toBe('textmore');
  });

  it('handles empty string', () => {
    expect(stripHtmlTags('')).toBe('');
  });

  it('removes img tags', () => {
    const result = stripHtmlTags('<img src="x.png" onerror="alert(1)">');
    expect(result).not.toContain('<img');
  });
});

describe('sanitizeText', () => {
  it('returns plain text unchanged', () => {
    expect(sanitizeText('hello world')).toBe('hello world');
  });

  it('strips HTML from text', () => {
    const result = sanitizeText('<b>bold</b> text');
    expect(result).not.toContain('<b>');
  });

  it('handles empty string', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('preserves special characters', () => {
    const input = 'Fund & Ship: 50% more!';
    const result = sanitizeText(input);
    expect(result).toContain('Fund');
    expect(result).toContain('Ship');
  });
});

describe('sanitizeMultilineText', () => {
  it('returns plain multiline text', () => {
    const input = 'line 1\nline 2\nline 3';
    const result = sanitizeMultilineText(input);
    expect(result).toContain('line 1');
    expect(result).toContain('line 2');
  });

  it('strips HTML from multiline text', () => {
    const input = '<p>paragraph 1</p>\n<p>paragraph 2</p>';
    const result = sanitizeMultilineText(input);
    expect(result).not.toContain('<p>');
  });

  it('handles empty string', () => {
    expect(sanitizeMultilineText('')).toBe('');
  });
});
