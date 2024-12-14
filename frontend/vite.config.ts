import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.ts',
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, './src/main.tsx'],
    },
  },
});
