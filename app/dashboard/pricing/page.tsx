'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon, ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  pricingFrequencies,
  pricingTiers,
} from '@/data/config/pricingData';
import type { PricingTier, PricingTierFrequency } from '@/data/config/pricingDataInterface';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { Button } from '@/components/shared/ui/button';

export default function DashboardPricingPage() {
  const [frequency, setFrequency] = useState<PricingTierFrequency>(
    pricingFrequencies[0],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-400"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to dashboard
        </Link>
        <h1 className="text-xl font-semibold tracking-tight text-primary-foreground md:text-2xl">
          Pricing
        </h1>
        <p className="text-sm text-secondary-muted">
          Choose the plan that fits your portfolio tracking needs.
        </p>
      </div>

      {pricingFrequencies.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {pricingFrequencies.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFrequency(f)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                frequency.value === f.value
                  ? 'bg-primary-500/20 text-primary-500'
                  : 'bg-white/5 text-secondary-muted hover:bg-white/10 hover:text-primary-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          'grid gap-6',
          pricingTiers.length === 2 && 'md:grid-cols-2',
          pricingTiers.length === 3 && 'md:grid-cols-3',
        )}
      >
        {pricingTiers.map((tier) => (
          <PricingTierCard
            key={tier.id}
            tier={tier}
            frequency={frequency}
          />
        ))}
      </div>
    </div>
  );
}

function PricingTierCard({
  tier,
  frequency,
}: {
  tier: PricingTier;
  frequency: PricingTierFrequency;
}) {
  const price =
    typeof tier.price === 'string'
      ? tier.price
      : tier.price[frequency.value];
  const discountPrice =
    typeof tier.discountPrice === 'string'
      ? tier.discountPrice
      : tier.discountPrice[frequency.value];
  const suffix =
    typeof tier.price !== 'string' ? frequency.priceSuffix : '';

  return (
    <GlassCard
      className={cn(
        'flex flex-col',
        tier.highlighted && 'border-primary-500/30 bg-primary-500/5',
        tier.featured && 'border-secondary-500/30 bg-secondary-500/5',
      )}
    >
      <h2 className="text-lg font-semibold text-primary-foreground">
        {tier.name}
      </h2>
      <p className="mt-2 text-sm text-secondary-muted">{tier.description}</p>
      <div className="mt-4 flex items-baseline gap-2">
        {discountPrice ? (
          <span className="text-2xl font-bold tabular-nums text-secondary-muted line-through">
            {price}
          </span>
        ) : null}
        <span
          className={cn(
            'text-2xl font-bold tabular-nums md:text-3xl',
            tier.highlighted ? 'text-primary-500' : 'text-primary-foreground',
          )}
        >
          {discountPrice || price}
        </span>
        {suffix ? (
          <span className="text-sm font-medium text-secondary-muted">
            {suffix}
          </span>
        ) : null}
      </div>
      <Link
        href={tier.href}
        className="mt-6"
        aria-describedby={tier.id}
        onClick={(e) => tier.soldOut && e.preventDefault()}
      >
        <Button
          size="lg"
          disabled={tier.soldOut}
          variant={tier.highlighted ? 'default' : 'outline'}
          className={cn(
            'w-full border-white/10',
            tier.soldOut && 'opacity-60',
          )}
        >
          {tier.soldOut ? 'Coming soon' : tier.cta}
        </Button>
      </Link>
      <ul className="mt-6 flex flex-col gap-2 text-sm text-secondary-muted">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckIcon
              className={cn(
                'h-5 w-5 shrink-0 mt-0.5',
                tier.highlighted ? 'text-primary-500' : 'text-secondary-muted',
              )}
              aria-hidden
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
