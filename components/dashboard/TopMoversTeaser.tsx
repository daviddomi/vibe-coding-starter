'use client';

import type { Holding } from '@/data/dashboard/portfolioSampleData';
import { GlassCard } from './GlassCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon, ChevronRightIcon } from 'lucide-react';

export interface TopMoversTeaserProps {
  holdings: Holding[];
  max?: number;
  viewAllHref?: string;
  className?: string;
}

/**
 * Compact “today’s movers” with top N and “View all” link.
 */
export const TopMoversTeaser = ({
  holdings,
  max = 5,
  viewAllHref = '/dashboard/holdings',
  className,
}: TopMoversTeaserProps) => {
  const list = holdings.slice(0, max);

  return (
    <GlassCard className={cn(className)}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-medium text-primary-foreground">
          Today&apos;s movers
        </h2>
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-400"
        >
          View all
          <ChevronRightIcon className="h-3 w-3" />
        </Link>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {list.map((h) => {
          const up = h.todayChangePercent >= 0;
          return (
            <li
              key={h.id}
              className="flex items-center justify-between gap-2 rounded-lg py-2 text-sm"
            >
              <span className="font-medium text-primary-foreground">
                {h.symbol}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 font-medium tabular-nums',
                  up ? 'text-primary-500' : 'text-red-500',
                )}
              >
                {up ? (
                  <TrendingUpIcon className="h-3 w-3" />
                ) : (
                  <TrendingDownIcon className="h-3 w-3" />
                )}
                {up ? '+' : ''}
                {h.todayChangePercent.toFixed(2)}%
              </span>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
