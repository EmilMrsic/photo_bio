import type { NextApiRequest, NextApiResponse } from 'next';
import { providerAPI } from '../../lib/xano';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    console.log('[Prefetch] Looking up provider by email:', email);

    // Lookup provider in Xano by email
    const provider = await providerAPI.getProviderByEmail(email);

    if (provider) {
      console.log('[Prefetch] Provider found:', provider);

      // Cache the provider data in the response for client to store
      return res.status(200).json({
        found: true,
        provider: {
          id: provider.id,
          email: provider.email,
          first_name: provider.first_name,
          last_name: provider.last_name,
          name: provider.name,
          practice: provider.practice,
          practice_type: provider.practice_type,
          role: provider.role,
          onboarded: provider.onboarded,
        },
        hasPractice: !!provider.practice, // Check if practice field exists
        hasOnboarded: !!provider.onboarded, // Check if onboarded field is true
      });
    } else {
      console.log('[Prefetch] No provider found for email:', email);
      return res.status(200).json({
        found: false,
        hasPractice: false,
        hasOnboarded: false,
      });
    }
  } catch (error) {
    console.error('[Prefetch] Error looking up provider:', error);
    return res.status(500).json({ error: 'Failed to lookup provider' });
  }
}
