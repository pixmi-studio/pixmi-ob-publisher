import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'PixmiObPublisher',
      fileName: () => 'main.js',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['obsidian', 'fs', 'path', 'crypto'],
      output: {
        globals: {
          obsidian: 'obsidian',
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: 'inline',
  },
});