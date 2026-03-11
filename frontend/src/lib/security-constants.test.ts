import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  ALLOWED_API_ORIGINS,
  EXPLORER_BASE_URL,
  CONTENT_LIMITS,
  SAFE_PROTOCOLS,
  BLOCKED_PROTOCOLS,
} from './security-constants';

const ROOT = resolve(__dirname, '../../..');

describe('security-constants', () => {
  describe('ALLOWED_API_ORIGINS', () => {
    it('contains the main Hiro API origin', () => {
      expect(ALLOWED_API_ORIGINS).toContain('https://api.hiro.so');
    });

    it('only contains HTTPS origins', () => {
      for (const origin of ALLOWED_API_ORIGINS) {
        expect(origin).toMatch(/^https:\/\//);
      }
    });

    it('all origins are present in CSP connect-src', () => {
      const vercelJson = readFileSync(resolve(ROOT, 'frontend/vercel.json'), 'utf-8');
      for (const origin of ALLOWED_API_ORIGINS) {
        expect(vercelJson).toContain(origin);
      }
    });
  });

  describe('EXPLORER_BASE_URL', () => {
    it('uses HTTPS protocol', () => {
      expect(EXPLORER_BASE_URL).toMatch(/^https:\/\//);
    });

    it('points to explorer.hiro.so', () => {
      expect(EXPLORER_BASE_URL).toContain('explorer.hiro.so');
    });
  });

  describe('CONTENT_LIMITS', () => {
    it('has positive title max length', () => {
      expect(CONTENT_LIMITS.TITLE_MAX).toBeGreaterThan(0);
    });

    it('has positive description max length', () => {
      expect(CONTENT_LIMITS.DESCRIPTION_MAX).toBeGreaterThan(0);
    });

    it('description max is greater than title max', () => {
      expect(CONTENT_LIMITS.DESCRIPTION_MAX).toBeGreaterThan(CONTENT_LIMITS.TITLE_MAX);
    });
  });

  describe('SAFE_PROTOCOLS', () => {
    it('includes https', () => {
      expect(SAFE_PROTOCOLS).toContain('https:');
    });

    it('includes http', () => {
      expect(SAFE_PROTOCOLS).toContain('http:');
    });

    it('does not include any dangerous protocol', () => {
      for (const proto of SAFE_PROTOCOLS) {
        expect(BLOCKED_PROTOCOLS).not.toContain(proto);
      }
    });
  });

  describe('BLOCKED_PROTOCOLS', () => {
    it('blocks javascript protocol', () => {
      expect(BLOCKED_PROTOCOLS).toContain('javascript:');
    });

    it('blocks data protocol', () => {
      expect(BLOCKED_PROTOCOLS).toContain('data:');
    });

    it('blocks vbscript protocol', () => {
      expect(BLOCKED_PROTOCOLS).toContain('vbscript:');
    });

    it('blocks blob protocol', () => {
      expect(BLOCKED_PROTOCOLS).toContain('blob:');
    });

    it('does not overlap with safe protocols', () => {
      for (const proto of BLOCKED_PROTOCOLS) {
        expect(SAFE_PROTOCOLS).not.toContain(proto);
      }
    });
  });
});
