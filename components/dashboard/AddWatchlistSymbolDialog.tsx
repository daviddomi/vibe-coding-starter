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

export interface AddWatchlistSymbolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (symbol: string, name?: string) => void;
}

export const AddWatchlistSymbolDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AddWatchlistSymbolDialogProps) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;
    onSubmit?.(trimmed, name.trim() || undefined);
    onOpenChange(false);
    setSymbol('');
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark border-white/10 bg-primary-card text-primary-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary-foreground">
            Add to watchlist
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="watchlist-symbol">Symbol</Label>
            <Input
              id="watchlist-symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. AAPL, NVDA"
              className="border-white/10 bg-white/5 text-primary-foreground placeholder:text-secondary-muted"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="watchlist-name">Name (optional)</Label>
            <Input
              id="watchlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apple Inc."
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
              Add symbol
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
