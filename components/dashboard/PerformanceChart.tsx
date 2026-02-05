'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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
  '5d': '5 Days',
  '1mo': '1 Month',
  '3mo': '3 Months',
  '1y': '1 Year',
};

/**
 * Portfolio performance area chart with range selector and optional hover glow.
 * PRD: area with gradient (green positive, red negative), value change $ and % in header.
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
        'lg:hover:shadow-chart-glow transition-shadow duration-200',
        className,
      )}
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
          <div className="flex flex-wrap gap-1 rounded-lg bg-white/5 p-1">
            {(Object.keys(RANGE_LABELS) as ChartRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRangeChange(r)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
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
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="performanceFillPositive"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--primary-main)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary-main)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id="performanceFillNegative"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(239 68 68)"
                  stopOpacity={0.3}
                />
                <stop offset="100%" stopColor="rgb(239 68 68)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
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
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? 'var(--primary-main)' : 'rgb(239 68 68)'}
              strokeWidth={2}
              fill={
                isPositive
                  ? 'url(#performanceFillPositive)'
                  : 'url(#performanceFillNegative)'
              }
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
