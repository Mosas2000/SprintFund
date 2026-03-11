import { describe, it, expect } from 'vitest';
import {
  stripHtmlTags,
  stripHtmlEntities,
  stripEventHandlers,
  stripControlChars,
  sanitizeText,
  sanitizeMultilineText,
  truncateText,
} from './sanitize';

/* ── stripHtmlTags ─────────────────────────────── */

describe('stripHtmlTags', () => {
  it('removes simple HTML tags', () => {
    expect(stripHtmlTags('<b>bold</b>')).toBe('bold');
  });

  it('removes self-closing tags', () => {
    expect(stripHtmlTags('before<br/>after')).toBe('beforeafter');
  });

  it('removes script tags and their attributes', () => {
    expect(stripHtmlTags('<script src="evil.js">alert(1)</script>')).toBe('alert(1)');
  });

  it('removes tags with attributes', () => {
    expect(stripHtmlTags('<a href="javascript:alert(1)">click</a>')).toBe('click');
  });

  it('handles nested tags', () => {
    expect(stripHtmlTags('<div><p>text</p></div>')).toBe('text');
  });

  it('returns empty string for empty input', () => {
    expect(stripHtmlTags('')).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(stripHtmlTags('no tags here')).toBe('no tags here');
  });

  it('removes img tags with onerror attributes', () => {
    expect(stripHtmlTags('<img src=x onerror="alert(1)">')).toBe('');
  });
});

/* ── stripHtmlEntities ─────────────────────────── */

describe('stripHtmlEntities', () => {
  it('removes named entities', () => {
    expect(stripHtmlEntities('&lt;script&gt;')).toBe('script');
  });

  it('removes numeric entities', () => {
    expect(stripHtmlEntities('&#60;div&#62;')).toBe('div');
  });

  it('removes hex entities', () => {
    expect(stripHtmlEntities('&#x3C;div&#x3E;')).toBe('div');
  });

  it('returns plain text unchanged', () => {
    expect(stripHtmlEntities('no entities')).toBe('no entities');
  });

  it('handles mixed content', () => {
    expect(stripHtmlEntities('a&amp;b&lt;c')).toBe('abc');
  });
});

/* ── stripEventHandlers ────────────────────────── */

describe('stripEventHandlers', () => {
  it('removes onerror handler', () => {
    expect(stripEventHandlers('onerror=alert(1)')).toBe('alert(1)');
  });

  it('removes onclick handler', () => {
    expect(stripEventHandlers('onclick="doEvil()"')).toBe('"doEvil()"');
  });

  it('removes onload handler', () => {
    expect(stripEventHandlers('onload = init()')).toBe(' init()');
  });

  it('returns clean text unchanged', () => {
    expect(stripEventHandlers('no handlers here')).toBe('no handlers here');
  });

  it('removes multiple handlers', () => {
    const input = 'onerror=a onclick=b onmouseover=c';
    const result = stripEventHandlers(input);
    expect(result).not.toContain('onerror=');
    expect(result).not.toContain('onclick=');
    expect(result).not.toContain('onmouseover=');
  });
});

/* ── stripControlChars ─────────────────────────── */

describe('stripControlChars', () => {
  it('removes null bytes', () => {
    expect(stripControlChars('abc\x00def')).toBe('abcdef');
  });

  it('preserves tabs', () => {
    expect(stripControlChars('a\tb')).toBe('a\tb');
  });

  it('preserves newlines', () => {
    expect(stripControlChars('a\nb')).toBe('a\nb');
  });

  it('preserves carriage returns', () => {
    expect(stripControlChars('a\rb')).toBe('a\rb');
  });

  it('removes bell character', () => {
    expect(stripControlChars('a\x07b')).toBe('ab');
  });

  it('removes backspace character', () => {
    expect(stripControlChars('a\x08b')).toBe('ab');
  });
});

/* ── sanitizeText ──────────────────────────────── */

describe('sanitizeText', () => {
  it('strips HTML tags from text', () => {
    expect(sanitizeText('<b>Fund the project</b>')).toBe('Fund the project');
  });

  it('strips script injection attempts', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  it('strips event handler injection', () => {
    expect(sanitizeText('title" onerror="alert(1)')).toBe('title" "alert(1)');
  });

  it('strips HTML entities used for obfuscation', () => {
    expect(sanitizeText('&lt;script&gt;alert(1)&lt;/script&gt;')).toBe('scriptalert(1)/script');
  });

  it('trims whitespace', () => {
    expect(sanitizeText('  clean text  ')).toBe('clean text');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizeText('   ')).toBe('');
  });

  it('passes through safe text unchanged', () => {
    expect(sanitizeText('Create a new community fund')).toBe('Create a new community fund');
  });

  it('handles combined attack vectors', () => {
    const malicious = '<img src=x onerror="alert(document.cookie)">';
    const result = sanitizeText(malicious);
    expect(result).not.toContain('<img');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('<');
  });

  it('strips control characters', () => {
    expect(sanitizeText('test\x00\x01\x02text')).toBe('testtext');
  });
});

/* ── sanitizeMultilineText ─────────────────────── */

describe('sanitizeMultilineText', () => {
  it('preserves single newlines', () => {
    expect(sanitizeMultilineText('line1\nline2')).toBe('line1\nline2');
  });

  it('preserves double newlines', () => {
    expect(sanitizeMultilineText('para1\n\npara2')).toBe('para1\n\npara2');
  });

  it('collapses three or more blank lines to two', () => {
    expect(sanitizeMultilineText('a\n\n\n\nb')).toBe('a\n\nb');
  });

  it('sanitizes each line individually', () => {
    expect(sanitizeMultilineText('<b>line1</b>\n<i>line2</i>')).toBe('line1\nline2');
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeMultilineText('')).toBe('');
  });

  it('trims each line', () => {
    expect(sanitizeMultilineText('  line1  \n  line2  ')).toBe('line1\nline2');
  });
});

/* ── truncateText ──────────────────────────────── */

describe('truncateText', () => {
  it('returns text unchanged when shorter than max', () => {
    expect(truncateText('short', 10)).toBe('short');
  });

  it('truncates and adds ellipsis when text exceeds max', () => {
    expect(truncateText('a long string', 6)).toBe('a l...');
  });

  it('handles exact length', () => {
    expect(truncateText('exact', 5)).toBe('exact');
  });

  it('handles empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('handles maxLength of 3 (minimum for ellipsis)', () => {
    expect(truncateText('abcdef', 3)).toBe('...');
  });

  it('does not break on word boundary', () => {
    const result = truncateText('hello world', 8);
    expect(result).toBe('hello...');
    expect(result.length).toBe(8);
  });
});
