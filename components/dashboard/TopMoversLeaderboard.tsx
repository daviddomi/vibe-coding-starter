'use client';

import type { Holding } from '@/data/dashboard/portfolioSampleData';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

export interface TopMoversLeaderboardProps {
  holdings: Holding[];
  className?: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Today's top movers: ranked by daily % change. PRD: symbol, quantity, price, previous close, % and $ change (green/red).
 */
export const TopMoversLeaderboard = ({
  holdings,
  className,
}: TopMoversLeaderboardProps) => (
  <GlassCard className={cn(className)}>
    <h2 className="mb-4 text-base font-medium text-primary-foreground">
      Today&apos;s top movers
    </h2>
    <ul className="flex flex-col gap-2">
      {holdings.map((h, i) => {
        const isPositive = h.todayChangePercent >= 0;
        return (
          <li
            key={h.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-xs font-medium text-secondary-muted tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-primary-foreground">
                  {h.symbol}
                </div>
                <div className="text-xs text-secondary-muted">
                  {h.quantity} × {formatCurrency(h.price)} · Prev{' '}
                  {formatCurrency(h.previousClose)}
                </div>
              </div>
            </div>
            <div
              className={cn(
                'shrink-0 text-right font-semibold',
                isPositive ? 'text-primary-500' : 'text-red-500 dark:text-red-400',
              )}
            >
              <span className="inline-flex items-center gap-0.5">
                {isPositive ? (
                  <TrendingUpIcon className="h-3 w-3" />
                ) : (
                  <TrendingDownIcon className="h-3 w-3" />
                )}
                {h.todayChangePercent >= 0 ? '+' : ''}
                {h.todayChangePercent.toFixed(2)}%
              </span>
              <div className="text-xs font-normal opacity-90">
                {h.todayChangeAmount >= 0 ? '+' : ''}
                {formatCurrency(h.todayChangeAmount)}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </GlassCard>
);
