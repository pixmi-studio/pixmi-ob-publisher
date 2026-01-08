import axios from 'axios';
import { LogManager } from './logger';

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
}

interface UploadMaterialResponse {
  media_id: string;
  url: string;
}

export interface WeChatArticle {
  title: string;
  author?: string;
  digest?: string;
  content: string;
  content_source_url?: string;
  thumb_media_id: string;
  need_open_comment?: number;
  only_fans_can_comment?: number;
}

interface AddDraftResponse {
  media_id: string;
}

export class WeChatApiClient {
  private appId: string;
  private appSecret: string;
  private accessToken: string = '';
  private tokenExpiration: number = 0;
  private logger: LogManager | undefined;

  constructor(appId: string, appSecret: string, logger?: LogManager) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.logger = logger;
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
      this.logger?.log(`Requesting access token for appId: ${this.appId}`);
      const response = await axios.get<AccessTokenResponse>(url, { params });
      
      if (response.data && response.data.access_token) {
        this.accessToken = response.data.access_token;
        // Set expiration 5 minutes before actual expiration to be safe
        this.tokenExpiration = Date.now() + (response.data.expires_in * 1000) - 300000;
        this.logger?.log('Access token retrieved successfully');
        return this.accessToken;
      } else {
        throw new Error(`Failed to retrieve access token. Response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      this.logger?.log(`Error fetching access token: ${error}`, 'ERROR');
      throw error;
    }
  }

  async uploadImage(buffer: ArrayBuffer | Buffer, filename: string): Promise<UploadMaterialResponse> {
    const accessToken = await this.getAccessToken();
    const url = 'https://api.weixin.qq.com/cgi-bin/material/add_material';
    
    const formData = new FormData();
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
        this.logger?.log(`Error uploading image: ${error}`, 'ERROR');
        throw error;
    }
  }

  async createDraft(articles: WeChatArticle[]): Promise<string> {
    const accessToken = await this.getAccessToken();
    const url = 'https://api.weixin.qq.com/cgi-bin/draft/add';
    
    try {
      const response = await axios.post<AddDraftResponse>(url, { articles }, {
        params: { access_token: accessToken }
      });
      
      return response.data.media_id;
    } catch (error) {
      this.logger?.log(`Error creating draft: ${error}`, 'ERROR');
      throw error;
    }
  }
}