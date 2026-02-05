'use client';

import { cn } from '@/lib/utils';

export interface SparklineProps {
  data: number[];
  positive?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Tiny inline sparkline: line only, green (up) or red (down).
 */
export const Sparkline = ({
  data,
  positive = true,
  className,
  width = 64,
  height = 28,
}: SparklineProps) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const stepX = w / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = padding + i * stepX;
      const y = padding + h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  const stroke = positive ? 'var(--primary-main)' : 'rgb(239 68 68)';

  return (
    <svg
      className={cn('overflow-visible', className)}
      width={width}
      height={height}
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};
