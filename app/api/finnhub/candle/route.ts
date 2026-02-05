import { NextRequest } from 'next/server';
import { fetchCandle } from '@/lib/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');
  const resolution = (request.nextUrl.searchParams.get('resolution') ?? 'D') as '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

  if (!symbol?.trim()) {
    return Response.json({ error: 'Missing symbol' }, { status: 400 });
  }
  const fromNum = from ? parseInt(from, 10) : Math.floor(Date.now() / 1000) - 30 * 24 * 3600;
  const toNum = to ? parseInt(to, 10) : Math.floor(Date.now() / 1000);
  if (Number.isNaN(fromNum) || Number.isNaN(toNum)) {
    return Response.json({ error: 'Invalid from/to' }, { status: 400 });
  }

  try {
    const candle = await fetchCandle(symbol.trim(), resolution, fromNum, toNum);
    return Response.json(candle ?? { error: 'No data' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Finnhub candle failed';
    if (message.includes('FINNHUB_API_KEY')) {
      return Response.json({ error: message }, { status: 503 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
