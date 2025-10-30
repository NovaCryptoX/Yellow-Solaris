import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Vite configuration for Yellow Solaris
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Netlify expects this directory
  },
  server: {
    port: 5173, // default Vite dev server port
  },
});
