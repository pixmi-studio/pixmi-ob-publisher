import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PixmiObPublisher from '../src/main';
import { PreviewWindowManager } from '../src/preview-window-manager';
import { App, PluginManifest, MarkdownView } from 'obsidian';

// Mock dependencies
vi.mock('../src/preview-window-manager');
vi.mock('../src/style-injector');
vi.mock('../src/markdown-parser');
vi.mock('../src/themes');
vi.mock('../src/theme-switcher');

describe('Preview Synchronization', () => {
    let plugin: PixmiObPublisher;
    let mockApp: any;
    let mockManifest: PluginManifest;
    let mockPreviewManagerInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockApp = {
            workspace: {
                on: vi.fn(),
                getActiveViewOfType: vi.fn()
            },
            metadataCache: {
                on: vi.fn(),
                getFileCache: vi.fn().mockReturnValue({ frontmatter: {} }),
                getFirstLinkpathDest: vi.fn()
            }
        };

        mockManifest = {} as any;

        plugin = new PixmiObPublisher(mockApp, mockManifest);
        
        mockPreviewManagerInstance = {
            openPreview: vi.fn(),
            updateContent: vi.fn(),
            injectStyle: vi.fn(),
            closePreview: vi.fn()
        };
        (PreviewWindowManager as any).mockImplementation(() => mockPreviewManagerInstance);

        // Manually init dependencies that would be in onload
        plugin.previewWindowManager = mockPreviewManagerInstance;
        plugin.markdownParser = {
            render: vi.fn().mockReturnValue('<p>rendered html</p>')
        } as any;
        plugin.themeSwitcher = {
            getTheme: vi.fn().mockReturnValue('default')
        } as any;
        plugin.themeManager = {
            getTheme: vi.fn().mockReturnValue({ id: 'default', css: 'body { color: red; }' })
        } as any;
    });

    it('should update preview window content when editor changes', () => {
        const mockView = {
            file: { path: 'test.md' },
            getViewData: vi.fn().mockReturnValue('# content')
        };
        mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);

        // Simulate sync call (which would be triggered by editor events)
        plugin.updatePreview();

        expect(plugin.markdownParser.render).toHaveBeenCalledWith('# content');
        expect(mockPreviewManagerInstance.updateContent).toHaveBeenCalledWith('<p>rendered html</p>');
    });

    it('should inject theme style when updating preview', () => {
        const mockView = {
            file: { path: 'test.md' },
            getViewData: vi.fn().mockReturnValue('# content')
        };
        mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);

        plugin.updatePreview();

        expect(mockPreviewManagerInstance.injectStyle).toHaveBeenCalledWith('default', 'body { color: red; }');
    });
});
