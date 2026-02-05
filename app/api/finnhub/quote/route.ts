import { NextRequest } from 'next/server';
import { fetchQuote } from '@/lib/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');
  if (!symbol?.trim()) {
    return Response.json({ error: 'Missing symbol' }, { status: 400 });
  }

  try {
    const quote = await fetchQuote(symbol.trim());
    return Response.json(quote ?? { error: 'No data' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Finnhub quote failed';
    if (message.includes('FINNHUB_API_KEY')) {
      return Response.json({ error: message }, { status: 503 });
    }
    return Response.json({ error: message }, { status: 500 });
  }
}
