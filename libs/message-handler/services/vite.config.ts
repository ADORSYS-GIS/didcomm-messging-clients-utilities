import wasm from 'vite-plugin-wasm';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), nodePolyfills()],
});
