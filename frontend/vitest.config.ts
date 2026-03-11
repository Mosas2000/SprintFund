import { defineConfig } from 'vitest/config';

/**
 * Vitest configuration for frontend unit tests.
 *
 * This is separate from the root vitest.config.js which uses the
 * Clarinet environment for smart-contract tests. Frontend tests
 * run in a plain Node.js environment with no Clarinet SDK setup.
 *
 * Usage:
 *   npx vitest run --config frontend/vitest.config.ts
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['frontend/src/**/*.test.ts'],
    exclude: ['node_modules/**', 'tests/**'],
    setupFiles: [],
  },
});
