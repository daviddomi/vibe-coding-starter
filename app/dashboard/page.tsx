'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  portfolioSummary,
  performanceHistoryByRange,
  defaultChartRange,
  holdings,
  aiInsight,
  getAllocationBySymbol,
  getTopMovers,
} from '@/data/dashboard/portfolioSampleData';
import type { ChartRange } from '@/data/dashboard/portfolioSampleData';
import {
  PortfolioHero,
  MetricStrip,
  PerformanceChart,
  AllocationPieChart,
  TopMoversTeaser,
  InsightTeaser,
} from '@/components/dashboard';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number, signed = false) {
  const prefix = signed && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export default function DashboardPage() {
  const [chartRange, setChartRange] = useState<ChartRange>(defaultChartRange);
  const chartData = performanceHistoryByRange[chartRange];
  const allocationData = useMemo(
    () => getAllocationBySymbol(holdings),
    [],
  );
  const topMovers = useMemo(() => getTopMovers(holdings, 10), []);

  const chartValueChange =
    chartData.length >= 2
      ? chartData[chartData.length - 1].value - chartData[0].value
      : 0;
  const chartValueChangePercent =
    chartData.length >= 2 && chartData[0].value
      ? (chartValueChange / chartData[0].value) * 100
      : 0;

  const metricItems = [
    {
      label: 'Total cost',
      value: formatCurrency(portfolioSummary.totalCost),
    },
    {
      label: 'Total return',
      value: formatCurrency(portfolioSummary.totalGainLossAmount),
      sub: formatPercent(portfolioSummary.totalGainLossPercent, true),
    },
  ];

  if (holdings.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <p className="text-lg font-medium text-primary-foreground">
          No holdings yet
        </p>
        <p className="max-w-sm text-sm text-secondary-muted">
          Add your first holding to see your portfolio value, performance, and
          insights here.
        </p>
        <Link
          href="/dashboard/holdings?add=1"
          className="rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Add your first holding
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Hero: one number that matters */}
      <PortfolioHero
        totalValue={formatCurrency(portfolioSummary.totalValue)}
        todayAmount={portfolioSummary.todayGainLossAmount}
        todayPercent={portfolioSummary.todayGainLossPercent}
      />

      {/* Supporting metrics in one strip — no card grid */}
      <MetricStrip items={metricItems} />

      {/* Main chart: full width, clear focus */}
      <section>
        <PerformanceChart
          data={chartData}
          valueChangeAmount={chartValueChange}
          valueChangePercent={chartValueChangePercent}
          range={chartRange}
          onRangeChange={setChartRange}
        />
      </section>

      {/* Allocation + Today's movers: one row, scannable */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <AllocationPieChart data={allocationData} />
        </div>
        <div className="lg:col-span-7">
          <TopMoversTeaser
            holdings={topMovers}
            max={5}
            viewAllHref="/dashboard/holdings"
          />
        </div>
      </section>

      {/* Single insight teaser → full analysis on Insights page */}
      <InsightTeaser summary={aiInsight.summary} href="/dashboard/ai" />
    </div>
  );
}
