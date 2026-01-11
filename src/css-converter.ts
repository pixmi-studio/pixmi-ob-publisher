export class CssConverter {
    /**
     * Converts CSS rules and applies them as inline styles to HTML elements.
     * @param html The HTML content.
     * @param css The CSS content.
     */
    convert(html: string, css: string): string {
        if (!css.trim()) return html;

        const parser = new DOMParser();
        // Wrap content in a section with the container class. 
        // We use <section> as it's a common top-level element for WeChat articles.
        const wrappedHtml = `<section class="pixmi-preview-container">${html}</section>`;
        const doc = parser.parseFromString(wrappedHtml, 'text/html');
        
        const rules = this.parseCss(css);

        for (const rule of rules) {
            try {
                const elements = doc.querySelectorAll(rule.selector);
                elements.forEach(el => {
                    const currentStyle = el.getAttribute('style') || '';
                    const newStyle = this.mergeStyles(currentStyle, rule.declarations);
                    el.setAttribute('style', newStyle);
                });
            } catch (e) {
                // Ignore invalid selectors silently in production
            }
        }

        // Apply global fixes for WeChat compatibility
        doc.querySelectorAll('img').forEach(img => {
            const currentStyle = img.getAttribute('style') || '';
            const fix = 'max-width: 100% !important; height: auto !important; display: block; margin: 20px auto;';
            img.setAttribute('style', this.mergeStyles(currentStyle, fix));
        });

        const wrapper = doc.querySelector('.pixmi-preview-container') as HTMLElement;
        return wrapper ? wrapper.outerHTML : doc.body.innerHTML;
    }

    private parseCss(css: string): Array<{ selector: string; declarations: string }> {
        const rules: Array<{ selector: string; declarations: string }> = [];
        
        // Use a more robust regex that handles multi-line blocks and ignores nesting issues
        // We match "selector { declarations }"
        const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
        const regex = /([^{}]+)\{([^}]+)\}/g;
        let match;

        while ((match = regex.exec(cleanCss)) !== null) {
            const selectorPart = match[1].trim();
            const declarations = match[2].trim();

            if (!selectorPart || !declarations) continue;

            const selectors = selectorPart.split(',');
            for (let selector of selectors) {
                selector = selector.trim();
                
                // Map generic root selectors to our specific container
                if (selector === 'body' || selector === '#write') {
                    selector = '.pixmi-preview-container';
                } else if (selector.startsWith('body ')) {
                    selector = '.pixmi-preview-container ' + selector.substring(5);
                } else if (selector.startsWith('#write ')) {
                    selector = '.pixmi-preview-container ' + selector.substring(7);
                }

                if (selector) {
                    rules.push({ selector, declarations });
                }
            }
        }

        return rules;
    }

    private mergeStyles(current: string, added: string): string {
        const styles = new Map<string, string>();

        const parse = (str: string) => {
            str.split(';').forEach(pair => {
                const [prop, val] = pair.split(':').map(s => s.trim());
                if (prop && val) {
                    styles.set(prop, val);
                }
            });
        };

        parse(current);
        parse(added);

        return Array.from(styles.entries())
            .map(([prop, val]) => `${prop}: ${val}`)
            .join('; ') + (styles.size > 0 ? ';' : '');
    }
}
