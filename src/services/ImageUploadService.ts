

import httpClient from './axios/httpClient';
import axios from 'axios';

export interface UploadResponse {
    uploadUrl: string;
    imageKey: string;
    publicUrl: string;
}

export class ImageUploadService {
    // Generate pre-signed URL for S3 upload
    static async generateUploadUrl(fileExtension: string): Promise<UploadResponse> {
        const response = await httpClient.post('/user/upload-url', {
            fileExtension
        });
        return response.data.data;
    }

    // Upload file directly to S3
    static async uploadToS3(
        uploadUrl: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<void> {
        await axios.put(uploadUrl, file, {
            headers: {
                'Content-Type': file.type,
                // 'ACL': 'public-read'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            }
        });
    }

    static async confirmUpload(imageKey: string, publicUrl: string): Promise<void> {
        await httpClient.post('/user/confirm-upload', {
            imageKey,
            publicUrl
        });
    }

    static async uploadProfileImage(
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<string> {


        if (!file.type.startsWith('image/')) {
            throw new Error('Please select an image file');
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('File size must be less than 5MB');
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPEG, PNG, and WebP images are allowed');
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

        const { uploadUrl, imageKey, publicUrl } = await this.generateUploadUrl(fileExtension);

        await this.uploadToS3(uploadUrl, file, onProgress);

        await this.confirmUpload(imageKey, publicUrl);

        // Return the S3 key for ImageKit optimization
        return imageKey;
    }
}
