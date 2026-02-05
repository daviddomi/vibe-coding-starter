'use client';

import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';
import { SparklesIcon } from 'lucide-react';

export interface AIInsightCardProps {
  title: string;
  summary: string;
  confidence?: number;
  className?: string;
}

export const AIInsightCard = ({
  title,
  summary,
  confidence,
  className,
}: AIInsightCardProps) => (
  <GlassCard className={cn('flex flex-col gap-3', className)}>
    <div className="flex items-center gap-2">
      <SparklesIcon className="h-4 w-4 text-primary-500" aria-hidden />
      <h2 className="text-base font-medium text-primary-foreground">
        {title}
      </h2>
    </div>
    <p className="text-sm font-normal leading-relaxed text-secondary-muted">
      {summary}
    </p>
    {confidence != null && (
      <p className="text-xs text-secondary-muted">
        Confidence: {Math.round(confidence * 100)}%
      </p>
    )}
  </GlassCard>
);
