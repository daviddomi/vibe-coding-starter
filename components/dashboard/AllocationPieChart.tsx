'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';

export interface AllocationSegment {
  symbol: string;
  value: number;
  percent: number;
}

export interface AllocationPieChartProps {
  data: AllocationSegment[];
  className?: string;
  /** When true, render only chart + legend (no card, no title) for embedding in another section */
  embedded?: boolean;
}

/* Design brief palette only: vibrant mint (primary), muted periwinkle (secondary accent), slate (muted) */
const CHART_COLORS = [
  'var(--primary-main)',
  'var(--primary-light)',
  'var(--primary-dark)',
  'var(--secondary-accent)',
  'var(--secondary-main)',
  'var(--secondary-muted)',
];

/**
 * Portfolio allocation pie chart. PRD: segments by symbol, distinct colors, legend with symbol and %.
 */
export const AllocationPieChart = ({
  data,
  className,
  embedded = false,
}: AllocationPieChartProps) => {
  const chartBlock = (
    <div className={embedded ? 'h-44 w-full' : 'h-52 w-full'}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="percent"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            innerRadius="52%"
            outerRadius="78%"
            paddingAngle={2}
            isAnimationActive={true}
          >
            {data.map((_, index) => (
              <Cell
                key={data[index].symbol}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--primary-card))',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number, name: string, props: { payload: AllocationSegment }) => [
              `${value.toFixed(1)}% · $${props.payload.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
              name,
            ]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: '0.8125rem' }}
            formatter={(value) => {
              const segment = data.find((d) => d.symbol === value);
              return (
                <span className="text-primary-foreground">
                  {value}
                  <span className="ml-1.5 text-secondary-muted">
                    {segment ? `${segment.percent.toFixed(1)}%` : ''}
                  </span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (embedded) {
    return <div className={cn(className)}>{chartBlock}</div>;
  }

  return (
    <GlassCard className={cn(className)}>
      <h2 className="mb-3 text-base font-medium text-primary-foreground">
        Portfolio allocation
      </h2>
      {chartBlock}
    </GlassCard>
  );
};
