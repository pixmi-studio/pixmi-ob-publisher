import { App, TFile } from 'obsidian';

export class ThemeSwitcher {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    /**
     * Sets the theme for a specific file by updating its frontmatter.
     */
    async setTheme(file: TFile, themeId: string): Promise<void> {
        await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
            frontmatter['pixmi-theme'] = themeId;
        });
    }

    /**
     * Gets the current theme id for a file from its frontmatter.
     */
    getTheme(file: TFile): string | undefined {
        const cache = this.app.metadataCache.getFileCache(file);
        return cache?.frontmatter?.['pixmi-theme'];
    }
}
