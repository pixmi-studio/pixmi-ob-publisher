import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    alias: {
      obsidian: path.resolve(__dirname, '__mocks__/obsidian.js')
    },
    coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: {
            lines: 80,
            functions: 80,
            branches: 80,
            statements: 80
        }
    }
  },
});
