import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Plugin } from 'obsidian';
import PixmiObPublisher from '../src/main';

const mocks = vi.hoisted(() => ({
    noticeSpy: vi.fn(),
    logSpy: vi.fn()
}));

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
      saveData() { return Promise.resolve(); }
      loadData() { return Promise.resolve({}); }
      addSettingTab() {}
      addRibbonIcon() {}
      addCommand() {}
      addStatusBarItem() { 
        return { 
          setText: vi.fn(),
          onclick: vi.fn(),
          empty: vi.fn(),
          addClass: vi.fn(),
          createSpan: vi.fn()
        };
      }
      registerEvent() {}
    },
    PluginSettingTab: class {},
    Setting: class Setting {
        constructor(containerEl: any) {
        }
        setName() { return this; }
        setDesc() { return this; }
        addText(cb: any) {
             return this;
        }
    },
    Notice: mocks.noticeSpy,
    MarkdownView: class {},
    Modal: class {
      app: any;
      constructor(app: any) { this.app = app; }
      open() {}
      close() {}
    },
    FuzzySuggestModal: class {
      app: any;
      constructor(app: any) { this.app = app; }
      open() {}
      close() {}
    },
    TFile: class {},
    setIcon: vi.fn()
  };
});

// Mock LogManager
vi.mock('../src/logger', () => {
    return {
        LogManager: class {
            constructor() {}
            log(msg: string, level: string) { mocks.logSpy(msg, level); }
            getLogContent() { return Promise.resolve(''); }
            clearLogs() { return Promise.resolve(); }
        }
    };
});

import { ThemeManager, Theme } from './themes';
import { ThemeSwitcher } from './theme-switcher';
import { StyleInjector } from './style-injector';

// Mock StyleInjector
vi.mock('../src/style-injector', () => {
    return {
        StyleInjector: class {
            constructor() {}
            inject = vi.fn();
            clear = vi.fn();
        }
    };
});

