import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';

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

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  try {
    // Enhance the prompt for better DALL-E results
    const enhancedPrompt = `${prompt}. Style: Professional medical photography, clean and modern, high quality, photorealistic, bright and welcoming atmosphere, no text or logos`;

    const response = await openai.images.generate({
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const openAiImageUrl = response.data[0]?.url;

    if (!openAiImageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Download the image from OpenAI and save locally
    const timestamp = Date.now();
    const filename = `ai-generated-${timestamp}.png`;
    const localPath = path.join(process.cwd(), 'public', 'blog-images', filename);
    const publicUrl = `/blog-images/${filename}`;

    // Download image from OpenAI
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(localPath);
      https.get(openAiImageUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      }).on('error', (err) => {
        fs.unlink(localPath, () => {}); // Delete the file on error
        reject(err);
      });
    });

    res.status(200).json({
      imageUrl: publicUrl,
      prompt: enhancedPrompt
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Check if it's an OpenAI API error
    if (error instanceof Error && error.message.includes('billing')) {
      return res.status(402).json({ 
        error: 'Image generation requires an active OpenAI subscription with DALL-E access',
        details: 'Please ensure your OpenAI account has access to DALL-E API'
      });
    }

    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Configure larger body size limit for potential future base64 image handling
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
