import { App } from 'obsidian';

export class PreviewWindowManager {
    private app: App;
    private previewWindow: Window | null = null;

    constructor(app: App) {
        this.app = app;
    }

    openPreview() {
        if (this.previewWindow && !this.previewWindow.closed) {
            this.previewWindow.focus();
            return;
        }

        this.previewWindow = window.open('', 'PixmiWeChatPreview', 'width=450,height=800,resizable,scrollbars');
        
        if (this.previewWindow) {
            this.initWindow();
        }
    }

    private initWindow() {
        if (!this.previewWindow) return;
        
        const doc = this.previewWindow.document;
        doc.title = 'WeChat Preview';
        
        // Ensure body exists and is empty initially
        if (!doc.body) {
            doc.write('<body></body>');
        }
        
        // Add the container div if not present
        let container = doc.querySelector('.pixmi-preview-container');
        if (!container) {
            container = doc.createElement('div');
            container.className = 'pixmi-preview-container';
            doc.body.appendChild(container);
        }
    }

    updateContent(html: string) {
        if (!this.previewWindow || this.previewWindow.closed) return;
        
        const container = this.previewWindow.document.querySelector('.pixmi-preview-container');
        if (container) {
            container.innerHTML = html;
        } else {
             // Fallback
             this.previewWindow.document.body.innerHTML = html;
        }
    }

    closePreview() {
        if (this.previewWindow) {
            this.previewWindow.close();
            this.previewWindow = null;
        }
    }

    getPreviewWindow(): Window | null {
        return this.previewWindow;
    }
}
