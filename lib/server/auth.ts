import type { NextApiRequest } from 'next';

export class AuthenticationError extends Error {
  statusCode = 401;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export interface AuthContext {
  memberId: string | null;
  tokenType: 'memberstack' | 'api-key';
  payload?: unknown;
}

async function verifyMemberstackToken(token: string): Promise<AuthContext> {
  const secretKey = process.env.MEMBERSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new AuthenticationError('Memberstack server key is not configured');
  }

  const endpoint =
    process.env.MEMBERSTACK_VERIFY_ENDPOINT ||
    'https://api.memberstack.com/v2/members/verify-access-token';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': secretKey,
    },
    body: JSON.stringify({ accessToken: token, token }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new AuthenticationError(
      `Memberstack verification failed (${response.status}): ${detail}`
    );
  }

  const data = await response.json().catch(() => ({}));
  const memberId =
    data?.memberId ||
    data?.member_id ||
    data?.member?.id ||
    data?.data?.memberId ||
    null;

  if (!memberId) {
    throw new AuthenticationError('Memberstack token verification did not return a member id');
  }

  return {
    memberId,
    tokenType: 'memberstack',
    payload: data,
  };
}

export async function requireApiAuthentication(req: NextApiRequest): Promise<AuthContext> {
  const authorization = req.headers.authorization;
  const apiToken = process.env.API_ACCESS_TOKEN;

  if (authorization?.startsWith('Bearer ')) {
    const token = authorization.substring('Bearer '.length).trim();

    if (apiToken && token === apiToken) {
      return {
        memberId: null,
        tokenType: 'api-key',
      };
    }

    return verifyMemberstackToken(token);
  }

  const headerKey = req.headers['x-api-key'];
  if (typeof headerKey === 'string' && apiToken && headerKey === apiToken) {
    return {
      memberId: null,
      tokenType: 'api-key',
    };
  }

  throw new AuthenticationError('Missing or invalid authentication token');
}
