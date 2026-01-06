import { App, Plugin, PluginManifest } from 'obsidian';
import { PixmiSettings, DEFAULT_SETTINGS } from './settings';
import { PixmiSettingTab } from './settings-tab';
import { WeChatApiClient } from './wechat-api';

export default class PixmiObPublisher extends Plugin {
  settings: PixmiSettings;
  apiClient: WeChatApiClient;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
  }

  async onload() {
    await this.loadSettings();

    this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret);

    this.addSettingTab(new PixmiSettingTab(this.app, this));

    console.log('PixmiObPublisher loaded');
  }

  onunload() {
    console.log('PixmiObPublisher unloaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // Update API client when settings change
    if (this.apiClient) {
        this.apiClient = new WeChatApiClient(this.settings.appId, this.settings.appSecret);
    }
  }
}