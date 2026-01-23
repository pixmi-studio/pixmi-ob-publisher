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
:root {
    --side-bar-bg-color: #fafafa;
    --control-text-color: #777;
}

@include-when-export url(https://fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,700,400&subset=latin,latin-ext);

@font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: normal;
    src: local('Open Sans Regular'),url('./github/400.woff') format('woff')
}

@font-face {
    font-family: 'Open Sans';
    font-style: italic;
    font-weight: normal;
    src: local('Open Sans Italic'),url('./github/400i.woff') format('woff')
}

@font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: bold;
    src: local('Open Sans Bold'),url('./github/700.woff') format('woff')
}

@font-face {
    font-family: 'Open Sans';
    font-style: italic;
    font-weight: bold;
    src: local('Open Sans Bold Italic'),url('./github/700i.woff') format('woff')
}

html {
    font-size: 16px;
}

body {
    font-family: "Open Sans","Clear Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
    color: rgb(51, 51, 51);
    line-height: 1.6;
}

#write{
    max-width: 860px;
  	margin: 0 auto;
  	padding: 20px 30px 40px 30px;
	padding-top: 20px;
    padding-bottom: 100px;
}
#write > ul:first-child,
#write > ol:first-child{
    margin-top: 30px;
}

body > *:first-child {
    margin-top: 0 !important;
}
body > *:last-child {
    margin-bottom: 0 !important;
}
a {
    color: #4183C4;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    position: relative;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: bold;
    line-height: 1.4;
    cursor: text;
}
h1:hover a.anchor,
h2:hover a.anchor,
h3:hover a.anchor,
h4:hover a.anchor,
h5:hover a.anchor,
h6:hover a.anchor {
    text-decoration: none;
}
h1 tt,
h1 code {
    font-size: inherit;
}
h2 tt,
h2 code {
    font-size: inherit;
}
h3 tt,
h3 code {
    font-size: inherit;
}
h4 tt,
h4 code {
    font-size: inherit;
}
h5 tt,
h5 code {
    font-size: inherit;
}
h6 tt,
h6 code {
    font-size: inherit;
}
h1 {
    padding-bottom: .3em;
    font-size: 2.25em;
    line-height: 1.2;
    border-bottom: 1px solid #eee;
}
h2 {
    padding-bottom: .3em;
     font-size: 1.5em;
     line-height: 1.225;
     border-bottom: 1px solid #FFBF00;
     text-align: center
 }
h3 {
    font-size: 1.5em;
    line-height: 1.43;
}
h4 {
    font-size: 1.25em;
}
h5 {
    font-size: 1em;
}
h6 {
   font-size: 1em;
    color: #777;
}

blockquote,
ul,
ol,
dl,
table{
    margin: 0.8em 0;
}

p {
    margin: 0.8em 0.5em;
    line-height: 1.5em;
}

li>ol,
li>ul {
    margin: 0 0;
}
hr {
    height: 4px;
    padding: 0;
    margin: 16px 0;
    background-color: #e7e7e7;
    border: 0 none;
    overflow: hidden;
    box-sizing: content-box;
    border-bottom: 1px solid #ddd;
}

body > h2:first-child {
    margin-top: 0;
    padding-top: 0;
}
body > h1:first-child {
    margin-top: 0;
    padding-top: 0;
}
body > h1:first-child + h2 {
    margin-top: 0;
    padding-top: 0;
}
body > h3:first-child,
body > h4:first-child,
body > h5:first-child,
body > h6:first-child {
    margin-top: 0;
    padding-top: 0;
}
a:first-child h1,
a:first-child h2,
a:first-child h3,
a:first-child h4,
a:first-child h5,
a:first-child h6 {
    margin-top: 0;
    padding-top: 0;
}
h1 p,
h2 p,
h3 p,
h4 p,
h5 p,
h6 p {
    margin-top: 0;
}
li p.first {
    display: inline-block;
}
ul,
ol {
    padding-left: 30px;
}
ul:first-child,
ol:first-child {
    margin-top: 0;
}
ul:last-child,
ol:last-child {
    margin-bottom: 0;
}
blockquote {
    border-left: 4px solid #FFBF00;
    padding: 0 15px;
    color: #777777;
}
blockquote blockquote {
    padding-right: 0;
}
table {
    padding: 0;
    word-break: initial;
}
table tr {
    border-top: 1px solid #cccccc;
    margin: 0;
    padding: 0;
}
table tr:nth-child(2n) {
    background-color: #f8f8f8;
}
table tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}
table tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
}
table tr th:first-child,
table tr td:first-child {
    margin-top: 0;
}
table tr th:last-child,
table tr td:last-child {
    margin-bottom: 0;
}

