import { App, Plugin, PluginManifest, Notice, MarkdownView, TFile, FuzzySuggestModal } from 'obsidian';
import { PixmiSettings, DEFAULT_SETTINGS } from './settings';
import { PixmiSettingTab } from './settings-tab';
import { WeChatApiClient } from './wechat-api';
import { Publisher } from './publisher';
import { MarkdownParser } from './markdown-parser';
import { LogManager } from './logger';
import { ThemeManager, Theme } from './themes';
import { ThemeSwitcher } from './theme-switcher';

export default class PixmiObPublisher extends Plugin {
  settings: PixmiSettings;
  apiClient: WeChatApiClient;
  publisher: Publisher;
  logger: LogManager;
  themeManager: ThemeManager;
  themeSwitcher: ThemeSwitcher;
  statusBarItem: HTMLElement;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
  }

  async onload() {
    await this.loadSettings();

    this.logger = new LogManager(this.app, this.manifest);
    this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret, this.settings.proxyUrl, this.logger);
    this.publisher = new Publisher(this.apiClient, new MarkdownParser());
    this.themeManager = new ThemeManager(this.app);
    this.themeSwitcher = new ThemeSwitcher(this.app);

    await this.themeManager.loadThemes();

    this.statusBarItem = this.addStatusBarItem();
    this.updateStatusBar();

    this.registerEvent(
        this.app.workspace.on('active-leaf-change', () => this.updateStatusBar())
    );
    this.registerEvent(
        this.app.metadataCache.on('changed', (file) => {
            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (activeView && activeView.file === file) {
                this.updateStatusBar();
            }
        })
    );

    this.addSettingTab(new PixmiSettingTab(this.app, this));

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
        id: 'switch-wechat-theme',
        name: 'Switch WeChat Theme',
        checkCallback: (checking: boolean) => {
            const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (markdownView) {
                if (!checking) {
                    new ThemeSuggester(this.app, this.themeManager, async (theme) => {
                        await this.themeSwitcher.setTheme(markdownView.file!, theme.id);
                        new Notice(`Theme switched to: ${theme.name}`);
                    }).open();
                }
                return true;
            }
            return false;
        }
    });

    this.logger.log('PixmiObPublisher loaded');
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
    
    // Extract thumbnail from frontmatter
    const fileCache = this.app.metadataCache.getFileCache(activeFile);
    const frontmatter = fileCache?.frontmatter;
    const thumbnailPath = frontmatter?.thumb || frontmatter?.thumbnail;

    new Notice(`Publishing: ${title}...`);
    this.logger.log(`Starting publication for: ${title}`);

    try {
        const draftId = await this.publisher.publish(title, markdown, async (path: string) => {
            const file = this.app.metadataCache.getFirstLinkpathDest(path, activeFile.path);
            if (!file) {
                throw new Error(`Image not found: ${path}. Please ensure the image exists in your vault.`);
            }
            return await this.app.vault.readBinary(file);
        }, thumbnailPath);
        
        new Notice(`Successfully published! Draft ID: ${draftId}`);
        this.logger.log(`Successfully published draft: ${draftId}`);
    } catch (error) {
        this.logger.log(`Publishing failed: ${error}`, 'ERROR');
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
        this.statusBarItem.setText('');
        return;
    }

    const themeId = this.themeSwitcher.getTheme(activeView.file);
    const theme = themeId ? this.themeManager.getTheme(themeId) : null;
    const themeName = theme ? theme.name : 'Default';

    this.statusBarItem.setText(`WeChat Theme: ${themeName}`);
    this.statusBarItem.onclick = () => {
        new ThemeSuggester(this.app, this.themeManager, async (theme) => {
            await this.themeSwitcher.setTheme(activeView.file!, theme.id);
            this.updateStatusBar();
            new Notice(`Theme switched to: ${theme.name}`);
        }).open();
    };
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