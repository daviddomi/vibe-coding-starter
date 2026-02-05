'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import type { ChartRange } from '@/data/dashboard/portfolioSampleData';

export interface PerformanceChartProps {
  data: { date: string; value: number }[];
  valueChangeAmount?: number;
  valueChangePercent?: number;
  range: ChartRange;
  onRangeChange?: (range: ChartRange) => void;
  className?: string;
}

const RANGE_LABELS: Record<ChartRange, string> = {
  '5d': '5D',
  '1mo': '1M',
  '3mo': '3M',
  '1y': '1Y',
};

/**
 * Portfolio value line chart: sharp/granular line, dashed grid, professional look.
 */
export const PerformanceChart = ({
  data,
  valueChangeAmount = 0,
  valueChangePercent = 0,
  range,
  onRangeChange,
  className,
}: PerformanceChartProps) => {
  const minVal = data.length
    ? Math.min(...data.map((d) => d.value)) - 1000
    : 0;
  const maxVal = data.length
    ? Math.max(...data.map((d) => d.value)) + 1000
    : 1000;
  const isPositive = valueChangePercent >= 0;

  return (
    <GlassCard
      className={cn(
        'flex min-h-0 flex-col transition-shadow duration-200 lg:hover:shadow-chart-glow',
        className,
      )}
    >
      <div className="mb-3 flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-primary-foreground">
            Portfolio value
          </h2>
          <p
            className={cn(
              'text-sm font-semibold',
              isPositive ? 'text-primary-500' : 'text-red-500 dark:text-red-400',
            )}
          >
            {valueChangeAmount >= 0 ? '+' : ''}$
            {Math.abs(valueChangeAmount).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}{' '}
            ({valueChangePercent >= 0 ? '+' : ''}
            {valueChangePercent.toFixed(2)}%)
          </p>
        </div>
        {onRangeChange && (
          <div className="flex flex-wrap gap-0.5 rounded-lg bg-white/5 p-0.5">
            {(Object.keys(RANGE_LABELS) as ChartRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRangeChange(r)}
                className={cn(
                  'rounded px-2.5 py-1.5 text-xs font-medium transition-colors',
                  range === r
                    ? 'bg-primary-500/20 text-primary-500'
                    : 'text-secondary-muted hover:bg-white/5 hover:text-primary-foreground',
                )}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-secondary-muted"
            />
            <YAxis hide domain={[minVal, maxVal]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--primary-card))',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'inherit' }}
              formatter={(value: number) => [
                `$${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
                'Value',
              ]}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={isPositive ? 'var(--primary-main)' : 'rgb(239 68 68)'}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
