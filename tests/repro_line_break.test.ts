import { describe, it, expect } from 'vitest';
import { MarkdownParser } from '../src/markdown-parser';
import { CssConverter } from '../src/css-converter';

describe('Line Break and Paragraph Optimization', () => {
    const parser = new MarkdownParser();
    const converter = new CssConverter();

    it('should apply margin-bottom to p tags to ensure paragraph spacing in WeChat', () => {
        const markdown = 'Paragraph 1\n\nParagraph 2';
        const html = parser.render(markdown);
        
        const css = '.wechat-container { line-height: 1.6; }';
        const result = converter.convert(html, css);

        // We want p tags to have explicit margin-bottom if not provided in CSS
        expect(result).toContain('margin-bottom: 1em');
    });

    it('should handle single newlines with <br> and ensure they are visible', () => {
        const markdown = 'Line 1\nLine 2';
        const html = parser.render(markdown);
        
        expect(html).toContain('<br>');

        const css = '.wechat-container { line-height: 1.6; }';
        const result = converter.convert(html, css);

        // Flexible match for Line 1<br>Line 2 regardless of whitespace
        expect(result.replace(/\s+/g, ' ')).toContain('Line 1<br> Line 2');
    });
});
