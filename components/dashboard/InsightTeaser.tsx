'use client';

import Link from 'next/link';
import { GlassCard } from './GlassCard';
import { AllocationPieChart } from './AllocationPieChart';
import type { AllocationSegment } from './AllocationPieChart';
import { SparklesIcon, ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InsightTeaserProps {
  summary: string;
  href?: string;
  className?: string;
  /** When provided, allocation donut + legend is shown inside this section as part of the analysis */
  allocationData?: AllocationSegment[];
}

/**
 * Suggested-for-you insight on dashboard with optional allocation chart; link to full Insights page.
 */
export const InsightTeaser = ({
  summary,
  href = '/dashboard/ai',
  className,
  allocationData,
}: InsightTeaserProps) => (
  <GlassCard className={cn('group', className)}>
    <div className="flex items-center gap-2 text-primary-500">
      <SparklesIcon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="text-sm font-medium">Suggested for you</span>
    </div>
    <p className="mt-2 text-sm text-secondary-muted">
      {summary}
    </p>
    {allocationData && allocationData.length > 0 && (
      <div className="mt-4">
        <AllocationPieChart data={allocationData} embedded />
      </div>
    )}
    <div className="mt-4 flex justify-end">
      <Link
        href={href}
        className="flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-400"
      >
        Full analysis
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  </GlassCard>
);
