import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// wudong-web C 端游客站：dev 端口 5173；真实后端走 8001（/app 代理，Task 2 http 层接入）
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/app': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
});
