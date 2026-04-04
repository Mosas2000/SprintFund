import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const configDir = dirname(fileURLToPath(import.meta.url));

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
  // Ensure the frontend unit tests always run with the frontend package as the
  // Vite/Vitest root, even when invoked from the monorepo root.
  root: configDir,
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**'],
    setupFiles: [resolve(configDir, 'src/test/vitest.setup.ts')],
    globals: true,
  },
});
