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

        const scopedCss = this.scopeCss(css, '.pixmi-preview-container');
        styleEl.textContent = `/* Pixmi Theme: ${themeId} */\n${scopedCss}`;
    }

    /**
     * Scopes CSS rules by prefixing selectors with a container class.
     * Simple implementation: handles basic selectors.
     */
    private scopeCss(css: string, scope: string): string {
        // This is a simple regex-based scoping. It might need refinement for complex CSS.
        // It looks for sequences of characters that aren't inside braces and prefixes them.
        return css.replace(/([^\r\n,{}]+)(?=[^{}]*{)/g, (match) => {
            const trimmed = match.trim();
            if (!trimmed || trimmed.startsWith('@') || trimmed.startsWith(':root')) {
                return match;
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
