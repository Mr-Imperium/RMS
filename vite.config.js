import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Cache these file types
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      },
      
      manifest: {
        name: 'Recruitment Management System',
        short_name: 'RMS',
        description: 'An advanced system for managing recruitment operations.',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    }),
    visualizer({ // Add the visualizer plugin
      template: 'treemap', // or 'sunburst'
      open: true, // Automatically open the report in your browser after build
      gzipSize: true,
      brotliSize: true,
      filename: 'bundle-analysis.html', // Output file name
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Manual code splitting for large libraries
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor_mui';
            } else if (id.includes('recharts')) {
              return 'vendor_recharts';
            }
            return 'vendor'; // all other vendors
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});