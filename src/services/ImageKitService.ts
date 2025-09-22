import ImageKit from 'imagekit-javascript';


type Size = 'small' | 'medium' | 'large'

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
          crop: 'at_least',
          quality: transformations?.quality || 80,
          format: 'auto'
        }
      ]
    });
  }

  // Get profile image URL with different sizes


 getProfileImageUrl(
  s3Key: string,
  width?: number,
  height?: number,
  options?: {
    radius?: number | "max";   // corner roundness or full circle
    crop?: "maintain_ratio" | "force" | "at_least" | "at_max" | "extract";
    quality?: number;          // optional, defaults to 90
    format?: "auto" | "webp" | "jpg" | "png";
  }
): string {
  if (!s3Key) return '';

  return this.imagekit.url({
    path: s3Key,
    transformation: [
      {
        width,
        height,
        crop: options?.crop ?? "max",
        radius: options?.radius ?? 0,
        quality: options?.quality ?? 90,
        format: options?.format ?? "auto"
      }
    ]
  });
}
}

export const imageKitService = new ImageKitService();
