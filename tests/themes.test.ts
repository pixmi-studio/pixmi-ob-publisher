import { describe, it, expect } from 'vitest';
import { Theme, ThemeType } from '../src/themes';

describe('Theme Interfaces', () => {
    it('should define a Theme interface with required properties', () => {
        const mockTheme: Theme = {
            id: 'minimalist',
            name: 'Minimalist',
            css: 'body { color: black; }',
            type: 'builtin'
        };
        
        expect(mockTheme.id).toBe('minimalist');
        expect(mockTheme.type).toBe('builtin' as ThemeType);
    });
});
