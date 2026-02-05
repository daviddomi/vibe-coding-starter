'use client';

import { GlassCard } from './GlassCard';
import { Sparkline } from './Sparkline';
import { PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WatchlistItem } from '@/data/dashboard/watchlistSampleData';

export interface WatchlistSectionProps {
  items: WatchlistItem[];
  onAddClick?: () => void;
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
 * Modular watchlist section: symbols with price, sparkline, day %.
 * Use h-full when placing next to portfolio chart so they align in height.
 */
export const WatchlistSection = ({
  items,
  onAddClick,
  className,
}: WatchlistSectionProps) => (
  <GlassCard className={cn('flex h-full min-h-0 flex-col', className)}>
    <div className="flex shrink-0 items-center justify-between gap-2">
      <h2 className="text-base font-medium text-primary-foreground">
        Watchlist
      </h2>
      <button
        type="button"
        onClick={onAddClick}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-primary-500 hover:bg-primary-500/10"
      >
        <PlusIcon className="h-3.5 w-3.5" />
        Add symbol
      </button>
    </div>
    <ul className="mt-3 flex min-h-0 flex-1 flex-col gap-0 overflow-y-auto max-h-[16rem] pr-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 border-t border-white/5 py-2.5 first:border-0"
        >
          <div className="min-w-0">
            <p className="font-medium text-primary-foreground">{item.symbol}</p>
            <p className="truncate text-xs text-secondary-muted">{item.name}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {item.sparklineData && item.sparklineData.length >= 2 ? (
              <Sparkline
                data={item.sparklineData}
                positive={item.dayChangePercent >= 0}
                width={48}
                height={22}
              />
            ) : null}
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-primary-foreground">
                {formatCurrency(item.price)}
              </p>
              <p
                className={cn(
                  'text-xs font-medium tabular-nums',
                  item.dayChangePercent >= 0 ? 'text-primary-500' : 'text-red-500',
                )}
              >
                {item.dayChangePercent >= 0 ? '+' : ''}
                {item.dayChangePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </GlassCard>
);
