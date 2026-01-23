import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CssConverter } from '../src/css-converter';
import { Publisher } from '../src/publisher';
import { MarkdownParser } from '../src/markdown-parser';
import { WeChatApiClient } from '../src/wechat-api';
import { ThemeManager } from '../src/themes';
import { App, requestUrl } from 'obsidian';
import * as obsidian from 'obsidian';

// Mock obsidian module is automatically used due to __mocks__/obsidian.js
vi.mock('obsidian');

describe('WeChat Compatibility', () => {
    describe('CssConverter', () => {
        it('should wrap content in a section with class "wechat-container"', () => {
            const converter = new CssConverter();
            const html = '<p>Hello</p>';
            const result = converter.convert(html, '');
            expect(result).toContain('<section class="wechat-container">');
            expect(result).toContain('<p>Hello</p>');
            expect(result).toContain('</section>');
        });

        it('should force white-space: pre-wrap and word-break: break-all on code blocks', () => {
            const converter = new CssConverter();
            const html = '<pre><code>const a = 1;</code></pre>';
            const result = converter.convert(html, '');
            
            // Check for pre tag styles
            expect(result).toMatch(/<pre[^>]*style="[^"]*white-space:\s*pre-wrap/);
            // Check for code tag styles
            expect(result).toMatch(/<code[^>]*style="[^"]*word-break:\s*break-all/);
        });
    });

    describe('Publisher Image Handling', () => {
        let publisher: Publisher;
        let mockApiClient: any;
        let mockParser: any;
        let mockImageReader: any;

        beforeEach(() => {
            mockApiClient = {
                uploadMaterial: vi.fn().mockResolvedValue({ media_id: 'thumb_media_id' }),
                uploadImageForContent: vi.fn().mockResolvedValue('http://mmbiz.qpic.cn/uploaded_url'),
                createDraft: vi.fn().mockResolvedValue('draft_id')
            } as any;

            mockParser = new MarkdownParser();
            mockImageReader = vi.fn().mockResolvedValue(new ArrayBuffer(10));
            publisher = new Publisher(mockApiClient, mockParser);
        });

        it('should upload external HTTP images and replace their URLs', async () => {
            const markdown = '![Remote Image](http://example.com/image.jpg)';
            
            // Spy on requestUrl to return a buffer
            const requestUrlSpy = vi.spyOn(obsidian, 'requestUrl').mockResolvedValue({
                status: 200,
                headers: {},
                json: {},
                text: '',
                arrayBuffer: new ArrayBuffer(10)
            } as any);

            await publisher.publish('Test', markdown, mockImageReader, 'thumb.jpg');

            expect(requestUrlSpy).toHaveBeenCalledWith(expect.objectContaining({
                url: 'http://example.com/image.jpg',
                method: 'GET'
            }));

            expect(mockApiClient.uploadImageForContent).toHaveBeenCalled();
            expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({
                    content: expect.stringContaining('http://mmbiz.qpic.cn/uploaded_url')
                })
            ]));
        });
    });

    describe('Theme Compatibility', () => {
        it('Built-in themes should not contain ::before or ::after pseudo-elements', () => {
            // Mock App
            const app = {} as App;
            const manager = new ThemeManager(app);
            
            // Mock vault for loadThemes
            (manager as any).app = {
                vault: {
                    adapter: {
                        exists: vi.fn().mockResolvedValue(false),
                        mkdir: vi.fn(),
                        list: vi.fn().mockResolvedValue({ files: [] })
                    }
                }
            };

            // Force load built-in themes
            (manager as any).loadBuiltinThemes();
            
            const themes = manager.getAllThemes();
            themes.forEach(theme => {
                if (theme.id === 'modern' || theme.id === 'minimalist') {
                   expect(theme.css).not.toContain(':before');
                   expect(theme.css).not.toContain(':after');
                   expect(theme.css).not.toContain('::before');
                   expect(theme.css).not.toContain('::after');
                }
            });
        });
    });
});