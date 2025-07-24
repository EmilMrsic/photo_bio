import { NextApiRequest, NextApiResponse } from 'next';

const XANO_API_BASE = 'https://xbwz-pynn-hycq.n7e.xano.io/api:CFT-MENJ';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    title, 
    content, 
    keywords, 
    imageUrl,
    slug 
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    // Generate slug if not provided
    const blogSlug = slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create blog post in Xano
    const response = await fetch(
      `${XANO_API_BASE}/blogs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          keywords: keywords || [],
          image_url: imageUrl || '',
          slug: blogSlug,
          published: true,
          published_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to save blog:', errorData);
      throw new Error('Failed to save blog post');
    }

    const savedBlog = await response.json();

    res.status(200).json({ 
      success: true,
      blog: savedBlog,
      slug: blogSlug
    });

  } catch (error) {
    console.error('Error saving blog:', error);
    res.status(500).json({ 
      error: 'Failed to save blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
