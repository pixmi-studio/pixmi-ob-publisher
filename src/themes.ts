import { App, TFolder, TFile, normalizePath } from 'obsidian';

/**
 * Represents the type of a theme.
 * 'builtin': Themes bundled with the plugin.
 * 'custom': Themes added by the user in the local directory.
 */
export type ThemeType = 'builtin' | 'custom';

/**
 * Metadata for a theme.
 */
export interface Theme {
    /** Unique identifier for the theme (e.g., file name or slug) */
    id: string;
    /** Display name of the theme */
    name: string;
    /** Raw CSS content of the theme */
    css: string;
    /** Source type of the theme */
    type: ThemeType;
    /** Optional path to the theme file (for custom themes) */
    path?: string;
}

/**
 * Interface for theme manager responsible for loading and managing themes.
 */
export interface IThemeManager {
    getTheme(id: string): Theme | undefined;
    getAllThemes(): Theme[];
    loadThemes(): Promise<void>;
}

export class ThemeManager implements IThemeManager {
    private themes: Map<string, Theme> = new Map();
    private app: App;
    private customThemesPath: string = '.obsidian/pixmi-themes';

    constructor(app: App) {
        this.app = app;
    }

    async loadThemes(): Promise<void> {
        this.themes.clear();
        this.loadBuiltinThemes();
        await this.loadCustomThemes();
    }

    private loadBuiltinThemes(): void {
        const builtinThemes: Theme[] = [
            {
                id: 'default',
                name: 'Default',
                css: '', // Default theme might rely on base styles or empty
                type: 'builtin'
            },
            {
                id: 'minimalist',
                name: 'Minimalist',
                css: `
                    /* Base Reset & Typography */
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
                    color: #333 !important; 
                    line-height: 1.75 !important;
                    background-color: #fff !important; 
                    padding: 20px !important;
                    font-size: 16px !important;
                    text-align: left !important;

                    /* Block Elements */
                    p { margin: 0 0 1.5em 0 !important; text-align: justify !important; }
                    
                    h1, h2, h3, h4, h5, h6 {
                        color: #111 !important;
                        font-weight: 700 !important;
                        line-height: 1.3 !important;
                        margin-top: 2em !important;
                        margin-bottom: 1em !important;
                    }

                    h1 { font-size: 24px !important; border-bottom: 1px solid #eee !important; padding-bottom: 0.5em !important; }
                    h2 { font-size: 20px !important; border-bottom: 1px solid #eee !important; padding-bottom: 0.3em !important; }
                    h3 { font-size: 18px !important; }

                    ul, ol { padding-left: 2em !important; margin-bottom: 1.5em !important; }
                    li { margin-bottom: 0.5em !important; }

                    blockquote {
                        border-left: 4px solid #ddd !important;
                        padding-left: 1em !important;
                        color: #666 !important;
                        margin: 0 0 1.5em 0 !important;
                        font-style: italic !important;
                    }

                    img { 
                        display: block !important;
                        margin: 20px auto !important;
                        border-radius: 8px !important; 
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important; 
                        max-width: 100% !important;
                        height: auto !important;
                    }
                    
                    /* Inline Elements */
                    strong { font-weight: 700 !important; color: #000 !important; }
                    em { font-style: italic !important; }
                    code {
                        background-color: rgba(27,31,35,0.05) !important;
                        padding: 0.2em 0.4em !important;
                        border-radius: 3px !important;
                        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace !important;
                        font-size: 85% !important;
                    }
                `,
                type: 'builtin'
            },
            {
                id: 'technical',
                name: 'Technical',
                css: `
                    .pixmi-preview-container { font-family: "Fira Code", monospace !important; color: #24292e !important; }
                    .pixmi-preview-container code { background-color: #f6f8fa !important; padding: 2px 4px !important; border-radius: 3px !important; }
                    .pixmi-preview-container h1, .pixmi-preview-container h2 { color: #0366d6 !important; }
                `,
                type: 'builtin'
            },
            {
                id: 'modern',
                name: 'Modern Magazine',
                css: `
                    .pixmi-preview-container { line-height: 2 !important; letter-spacing: 0.5px !important; color: #444 !important; }
                    .pixmi-preview-container h1 { text-align: center !important; font-variant: small-caps !important; margin-top: 40px !important; }
                    .pixmi-preview-container p { margin-bottom: 1.5em !important; }
                `,
                type: 'builtin'
            }
        ];

        builtinThemes.forEach(theme => this.themes.set(theme.id, theme));
    }

    private async loadCustomThemes(): Promise<void> {
        const adapter = this.app.vault.adapter;
        
        if (!(await adapter.exists(this.customThemesPath))) {
            try {
                await adapter.mkdir(this.customThemesPath);
            } catch (error) {
                console.error('Failed to create custom themes directory:', error);
                return;
            }
        }

        const files = await adapter.list(this.customThemesPath);
        
        for (const filePath of files.files) {
            if (filePath.endsWith('.css')) {
                try {
                    const content = await adapter.read(filePath);
                    const fileName = filePath.split('/').pop() || filePath;
                    const id = fileName.replace('.css', '');
                    const name = id.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                    this.themes.set(id, {
                        id,
                        name,
                        css: content,
                        type: 'custom',
                        path: filePath
                    });
                } catch (error) {
                    console.error(`Failed to read theme file ${filePath}:`, error);
                }
            }
        }
    }

    getTheme(id: string): Theme | undefined {
        return this.themes.get(id);
    }

    getAllThemes(): Theme[] {
        return Array.from(this.themes.values());
    }
}
