export class CssConverter {
    /**
     * Converts CSS rules and applies them as inline styles to HTML elements.
     * @param html The HTML content.
     * @param css The CSS content.
     */
    convert(html: string, css: string): string {
        if (!css.trim()) return html;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
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
                console.error(`Invalid CSS selector: ${rule.selector}`, e);
            }
        }

        return doc.body.innerHTML;
    }

    private parseCss(css: string): Array<{ selector: string; declarations: string }> {
        const rules: Array<{ selector: string; declarations: string }> = [];
        // Remove comments
        const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Match selector { declarations }
        const regex = /([^{}]+)\{([^}]+)\}/g;
        let match;

        while ((match = regex.exec(cleanCss)) !== null) {
            const selectors = match[1].split(',');
            const declarations = match[2].trim();

            for (let selector of selectors) {
                selector = selector.trim();
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
