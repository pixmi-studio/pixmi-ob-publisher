import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Publisher } from '../src/publisher';
import { WeChatApiClient } from '../src/wechat-api';
import { MarkdownParser } from '../src/markdown-parser';

// Use real MarkdownParser
// Mock WeChatApiClient
vi.mock('../src/wechat-api');

describe('Publishing Flow Integration', () => {
  let publisher: Publisher;
  let mockApiClient: any;
  let realParser: MarkdownParser;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    mockApiClient = {
      uploadImage: vi.fn(),
      createDraft: vi.fn()
    };
    
    realParser = new MarkdownParser();
    publisher = new Publisher(mockApiClient, realParser);
  });

  it('should parse markdown, upload images, and create draft with correct content', async () => {
    const markdown = '# Hello\n![Test Image](test.png)\n\nSome text.';
    const title = 'Integration Test';
    
    // Mock image upload to return a remote URL
    mockApiClient.uploadImage.mockResolvedValue({ 
        url: 'http://remote.com/test.jpg', 
        media_id: 'media-123' 
    });
    
    // Mock draft creation
    mockApiClient.createDraft.mockResolvedValue('draft-id-456');

    // Mock image reader
    const imageReader = vi.fn().mockResolvedValue(Buffer.from('fake-image-data'));

    const result = await publisher.publish(title, markdown, imageReader);

    // Verify Image Upload
    expect(mockApiClient.uploadImage).toHaveBeenCalledWith(expect.any(Buffer), 'test.png');

    // Verify Draft Content
    // markdown-it usually wraps images in <p> if they are in their own paragraph
    const expectedContent = '<h1>Hello</h1>\n<p><img src="http://remote.com/test.jpg" alt="Test Image"></p>\n<p>Some text.</p>\n';
    
    expect(mockApiClient.createDraft).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
            title: title,
            content: expectedContent,
            thumb_media_id: 'media-123'
        })
    ]));

    expect(result).toBe('draft-id-456');
  });
});
