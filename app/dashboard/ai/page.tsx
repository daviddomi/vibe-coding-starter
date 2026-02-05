'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/dashboard';
import { Button } from '@/components/shared/ui/button';
import { SparklesIcon, Loader2Icon } from 'lucide-react';
import { aiInsight } from '@/data/dashboard/portfolioSampleData';

export default function AIAnalysisPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSummary(null);
    await new Promise((r) => setTimeout(r, 1500));
    setSummary(aiInsight.summary);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight text-primary-foreground md:text-2xl">
        Insights
      </h1>
      <GlassCard className="overflow-hidden bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-primary-foreground">
              <SparklesIcon className="h-5 w-5 text-primary-500" />
              Portfolio insights
            </h2>
            <p className="mt-1 text-sm text-secondary-muted">
              Get a short analysis of your portfolio: diversification, risk, and simple next steps.
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="shrink-0 bg-primary-500 text-white hover:bg-primary-600"
          >
            {loading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <SparklesIcon className="mr-2 h-4 w-4" />
                Generate insights
              </>
            )}
          </Button>
        </div>
      </GlassCard>

      {summary && (
        <GlassCard className="border-primary-500/20">
          <h3 className="mb-3 text-base font-medium text-primary-foreground">
            Summary
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-secondary-muted">
            {summary}
          </p>
          <p className="mt-4 text-xs text-secondary-muted">
            Cached summary. Regenerate when your holdings change.
          </p>
        </GlassCard>
      )}

      {!summary && !loading && (
        <GlassCard className="py-12 text-center">
          <SparklesIcon className="mx-auto h-12 w-12 text-secondary-muted" />
          <p className="mt-4 text-sm text-secondary-muted">
            Generate insights to see a short analysis of your portfolio.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
