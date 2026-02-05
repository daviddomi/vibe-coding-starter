'use client';

import Link from 'next/link';
import { GlassCard } from './GlassCard';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InsightTeaserProps {
  summary: string;
  href?: string;
  className?: string;
}

/**
 * Short AI insight on dashboard with link to full Insights page.
 */
export const InsightTeaser = ({
  summary,
  href = '/dashboard/ai',
  className,
}: InsightTeaserProps) => (
  <GlassCard
    className={cn(
      'group border-primary-500/20 bg-primary-500/5',
      className,
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-primary-500">
          <SparklesIcon className="h-4 w-4 shrink-0" aria-hidden />
          <span className="text-sm font-medium">Suggested for you</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-secondary-muted">
          {summary}
        </p>
      </div>
      <Link
        href={href}
        className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-400"
      >
        Full analysis
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  </GlassCard>
);
