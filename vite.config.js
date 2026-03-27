// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Serve from project root
  root: '.',
  server: {
    port: 3000,
    open: true, // auto-opens browser
  },
  build: {
    outDir: 'dist',
    // No framework — just static files
  },
});