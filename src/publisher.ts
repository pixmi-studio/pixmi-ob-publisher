import { WeChatApiClient, WeChatArticle } from './wechat-api';
import { MarkdownParser } from './markdown-parser';
import { CssConverter } from './css-converter';

export type ImageReader = (path: string) => Promise<ArrayBuffer>;

export class Publisher {
  private cssConverter: CssConverter;

  constructor(
    private apiClient: WeChatApiClient,
    private parser: MarkdownParser
  ) {
    this.cssConverter = new CssConverter();
  }

  async publish(title: string, markdown: string, imageReader: ImageReader, thumbnailPath?: string, css?: string): Promise<string> {
    // 1. Extract images
    const images = this.parser.extractImages(markdown);
    
    // 2. Upload images
    const urlMap = new Map<string, string>();
    let thumbMediaId = '';

    // If thumbnailPath is provided, upload it first as a permanent material and set it as thumbMediaId
    if (thumbnailPath) {
        try {
            const buffer = await imageReader(thumbnailPath);
            const filename = thumbnailPath.split('/').pop() || 'thumb.jpg';
            // Use type 'image' for thumbnail to avoid 64KB limit. 
            // Draft Box API accepts permanent image media_id as thumb_media_id.
            const result = await this.apiClient.uploadMaterial(buffer, filename, 'image');
            thumbMediaId = result.media_id;
        } catch (error) {
            console.error(`Failed to upload thumbnail ${thumbnailPath}:`, error);
        }
    }

    for (const imagePath of images) {
        // Skip remote images for now, or handle them differently
        if (imagePath.startsWith('http')) continue;

        // Skip if already uploaded for content
        if (urlMap.has(imagePath)) continue;

        try {
            const buffer = await imageReader(imagePath);
            const filename = imagePath.split('/').pop() || 'image.jpg';
            
            // Upload for content (using uploadimg API which returns a URL and doesn't count towards material limit)
            const url = await this.apiClient.uploadImageForContent(buffer, filename);
            urlMap.set(imagePath, url);
            
            // Use the first image as the thumbnail if not already set via thumbnailPath
            if (!thumbMediaId) {
                // Must be a permanent material for Draft Box
                const result = await this.apiClient.uploadMaterial(buffer, filename, 'image');
                thumbMediaId = result.media_id;
            }
        } catch (error) {
            console.error(`Failed to upload image ${imagePath}:`, error);
        }
    }

    // 3. Replace URLs and render HTML
    let content = this.parser.renderWithReplacements(markdown, urlMap);

    // Apply CSS if provided
    if (css) {
        content = this.cssConverter.convert(content, css);
    }

    // 4. Create Draft
    // If no image found, we might need a default thumbMediaId or handle error.
    // WeChat requires a thumb_media_id.
    // For MVP, if no thumb, maybe we fail or require user to provide one.
    // Let's assume for now we must have one.
    
    if (!thumbMediaId) {
        throw new Error('A thumbnail image is required to publish to WeChat. Please include at least one image in your article or specify one in the frontmatter (e.g., thumb: image.jpg).');
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