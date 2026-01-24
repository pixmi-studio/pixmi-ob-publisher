import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StyleInjector } from '../src/style-injector';

describe('StyleInjector', () => {
    let injector: StyleInjector;
    let mockApp: any;

    beforeEach(() => {
        mockApp = {
            workspace: {
                getActiveViewOfType: vi.fn()
            }
        };
        injector = new StyleInjector(mockApp);
    });

    it('should be defined', () => {
        expect(injector).toBeDefined();
    });

    it('should create a style element if it does not exist', () => {
        const mockDocument = {
            getElementById: vi.fn().mockReturnValue(null),
            head: {
                appendChild: vi.fn()
            },
            createElement: vi.fn().mockReturnValue({ id: '', textContent: '' })
        };
        
        // Mock global document
        vi.stubGlobal('document', mockDocument);

        injector.inject('test-style', '.test { color: red; }');

        expect(mockDocument.createElement).toHaveBeenCalledWith('style');
        expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });

    it('should update existing style element', () => {
        const mockStyleEl = { id: 'pixmi-theme-style', textContent: '' };
        const mockDocument = {
            getElementById: vi.fn().mockReturnValue(mockStyleEl),
        };
        
        vi.stubGlobal('document', mockDocument);

        injector.inject('test-style', '.test { color: blue; }');

        expect(mockStyleEl.textContent).toContain('.pixmi-preview-container .test');
        expect(mockStyleEl.textContent).toContain('{ color: blue; }');
    });

    it('should scope CSS rules with the container class', () => {
        const mockStyleEl = { id: 'pixmi-theme-style', textContent: '' };
        const mockDocument = {
            getElementById: vi.fn().mockReturnValue(mockStyleEl),
        };
        vi.stubGlobal('document', mockDocument);

        const rawCss = 'h1 { color: red; } .my-class { margin: 10px; }';
        injector.inject('test-style', rawCss);

        expect(mockStyleEl.textContent).toContain('.pixmi-preview-container h1');
        expect(mockStyleEl.textContent).toContain('{ color: red; }');
        expect(mockStyleEl.textContent).toContain('.pixmi-preview-container .my-class');
        expect(mockStyleEl.textContent).toContain('{ margin: 10px; }');
    });

    it('should replace body and #write selectors with the scope class', () => {
        const mockStyleEl = { id: 'pixmi-theme-style', textContent: '' };
        const mockDocument = {
            getElementById: vi.fn().mockReturnValue(mockStyleEl),
        };
        vi.stubGlobal('document', mockDocument);

        const rawCss = 'body { color: black; } #write { margin: 0; } body h1 { font-size: 20px; }';
        injector.inject('test-style', rawCss);

        // Check for replacement (no space before brace if replaced directly)
        // Wait, the regex replace preserves the spacing if it was trimmed.
        // My implementation: `return scope` replaces `body`. The brace follows.
        // But the regex `(?=[^{}]*{)` keeps the brace and content in the next match or just separate?
        // Ah, `css.replace(/([^\r\n,{}]+)(?=[^{}]*{)/g, ...)` replaces the selector part.
        // So "body {..." -> "body" matches. Replaced by ".pixmi-preview-container".
        // Result: ".pixmi-preview-container {..."
        
        expect(mockStyleEl.textContent).toContain('.pixmi-preview-container{ color: black; }');
        expect(mockStyleEl.textContent).toContain('.pixmi-preview-container{ margin: 0; }');
        // "body h1" -> ".pixmi-preview-container h1"
        expect(mockStyleEl.textContent).toContain('.pixmi-preview-container h1{ font-size: 20px; }');
    });
});
