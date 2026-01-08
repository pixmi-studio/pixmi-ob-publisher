import { describe, it, expect, beforeEach } from 'vitest';
import { Theme, ThemeType, IThemeManager } from '../src/themes';
import { ThemeManager } from '../src/themes';

describe('ThemeManager', () => {
    let themeManager: ThemeManager;

    beforeEach(() => {
        themeManager = new ThemeManager();
    });

    it('should have builtin themes after loading', async () => {
        await themeManager.loadThemes();
        const themes = themeManager.getAllThemes();
        
        expect(themes.length).toBeGreaterThanOrEqual(3);
        const ids = themes.map(t => t.id);
        expect(ids).toContain('minimalist');
        expect(ids).toContain('technical');
        expect(ids).toContain('modern-magazine');
    });

    it('should get a specific theme by id', async () => {
        await themeManager.loadThemes();
        const theme = themeManager.getTheme('minimalist');
        
        expect(theme).toBeDefined();
        expect(theme?.id).toBe('minimalist');
        expect(theme?.name).toBe('Minimalist');
    });
});
