import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
}) 