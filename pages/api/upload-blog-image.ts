import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageData, filename } = req.body;

  if (!imageData || typeof imageData !== 'string') {
    return res.status(400).json({ error: 'Invalid image data' });
  }

  try {
    // Extract base64 data
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate filename
    const timestamp = Date.now();
    const ext = filename ? path.extname(filename) : '.png';
    const newFilename = `uploaded-${timestamp}${ext}`;
    const localPath = path.join(process.cwd(), 'public', 'blog-images', newFilename);
    const publicUrl = `/blog-images/${newFilename}`;

    // Save file
    fs.writeFileSync(localPath, buffer);

    res.status(200).json({
      imageUrl: publicUrl,
      filename: newFilename
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
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
