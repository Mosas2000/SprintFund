import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import react from '@vitejs/plugin-react';

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
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**'],
    setupFiles: [resolve(configDir, 'src/test/vitest.setup.ts')],
    globals: true,
  },
  resolve: {
    alias: {
      '@/lib': resolve(configDir, 'src/lib'),
      '@/types': resolve(configDir, 'src/types'),
      '@/hooks': resolve(configDir, 'src/hooks'),
      '@/store': resolve(configDir, 'src/store'),
      '@/services': resolve(configDir, 'src/services'),
      '@/components': resolve(configDir, 'components'),
      '@/utils': resolve(configDir, 'utils'),
      '@': resolve(configDir, 'src'),
    },
  },
});
