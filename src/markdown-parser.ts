import MarkdownIt from 'markdown-it';

export class MarkdownParser {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
  }

  render(markdown: string): string {
    return this.md.render(markdown);
  }

  extractImages(markdown: string): string[] {
    const images: string[] = [];
    // Simple regex for markdown images ![alt](url)
    const mdRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = mdRegex.exec(markdown)) !== null) {
      if (match[1]) {
        images.push(match[1]);
      }
    }

    // Obsidian wikilinks: ![[image.png]]
    const wikiRegex = /!\[\[(.*?)\]\]/g;
    while ((match = wikiRegex.exec(markdown)) !== null) {
      if (match[1]) {
        // Split by | to handle ![[image.png|100]]
        const path = match[1].split('|')[0];
        images.push(path);
      }
    }
    
    return [...new Set(images)]; // Unique paths
  }

  renderWithReplacements(markdown: string, urlMap: Map<string, string>): string {
    // A better approach would be to write a custom markdown-it plugin or rule,
    // but for simplicity and control over replacements before rendering:
    
    // Let's use a token stream approach for safety for standard markdown images.
    const tokens = this.md.parse(markdown, {});
    
    tokens.forEach(token => {
      if (token.type === 'inline') {
        token.children?.forEach(child => {
          if (child.type === 'image') {
            const srcIndex = child.attrs?.findIndex(attr => attr[0] === 'src');
            if (srcIndex !== undefined && srcIndex > -1 && child.attrs) {
              const src = child.attrs[srcIndex][1];
              if (urlMap.has(src)) {
                child.attrs[srcIndex][1] = urlMap.get(src)!;
              }
            }
          }
        });
      }
    });

    let html = this.md.renderer.render(tokens, this.md.options, {});

    // Handle wikilinks that were rendered as text because markdown-it doesn't support them by default.
    urlMap.forEach((remoteUrl, localPath) => {
        // Find ![[localPath]] or ![[localPath|alias]]
        const escapedPath = localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wikiRegex = new RegExp(`!\\[\\[${escapedPath}(\\|.*?)?\\]\\]`, 'g');
        html = html.replace(wikiRegex, `<img src="${remoteUrl}">`);
    });

    return html;
  }
}