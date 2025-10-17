import type { NextApiRequest, NextApiResponse } from 'next';
import { pbmProtocolAPI } from '../../../lib/xano';
import { clientAPI } from '../../../lib/xano';

const XANO_API_BASE = process.env.NEXT_PUBLIC_XANO_API_URL || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  try {
    // Optional scope: limit to a single client via ?clientId=123
    const clientIdParam = req.query.clientId as string | undefined;

    let updated = 0;

    // Fetch all protocols once
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const resp = await fetch(`${XANO_API_BASE}/pbm_protocols`, { method: 'GET', headers });
    if (!resp.ok) {
      const errText = await resp.text();
      return res.status(502).json({ ok: false, message: `Failed to fetch protocols: ${errText}` });
    }
    const allProtocols: any[] = await resp.json();

    // Group by client id (optionally filter to a single client)
    const byClient = new Map<number, any[]>();
    for (const p of allProtocols) {
      const cid = p.clients_id;
      if (!cid) continue;
      if (clientIdParam && String(cid) !== String(clientIdParam)) continue;
      if (!byClient.has(cid)) byClient.set(cid, []);
      byClient.get(cid)!.push(p);
    }

    // For each client, relabel protocols by created_at ascending as Map 1..N
    for (const [cid, list] of byClient.entries()) {
      const sorted = [...list].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      for (let i = 0; i < sorted.length; i++) {
        const desired = `Map ${i + 1}`;
        if (sorted[i].label !== desired) {
          await pbmProtocolAPI.updateProtocolLabel(sorted[i].id!, desired);
          updated++;
        }
      }
    }

    return res.status(200).json({ ok: true, updated, clientsProcessed: byClient.size });
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: err?.message || 'Failed to relabel protocols' });
  }
}


