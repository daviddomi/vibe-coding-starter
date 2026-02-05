'use client';

import type { Holding } from '@/data/dashboard/portfolioSampleData';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

export interface HoldingsTableProps {
  holdings: Holding[];
  className?: string;
}

const typeLabels: Record<Holding['type'], string> = {
  stock: 'Stock',
  crypto: 'Crypto',
};

function allocationPercent(holding: Holding, totalValue: number) {
  return totalValue ? (holding.value / totalValue) * 100 : 0;
}

export const HoldingsTable = ({ holdings, className }: HoldingsTableProps) => {
  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  return (
    <GlassCard className={cn('overflow-hidden', className)}>
      <h2 className="mb-4 text-base font-medium text-primary-foreground">
        Holdings
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left font-normal text-secondary-muted">
              <th className="pb-3 pr-4">Asset</th>
              <th className="pb-3 pr-4 text-right">Value</th>
              <th className="pb-3 pr-4 text-right">Day</th>
              <th className="hidden pb-3 text-right md:table-cell">Allocation</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr
                key={h.id}
                className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
              >
                <td className="py-3 pr-4">
                  <div className="font-semibold text-primary-foreground">
                    {h.symbol}
                  </div>
                  <div className="text-xs text-secondary-muted">
                    {h.name} · {typeLabels[h.type]}
                  </div>
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-primary-foreground">
                  $
                  {h.value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td
                  className={cn(
                    'py-3 pr-4 text-right font-medium',
                    h.todayChangePercent >= 0
                      ? 'text-primary-500'
                      : 'text-red-500 dark:text-red-400',
                  )}
                >
                  <span className="inline-flex items-center gap-0.5">
                    {h.todayChangePercent >= 0 ? (
                      <TrendingUpIcon className="h-3 w-3" />
                    ) : (
                      <TrendingDownIcon className="h-3 w-3" />
                    )}
                    {h.todayChangePercent >= 0 ? '+' : ''}
                    {h.todayChangePercent.toFixed(2)}%
                  </span>
                </td>
                <td className="hidden py-3 text-right text-secondary-muted md:table-cell">
                  {allocationPercent(h, totalValue).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
