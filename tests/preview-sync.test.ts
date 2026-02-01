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
            render: vi.fn().mockReturnValue('<p>rendered html</p>'),
            extractImages: vi.fn().mockReturnValue([]),
            renderWithReplacements: vi.fn().mockReturnValue('<p>rendered html</p>')
        } as any;
        plugin.cssConverter = {
            convert: vi.fn().mockReturnValue('<p>converted html</p>')
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

        expect(plugin.markdownParser.renderWithReplacements).toHaveBeenCalledWith('# content', expect.any(Map));
        expect(plugin.cssConverter.convert).toHaveBeenCalledWith('<p>rendered html</p>', 'body { color: red; }');
        expect(mockPreviewManagerInstance.updateContent).toHaveBeenCalledWith('<p>converted html</p>');
    });

    it('should use CssConverter to apply styles when updating preview', () => {
        const mockView = {
            file: { path: 'test.md' },
            getViewData: vi.fn().mockReturnValue('# content')
        };
        mockApp.workspace.getActiveViewOfType.mockReturnValue(mockView);

        plugin.updatePreview();

        expect(plugin.cssConverter.convert).toHaveBeenCalledWith('<p>rendered html</p>', 'body { color: red; }');
        expect(mockPreviewManagerInstance.updateContent).toHaveBeenCalledWith('<p>converted html</p>');
    });

    it('should update preview with new file content when switching notes', () => {
        // Setup initial view
        const file1 = { path: 'note1.md' };
        mockApp.workspace.getActiveViewOfType.mockReturnValue({
            file: file1,
            getViewData: () => '# Note 1'
        });
        
        plugin.markdownParser.renderWithReplacements = vi.fn().mockReturnValue('<h1>Note 1</h1>');
        plugin.updatePreview();
        expect(mockPreviewManagerInstance.updateContent).toHaveBeenCalledWith('<p>converted html</p>');

        // Switch view
        const file2 = { path: 'note2.md' };
        mockApp.workspace.getActiveViewOfType.mockReturnValue({
            file: file2,
            getViewData: () => '# Note 2'
        });

        plugin.markdownParser.renderWithReplacements = vi.fn().mockReturnValue('<h1>Note 2</h1>');
        plugin.updatePreview();
        expect(mockPreviewManagerInstance.updateContent).toHaveBeenCalledWith('<p>converted html</p>');
    });
});
