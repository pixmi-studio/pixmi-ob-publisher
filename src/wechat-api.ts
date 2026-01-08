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

interface UploadTempMediaResponse {
  type: 'image' | 'video' | 'voice' | 'thumb';
  media_id: string;
  created_at: number; // Unix timestamp
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

  async uploadMaterial(buffer: ArrayBuffer | Buffer, filename: string, type: 'image' | 'video' | 'voice' | 'thumb' = 'image'): Promise<UploadMaterialResponse> {
    const accessToken = await this.getAccessToken();
    const url = this.getUrl('/cgi-bin/material/add_material');
    
    const boundary = '----ObsidianBoundary' + Math.random().toString(36).substring(2);
    let contentType = 'image/png';
    if (type === 'thumb') contentType = 'image/jpeg';
    
    const header = `--${boundary}\r\nContent-Disposition: form-data; name="media"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`;
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
            url: `${url}?access_token=${accessToken}&type=${type}`,
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
        this.logger?.log(`Error uploading material (${type}): ${error}`, 'ERROR');
        throw error;
    }
  }

  async uploadImageForContent(buffer: ArrayBuffer | Buffer, filename: string): Promise<string> {
    const accessToken = await this.getAccessToken();
    const url = this.getUrl('/cgi-bin/media/uploadimg');
    
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
            url: `${url}?access_token=${accessToken}`,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body.buffer
        });
        
        // uploadimg returns { url: "..." }
        const data = response.json as { url: string, errcode?: number, errmsg?: string };
        if (data.errcode) {
            throw new Error(`WeChat Error: ${data.errcode} ${data.errmsg}`);
        }
        return data.url;
    } catch (error) {
        this.logger?.log(`Error uploading image for content: ${error}`, 'ERROR');
        throw error;
    }
  }

  async uploadTempMedia(buffer: ArrayBuffer | Buffer, type: 'image' | 'video' | 'voice' | 'thumb'): Promise<string> {
    const accessToken = await this.getAccessToken();
    const url = this.getUrl('/cgi-bin/media/upload');

    const boundary = '----ObsidianBoundary' + Math.random().toString(36).substring(2);
    // Determine content type based on media type
    let contentType = 'application/octet-stream';
    if (type === 'image' || type === 'thumb') contentType = 'image/jpeg'; // Assuming common image types
    else if (type === 'video') contentType = 'video/mp4';
    else if (type === 'voice') contentType = 'audio/amr'; // Common voice format

    // Filename can be generic for temp media, or derive from original if available
    const filename = `temp_media.${type === 'image' || type === 'thumb' ? 'jpg' : (type === 'video' ? 'mp4' : 'amr')}`;

    const header = `--${boundary}\r\nContent-Disposition: form-data; name="media"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`;
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
        url: `${url}?access_token=${accessToken}&type=${type}`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body: body.buffer
      });
      
      const data = response.json as UploadTempMediaResponse;
      if (data.errcode) {
        throw new Error(`WeChat Error: ${data.errcode} ${data.errmsg}`);
      }
      return data.media_id;
    } catch (error) {
      this.logger?.log(`Error uploading temporary media (${type}): ${error}`, 'ERROR');
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