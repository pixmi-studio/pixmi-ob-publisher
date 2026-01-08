import { App, Plugin, PluginManifest, Notice, MarkdownView, TFile } from 'obsidian';
import { PixmiSettings, DEFAULT_SETTINGS } from './settings';
import { PixmiSettingTab } from './settings-tab';
import { WeChatApiClient } from './wechat-api';
import { Publisher } from './publisher';
import { MarkdownParser } from './markdown-parser';
import { LogManager } from './logger';

export default class PixmiObPublisher extends Plugin {
  settings: PixmiSettings;
  apiClient: WeChatApiClient;
  publisher: Publisher;
  logger: LogManager;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
  }

  async onload() {
    await this.loadSettings();

    this.logger = new LogManager(this.app, this.manifest);
    this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret, this.logger);
    this.publisher = new Publisher(this.apiClient, new MarkdownParser());

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

    new Notice(`Publishing: ${title}...`);
    this.logger.log(`Starting publication for: ${title}`);

    try {
        const draftId = await this.publisher.publish(title, markdown, async (path: string) => {
            const file = this.app.metadataCache.getFirstLinkpathDest(path, activeFile.path);
            if (!file) {
                throw new Error(`Image not found: ${path}`);
            }
            return await this.app.vault.readBinary(file);
        });
        
        new Notice(`Successfully published! Draft ID: ${draftId}`);
        this.logger.log(`Successfully published draft: ${draftId}`);
    } catch (error) {
        this.logger.log(`Publishing failed: ${error}`, 'ERROR');
        new Notice(`Publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  async saveSettings() {
    await this.saveData(this.settings);
    // Update API client when settings change
    if (this.apiClient) {
        this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret, this.logger);
        // Re-instantiate publisher to use new client
        this.publisher = new Publisher(this.apiClient, new MarkdownParser());
    }
  }
}