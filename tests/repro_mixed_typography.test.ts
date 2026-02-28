import { describe, it, expect } from 'vitest';
import { CssConverter } from '../src/css-converter';

describe('Mixed Typography Optimization', () => {
    const converter = new CssConverter();

    it('should apply word-break: break-word to ensure long words/URLs do not overflow', () => {
        const html = '<p>AVeryLongWordThatMightOverflowTheContainerOnMobileDevices</p>';
        const result = converter.convert(html, '');
        
        // Check for word-break or overflow-wrap on p tags
        expect(result).toContain('word-break: break-word');
    });

    it('should optimize font features for numbers and punctuation', () => {
        const html = '<p>Price: 123.45. "Hello", said the world!</p>';
        const result = converter.convert(html, '');
        
        // Check for tabular-nums and maybe some kerning/feature settings
        expect(result).toContain('font-variant-numeric: tabular-nums');
    });
});
