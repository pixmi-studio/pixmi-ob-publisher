import { describe, it, expect, vi } from 'vitest';
import { Plugin } from 'obsidian';
import PixmiObPublisher from '../main';

// Mock Obsidian Plugin class
vi.mock('obsidian', () => {
  return {
    Plugin: class {
      app: any;
      manifest: any;
      constructor(app: any, manifest: any) {
        this.app = app;
        this.manifest = manifest;
      }
      onload() {}
      onunload() {}
    }
  };
});

describe('PixmiObPublisher', () => {
  it('should be defined', () => {
    expect(PixmiObPublisher).toBeDefined();
  });

  it('should extend Plugin', () => {
    const plugin = new PixmiObPublisher({} as any, {} as any);
    expect(plugin).toBeInstanceOf(Plugin);
  });

  it('should call onload', async () => {
    const plugin = new PixmiObPublisher({} as any, {} as any);
    const consoleSpy = vi.spyOn(console, 'log');
    await plugin.onload();
    expect(consoleSpy).toHaveBeenCalledWith('PixmiObPublisher loaded');
  });

   it('should call onunload', () => {
    const plugin = new PixmiObPublisher({} as any, {} as any);
    const consoleSpy = vi.spyOn(console, 'log');
    plugin.onunload();
    expect(consoleSpy).toHaveBeenCalledWith('PixmiObPublisher unloaded');
  });
});