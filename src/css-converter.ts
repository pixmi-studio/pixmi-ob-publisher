export class CssConverter {
    /**
     * Converts CSS rules and applies them as inline styles to HTML elements.
     * @param html The HTML content.
     * @param css The CSS content.
     */
    convert(html: string, css: string): string {
        const parser = new DOMParser();
        // Wrap content in a div with the container class. 
        // Using <div> instead of <section> improves compatibility with WeChat editor's internal normalization.
        const wrappedHtml = `<div class="wechat-container">${html}</div>`;
        const doc = parser.parseFromString(wrappedHtml, 'text/html');
        
        // 1. Structural Fix: Hack for WeChat List Item splitting and bullet styling
        doc.querySelectorAll('li').forEach(li => {
            const hasBold = !!li.querySelector('strong, b');
            const children = Array.from(li.childNodes);
            
            if (hasBold) {
                // Strategy: Wrap everything in <strong>. Use inner spans to toggle font-weight.
                const wrapper = doc.createElement('strong');
                children.forEach(child => {
                    const span = doc.createElement('span');
                    if (child.nodeName === 'STRONG' || child.nodeName === 'B') {
                        span.style.fontWeight = 'bold';
                        while (child.firstChild) span.appendChild(child.firstChild);
                    } else {
                        span.style.fontWeight = 'normal';
                        span.appendChild(child);
                    }
                    // Force the text color inside the wrapper to match our body color
                    span.style.color = 'rgb(51, 51, 51)';
                    wrapper.appendChild(span);
                });
                li.innerHTML = '';
                li.appendChild(wrapper);
            } else {
                // Even without bold, wrap in a span to allow independent bullet/text styling
                const span = doc.createElement('span');
                span.style.fontWeight = 'normal';
                span.style.color = 'rgb(51, 51, 51)';
                while (li.firstChild) span.appendChild(li.firstChild);
                li.appendChild(span);
            }
        });

        // 2. Structural Fix: Replace newlines in code blocks with <br> to force formatting
        doc.querySelectorAll('pre code').forEach(code => {
            // We need to preserve internal tags if any (like syntax highlighting spans if added later)
            // But markdown-it output for code block is usually text.
            // Let's assume text for safety or handle child nodes.
            // Safe approach: Replace text node newlines.
            
            // However, modifying DOM while iterating is tricky. 
            // Simplest robust way for markdown code blocks:
            const htmlContent = code.innerHTML;
            // Only replace newlines that are NOT inside tags (simple regex is risky).
            // But code blocks usually don't have tags unless highlighted. 
            // Markdown-it output without highlighter is plain text escaped.
            
            // Let's use a node walker to be safe.
            const walker = doc.createTreeWalker(code, NodeFilter.SHOW_TEXT);
            const textNodes: Node[] = [];
            while(walker.nextNode()) textNodes.push(walker.currentNode);
            
            textNodes.forEach(node => {
                if (node.nodeValue && node.nodeValue.includes('\n')) {
                    const fragment = doc.createDocumentFragment();
                    const parts = node.nodeValue.split('\n');
                    parts.forEach((part, index) => {
                        if (index > 0) fragment.appendChild(doc.createElement('br'));
                        fragment.appendChild(doc.createTextNode(part));
                    });
                    node.parentNode?.replaceChild(fragment, node);
                }
            });
        });

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
        doc.querySelectorAll('p').forEach(p => {
            const currentStyle = p.getAttribute('style') || '';
            // Default paragraph spacing and typography for WeChat
            const fix = 'margin-top: 0px; margin-bottom: 1em; line-height: 1.8; word-break: break-word; font-variant-numeric: tabular-nums;';
            p.setAttribute('style', this.mergeStyles(currentStyle, fix));
        });

        doc.querySelectorAll('img').forEach(img => {
            const currentStyle = img.getAttribute('style') || '';
            const fix = 'max-width: 100% !important; height: auto !important; display: block; margin: 20px auto;';
            img.setAttribute('style', this.mergeStyles(currentStyle, fix));
        });

        // Force code block styles for WeChat
        doc.querySelectorAll('pre').forEach(pre => {
             const currentStyle = pre.getAttribute('style') || '';
             const fix = 'white-space: pre-wrap; word-break: break-all;';
             pre.setAttribute('style', this.mergeStyles(currentStyle, fix));
        });

        doc.querySelectorAll('code').forEach(code => {
             const currentStyle = code.getAttribute('style') || '';
             const fix = 'word-break: break-all;'; // Ensure inline code also breaks if too long
             code.setAttribute('style', this.mergeStyles(currentStyle, fix));
        });

        // Clean up whitespace in lists to prevent WeChat editor from creating empty list items
        doc.querySelectorAll('ul, ol').forEach(list => {
            const children = Array.from(list.childNodes);
            children.forEach(child => {
                // Remove text nodes that are just whitespace (newlines, spaces)
                if (child.nodeType === 3 && !child.textContent?.trim()) {
                    list.removeChild(child);
                }
            });
        });

        const wrapper = doc.querySelector('.wechat-container') as HTMLElement;
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
                    selector = '.wechat-container';
                } else if (selector.startsWith('body ')) {
                    selector = '.wechat-container ' + selector.substring(5);
                } else if (selector.startsWith('#write ')) {
                    selector = '.wechat-container ' + selector.substring(7);
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
