import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_WECHAT_PREVIEW = 'pixmi-wechat-preview';

export class WeChatPreviewView extends ItemView {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_WECHAT_PREVIEW;
    }

    getDisplayText() {
        return 'WeChat Preview';
    }

    getIcon() {
        return 'paper-plane';
    }

    async onOpen() {
        console.log('[Pixmi] WeChatPreviewView opened');
        const container = this.contentEl;
        container.empty();
        container.addClass('pixmi-preview-view');
        
        // Create the specific container for content that matches the style injector's expectation
        const previewContainer = container.createDiv({ cls: 'wechat-container' });
        console.log('[Pixmi] Preview container created:', previewContainer);
        
        // Ensure proper isolation/reset styles could be applied here if needed
        // but style-injector handles the scoping.
    }

    async onClose() {
        // Cleanup if necessary
    }
    
    getPreviewContainer(): HTMLElement | null {
        return this.contentEl.querySelector('.wechat-container');
    }
}
