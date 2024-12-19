import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm';

// https://vite.dev/config/
export default defineConfig({
  define: {
    'process.env': {},
    global: {}, // Define an empty process.env object to prevent runtime errors
  },
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      util: 'process/browser',
      buffer: 'buffer',
    },
  },

})
