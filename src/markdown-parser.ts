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
    const regex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = regex.exec(markdown)) !== null) {
      if (match[1]) {
        images.push(match[1]);
      }
    }
    return images;
  }

  renderWithReplacements(markdown: string, urlMap: Map<string, string>): string {
    // A better approach would be to write a custom markdown-it plugin or rule,
    // but for simplicity and control over replacements before rendering:
    let processedMarkdown = markdown;
    
    // We iterate over the map keys to replace occurrences.
    // Note: This simple string replacement might be risky if filenames are common words.
    // A more robust way is using the token stream of markdown-it.
    
    // Let's use a token stream approach for safety.
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

    return this.md.renderer.render(tokens, this.md.options, {});
  }
}