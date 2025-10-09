import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

import { AuthenticationError, requireApiAuthentication } from '../../lib/server/auth';
import { checkRateLimit, getClientKey } from '../../lib/server/rate-limit';
import { uploadBase64Image } from '../../lib/server/storage';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(getClientKey(req), {
    max: 10,
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

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  try {
    const enhancedPrompt = `${prompt}. Style: Professional medical photography, clean and modern, high quality, photorealistic, bright and welcoming atmosphere, no text or logos`;

    const response = await openai.images.generate({
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    const openAiImage = response.data[0]?.b64_json;

    if (!openAiImage) {
      throw new Error('No image data returned from OpenAI');
    }

    const uploadResult = await uploadBase64Image({
      base64Data: openAiImage,
      contentType: 'image/png',
      folder: 'blog-images',
      makePublic: true,
    });

    res.status(200).json({
      imageUrl: uploadResult.publicUrl,
      storagePath: uploadResult.filePath,
      prompt: enhancedPrompt,
    });
  } catch (error) {
    console.error('Error generating image:', error);

    if (error instanceof Error && error.message.includes('billing')) {
      return res.status(402).json({
        error: 'Image generation requires an active OpenAI subscription with DALL-E access',
        details: 'Please ensure your OpenAI account has access to DALL-E API',
      });
    }

    const status = error instanceof AuthenticationError ? error.statusCode : 500;
    res.status(status).json({
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
