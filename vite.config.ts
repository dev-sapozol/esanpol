import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import graphql from '@rollup/plugin-graphql';

export default defineConfig({
  plugins: [react(), graphql()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path,
      }
    }
  }
});
