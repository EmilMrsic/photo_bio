import { NextApiRequest, NextApiResponse } from 'next';

import { AuthenticationError, requireApiAuthentication } from '../../lib/server/auth';
import { checkRateLimit, getClientKey } from '../../lib/server/rate-limit';
import { uploadBase64Image } from '../../lib/server/storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(getClientKey(req), {
    max: 15,
    windowMs: 60_000,
  });

  if (!rateResult.success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfterSeconds: rateResult.retryAfterSeconds,
    });
  }

  try {
    await requireApiAuthentication(req);
  } catch (error) {
    const status = error instanceof AuthenticationError ? error.statusCode : 401;
    return res.status(status).json({
      error: 'Unauthorized',
      details: error instanceof Error ? error.message : 'Missing credentials',
    });
  }

  const { imageData, filename } = req.body;

  if (!imageData || typeof imageData !== 'string') {
    return res.status(400).json({ error: 'Invalid image data' });
  }

  const base64Match = imageData.match(/^data:([^;]+);base64,(.+)$/);
  if (!base64Match) {
    return res.status(400).json({ error: 'Image data must be a base64 data URL' });
  }

  const [, contentType, base64Data] = base64Match;

  try {
    const uploadResult = await uploadBase64Image({
      base64Data,
      contentType,
      filename,
      folder: 'blog-images',
      makePublic: true,
    });

    res.status(200).json({
      imageUrl: uploadResult.publicUrl,
      storagePath: uploadResult.filePath,
      filename: filename || uploadResult.filePath.split('/').pop(),
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    const status = error instanceof AuthenticationError ? error.statusCode : 500;
    res.status(status).json({
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
