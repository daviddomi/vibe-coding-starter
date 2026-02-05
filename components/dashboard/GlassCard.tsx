'use client';

import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * StockTrac widget container with glassmorphism: primary.card background,
 * 1px border with 10% opacity white for glass edge.
 */
export const GlassCard = ({ children, className, ...props }: GlassCardProps) => (
  <div
    className={cn(
      'rounded-xl border border-white/10 bg-primary-card p-6',
      'bg-gradient-to-br from-white/[0.05] to-transparent',
      'backdrop-blur-[12px] backdrop-saturate-[180%]',
      'text-primary-foreground',
      'transition-colors',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
