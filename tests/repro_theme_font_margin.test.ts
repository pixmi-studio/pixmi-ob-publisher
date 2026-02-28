import { describe, it, expect, vi } from 'vitest';
import { ThemeManager } from '../src/themes';
import { App } from 'obsidian';

describe('Medium Geek Theme Optimization', () => {
    it('should have optimized font sizes and padding in medium-geek theme', () => {
        const app = {} as App;
        const manager = new ThemeManager(app);
        (manager as any).loadBuiltinThemes();
        
        const theme = manager.getTheme('medium-geek');
        expect(theme).toBeDefined();
        
        const css = theme!.css;
        
        // Check padding
        expect(css).toContain('padding: 15px 20px !important;');
        
        // Check body font size (suggested 14px-15px)
        expect(css).toContain('font-size: 15px !important;');
        
        // Check heading sizes (should be reduced)
        // Previous: h1 28px, h2 24px, h3 20px, h4 18px
        // Target: h1 ~1.5em (22.5px), h2 ~1.3em (19.5px), h3 ~1.1em (16.5px), h4 ~1em (15px)
        expect(css).toContain('h1 { font-size: 22px !important;');
        expect(css).toContain('h2 { font-size: 20px !important;');
        expect(css).toContain('h3 { font-size: 18px !important;');
        expect(css).toContain('h4 { font-size: 16px !important;');
        
        // Check letter-spacing
        expect(css).toContain('letter-spacing: 0.5px;');
    });
});
