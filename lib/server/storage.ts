import { randomUUID } from 'crypto';
import path from 'path';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || undefined,
});

export interface UploadImageOptions {
  base64Data: string;
  contentType?: string;
  filename?: string;
  folder?: string;
  expiresInSeconds?: number;
  makePublic?: boolean;
}

export interface UploadImageResult {
  filePath: string;
  publicUrl: string;
}

export async function uploadBase64Image(options: UploadImageOptions): Promise<UploadImageResult> {
  const bucketName = process.env.GCS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME is not configured');
  }

  const buffer = Buffer.from(options.base64Data, 'base64');
  const extension = inferExtension(options.contentType);
  const safeFolder = sanitizePath(options.folder);
  const filename = sanitizeFilename(options.filename) || `${Date.now()}-${randomUUID()}${extension}`;
  const objectPath = safeFolder ? `${safeFolder}/${filename}` : filename;
  const contentType = options.contentType || inferContentType(extension);

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(objectPath);

  await file.save(buffer, {
    contentType,
    resumable: false,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  if (options.makePublic) {
    await file.makePublic();
    return {
      filePath: objectPath,
      publicUrl: `https://storage.googleapis.com/${bucket.name}/${encodeURI(objectPath)}`,
    };
  }

  const expiresInSeconds = options.expiresInSeconds ?? 60 * 60 * 24 * 7; // 7 days default
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInSeconds * 1000,
  });

  return {
    filePath: objectPath,
    publicUrl: signedUrl,
  };
}

function sanitizePath(value?: string): string {
  if (!value) return '';
  return value.replace(/\\+/g, '/').replace(/(^\/+|\/+$)/g, '').replace(/\.\./g, '');
}

function sanitizeFilename(value?: string): string | undefined {
  if (!value) return undefined;
  const base = path.basename(value);
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function inferExtension(contentType?: string): string {
  switch (contentType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    default:
      return '.png';
  }
}

function inferContentType(extension: string): string {
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}
