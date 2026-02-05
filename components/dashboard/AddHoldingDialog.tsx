'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { cn } from '@/lib/utils';
import type { HoldingType } from '@/data/dashboard/portfolioSampleData';

export interface AddHoldingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    symbol: string;
    assetType: HoldingType;
    quantity: string;
    averageCost: string;
    platform?: string;
  }) => void;
}

const CRYPTO_CHIPS: { symbol: string; name: string }[] = [
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'SOL-USD', name: 'Solana' },
  { symbol: 'ADA-USD', name: 'Cardano' },
  { symbol: 'XRP-USD', name: 'Ripple' },
  { symbol: 'DOGE-USD', name: 'Dogecoin' },
];

export const AddHoldingDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AddHoldingDialogProps) => {
  const [assetType, setAssetType] = useState<HoldingType>('stock');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [averageCost, setAverageCost] = useState('');
  const [platform, setPlatform] = useState('');

  const handleChip = (s: string) => {
    setSymbol(s);
    setAssetType('crypto');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      symbol: symbol.trim().toUpperCase(),
      assetType,
      quantity: quantity.trim(),
      averageCost: averageCost.trim(),
      platform: platform.trim() || undefined,
    });
    onOpenChange(false);
    setSymbol('');
    setQuantity('');
    setAverageCost('');
    setPlatform('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark border-white/10 bg-primary-card text-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">
            Add holding
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label className="text-secondary-muted">Asset type</Label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setAssetType('stock')}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  assetType === 'stock'
                    ? 'border-primary-500 bg-primary-500/20 text-primary-500'
                    : 'border-white/10 text-secondary-muted hover:bg-white/5',
                )}
              >
                Stock (e.g. AAPL, GOOGL)
              </button>
              <button
                type="button"
                onClick={() => setAssetType('crypto')}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  assetType === 'crypto'
                    ? 'border-primary-500 bg-primary-500/20 text-primary-500'
                    : 'border-white/10 text-secondary-muted hover:bg-white/5',
                )}
              >
                Crypto (e.g. BTC-USD, ETH-USD)
              </button>
            </div>
          </div>

          {assetType === 'crypto' && (
            <div>
              <Label className="text-secondary-muted">Quick select</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {CRYPTO_CHIPS.map(({ symbol: s, name }) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChip(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-white/10"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder={assetType === 'stock' ? 'AAPL' : 'BTC-USD'}
              className="border-white/10 bg-white/5 text-primary-foreground placeholder:text-secondary-muted"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="border-white/10 bg-white/5 text-primary-foreground"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="averageCost">Average cost ($)</Label>
            <Input
              id="averageCost"
              type="number"
              min="0"
              step="any"
              value={averageCost}
              onChange={(e) => setAverageCost(e.target.value)}
              placeholder="0.00"
              className="border-white/10 bg-white/5 text-primary-foreground"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="platform">Platform (optional)</Label>
            <Input
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              placeholder="e.g. Coinbase, Fidelity"
              className="border-white/10 bg-white/5 text-primary-foreground placeholder:text-secondary-muted"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-primary-foreground hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-500 text-white hover:bg-primary-600">
              Add holding
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
