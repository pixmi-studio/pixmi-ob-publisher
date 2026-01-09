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
                id: 'original',
                name: 'Original',
                css: '',
                type: 'builtin'
            },
            {
                id: 'default',
                name: 'Default',
                css: '', // Default theme might rely on base styles or empty
                type: 'builtin'
            },
            {
                id: 'minimalist',
                name: 'Minimalist',
                css: '/* Minimalist Theme Placeholder */\n.pixmi-preview-container { font-family: sans-serif; }',
                type: 'builtin'
            },
            {
                id: 'technical',
                name: 'Technical',
                css: '/* Technical Theme Placeholder */\n.pixmi-preview-container { font-family: monospace; }',
                type: 'builtin'
            },
            {
                id: 'modern-magazine',
                name: 'Modern Magazine',
                css: '/* Modern Magazine Theme Placeholder */\n.pixmi-preview-container { line-height: 1.8; }',
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
