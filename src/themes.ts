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

    async loadThemes(): Promise<void> {
        this.loadBuiltinThemes();
    }

    private loadBuiltinThemes(): void {
        const builtinThemes: Theme[] = [
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

    getTheme(id: string): Theme | undefined {
        return this.themes.get(id);
    }

    getAllThemes(): Theme[] {
        return Array.from(this.themes.values());
    }
}
