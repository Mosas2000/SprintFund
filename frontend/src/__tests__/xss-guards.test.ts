import { describe, it, expect } from 'vitest';
import { execFileSync, execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../../..');
const FRONTEND_SRC = resolve(ROOT, 'frontend/src');

/**
 * Helper to run grep on the frontend source tree.
 * Returns matched lines or empty string if no matches.
 */
function grepFrontendSrc(pattern: string): string {
  try {
    return execFileSync(
      'grep',
      [
        '-rn',
        pattern,
        FRONTEND_SRC,
        '--include=*.tsx',
        '--include=*.ts',
        '--exclude=*.test.ts',
        '--exclude=*.test.tsx',
      ],
      { encoding: 'utf-8' },
    );
  } catch {
    // grep returns exit code 1 when no matches found
    return '';
  }
}

/* ── Production code guards ───────────────────── */

describe('XSS security guards', () => {
  it('does not use dangerouslySetInnerHTML in production code', () => {
    const matches = grepFrontendSrc('dangerouslySetInnerHTML');
    expect(matches).toBe('');
  });

  it('does not use innerHTML assignments in production code', () => {
    const matches = grepFrontendSrc('\\.innerHTML\\s*=');
    expect(matches).toBe('');
  });

  it('does not use document.write in production code', () => {
    const matches = grepFrontendSrc('document\\.write');
    expect(matches).toBe('');
  });

  it('does not use eval() in production code', () => {
    const matches = grepFrontendSrc('\\beval\\s*(');
    expect(matches).toBe('');
  });

  it('does not use new Function() in production code', () => {
    const matches = grepFrontendSrc('new Function\\s*(');
    expect(matches).toBe('');
  });

  it('does not use javascript: protocol in href attributes', () => {
    const matches = grepFrontendSrc('href="javascript:');
    expect(matches).toBe('');
  });
});

/* ── CSP and security headers ─────────────────── */

describe('security headers configuration', () => {
  const vercelPath = resolve(ROOT, 'frontend/vercel.json');

  it('vercel.json exists', () => {
    expect(existsSync(vercelPath)).toBe(true);
  });

  it('contains Content-Security-Policy header', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain('Content-Security-Policy');
  });

  it('CSP includes script-src self directive', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain("script-src 'self'");
  });

  it('CSP includes frame-ancestors none directive', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain("frame-ancestors 'none'");
  });

  it('contains X-Content-Type-Options header', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain('X-Content-Type-Options');
    expect(content).toContain('nosniff');
  });

  it('contains X-Frame-Options header', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain('X-Frame-Options');
    expect(content).toContain('DENY');
  });

  it('contains Referrer-Policy header', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain('Referrer-Policy');
  });

  it('contains Permissions-Policy header', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain('Permissions-Policy');
  });

  it('CSP whitelists Hiro API in connect-src', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain('https://api.hiro.so');
  });

  it('CSP restricts default-src to self', () => {
    const content = readFileSync(vercelPath, 'utf-8');
    expect(content).toContain("default-src 'self'");
  });
});

/* ── External link safety ─────────────────────── */

describe('external link safety', () => {
  it('all target=_blank links have rel=noopener noreferrer', () => {
    const targetBlankCount = execSync(
      `grep -rn 'target="_blank"' "${FRONTEND_SRC}" --include="*.tsx" | wc -l`,
      { encoding: 'utf-8' },
    ).trim();

    const noopenerCount = execSync(
      `grep -rn 'rel="noopener noreferrer"' "${FRONTEND_SRC}" --include="*.tsx" | wc -l`,
      { encoding: 'utf-8' },
    ).trim();

    expect(parseInt(targetBlankCount, 10)).toBeGreaterThan(0);
    expect(targetBlankCount).toBe(noopenerCount);
  });
});

/* ── Sanitization imports in key files ────────── */

describe('sanitization is applied in key files', () => {
  it('api.ts imports encodePathSegment', () => {
    const content = readFileSync(resolve(FRONTEND_SRC, 'lib/api.ts'), 'utf-8');
    expect(content).toContain('encodePathSegment');
  });

  it('stacks.ts imports sanitize functions', () => {
    const content = readFileSync(resolve(FRONTEND_SRC, 'lib/stacks.ts'), 'utf-8');
    expect(content).toContain('sanitizeText');
    expect(content).toContain('sanitizeMultilineText');
  });

  it('validation.ts imports stripHtmlTags', () => {
    const content = readFileSync(resolve(FRONTEND_SRC, 'lib/validation.ts'), 'utf-8');
    expect(content).toContain('stripHtmlTags');
  });

  it('ProposalCard.tsx imports sanitizeText', () => {
    const content = readFileSync(resolve(FRONTEND_SRC, 'components/ProposalCard.tsx'), 'utf-8');
    expect(content).toContain('sanitizeText');
  });

  it('Toast.tsx imports sanitizeText and isValidTxId', () => {
    const content = readFileSync(resolve(FRONTEND_SRC, 'components/Toast.tsx'), 'utf-8');
    expect(content).toContain('sanitizeText');
    expect(content).toContain('isValidTxId');
  });

  it('ConfirmDialog.tsx imports sanitizeText', () => {
    const content = readFileSync(resolve(FRONTEND_SRC, 'components/ConfirmDialog.tsx'), 'utf-8');
    expect(content).toContain('sanitizeText');
  });
});
