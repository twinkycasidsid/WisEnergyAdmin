import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Required for React/DOM testing
    globals: true, // Makes `describe`, `it`, `expect` global (no imports needed)
    setupFiles: ['./src/setupTests.js'], // Optional: Global setup (see below)
    css: true, // Handles Tailwind/CSS in tests
  },
  resolve: {
    alias: {
      // If paths are tricky, alias your src
      '@': '/src',
    },
  },
});