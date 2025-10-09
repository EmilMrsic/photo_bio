import { NextApiRequest, NextApiResponse } from 'next';

import { AuthenticationError, requireApiAuthentication } from '../../lib/server/auth';
import { checkRateLimit, getClientKey } from '../../lib/server/rate-limit';

const XANO_API_BASE =
  process.env.XANO_API_BASE ||
  process.env.NEXT_PUBLIC_XANO_API_URL ||
  (process.env as Record<string, string | undefined>).NEXT_PUBLIC_XANO_API ||
  '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rateResult = checkRateLimit(getClientKey(req), { max: 10, windowMs: 60_000 });
  if (!rateResult.success) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfterSeconds: rateResult.retryAfterSeconds,
    });
  }

  let authContext: Awaited<ReturnType<typeof requireApiAuthentication>>;
  try {
    authContext = await requireApiAuthentication(req);
  } catch (error) {
    const status = error instanceof AuthenticationError ? error.statusCode : 401;
    return res.status(status).json({
      error: 'Unauthorized',
      details: error instanceof Error ? error.message : 'Missing credentials',
    });
  }

  if (!XANO_API_BASE) {
    return res.status(500).json({ error: 'Xano API base URL is not configured' });
  }

  const {
    title,
    content,
    keywords,
    imageUrl,
    slug,
  } = req.body as {
    title?: string;
    content?: string;
    keywords?: string[];
    imageUrl?: string;
    slug?: string;
  };

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const blogSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const response = await fetch(`${XANO_API_BASE}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authContext.memberId ? { 'X-Memberstack-Member-Id': authContext.memberId } : {}),
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
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to save blog:', errorData);
      throw new Error('Failed to save blog post');
    }

    const savedBlog = await response.json();

    res.status(200).json({
      success: true,
      blog: savedBlog,
      slug: blogSlug,
      authorMemberId: authContext.memberId,
    });
  } catch (error) {
    console.error('Error saving blog:', error);
    const status = error instanceof AuthenticationError ? error.statusCode : 500;
    res.status(status).json({
      error: 'Failed to save blog post',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
