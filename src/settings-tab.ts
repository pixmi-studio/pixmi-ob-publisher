import { App, PluginSettingTab, Setting } from 'obsidian';
import PixmiObPublisher from './main';

export class PixmiSettingTab extends PluginSettingTab {
  plugin: PixmiObPublisher;

  constructor(app: App, plugin: PixmiObPublisher) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Pixmi Obsidian WeChat Publisher Settings' });

    new Setting(containerEl)
      .setName('WeChat AppID')
      .setDesc('Your WeChat Official Account AppID')
      .addText((text) =>
        text
          .setPlaceholder('Enter your AppID')
          .setValue(this.plugin.settings.appId)
          .onChange(async (value) => {
            this.plugin.settings.appId = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('WeChat AppSecret')
      .setDesc('Your WeChat Official Account AppSecret')
      .addText((text) =>
        text
          .setPlaceholder('Enter your AppSecret')
          .setValue(this.plugin.settings.appSecret)
          .onChange(async (value) => {
            this.plugin.settings.appSecret = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
