'use client';

import Link from 'next/link';
import { GlassCard } from './GlassCard';
import { CrownIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PremiumUpsellProps {
  className?: string;
  /** CTA link (e.g. /pricing or /dashboard/upgrade) */
  href?: string;
}

/**
 * Premium upsell module: short CTA next to Suggested for you.
 */
export const PremiumUpsell = ({
  className,
  href = '/dashboard/pricing',
}: PremiumUpsellProps) => (
  <GlassCard
    className={cn(
      'flex h-full min-h-0 flex-col border-secondary-500/40 bg-secondary-500/15',
      'bg-gradient-to-br from-secondary-500/20 to-transparent',
      'shadow-sm shadow-secondary-500/5',
      className,
    )}
  >
    <div className="flex items-center gap-2 text-secondary-400">
      <CrownIcon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="text-sm font-medium">Premium</span>
    </div>
    <p className="mt-2 flex-1 text-sm text-secondary-muted">
      Get deeper analysis, alerts, and tax-loss harvesting ideas with StockTrac
      Pro.
    </p>
    <Link
      href={href}
      className="mt-4 flex shrink-0 items-center gap-1 text-sm font-medium text-secondary-400 hover:text-secondary-300"
    >
      Upgrade
      <ArrowRightIcon className="h-4 w-4" />
    </Link>
  </GlassCard>
);
