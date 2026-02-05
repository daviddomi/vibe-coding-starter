'use client';

import { cn } from '@/lib/utils';

export interface MetricItem {
  label: string;
  value: string;
  sub?: string;
}

export interface MetricStripProps {
  items: MetricItem[];
  className?: string;
}

/**
 * Compact inline metrics — no card per metric, less visual noise.
 */
export const MetricStrip = ({ items, className }: MetricStripProps) => (
  <div
    className={cn(
      'flex flex-wrap gap-x-6 gap-y-1 border-y border-white/10 py-3',
      className,
    )}
  >
    {items.map(({ label, value, sub }) => (
      <div key={label} className="flex flex-col gap-0">
        <span className="text-xs font-normal text-secondary-muted">{label}</span>
        <span className="text-base font-semibold text-primary-foreground">
          {value}
          {sub != null && (
            <span className="ml-1.5 text-sm font-normal text-secondary-muted">
              {sub}
            </span>
          )}
        </span>
      </div>
    ))}
  </div>
);
