import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PixmiObPublisher from '../src/main';
import { StyleInjector } from '../src/style-injector';
import { App, PluginManifest, MarkdownView } from 'obsidian';

// Mock dependencies
vi.mock('../src/style-injector');
vi.mock('../src/settings', () => ({
    DEFAULT_SETTINGS: {},
    PixmiSettings: {}
}));
vi.mock('../src/wechat-api');
vi.mock('../src/publisher');
vi.mock('../src/themes');
vi.mock('../src/theme-switcher');

describe('Legacy Cleanup', () => {
    let plugin: PixmiObPublisher;
    let mockApp: any;
    let mockManifest: PluginManifest;
    let mockStyleInjectorInstance: any;

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        mockApp = {
            workspace: {
                on: vi.fn(),
                getActiveViewOfType: vi.fn()
            },
            metadataCache: {
                on: vi.fn(),
                getFileCache: vi.fn(),
                getFirstLinkpathDest: vi.fn()
            },
            vault: {
                readBinary: vi.fn()
            },
            fileManager: {
                processFrontMatter: vi.fn()
            }
        };

        mockManifest = {
            id: 'pixmi-ob-publisher',
            name: 'Pixmi Obsidian Publisher',
            author: 'Pixmi',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            description: 'Test'
        };

        // Instantiate plugin
        plugin = new PixmiObPublisher(mockApp, mockManifest);
        
        // Mock internal properties that are usually set in onload
        // We'll set them manually to test refreshPreviewStyle directly
        mockStyleInjectorInstance = {
            inject: vi.fn(),
            clear: vi.fn()
        };
        plugin.styleInjector = mockStyleInjectorInstance;
        
        plugin.themeSwitcher = {
            getTheme: vi.fn().mockReturnValue('default'),
            setTheme: vi.fn()
        } as any;

        plugin.themeManager = {
            getTheme: vi.fn().mockReturnValue({ id: 'default', css: 'body { color: red; }', name: 'Default' }),
            loadThemes: vi.fn(),
            getAllThemes: vi.fn()
        } as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should NOT inject styles into the main app window', () => {
        const mockContainerEl = {
            classList: {
                contains: vi.fn().mockReturnValue(false),
                add: vi.fn()
            }
        };
        
        const mockPreviewEl = {
            classList: {
                contains: vi.fn().mockReturnValue(false),
                add: vi.fn()
            }
        };

        const mockActiveView = {
            file: { path: 'test.md' },
            containerEl: mockContainerEl,
            contentEl: {
                querySelector: vi.fn().mockReturnValue(mockPreviewEl)
            }
        };

        mockApp.workspace.getActiveViewOfType.mockReturnValue(mockActiveView);

        // Call the method that used to do the injection
        plugin.refreshPreviewStyle();

        // Expectation: styleInjector.inject should NOT be called
        expect(mockStyleInjectorInstance.inject).not.toHaveBeenCalled();
    });

    it('should NOT add pixmi-preview-container class to view elements', () => {
        const mockContainerEl = {
            classList: {
                contains: vi.fn().mockReturnValue(false),
                add: vi.fn()
            }
        };

        const mockPreviewEl = {
            classList: {
                contains: vi.fn().mockReturnValue(false),
                add: vi.fn()
            }
        };

        const mockActiveView = {
            file: { path: 'test.md' },
            containerEl: mockContainerEl,
            contentEl: {
                querySelector: vi.fn().mockReturnValue(mockPreviewEl)
            }
        };

        mockApp.workspace.getActiveViewOfType.mockReturnValue(mockActiveView);

        // Call the method
        plugin.refreshPreviewStyle();

        // Expectation: classList.add should NOT be called for the container
        expect(mockContainerEl.classList.add).not.toHaveBeenCalledWith('pixmi-preview-container');
        expect(mockPreviewEl.classList.add).not.toHaveBeenCalledWith('pixmi-preview-container');
    });
});
