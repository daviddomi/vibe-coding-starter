import { NextRequest } from 'next/server';
import { searchSymbols } from '@/lib/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  if (!q.trim()) {
    return Response.json([]);
  }

  try {
    const results = await searchSymbols(q);
    return Response.json(results);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Finnhub search failed';
    if (message.includes('FINNHUB_API_KEY')) {
      return Response.json({ error: message }, { status: 503 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
