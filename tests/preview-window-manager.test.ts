import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PreviewWindowManager } from '../src/preview-window-manager';
import { App } from 'obsidian';

describe('PreviewWindowManager', () => {
    let manager: PreviewWindowManager;
    let mockApp: any;
    let mockWindow: any;
    let mockContainer: any;
    let containerFound = false;

    beforeEach(() => {
        mockApp = {
            // Mock necessary app properties
        };
        
        containerFound = false;
        mockContainer = { innerHTML: '', className: '' };

        mockWindow = {
            document: {
                title: '',
                write: vi.fn(),
                close: vi.fn(),
                body: {
                    innerHTML: '',
                    appendChild: vi.fn().mockImplementation(() => {
                        containerFound = true;
                    })
                },
                head: {
                    appendChild: vi.fn()
                },
                createElement: vi.fn().mockImplementation((tag) => {
                    if (tag === 'div') return mockContainer;
                    return { tagName: tag.toUpperCase() };
                }),
                querySelector: vi.fn().mockImplementation((sel) => {
                    if (sel === '.pixmi-preview-container') {
                        return containerFound ? mockContainer : null;
                    }
                    return null;
                })
            },
            focus: vi.fn(),
            close: vi.fn(),
            closed: false
        };

        // Mock global window.open
        vi.stubGlobal('open', vi.fn().mockReturnValue(mockWindow));

        manager = new PreviewWindowManager(mockApp);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    it('should open a new window when openPreview is called', () => {
        manager.openPreview();
        expect(window.open).toHaveBeenCalled();
        expect(mockWindow.document.body.appendChild).toHaveBeenCalledWith(mockContainer);
    });

    it('should focus existing window if openPreview is called again', () => {
        manager.openPreview();
        manager.openPreview();
        
        expect(window.open).toHaveBeenCalledTimes(1);
        expect(mockWindow.focus).toHaveBeenCalled();
    });

    it('should open a new window if the previous one was closed', () => {
        manager.openPreview();
        
        // Simulate closing
        mockWindow.closed = true;
        
        manager.openPreview();
        expect(window.open).toHaveBeenCalledTimes(2);
    });

    it('should update content of the preview window container', () => {
        manager.openPreview();
        manager.updateContent('<h1>Hello</h1>');
        
        expect(mockContainer.innerHTML).toBe('<h1>Hello</h1>');
    });

    it('should close the window when closePreview is called', () => {
        manager.openPreview();
        manager.closePreview();
        
        expect(mockWindow.close).toHaveBeenCalled();
    });
});
