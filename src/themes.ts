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
                    /* Global Reset */
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                    color: #333 !important; 
                    line-height: 1.75 !important;
                    background-color: #fff !important; 
                    padding: 20px !important;
                    font-size: 16px !important;
                    text-align: left !important;

                    /* Headings */
                    h1, h2, h3, h4, h5, h6 {
                        color: #111 !important;
                        font-weight: 700 !important;
                        line-height: 1.3 !important;
                        margin-top: 1.5em !important;
                        margin-bottom: 0.8em !important;
                    }
                    h1 { font-size: 24px !important; border-bottom: 1px solid #eee !important; padding-bottom: 0.5em !important; }
                    h2 { font-size: 20px !important; border-bottom: 1px solid #eee !important; padding-bottom: 0.3em !important; }
                    h3 { font-size: 18px !important; }

                    /* Text */
                    p { margin: 0 0 1.5em 0 !important; text-align: justify !important; }
                    strong { font-weight: 700 !important; color: #000 !important; }
                    em { font-style: italic !important; color: #555 !important; }
                    a { color: #0366d6 !important; text-decoration: none !important; border-bottom: 1px solid #0366d6 !important; }

                    /* Lists */
                    ul, ol { padding-left: 2em !important; margin-bottom: 1.5em !important; }
                    li { margin-bottom: 0.5em !important; color: #333 !important; }
                    ul li { list-style-type: disc !important; }
                    ol li { list-style-type: decimal !important; }

                    /* Task Lists */
                    li.task-list-item { list-style-type: none !important; margin-left: -1.5em !important; }
                    input[type="checkbox"] { margin-right: 0.5em !important; vertical-align: middle !important; }

                    /* Blockquotes */
                    blockquote {
                        border-left: 4px solid #ddd !important;
                        padding: 10px 15px !important;
                        color: #666 !important;
                        background-color: #f9f9f9 !important;
                        margin: 0 0 1.5em 0 !important;
                        border-radius: 0 4px 4px 0 !important;
                    }
                    blockquote p { margin: 0 !important; }

                    /* Code */
                    code {
                        background-color: rgba(27,31,35,0.05) !important;
                        padding: 0.2em 0.4em !important;
                        border-radius: 3px !important;
                        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace !important;
                        font-size: 85% !important;
                        color: #d63384 !important;
                    }
                    pre {
                        background-color: #f6f8fa !important;
                        padding: 16px !important;
                        overflow: auto !important;
                        border-radius: 6px !important;
                        margin-bottom: 1.5em !important;
                    }
                    pre code {
                        background-color: transparent !important;
                        padding: 0 !important;
                        color: #24292e !important;
                        font-size: 13px !important;
                    }

                    /* Tables */
                    table {
                        border-collapse: collapse !important;
                        width: 100% !important;
                        margin-bottom: 1.5em !important;
                        font-size: 14px !important;
                    }
                    th {
                        background-color: #f6f8fa !important;
                        font-weight: 600 !important;
                        text-align: left !important;
                        padding: 8px 12px !important;
                        border: 1px solid #dfe2e5 !important;
                    }
                    td {
                        padding: 8px 12px !important;
                        border: 1px solid #dfe2e5 !important;
                    }

                    /* Horizontal Rule */
                    hr {
                        height: 0.25em !important;
                        padding: 0 !important;
                        margin: 24px 0 !important;
                        background-color: #e1e4e8 !important;
                        border: 0 !important;
                    }

                    /* Images */
                    img { 
                        display: block !important;
                        margin: 20px auto !important;
                        border-radius: 8px !important; 
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important; 
                        max-width: 100% !important;
                        height: auto !important;
                    }
                `,
                type: 'builtin'
            },
            {
                id: 'technical',
                name: 'Technical',
                css: `
                    /* Global */
                    font-family: "Fira Code", "Consolas", monospace !important; 
                    color: #24292e !important;
                    line-height: 1.6 !important;
                    background-color: #fff !important;
                    padding: 20px !important;
                    font-size: 14px !important;

                    /* Headings */
                    h1, h2, h3, h4, h5, h6 { 
                        color: #0366d6 !important; 
                        margin-top: 24px !important;
                        margin-bottom: 16px !important;
                        font-weight: 600 !important;
                        line-height: 1.25 !important;
                    }
                    h1 { border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; font-size: 2em !important; }
                    h2 { border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; font-size: 1.5em !important; }

                    /* Text */
                    p { margin-bottom: 16px !important; }
                    a { color: #0366d6 !important; text-decoration: none !important; }
                    a:hover { text-decoration: underline !important; }
                    strong { color: #24292e !important; font-weight: 600 !important; }

                    /* Lists */
                    ul, ol { padding-left: 2em !important; margin-bottom: 16px !important; }
                    li { color: #24292e !important; }
                    li + li { margin-top: 0.25em !important; }

                    /* Quotes */
                    blockquote {
                        color: #6a737d !important;
                        border-left: 0.25em solid #dfe2e5 !important;
                        padding: 0 1em !important;
                        margin: 0 0 16px 0 !important;
                    }

                    /* Code */
                    code { 
                        background-color: rgba(27,31,35,0.05) !important; 
                        padding: 0.2em 0.4em !important; 
                        border-radius: 3px !important; 
                        font-family: "Fira Code", monospace !important;
                        font-size: 85% !important;
                    }
                    pre {
                        background-color: #f6f8fa !important;
                        padding: 16px !important;
                        overflow: auto !important;
                        border-radius: 3px !important;
                        line-height: 1.45 !important;
                        border: 1px solid #e1e4e8 !important;
                    }
                    pre code {
                        background-color: transparent !important;
                        padding: 0 !important;
                        font-size: 100% !important;
                    }

                    /* Tables */
                    table {
                        display: block !important;
                        width: 100% !important;
                        overflow: auto !important;
                        border-spacing: 0 !important;
                        border-collapse: collapse !important;
                        margin-bottom: 16px !important;
                    }
                    th, td {
                        padding: 6px 13px !important;
                        border: 1px solid #dfe2e5 !important;
                    }
                    tr { background-color: #fff !important; border-top: 1px solid #c6cbd1 !important; }
                    tr:nth-child(2n) { background-color: #f6f8fa !important; }

                    /* HR */
                    hr {
                        height: 0.25em !important;
                        padding: 0 !important;
                        margin: 24px 0 !important;
                        background-color: #e1e4e8 !important;
                        border: 0 !important;
                    }
                    
                    /* Images */
                    img {
                        max-width: 100% !important;
                        box-sizing: content-box !important;
                        background-color: #fff !important;
                    }
                `,
                type: 'builtin'
            },
            {
                id: 'modern',
                name: 'Modern Magazine',
                css: `
                    /* Global */
                    line-height: 2 !important; 
                    letter-spacing: 0.5px !important; 
                    color: #444 !important;
                    background-color: #fff !important;
                    padding: 20px !important;
                    font-family: "Optima", "Microsoft YaHei", sans-serif !important;
                    font-size: 16px !important;

                    /* Headings */
                    h1, h2, h3 { 
                        color: #222 !important;
                        text-align: center !important; 
                        font-variant: small-caps !important; 
                        margin-top: 40px !important;
                        margin-bottom: 20px !important;
                        font-weight: normal !important;
                    }
                    h1 { font-size: 28px !important; border-bottom: 1px solid #ddd !important; padding-bottom: 10px !important; }
                    h2 { font-size: 24px !important; position: relative !important; }
                    h2::after { content: "" !important; display: block !important; width: 40px !important; height: 2px !important; background: #222 !important; margin: 10px auto !important; }

                    /* Text */
                    p { margin-bottom: 1.5em !important; text-align: justify !important; }
                    a { color: #c0392b !important; border-bottom: 1px dotted #c0392b !important; text-decoration: none !important; }
                    strong { color: #c0392b !important; font-weight: normal !important; }

                    /* Lists */
                    ul, ol { padding-left: 0 !important; margin-bottom: 2em !important; text-align: center !important; list-style-position: inside !important; }
                    li { margin-bottom: 0.5em !important; color: #555 !important; }
                    
                    /* Blockquotes */
                    blockquote {
                        font-style: italic !important;
                        font-family: "Georgia", serif !important;
                        color: #777 !important;
                        border-left: none !important;
                        text-align: center !important;
                        margin: 2em 0 !important;
                        font-size: 1.1em !important;
                    }
                    blockquote::before { content: "“" !important; font-size: 3em !important; display: block !important; line-height: 0.5 !important; color: #ddd !important; margin-bottom: 10px !important; }

                    /* Code */
                    code {
                        font-family: monospace !important;
                        color: #c0392b !important;
                        background: #f9f9f9 !important;
                        padding: 2px 5px !important;
                    }

                    /* Tables */
                    table { margin: 2em auto !important; border-collapse: collapse !important; width: 90% !important; }
                    th { border-bottom: 2px solid #222 !important; padding: 10px !important; text-transform: uppercase !important; letter-spacing: 1px !important; font-size: 0.9em !important; }
                    td { border-bottom: 1px solid #eee !important; padding: 10px !important; text-align: center !important; }

                    /* Images */
                    img {
                        display: block !important;
                        margin: 40px auto !important;
                        max-width: 100% !important;
                        box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
                    }
                    
                    /* HR */
                    hr {
                        border: 0 !important;
                        height: 1px !important;
                        background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0)) !important;
                        margin: 3em 0 !important;
                    }
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
