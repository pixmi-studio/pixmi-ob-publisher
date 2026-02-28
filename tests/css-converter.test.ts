import { describe, it, expect } from 'vitest';
import { CssConverter } from '../src/css-converter';

describe('CssConverter', () => {
    const converter = new CssConverter();

    it('should be defined', () => {
        expect(converter).toBeDefined();
    });

    it('should convert simple CSS to inline styles', () => {
        const html = '<h1>Hello</h1><p>World</p>';
        const css = 'h1 { color: red; } p { font-size: 14px; }';
        const result = converter.convert(html, css);

        expect(result).toContain('<h1 style="color: red;">Hello</h1>');
        // The p tag now has injected styles merged with CSS
        expect(result).toContain('font-size: 14px;');
        expect(result).toContain('margin-bottom: 1em;');
    });

    it('should handle class selectors', () => {
        const html = '<div class="test">Content</div>';
        const css = '.test { margin: 10px; }';
        const result = converter.convert(html, css);

        expect(result).toContain('<div class="test" style="margin: 10px;">Content</div>');
    });

    it('should merge multiple rules for the same element', () => {
        const html = '<h1>Hello</h1>';
        const css = 'h1 { color: red; } h1 { font-weight: bold; }';
        const result = converter.convert(html, css);

        expect(result).toContain('style="color: red; font-weight: bold;"');
    });

    it('should apply body styles to the wrapper container', () => {
        const html = '<p>Content</p>';
        const css = 'body { font-family: sans-serif; color: #333; }';
        const result = converter.convert(html, css);
        
        // The wrapper should inherit body styles because it acts as the body in WeChat
        expect(result).toContain('style="font-family: sans-serif; color: #333;"');
    });

    it('should apply #write styles to the wrapper container (Typora compatibility)', () => {
        const html = '<p>Content</p>';
        const css = '#write { max-width: 800px; }';
        const result = converter.convert(html, css);

        expect(result).toContain('style="max-width: 800px;"');
    });
});
