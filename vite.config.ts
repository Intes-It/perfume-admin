import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://171.244.64.245:8010',
        changeOrigin: true,
        secure: true,
        ws: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url,
            );
          });
        },
      },
      '/media': {
        target: 'http://171.244.64.245:8010',
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });

          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            const contentType = proxyRes.headers['content-type'];
            if (contentType && contentType.includes('text/plain')) {
              if (
                req.url.endsWith('.jpg') ||
                req.url.endsWith('.png') ||
                req.url.endsWith('.jpeg')
              ) {
                proxyRes.headers['content-type'] = 'image/jpeg';
              }
            }
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url,
            );
          });
        },
      },
    },

    port: 3003,
  },
});
