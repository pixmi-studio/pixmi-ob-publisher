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
      uploadImage: vi.fn(),
      createDraft: vi.fn(),
      uploadTempMedia: vi.fn().mockResolvedValue('temp-media-id')
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
    mockApiClient.uploadImage.mockResolvedValue({ url: 'http://remote.jpg', media_id: 'media-id' });
    mockParser.renderWithReplacements.mockReturnValue(processedHtml);
    mockApiClient.createDraft.mockResolvedValue('draft-media-id');

    // We need a way to read the image file. 
    // For now, let's assume we pass an image reader callback or similar.
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    const result = await publisher.publish(title, markdown, imageReader);

    expect(mockParser.extractImages).toHaveBeenCalledWith(markdown);
    expect(imageReader).toHaveBeenCalledWith('local.png');
    expect(mockApiClient.uploadImage).toHaveBeenCalledWith(expect.any(Buffer), 'local.png');
    expect(mockApiClient.uploadTempMedia).toHaveBeenCalledWith(expect.any(Buffer), 'thumb');
    expect(mockParser.renderWithReplacements).toHaveBeenCalledWith(markdown, expect.any(Map));
    expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
            title: title,
            content: processedHtml,
            thumb_media_id: 'temp-media-id' // Now expects temp-media-id
        })
    ]));
    expect(result).toBe('draft-media-id');
  });

  it('should continue publishing if one image upload fails but another succeeds', async () => {
    const markdown = '![Fail](fail.png) ![Success](success.png)';
    mockParser.extractImages.mockReturnValue(['fail.png', 'success.png']);
    
    mockApiClient.uploadImage.mockImplementation(async (buffer: any, filename: string) => {
        if (filename === 'fail.png') throw new Error('Upload error');
        return { url: 'http://remote.jpg', media_id: 'media-id' };
    });

    mockParser.renderWithReplacements.mockReturnValue('<img src="fail.png"> <img src="http://remote.jpg">');
    mockApiClient.createDraft.mockResolvedValue('draft-id');
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    const result = await publisher.publish('Title', markdown, imageReader);

    expect(mockApiClient.uploadImage).toHaveBeenCalledTimes(2);
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
    mockApiClient.uploadImage.mockResolvedValue({ url: 'http://remote.jpg', media_id: 'thumb-media-id' });
    mockParser.renderWithReplacements.mockReturnValue('<p>No images</p>');
    mockApiClient.createDraft.mockResolvedValue('draft-id');
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('data'));

    const result = await publisher.publish('Title', markdown, imageReader, thumbnailPath);

    expect(imageReader).toHaveBeenCalledWith(thumbnailPath);
    expect(mockApiClient.uploadTempMedia).toHaveBeenCalledWith(expect.any(Buffer), 'thumb');
    expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
            thumb_media_id: 'temp-media-id' // Now expects temp-media-id
        })
    ]));
    expect(result).toBe('draft-id');
  });
});
