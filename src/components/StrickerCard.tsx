'use client';

import { useState } from 'react';
import { Star, Check, RefreshCw } from 'lucide-react';

type Status = 'collected' | 'repeated' | 'missing';

interface Sticker {
  id: string;
  number: number;
  code: string;
  team: string;
  player_name: string;
  is_special: boolean;
  status: Status;
}

export default function StickerCard({ sticker }: { sticker: Sticker }) {
  const [status, setStatus] = useState<Status>(sticker.status);
  const [loading, setLoading] = useState(false);

  const toggle = async (action: 'collected' | 'repeated' | 'remove') => {
    setLoading(true);
    const res = await fetch('/api/stickers/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stickerId: sticker.id, action }),
    });
    const data = await res.json();
    setStatus(data.status);
    setLoading(false);
  };

  const handleCardClick = () => {
    if (loading) return;
    if (status === 'missing') toggle('collected');
    else toggle('remove');
  };

  const handleRepeatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    if (status === 'repeated') toggle('collected');
    else toggle('repeated');
  };

  const cardStyle = {
    missing: 'bg-white border-gray-200 opacity-60',
    collected: 'bg-[#0a1628] border-[#0a1628] text-white',
    repeated: 'bg-[#c9a84c] border-[#c9a84c] text-white',
  }[status];

  return (
    <div
      onClick={handleCardClick}
      className={`relative border-2 rounded-xl p-3 cursor-pointer transition-all select-none ${cardStyle} ${loading ? 'opacity-50' : 'hover:scale-105'}`}
    >
      {sticker.is_special && (
        <Star size={12} className="absolute top-2 right-2 text-[#c9a84c] fill-current" style={{ color: status === 'collected' ? '#c9a84c' : '#0a1628' }} />
      )}

      <div className="text-xs font-mono opacity-70 mb-1">{sticker.code}</div>
      <div className="font-semibold text-sm leading-tight">{sticker.player_name}</div>
      <div className="text-xs opacity-60 mt-0.5">{sticker.team}</div>

      {status !== 'missing' && (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs opacity-80">
            {status === 'collected' ? <><Check size={11} /> Tenho</> : <><RefreshCw size={11} /> Repetida</>}
          </div>
          <button
            onClick={handleRepeatClick}
            className="text-xs underline opacity-70 hover:opacity-100"
          >
            {status === 'repeated' ? '−R' : '+R'}
          </button>
        </div>
      )}
    </div>
  );
}