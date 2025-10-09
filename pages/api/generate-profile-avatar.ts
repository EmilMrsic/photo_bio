import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

import { AuthenticationError, requireApiAuthentication } from '../../lib/server/auth';
import { checkRateLimit, getClientKey } from '../../lib/server/rate-limit';

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

  const rateResult = checkRateLimit(getClientKey(req), { max: 20, windowMs: 60_000 });
  if (!rateResult.success) {
    return res.status(429).json({ error: 'Rate limit exceeded', retryAfterSeconds: rateResult.retryAfterSeconds });
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

  const { userId } = req.body;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    // Generate a unique brain image for each user based on their ID
    const prompt = `Abstract digital brain illustration, vibrant neural network patterns, modern minimalist style, colorful synapses, geometric shapes, professional medical art, clean design, no text, suitable for profile picture, circular composition, gradient colors from purple to blue to teal`;

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '256x256',
      response_format: 'url',
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    res.status(200).json({
      imageUrl,
      prompt
    });

  } catch (error) {
    console.error('Error generating profile avatar:', error);

    if (error instanceof Error && error.message.includes('billing')) {
      return res.status(402).json({
        error: 'Image generation requires an active OpenAI subscription with DALL-E access',
        details: 'Please ensure your OpenAI account has access to DALL-E API',
      });
    }

    const status = error instanceof AuthenticationError ? error.statusCode : 500;
    res.status(status).json({
      error: 'Failed to generate profile avatar',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
