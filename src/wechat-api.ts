import { requestUrl, RequestUrlParam } from 'obsidian';
import { LogManager } from './logger';

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  errcode?: number;
  errmsg?: string;
}

interface UploadMaterialResponse {
  media_id: string;
  url: string;
  errcode?: number;
  errmsg?: string;
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
  errcode?: number;
  errmsg?: string;
}

export class WeChatApiClient {
  private appId: string;
  private appSecret: string;
  private proxyUrl: string;
  private accessToken: string = '';
  private tokenExpiration: number = 0;
  private logger: LogManager | undefined;

  constructor(appId: string, appSecret: string, proxyUrl: string = '', logger?: LogManager) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.proxyUrl = proxyUrl.endsWith('/') ? proxyUrl.slice(0, -1) : proxyUrl;
    this.logger = logger;
  }

  private getUrl(path: string): string {
    const baseUrl = this.proxyUrl || 'https://api.weixin.qq.com';
    return `${baseUrl}${path}`;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    const url = this.getUrl('/cgi-bin/token');
    const params = new URLSearchParams({
      grant_type: 'client_credential',
      appid: this.appId,
      secret: this.appSecret
    });

    try {
      this.logger?.log(`Requesting access token for appId: ${this.appId}`);
      const response = await requestUrl({
        url: `${url}?${params.toString()}`,
        method: 'GET',
      });
      
      const data = response.json as AccessTokenResponse;
      
      if (data && data.access_token) {
        this.accessToken = data.access_token;
        // Set expiration 5 minutes before actual expiration to be safe
        this.tokenExpiration = Date.now() + (data.expires_in * 1000) - 300000;
        this.logger?.log('Access token retrieved successfully');
        return this.accessToken;
      } else {
        throw new Error(`Failed to retrieve access token: ${data.errcode} ${data.errmsg}`);
      }
    } catch (error) {
      this.logger?.log(`Error fetching access token: ${error}`, 'ERROR');
      throw error;
    }
  }

  async uploadImage(buffer: ArrayBuffer | Buffer, filename: string): Promise<UploadMaterialResponse> {
    const accessToken = await this.getAccessToken();
    const url = this.getUrl('/cgi-bin/material/add_material');
    
    // requestUrl doesn't support FormData directly as easily as axios for multipart
    // But we can construct the body manually or use a simpler approach if the proxy supports it.
    // However, for standard WeChat API, it's multipart/form-data.
    
    // Note: requestUrl in Obsidian handles some complexity, but multipart can be tricky.
    // For now, let's use a boundary-based manual construction if needed, 
    // or keep using axios ONLY for the image upload if requestUrl is too restrictive,
    // but the user's issue was with the token request (GET).
    
    // Actually, let's try to implement it with requestUrl for consistency and CORS bypassing.
    
    const boundary = '----ObsidianBoundary' + Math.random().toString(36).substring(2);
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="media"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`;
    const footer = `\r\n--${boundary}--\r\n`;
    
    const headerUint8 = new TextEncoder().encode(header);
    const footerUint8 = new TextEncoder().encode(footer);
    const contentUint8 = new Uint8Array(buffer);
    
    const totalLength = headerUint8.length + contentUint8.length + footerUint8.length;
    const body = new Uint8Array(totalLength);
    body.set(headerUint8, 0);
    body.set(contentUint8, headerUint8.length);
    body.set(footerUint8, headerUint8.length + contentUint8.length);

    try {
        const response = await requestUrl({
            url: `${url}?access_token=${accessToken}&type=image`,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body.buffer
        });
        
        const data = response.json as UploadMaterialResponse;
        if (data.errcode) {
            throw new Error(`WeChat Error: ${data.errcode} ${data.errmsg}`);
        }
        return data;
    } catch (error) {
        this.logger?.log(`Error uploading image: ${error}`, 'ERROR');
        throw error;
    }
  }

  async createDraft(articles: WeChatArticle[]): Promise<string> {
    const accessToken = await this.getAccessToken();
    const url = this.getUrl('/cgi-bin/draft/add');
    
    try {
      const response = await requestUrl({
        url: `${url}?access_token=${accessToken}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ articles })
      });
      
      const data = response.json as AddDraftResponse;
      if (data.errcode) {
          throw new Error(`WeChat Error: ${data.errcode} ${data.errmsg}`);
      }
      return data.media_id;
    } catch (error) {
      this.logger?.log(`Error creating draft: ${error}`, 'ERROR');
      throw error;
    }
  }
}