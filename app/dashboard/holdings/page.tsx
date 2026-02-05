'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { holdings as initialHoldings } from '@/data/dashboard/portfolioSampleData';
import type { Holding } from '@/data/dashboard/portfolioSampleData';
import { HoldingCard, AddHoldingDialog } from '@/components/dashboard';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'stock' | 'crypto';

export default function HoldingsPage() {
  const searchParams = useSearchParams();
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (searchParams.get('add') === '1') setAddOpen(true);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (filter === 'all') return holdings;
    if (filter === 'stock') return holdings.filter((h) => h.type === 'stock');
    return holdings.filter((h) => h.type === 'crypto');
  }, [holdings, filter]);

  const handleAdd = (data: {
    symbol: string;
    assetType: Holding['type'];
    quantity: string;
    averageCost: string;
    platform?: string;
  }) => {
    const q = parseFloat(data.quantity);
    const ac = parseFloat(data.averageCost);
    const price = ac;
    const prevClose = ac * 0.99;
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
    setHoldings((prev) => [...prev, newHolding]);
    setAddOpen(false);
  };

  const handleDelete = (holding: Holding) => {
    setHoldings((prev) => prev.filter((h) => h.id !== holding.id));
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'stock', label: 'Stocks' },
    { key: 'crypto', label: 'Crypto' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                filter === key
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-secondary-muted hover:bg-white/10 hover:text-primary-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="shrink-0 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Add holding
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-primary-card py-16 text-center">
          <p className="text-primary-foreground">
            {filter === 'all'
              ? 'No holdings yet'
              : `No ${filter === 'stock' ? 'stocks' : 'crypto'} in your portfolio`}
          </p>
          <p className="max-w-sm text-sm text-secondary-muted">
            {filter === 'all'
              ? 'Add a stock or crypto holding to start tracking.'
              : `Switch to "All" or add a ${filter === 'stock' ? 'stock' : 'crypto'} holding.`}
          </p>
          {filter === 'all' && (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Add holding
            </button>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((h) => (
            <li key={h.id}>
              <HoldingCard
                holding={h}
                onEdit={() => {}}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      <AddHoldingDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />
    </div>
  );
}
