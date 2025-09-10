import ImageKit from 'imagekit-javascript';

class ImageKitService {
  private imagekit: ImageKit;
  private urlEndpoint: string;

  constructor() {
    this.urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_imagekit_id/';
    
    this.imagekit = new ImageKit({
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'your_public_key',
      urlEndpoint: this.urlEndpoint
    });
  }

  // Generate optimized image URL from S3 path
  getOptimizedImageUrl(s3Key: string, transformations?: any): string {
    if (!s3Key) return '';
    
    return this.imagekit.url({
      path: s3Key, // S3 key will be used as ImageKit path
      transformation: [
        {
          height: transformations?.height || 400,
          width: transformations?.width || 400,
          crop: 'at_smart_crop',
          quality: transformations?.quality || 80,
          format: 'auto'
        }
      ]
    });
  }

  // Get profile image URL with different sizes
  getProfileImageUrl(s3Key: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    if (!s3Key) return '';
    
    const sizes = {
      small: { width: 64, height: 64 },
      medium: { width: 150, height: 150 },
      large: { width: 300, height: 300 }
    };

    const { width, height } = sizes[size];

    return this.imagekit.url({
      path: s3Key,
      transformation: [
        {
          height,
          width,
          crop: 'at_smart_crop',
          radius: 'max', // Make it circular
          quality: 90,
          format: 'auto'
        }
      ]
    });
  }
}

export const imageKitService = new ImageKitService();
