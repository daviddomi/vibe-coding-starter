'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import {
  performanceHistoryByRange,
  defaultChartRange,
  holdings,
  aiInsight,
  getAllocationBySymbol,
  lastUpdated,
} from '@/data/dashboard/portfolioSampleData';
import {
  watchlistItems,
  type WatchlistItem,
} from '@/data/dashboard/watchlistSampleData';
import type { ChartRange } from '@/data/dashboard/portfolioSampleData';
import {
  PortfolioHero,
  MetricStrip,
  PerformanceChart,
  HoldingsPanel,
  InsightTeaser,
  WatchlistSection,
  AddHoldingDialog,
  AddWatchlistSymbolDialog,
  PremiumUpsell,
} from '@/components/dashboard';
import type { Holding } from '@/data/dashboard/portfolioSampleData';
import {
  fetchQuoteFromAPI,
  fetchCandleFromAPI,
  fetchProfileFromAPI,
} from '@/lib/finnhub-client';

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

function formatLastUpdated(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [holdingsList, setHoldingsList] = useState<Holding[]>(holdings);
  const [holdingsLiveData, setHoldingsLiveData] = useState<
    Record<string, { price: number; previousClose: number; todayChangePercent: number }>
  >({});
  const [addHoldingOpen, setAddHoldingOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
  const [watchlistList, setWatchlistList] = useState<WatchlistItem[]>(watchlistItems);
  const [watchlistLiveData, setWatchlistLiveData] = useState<
    Record<string, Pick<WatchlistItem, 'price' | 'previousClose' | 'dayChangePercent' | 'sparklineData'>>
  >({});
  const [addWatchlistOpen, setAddWatchlistOpen] = useState(false);
  const [holdingsExpanded, setHoldingsExpanded] = useState(false);
  const [chartRange, setChartRange] = useState<ChartRange>(defaultChartRange);
  const chartData = performanceHistoryByRange[chartRange];

  // Merge live quote data into holdings (price, value, G/L, today change)
  const holdingsWithLive = useMemo(() => {
    return holdingsList.map((h) => {
      const live = holdingsLiveData[h.symbol];
      if (!live) return h;
      const price = live.price;
      const previousClose = live.previousClose;
      const value = h.quantity * price;
      const totalCost = h.quantity * h.averageCost;
      const gainLossAmount = value - totalCost;
      const gainLossPercent = totalCost ? (gainLossAmount / totalCost) * 100 : 0;
      const todayChangeAmount = h.quantity * (price - previousClose);
      return {
        ...h,
        price,
        previousClose,
        value,
        gainLossAmount,
        gainLossPercent,
        todayChangePercent: live.todayChangePercent,
        todayChangeAmount,
      };
    });
  }, [holdingsList, holdingsLiveData]);

  // Portfolio summary derived from holdings (live when quotes available)
  const portfolioSummaryLive = useMemo(() => {
    const totalValue = holdingsWithLive.reduce((s, h) => s + h.value, 0);
    const totalCost = holdingsWithLive.reduce((s, h) => s + h.totalCost, 0);
    const totalGainLossAmount = totalValue - totalCost;
    const totalGainLossPercent = totalCost ? (totalGainLossAmount / totalCost) * 100 : 0;
    const todayGainLossAmount = holdingsWithLive.reduce((s, h) => s + h.todayChangeAmount, 0);
    const prevValue = holdingsWithLive.reduce((s, h) => s + h.quantity * h.previousClose, 0);
    const todayGainLossPercent = prevValue ? (todayGainLossAmount / prevValue) * 100 : 0;
    return {
      totalValue,
      totalCost,
      totalGainLossAmount,
      totalGainLossPercent,
      todayGainLossAmount,
      todayGainLossPercent: todayGainLossPercent,
    };
  }, [holdingsWithLive]);

  // Merge live quote/candle data into watchlist items for display
  const watchlistWithLive = useMemo(
    () =>
      watchlistList.map((item) => {
        const live = watchlistLiveData[item.symbol];
        if (!live) return item;
        return { ...item, ...live };
      }),
    [watchlistList, watchlistLiveData],
  );

  const watchlistSymbolsKey = useMemo(
    () => watchlistList.map((w) => w.symbol).sort().join(','),
    [watchlistList],
  );

  const allocationData = useMemo(
    () => getAllocationBySymbol(holdingsWithLive),
    [holdingsWithLive],
  );

  // Fetch live quotes for holdings symbols (when Finnhub key is set)
  const holdingsSymbolsKey = useMemo(
    () => holdingsList.map((h) => h.symbol).sort().join(','),
    [holdingsList],
  );
  useEffect(() => {
    const symbols = [...new Set(holdingsList.map((h) => h.symbol))];
    let cancelled = false;
    const run = async () => {
      const next: typeof holdingsLiveData = {};
      for (const symbol of symbols) {
        if (cancelled) return;
        try {
          const quote = await fetchQuoteFromAPI(symbol);
          if (cancelled) return;
          if (quote) {
            next[symbol] = {
              price: quote.c,
              previousClose: quote.pc,
              todayChangePercent: quote.dp,
            };
          }
        } catch {
          // Keep existing/sample data for this symbol
        }
      }
      if (!cancelled) setHoldingsLiveData((prev) => ({ ...prev, ...next }));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [holdingsSymbolsKey]);

  const handleDeleteHolding = (holding: Holding) => {
    setHoldingsList((prev) => prev.filter((h) => h.id !== holding.id));
  };

  const handleEditHolding = (holding: Holding) => {
    setEditingHolding(holding);
    setAddHoldingOpen(true);
  };

  const handleAddHolding = (
    data: {
      symbol: string;
      assetType: Holding['type'];
      quantity: string;
      averageCost: string;
      platform?: string;
    },
    options?: { editId: string },
  ) => {
    const q = parseFloat(data.quantity);
    const ac = parseFloat(data.averageCost);
    const price = ac;
    const prevClose = ac * 0.99;
    if (options?.editId) {
      setHoldingsList((prev) =>
        prev.map((h) =>
          h.id === options.editId
            ? {
                ...h,
                symbol: data.symbol,
                name: data.symbol,
                type: data.assetType,
                quantity: q,
                price,
                previousClose: prevClose,
                averageCost: ac,
                value: q * price,
                totalCost: q * ac,
                gainLossAmount: q * price - q * ac,
                gainLossPercent: ac ? ((q * price - q * ac) / (q * ac)) * 100 : 0,
                todayChangePercent: prevClose ? ((price - prevClose) / prevClose) * 100 : 0,
                todayChangeAmount: q * (price - prevClose),
                platform: data.platform,
              }
            : h,
        ),
      );
      setEditingHolding(null);
    } else {
      const newHolding: Holding = {
        id: String(Date.now()),
        symbol: data.symbol,
        name: data.symbol,
        type: data.assetType,
        quantity: q,
        price,
        previousClose: prevClose,
        averageCost: ac,
        value: q * price,
        totalCost: q * ac,
        gainLossAmount: 0,
        gainLossPercent: 0,
        todayChangePercent: 0,
        todayChangeAmount: 0,
        platform: data.platform,
      };
      setHoldingsList((prev) => [...prev, newHolding]);
    }
    setAddHoldingOpen(false);
  };

  // Fetch live quote + candle for watchlist symbols (when Finnhub key is set)
  useEffect(() => {
    const symbols = [...new Set(watchlistList.map((w) => w.symbol))];
    let cancelled = false;
    const run = async () => {
      const next: typeof watchlistLiveData = {};
      for (const symbol of symbols) {
        if (cancelled) return;
        try {
          const [quote, candle] = await Promise.all([
            fetchQuoteFromAPI(symbol),
            fetchCandleFromAPI(
              symbol,
              Math.floor(Date.now() / 1000) - 7 * 24 * 3600,
              Math.floor(Date.now() / 1000),
            ),
          ]);
          if (cancelled) return;
          if (quote) {
            next[symbol] = {
              price: quote.c,
              previousClose: quote.pc,
              dayChangePercent: quote.dp,
              sparklineData:
                candle && candle.length >= 2 ? candle : undefined,
            };
          }
        } catch {
          // No live data for this symbol; keep sample/placeholder
        }
      }
      if (!cancelled) setWatchlistLiveData((prev) => ({ ...prev, ...next }));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [watchlistSymbolsKey]);

  const handleAddWatchlistSymbol = useCallback(
    async (symbol: string, name?: string) => {
      const trimmed = symbol.trim().toUpperCase();
      const exists = watchlistList.some(
        (w) => w.symbol.toUpperCase() === trimmed,
      );
      if (exists) return;

      let displayName = name?.trim() ?? trimmed;
      let price = 100;
      let previousClose = 99;
      let dayChangePercent = ((price - previousClose) / previousClose) * 100;
      let sparklineData: number[] | undefined = [98, 99, 99.5, 100];

      try {
        const [profile, quote, candle] = await Promise.all([
          fetchProfileFromAPI(trimmed),
          fetchQuoteFromAPI(trimmed),
          fetchCandleFromAPI(
            trimmed,
            Math.floor(Date.now() / 1000) - 7 * 24 * 3600,
            Math.floor(Date.now() / 1000),
          ),
        ]);
        if (profile?.name) displayName = profile.name;
        if (quote) {
          price = quote.c;
          previousClose = quote.pc;
          dayChangePercent = quote.dp;
        }
        if (candle && candle.length >= 2) sparklineData = candle;
      } catch {
        // Use placeholder values
      }

      const newItem: WatchlistItem = {
        id: `w-${Date.now()}`,
        symbol: trimmed,
        name: displayName,
        price,
        previousClose,
        dayChangePercent,
        sparklineData,
      };
      setWatchlistList((prev) => [...prev, newItem]);
    },
    [watchlistList],
  );

  useEffect(() => setMounted(true), []);

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
      value: formatCurrency(portfolioSummaryLive.totalCost),
    },
    {
      label: 'Total return',
      value: formatCurrency(portfolioSummaryLive.totalGainLossAmount),
      sub: formatPercent(portfolioSummaryLive.totalGainLossPercent, true),
    },
  ];

  if (holdingsList.length === 0) {
    return (
      <>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
          <p className="text-lg font-medium text-primary-foreground">
            No holdings yet
          </p>
          <p className="max-w-sm text-sm text-secondary-muted">
            Add your first holding to see your portfolio value, performance, and
            insights here.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingHolding(null);
              setAddHoldingOpen(true);
            }}
            className="rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600"
          >
            Add your first holding
          </button>
        </div>
        <AddHoldingDialog
          open={addHoldingOpen}
          onOpenChange={(open) => {
            setAddHoldingOpen(open);
            if (!open) setEditingHolding(null);
          }}
          editHolding={null}
          onSubmit={handleAddHolding}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-primary-foreground md:text-2xl">
            Portfolio Dashboard
          </h1>
          <p className="text-xs text-secondary-muted">
            Last updated {mounted ? formatLastUpdated(lastUpdated) : '—'}
          </p>
        </div>
        <button
          type="button"
          className="flex h-9 shrink-0 items-center gap-2 self-start rounded-lg bg-white/5 px-3 text-sm font-medium text-primary-foreground hover:bg-white/10"
          aria-label="Refresh data"
        >
          <RefreshCwIcon className="h-4 w-4" />
          Refresh
        </button>
      </header>
      <div className="flex flex-col gap-6">
        <PortfolioHero
          totalValue={formatCurrency(portfolioSummaryLive.totalValue)}
          todayAmount={portfolioSummaryLive.todayGainLossAmount}
          todayPercent={portfolioSummaryLive.todayGainLossPercent}
        />
        <MetricStrip items={metricItems} />

        {/* Holdings: full width under portfolio value */}
        <HoldingsPanel
            holdings={holdingsWithLive}
            expanded={holdingsExpanded}
            onExpandToggle={() => setHoldingsExpanded((v) => !v)}
            onAddClick={() => {
              setEditingHolding(null);
              setAddHoldingOpen(true);
            }}
            onEdit={handleEditHolding}
            onDelete={handleDeleteHolding}
          />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-6">
          {/* Row 1: Portfolio value chart | Watchlist (same height when side by side) */}
          <section className="flex min-h-[19rem] flex-col lg:col-span-7 xl:col-span-8">
            <PerformanceChart
              data={chartData}
              valueChangeAmount={chartValueChange}
              valueChangePercent={chartValueChangePercent}
              range={chartRange}
              onRangeChange={setChartRange}
              className="flex min-h-0 flex-1 flex-col"
            />
          </section>
          <aside className="flex min-h-[19rem] flex-col lg:col-span-5 xl:col-span-4">
            <section
              id="watchlist"
              className="scroll-mt-6 flex min-h-0 flex-1 flex-col"
            >
              <WatchlistSection
              items={watchlistWithLive}
              onAddClick={() => setAddWatchlistOpen(true)}
            />
            </section>
          </aside>
          {/* Row 2: Suggested for you | Premium upsell */}
          <div className="lg:col-span-7 xl:col-span-8">
            <InsightTeaser
              summary={aiInsight.summary}
              href="/dashboard/ai"
              allocationData={allocationData}
            />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <PremiumUpsell />
          </div>
        </div>
      </div>

      <AddHoldingDialog
        open={addHoldingOpen}
        onOpenChange={(open) => {
          setAddHoldingOpen(open);
          if (!open) setEditingHolding(null);
        }}
        editHolding={editingHolding}
        onSubmit={handleAddHolding}
      />
      <AddWatchlistSymbolDialog
        open={addWatchlistOpen}
        onOpenChange={setAddWatchlistOpen}
        onSubmit={handleAddWatchlistSymbol}
      />
    </div>
  );
}
