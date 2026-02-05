/**
 * Sample watchlist data. Replace with API or user preferences in production.
 */

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousClose: number;
  dayChangePercent: number;
  sparklineData?: number[];
}

export const watchlistItems: WatchlistItem[] = [
  {
    id: 'w1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 128.5,
    previousClose: 125.2,
    dayChangePercent: 2.64,
    sparklineData: [124, 125, 126, 127, 127.5, 128, 128.5],
  },
  {
    id: 'w2',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 189.2,
    previousClose: 187.0,
    dayChangePercent: 1.18,
    sparklineData: [186, 187, 187.5, 188, 188.5, 189, 189.2],
  },
  {
    id: 'w3',
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 525.0,
    previousClose: 518.5,
    dayChangePercent: 1.25,
    sparklineData: [516, 518, 520, 522, 523, 524, 525],
  },
  {
    id: 'w4',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.3,
    previousClose: 255.1,
    dayChangePercent: -2.66,
    sparklineData: [254, 252, 250, 251, 249, 248.5, 248.3],
  },
];
