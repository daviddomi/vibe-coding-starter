/**
 * Client-side helpers that call our Finnhub proxy API routes (key stays server-side).
 */

export interface QuoteData {
  c: number;
  d: number;
  dp: number;
  pc: number;
}

export async function fetchQuoteFromAPI(symbol: string): Promise<QuoteData | null> {
  const res = await fetch(`/api/finnhub/quote?symbol=${encodeURIComponent(symbol)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error || data.c == null) return null;
  return {
    c: data.c,
    d: data.d,
    dp: data.dp,
    pc: data.pc,
  };
}

export async function fetchCandleFromAPI(
  symbol: string,
  from?: number,
  to?: number,
): Promise<number[] | null> {
  const params = new URLSearchParams({ symbol });
  if (from != null) params.set('from', String(from));
  if (to != null) params.set('to', String(to));
  const res = await fetch(`/api/finnhub/candle?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error || !Array.isArray(data.c)) return null;
  return data.c as number[];
}

export interface ProfileData {
  name: string;
  ticker: string;
}

export async function fetchProfileFromAPI(symbol: string): Promise<ProfileData | null> {
  const res = await fetch(`/api/finnhub/profile?symbol=${encodeURIComponent(symbol)}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error || !data.name) return null;
  return { name: data.name, ticker: data.ticker };
}
