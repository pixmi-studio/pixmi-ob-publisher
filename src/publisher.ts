import { WeChatApiClient, WeChatArticle } from './wechat-api';
import { MarkdownParser } from './markdown-parser';

export type ImageReader = (path: string) => Promise<ArrayBuffer>;

export class Publisher {
  constructor(
    private apiClient: WeChatApiClient,
    private parser: MarkdownParser
  ) {}

  async publish(title: string, markdown: string, imageReader: ImageReader): Promise<string> {
    // 1. Extract images
    const images = this.parser.extractImages(markdown);
    
    // 2. Upload images
    const urlMap = new Map<string, string>();
    let thumbMediaId = '';

    for (const imagePath of images) {
        // Skip remote images for now, or handle them differently
        if (imagePath.startsWith('http')) continue;

        try {
            const buffer = await imageReader(imagePath);
            // We need a filename. Let's use the path basename or default
            const filename = imagePath.split('/').pop() || 'image.jpg';
            const result = await this.apiClient.uploadImage(buffer, filename);
            
            urlMap.set(imagePath, result.url);
            
            // Use the first image as the thumbnail
            if (!thumbMediaId) {
                thumbMediaId = result.media_id;
            }
        } catch (error) {
            console.error(`Failed to upload image ${imagePath}:`, error);
            // Optionally continue or throw? 
            // For MVP, let's continue but maybe the image won't show.
        }
    }

    // 3. Replace URLs and render HTML
    const content = this.parser.renderWithReplacements(markdown, urlMap);

    // 4. Create Draft
    // If no image found, we might need a default thumbMediaId or handle error.
    // WeChat requires a thumb_media_id.
    // For MVP, if no thumb, maybe we fail or require user to provide one.
    // Let's assume for now we must have one.
    
    if (!thumbMediaId) {
        throw new Error('A thumbnail image is required to publish to WeChat.');
    }

    const article: WeChatArticle = {
        title,
        content,
        thumb_media_id: thumbMediaId,
        content_source_url: '', // Optional
        need_open_comment: 1,
        only_fans_can_comment: 0
    };

    return await this.apiClient.createDraft([article]);
  }
}