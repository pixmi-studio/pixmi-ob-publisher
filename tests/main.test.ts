import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Plugin } from 'obsidian';
import PixmiObPublisher from '../src/main';

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
      loadData() { return Promise.resolve({}); }
      saveData() { return Promise.resolve(); }
      addSettingTab() {}
    },
    PluginSettingTab: class PluginSettingTab {
        constructor(app: any, plugin: any) {
            this.app = app;
            this.plugin = plugin;
        }
        display() {}
    },
    Setting: class Setting {
        constructor(containerEl: any) {
        }
        setName() { return this; }
        setDesc() { return this; }
        addText(cb: any) {
             return this;
        }
    }
  };
});

describe('PixmiObPublisher', () => {
  let plugin: PixmiObPublisher;

  beforeEach(() => {
    plugin = new PixmiObPublisher({} as any, {} as any);
  });

  it('should be defined', () => {
    expect(PixmiObPublisher).toBeDefined();
  });

  it('should extend Plugin', () => {
    expect(plugin).toBeInstanceOf(Plugin);
  });

  it('should have default settings after initialization', () => {
    expect(plugin.settings).toBeDefined();
    expect(plugin.settings.appId).toBe('');
  });

  it('should load settings', async () => {
    const mockData = { appId: 'test-app-id' };
    vi.spyOn(plugin, 'loadData').mockResolvedValue(mockData);
    await plugin.loadSettings();
    expect(plugin.settings.appId).toBe('test-app-id');
  });

  it('should save settings', async () => {
    plugin.settings.appId = 'new-app-id';
    const saveSpy = vi.spyOn(plugin, 'saveData');
    await plugin.saveSettings();
    expect(saveSpy).toHaveBeenCalledWith(plugin.settings);
  });

  it('should initialize on onload', async () => {
    const addSettingTabSpy = vi.spyOn(plugin, 'addSettingTab');
    const loadSettingsSpy = vi.spyOn(plugin, 'loadSettings');
    await plugin.onload();
    expect(loadSettingsSpy).toHaveBeenCalled();
    expect(addSettingTabSpy).toHaveBeenCalled();
  });

  it('should log on onunload', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    plugin.onunload();
    expect(consoleSpy).toHaveBeenCalledWith('PixmiObPublisher unloaded');
  });
});