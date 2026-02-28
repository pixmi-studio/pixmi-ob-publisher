import { describe, it, expect } from 'vitest';
import { MarkdownParser } from '../src/markdown-parser';
import { CssConverter } from '../src/css-converter';
import { ThemeManager } from '../src/themes';

describe('Final Integration Verification for Theme Optimization', () => {
    const parser = new MarkdownParser();
    const converter = new CssConverter();
    const manager = new ThemeManager({} as any);
    (manager as any).loadBuiltinThemes();

    it('should render a complex document with optimized styles', () => {
        const markdown = '# Title H1\n## Subtitle H2\n### H3 Heading\n\n' +
            'This is a paragraph with a [link](https://example.com) and some **bold** text.\n' +
            'It also has a single newline\nto test <br> generation.\n\n' +
            '> This is a blockquote that should have a gray-blue border and background.\n\n' +
            '```javascript\nconst code = "Should have a clean background";\nconsole.log(code);\n```\n\n' +
            'A very long URL that needs wrapping: https://verylongdomainname.com/with/a/very/long/path/that/should/not/overflow/the/container/on/mobile/devices';

        const html = parser.render(markdown);
        const theme = manager.getTheme('medium-geek');
        const result = converter.convert(html, theme!.css);

        // Verify font sizes (H1) and lack of border-bottom
        expect(result).toContain('font-size: 22px !important;');
        expect(result).not.toContain('border-bottom: 1px solid #eaecef');
        
        // Verify container padding
        expect(result).toContain('padding: 15px 20px !important;');
        
        // Verify paragraph margin (injected by CssConverter)
        expect(result).toContain('margin-bottom: 1em;');
        
        // Verify typography fixes (injected by CssConverter)
        expect(result).toContain('word-break: break-word;');
        expect(result).toContain('font-variant-numeric: tabular-nums;');
        
        // Verify blockquote colors and spacing
        expect(result).toContain('border-left: 4px solid #4a5568 !important;');
        expect(result).toContain('background-color: #edf2f7 !important;');
        // Paragraph inside blockquote should have margin-bottom: 0 (overridden by theme)
        expect(result).toContain('margin-bottom: 0 !important;');
        expect(result).toMatch(/blockquote[^>]*>\s*<p[^>]*margin-bottom:\s*0\s*!important/);
        
        // Verify link color
        expect(result).toContain('color: #2c5282 !important;');
        
        // Verify <br> for single newline
        expect(result.replace(/\s+/g, ' ')).toContain('single newline<br> to test <br> generation');
    });
});
