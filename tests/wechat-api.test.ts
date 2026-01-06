import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeChatApiClient } from '../src/wechat-api';
import axios from 'axios';

vi.mock('axios');

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
    
    (axios.get as any).mockResolvedValue({
      data: {
        access_token: mockToken,
        expires_in: mockExpiresIn
      }
    });

    const token = await client.getAccessToken();
    expect(token).toBe(mockToken);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('https://api.weixin.qq.com/cgi-bin/token'),
      expect.anything()
    );
  });

  it('should cache access token', async () => {
    const mockToken = 'mock-access-token';
    (axios.get as any).mockResolvedValue({
      data: {
        access_token: mockToken,
        expires_in: 7200
      }
    });

    await client.getAccessToken();
    await client.getAccessToken();

    // Should only call API once due to caching
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('should throw error when access token is missing', async () => {
    (axios.get as any).mockResolvedValue({ data: {} });
    await expect(client.getAccessToken()).rejects.toThrow('Failed to retrieve access token');
  });

  it('should propagate network errors', async () => {
    const error = new Error('Network error');
    (axios.get as any).mockRejectedValue(error);
    await expect(client.getAccessToken()).rejects.toThrow('Network error');
  });

  it('should upload image', async () => {
    const mockToken = 'mock-access-token';
    const mockMediaId = 'mock-media-id';
    const mockUrl = 'http://mock-url.com/image.jpg';
    const mockBuffer = Buffer.from('mock-image-data');
    
    // Mock getAccessToken to return a token
    client.getAccessToken = vi.fn().mockResolvedValue(mockToken);
    
    (axios.post as any).mockResolvedValue({
      data: {
        media_id: mockMediaId,
        url: mockUrl
      }
    });

    const result = await client.uploadImage(mockBuffer, 'image.jpg');
    
    expect(result.media_id).toBe(mockMediaId);
    expect(result.url).toBe(mockUrl);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('https://api.weixin.qq.com/cgi-bin/material/add_material'),
      expect.any(FormData),
      expect.objectContaining({
        params: { access_token: mockToken, type: 'image' },
        headers: expect.any(Object)
      })
    );
  });

  it('should handle upload image error', async () => {
    const mockBuffer = Buffer.from('mock-image-data');
    client.getAccessToken = vi.fn().mockResolvedValue('token');
    
    const error = new Error('Upload failed');
    (axios.post as any).mockRejectedValue(error);

    await expect(client.uploadImage(mockBuffer, 'image.jpg')).rejects.toThrow('Upload failed');
  });
});
