import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeChatApiClient } from '../src/wechat-api';
import { requestUrl } from 'obsidian';

vi.mock('obsidian', async () => {
    const actual = await vi.importActual('obsidian');
    return {
        ...actual as any,
        requestUrl: vi.fn(),
    };
});

describe('WeChatApiClient', () => {
  let client: WeChatApiClient;
  const appId = 'test-app-id';
  const appSecret = 'test-app-secret';

  beforeEach(() => {
    client = new WeChatApiClient(appId, appSecret);
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(WeChatApiClient).toBeDefined();
    expect(client).toBeDefined();
  });

  it('should get access token', async () => {
    const mockToken = 'mock-access-token';
    const mockExpiresIn = 7200;
    
    (requestUrl as any).mockResolvedValue({
      status: 200,
      json: {
        access_token: mockToken,
        expires_in: mockExpiresIn
      }
    });

    const token = await client.getAccessToken();
    expect(token).toBe(mockToken);
    expect(requestUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('https://api.weixin.qq.com/cgi-bin/token'),
        method: 'GET'
      })
    );
  });

  it('should use proxy URL if provided', async () => {
    const proxyUrl = 'https://my-proxy.com/';
    client = new WeChatApiClient(appId, appSecret, proxyUrl);
    
    (requestUrl as any).mockResolvedValue({
      status: 200,
      json: {
        access_token: 'token',
        expires_in: 7200
      }
    });

    await client.getAccessToken();
    expect(requestUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('https://my-proxy.com/cgi-bin/token')
      })
    );
  });

  it('should cache access token', async () => {
    const mockToken = 'mock-access-token';
    (requestUrl as any).mockResolvedValue({
      status: 200,
      json: {
        access_token: mockToken,
        expires_in: 7200
      }
    });

    await client.getAccessToken();
    await client.getAccessToken();

    // Should only call API once due to caching
    expect(requestUrl).toHaveBeenCalledTimes(1);
  });

  it('should throw error when access token is missing', async () => {
    (requestUrl as any).mockResolvedValue({ status: 200, json: {} });
    await expect(client.getAccessToken()).rejects.toThrow('Failed to retrieve access token');
  });

  it('should propagate network errors', async () => {
    const error = new Error('Network error');
    (requestUrl as any).mockRejectedValue(error);
    await expect(client.getAccessToken()).rejects.toThrow('Network error');
  });

  it('should upload material', async () => {
    const mockToken = 'mock-access-token';
    const mockMediaId = 'mock-media-id';
    const mockUrl = 'http://mock-url.com/image.jpg';
    const mockBuffer = Buffer.from('mock-image-data');
    
    // Mock getAccessToken to return a token
    client.getAccessToken = vi.fn().mockResolvedValue(mockToken);
    
    (requestUrl as any).mockResolvedValue({
      status: 200,
      json: {
        media_id: mockMediaId,
        url: mockUrl
      }
    });

    const result = await client.uploadMaterial(mockBuffer, 'image.jpg', 'image');
    
    expect(result.media_id).toBe(mockMediaId);
    expect(result.url).toBe(mockUrl);
    expect(requestUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('https://api.weixin.qq.com/cgi-bin/material/add_material'),
        method: 'POST',
        headers: expect.objectContaining({
            'Content-Type': expect.stringContaining('multipart/form-data')
        })
      })
    );
  });

  it('should upload image for content', async () => {
    const mockToken = 'mock-access-token';
    const mockUrl = 'http://mock-url.com/content-image.jpg';
    const mockBuffer = Buffer.from('mock-image-data');
    
    client.getAccessToken = vi.fn().mockResolvedValue(mockToken);
    
    (requestUrl as any).mockResolvedValue({
      status: 200,
      json: {
        url: mockUrl
      }
    });

    const url = await client.uploadImageForContent(mockBuffer, 'image.jpg');
    
    expect(url).toBe(mockUrl);
    expect(requestUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('https://api.weixin.qq.com/cgi-bin/media/uploadimg'),
        method: 'POST'
      })
    );
  });

  it('should create draft', async () => {
    const mockToken = 'mock-access-token';
    const mockMediaId = 'mock-draft-media-id';
    const articles = [{ title: 'Test', content: 'Content', thumb_media_id: 'thumb' }];
    
    client.getAccessToken = vi.fn().mockResolvedValue(mockToken);
    
    (requestUrl as any).mockResolvedValue({
      status: 200,
      json: {
        media_id: mockMediaId
      }
    });

    const mediaId = await client.createDraft(articles);
    
    expect(mediaId).toBe(mockMediaId);
    expect(requestUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining('https://api.weixin.qq.com/cgi-bin/draft/add'),
        method: 'POST',
        body: expect.stringContaining('articles')
      })
    );
  });
});
