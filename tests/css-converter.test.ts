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
        expect(result).toContain('<p style="font-size: 14px;">World</p>');
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
});
