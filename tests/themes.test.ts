import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager } from '../src/themes';

describe('ThemeManager', () => {
    let themeManager: ThemeManager;
    let mockApp: any;
    let mockAdapter: any;

    beforeEach(() => {
        mockAdapter = {
            exists: vi.fn(),
            mkdir: vi.fn(),
            list: vi.fn(),
            read: vi.fn(),
        };

        mockApp = {
            vault: {
                adapter: mockAdapter
            }
        };

        themeManager = new ThemeManager(mockApp as any);
    });

    it('should have builtin themes after loading', async () => {
        mockAdapter.exists.mockResolvedValue(true);
        mockAdapter.list.mockResolvedValue({ files: [], folders: [] });

        await themeManager.loadThemes();
        const themes = themeManager.getAllThemes();
        
        expect(themes.length).toBeGreaterThanOrEqual(3);
        const ids = themes.map(t => t.id);
        expect(ids).toContain('minimalist');
        expect(ids).toContain('technical');
        expect(ids).toContain('modern');
    });

    it('should load custom themes from the specific directory', async () => {
        mockAdapter.exists.mockResolvedValue(true);
        mockAdapter.list.mockResolvedValue({ 
            files: ['.obsidian/pixmi-themes/custom-theme.css'], 
            folders: [] 
        });
        mockAdapter.read.mockResolvedValue('.custom { color: red; }');

        await themeManager.loadThemes();
        
        const theme = themeManager.getTheme('custom-theme');
        expect(theme).toBeDefined();
        expect(theme?.name).toBe('Custom Theme');
        expect(theme?.css).toBe('.custom { color: red; }');
        expect(theme?.type).toBe('custom');
    });

    it('should create the custom themes directory if it does not exist', async () => {
        mockAdapter.exists.mockResolvedValue(false);
        mockAdapter.mkdir.mockResolvedValue(undefined);
        mockAdapter.list.mockResolvedValue({ files: [], folders: [] });

        await themeManager.loadThemes();
        
        expect(mockAdapter.mkdir).toHaveBeenCalledWith('.obsidian/pixmi-themes');
    });
});
