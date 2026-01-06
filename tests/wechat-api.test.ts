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
});
