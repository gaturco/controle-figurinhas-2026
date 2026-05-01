'use client';

import { useState } from 'react';
import { Check, Plus, Minus, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Sticker {
  id: string;
  number: number | string;
  team: string;
  player_name: string;
  quantity: number;
}

interface Props {
  sticker: Sticker;
  onQuantityChange: (id: string, qty: number) => void;
}

function formatStickerNumber(value: Sticker['number']) {
  const raw = String(value).trim();
  const cleaned = raw.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');

  const spaced = cleaned.match(/^([a-z]{2,10})\s*0*(\d+)$/i);
  if (spaced) return `${spaced[1].toUpperCase()} ${Number(spaced[2])}`;

  const compact = raw.match(/^([a-z]{2,10})0*(\d+)$/i);
  if (compact) return `${compact[1].toUpperCase()} ${Number(compact[2])}`;

  return cleaned;
}

export default function StickerCard({ sticker, onQuantityChange }: Props) {
  const [qty, setQty] = useState(sticker.quantity);
  const [loading, setLoading] = useState(false);

  const send = async (action: string) => {
    setLoading(true);
    const res = await fetch('/api/stickers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stickerId: sticker.id, action }),
    });
    const data = await res.json();
    setQty(data.quantity);
    onQuantityChange(sticker.id, data.quantity);
    setLoading(false);
  };

  const handleCardClick = () => {
    if (loading) return;
    if (qty === 0) send('collect');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) send('increment');
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!loading) send('decrement');
  };

  const repeats = qty - 1;

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'relative rounded-xl border p-3 cursor-pointer transition-all select-none min-h-[100px]',
        'hover:shadow-md hover:-translate-y-0.5',
        loading && 'opacity-50 pointer-events-none',
        qty >= 1 && 'bg-primary text-primary-foreground border-primary',
        qty === 0 && 'bg-muted/50 border-border/80 hover:bg-muted',
      )}
    >
      {qty >= 1 && (
        <button
          onClick={handleIncrement}
          className="absolute top-1 right-1 z-10 h-8 w-8 flex items-center justify-center rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 active:bg-primary-foreground/40"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}

      {qty >= 1 && (
        <button
          onClick={handleDecrement}
          className="absolute bottom-1 right-1 z-10 h-8 w-8 flex items-center justify-center rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 active:bg-primary-foreground/40"
        >
          <Minus className="h-4 w-4" />
        </button>
      )}

      <p className={cn('text-xs font-mono mb-1', qty === 0 ? 'text-muted-foreground' : 'opacity-60')}>{formatStickerNumber(sticker.number)}</p>
      <p className={cn('font-semibold text-sm leading-snug pr-9', qty === 0 && 'text-foreground')}>{sticker.player_name}</p>
      <p className={cn('text-xs mt-0.5', qty === 0 ? 'text-muted-foreground' : 'opacity-50')}>{sticker.team}</p>

      {qty >= 1 && (
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 border-primary-foreground/30 text-primary-foreground"
          >
            <Check className="h-2.5 w-2.5 mr-0.5" /> Tenho
          </Badge>

          {repeats > 0 && (
            <Badge className="text-[10px] px-1.5 py-0 bg-yellow-500 text-black border-0">
              <Copy className="h-2.5 w-2.5 mr-0.5" /> {repeats} rep
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
