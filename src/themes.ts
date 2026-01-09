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
                    .pixmi-preview-container { 
                        font-family: "PingFang SC", "Hiragino Sans GB", sans-serif !important; 
                        color: #333 !important; 
                        line-height: 1.6 !important;
                        background-color: #fff !important; /* Force white background for preview consistency */
                        padding: 20px !important;
                    }
                    .pixmi-preview-container h1 { 
                        border-bottom: 2px solid #eee !important; 
                        padding-bottom: 10px !important; 
                        color: #000 !important; 
                    }
                    .pixmi-preview-container img { 
                        border-radius: 12px !important; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; 
                        max-width: 100% !important;
                    }
                `,
                type: 'builtin'
            },
            {
                id: 'technical',
                name: 'Technical',
                css: `
                    .pixmi-preview-container { font-family: "Fira Code", monospace; color: #24292e; }
                    .pixmi-preview-container code { background-color: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
                    .pixmi-preview-container h1, .pixmi-preview-container h2 { color: #0366d6; }
                `,
                type: 'builtin'
            },
            {
                id: 'modern-magazine',
                name: 'Modern Magazine',
                css: `
                    .pixmi-preview-container { line-height: 2; letter-spacing: 0.5px; color: #444; }
                    .pixmi-preview-container h1 { text-align: center; font-variant: small-caps; margin-top: 40px; }
                    .pixmi-preview-container p { margin-bottom: 1.5em; }
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
