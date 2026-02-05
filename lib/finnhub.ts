/**
 * Finnhub API client (server-side only). Use via API routes so the key is never exposed.
 */

const BASE = 'https://finnhub.io/api/v1';

function getApiKey(): string {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new Error('FINNHUB_API_KEY is not set. Add it to .env.local (see .env.example).');
  }
  return key;
}

export interface FinnhubQuote {
  c: number;   // current price
  d: number;   // change
  dp: number;  // percent change
  h: number;   // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp
}

export async function fetchQuote(symbol: string): Promise<FinnhubQuote | null> {
  const key = getApiKey();
  const res = await fetch(
    `${BASE}/quote?symbol=${encodeURIComponent(symbol.toUpperCase())}&token=${key}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (data.c == null) return null;
  return data as FinnhubQuote;
}

export interface FinnhubCandle {
  s: string;
  t: number[];
  o: number[];
  h: number[];
  l: number[];
  c: number[];
  v: number[];
}

export async function fetchCandle(
  symbol: string,
  resolution: '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M' = 'D',
  from: number,
  to: number,
): Promise<FinnhubCandle | null> {
  const key = getApiKey();
  const url = `${BASE}/stock/candle?symbol=${encodeURIComponent(symbol.toUpperCase())}&resolution=${resolution}&from=${from}&to=${to}&token=${key}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.s !== 'ok' || !Array.isArray(data.c) || data.c.length === 0) return null;
  return data as FinnhubCandle;
}

export interface FinnhubSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export async function searchSymbols(q: string): Promise<FinnhubSearchResult[]> {
  if (!q.trim()) return [];
  const key = getApiKey();
  const res = await fetch(
    `${BASE}/search?q=${encodeURIComponent(q.trim())}&token=${key}`,
    { next: { revalidate: 300 } },
  );
  if (!res.ok) return [];
  const data = await res.json();
  const result = data.result as FinnhubSearchResult[] | undefined;
  return Array.isArray(result) ? result : [];
}

export interface FinnhubProfile {
  name: string;
  ticker: string;
  /** Exchange */
  exchange?: string;
  /** Company logo image URL */
  logo?: string;
  /** Industry */
  finnhubIndustry?: string;
}

export async function fetchProfile(symbol: string): Promise<FinnhubProfile | null> {
  const key = getApiKey();
  const res = await fetch(
    `${BASE}/stock/profile2?symbol=${encodeURIComponent(symbol.toUpperCase())}&token=${key}`,
    { next: { revalidate: 86400 } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.name) return null;
  return data as FinnhubProfile;
}
