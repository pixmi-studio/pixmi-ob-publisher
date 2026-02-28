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
                css: `
                    /* Basic Reset & Typography - Force override Obsidian defaults */
                    .wechat-container {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        padding: 20px;
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: #fff; /* Ensure white background */
                    }
                    .wechat-container h1, .wechat-container h2, .wechat-container h3 {
                        margin-top: 1.5em;
                        margin-bottom: 0.5em;
                        font-weight: 600;
                        line-height: 1.25;
                        color: #24292e;
                    }
                    .wechat-container h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
                    .wechat-container h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
                    .wechat-container p { margin-top: 0; margin-bottom: 16px; color: #333; }
                    
                    /* Blockquote */
                    .wechat-container blockquote {
                        margin: 0 0 16px !important;
                        padding: 0 1em !important;
                        color: #6a737d !important;
                        border-left: 0.25em solid #dfe2e5 !important;
                        background-color: transparent !important; /* Override potential dark mode bg */
                    }
                    
                    /* Lists */
                    .wechat-container ul, .wechat-container ol { padding-left: 2em; margin-bottom: 16px; }
                    
                    /* Images */
                    .wechat-container img { max-width: 100%; box-sizing: content-box; background-color: #fff; display: block; margin: 1em 0; }
                    
                    /* Code Blocks */
                    .wechat-container pre { 
                        padding: 16px !important; 
                        overflow: auto; 
                        line-height: 1.45; 
                        background-color: #f6f8fa !important; 
                        border-radius: 3px; 
                        border: 1px solid #e1e4e8;
                    }
                    
                    /* Inline Code */
                    .wechat-container code { 
                        padding: 0.2em 0.4em !important; 
                        margin: 0; 
                        font-size: 85%; 
                        background-color: rgba(27,31,35,0.05) !important; 
                        border-radius: 3px; 
                        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace !important;
                        color: #24292e !important;
                    }
                    
                    /* Code inside Pre (Block) - Reset inline styles */
                    .wechat-container pre code { 
                        padding: 0 !important; 
                        margin: 0; 
                        font-size: 100%; 
                        word-break: normal; 
                        white-space: pre; 
                        background: transparent !important; 
                        border: 0; 
                        color: inherit !important;
                    }
                    
                    /* Tables */
                    .wechat-container table { border-spacing: 0; border-collapse: collapse; display: block; width: 100%; overflow: auto; margin-bottom: 16px; }
                    .wechat-container table th, .wechat-container table td { padding: 6px 13px; border: 1px solid #dfe2e5; }
                    .wechat-container table tr { background-color: #fff; border-top: 1px solid #c6cbd1; }
                    .wechat-container table tr:nth-child(2n) { background-color: #f6f8fa; }
                `,
                type: 'builtin'
            },
            {
                id: 'minimalist',
                name: 'Minimalist',
                css: `
@include-when-export url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400&subset=latin,latin-ext);

.wechat-container {
    font-size: 16px;
    font-family: "Open Sans","Clear Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
    color: rgb(51, 51, 51);
    line-height: 1.6;
}

.wechat-container a {
    color: #4183C4;
    text-decoration: none;
}

.wechat-container h1,
.wechat-container h2,
.wechat-container h3,
.wechat-container h4,
.wechat-container h5,
.wechat-container h6 {
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
    line-height: 1.4;
    color: rgb(51, 51, 51);
}

.wechat-container h1 {
    padding-bottom: .3em;
    font-size: 2.25em;
    line-height: 1.2;
    border-bottom: 1px solid #eee;
}

.wechat-container h2 {
    padding-bottom: .3em;
    font-size: 1.5em;
    line-height: 1.225;
    border-bottom: 1px solid #FFBF00;
    text-align: center;
}

.wechat-container blockquote {
    border-left: 4px solid #FFBF00;
    padding: 0 15px;
    color: #777777;
    margin: 0.8em 0;
}

.wechat-container ul,
.wechat-container ol {
    padding-left: 30px;
    margin: 0.8em 0;
}

.wechat-container li {
    margin: 0;
}

.wechat-container table {
    padding: 0;
    word-break: initial;
    width: 100%;
    border-collapse: collapse;
}

.wechat-container table tr {
    border-top: 1px solid #cccccc;
    margin: 0;
    padding: 0;
}

.wechat-container table tr:nth-child(2n) {
    background-color: #f8f8f8;
}

.wechat-container table th,
.wechat-container table td {
    border: 1px solid #cccccc;
    padding: 6px 13px;
}

.wechat-container code {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 2px 4px;
    font-family: Consolas, "Liberation Mono", Courier, monospace;
    font-size: 0.9em;
}

.wechat-container pre {
    background-color: #f8f8f8;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 1rem;
    overflow: auto;
}
                `,
                type: 'builtin'
            },
            {
                id: 'technical',
                name: 'Technical',
                css: `
                    .wechat-container { font-family: "Fira Code", monospace !important; color: #24292e !important; line-height: 1.6 !important; background-color: #fff !important; padding: 20px !important; }
                    .wechat-container p { margin-bottom: 16px !important; color: #24292e !important; }
                    .wechat-container h1 { border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; color: #0366d6 !important; font-size: 2em !important; margin-top: 24px !important; margin-bottom: 16px !important; }
                    .wechat-container h2 { border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; color: #0366d6 !important; font-size: 1.5em !important; margin-top: 24px !important; margin-bottom: 16px !important; }
                    .wechat-container code { background-color: rgba(27,31,35,0.05) !important; padding: 0.2em 0.4em !important; border-radius: 3px !important; color: #0366d6 !important; }
                    .wechat-container pre { background-color: #f6f8fa !important; padding: 16px !important; border-radius: 3px !important; border: 1px solid #e1e4e8 !important; overflow: auto !important; }
                    .wechat-container blockquote { border-left: 0.25em solid #dfe2e5 !important; padding: 0 1em !important; color: #6a737d !important; margin-bottom: 16px !important; }
                    .wechat-container table { border-collapse: collapse !important; width: 100% !important; margin-bottom: 16px !important; }
                    .wechat-container th, .wechat-container td { border: 1px solid #dfe2e5 !important; padding: 6px 13px !important; }
                    .wechat-container tr:nth-child(2n) { background-color: #f6f8fa !important; }
                `,
                type: 'builtin'
            },
            {
                id: 'modern',
                name: 'Modern Magazine',
                css: `
/* Sspai Web Theme - WeChat Compatible */
body {
    font-size: 15px;
    color: #333;
    background: #fff;
    font-family: Helvetica, Arial, "PingFang SC", "Microsoft YaHei", "WenQuanYi Micro Hei", "tohoma,sans-serif";
    margin: 0;
    padding: 10%;
}

h1 {
    font-size: 2.2em;
    font-weight: 700;
    line-height: 1.1;
    padding-top: 16px;
    margin-bottom: 4px;
}

h2,
h3,
h4,
h5,
h6 {
    line-height: 1.5em;
    margin-top: 2.2em;
    margin-bottom: 4px;
}

h2 {
    font-size: 1.4em;
    margin: 40px 10px 20px 0;
    padding-left: 9px;
    border-left: 6px solid #ff7e79;
    font-weight: 700;
    line-height: 1.4;
}

h3 {
    font-weight: 700;
    font-size: 1.2em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px;
}

h4 {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1em;
    line-height: 1.4;
    margin: 10px 0 5px;
    padding-top: 10px
}

h5,
h6 {
    font-size: .9em;
}

h5 {
    font-weight: bold;
    text-transform: uppercase;
}

h6 {
    font-weight: normal;
    color: #AAA;
}

img {
    width: 100%;
    border-radius: 5px;
    display: block;
    margin-bottom: 15px;
    height: auto;
}

dl,
ol,
ul {
    margin-top: 12px;
    margin-bottom: 20px;
    padding-left: 5%;
    line-height: 1.8;
}

p {
    margin: 0 0 20px;
    padding: 0;
    line-height: 1.8;
}

a {
    color: #f22f27;
    text-decoration: none;
}

a:hover {
    color: #f55852;
    text-decoration: underline;
}

a:focus {
    outline-offset: -2px;
}

blockquote {
    font-size: 1em;
    font-style: normal;
    padding: 15px 20px;
    margin: 0 0 15px;
    position: relative;
    line-height: 1.8;
    text-indent: 0;
    border-left: 6px solid #e0e0e0;
    background-color: #f9f2f4;
    color: #888;
}

strong,
dfn {
    font-weight: 700;
}

em,
dfn {
    font-style: italic;
    font-weight: 400;
}

del {
    text-decoration: line-through;
}

pre {
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857;
    word-break: break-all;
    word-wrap: break-word;
    border-radius: 4px;
    white-space: pre-wrap;
    display: block;
    background: #f8f8f8;
    padding: 10px 20px;
    border: none;
    margin-bottom: 25px;
    color: #666;
    font-family: Courier, sans-serif;
}

code {
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    padding: 2px 4px;
    font-size: 90%;
}

p>code {
    color: #c7264e;
    background-color: #f9f2f4;
    font-size: .95em;
    border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
}

figure {
    margin: 1em 0;
}

figcaption {
    font-size: 0.75em;
    padding: 0.5em 2em;
    margin-bottom: 2em;
}

figure img {
    margin-bottom: 0px;
}

hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
}

ol p,
ul p {
    margin-bottom: 0px;
}

li {
    margin-bottom: 0.75em;
    margin-top: 0.75em;
}
                `,
                type: 'builtin'
            },
            {
                id: 'medium-geek',
                name: 'Medium Geek',
                css: `
/* --- Medium + GitHub Style (Optimized) --- */

/* Base Container Typography */
.wechat-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
  color: rgb(51, 51, 51);
  line-height: 1.75;
  padding: 15px 20px !important;
  font-size: 15px !important;
  letter-spacing: 0.5px;
}

/* Links */
.wechat-container a {
  color: #576b95 !important; /* WeChat Standard Blue */
  text-decoration: none;
  border-bottom: 1px solid rgba(87, 107, 149, 0.3);
}

/* Force sans-serif for content elements */
.wechat-container p, 
.wechat-container div {
  font-family: inherit !important;
  color: rgb(51, 51, 51) !important; /* Explicit text color */
}

/* Monospace for code */
.wechat-container code, 
.wechat-container pre {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", "Menlo", "Consolas", monospace !important;
}

/* Lists - Optimized Indentation */
.wechat-container ul {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-inline-start: 28px !important;
}

.wechat-container ol {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-inline-start: 28px !important;
}

.wechat-container li {
  line-height: 1.7 !important; 
  margin-bottom: 6px; 
  color: rgb(51, 51, 51) !important; /* Explicit text color */
  font-weight: 400 !important;
}

/* Nested lists - Using smaller px values for Level 2+ */
.wechat-container li > ul {
  margin-top: 3px !important;
  margin-bottom: 3px !important;
  padding-inline-start: 15px !important;
}

.wechat-container li > ol {
  margin-top: 3px !important;
  margin-bottom: 3px !important;
  padding-inline-start: 25px !important;
}

/* Inline Code */
.wechat-container code {
  background-color: rgba(175, 184, 193, 0.2) !important;
  color: rgb(51, 51, 51) !important;
  font-size: 14px !important;
  padding: 3px 6px !important;
  border-radius: 6px;
  margin: 0 2px;
}

/* Code Blocks */
.wechat-container pre {
  background-color: #f6f8fa !important; /* Slightly deeper grey for contrast */
  border: 1px solid #e1e4e8 !important;
  border-radius: 6px;
  padding: 16px !important;
  margin: 20px 0;
  overflow-x: auto;
}

/* Reset inline code styles inside blocks */
.wechat-container pre code {
  color: rgb(31, 35, 40) !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0;
  border-radius: 0;
  display: block !important;
  white-space: pre !important;
}

/* Headings */
.wechat-container h1, .wechat-container h2, .wechat-container h3, .wechat-container h4 {
  color: rgb(26, 26, 26) !important;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 24px;
  margin-bottom: 16px;
}
.wechat-container h1 { font-size: 22px !important; border-bottom: 1px solid #eaecef; padding-bottom: 5px; }
.wechat-container h2 { font-size: 20px !important; border-bottom: 1px solid #eaecef; padding-bottom: 5px; }
.wechat-container h3 { font-size: 18px !important; }
.wechat-container h4 { font-size: 16px !important; font-weight: bold; }

/* Blockquotes */
.wechat-container blockquote {
  border-left: 4px solid #d0d7de !important;
  color: rgb(101, 109, 118) !important;
  padding: 12px 16px !important; /* Increased vertical padding */
  margin: 24px 0 !important;
  font-style: normal;
  background-color: #f8f9fa !important; /* Added subtle background */
  border-radius: 0 6px 6px 0;
}


/* Tables */
.wechat-container table {
    font-size: 14px !important;
    border-collapse: collapse;
    width: 100%;
    margin: 24px 0;
    border: 1px solid #dfe2e5;
    display: block;
    overflow-x: auto;
}
.wechat-container th {
    background-color: #f6f8fa !important;
    font-weight: 600;
    border: 1px solid #dfe2e5;
    padding: 10px 13px;
    text-align: left;
}
.wechat-container td {
    border: 1px solid #dfe2e5;
    padding: 8px 13px;
    line-height: 1.5;
    color: rgb(51, 51, 51);
}

/* Images */
.wechat-container img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 25px auto;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* Horizontal Rule */
.wechat-container hr {
    height: 1px;
    padding: 0;
    margin: 32px 0;
    background-color: #e1e4e8;
    border: 0;
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