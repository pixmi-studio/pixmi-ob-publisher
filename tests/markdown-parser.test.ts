import { describe, it, expect, beforeEach } from 'vitest';
import { MarkdownParser } from '../src/markdown-parser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  it('should convert headers to html', () => {
    const markdown = '# Hello';
    const html = parser.render(markdown);
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('should convert lists to html', () => {
    const markdown = '- Item 1\n- Item 2';
    const html = parser.render(markdown);
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
  });

  it('should extract images', () => {
    const markdown = '![Image 1](image1.png)\n![Image 2](http://example.com/image2.jpg)';
    const images = parser.extractImages(markdown);
    expect(images).toHaveLength(2);
    expect(images).toContain('image1.png');
    expect(images).toContain('http://example.com/image2.jpg');
  });

  it('should replace image urls', () => {
    const markdown = '![Image](local.png)';
    const urlMap = new Map<string, string>();
    urlMap.set('local.png', 'http://wechat.com/remote.jpg');
    
    const html = parser.renderWithReplacements(markdown, urlMap);
    expect(html).toContain('<img src="http://wechat.com/remote.jpg" alt="Image">');
  });

  it('should handle markdown with no images', () => {
    const markdown = '# Header';
    expect(parser.extractImages(markdown)).toHaveLength(0);
    expect(parser.renderWithReplacements(markdown, new Map())).toContain('<h1>Header</h1>');
  });

  it('should handle images with no replacement found', () => {
    const markdown = '![Image](local.png)';
    const html = parser.renderWithReplacements(markdown, new Map());
    expect(html).toContain('<img src="local.png" alt="Image">');
  });

  it('should handle complex markdown structure', () => {
    const markdown = 'Text with ![Image](img.png) inside paragraph.';
    const urlMap = new Map([['img.png', 'remote.png']]);
    const html = parser.renderWithReplacements(markdown, urlMap);
    expect(html).toContain('<p>Text with <img src="remote.png" alt="Image"> inside paragraph.</p>');
  });

  it('should handle image with empty url', () => {
    const markdown = '![Image]()';
    const images = parser.extractImages(markdown);
    expect(images).toHaveLength(0); // Since '' is falsy in the check
  });
});
