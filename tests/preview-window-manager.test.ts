import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PreviewWindowManager } from '../src/preview-window-manager';
import { WeChatPreviewView, VIEW_TYPE_WECHAT_PREVIEW } from '../src/preview-view';
import { StyleInjector } from '../src/style-injector';

// Mock WeChatPreviewView
vi.mock('../src/preview-view', () => ({
    VIEW_TYPE_WECHAT_PREVIEW: 'pixmi-wechat-preview',
    WeChatPreviewView: class {
        containerEl: any;
        constructor() {
            this.containerEl = {
                ownerDocument: {}
            };
        }
        getPreviewContainer() {
            return { innerHTML: '' };
        }
    }
}));

describe('PreviewWindowManager', () => {
    let manager: PreviewWindowManager;
    let mockApp: any;
    let mockStyleInjector: any;
    let mockLeaf: any;
    let mockView: any;
    let mockContainer: any;

    beforeEach(() => {
        mockContainer = { innerHTML: '' };
        
        mockView = {
            getPreviewContainer: vi.fn().mockReturnValue(mockContainer),
            containerEl: {
                ownerDocument: {}
            }
        };

        // Explicitly set the prototype so instanceof checks pass if we were using real classes, 
        // but here we are mocking interfaces mostly. 
        // However, the code does `leaf.view instanceof WeChatPreviewView`.
        // We'll rely on the mock factory above or just mock the property if we can't easily import the class to instance check.
        // Since we mocked the module, we can use the mocked class.
        Object.setPrototypeOf(mockView, WeChatPreviewView.prototype);

        mockLeaf = {
            setViewState: vi.fn().mockResolvedValue(undefined),
            detach: vi.fn(),
            view: mockView
        };

        mockApp = {
            workspace: {
                getLeavesOfType: vi.fn().mockReturnValue([]),
                openPopoutLeaf: vi.fn().mockReturnValue(mockLeaf),
                revealLeaf: vi.fn()
            }
        };
        
        mockStyleInjector = {
            inject: vi.fn(),
            clear: vi.fn()
        };

        manager = new PreviewWindowManager(mockApp, mockStyleInjector);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    it('should open a new popout leaf when openPreview is called and no existing leaf', async () => {
        await manager.openPreview();
        expect(mockApp.workspace.openPopoutLeaf).toHaveBeenCalled();
        expect(mockLeaf.setViewState).toHaveBeenCalledWith({
            type: VIEW_TYPE_WECHAT_PREVIEW,
            active: true,
        });
        expect(mockApp.workspace.revealLeaf).toHaveBeenCalledWith(mockLeaf);
    });

    it('should focus existing leaf if openPreview is called again', async () => {
        // Setup existing leaf
        mockApp.workspace.getLeavesOfType.mockReturnValue([mockLeaf]);

        await manager.openPreview();
        
        expect(mockApp.workspace.openPopoutLeaf).not.toHaveBeenCalled();
        expect(mockApp.workspace.revealLeaf).toHaveBeenCalledWith(mockLeaf);
    });

    it('should update content of the preview window container', () => {
        // Setup existing leaf
        mockApp.workspace.getLeavesOfType.mockReturnValue([mockLeaf]);
        
        manager.updateContent('<h1>Hello</h1>');
        
        expect(mockView.getPreviewContainer).toHaveBeenCalled();
        expect(mockContainer.innerHTML).toBe('<h1>Hello</h1>');
    });

    it('should close the window when closePreview is called', () => {
        // Setup existing leaf
        mockApp.workspace.getLeavesOfType.mockReturnValue([mockLeaf]);
        
        manager.closePreview();
        
        expect(mockLeaf.detach).toHaveBeenCalled();
    });

    it('should inject style into the preview window document', () => {
        // Setup existing leaf
        mockApp.workspace.getLeavesOfType.mockReturnValue([mockLeaf]);
        
        manager.injectStyle('default', 'body { color: blue; }');

        expect(mockStyleInjector.inject).toHaveBeenCalledWith(
            'default', 
            'body { color: blue; }', 
            mockView.containerEl.ownerDocument
        );
    });
});