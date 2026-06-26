import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['gsap', 'gsap/ScrollTrigger', 'gsap/TextPlugin', 'three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['gsap', 'gsap/ScrollTrigger', 'gsap/TextPlugin', 'framer-motion'],
          'three-vendor': ['three'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false,
  },
});
