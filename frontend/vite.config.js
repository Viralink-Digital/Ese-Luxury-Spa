// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_');

  if (mode === 'production') {
    if (!env.VITE_API_URL) {
      throw new Error('VITE_API_URL must be set for production builds.');
    }

    const apiUrl = new URL(env.VITE_API_URL);
    if (apiUrl.protocol !== 'https:' || ['localhost', '127.0.0.1', '::1'].includes(apiUrl.hostname)) {
      throw new Error('VITE_API_URL must use the public HTTPS backend URL in production.');
    }
  }

  return {
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['framer-motion', 'lucide-react'],
          swiper: ['swiper'],
        },
      },
    },
  },
  };
});
