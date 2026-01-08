import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogManager } from '../src/logger';
import { App, PluginManifest } from 'obsidian';

describe('LogManager', () => {
  let app: any;
  let manifest: any;
  let logManager: LogManager;

  beforeEach(() => {
    app = {
      vault: {
        adapter: {
          exists: vi.fn(),
          append: vi.fn(),
          write: vi.fn(),
          read: vi.fn(),
        }
      }
    };
    manifest = {
      dir: 'test-dir'
    };
    logManager = new LogManager(app as App, manifest as PluginManifest);
  });

  it('should write log to file', async () => {
    app.vault.adapter.exists.mockResolvedValue(false);
    await logManager.log('Test message');
    expect(app.vault.adapter.write).toHaveBeenCalledWith('test-dir/plugin.log', expect.stringContaining('[INFO] Test message'));
  });

  it('should append log to existing file', async () => {
    app.vault.adapter.exists.mockResolvedValue(true);
    await logManager.log('Test message');
    expect(app.vault.adapter.append).toHaveBeenCalledWith('test-dir/plugin.log', expect.stringContaining('[INFO] Test message'));
  });
});
