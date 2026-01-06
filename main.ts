import { App, Plugin, PluginManifest } from 'obsidian';
import { PixmiSettings, DEFAULT_SETTINGS } from './settings';
import { PixmiSettingTab } from './settings-tab';

export default class PixmiObPublisher extends Plugin {
  settings: PixmiSettings;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.settings = DEFAULT_SETTINGS;
  }

  async onload() {
    await this.loadSettings();

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
  }
}