import axios from 'axios';

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
}

interface UploadMaterialResponse {
  media_id: string;
  url: string;
}

export class WeChatApiClient {
  private appId: string;
  private appSecret: string;
  private accessToken: string = '';
  private tokenExpiration: number = 0;

  constructor(appId: string, appSecret: string) {
    this.appId = appId;
    this.appSecret = appSecret;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    const url = 'https://api.weixin.qq.com/cgi-bin/token';
    const params = {
      grant_type: 'client_credential',
      appid: this.appId,
      secret: this.appSecret
    };

    try {
      const response = await axios.get<AccessTokenResponse>(url, { params });
      
      if (response.data && response.data.access_token) {
        this.accessToken = response.data.access_token;
        // Set expiration 5 minutes before actual expiration to be safe
        this.tokenExpiration = Date.now() + (response.data.expires_in * 1000) - 300000;
        return this.accessToken;
      } else {
        throw new Error('Failed to retrieve access token');
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw error;
    }
  }

  async uploadImage(buffer: ArrayBuffer | Buffer, filename: string): Promise<UploadMaterialResponse> {
    const accessToken = await this.getAccessToken();
    const url = 'https://api.weixin.qq.com/cgi-bin/material/add_material';
    
    const formData = new FormData();
    // In a real browser environment, we can construct a Blob from the buffer.
    // Since we are targeting Obsidian (Electron), this works.
    // For tests in jsdom, we might need to handle Blob/File creation carefully if strictly typed.
    // But axios handles FormData.
    
    // Note: Creating a File object from buffer in browser environment
    const blob = new Blob([buffer]);
    formData.append('media', blob, filename);

    try {
        const response = await axios.post<UploadMaterialResponse>(url, formData, {
            params: {
                access_token: accessToken,
                type: 'image'
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
  }
}