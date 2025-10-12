import '@testing-library/jest-dom'; // For jest-dom matchers like toBeInTheDocument
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config'; 
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
export default defineConfig({
  test: {
    environment: 'jsdom',
    // other test configurations...
  },
  resolve: viteConfig.resolve, // Add this line to make sure vitest uses the same config
});