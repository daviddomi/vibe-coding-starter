/**
 * Sample data for StockTrac dashboard – portfolio, holdings, and performance.
 * Aligned with PRD: Total Value, Total Cost, Total/Today Gain-Loss, allocation, top movers.
 * Replace with API data in production.
 */

export const portfolioSummary = {
  totalValue: 284750.42,
  totalCost: 252410.42,
  totalGainLossAmount: 32340.0,
  totalGainLossPercent: 12.8,
  todayGainLossAmount: 3482.15,
  todayGainLossPercent: 1.24,
};

/** Historical portfolio value by range — granular points for sharp chart */
export const performanceHistoryByRange: Record<
  '5d' | '1mo' | '3mo' | '1y',
  { date: string; value: number }[]
> = {
  '5d': [
    { date: 'Mon', value: 279500 },
    { date: 'Tue', value: 281200 },
    { date: 'Wed', value: 282100 },
    { date: 'Thu', value: 283400 },
    { date: 'Fri', value: 284750 },
  ],
  '1mo': [
    { date: 'Feb 1', value: 268400 },
    { date: 'Feb 4', value: 269200 },
    { date: 'Feb 8', value: 272100 },
    { date: 'Feb 11', value: 270500 },
    { date: 'Feb 15', value: 269800 },
    { date: 'Feb 18', value: 273100 },
    { date: 'Feb 22', value: 278200 },
    { date: 'Feb 25', value: 276400 },
    { date: 'Mar 1', value: 281400 },
    { date: 'Mar 5', value: 279200 },
    { date: 'Mar 8', value: 279500 },
    { date: 'Mar 12', value: 282800 },
    { date: 'Mar 15', value: 284750 },
  ],
  '3mo': [
    { date: 'Jan 1', value: 252410 },
    { date: 'Jan 8', value: 255200 },
    { date: 'Jan 15', value: 261100 },
    { date: 'Jan 22', value: 258400 },
    { date: 'Feb 1', value: 268400 },
    { date: 'Feb 15', value: 269800 },
    { date: 'Feb 22', value: 278200 },
    { date: 'Mar 1', value: 281400 },
    { date: 'Mar 8', value: 279500 },
    { date: 'Mar 15', value: 284750 },
  ],
  '1y': [
    { date: 'Apr', value: 245000 },
    { date: 'May', value: 251000 },
    { date: 'Jun', value: 258000 },
    { date: 'Jul', value: 255500 },
    { date: 'Aug', value: 262000 },
    { date: 'Sep', value: 259000 },
    { date: 'Oct', value: 255000 },
    { date: 'Nov', value: 263000 },
    { date: 'Dec', value: 268000 },
    { date: 'Jan', value: 265000 },
    { date: 'Feb', value: 278200 },
    { date: 'Mar', value: 284750 },
  ],
};

/** Default range for dashboard chart */
export const defaultChartRange = '1mo' as const;
export type ChartRange = keyof typeof performanceHistoryByRange;

export type HoldingType = 'stock' | 'crypto';

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  type: HoldingType;
  quantity: number;
  price: number;
  previousClose: number;
  averageCost: number;
  value: number;
  totalCost: number;
  gainLossAmount: number;
  gainLossPercent: number;
  todayChangePercent: number;
  todayChangeAmount: number;
  platform?: string;
  /** Recent price history for sparkline (oldest to newest) */
  sparklineData?: number[];
}

function holding(
  id: string,
  symbol: string,
  name: string,
  type: HoldingType,
  quantity: number,
  price: number,
  previousClose: number,
  averageCost: number,
  platform?: string,
  sparklineData?: number[],
): Holding {
  const value = quantity * price;
  const totalCost = quantity * averageCost;
  const gainLossAmount = value - totalCost;
  const gainLossPercent = totalCost ? (gainLossAmount / totalCost) * 100 : 0;
  const todayChangeAmount = quantity * (price - previousClose);
  const todayChangePercent =
    previousClose ? ((price - previousClose) / previousClose) * 100 : 0;
  return {
    id,
    symbol,
    name,
    type,
    quantity,
    price,
    previousClose,
    averageCost,
    value,
    totalCost,
    gainLossAmount,
    gainLossPercent,
    todayChangePercent,
    todayChangeAmount,
    platform,
    sparklineData,
  };
}

export const holdings: Holding[] = [
  holding('1', 'AAPL', 'Apple Inc.', 'stock', 120, 189.84, 187.5, 165.2, undefined, [185, 186.2, 187.1, 188.5, 187.8, 189.2, 189.84]),
  holding('2', 'MSFT', 'Microsoft Corporation', 'stock', 85, 415.5, 412.0, 380.0, undefined, [408, 410, 412, 411.5, 413, 414, 415.5]),
  holding('3', 'ETH', 'Ethereum', 'crypto', 12.5, 3420.0, 3350.0, 3200.0, 'Coinbase', [3320, 3340, 3350, 3380, 3400, 3410, 3420]),
  holding('4', 'BTC', 'Bitcoin', 'crypto', 0.85, 67200.0, 66200.0, 58000.0, 'Coinbase', [65800, 66200, 66500, 66800, 67000, 67100, 67200]),
  holding('5', 'VOO', 'Vanguard S&P 500', 'stock', 45, 428.2, 426.0, 400.0, undefined, [424, 425, 426, 427, 427.5, 428, 428.2]),
  holding('6', 'GOOGL', 'Alphabet Inc.', 'stock', 65, 172.3, 172.8, 155.0, undefined, [171, 172, 172.8, 172.5, 172.2, 172.4, 172.3]),
];

/** For allocation pie: symbol and share of total value (percent) */
export function getAllocationBySymbol(holdingsList: Holding[]) {
  const total = holdingsList.reduce((s, h) => s + h.value, 0);
  if (total === 0) return [];
  return holdingsList.map((h) => ({
    symbol: h.symbol,
    value: h.value,
    percent: (h.value / total) * 100,
  }));
}

/** Today's top movers: sorted by today's % change descending */
export function getTopMovers(holdingsList: Holding[], limit = 10) {
  return [...holdingsList]
    .sort((a, b) => b.todayChangePercent - a.todayChangePercent)
    .slice(0, limit);
}

export const aiInsight = {
  title: 'Portfolio balance',
  summary:
    'Your allocation is slightly overweight in crypto (35.1%) relative to your stated risk tolerance. Consider rebalancing into broad-market ETFs when you hit your next contribution window.',
  confidence: 0.87,
};

/** Last updated timestamp for display (sample) */
export const lastUpdated = new Date().toISOString();
