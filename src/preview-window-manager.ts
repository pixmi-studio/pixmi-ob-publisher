import { App, WorkspaceLeaf } from 'obsidian';
import { StyleInjector } from './style-injector';
import { WeChatPreviewView, VIEW_TYPE_WECHAT_PREVIEW } from './preview-view';

export class PreviewWindowManager {
    private app: App;
    private styleInjector: StyleInjector;

    constructor(app: App, styleInjector: StyleInjector) {
        this.app = app;
        this.styleInjector = styleInjector;
    }

    async openPreview() {
        const existing = this.getExistingLeaf();
        if (existing) {
            console.log('[Pixmi] Focusing existing preview window');
            this.app.workspace.revealLeaf(existing);
            return;
        }

        console.log('[Pixmi] Opening new preview window...');
        // Using openPopoutLeaf to specify window dimensions (iPhone 12/13/14/15 standard size)
        const leaf = this.app.workspace.openPopoutLeaf({
            size: {
                width: 390,
                height: 844
            }
        });
        await leaf.setViewState({
            type: VIEW_TYPE_WECHAT_PREVIEW,
            active: true,
        });
        
        // Ensure the window is focused
        this.app.workspace.revealLeaf(leaf);
    }

    private getExistingLeaf(): WorkspaceLeaf | null {
        const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_WECHAT_PREVIEW);
        return leaves.length > 0 ? leaves[0] : null;
    }

    updateContent(html: string) {
        const leaf = this.getExistingLeaf();
        if (leaf && leaf.view instanceof WeChatPreviewView) {
            const container = leaf.view.getPreviewContainer();
            if (container) {
                console.log('[Pixmi] Updating preview content, length:', html.length);
                container.innerHTML = html;
            } else {
                console.warn('[Pixmi] Preview container not found in view');
            }
        } else {
            console.log('[Pixmi] Preview leaf or view not found during update');
        }
    }

    injectStyle(themeId: string, css: string) {
        const leaf = this.getExistingLeaf();
        if (leaf && leaf.view instanceof WeChatPreviewView) {
            // Access the document where the view is rendered (main window or popout)
            const doc = leaf.view.containerEl.ownerDocument;
            this.styleInjector.inject(themeId, css, doc);
        }
    }

    closePreview() {
        const leaf = this.getExistingLeaf();
        if (leaf) {
            leaf.detach();
        }
    }
}