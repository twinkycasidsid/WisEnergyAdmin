import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@src": "/src",  // Alias for the src directory
      "@services": "/services", // Alias for the services directory
    },
  },
  test: {
       globals: true, // Enables global test functions like describe, it, expect
       environment: 'jsdom', // For DOM testing with RTL
       setupFiles: ['./src/test-setup.js'], // Path to your setup file (create below)
       css: true, // If your component uses CSS
     },
});
