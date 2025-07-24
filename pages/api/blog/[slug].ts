import { NextApiRequest, NextApiResponse } from 'next';

const XANO_API_BASE = 'https://xbwz-pynn-hycq.n7e.xano.io/api:CFT-MENJ';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    // Fetch blog by slug from Xano
    const response = await fetch(`${XANO_API_BASE}/blogs?slug=${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const blogs = await response.json();
    
    // Xano returns an array, we need the first item
    const blog = Array.isArray(blogs) && blogs.length > 0 ? blogs[0] : null;
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
