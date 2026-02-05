'use client';

import type { Holding } from '@/data/dashboard/portfolioSampleData';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  LineChartIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';

export interface HoldingCardProps {
  holding: Holding;
  onChart?: (holding: Holding) => void;
  onEdit?: (holding: Holding) => void;
  onDelete?: (holding: Holding) => void;
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
 * Single holding card: symbol, type badge, price, quantity, cost, value, gain/loss, today's change, actions.
 * PRD: orange "₿ Crypto" badge for crypto; green/red borders for gain/loss.
 */
export const HoldingCard = ({
  holding,
  onChart,
  onEdit,
  onDelete,
  className,
}: HoldingCardProps) => {
  const isGain = holding.gainLossPercent >= 0;
  const isTodayUp = holding.todayChangePercent >= 0;

  return (
    <GlassCard
      className={cn(
        'border-l-4',
        isGain ? 'border-l-primary-500' : 'border-l-red-500',
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-primary-foreground">
              {holding.symbol}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                holding.type === 'crypto'
                  ? 'bg-secondary-500/20 text-secondary-400'
                  : 'bg-primary-500/20 text-primary-400',
              )}
            >
              {holding.type === 'crypto' ? '₿ Crypto' : 'Stock'}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-secondary-muted">{holding.name}</p>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
            <div>
              <span className="text-secondary-muted">Price</span>
              <p className="font-semibold text-primary-foreground">
                {formatCurrency(holding.price)}
              </p>
            </div>
            <div>
              <span className="text-secondary-muted">Qty</span>
              <p className="font-semibold text-primary-foreground">
                {holding.quantity}
              </p>
            </div>
            <div>
              <span className="text-secondary-muted">Avg cost</span>
              <p className="font-semibold text-primary-foreground">
                {formatCurrency(holding.averageCost)}
              </p>
            </div>
            <div>
              <span className="text-secondary-muted">Value</span>
              <p className="font-semibold text-primary-foreground">
                {formatCurrency(holding.value)}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-4">
            <span
              className={cn(
                'inline-flex items-center gap-1 font-medium',
                isGain ? 'text-primary-500' : 'text-red-500 dark:text-red-400',
              )}
            >
              {isGain ? (
                <TrendingUpIcon className="h-3.5 w-3.5" />
              ) : (
                <TrendingDownIcon className="h-3.5 w-3.5" />
              )}
              Total {isGain ? '+' : ''}
              {formatCurrency(holding.gainLossAmount)} (
              {holding.gainLossPercent >= 0 ? '+' : ''}
              {holding.gainLossPercent.toFixed(2)}%)
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 text-sm',
                isTodayUp ? 'text-primary-500' : 'text-red-500 dark:text-red-400',
              )}
            >
              Today {isTodayUp ? '+' : ''}
              {holding.todayChangePercent.toFixed(2)}% (
              {holding.todayChangeAmount >= 0 ? '+' : ''}
              {formatCurrency(holding.todayChangeAmount)})
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          {onChart && (
            <button
              type="button"
              onClick={() => onChart(holding)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-primary-foreground hover:bg-white/5"
              aria-label="View chart"
            >
              <LineChartIcon className="h-4 w-4" />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(holding)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-primary-foreground hover:bg-white/5"
              aria-label="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(holding)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-red-500 hover:bg-red-500/10 dark:text-red-400"
              aria-label="Delete"
            >
              <Trash2Icon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
