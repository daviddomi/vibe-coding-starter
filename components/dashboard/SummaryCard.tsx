'use client';

import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface SummaryCardProps {
  label: string;
  value: string;
  delta?: string;
  trending?: 'up' | 'down';
  className?: string;
}

/**
 * Dashboard summary metric: label (regular), value (semibold), optional delta.
 */
export const SummaryCard = ({
  label,
  value,
  delta,
  trending,
  className,
}: SummaryCardProps) => (
  <GlassCard className={cn('flex flex-col gap-1', className)}>
    <span className="text-sm font-normal text-secondary-muted">{label}</span>
    <span className="text-xl font-semibold text-primary-foreground">
      {value}
    </span>
    {delta != null && (
      <span
        className={cn(
          'inline-flex items-center gap-1 text-xs font-medium',
          trending === 'up' && 'text-primary-500',
          trending === 'down' && 'text-red-500 dark:text-red-400',
        )}
      >
        {trending === 'up' && <TrendingUpIcon className="h-3 w-3" />}
        {trending === 'down' && <TrendingDownIcon className="h-3 w-3" />}
        {delta}
      </span>
    )}
  </GlassCard>
);
