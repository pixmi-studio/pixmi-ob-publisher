import { App } from 'obsidian';

export class StyleInjector {
    private app: App;
    private styleId = 'pixmi-theme-style';

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Injects or updates a CSS style block in the document head.
     * @param themeId The unique ID of the theme.
     * @param css The CSS content to inject.
     */
    inject(themeId: string, css: string): void {
        let styleEl = document.getElementById(this.styleId) as HTMLStyleElement;
        
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = this.styleId;
            document.head.appendChild(styleEl);
        }

        // Just use the standard prefix. Since themes.ts already has .pixmi-preview-container,
        // scopeCss will see it and keep it (if we fix the logic).
        const scopedCss = this.scopeCss(css, '.pixmi-preview-container');
        styleEl.textContent = `/* Pixmi Theme: ${themeId} */\n${scopedCss}`;
    }

    /**
     * Scopes CSS rules. If the selector already has the scope, leave it.
     */
    private scopeCss(css: string, scope: string): string {
        return css.replace(/([^\r\n,{}]+)(?=[^{}]*{)/g, (match) => {
            const trimmed = match.trim();
            if (!trimmed || trimmed.startsWith('@') || trimmed.startsWith(':root')) {
                return match;
            }
            
            if (trimmed.includes(scope)) {
                return trimmed;
            }

            // Handle root selectors
            if (trimmed === 'body' || trimmed === '#write' || trimmed === 'html') {
                return scope;
            }
            if (trimmed.startsWith('body ')) {
                return scope + ' ' + trimmed.substring(5);
            }
            if (trimmed.startsWith('#write ')) {
                return scope + ' ' + trimmed.substring(7);
            }
            
            return `${scope} ${trimmed}`;
        });
    }

    /**
     * Removes the injected style block.
     */
    clear(): void {
        const styleEl = document.getElementById(this.styleId);
        if (styleEl) {
            styleEl.remove();
        }
    }
}
