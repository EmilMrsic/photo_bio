import { NextApiRequest, NextApiResponse } from 'next';

const XANO_API_BASE = 'https://xbwz-pynn-hycq.n7e.xano.io/api:CFT-MENJ';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    
    // Create a timeout promise
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    // Fetch blogs from Xano with timeout
    const response = await fetch(`${XANO_API_BASE}/blogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Failed to fetch blogs from Xano');
      return res.status(200).json([]); // Return empty array on error
    }

    const blogs = await response.json();
    res.status(200).json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    
    if (error.name === 'AbortError') {
      return res.status(200).json([]); // Return empty array on timeout
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch blogs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
