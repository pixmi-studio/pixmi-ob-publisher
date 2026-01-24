import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeSwitcher } from '../src/theme-switcher';

describe('ThemeSwitcher', () => {
    let themeSwitcher: ThemeSwitcher;
    let mockApp: any;

    beforeEach(() => {
        mockApp = {
            fileManager: {
                processFrontMatter: vi.fn()
            }
        };
        themeSwitcher = new ThemeSwitcher(mockApp);
    });

    it('should update the frontmatter with the new theme', async () => {
        const mockFile = { path: 'note.md' };
        await themeSwitcher.setTheme(mockFile as any, 'technical');

        expect(mockApp.fileManager.processFrontMatter).toHaveBeenCalledWith(
            mockFile,
            expect.any(Function)
        );

        // 验证回调逻辑
        const callback = mockApp.fileManager.processFrontMatter.mock.calls[0][1];
        const frontmatter = {};
        callback(frontmatter);
        expect((frontmatter as any)['pixmi-theme']).toBe('technical');
    });

    it('should read the current theme from frontmatter placeholder', () => {
        // 由于读取 frontmatter 通常通过 app.metadataCache，
        // 这里我们主要测试 ThemeSwitcher 的辅助方法（如果有）
    });
});
