import { App, PluginSettingTab, Setting, Notice, Modal, TextAreaComponent, ButtonComponent } from 'obsidian';
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

    new Setting(containerEl)
      .setName('API Proxy URL')
      .setDesc('Optional: Use a proxy to bypass WeChat IP whitelist (e.g., https://your-proxy.com). Leave empty to use direct connection.')
      .addText((text) =>
        text
          .setPlaceholder('https://your-proxy.com')
          .setValue(this.plugin.settings.proxyUrl)
          .onChange(async (value) => {
            this.plugin.settings.proxyUrl = value.trim();
            if (this.plugin.settings.proxyUrl && !this.plugin.settings.proxyUrl.endsWith('/')) {
                // We don't necessarily need to add a slash here, depends on implementation in apiClient
            }
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Test Connection')
      .setDesc('Test if your AppID and AppSecret are correct')
      .addButton((button) =>
        button
          .setButtonText('Test Connection')
          .setCta()
          .onClick(async () => {
            try {
              this.plugin.logger.log('Testing connection...');
              await this.plugin.apiClient.getAccessToken();
              new Notice('Connection successful!');
              this.plugin.logger.log('Connection test successful');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : String(error);
              new Notice(`Connection failed: ${errorMessage}`);
              this.plugin.logger.log(`Connection test failed: ${errorMessage}`, 'ERROR');
            }
          })
      );

    containerEl.createEl('h3', { text: 'Troubleshooting' });

    new Setting(containerEl)
      .setName('Plugin Logs')
      .setDesc('View and copy plugin logs for debugging')
      .addButton((button) =>
        button
          .setButtonText('Show Logs')
          .onClick(async () => {
            const logs = await this.plugin.logger.getLogContent();
            new LogModal(this.app, logs, this.plugin).open();
          })
      );
  }
}

class LogModal extends Modal {
    private logs: string;
    private plugin: PixmiObPublisher;

    constructor(app: App, logs: string, plugin: PixmiObPublisher) {
        super(app);
        this.logs = logs;
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Pixmi Publisher Logs' });

        const textArea = new TextAreaComponent(contentEl)
            .setValue(this.logs)
            .setDisabled(true);
        
        textArea.inputEl.style.width = '100%';
        textArea.inputEl.style.height = '300px';
        textArea.inputEl.style.fontFamily = 'monospace';

        const buttonContainer = contentEl.createDiv();
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        new ButtonComponent(buttonContainer)
            .setButtonText('Copy to Clipboard')
            .onClick(() => {
                navigator.clipboard.writeText(this.logs);
                new Notice('Logs copied to clipboard');
            });

        new ButtonComponent(buttonContainer)
            .setButtonText('Clear Logs')
            .setWarning()
            .onClick(async () => {
                await this.plugin.logger.clearLogs();
                this.close();
                new Notice('Logs cleared');
            });
            
        new ButtonComponent(buttonContainer)
            .setButtonText('Close')
            .onClick(() => {
                this.close();
            });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}