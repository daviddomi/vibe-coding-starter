import { NextRequest } from 'next/server';
import { fetchProfile } from '@/lib/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  if (!symbol?.trim()) {
    return Response.json({ error: 'Missing symbol' }, { status: 400 });
  }

  try {
    const profile = await fetchProfile(symbol.trim());
    return Response.json(profile ?? { error: 'No data' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Finnhub profile failed';
    if (message.includes('FINNHUB_API_KEY')) {
      return Response.json({ error: message }, { status: 503 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
