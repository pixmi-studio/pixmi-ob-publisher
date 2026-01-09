import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Publisher } from '../src/publisher';
import { WeChatApiClient } from '../src/wechat-api';
import { MarkdownParser } from '../src/markdown-parser';
import { PixmiObPublisher } from '../src/main'; // Mocking the plugin instance

vi.mock('../src/wechat-api');
vi.mock('../src/markdown-parser');

describe('Publisher', () => {
  let publisher: Publisher;
  let mockApiClient: any;
  let mockParser: any;
  let mockPlugin: any;

  beforeEach(() => {
    mockApiClient = {
      uploadMaterial: vi.fn(),
      uploadImageForContent: vi.fn(),
      createDraft: vi.fn(),
    };
    mockParser = {
      extractImages: vi.fn(),
      renderWithReplacements: vi.fn()
    };
    mockPlugin = {
        apiClient: mockApiClient,
        // Mock file system access if needed, or pass file content directly
    };

    // We can inject dependencies or use the plugin instance
    publisher = new Publisher(mockApiClient, mockParser);
  });

  it('should be defined', () => {
    expect(Publisher).toBeDefined();
    expect(publisher).toBeDefined();
  });

  it('should publish article successfully', async () => {
    const markdown = '![Image](local.png)';
    const title = 'Test Article';
    const processedHtml = '<img src="http://remote.jpg">';
    
    mockParser.extractImages.mockReturnValue(['local.png']);
    mockApiClient.uploadImageForContent.mockResolvedValue('http://remote.jpg');
    mockApiClient.uploadMaterial.mockResolvedValue({ media_id: 'media-id', url: 'http://permanent.jpg' });
    mockParser.renderWithReplacements.mockReturnValue(processedHtml);
    mockApiClient.createDraft.mockResolvedValue('draft-media-id');

    // We need a way to read the image file. 
    // For now, let's assume we pass an image reader callback or similar.
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    const result = await publisher.publish(title, markdown, imageReader);

    expect(mockParser.extractImages).toHaveBeenCalledWith(markdown);
    expect(imageReader).toHaveBeenCalledWith('local.png');
    expect(mockApiClient.uploadImageForContent).toHaveBeenCalledWith(expect.any(Buffer), 'local.png');
    expect(mockApiClient.uploadMaterial).toHaveBeenCalledWith(expect.any(Buffer), 'local.png', 'image');
    expect(mockParser.renderWithReplacements).toHaveBeenCalledWith(markdown, expect.any(Map));
    expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
            title: title,
            content: processedHtml,
            thumb_media_id: 'media-id'
        })
    ]));
    expect(result).toBe('draft-media-id');
  });

  it('should continue publishing if one image upload fails but another succeeds', async () => {
    const markdown = '![Fail](fail.png) ![Success](success.png)';
    mockParser.extractImages.mockReturnValue(['fail.png', 'success.png']);
    
    mockApiClient.uploadImageForContent.mockImplementation(async (buffer: any, filename: string) => {
        if (filename === 'fail.png') throw new Error('Upload error');
        return 'http://remote.jpg';
    });
    mockApiClient.uploadMaterial.mockResolvedValue({ media_id: 'media-id', url: 'http://permanent.jpg' });

    mockParser.renderWithReplacements.mockReturnValue('<img src="fail.png"> <img src="http://remote.jpg">');
    mockApiClient.createDraft.mockResolvedValue('draft-id');
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    const result = await publisher.publish('Title', markdown, imageReader);

    expect(mockApiClient.uploadImageForContent).toHaveBeenCalledTimes(2);
    expect(mockApiClient.createDraft).toHaveBeenCalled();
    expect(result).toBe('draft-id');
  });

  it('should throw error if no images are found (thumbnail required)', async () => {
    const markdown = 'Just text, no images.';
    mockParser.extractImages.mockReturnValue([]);
    const imageReader = vi.fn();

    await expect(publisher.publish('Title', markdown, imageReader))
      .rejects
      .toThrow('A thumbnail image is required to publish to WeChat. Please include at least one image in your article or specify one in the frontmatter (e.g., thumb: image.jpg).');
  });

  it('should use provided thumbnailPath', async () => {
    const markdown = 'No images in content.';
    const thumbnailPath = 'thumb.png';
    mockParser.extractImages.mockReturnValue([]);
    mockApiClient.uploadMaterial.mockResolvedValue({ media_id: 'thumb-media-id', url: 'http://permanent.jpg' });
    mockParser.renderWithReplacements.mockReturnValue('<p>No images</p>');
    mockApiClient.createDraft.mockResolvedValue('draft-id');
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    const result = await publisher.publish('Title', markdown, imageReader, thumbnailPath);

    expect(imageReader).toHaveBeenCalledWith(thumbnailPath);
    expect(mockApiClient.uploadMaterial).toHaveBeenCalledWith(expect.any(Buffer), 'thumb.png', 'image');
    expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
            thumb_media_id: 'thumb-media-id'
        })
    ]));
    expect(result).toBe('draft-id');
  });

  it('should apply CSS during publishing if provided', async () => {
    const markdown = '# Hello';
    const css = 'h1 { color: red; }';
    const title = 'Title';
    
    mockParser.extractImages.mockReturnValue(['thumb.png']);
    mockApiClient.uploadMaterial.mockResolvedValue({ media_id: 'media-id' });
    mockParser.renderWithReplacements.mockReturnValue('<h1>Hello</h1>');
    mockApiClient.createDraft.mockResolvedValue('draft-id');
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    await publisher.publish(title, markdown, imageReader, undefined, css);

    expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
            content: expect.stringContaining('style="color: red;"')
        })
    ]));
  });
});