.CodeMirror-gutters {
    border-right: 1px solid #ddd;
}

.md-fences,
code,
tt {
    border: 1px solid #ddd;
    background-color: #f8f8f8;
    border-radius: 3px;
    padding: 0;
    font-family: Consolas, "Liberation Mono", Courier, monospace;
    padding: 2px 4px 0px 4px;
    font-size: 0.9em;
}

.md-fences {
    margin-bottom: 15px;
    margin-top: 15px;
    padding: 0.2em 1em;
    padding-top: 8px;
    padding-bottom: 6px;
}
.task-list{
	padding-left: 0;
}

.task-list-item {
	padding-left:32px;
}

.task-list-item input {
  top: 3px;
  left: 8px;
}

@media screen and (min-width: 914px) {
    /*body {
        width: 854px;
        margin: 0 auto;
    }*/
}
@media print {
    html {
        font-size: 13px;
    }
    table,
    pre {
        page-break-inside: avoid;
    }
    pre {
        word-wrap: break-word;
    }
}

.md-fences {
	background-color: #f8f8f8;
}
#write pre.md-meta-block {
	padding: 1rem;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f7f7f7;
    border: 0;
    border-radius: 3px;
    color: #777777;
    margin-top: 0 !important;
}

.mathjax-block>.code-tooltip {
	bottom: .375rem;
}

.md-image>.md-meta {
    border: 1px solid #ddd;
    border-radius: 3px;
    font-family: Consolas, "Liberation Mono", Courier, monospace;
    padding: 2px 4px 0px 4px;
    font-size: 0.9em;
    color: inherit;
}

.md-tag{
	color: inherit;
}

.md-toc { 
    margin-top:20px;
    padding-bottom:20px;
}

.sidebar-tabs {
    border-bottom: none;
}

#typora-quick-open {
    border: 1px solid #ddd;
    background-color: #f8f8f8;
}

#typora-quick-open-item {
    background-color: #FAFAFA;
    border-color: #FEFEFE #e5e5e5 #e5e5e5 #eee;
    border-style: solid;
    border-width: 1px;
}

/** focus mode */
.on-focus-mode blockquote {
    border-left-color: rgba(85, 85, 85, 0.12);
}

header, .context-menu, .megamenu-content, footer{
    font-family: "Segoe UI", "Arial", sans-serif;
}

.file-node-content:hover .file-node-icon,
.file-node-content:hover .file-node-open-state{
    visibility: visible;
}

.mac-seamless-mode #typora-sidebar {
    background-color: #fafafa;
    background-color: var(--side-bar-bg-color);
}

.md-lang {
    color: #b4654d;
}
                `,
                type: 'builtin'
            },
            {
                id: 'technical',
                name: 'Technical',
                css: `
                    .pixmi-preview-container { font-family: "Fira Code", monospace !important; color: #24292e !important; line-height: 1.6 !important; background-color: #fff !important; padding: 20px !important; }
                    .pixmi-preview-container p { margin-bottom: 16px !important; color: #24292e !important; }
                    .pixmi-preview-container h1 { border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; color: #0366d6 !important; font-size: 2em !important; margin-top: 24px !important; margin-bottom: 16px !important; }
                    .pixmi-preview-container h2 { border-bottom: 1px solid #eaecef !important; padding-bottom: 0.3em !important; color: #0366d6 !important; font-size: 1.5em !important; margin-top: 24px !important; margin-bottom: 16px !important; }
                    .pixmi-preview-container code { background-color: rgba(27,31,35,0.05) !important; padding: 0.2em 0.4em !important; border-radius: 3px !important; color: #0366d6 !important; }
                    .pixmi-preview-container pre { background-color: #f6f8fa !important; padding: 16px !important; border-radius: 3px !important; border: 1px solid #e1e4e8 !important; overflow: auto !important; }
                    .pixmi-preview-container blockquote { border-left: 0.25em solid #dfe2e5 !important; padding: 0 1em !important; color: #6a737d !important; margin-bottom: 16px !important; }
                    .pixmi-preview-container table { border-collapse: collapse !important; width: 100% !important; margin-bottom: 16px !important; }
                    .pixmi-preview-container th, .pixmi-preview-container td { border: 1px solid #dfe2e5 !important; padding: 6px 13px !important; }
                    .pixmi-preview-container tr:nth-child(2n) { background-color: #f6f8fa !important; }
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
    background-color: #f9f9f9;
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