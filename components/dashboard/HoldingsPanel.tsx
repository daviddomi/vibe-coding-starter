'use client';

import { PlusIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import type { Holding } from '@/data/dashboard/portfolioSampleData';
import { cn } from '@/lib/utils';

const COLLAPSED_ROWS = 5;

export interface HoldingsPanelProps {
  holdings: Holding[];
  /** When false and holdings > COLLAPSED_ROWS, show first N rows and "View all" */
  expanded?: boolean;
  /** Called when user clicks "View all" or "Show less" */
  onExpandToggle?: () => void;
  className?: string;
  /** When set, shows an "Add holding" button in the header that calls this */
  onAddClick?: () => void;
  onEdit?: (holding: Holding) => void;
  onDelete?: (holding: Holding) => void;
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
 * Holdings table: all info on one row — symbol, shares, cost/share, price, value, total G/L, today G/L, actions.
 */
export const HoldingsPanel = ({
  holdings,
  expanded = false,
  onExpandToggle,
  className,
  onAddClick,
  onEdit,
  onDelete,
}: HoldingsPanelProps) => {
  const showExpandControl =
    onExpandToggle && holdings.length > COLLAPSED_ROWS;
  const visibleHoldings =
    expanded || holdings.length <= COLLAPSED_ROWS
      ? holdings
      : holdings.slice(0, COLLAPSED_ROWS);

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-white/10 bg-primary-card overflow-hidden',
        'bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-[12px] backdrop-saturate-[180%]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-primary-foreground">
          Holdings
        </h2>
        <div className="flex items-center gap-2">
          {onAddClick && (
            <button
              type="button"
              onClick={onAddClick}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-500 hover:bg-white/10 hover:text-primary-400"
              aria-label="Add holding"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          )}
          {showExpandControl && (
            <button
              type="button"
              onClick={onExpandToggle}
              className="text-xs font-medium text-primary-500 hover:text-primary-400"
            >
              {expanded ? 'Show less' : 'View all'}
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto min-h-[12rem]">
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="sticky top-0 bg-primary-card/95 text-left text-secondary-muted">
            <tr>
              <th className="py-2 pl-4 pr-4 font-normal">Symbol</th>
              <th className="py-2 px-4 font-normal">Shares</th>
              <th className="py-2 px-4 font-normal">Cost / share</th>
              <th className="py-2 px-4 font-normal">Price</th>
              <th className="py-2 px-4 font-normal">Value</th>
              <th className="py-2 px-4 font-normal">Total</th>
              <th className="py-2 pl-4 pr-6 font-normal">Today</th>
              {(onEdit || onDelete) && (
                <th className="w-24 py-2 pl-6 pr-4 font-normal">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleHoldings.map((h) => {
            const hasGain = h.gainLossPercent >= 0;
            const hasTodayGain = h.todayChangePercent >= 0;
            return (
              <tr
                key={h.id}
                className="border-t border-white/5 transition-colors hover:bg-white/5"
              >
                <td className="py-2.5 pl-4 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-primary-foreground">
                      {h.symbol}
                    </span>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        h.type === 'crypto'
                          ? 'bg-secondary-500/20 text-secondary-400'
                          : 'bg-primary-500/20 text-primary-400',
                      )}
                    >
                      {h.type === 'crypto' ? 'Crypto' : 'Stock'}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-secondary-muted tabular-nums">
                  {h.quantity.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                </td>
                <td className="py-2.5 px-4 text-right text-secondary-muted tabular-nums">
                  {formatCurrency(h.averageCost)}
                </td>
                <td className="py-2.5 px-4 text-right font-medium text-primary-foreground tabular-nums">
                  {formatCurrency(h.price)}
                </td>
                <td className="py-2.5 px-4 text-right font-medium text-primary-foreground tabular-nums">
                  {formatCurrency(h.value)}
                </td>
                <td
                  className={cn(
                    'py-2.5 px-4 text-right text-xs font-medium tabular-nums',
                    hasGain ? 'text-primary-500' : 'text-red-500',
                  )}
                >
                  {hasGain ? '+' : ''}
                  {formatCurrency(h.gainLossAmount)} ({hasGain ? '+' : ''}
                  {h.gainLossPercent.toFixed(2)}%)
                </td>
                <td
                  className={cn(
                    'py-2.5 pl-4 pr-6 text-right text-xs font-medium tabular-nums',
                    hasTodayGain ? 'text-primary-500' : 'text-red-500',
                  )}
                >
                  {hasTodayGain ? '+' : ''}
                  {h.todayChangePercent.toFixed(2)}% ({hasTodayGain ? '+' : ''}
                  {formatCurrency(h.todayChangeAmount)})
                </td>
                {(onEdit || onDelete) && (
                  <td className="py-2.5 pl-6 pr-4">
                    <div className="flex justify-end gap-1">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(h)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 text-primary-foreground hover:bg-white/5"
                          aria-label="Edit"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(h)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 text-red-500 hover:bg-red-500/10"
                          aria-label="Delete"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
