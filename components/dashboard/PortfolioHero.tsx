'use client';

import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

export interface PortfolioHeroProps {
  totalValue: string;
  todayAmount: number;
  todayPercent: number;
  className?: string;
}

/**
 * Hero: one number that matters (portfolio value) + today’s move. Clear hierarchy.
 */
export const PortfolioHero = ({
  totalValue,
  todayAmount,
  todayPercent,
  className,
}: PortfolioHeroProps) => {
  const isUp = todayAmount >= 0;
  const todayLabel =
    todayAmount >= 0
      ? `Up ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(todayAmount)} today`
      : `Down ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(Math.abs(todayAmount))} today`;
  const percentStr = `${todayPercent >= 0 ? '+' : ''}${todayPercent.toFixed(2)}%`;

  return (
    <section className={cn('', className)}>
      <p className="text-sm font-normal text-secondary-muted">Portfolio value</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
        {totalValue}
      </p>
      <p
        className={cn(
          'mt-2 inline-flex items-center gap-1.5 text-sm font-medium',
          isUp ? 'text-primary-500' : 'text-red-500',
        )}
      >
        {isUp ? (
          <TrendingUpIcon className="h-4 w-4" aria-hidden />
        ) : (
          <TrendingDownIcon className="h-4 w-4" aria-hidden />
        )}
        {todayLabel}
        <span className="text-secondary-muted font-normal">({percentStr})</span>
      </p>
    </section>
  );
}
