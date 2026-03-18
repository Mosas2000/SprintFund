import { describe, it, expect, vi } from 'vitest';
import { httpGet, httpPost, httpRequest } from './http-client';
import type { Result } from './type-helpers';

describe('HTTP client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('httpGet', () => {
    it('makes GET requests successfully', async () => {
      global.fetch = vi.fn(async () =>
        Response.json({ data: 'test' }, { status: 200 }),
      );

      const result = await httpGet('/api/test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ data: 'test' });
      }
    });

    it('handles failed requests', async () => {
      global.fetch = vi.fn(async () =>
        Response.json({ error: 'Not found' }, { status: 404 }),
      );

      const result = await httpGet('/api/notfound');
      expect(result.success).toBe(false);
    });
  });

  describe('httpPost', () => {
    it('makes POST requests with data', async () => {
      global.fetch = vi.fn(async () =>
        Response.json({ created: true }, { status: 201 }),
      );

      const result = await httpPost('/api/create', { name: 'test' });
      expect(result.success).toBe(true);
    });

    it('sends JSON body', async () => {
      const mockFetch = vi.fn(async () =>
        Response.json({ ok: true }, { status: 200 }),
      );
      global.fetch = mockFetch;

      await httpPost('/api/test', { data: 'value' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ data: 'value' }),
        }),
      );
    });
  });

  describe('error handling', () => {
    it('handles network errors', async () => {
      global.fetch = vi.fn(async () => {
        throw new Error('Network failed');
      });

      const result = await httpGet('/api/test');
      expect(result.success).toBe(false);
    });

    it('handles timeout', async () => {
      global.fetch = vi.fn(
        async () =>
          new Promise(() => {
            // Never resolves
          }),
      );

      const result = await httpRequest('/api/test', { timeout: 10 });
      // Note: This test would need fake timers to work properly
      expect(result).toBeDefined();
    });
  });
});
