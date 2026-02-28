import { describe, it, expect } from 'vitest';
import { ThemeManager } from '../src/themes';
import { App } from 'obsidian';

describe('Medium Geek Theme Color Optimization', () => {
    it('should have optimized colors for blockquote and code blocks in medium-geek theme', () => {
        const app = {} as App;
        const manager = new ThemeManager(app);
        (manager as any).loadBuiltinThemes();
        
        const theme = manager.getTheme('medium-geek');
        expect(theme).toBeDefined();
        
        const css = theme!.css;
        
        // Check blockquote colors
        // Target: deep gray/gray-blue border, light gray/blue-gray bg
        // Previous: border-left: 4px solid #d0d7de !important; bg: #f8f9fa !important;
        expect(css).toContain('border-left: 4px solid #4a5568 !important;');
        expect(css).toContain('background-color: #edf2f7 !important;');
        
        // Check code block colors
        // Target: lower contrast, high readability "Minimalist Geek"
        // Previous pre bg: #f6f8fa !important; border: 1px solid #e1e4e8 !important;
        expect(css).toContain('background-color: #f7fafc !important;');
        expect(css).toContain('border: 1px solid #edf2f7 !important;');
        
        // Check link color optimization
        expect(css).toContain('color: #2c5282 !important;');
    });
});
