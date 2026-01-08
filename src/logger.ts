import { App, PluginManifest, FileSystemAdapter } from 'obsidian';

export class LogManager {
  private app: App;
  private manifest: PluginManifest;
  private logFileName: string = 'plugin.log';

  constructor(app: App, manifest: PluginManifest) {
    this.app = app;
    this.manifest = manifest;
  }

  private getLogFilePath(): string {
    return `${this.manifest.dir}/${this.logFileName}`;
  }

  async log(message: string, level: 'INFO' | 'ERROR' = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    const path = this.getLogFilePath();

    try {
      if (await this.app.vault.adapter.exists(path)) {
        await this.app.vault.adapter.append(path, logEntry);
      } else {
        await this.app.vault.adapter.write(path, logEntry);
      }
      
      // Also log to console for development
      if (level === 'ERROR') {
        console.error(message);
      } else {
        console.log(message);
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  async getLogContent(): Promise<string> {
    const path = this.getLogFilePath();
    if (await this.app.vault.adapter.exists(path)) {
      return await this.app.vault.adapter.read(path);
    }
    return 'No logs found.';
  }

  async clearLogs() {
    const path = this.getLogFilePath();
    if (await this.app.vault.adapter.exists(path)) {
        await this.app.vault.adapter.write(path, '');
    }
  }
}
