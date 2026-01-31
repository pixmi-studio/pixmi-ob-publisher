import { App, Plugin, PluginManifest, Notice, MarkdownView, TFile, FuzzySuggestModal, setIcon } from 'obsidian';
import { PixmiSettings, DEFAULT_SETTINGS } from './settings';
import { PixmiSettingTab } from './settings-tab';
import { WeChatApiClient } from './wechat-api';
import { Publisher } from './publisher';
import { MarkdownParser } from './markdown-parser';
import { LogManager } from './logger';
import { ThemeManager, Theme } from './themes';
import { ThemeSwitcher } from './theme-switcher';
import { StyleInjector } from './style-injector';
import { PreviewWindowManager } from './preview-window-manager';
import { WeChatPreviewView, VIEW_TYPE_WECHAT_PREVIEW } from './preview-view';
import { CssConverter } from './css-converter';

export default class PixmiObPublisher extends Plugin {
  settings: PixmiSettings;
  apiClient: WeChatApiClient;
  publisher: Publisher;
  logger: LogManager;
  themeManager: ThemeManager;
  themeSwitcher: ThemeSwitcher;
  styleInjector: StyleInjector;
  previewWindowManager: PreviewWindowManager;
  markdownParser: MarkdownParser;
  statusBarItem: HTMLElement;
  cssConverter: CssConverter;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
  }

  lastActiveMarkdownView: MarkdownView | null = null;

  async onload() {
    await this.loadSettings();

    this.logger = new LogManager(this.app, this.manifest);
    this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret, this.settings.proxyUrl, this.logger);
    this.markdownParser = new MarkdownParser();
    this.publisher = new Publisher(this.apiClient, this.markdownParser);
    this.themeManager = new ThemeManager(this.app);
    this.themeSwitcher = new ThemeSwitcher(this.app);
    this.styleInjector = new StyleInjector(this.app);
    this.previewWindowManager = new PreviewWindowManager(this.app, this.styleInjector);
    this.cssConverter = new CssConverter();

    this.registerView(
      VIEW_TYPE_WECHAT_PREVIEW,
      (leaf) => new WeChatPreviewView(leaf)
    );

    await this.themeManager.loadThemes();

    this.statusBarItem = this.addStatusBarItem();
    this.updateStatusBar();

    this.registerEvent(
        this.app.workspace.on('active-leaf-change', (leaf) => {
            if (leaf && leaf.view instanceof MarkdownView) {
                this.lastActiveMarkdownView = leaf.view;
            }
            this.updateStatusBar();
            this.updatePreview();
        })
    );
    this.registerEvent(
        this.app.workspace.on('layout-change', () => {
             // Optional: handle layout changes if needed
        })
    );
    this.registerEvent(
        this.app.metadataCache.on('changed', (file) => {
            // Check if the changed file matches our last active view
            if (this.lastActiveMarkdownView && this.lastActiveMarkdownView.file === file) {
                this.updateStatusBar();
                this.updatePreview();
            }
        })
    );

    this.addSettingTab(new PixmiSettingTab(this.app, this));

    this.registerEvent(
        this.app.workspace.on('editor-change', () => {
            this.updatePreview();
        })
    );

    this.addRibbonIcon('paper-plane', 'Publish to WeChat', async (evt: MouseEvent) => {
        await this.publishCurrentNote();
    });

    this.addCommand({
        id: 'publish-to-wechat',
        name: 'Publish to WeChat',
        checkCallback: (checking: boolean) => {
            const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (markdownView) {
                if (!checking) {
                    this.publishCurrentNote();
                }
                return true;
            }
            return false;
        }
    });

    this.addCommand({
        id: 'open-wechat-preview',
        name: 'Open WeChat Publisher Preview',
        callback: async () => {
            // Ensure we capture the current view before opening the window
            const activeLeaf = this.app.workspace.getLeaf(false);
            if (activeLeaf && activeLeaf.view instanceof MarkdownView) {
                this.lastActiveMarkdownView = activeLeaf.view;
            }
            
            await this.previewWindowManager.openPreview();
            // Force an update immediately after opening
            this.updatePreview();
        }
    });

    this.addCommand({
        id: 'switch-wechat-theme',
        name: 'Switch WeChat Theme',
        checkCallback: (checking: boolean) => {
            const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView) || this.lastActiveMarkdownView;
            if (markdownView && markdownView instanceof MarkdownView) {
                if (!checking) {
                    new ThemeSuggester(this.app, this.themeManager, async (theme) => {
                        await this.themeSwitcher.setTheme(markdownView.file!, theme.id);
                        new Notice(`Theme switched to: ${theme.name}`);
                        this.updatePreview(); // Force update after switch
                    }).open();
                }
                return true;
            }
            return false;
        }
    });

    this.logger.log('PixmiObPublisher loaded');
    
    // Ensure the preview window is closed on startup, preventing layout restoration from keeping it open
    this.previewWindowManager.closePreview();
  }

  async publishCurrentNote() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
        new Notice('No active Markdown view.');
        return;
    }

    const activeFile = activeView.file;
    if (!activeFile) { // Should not happen if view is active
        new Notice('No active file.');
        return;
    }

    const markdown = activeView.getViewData();
    const title = activeFile.basename;
    
    // Extract info from frontmatter
    const fileCache = this.app.metadataCache.getFileCache(activeFile);
    const frontmatter = fileCache?.frontmatter;
    const thumbnailPath = frontmatter?.thumb || frontmatter?.thumbnail;
    const themeId = frontmatter?.['pixmi-theme'] || 'default';
    const theme = this.themeManager.getTheme(themeId);
    const themeCss = theme ? theme.css : '';
    console.log(`[Pixmi] Publishing with Theme: ${themeId}, CSS Length: ${themeCss.length}`);

    new Notice(`Publishing: ${title}...`);
    this.logger.log(`Starting publication for: ${title} with theme: ${themeId}`);

    try {
        const draftId = await this.publisher.publish(title, markdown, async (path: string) => {
            const file = this.app.metadataCache.getFirstLinkpathDest(path, activeFile.path);
            if (!file) {
                throw new Error(`Image not found: ${path}. Please ensure the image exists in your vault.`);
            }
            return await this.app.vault.readBinary(file);
        }, thumbnailPath, themeCss);
        
        new Notice(`Successfully published! Draft ID: ${draftId}`);
        this.logger.log(`Successfully published draft: ${draftId}`);
    } catch (error) {
        this.logger.log(`Publishing failed: $Failed to edit, 0 occurrences found for old_string (  // ... (publishCurrentNote remains same)\n\n  onunload(){\n    if (this.previewWindowManager) {\n        this.previewWindowManager.closePreview();\n    }\n    if (this.logger) {\n        this.logger.log('PixmiObPublisher unloaded');\n    }\n  }\n\n  async loadSettings() {\n    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());\n  }). Original old_string was (  // ... (publishCurrentNote remains same)\n\n  onunload(){\n    if (this.previewWindowManager) {\n        this.previewWindowManager.closePreview();\n    }\n    if (this.logger) {\n        this.logger.log('PixmiObPublisher unloaded');\n    }\n  }\n\n  async loadSettings() {\n    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());\n  }) in /Users/shengu/projects/pixmi-ob-publisher/src/main.ts. No edits made. The exact text in old_string was not found. Ensure you're not escaping content incorrectly and check whitespace, indentation, and context. Use read_file tool to verify.`, 'ERROR');
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
            if (errorMessage.includes('40001') || errorMessage.includes('invalid credential')) {
                errorMessage = 'Invalid AppID or AppSecret. Please check your settings.';
            } else if (errorMessage.includes('40164')) {
                errorMessage = 'IP not whitelisted. Please add your IP to WeChat Official Account whitelist.';
            }
        }
        new Notice(`Publishing failed: ${errorMessage}`);
    }
  }

  onunload() {
    if (this.previewWindowManager) {
        this.previewWindowManager.closePreview();
    }
    if (this.logger) {
        this.logger.log('PixmiObPublisher unloaded');
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  updateStatusBar() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView || !activeView.file) {
        this.statusBarItem.empty();
        return;
    }

    const themeId = this.themeSwitcher.getTheme(activeView.file);
    const theme = themeId ? this.themeManager.getTheme(themeId) : null;
    const themeName = theme ? theme.name : 'Default';

    this.statusBarItem.empty();
    this.statusBarItem.addClass('mod-clickable');
    setIcon(this.statusBarItem, 'palette');
    this.statusBarItem.createSpan({ text: `  ${themeName}` });
    
    this.statusBarItem.onclick = () => {
        new ThemeSuggester(this.app, this.themeManager, async (theme) => {
            await this.themeSwitcher.setTheme(activeView.file!, theme.id);
            this.updateStatusBar();
            // this.refreshPreviewStyle(); // Legacy
            this.updatePreview();
            new Notice(`Theme switched to: ${theme.name}`);
        }).open();
    };
  }

  updatePreview() {
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView) || this.lastActiveMarkdownView;
    if (!activeView || !activeView.file) {
        return;
    }

    const markdown = activeView.getViewData();
    const imagePaths = this.markdownParser.extractImages(markdown);
    const urlMap = new Map<string, string>();

    imagePaths.forEach(path => {
        const file = this.app.metadataCache.getFirstLinkpathDest(path, activeView.file!.path);
        if (file) {
            const resourcePath = this.app.vault.adapter.getResourcePath(file.path);
            urlMap.set(path, resourcePath);
        }
    });

    let html = this.markdownParser.renderWithReplacements(markdown, urlMap);
    
    const themeId = this.themeSwitcher.getTheme(activeView.file) || 'default';
    const theme = this.themeManager.getTheme(themeId);
    
    if (theme) {
        // Use CssConverter to inline styles, exactly like the publisher does
        html = this.cssConverter.convert(html, theme.css);
    }

    this.previewWindowManager.updateContent(html);
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Update API client when settings change
    if (this.apiClient) {
        this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret, this.settings.proxyUrl, this.logger);
        // Re-instantiate publisher to use new client
        this.publisher = new Publisher(this.apiClient, new MarkdownParser());
    }
  }
}

class ThemeSuggester extends FuzzySuggestModal<Theme> {
    private themeManager: ThemeManager;
    private onSelect: (theme: Theme) => void;

    constructor(app: App, themeManager: ThemeManager, onSelect: (theme: Theme) => void) {
        super(app);
        this.themeManager = themeManager;
        this.onSelect = onSelect;
    }

    getItems(): Theme[] {
        return this.themeManager.getAllThemes();
    }

    getItemText(theme: Theme): string {
        return theme.name;
    }

    onChooseItem(theme: Theme, evt: MouseEvent | KeyboardEvent): void {
        this.onSelect(theme);
    }
}