describe('PixmiObPublisher', () => {
  let plugin: PixmiObPublisher;
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      vault: {
        readBinary: vi.fn(),
        adapter: {
          exists: vi.fn().mockResolvedValue(true),
          list: vi.fn().mockResolvedValue({ files: [], folders: [] }),
          mkdir: vi.fn().mockResolvedValue(undefined),
          read: vi.fn().mockResolvedValue('')
        }
      },
      workspace: {
        getActiveViewOfType: vi.fn(),
        on: vi.fn()
      },
      metadataCache: {
        getFileCache: vi.fn(),
        getFirstLinkpathDest: vi.fn(),
        on: vi.fn()
      },
      fileManager: {
        processFrontMatter: vi.fn()
      }
    };
    plugin = new PixmiObPublisher(mockApp as any, {} as any);
    mocks.noticeSpy.mockClear();
    mocks.logSpy.mockClear();
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
    expect(mocks.logSpy).toHaveBeenCalledWith('PixmiObPublisher loaded', undefined);
  });

  it('should add ribbon icon on onload', async () => {
    const addRibbonIconSpy = vi.spyOn(plugin, 'addRibbonIcon');
    await plugin.onload();
    expect(addRibbonIconSpy).toHaveBeenCalledWith('paper-plane', 'Publish to WeChat', expect.any(Function));
  });

  it('should add publish command on onload', async () => {
    const addCommandSpy = vi.spyOn(plugin, 'addCommand');
    await plugin.onload();
    expect(addCommandSpy).toHaveBeenCalledWith(expect.objectContaining({
        id: 'publish-to-wechat',
        name: 'Publish to WeChat'
    }));
  });

  it('should add preview command on onload', async () => {
    const addCommandSpy = vi.spyOn(plugin, 'addCommand');
    await plugin.onload();
    expect(addCommandSpy).toHaveBeenCalledWith(expect.objectContaining({
        id: 'open-wechat-preview',
        name: 'Open WeChat Publisher Preview'
    }));
  });

  it('should update api client when settings change', async () => {
    // Initialize api client
    await plugin.onload();
    
    // Change settings
    plugin.settings.appId = 'updated-app-id';
    await plugin.saveSettings();
    
    // Check if api client was updated
    expect(plugin.apiClient).toBeDefined();
  });

  it('should log on onunload', async () => {
    await plugin.onload(); // Need onload to init logger
    plugin.onunload();
    expect(mocks.logSpy).toHaveBeenCalledWith('PixmiObPublisher unloaded', undefined);
  });

  it('should publish current note', async () => {
    await plugin.onload();
    
    // Mock Publisher
    plugin.publisher.publish = vi.fn().mockResolvedValue('draft-id');

    // Mock Workspace and View
    const mockFile = { basename: 'Test Note', path: 'test.md' };
    const mockView = { 
        file: mockFile,
        getViewData: () => '# Content'
    };
    
    plugin.app.workspace = {
        getActiveViewOfType: vi.fn().mockReturnValue(mockView)
    };
    plugin.app.metadataCache = {
        getFirstLinkpathDest: vi.fn().mockReturnValue({}),
        getFileCache: vi.fn().mockReturnValue({ frontmatter: {} })
    };
    plugin.app.vault = {
        readBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0))
    };

    await plugin.publishCurrentNote();

    expect(plugin.publisher.publish).toHaveBeenCalledWith(
        'Test Note', 
        '# Content', 
        expect.any(Function),
        undefined,
        ''
    );
    expect(mocks.noticeSpy).toHaveBeenCalledWith(expect.stringContaining('Successfully published'));
    expect(mocks.logSpy).toHaveBeenCalledWith(expect.stringContaining('Successfully published draft'), undefined);
  });

  it('should show notice if no active view', async () => {
    plugin.app.workspace = {
        getActiveViewOfType: vi.fn().mockReturnValue(null)
    };
    await plugin.publishCurrentNote();
    expect(mocks.noticeSpy).toHaveBeenCalledWith('No active Markdown view.');
  });

  it('should handle publishing error', async () => {
    await plugin.onload();
    plugin.publisher.publish = vi.fn().mockRejectedValue(new Error('Publish failed'));
    
    // Setup valid view
    const mockFile = { basename: 'Test Note', path: 'test.md' };
    const mockView = { file: mockFile, getViewData: () => '# Content' };
    plugin.app.workspace = { getActiveViewOfType: vi.fn().mockReturnValue(mockView) };
    
    await plugin.publishCurrentNote();

    expect(mocks.logSpy).toHaveBeenCalledWith(expect.stringContaining('Publishing failed:'), 'ERROR');
    expect(mocks.noticeSpy).toHaveBeenCalledWith(expect.stringContaining('Publishing failed: Publish failed'));
  });

  it('should show user-friendly message for IP whitelist error', async () => {
    await plugin.onload();
    plugin.publisher.publish = vi.fn().mockRejectedValue(new Error('errcode: 40164, IP not in whitelist'));
    
    const mockFile = { basename: 'Test Note', path: 'test.md' };
    const mockView = { file: mockFile, getViewData: () => '# Content' };
    plugin.app.workspace = { getActiveViewOfType: vi.fn().mockReturnValue(mockView) };
    
    await plugin.publishCurrentNote();

    expect(mocks.noticeSpy).toHaveBeenCalledWith(expect.stringContaining('IP not whitelisted'));
  });

  it('should show user-friendly message for invalid credentials', async () => {
    await plugin.onload();
    plugin.publisher.publish = vi.fn().mockRejectedValue(new Error('errcode: 40001, invalid credential'));
    
    const mockFile = { basename: 'Test Note', path: 'test.md' };
    const mockView = { file: mockFile, getViewData: () => '# Content' };
    plugin.app.workspace = { getActiveViewOfType: vi.fn().mockReturnValue(mockView) };
    
    await plugin.publishCurrentNote();

    expect(mocks.noticeSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid AppID or AppSecret'));
  });

  it('should check callback correctly', async () => {
      // Access the registered command
      const addCommandSpy = vi.spyOn(plugin, 'addCommand');
      await plugin.onload();
      const commandArgs = addCommandSpy.mock.calls[0][0];
      const checkCallback = commandArgs.checkCallback;

      // Case 1: View active, checking=true -> return true
      plugin.app.workspace = { getActiveViewOfType: vi.fn().mockReturnValue({}) };
      expect(checkCallback(true)).toBe(true);

      // Case 2: View active, checking=false -> execute publish
      const publishSpy = vi.spyOn(plugin, 'publishCurrentNote').mockImplementation(async () => {});
      checkCallback(false);
      expect(publishSpy).toHaveBeenCalled();

      // Case 3: No view active -> return false
      plugin.app.workspace = { getActiveViewOfType: vi.fn().mockReturnValue(null) };
      expect(checkCallback(true)).toBe(false);
  });

  it('should read image from vault via callback', async () => {
    await plugin.onload();
    
    // Mock publisher.publish to execute the callback immediately
    plugin.publisher.publish = vi.fn().mockImplementation(async (title, markdown, imageReader) => {
        await imageReader('test.png');
        return 'draft-id';
    });

    const mockFile = { basename: 'Test Note', path: 'test.md' };
    const mockView = { file: mockFile, getViewData: () => '# Content' };
    plugin.app.workspace = { getActiveViewOfType: vi.fn().mockReturnValue(mockView) };
    
    // Mock metadataCache to find the file
    const mockImageFile = { path: 'test.png' };
    plugin.app.metadataCache = {
        getFirstLinkpathDest: vi.fn().mockReturnValue(mockImageFile),
        getFileCache: vi.fn().mockReturnValue({ frontmatter: {} })
    };
    
    // Mock vault
    plugin.app.vault = {
        readBinary: vi.fn().mockResolvedValue(new ArrayBuffer(8))
    };

    await plugin.publishCurrentNote();

    expect(plugin.app.metadataCache.getFirstLinkpathDest).toHaveBeenCalledWith('test.png', 'test.md');
    expect(plugin.app.vault.readBinary).toHaveBeenCalledWith(mockImageFile);
  });
});